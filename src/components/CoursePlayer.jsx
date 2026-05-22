import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useUser } from "../app/UserContext";
import { getUserDoc, setUserDoc } from "../app/firestoreClient";
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
const COURSE_PROGRESS_STORAGE_KEY = "windgap-course-progress-v1";

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

function buildLearningBlueprint(course) {
  const essentialQuestion = `How can I apply ${course.title.toLowerCase()} skills safely and confidently in real-world settings?`;
  const priorKnowledge = [
    `Basic understanding of ${course.acsf[0] || "communication"}`,
    `Willingness to practice routines linked to ${course.ndis[0] || "daily living"}`,
    "Ability to reflect on what worked and what needs support",
  ];
  const successCriteria = [
    ...course.outcomes,
    "Explain why your chosen strategy is safe, practical, and respectful",
    "Show evidence of transfer from practice activity to real-life scenario",
  ];
  const vocabulary = Array.from(
    new Set([...course.acsf, ...course.ndis, "goal", "support", "review"]),
  );
  return { essentialQuestion, priorKnowledge, successCriteria, vocabulary };
}

function buildScenarioStudio(course) {
  return [
    {
      id: "scenario-foundation",
      level: "Foundation",
      title: `Routine setup: ${course.title}`,
      prompt: `You are preparing for a task related to ${course.title}. What should you do first?`,
      options: [
        "Clarify the goal and required steps",
        "Start immediately without checking instructions",
        "Wait and avoid the task",
      ],
      correctIndex: 0,
      rationale:
        "Strong learners begin by clarifying expectations, resources, and supports before taking action.",
    },
    {
      id: "scenario-core",
      level: "Core",
      title: "Decision point",
      prompt: `A challenge appears while practicing this course. What is the best response?`,
      options: [
        "Use a safe strategy and ask for help when needed",
        "Ignore the issue and continue",
        "Stop permanently after one difficulty",
      ],
      correctIndex: 0,
      rationale:
        "Core mastery means using safe decisions, communication, and support-seeking to keep progress moving.",
    },
    {
      id: "scenario-stretch",
      level: "Stretch",
      title: "Transfer challenge",
      prompt: `How do you demonstrate advanced understanding of this skill?`,
      options: [
        "Apply the skill in a new setting and justify your approach",
        "Repeat only memorized steps without thinking",
        "Skip reflection and evidence collection",
      ],
      correctIndex: 0,
      rationale:
        "Advanced learning includes transfer: adapting skills to a new context and explaining your reasoning.",
    },
  ];
}

