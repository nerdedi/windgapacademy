/**
 * Curriculum Service
 * Loads and manages curriculum data from JSON files
 */

// Life Skills Curriculum
const lifeSkillsCurriculum = [
  {
    id: "communication-asking-for-help",
    title: "Communication: Asking for Help",
    category: "life-skills",
    acsf: ["Oral Communication", "Learning"],
    ndis: ["Daily Living", "Social Participation"],
    outcomes: [
      "Ask for help in different situations",
      "Use polite language when requesting assistance",
    ],
    assessment: ["Role-play asking for help", "Situational response check"],
    interactive: ["Scenario cards", "Video demonstrations"],
    icon: "💬",
  },
  {
    id: "cooking-basics",
    title: "Cooking Basics",
    category: "life-skills",
    acsf: ["Learning", "Reading"],
    ndis: ["Daily Living"],
    outcomes: ["Follow simple recipes", "Use basic kitchen equipment safely"],
    assessment: ["Prepare a simple meal under supervision", "Hygiene and safety checklist"],
    interactive: ["Recipe builder", "Kitchen safety quiz", "Video demo"],
    icon: "🍳",
  },
  {
    id: "healthy-eating",
    title: "Healthy Eating",
    category: "life-skills",
    acsf: ["Reading", "Learning"],
    ndis: ["Daily Living", "Health"],
    outcomes: ["Identify healthy food choices", "Plan balanced meals"],
    assessment: ["Food group sorting activity", "Meal planning exercise"],
    interactive: ["Food pyramid game", "Nutrition quiz"],
    icon: "🥗",
  },
  {
    id: "home-safety",
    title: "Home Safety",
    category: "life-skills",
    acsf: ["Learning", "Reading"],
    ndis: ["Daily Living"],
    outcomes: ["Identify hazards at home", "Know emergency procedures"],
    assessment: ["Home safety inspection checklist", "Emergency drill"],
    interactive: ["Hazard spotting game", "Emergency number practice"],
    icon: "🏠",
  },
  {
    id: "hygiene-personal-care",
    title: "Hygiene & Personal Care",
    category: "life-skills",
    acsf: ["Learning"],
    ndis: ["Daily Living", "Health"],
    outcomes: ["Maintain personal hygiene routines", "Understand importance of cleanliness"],
    assessment: ["Daily routine checklist", "Self-care demonstration"],
    interactive: ["Routine builder", "Hygiene matching game"],
    icon: "🧼",
  },
  {
    id: "safety-in-community",
    title: "Safety in Community",
    category: "life-skills",
    acsf: ["Learning", "Oral Communication"],
    ndis: ["Social Participation", "Community"],
    outcomes: ["Navigate public spaces safely", "Recognize danger signs"],
    assessment: ["Community walk observation", "Safety scenario responses"],
    interactive: ["Street safety simulation", "Stranger safety quiz"],
    icon: "🚦",
  },
  {
    id: "shopping-money-handling",
    title: "Shopping & Money Handling",
    category: "life-skills",
    acsf: ["Numeracy", "Learning"],
    ndis: ["Daily Living", "Economic Participation"],
    outcomes: ["Make purchases independently", "Count change correctly"],
    assessment: ["Simulated shopping trip", "Money counting test"],
    interactive: ["Virtual shop", "Money matching game", "Budget calculator"],
    icon: "🛒",
  },
  {
    id: "time-management",
    title: "Time Management",
    category: "life-skills",
    acsf: ["Numeracy", "Learning"],
    ndis: ["Daily Living"],
    outcomes: ["Read clocks and schedules", "Plan daily activities"],
    assessment: ["Schedule creation", "Time-telling assessment"],
    interactive: ["Clock game", "Schedule builder", "Timer activities"],
    icon: "⏰",
  },
  {
    id: "travel-training",
    title: "Travel Training",
    category: "life-skills",
    acsf: ["Reading", "Learning", "Oral Communication"],
    ndis: ["Transport", "Community"],
    outcomes: ["Use public transport independently", "Read timetables and maps"],
    assessment: ["Supervised travel trip", "Route planning exercise"],
    interactive: ["Virtual bus/train simulator", "Map reading game"],
    icon: "🚌",
  },
  {
    id: "using-public-services",
    title: "Using Public Services",
    category: "life-skills",
    acsf: ["Oral Communication", "Reading", "Learning"],
    ndis: ["Community", "Social Participation"],
    outcomes: ["Access library, post office, and other services", "Fill out simple forms"],
    assessment: ["Service visit observation", "Form completion task"],
    interactive: ["Virtual service counters", "Form filling practice"],
    icon: "🏛️",
  },
];

