import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGamification } from "../contexts/GamificationContext";
import { getAllCurriculum, getCurriculumById } from "../services/curriculumService";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

const ACTIVITY_TYPES = [
  "multiple-choice",
  "sequence",
  "match",
  "checklist",
  "fill-blank",
  "reflect",
];

function titleCase(text) {
  return (text || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildAssessmentQuestions(course) {
  const acsfFocus = course.acsf[0] || "Learning";
  const ndisFocus = course.ndis[0] || "Daily Living";
  return [
    {
      id: "q1",
      prompt: `Which learning outcome best matches this course?`,
      options: [
        course.outcomes[0],
        "Memorise random facts unrelated to daily life",
        "Skip practical tasks and only watch videos",
        "Avoid asking for support",
      ],
      correctIndex: 0,
    },
    {
      id: "q2",
      prompt: `Which ACSF area is explicitly included in this course?`,
      options: [acsfFocus, "Advanced Physics", "Creative Dance", "Astronomy"],
      correctIndex: 0,
    },
    {
      id: "q3",
      prompt: `Which NDIS outcome aligns with this course?`,
      options: [ndisFocus, "Rocket Engineering", "Ocean Navigation", "Film Editing"],
      correctIndex: 0,
    },
    {
      id: "q4",
      prompt: `What is the most appropriate way to show course mastery?`,
      options: [
        "Complete the practical assessment tasks",
        "Guess answers quickly",
        "Skip activities and go straight to next course",
        "Do only one section",
      ],
      correctIndex: 0,
    },
  ];
}

function ActivityRenderer({ type, label, state, onChange }) {
  if (type === "multiple-choice") {
    const options = [
      "Choose the safest and most practical response",
      "Ignore instructions and improvise",
      "Ask for help only after a problem gets worse",
    ];
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Scenario: {label}</p>
        {options.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => onChange({ selected: idx })}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              state?.selected === idx
                ? idx === 0
                  ? "border-green-400 bg-green-50"
                  : "border-orange-300 bg-orange-50"
                : "border-gray-200 bg-white hover:border-teal-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  if (type === "sequence") {
    const steps = ["Plan", "Do", "Check"];
    const entered = state?.order || "";
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Put the workflow in order using numbers (e.g. 123):</p>
        <div className="rounded-lg bg-gray-50 p-3 text-sm">{steps.join(" → ")}</div>
        <input
          value={entered}
          onChange={(e) => onChange({ order: e.target.value.replace(/[^123]/g, "") })}
          placeholder="Type order"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        {entered && (
          <p className={`text-xs ${entered === "123" ? "text-green-700" : "text-orange-700"}`}>
            {entered === "123" ? "Great sequence!" : "Try Plan → Do → Check."}
          </p>
        )}
      </div>
    );
  }

  if (type === "match") {
    const matches = [
      ["Goal", "What you want to achieve"],
      ["Support", "Who can help you"],
      ["Review", "Check your progress"],
    ];
    const value = state?.choice || "";
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Match the term to the best meaning:</p>
        <select
          value={value}
          onChange={(e) => onChange({ choice: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Select a match</option>
          {matches.map(([term, meaning]) => (
            <option key={term} value={term}>
              {term} → {meaning}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "checklist") {
    const items = ["Understand instructions", "Complete practice", "Ask questions if needed"];
    const checked = state?.checked || {};
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Tick each item as you complete it:</p>
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm"
          >
            <input
              type="checkbox"
              checked={Boolean(checked[item])}
              onChange={(e) => onChange({ checked: { ...checked, [item]: e.target.checked } })}
            />
            {item}
          </label>
        ))}
      </div>
    );
  }

  if (type === "fill-blank") {
    const answer = state?.answer || "";
    const ok = answer.trim().length >= 3;
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Complete the sentence:</p>
        <p className="text-sm">A good next step for this course is to ______ every day.</p>
        <input
          value={answer}
          onChange={(e) => onChange({ answer: e.target.value })}
          placeholder="Type your idea"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        {answer && (
          <p className={`text-xs ${ok ? "text-green-700" : "text-orange-700"}`}>
            {ok ? "Nice! That is a clear action." : "Add a little more detail."}
          </p>
        )}
      </div>
    );
  }

  const rating = state?.rating ?? 3;
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">How confident do you feel about this skill?</p>
      <input
        type="range"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => onChange({ rating: Number(e.target.value) })}
        className="w-full"
      />
      <p className="text-xs text-gray-500">Confidence: {rating}/5</p>
    </div>
  );
}

