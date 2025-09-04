export const employmentModules = [
  {
    id: "resume-writing",
    title: "Resume Writing",
    acsf: ["Writing", "Reading"],
    ndis: ["Employment Support"],
    outcomes: [
      "Create a basic resume",
      "Identify personal strengths and relevant experience",
      "Format contact and education details",
    ],
    assessment: ["Resume draft submission", "Peer review checklist"],
    interactive: ["resume-builder", "skills-drag-drop"],
    resources: ["/assets/curriculum/resume-template.pdf"],
    guidance: "Educator notes: scaffolded templates and examples; support with one-on-one review.",
  },

  {
    id: "interview-practice",
    title: "Interview Practice",
    acsf: ["Oral Communication", "Learning"],
    ndis: ["Employment Support"],
    outcomes: ["Answer common interview questions", "Demonstrate appropriate dress and etiquette"],
    assessment: ["Mock interview performance", "Feedback checklist"],
    interactive: ["roleplay-simulator", "confidence-meter"],
    resources: ["/assets/curriculum/interview-checklist.pdf"],
    guidance:
      "Educator notes: run mock interviews and provide structured feedback; use video playback when possible.",
  },

  {
    id: "workplace-behaviour",
    title: "Workplace Behaviour",
    acsf: ["Oral Communication", "Learning"],
    ndis: ["Employment Support"],
    outcomes: [
      "Understand workplace expectations",
      "Follow instructions and ask clarifying questions",
    ],
    assessment: ["Scenario-based responses", "Behaviour checklist"],
    interactive: ["workplace-simulator", "what-would-you-do"],
    resources: ["/assets/curriculum/workplace-behaviour.pdf"],
    guidance: "Educator notes: focus on social norms, punctuality, and teamwork exercises.",
  },

  {
    id: "time-management-work",
    title: "Time Management at Work",
    acsf: ["Numeracy", "Learning"],
    ndis: ["Employment Support"],
    outcomes: ["Plan daily tasks", "Prioritise work to meet deadlines"],
    assessment: ["Daily planner task", "Task prioritisation exercise"],
    interactive: ["time-tracker-game", "drag-drop-schedule"],
    resources: ["/assets/curriculum/time-planner.pdf"],
    guidance: "Educator notes: introduce simple scheduling tools and time estimation activities.",
  },

  {
    id: "workplace-safety",
    title: "Workplace Safety",
    acsf: ["Reading", "Learning"],
    ndis: ["Employment Support"],
    outcomes: ["Identify workplace hazards", "Follow safety procedures and PPE guidelines"],
    assessment: ["Safety audit", "Hazard identification task"],
    interactive: ["safety-simulation", "ppe-matching-game"],
    resources: ["/assets/curriculum/safety-checklist.pdf"],
    guidance:
      "Educator notes: align with simple workplace safety standards; include role-play for emergency responses.",
  },

  {
    id: "communication-at-work",
    title: "Communication at Work",
    acsf: ["Oral Communication", "Writing"],
    ndis: ["Employment Support"],
    outcomes: ["Ask for help at work", "Report issues clearly", "Follow written instructions"],
    assessment: ["Role-play interactions", "Written report task"],
    interactive: ["workplace-chat-simulator", "emoji-tone-game"],
    resources: ["/assets/curriculum/communication-templates.pdf"],
    guidance:
      "Educator notes: practice assertive language and reporting; use scripted prompts to scaffold conversation.",
  },
];

export default employmentModules;