// Employment Skills Curriculum
const employmentSkillsCurriculum = [
  {
    id: "communication-at-work",
    title: "Communication at Work",
    category: "employment-skills",
    acsf: ["Oral Communication", "Learning"],
    ndis: ["Economic Participation"],
    outcomes: ["Communicate professionally with colleagues", "Follow verbal instructions"],
    assessment: ["Workplace scenario role-play", "Communication checklist"],
    interactive: ["Workplace conversation simulator", "Email writing practice"],
    icon: "💼",
  },
  {
    id: "interview-practice",
    title: "Interview Practice",
    category: "employment-skills",
    acsf: ["Oral Communication", "Learning"],
    ndis: ["Economic Participation"],
    outcomes: ["Answer common interview questions", "Demonstrate workplace communication"],
    assessment: ["Mock interview observed by educator", "Reflective checklist"],
    interactive: ["Interview question bank", "Role-play scenarios"],
    icon: "🎤",
  },
  {
    id: "resume-writing",
    title: "Resume Writing",
    category: "employment-skills",
    acsf: ["Writing", "Reading"],
    ndis: ["Economic Participation"],
    outcomes: ["Create a basic resume", "Identify personal skills and experience"],
    assessment: ["Completed resume", "Skills identification worksheet"],
    interactive: ["Resume builder tool", "Skills inventory"],
    icon: "📄",
  },
  {
    id: "time-management-work",
    title: "Time Management at Work",
    category: "employment-skills",
    acsf: ["Numeracy", "Learning"],
    ndis: ["Economic Participation"],
    outcomes: ["Arrive on time", "Manage work tasks efficiently"],
    assessment: ["Time tracking log", "Task prioritization exercise"],
    interactive: ["Work schedule planner", "Priority matrix game"],
    icon: "📅",
  },
  {
    id: "workplace-behaviour",
    title: "Workplace Behaviour",
    category: "employment-skills",
    acsf: ["Learning", "Oral Communication"],
    ndis: ["Economic Participation", "Social Participation"],
    outcomes: ["Demonstrate appropriate workplace conduct", "Understand workplace expectations"],
    assessment: ["Behaviour scenario responses", "Peer feedback"],
    interactive: ["Workplace etiquette quiz", "Scenario decision game"],
    icon: "🤝",
  },
  {
    id: "workplace-safety",
    title: "Workplace Safety",
    category: "employment-skills",
    acsf: ["Reading", "Learning"],
    ndis: ["Economic Participation", "Health"],
    outcomes: ["Identify workplace hazards", "Follow safety procedures"],
    assessment: ["Safety inspection checklist", "Emergency procedure demonstration"],
    interactive: ["Hazard spotting game", "PPE matching activity"],
    icon: "⚠️",
  },
];

// Learning domains based on ACSF
const learningDomains = [
  { id: "language", label: "Language & Oral Communication", icon: "🗣️", color: "orange-500" },
  { id: "literacy", label: "Literacy & Reading", icon: "📚", color: "teal-500" },
  { id: "numeracy", label: "Numeracy & Maths", icon: "🔢", color: "yellow-500" },
  { id: "digital", label: "Digital Literacy", icon: "💻", color: "green-500" },
  { id: "life-skills", label: "Life Skills", icon: "🏠", color: "pink-500" },
  { id: "employment", label: "Employment Skills", icon: "💼", color: "blue-500" },
];

/**
 * Get all curriculum items
 */
export function getAllCurriculum() {
  return [...lifeSkillsCurriculum, ...employmentSkillsCurriculum];
}

/**
 * Get curriculum by category
 */
export function getCurriculumByCategory(category) {
  if (category === "life-skills") return lifeSkillsCurriculum;
  if (category === "employment-skills") return employmentSkillsCurriculum;
  return getAllCurriculum();
}

/**
 * Get curriculum item by ID
 */
export function getCurriculumById(id) {
  return getAllCurriculum().find((item) => item.id === id);
}

/**
 * Get all learning domains
 */
export function getLearningDomains() {
  return learningDomains;
}

/**
 * Search curriculum by keyword
 */
export function searchCurriculum(keyword) {
  const lowered = keyword.toLowerCase();
  return getAllCurriculum().filter(
    (item) =>
      item.title.toLowerCase().includes(lowered) ||
      item.outcomes.some((o) => o.toLowerCase().includes(lowered)) ||
      item.acsf.some((a) => a.toLowerCase().includes(lowered)) ||
      item.ndis.some((n) => n.toLowerCase().includes(lowered)),
  );
}

/**
 * Get curriculum stats
 */
export function getCurriculumStats() {
  const all = getAllCurriculum();
  return {
    total: all.length,
    lifeSkills: lifeSkillsCurriculum.length,
    employmentSkills: employmentSkillsCurriculum.length,
    acsfAreas: [...new Set(all.flatMap((c) => c.acsf))],
    ndisOutcomes: [...new Set(all.flatMap((c) => c.ndis))],
  };
}

export default {
  getAllCurriculum,
  getCurriculumByCategory,
  getCurriculumById,
  getLearningDomains,
  searchCurriculum,
  getCurriculumStats,
};