export function CoursePlayer() {
  const { courseId } = useParams();
  const { addXP, awardBadge, unlockGame } = useGamification();

  const course = useMemo(() => getCurriculumById(courseId), [courseId]);
  const allCourses = useMemo(() => getAllCurriculum(), []);

  const [completed, setCompleted] = useState({});
  const [rewarded, setRewarded] = useState({});
  const [activityState, setActivityState] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [courseFinished, setCourseFinished] = useState(false);

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-[#A32C2B]">Course not found</h1>
        <p className="text-gray-600">The selected course could not be loaded.</p>
        <Link to="/courses" className="text-[#0B6E8F] underline">
          Return to course library
        </Link>
      </div>
    );
  }

  const assessmentQuestions = buildAssessmentQuestions(course);
  const sectionKeys = [
    ...course.outcomes.map((_, i) => `outcome-${i}`),
    ...course.interactive.map((_, i) => `interactive-${i}`),
    "assessment",
  ];

  const completedCount = sectionKeys.filter((k) => completed[k]).length;
  const progress = Math.round((completedCount / sectionKeys.length) * 100);

  const score = assessmentQuestions.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);
  const passThreshold = Math.ceil(assessmentQuestions.length * 0.7);
  const hasPassedAssessment = quizSubmitted && score >= passThreshold;

  function completeSection(key, xpAmount = 15) {
    if (completed[key]) return;
    setCompleted((prev) => ({ ...prev, [key]: true }));
    addXP(xpAmount);
    if (!rewarded[key]) {
      setRewarded((prev) => ({ ...prev, [key]: true }));
    }
  }

  function finishCourse() {
    if (courseFinished || !hasPassedAssessment || completedCount < sectionKeys.length) return;
    setCourseFinished(true);
    addXP(100);
    awardBadge(`course-${course.id}-completed`);
    if (course.category === "life-skills") {
      unlockGame("life-skills");
    } else {
      unlockGame("employment-skills");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0B6E8F] to-[#5ED1D2] p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {course.icon} {course.title}
            </h1>
            <p className="mt-2 text-sm text-white/90">
              Category: {titleCase(course.category)} · ACSF aligned · NDIS aligned
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">Progress: {progress}%</div>
            <div>
              {completedCount}/{sectionKeys.length} sections complete
            </div>
          </div>
        </div>
        <Progress value={progress} className="mt-4 h-3 bg-white/25" />
      </div>

      <div className="flex flex-wrap gap-2">
        {course.acsf.map((tag) => (
          <Badge key={`acsf-${tag}`} className="bg-orange-100 text-orange-800">
            ACSF: {tag}
          </Badge>
        ))}
        {course.ndis.map((tag) => (
          <Badge key={`ndis-${tag}`} className="bg-teal-100 text-teal-800">
            NDIS: {tag}
          </Badge>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Learning Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {course.outcomes.map((outcome, idx) => {
            const key = `outcome-${idx}`;
            return (
              <div key={key} className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-800">{outcome}</p>
                <Button
                  className="mt-3"
                  size="sm"
                  variant={completed[key] ? "secondary" : "outline"}
                  onClick={() => completeSection(key, 10)}
                >
                  {completed[key] ? "✓ Outcome completed" : "Mark outcome practiced (+10 XP)"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧩 Interactive Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.interactive.map((interactive, idx) => {
            const key = `interactive-${idx}`;
            const type = ACTIVITY_TYPES[idx % ACTIVITY_TYPES.length];
            return (
              <div key={key} className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-800">{interactive}</p>
                  <Badge className="bg-purple-100 text-purple-800">{titleCase(type)}</Badge>
                </div>
                <ActivityRenderer
                  type={type}
                  label={interactive}
                  state={activityState[key]}
                  onChange={(value) =>
                    setActivityState((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], ...value },
                    }))
                  }
                />
                <Button
                  className="mt-3"
                  size="sm"
                  variant={completed[key] ? "secondary" : "outline"}
                  onClick={() => completeSection(key, 15)}
                >
                  {completed[key] ? "✓ Activity completed" : "Complete activity (+15 XP)"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📝 Assessment (Multi-question)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assessmentQuestions.map((question, idx) => (
            <div key={question.id} className="rounded-xl border border-gray-200 p-4">
              <p className="mb-2 font-medium text-gray-800">
                {idx + 1}. {question.prompt}
              </p>
              <div className="space-y-2">
                {question.options.map((option, optionIdx) => {
                  const selected = quizAnswers[question.id] === optionIdx;
                  const showResult = quizSubmitted;
                  const isCorrect = optionIdx === question.correctIndex;
                  const isWrongSelected = showResult && selected && !isCorrect;
                  const isCorrectSelected = showResult && selected && isCorrect;
                  return (
                    <button
                      key={`${question.id}-${option}`}
                      onClick={() =>
                        setQuizAnswers((prev) => ({
                          ...prev,
                          [question.id]: optionIdx,
                        }))
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isCorrectSelected
                          ? "border-green-400 bg-green-50"
                          : isWrongSelected
                            ? "border-red-300 bg-red-50"
                            : showResult && isCorrect
                              ? "border-green-200 bg-green-50/60"
                              : selected
                                ? "border-teal-300 bg-teal-50"
                                : "border-gray-200 bg-white hover:border-teal-300"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setQuizSubmitted(true)}>Submit assessment</Button>
            {quizSubmitted && (
              <p
                className={`text-sm font-semibold ${hasPassedAssessment ? "text-green-700" : "text-orange-700"}`}
              >
                Score: {score}/{assessmentQuestions.length} ·{" "}
                {hasPassedAssessment ? "Passed" : "Try again"}
              </p>
            )}
            {hasPassedAssessment && !completed.assessment && (
              <Button variant="outline" onClick={() => completeSection("assessment", 25)}>
                Mark assessment complete (+25 XP)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-[#5ED1D2]">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="font-semibold text-gray-800">Course completion</p>
            <p className="text-sm text-gray-600">
              Complete all sections and pass assessment to earn a badge and bonus XP.
            </p>
          </div>
          <Button
            onClick={finishCourse}
            disabled={courseFinished || !hasPassedAssessment || completedCount < sectionKeys.length}
          >
            {courseFinished ? "✓ Course completed" : "Finish course (+100 XP + badge)"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/courses" className="text-sm text-[#0B6E8F] underline">
          ← Back to Course Library
        </Link>
        <Link to="/lessons" className="text-sm text-[#0B6E8F] underline">
          Open Lesson Modules
        </Link>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Explore other courses</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