function buildMasteryRubric(course) {
  return [
    {
      criterion: "Concept understanding",
      developing: "Can identify key terms with support",
      proficient: `Explains core concepts linked to ${course.acsf[0] || "ACSF"}`,
      advanced: "Connects concepts across contexts and teaches others",
    },
    {
      criterion: "Applied performance",
      developing: "Completes parts of tasks with prompting",
      proficient: `Independently performs main tasks in ${course.title}`,
      advanced: "Adapts performance to unfamiliar scenarios safely",
    },
    {
      criterion: "Self-management and reflection",
      developing: "Needs reminders to review progress",
      proficient: "Uses checklist, feedback, and next steps consistently",
      advanced: "Sets goals, tracks evidence, and iterates strategically",
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
  const { user } = useUser();
  const { addXP, awardBadge, unlockGame } = useGamification();

  const course = useMemo(() => getCurriculumById(courseId), [courseId]);
  const allCourses = useMemo(() => getAllCurriculum(), []);
  const blueprint = useMemo(() => buildLearningBlueprint(course || {}), [course]);
  const scenarioStudio = useMemo(() => buildScenarioStudio(course || {}), [course]);
  const masteryRubric = useMemo(() => buildMasteryRubric(course || {}), [course]);

  const [completed, setCompleted] = useState({});
  const [rewarded, setRewarded] = useState({});
  const [activityState, setActivityState] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [courseFinished, setCourseFinished] = useState(false);
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [portfolio, setPortfolio] = useState({ artifacts: {}, reflection: "", actionPlan: "" });
  const [supportMode, setSupportMode] = useState("guided");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      if (!courseId) {
        setHydrated(true);
        return;
      }

      setHydrated(false);

      let localProgress = null;
      try {
        const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          localProgress = parsed?.[courseId] || null;
        }
      } catch {
        localProgress = null;
      }

      let remoteProgress = null;
      if (user?.id) {
        try {
          const userDoc = await getUserDoc(user.id);
          remoteProgress = userDoc?.courseProgress?.[courseId] || null;
        } catch {
          remoteProgress = null;
        }
      }

      const source = remoteProgress || localProgress;
      if (!cancelled) {
        setCompleted(source?.completed || {});
        setRewarded(source?.rewarded || {});
        setActivityState(source?.activityState || {});
        setQuizAnswers(source?.quizAnswers || {});
        setQuizSubmitted(Boolean(source?.quizSubmitted));
        setCourseFinished(Boolean(source?.courseFinished));
        setScenarioAnswers(source?.scenarioAnswers || {});
        setPortfolio(source?.portfolio || { artifacts: {}, reflection: "", actionPlan: "" });
        setSupportMode(source?.supportMode || "guided");
        setHintsUsed(Number(source?.hintsUsed || 0));
        setHydrated(true);
      }
    }

    loadProgress();
    return () => {
      cancelled = true;
    };
  }, [courseId, user?.id]);

  useEffect(() => {
    if (!hydrated || !courseId) return;

    const payload = {
      completed,
      rewarded,
      activityState,
      quizAnswers,
      quizSubmitted,
      courseFinished,
      scenarioAnswers,
      portfolio,
      supportMode,
      hintsUsed,
      updatedAt: Date.now(),
    };

    try {
      const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[courseId] = payload;
      localStorage.setItem(COURSE_PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // Ignore storage failures (private mode/quota)
    }

    if (user?.id) {
      setUserDoc(user.id, { courseProgress: { [courseId]: payload } }).catch(() => {
        // Keep local progress even if remote persist fails.
      });
    }
  }, [
    activityState,
    completed,
    courseFinished,
    courseId,
    hydrated,
    quizAnswers,
    quizSubmitted,
    rewarded,
    scenarioAnswers,
    portfolio,
    supportMode,
    hintsUsed,
    user?.id,
  ]);

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
    "learning-blueprint",
    ...course.outcomes.map((_, i) => `outcome-${i}`),
    ...course.interactive.map((_, i) => `interactive-${i}`),
    ...scenarioStudio.map((s) => s.id),
    "portfolio",
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

  const lastUpdated = useMemo(() => {
    if (!hydrated || !courseId) return null;
    try {
      const raw = localStorage.getItem(COURSE_PROGRESS_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const ts = parsed?.[courseId]?.updatedAt;
      return ts ? new Date(ts).toLocaleString() : null;
    } catch {
      return null;
    }
  }, [courseId, hydrated, completed, activityState, quizAnswers, scenarioAnswers, portfolio]);

  function resetCourseProgress() {
    setCompleted({});
    setRewarded({});
    setActivityState({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCourseFinished(false);
    setScenarioAnswers({});
    setPortfolio({ artifacts: {}, reflection: "", actionPlan: "" });
    setSupportMode("guided");
    setHintsUsed(0);
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
          <CardTitle>🧠 Learning Blueprint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Essential question
            </p>
            <p className="mt-1 text-sm text-slate-800">{blueprint.essentialQuestion}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-800">Prior knowledge</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {blueprint.priorKnowledge.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-800">Success criteria</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {blueprint.successCriteria.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Key vocabulary</p>
            <div className="flex flex-wrap gap-2">
              {blueprint.vocabulary.map((word) => (
                <Badge key={word} className="bg-sky-100 text-sky-800">
                  {word}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700" htmlFor="support-mode">
              Learning mode
            </label>
            <select
              id="support-mode"
              value={supportMode}
              onChange={(e) => setSupportMode(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="guided">Guided (with prompts)</option>
              <option value="coached">Coached (strategic hints)</option>
              <option value="independent">Independent (minimal prompts)</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setHintsUsed((n) => n + 1)}>
              Use scaffold hint
            </Button>
            <span className="text-xs text-gray-500">Hints used: {hintsUsed}</span>
          </div>

          <Button
            size="sm"
            variant={completed["learning-blueprint"] ? "secondary" : "outline"}
            onClick={() => completeSection("learning-blueprint", 10)}
          >
            {completed["learning-blueprint"]
              ? "✓ Blueprint understood"
              : "Confirm learning blueprint (+10 XP)"}
          </Button>
        </CardContent>
      </Card>

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
          <CardTitle>🧪 Scenario Studio (Foundation → Stretch)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarioStudio.map((scenario, idx) => {
            const selected = scenarioAnswers[scenario.id];
            const isCorrect = selected === scenario.correctIndex;
            return (
              <div key={scenario.id} className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-800">{scenario.level}</Badge>
                  <p className="font-semibold text-gray-800">
                    {idx + 1}. {scenario.title}
                  </p>
                </div>
                <p className="mb-3 text-sm text-gray-700">{scenario.prompt}</p>
                <div className="space-y-2">
                  {scenario.options.map((option, optionIdx) => (
                    <button
                      key={`${scenario.id}-${option}`}
                      onClick={() =>
                        setScenarioAnswers((prev) => ({
                          ...prev,
                          [scenario.id]: optionIdx,
                        }))
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                        selected === optionIdx
                          ? optionIdx === scenario.correctIndex
                            ? "border-green-400 bg-green-50"
                            : "border-orange-300 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected !== undefined && (
                  <p className={`mt-2 text-xs ${isCorrect ? "text-green-700" : "text-orange-700"}`}>
                    {isCorrect ? "Strong decision." : "Review the rationale."} {scenario.rationale}
                  </p>
                )}
                <Button
                  className="mt-3"
                  size="sm"
                  variant={completed[scenario.id] ? "secondary" : "outline"}
                  onClick={() => completeSection(scenario.id, 12)}
                >
                  {completed[scenario.id]
                    ? `✓ ${scenario.level} scenario completed`
                    : `Complete ${scenario.level} scenario (+12 XP)`}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📚 Mastery Rubric & Evidence Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="border p-2">Criterion</th>
                  <th className="border p-2">Developing</th>
                  <th className="border p-2">Proficient</th>
                  <th className="border p-2">Advanced</th>
                </tr>
              </thead>
              <tbody>
                {masteryRubric.map((row) => (
                  <tr key={row.criterion}>
                    <td className="border p-2 font-medium">{row.criterion}</td>
                    <td className="border p-2">{row.developing}</td>
                    <td className="border p-2">{row.proficient}</td>
                    <td className="border p-2">{row.advanced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Evidence artifacts</p>
            {[
              "Completed checklist or planner",
              "Scenario decision notes",
              "Reflection summary",
            ].map((item) => (
              <label key={item} className="mb-1 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(portfolio.artifacts?.[item])}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      artifacts: { ...prev.artifacts, [item]: e.target.checked },
                    }))
                  }
                />
                {item}
              </label>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <textarea
              value={portfolio.reflection}
              onChange={(e) =>
                setPortfolio((prev) => ({
                  ...prev,
                  reflection: e.target.value,
                }))
              }
              placeholder="Reflection: What strategy worked best for you, and why?"
              className="min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              value={portfolio.actionPlan}
              onChange={(e) =>
                setPortfolio((prev) => ({
                  ...prev,
                  actionPlan: e.target.value,
                }))
              }
              placeholder="Action plan: What is your next real-world practice step?"
              className="min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <Button
            size="sm"
            variant={completed.portfolio ? "secondary" : "outline"}
            onClick={() => completeSection("portfolio", 20)}
          >
            {completed.portfolio ? "✓ Portfolio submitted" : "Submit portfolio evidence (+20 XP)"}
          </Button>
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
            {lastUpdated && <p className="mt-1 text-xs text-gray-500">Last saved: {lastUpdated}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetCourseProgress} disabled={!hydrated}>
              Reset progress
            </Button>
            <Button
              onClick={finishCourse}
              disabled={
                courseFinished || !hasPassedAssessment || completedCount < sectionKeys.length
              }
            >
              {courseFinished ? "✓ Course completed" : "Finish course (+100 XP + badge)"}
            </Button>
          </div>
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
