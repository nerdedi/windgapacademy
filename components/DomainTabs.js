export function showDomainTabs(container, domain = "literacy") {
  const domains = [
    "literacy",
    "numeracy",
    "communication",
    "digital",
    "life-skills",
    "money-skills",
    "employability",
    "virtual-world",
  ];
  function tabButton(label, value, active) {
    return `<button class="domain-tab${active ? " active" : ""} btn-secondary" aria-label="${label}" data-domain="${value}">${label}</button>`;
  }
  container.innerHTML = `
  <nav aria-label="Domain Tabs" class="mb-4">
      ${domains
        .map((d) =>
          tabButton(
            d.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            d,
            d === domain,
          ),
        )
        .join("")}
    </nav>
    <div id="interactive-scenario" aria-live="polite"></div>
  `;
  // Tab click logic
  var tabBtns = container.querySelectorAll(".domain-tab");
  if (tabBtns && tabBtns.length) {
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].addEventListener("click", function () {
        var selectedDomain = this.getAttribute("data-domain");
        for (var j = 0; j < tabBtns.length; j++) {
          tabBtns[j].classList.remove("active");
        }
        this.classList.add("active");
        if (window.launchInteractiveScenario) window.launchInteractiveScenario(selectedDomain);
      });
    }
  }
  // Launch initial scenario
  if (window.launchInteractiveScenario) window.launchInteractiveScenario(domain);
  window.launchInteractiveScenario = function (domain) {
    const scenarioDiv = document.getElementById("interactive-scenario");
    if (!scenarioDiv) return;
    // Australian characters and voices
    const characters = {
      literacy: {
        name: "Daisy",
        role: "Student President",
        intro: "G’day! I’m Daisy, your guide to reading and writing, Aussie style.",
      },
      numeracy: {
        name: "Winnie",
        role: "AI Mentor",
        intro: "Hello! I’m Winnie. Let’s tackle maths the Australian way.",
      },
      communication: {
        name: "Andy",
        role: "Chancellor",
        intro: "Welcome! I’m Andy. Let’s chat about communication, just like we do Down Under.",
      },
      digital: {
        name: "Natalie",
        role: "Head of Education",
        intro: "Hi! I’m Natalie. I’ll show you how Aussies use digital tools and stay safe online.",
      },
      "life-skills": {
        name: "Daisy",
        role: "Student President",
        intro: "G’day! I’m Daisy. Let’s build your independence for Aussie life.",
      },
      "money-skills": {
        name: "Winnie",
        role: "AI Mentor",
        intro: "Hello! I’m Winnie. Let’s learn about money and budgeting in Australia.",
      },
      employability: {
        name: "Andy",
        role: "Chancellor",
        intro: "Welcome! I’m Andy. I’ll help you get ready for work in Australia.",
      },
      "virtual-world": {
        name: "Natalie",
        role: "Head of Education",
        intro: "Hi! I’m Natalie. Let’s thrive in virtual environments, Aussie style.",
      },
    };

    const char = characters[domain];
    if (!char) {
      scenarioDiv.innerHTML = "<p>Unknown domain.</p>";
      return;
    }

    const avatarHtml = `
      <div>
  <img src='assets/images/user_avatar.png' alt='Your Avatar' class='w-20 h-20 rounded-full border-2 border-green-400 card smooth-shadow' loading="lazy" />
      </div>
    `;

    // Scenario content (Australian English)
    scenarioDiv.innerHTML = `
      <h4>Interactive Scenario: ${char.name} (${char.role})</h4>
      <p>${char.intro}</p>
      ${avatarHtml}
  <div class='mt-3'>
        <strong>Visual Demonstration:</strong>
        <ul>
          <li>See your avatar and the academy character interact in an Australian classroom scene.</li>
          <li>Concepts for <strong>${domain.replace("-", " ")}</strong> are shown visually and explained step-by-step, using Australian examples and voices.</li>
          <li>Try activities, answer questions, and get feedback from your chosen Aussie character.</li>
        </ul>
        <button onclick='window.route("avatar-builder")'>Customise Your Avatar</button>
        <button onclick='scenarioDiv.innerHTML = ""'>Close Scenario</button>
      </div>
    `;
  };
  // Show the scenario for the selected domain
  container.innerHTML = '<div id="interactive-scenario"></div>';
  window.launchInteractiveScenario(domain);
}
