/**
 * CoursePlayer.jsx
 * Full unit/lesson player for Windgap Academy courses.
 * Uses rich instructional content from courseContent.js when available,
 * and falls back to metadata-driven activities for all other courses.
 */
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useUser } from "../app/UserContext";
import { getUserDoc, setUserDoc } from "../app/firestoreClient";
import { useGamification } from "../contexts/GamificationContext";
import { getCourseContent } from "../services/courseContent";
import { getAllCurriculum, getCurriculumById } from "../services/curriculumService";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

const COURSE_PROGRESS_STORAGE_KEY = "windgap-course-progress-v2";

// ─────────────────────────────────────────────────────────────────
//  Small helpers
// ─────────────────────────────────────────────────────────────────
function titleCase(text) {
  return (text || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function lessonKey(unitId, lessonId) {
  return `${unitId}::${lessonId}`;
}
function unitQuizKey(unitId) {
  return `quiz::${unitId}`;
}

// ─────────────────────────────────────────────────────────────────
//  Activity renderers
// ─────────────────────────────────────────────────────────────────
function MCQActivity({ activity, value, onChange, submitted }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{activity.prompt}</p>
      {activity.options.map((opt, idx) => {
        const selected = value === idx;
        const correct = idx === activity.correct;
        return (
          <button
            key={`${idx}-${opt}`}
            onClick={() => !submitted && onChange(idx)}
            className={`w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
              submitted
                ? correct
                  ? "border-green-400 bg-green-50 font-medium"
                  : selected
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white opacity-60"
                : selected
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 bg-white hover:border-teal-300"
            }`}
          >
            {submitted && correct && <span className="mr-2 text-green-600">✓</span>}
            {submitted && selected && !correct && <span className="mr-2 text-red-500">✗</span>}
            {opt}
          </button>
        );
      })}
      {submitted && (
        <p className={`text-xs ${value === activity.correct ? "text-green-700" : "text-orange-700"}`}>
          {value === activity.correct
            ? "Correct! Well done."
            : `The correct answer is: "${activity.options[activity.correct]}".`}
        </p>
      )}
    </div>
  );
}

function OrderingActivity({ activity, value, onChange, submitted }) {
  const [order, setOrder] = useState(() => value?.order ?? activity.steps.map((_, i) => i));

  function move(from, dir) {
    if (submitted) return;
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    setOrder(next);
    onChange({ order: next });
  }

  const isCorrect = submitted && activity.correctOrder.every((val, i) => val === order[i]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{activity.prompt}</p>
      <div className="space-y-1">
        {order.map((stepIdx, pos) => (
          <div
            key={stepIdx}
            className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${
              submitted
                ? isCorrect
                  ? "border-green-300 bg-green-50"
                  : "border-orange-300 bg-orange-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <span className="w-5 text-center text-xs font-bold text-gray-400">{pos + 1}</span>
            <span className="flex-1">{activity.steps[stepIdx]}</span>
            {!submitted && (
              <div className="flex gap-1">
                <button onClick={() => move(pos, -1)} className="rounded px-1 py-0.5 text-xs hover:bg-gray-100" disabled={pos === 0}>▲</button>
                <button onClick={() => move(pos, 1)} className="rounded px-1 py-0.5 text-xs hover:bg-gray-100" disabled={pos === order.length - 1}>▼</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {submitted && (
        <p className={`text-xs ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
          {isCorrect ? "Perfect sequence!" : "Not quite — review the correct order."}
        </p>
      )}
    </div>
  );
}

function ChecklistActivity({ activity, value, onChange }) {
  const checked = value?.checked || {};
  const allDone = activity.items.every((item) => checked[item]);
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{activity.prompt}</p>
      {activity.items.map((item) => (
        <label
          key={item}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm ${checked[item] ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}
        >
          <input
            type="checkbox"
            checked={Boolean(checked[item])}
            onChange={(e) => onChange({ checked: { ...checked, [item]: e.target.checked } })}
          />
          <span>{item}</span>
        </label>
      ))}
      {allDone && (
        <p className="text-xs text-green-700 font-medium">All items checked — great work!</p>
      )}
    </div>
  );
}

function FillBlankActivity({ activity, value, onChange, submitted }) {
  const ans = value?.answer || "";
  const correct = submitted && ans.trim().toLowerCase() === activity.answer.toLowerCase();
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{activity.prompt}</p>
      <input
        value={ans}
        onChange={(e) => onChange({ answer: e.target.value })}
        readOnly={submitted}
        placeholder="Type your answer…"
        className={`w-full rounded-lg border px-3 py-2 text-sm ${
          submitted
            ? correct
              ? "border-green-400 bg-green-50"
              : "border-orange-300 bg-orange-50"
            : "border-gray-300"
        }`}
      />
      {submitted && (
        <p className={`text-xs ${correct ? "text-green-700" : "text-orange-700"}`}>
          {correct ? "Correct!" : `The expected answer was: "${activity.answer}".`}
        </p>
      )}
    </div>
  );
}

function ScenarioActivity({ activity, value, onChange, submitted }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800 mb-2">{activity.prompt}</p>
      {activity.options.map((opt, idx) => {
        const selected = value === idx;
        const correct = idx === activity.correct;
        return (
          <button
            key={`${idx}-${opt}`}
            onClick={() => !submitted && onChange(idx)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              submitted
                ? correct
                  ? "border-green-400 bg-green-50 font-medium"
                  : selected
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 opacity-60"
                : selected
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            {opt}
          </button>
        );
      })}
      {submitted && (
        <div
          className={`rounded-lg p-3 text-xs ${
            value === activity.correct ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"
          }`}
        >
          <p className="font-semibold mb-1">
            {value === activity.correct ? "Excellent decision!" : "Review needed."}
          </p>
          <p>{activity.rationale}</p>
        </div>
      )}
    </div>
  );
}

function ActivityWidget({ activity, value, onChange, submitted }) {
  if (!activity) return null;
  switch (activity.type) {
    case "mcq":
      return <MCQActivity activity={activity} value={value} onChange={onChange} submitted={submitted} />;
    case "ordering":
      return <OrderingActivity activity={activity} value={value} onChange={onChange} submitted={submitted} />;
    case "checklist":
      return <ChecklistActivity activity={activity} value={value} onChange={onChange} />;
    case "fill-blank":
      return <FillBlankActivity activity={activity} value={value} onChange={onChange} submitted={submitted} />;
    case "scenario":
      return <ScenarioActivity activity={activity} value={value} onChange={onChange} submitted={submitted} />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────
//  Lesson view
// ─────────────────────────────────────────────────────────────────
function LessonView({ lesson, savedState, onSave, onComplete, isCompleted, onNext, onPrev }) {
  const [actValue, setActValue] = useState(savedState?.actValue ?? null);
  const [actSubmitted, setActSubmitted] = useState(Boolean(savedState?.actSubmitted));

  function handleSubmit() {
    setActSubmitted(true);
    onSave({ actValue, actSubmitted: true });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {/* Introduction */}
      <div className="rounded-xl bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-100 p-5">
        <p className="text-base text-gray-800 leading-relaxed">{lesson.content.introduction}</p>
      </div>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📌 Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {lesson.content.keyPoints.map((pt) => (
              <li key={pt} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-0.5 text-teal-500 shrink-0">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📖 Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
            {lesson.content.explanation}
          </p>
        </CardContent>
      </Card>

      {/* Real-world example */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
          Real-world example
        </p>
        <p className="text-sm text-gray-800">{lesson.content.example}</p>
      </div>

      {/* Scaffold tip */}
      {lesson.content.tip && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-1">
            💡 Scaffold tip
          </p>
          <p className="text-sm text-gray-800">{lesson.content.tip}</p>
        </div>
      )}

      {/* Activity */}
      {lesson.activity && (
        <Card className="border-2 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-base">🎯 Practice Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActivityWidget
              activity={lesson.activity}
              value={actValue}
              onChange={(v) => {
                setActValue(v);
                onSave({ actValue: v, actSubmitted });
              }}
              submitted={actSubmitted}
            />
            {!actSubmitted && (
              <Button onClick={handleSubmit} disabled={actValue === null || actValue === undefined}>
                Check answer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation + complete */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button size="sm" variant="outline" onClick={onPrev}>← Previous lesson</Button>
        <Button
          variant={isCompleted ? "secondary" : "default"}
          onClick={() => { onComplete(); }}
        >
          {isCompleted ? "✓ Lesson completed — next →" : "Mark complete & continue (+10 XP)"}
        </Button>
        <Button size="sm" variant="outline" onClick={onNext}>Next lesson →</Button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Unit view — lesson list + unit quiz
// ─────────────────────────────────────────────────────────────────
function UnitView({ unit, completedKeys, onSelectLesson, onUnitQuizChange, unitQuizState }) {
  const totalLessons = unit.lessons.length;
  const doneLessons = unit.lessons.filter((l) => completedKeys[lessonKey(unit.id, l.id)]).length;
  const allLessonsDone = doneLessons === totalLessons;
  const quizSubmitted = Boolean(unitQuizState?.submitted);
  const quizAnswers = unitQuizState?.answers || {};

  const quizScore = unit.quiz
    ? unit.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0)
    : 0;
  const quizPass =
    unit.quiz && quizSubmitted && quizScore >= Math.ceil(unit.quiz.length * 0.7);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Unit summary */}
      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 p-5">
        <p className="text-sm text-gray-700 leading-relaxed">{unit.summary}</p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={Math.round((doneLessons / totalLessons) * 100)} className="flex-1 h-2" />
          <span className="text-xs text-gray-500">
            {doneLessons}/{totalLessons} lessons
          </span>
        </div>
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {unit.lessons.map((lesson, idx) => {
          const done = Boolean(completedKeys[lessonKey(unit.id, lesson.id)]);
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`w-full rounded-xl border p-4 text-left transition hover:shadow-sm ${
                done
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-white hover:border-teal-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{done ? "Completed" : "Not started"}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Unit quiz */}
      {unit.quiz && unit.quiz.length > 0 && (
        <Card
          className={`border-2 ${
            allLessonsDone ? "border-yellow-300" : "border-gray-200 opacity-60"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              📝 Unit Knowledge Check
              {!allLessonsDone && (
                <Badge className="bg-gray-100 text-gray-500 text-xs">
                  Complete all lessons first
                </Badge>
              )}
              {quizPass && (
                <Badge className="bg-green-100 text-green-700 text-xs">Passed ✓</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unit.quiz.map((q, qi) => (
              <div key={qi} className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  {qi + 1}. {q.prompt || q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = quizAnswers[qi] === oi;
                    const correct = oi === q.correct;
                    return (
                      <button
                        key={`${qi}-${oi}-${opt}`}
                        onClick={() => {
                          if (quizSubmitted || !allLessonsDone) return;
                          onUnitQuizChange(qi, oi);
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          quizSubmitted
                            ? correct
                              ? "border-green-400 bg-green-50"
                              : selected
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 opacity-50"
                            : selected
                              ? "border-teal-400 bg-teal-50"
                              : "border-gray-200 hover:border-teal-300"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              {!quizSubmitted && (
                <Button
                  disabled={
                    !allLessonsDone ||
                    Object.keys(quizAnswers).length < unit.quiz.length
                  }
                  onClick={() => onUnitQuizChange("submit", true)}
                >
                  Submit knowledge check
                </Button>
              )}
              {quizSubmitted && (
                <span
                  className={`text-sm font-semibold ${quizPass ? "text-green-700" : "text-orange-700"}`}
                >
                  Score: {quizScore}/{unit.quiz.length} ·{" "}
                  {quizPass ? "✓ Passed!" : "Review lessons and try again"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Course overview — unit grid
// ─────────────────────────────────────────────────────────────────
function CourseOverview({ course, units, completedKeys, onSelectUnit }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-sm text-gray-600 leading-relaxed">
        This course has <strong>{units.length} units</strong> covering{" "}
        {course.outcomes.join(", ").toLowerCase()}. Complete each unit's lessons and knowledge
        check to earn XP and unlock the course completion badge.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {units.map((unit, idx) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter(
            (l) => completedKeys[lessonKey(unit.id, l.id)],
          ).length;
          const quizDone = Boolean(completedKeys[unitQuizKey(unit.id)]);
          const pct = Math.round((done / total) * 100);
          return (
            <button
              key={unit.id}
              onClick={() => onSelectUnit(unit.id)}
              className={`rounded-2xl border-2 p-5 text-left transition hover:shadow-md ${
                quizDone
                  ? "border-green-400 bg-green-50"
                  : done > 0
                    ? "border-teal-300 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-teal-400"
              }`}
            >
              <div className="text-2xl mb-2">{unit.icon}</div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Unit {idx + 1}
              </p>
              <p className="font-bold text-gray-800 text-sm leading-tight mt-1">
                {unit.title.replace(/^Unit \d+ [–-] /, "")}
              </p>
              <div className="mt-3">
                <Progress value={pct} className="h-1.5" />
                <p className="text-xs text-gray-500 mt-1">
                  {done}/{total} lessons{quizDone ? " · Quiz ✓" : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Fallback body (courses without rich unit content)
// ─────────────────────────────────────────────────────────────────
function FallbackCourseBody({ course, completed, onComplete }) {
  const [actState, setActState] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [portfolio, setPortfolio] = useState({ reflection: "", actionPlan: "" });

  const questions = [
    {
      id: "q1",
      prompt: "Which learning outcome best matches this course?",
      options: [
        course.outcomes[0],
        "Memorise unrelated facts",
        "Skip practical tasks",
        "Avoid asking for support",
      ],
      correct: 0,
    },
    {
      id: "q2",
      prompt: `Which ACSF area is included in this course?`,
      options: [course.acsf[0], "Advanced Physics", "Creative Dance", "Astronomy"],
      correct: 0,
    },
    {
      id: "q3",
      prompt: `Which NDIS outcome aligns with this course?`,
      options: [course.ndis[0], "Rocket Engineering", "Ocean Navigation", "Film Editing"],
      correct: 0,
    },
  ];

  const score = questions.reduce(
    (acc, q) => acc + (quizAnswers[q.id] === q.correct ? 1 : 0),
    0,
  );
  const passed = quizSubmitted && score >= 2;

  return (
    <div className="space-y-5">
      {/* Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Learning Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {course.outcomes.map((o, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-800">{o}</p>
              <Button
                className="mt-3"
                size="sm"
                variant={completed[`outcome-${i}`] ? "secondary" : "outline"}
                onClick={() => onComplete(`outcome-${i}`, 10)}
              >
                {completed[`outcome-${i}`] ? "✓ Practised" : "Mark practised (+10 XP)"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle>🧩 Interactive Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.interactive.map((act, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-800 mb-2">{act}</p>
              <input
                value={actState[i] || ""}
                onChange={(e) => setActState((p) => ({ ...p, [i]: e.target.value }))}
                placeholder="Describe how you would complete this activity…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <Button
                className="mt-3"
                size="sm"
                variant={completed[`activity-${i}`] ? "secondary" : "outline"}
                onClick={() => onComplete(`activity-${i}`, 15)}
              >
                {completed[`activity-${i}`] ? "✓ Completed" : "Complete activity (+15 XP)"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold mb-2">
                {idx + 1}. {q.prompt}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={`${q.id}-${oi}`}
                    onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: oi }))}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                      quizSubmitted
                        ? oi === q.correct
                          ? "border-green-400 bg-green-50"
                          : quizAnswers[q.id] === oi
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 opacity-50"
                        : quizAnswers[q.id] === oi
                          ? "border-teal-400 bg-teal-50"
                          : "border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={() => setQuizSubmitted(true)}>Submit assessment</Button>
            {quizSubmitted && (
              <span
                className={`text-sm font-semibold ${passed ? "text-green-700" : "text-orange-700"}`}
              >
                Score: {score}/{questions.length} · {passed ? "Passed" : "Try again"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Reflection Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={portfolio.reflection}
            onChange={(e) => setPortfolio((p) => ({ ...p, reflection: e.target.value }))}
            placeholder="What strategy worked best for you, and why?"
            className="w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <textarea
            value={portfolio.actionPlan}
            onChange={(e) => setPortfolio((p) => ({ ...p, actionPlan: e.target.value }))}
            placeholder="What is your next real-world practice step?"
            className="w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <Button
            size="sm"
            variant={completed.portfolio ? "secondary" : "outline"}
            onClick={() => onComplete("portfolio", 20)}
          >
            {completed.portfolio ? "✓ Portfolio submitted" : "Submit portfolio (+20 XP)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Main CoursePlayer
// ─────────────────────────────────────────────────────────────────
export function CoursePlayer() {
  const { courseId } = useParams();
  const { user } = useUser();
  const { addXP, awardBadge, unlockGame } = useGamification();

  const course = useMemo(() => getCurriculumById(courseId), [courseId]);
  const content = useMemo(() => getCourseContent(courseId), [courseId]);
  const allCourses = useMemo(() => getAllCurriculum(), []);

  // Navigation state
  const [view, setView] = useState("overview"); // "overview" | "unit" | "lesson"
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Progress & content state
  const [completedKeys, setCompletedKeys] = useState({});
  const [lessonActivityState, setLessonActivityState] = useState({});
  const [unitQuizState, setUnitQuizState] = useState({});
  const [portfolio, setPortfolio] = useState({ reflection: "", actionPlan: "" });
  const [courseFinished, setCourseFinished] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [supportMode, setSupportMode] = useState("guided");

  // ── Hydrate ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!courseId) {
        setHydrated(true);
        return;
      }

      let local = null;
      try {
        const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
        local = raw ? JSON.parse(raw)?.[courseId] || null : null;
      } catch {
        local = null;
      }

      let remote = null;
      if (user?.id) {
        try {
          const doc = await getUserDoc(user.id);
          remote = doc?.courseProgress?.[courseId] || null;
        } catch {
          remote = null;
        }
      }

      const src = remote || local;
      if (!cancelled) {
        setCompletedKeys(src?.completedKeys || {});
        setLessonActivityState(src?.lessonActivityState || {});
        setUnitQuizState(src?.unitQuizState || {});
        setPortfolio(src?.portfolio || { reflection: "", actionPlan: "" });
        setCourseFinished(Boolean(src?.courseFinished));
        setSupportMode(src?.supportMode || "guided");
        setHydrated(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [courseId, user?.id]);

  // ── Persist ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || !courseId) return;
    const payload = {
      completedKeys,
      lessonActivityState,
      unitQuizState,
      portfolio,
      courseFinished,
      supportMode,
      updatedAt: Date.now(),
    };
    try {
      const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[courseId] = payload;
      localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      /* ignore */
    }
    if (user?.id) {
      setUserDoc(user.id, { courseProgress: { [courseId]: payload } }).catch(() => {});
    }
  }, [
    completedKeys,
    lessonActivityState,
    unitQuizState,
    portfolio,
    courseFinished,
    supportMode,
    courseId,
    hydrated,
    user?.id,
  ]);

  // ── Complete a section key ───────────────────────────────────────
  const completeKey = useCallback(
    (key, xp = 10) => {
      setCompletedKeys((prev) => {
        if (prev[key]) return prev;
        addXP(xp);
        return { ...prev, [key]: true };
      });
    },
    [addXP],
  );

  // ── Progress calculation ─────────────────────────────────────────
  const { totalSections, doneSections, progress } = useMemo(() => {
    if (!content) {
      return {
        totalSections: 1,
        doneSections: Object.keys(completedKeys).length,
        progress: 0,
      };
    }
    const all = content.units.flatMap((u) => [
      ...u.lessons.map((l) => lessonKey(u.id, l.id)),
      ...(u.quiz?.length ? [unitQuizKey(u.id)] : []),
    ]);
    const done = all.filter((k) => completedKeys[k]).length;
    return {
      totalSections: all.length,
      doneSections: done,
      progress: all.length ? Math.round((done / all.length) * 100) : 0,
    };
  }, [content, completedKeys]);

  const canFinish = content
    ? progress === 100
    : Object.keys(completedKeys).length >= 3;

  function finishCourse() {
    if (courseFinished) return;
    setCourseFinished(true);
    addXP(100);
    awardBadge(`course-${courseId}-completed`);
    if (course?.category === "life-skills") unlockGame("life-skills");
    else unlockGame("employment-skills");
  }

  function resetProgress() {
    setCompletedKeys({});
    setLessonActivityState({});
    setUnitQuizState({});
    setPortfolio({ reflection: "", actionPlan: "" });
    setCourseFinished(false);
    setView("overview");
    setSelectedUnitId(null);
    setSelectedLessonId(null);
  }

  // ── Derived navigation ───────────────────────────────────────────
  const selectedUnit = content?.units.find((u) => u.id === selectedUnitId) || null;
  const selectedLesson = selectedUnit?.lessons.find((l) => l.id === selectedLessonId) || null;
  const lessonList = selectedUnit?.lessons || [];
  const currentLessonIdx = lessonList.findIndex((l) => l.id === selectedLessonId);

  function goNextLesson() {
    if (currentLessonIdx < lessonList.length - 1) {
      setSelectedLessonId(lessonList[currentLessonIdx + 1].id);
    } else {
      setView("unit");
      setSelectedLessonId(null);
    }
  }

  function goPrevLesson() {
    if (currentLessonIdx > 0) {
      setSelectedLessonId(lessonList[currentLessonIdx - 1].id);
    } else {
      setView("unit");
      setSelectedLessonId(null);
    }
  }

  // ── Guard ────────────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-[#A32C2B]">Course not found</h1>
        <Link to="/courses" className="text-[#0B6E8F] underline">
          Return to course library
        </Link>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">

      {/* Course header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0B6E8F] to-[#5ED1D2] p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-1">
              {titleCase(course.category)}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {course.icon} {course.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {course.acsf.map((t) => (
                <Badge key={t} className="bg-white/20 text-white border-0 text-xs">
                  ACSF: {t}
                </Badge>
              ))}
              {course.ndis.map((t) => (
                <Badge key={t} className="bg-white/20 text-white border-0 text-xs">
                  NDIS: {t}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right text-sm shrink-0">
            <p className="font-semibold text-lg">{progress}%</p>
            <p className="text-white/80 text-xs">
              {doneSections}/{totalSections} sections
            </p>
          </div>
        </div>
        <Progress value={progress} className="mt-4 h-2.5 bg-white/25" />
      </div>

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => {
            setView("overview");
            setSelectedUnitId(null);
            setSelectedLessonId(null);
          }}
          className="font-medium text-[#0B6E8F] hover:underline"
        >
          Course map
        </button>
        {selectedUnit && (
          <>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => {
                setView("unit");
                setSelectedLessonId(null);
              }}
              className="font-medium text-[#0B6E8F] hover:underline"
            >
              {selectedUnit.title.replace(/^Unit \d+ [–-] /, "")}
            </button>
          </>
        )}
        {selectedLesson && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{selectedLesson.title}</span>
          </>
        )}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {view === "overview" && content && (
          <CourseOverview
            key="overview"
            course={course}
            units={content.units}
            completedKeys={completedKeys}
            onSelectUnit={(unitId) => {
              setSelectedUnitId(unitId);
              setView("unit");
            }}
          />
        )}

        {view === "overview" && !content && (
          <FallbackCourseBody
            key="fallback"
            course={course}
            completed={completedKeys}
            onComplete={completeKey}
          />
        )}

        {view === "unit" && selectedUnit && (
          <UnitView
            key={`unit-${selectedUnit.id}`}
            unit={selectedUnit}
            completedKeys={completedKeys}
            onSelectLesson={(lessonId) => {
              setSelectedLessonId(lessonId);
              setView("lesson");
            }}
            unitQuizState={unitQuizState[selectedUnit.id]}
            onUnitQuizChange={(qi, val) => {
              setUnitQuizState((prev) => {
                const current = prev[selectedUnit.id] || { answers: {}, submitted: false };
                if (qi === "submit") {
                  const updated = { ...current, submitted: true };
                  const q = selectedUnit.quiz || [];
                  const s = q.reduce(
                    (acc, question, i) =>
                      acc + (current.answers[i] === question.correct ? 1 : 0),
                    0,
                  );
                  const pass = s >= Math.ceil(q.length * 0.7);
                  if (pass) completeKey(unitQuizKey(selectedUnit.id), 25);
                  return { ...prev, [selectedUnit.id]: updated };
                }
                return {
                  ...prev,
                  [selectedUnit.id]: {
                    ...current,
                    answers: { ...current.answers, [qi]: val },
                  },
                };
              });
            }}
          />
        )}

        {view === "lesson" && selectedLesson && selectedUnit && (
          <motion.div
            key={`lesson-${selectedLesson.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h2>
            <LessonView
              lesson={selectedLesson}
              savedState={
                lessonActivityState[lessonKey(selectedUnit.id, selectedLesson.id)]
              }
              onSave={(state) => {
                const k = lessonKey(selectedUnit.id, selectedLesson.id);
                setLessonActivityState((prev) => ({ ...prev, [k]: state }));
              }}
              onComplete={() => {
                const k = lessonKey(selectedUnit.id, selectedLesson.id);
                completeKey(k, 10);
                goNextLesson();
              }}
              isCompleted={Boolean(
                completedKeys[lessonKey(selectedUnit.id, selectedLesson.id)],
              )}
              onNext={goNextLesson}
              onPrev={goPrevLesson}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio + finish — only on overview when content exists */}
      {view === "overview" && content && (
        <Card className="border-2 border-[#5ED1D2]">
          <CardHeader>
            <CardTitle>📚 Learning Portfolio & Course Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-3">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Learning mode
              </label>
              <select
                value={supportMode}
                onChange={(e) => setSupportMode(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="guided">Guided (with prompts)</option>
                <option value="coached">Coached (strategic hints)</option>
                <option value="independent">Independent (minimal prompts)</option>
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                value={portfolio.reflection}
                onChange={(e) =>
                  setPortfolio((p) => ({ ...p, reflection: e.target.value }))
                }
                placeholder="Reflection: What strategy worked best for you, and why?"
                className="min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                value={portfolio.actionPlan}
                onChange={(e) =>
                  setPortfolio((p) => ({ ...p, actionPlan: e.target.value }))
                }
                placeholder="Action plan: What is your next real-world practice step?"
                className="min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            {courseFinished ? (
              <div className="rounded-xl bg-green-50 border border-green-300 p-4 text-center">
                <p className="text-lg font-bold text-green-800">
                  🎉 Course completed! Badge awarded.
                </p>
                <p className="text-sm text-green-700 mt-1">
                  You earned 100 XP and the <strong>{course.title}</strong> course badge.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 items-center">
                <Button onClick={finishCourse} disabled={!canFinish}>
                  {canFinish
                    ? "Finish course (+100 XP + badge)"
                    : `Complete all ${totalSections} sections first`}
                </Button>
                <Button variant="outline" onClick={resetProgress} disabled={!hydrated}>
                  Reset progress
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation links */}
      <div className="flex flex-wrap gap-4 items-center">
        <Link to="/courses" className="text-sm text-[#0B6E8F] underline">
          ← Course Library
        </Link>
        <Link to="/lessons" className="text-sm text-[#0B6E8F] underline">
          Lesson Modules
        </Link>
      </div>

      {/* Related courses */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Explore other courses</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {allCourses
            .filter((c) => c.id !== course.id)
            .slice(0, 6)
            .map((c) => (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="rounded-lg border border-gray-200 p-3 text-sm hover:border-[#5ED1D2] hover:bg-teal-50"
              >
                {c.icon} {c.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
