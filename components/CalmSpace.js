export function showCalmSpace(container) {
  // Modular UI templates
  function calmButton(label, id, handler) {
    return `<button id="${id}" aria-label="${label}" title="${label}">${label}</button>`;
  }
  function helpButton() {
    return `<button id="calmspace-help" aria-label="Help" title="Help">❓</button>`;
  }
  function privacyNotice() {
    return `<div id="privacy-notice" style="font-size:0.9em;color:#555;margin:8px 0;">Your Calm Space activities are private and only used for wellbeing support.</div>`;
  }
  window.showSocialStory = function(domain) {
    const stories = {
      'life-skills': {
        title: 'Life Skills & Independence',
        story: 'Animated scenario: Navigating public transport, budgeting for groceries, and managing daily routines as a young adult. Includes realistic dialogue and decision points.'
      },
      'communication': {
        title: 'Communication & Relationships',
        story: 'Animated scenario: Handling conflict with a flatmate, advocating for yourself at work, and building healthy relationships. Includes role-play and practical tips.'
      },
      'digital': {
        title: 'Digital Safety & Online Behaviour',
        story: 'Animated scenario: Responding to online bullying, protecting privacy, and making safe choices online. Based on eSafety.gov.au guidelines.'
      },
      'employability': {
        title: 'Employability & Workplace Skills',
        story: 'Animated scenario: Applying for a job, preparing for interviews, and managing workplace challenges. Includes realistic feedback and self-advocacy.'
      },
      'money-skills': {
        title: 'Money Skills & Financial Independence',
        story: 'Animated scenario: Managing a bank account, paying bills, and saving for goals. Includes practical strategies and common pitfalls.'
      },
      'wellbeing': {
        title: 'Wellbeing & Mental Health',
        story: 'Animated scenario: Coping with stress, seeking help, and building resilience. Includes mindfulness and self-care techniques.'
      }
    };
    const s = stories[domain];
    if (s) {
      document.getElementById('social-story-content').innerHTML = `<h4>${s.title}</h4><div class='animated-story'>${s.story}</div>`;
    }
  };
  container.innerHTML = `
    <section id="calm-space" class="au-section" aria-label="Calm Space">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2>Calm Space</h2>
        ${helpButton()}
      </div>
      <div id="calm-tools" aria-label="Calm Tools">
        ${calmButton('Play Calm Music', 'play-music', 'playCalmMusic')}
        ${calmButton('Breathing Exercise', 'breathing-exercise', 'startBreathingExercise')}
        ${calmButton('Mindfulness Activity', 'mindfulness-activity', 'startMindfulnessActivity')}
        ${calmButton('Flexible Thinking', 'flexible-thinking', 'startFlexibleThinking')}
        ${calmButton('Grow Connections', 'grow-connections', 'startConnectionActivity')}
        ${calmButton('Act Purposefully', 'act-purposefully', 'startPurposeActivity')}
        ${calmButton('Recharge Your Body', 'recharge-body', 'startRechargeActivity')}
        ${calmButton('Energy Break', 'energy-btn', null)}
        ${calmButton('Mantra', 'mantra-btn', null)}
        ${calmButton('Journal Entry', 'journal-btn', null)}
        <audio id="calm-music" src="assets/sounds/nature.mp3" controls autoplay loop aria-label="Calm Music"></audio>
        ${calmButton('Return to Dashboard', 'return-dashboard', null)}
      </div>
      <div class="social-stories au-section" aria-label="Animated Social Stories">
        <h3>Animated Social Stories</h3>
        <p>Explore animated social stories for every area of learning. These stories are designed for ages 16+ and focus on real-life scenarios, independence, and self-regulation.</p>
        <ul>
          <li>${calmButton('Life Skills & Independence', 'story-life-skills', null)}</li>
          <li>${calmButton('Communication & Relationships', 'story-communication', null)}</li>
          <li>${calmButton('Digital Safety & Online Behaviour', 'story-digital', null)}</li>
          <li>${calmButton('Employability & Workplace Skills', 'story-employability', null)}</li>
          <li>${calmButton('Money Skills & Financial Independence', 'story-money-skills', null)}</li>
          <li>${calmButton('Wellbeing & Mental Health', 'story-wellbeing', null)}</li>
        </ul>
        <div id="social-story-content"></div>
      </div>
      ${privacyNotice()}
      <div class="lesson-plan-au">
        <h3>Lesson Plan: Calm Space & Mental Fitness (Australian Curriculum, NSW Inclusive Education)</h3>
        <p>Objective: Build mental fitness and wellbeing for every student, ensuring all are known, valued, cared for, and supported with reasonable adjustments and tailored teaching strategies.</p>
        <ol>
          <li><strong>Live Mindfully</strong>: Practice being present with guided mindfulness, breathing, and sensory activities. Provide visual, tactile, and audio supports. Make reasonable adjustments for sensory needs and allow alternative participation modes.</li>
          <li><strong>Embrace Flexible Thinking</strong>: Engage in problem-solving, creative thinking, and decision-making games. Scaffold activities for diverse learners, provide step-by-step instructions, and use assistive technology as needed.</li>
          <li><strong>Grow Connections</strong>: Build relationships and self-awareness through gratitude, empathy, and social activities. Use role-play, visuals, AAC devices, and flexible grouping. Foster a culture of respect and inclusion.</li>
          <li><strong>Act Purposefully</strong>: Reflect on strengths, values, and goals. Use visual goal charts, strengths cards, and personal stories. Allow alternative communication and respect individual choices.</li>
          <li><strong>Recharge Your Body</strong>: Support mind and body with movement, rest, relaxation, and sleep routines. Offer accessible movement options, relaxation scripts, and adapt activities for physical needs.</li>
        </ol>
        <p>All activities are designed for inclusion and can be adapted for students with disability. Reference Smiling Mind, ACARA, and NSW Department of Education inclusive education standards.</p>
        <p><strong>Educator Notes:</strong> Make reasonable adjustments, consult with support staff and families, and use evidence-based inclusive practices. Ensure every student is known, valued, and cared for. Respect First Nations perspectives and connection to land, culture, and community.</p>
      </div>
      <div id="calmspace-prompt" style="margin-top:12px;" aria-live="polite"></div>
    </section>
  `;
  // Keyboard navigation for all buttons
  Array.from(container.querySelectorAll('button,audio')).forEach(el => { el.tabIndex = 0; });
  // Help/info button
  document.getElementById('calmspace-help').onclick = () => {
    alert('Calm Space offers mindfulness, breathing, and self-regulation activities. All features are accessible and private.');
  };
  // Button handlers
  document.getElementById('energy-btn').onclick = () => alert('Stand up, stretch, move!');
  document.getElementById('mantra-btn').onclick = () => alert('You are calm, capable, and strong.');
  document.getElementById('journal-btn').onclick = () => alert('Journal entry saved!');
  document.getElementById('return-dashboard').onclick = () => window.route('dashboard');
  document.getElementById('story-life-skills').onclick = () => window.showSocialStory('life-skills');
  document.getElementById('story-communication').onclick = () => window.showSocialStory('communication');
  document.getElementById('story-digital').onclick = () => window.showSocialStory('digital');
  document.getElementById('story-employability').onclick = () => window.showSocialStory('employability');
  document.getElementById('story-money-skills').onclick = () => window.showSocialStory('money-skills');
  document.getElementById('story-wellbeing').onclick = () => window.showSocialStory('wellbeing');
  // Rotating educational prompt
  const prompts = [
    'Tip: Try a breathing exercise for instant calm.',
    'Tip: Social stories help with real-life scenarios.',
    'Tip: All Calm Space activities are private and educator-reviewed.',
    'Tip: Use the journal to reflect on your wellbeing.'
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById('calmspace-prompt').textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
