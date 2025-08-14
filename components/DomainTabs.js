// Domain Tabs Module
// Tabbed navigation for all learning domains

export function showDomainTabs(container, domain, userId = null) {
  // Pure function for lesson plan state
  function getLessonPlan(domain, plans) {
  // Lesson plan for each domain is independent; editing one does not affect others.
    return plans[domain] || `Sample lesson plan for ${domain} (editable by educator).`;
  }
  // Load lesson plans from Firebase (pseudo-code)
  // import { getLessonPlans, saveLessonPlan } from '../firebase.js';
  // getLessonPlans(domain, userId).then(plans => { ...display plans... });
  const domains = [
    { key: 'literacy', label: '📚 Literacy' },
    { key: 'numeracy', label: '🔢 Numeracy' },
    { key: 'communication', label: '💬 Communication' },
    { key: 'digital', label: '💻 Digital Skills' },
    { key: 'life-skills', label: '🏠 Life Skills' },
    { key: 'money-skills', label: '💰 Money Skills' },
    { key: 'employability', label: '💼 Employability' },
    { key: 'virtual-world', label: '🌏 Virtual World' }
  ];
  container.innerHTML = `
      <nav id="domain-tabs">
        ${domains.map(d => `<button class='tab-btn${d.key === domain ? ' active' : ''}' onclick='window.route("domain-tabs", { domain: "${d.key}" })'>${d.label}</button>`).join('')}
      </nav>
      <div class='tab-content au-section'>
        <h3>${domains.find(d => d.key === domain)?.label || ''}</h3>
        <p>Welcome to the ${domain.replace('-', ' ')} domain. Select a game or lesson to begin.</p>
        <div id='lesson-plans'>
          <h4>Lesson Plan (${domain.charAt(0).toUpperCase() + domain.slice(1)} - Six-Module Framework)</h4>
          <button onclick='editLessonPlan()'>Edit Lesson Plan</button>
          <div id='lesson-plan-content'>
            <ol>
              <li><strong>Identification & Assessment:</strong> Recognise learning difficulties/disorders, classroom presentation, and assessment (Module 1).</li>
              <li><strong>Processing Skills:</strong> Develop phonological, working memory, orthographic, and number sense (Module 2).</li>
              <li><strong>Intervention:</strong> Apply RTI, modify tasks, and use screening/assessment (Module 3).</li>
              <li><strong>Explicit Teaching:</strong> Deliver high-quality initial literacy/numeracy instruction, use resources for initial stages (Module 4).</li>
              <li><strong>Classroom Strategies & Universal Design:</strong> Use best practice accommodations, universal design for learning, and flexible supports (Module 5).</li>
              <li><strong>Emotional Wellbeing:</strong> Support resilience, wellbeing, and use case studies for effective support (Module 6).</li>
            </ol>
            <ul>
              <li><strong>Outcomes:</strong> Progress in Literacy, Numeracy, and Daily Living Skills (LLND Curriculum).</li>
              <li><strong>Aims:</strong> Develop executive functioning, independence, and self-management (CSFW).</li>
              <li><strong>Indicators:</strong> Assessment results from activities of daily living, executive functioning, and curriculum-aligned tasks.</li>
            </ul>
            <p>All lesson plans are aligned to the six-module framework and can be adapted for individual needs, including students with disability. Universal design and emotional wellbeing are prioritised.</p>
          </div>
          <p>Educator Notes: Reference the six-module framework, adapt activities for Australian schooling, and use evidence-based inclusive practices.</p>
        </div>
        <button onclick="window.route('${domain}-game')">Launch Game</button>
        <button onclick="window.route('dashboard')">Return to Dashboard</button>
      </div>
  // End of function
  window.editLessonPlan = function() {
    const content = document.getElementById('lesson-plan-content');
    const currentPlan = content.textContent;
    const newPlan = prompt('Edit lesson plan:', currentPlan);
    if (newPlan !== null) {
      content.textContent = setLessonPlan(domain, newPlan);
      // import { saveLessonPlan } from '../firebase.js';
      // saveLessonPlan(domain, userId, newPlan);
    }
  };

  // Pure function to set lesson plan
  function setLessonPlan(domain, plan) {
  // Setting a lesson plan only updates the selected domain's plan.
    return plan;
  }
  };
  `;
}
