import { generateReport } from "../report.js";

let assignments = {};

export function showEducatorDashboard(container) {
  // Modular UI templates
  function eduButton(label, id) {
    return `<button id="${id}" aria-label="${label}" title="${label}">${label}</button>`;
  }
  function helpButton() {
    return "<button id=\"educator-help\" aria-label=\"Help\" title=\"Help\">❓</button>";
  }
  function privacyNotice() {
    return "<div id=\"privacy-notice\" style=\"font-size:0.9em;color:#555;margin:8px 0;\">All educator actions are private and only used for supporting learners.</div>";
  }
  container.innerHTML = `
    <section id="educator-dashboard" aria-label="Educator Dashboard">
      <div class="flex justify-between items-center card smooth-shadow mb-4">
        <h2 class="text-2xl font-bold text-primary text-smooth">Educator Dashboard</h2>
        ${helpButton()}
      </div>
      ${privacyNotice()}
      <div class="module-summary au-section" aria-label="Module Summary">
  <h3 class="text-lg font-semibold mt-4 mb-2">Six-Module Framework for Supporting Students with Learning Difficulties</h3>
        <ol>
          <li><strong>Module 1:</strong> Identifying learning difficulties and disorders, classroom presentation, assessment and diagnosis.</li>
          <li><strong>Module 2:</strong> Underlying processing skills for academic success (phonological, working memory, orthographic, number sense).</li>
          <li><strong>Module 3:</strong> Response to intervention (RTI), classroom implementation, task modification, screening and assessment.</li>
          <li><strong>Module 4:</strong> High-quality initial teaching of literacy and numeracy, explicit instruction, resources for initial stages.</li>
          <li><strong>Module 5:</strong> Classroom strategies, universal design for learning, best practice accommodations.</li>
          <li><strong>Module 6:</strong> Emotional wellbeing, resiliency, case studies of effective support for students with SLDs.</li>
        </ol>
        <p>All lesson plans and classroom strategies are aligned to this framework and reflect best practice for supporting diverse learners.</p>
      </div>
      <div class="learner-profile au-section" aria-label="Learner Profile">
  <h3 class="text-lg font-semibold mt-4 mb-2">Learner Profile: Outcomes, Aims, and Indicators</h3>
        <ul>
          <li><strong>Outcomes:</strong> Progress in Literacy, Numeracy, and Daily Living Skills (LLND Curriculum).</li>
          <li><strong>Aims:</strong> Develop executive functioning, independence, and self-management (CSFW).</li>
          <li><strong>Indicators:</strong> Assessment results from activities of daily living, executive functioning, and curriculum-aligned tasks.</li>
        </ul>
      </div>
      <div class="assignment-management au-section" aria-label="Assignment Management">
  <h3 class="text-lg font-semibold mt-4 mb-2">Assignment Management</h3>
        <form id="add-assignment-form" aria-label="Add Assignment">
          <input type="text" id="assignment-title" placeholder="Assignment Title" aria-label="Assignment Title" required />
          <input type="text" id="assignment-desc" placeholder="Description" aria-label="Assignment Description" required />
          <button type="submit" aria-label="Add Assignment">Add Assignment</button>
        </form>
        <ul id="assignment-list" aria-label="Assignment List">
          ${
            Object.keys(assignments).length > 0
              ? Object.entries(assignments)
                  .map(([title, desc]) => `<li><strong>${title}:</strong> ${desc}</li>`)
                  .join("")
              : "<li>No assignments yet.</li>"
          }
        </ul>
      </div>
      <div class="report-section au-section" aria-label="Generate Report">
        <h3>Generate Learner Report</h3>
        <button id="generate-report" aria-label="Generate Report">Generate Report</button>
  <div id="report-output" class="mt-4"></div>
      </div>
  // Assignment form logic
  setTimeout(() => {
    const form = container.querySelector('#add-assignment-form');
    const assignmentList = container.querySelector('#assignment-list');
    if (form && assignmentList) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = form.querySelector('#assignment-title').value.trim();
        const desc = form.querySelector('#assignment-desc').value.trim();
        if (title && desc) {
          assignments[title] = desc;
          var html = '';
          for (var t in assignments) {
            if (assignments.hasOwnProperty(t)) {
              html += '<li><strong>' + t + ':</strong> ' + assignments[t] + '</li>';
            }
          }
          assignmentList.innerHTML = html;
          form.reset();
        }
      });
    }
    // Report generation logic
    const reportBtn = container.querySelector('#generate-report');
    const reportOutput = container.querySelector('#report-output');
    if (reportBtn && reportOutput) {
      reportBtn.addEventListener('click', function() {
        const report = generateReport(assignments);
        reportOutput.textContent = report;
      });
    }
  }, 0);
        <p>Profiles update automatically as learners complete activities and assessments.</p>
      </div>
      <div class="assessment-component au-section" aria-label="Assessment & Task Assignment">
  <h3 class="text-lg font-semibold mt-4 mb-2">Assessment & Task Assignment</h3>
        <label for="assessment-title">Send Assessment/Test/Form to Learner:</label>
        <input type="text" id="assessment-title" placeholder="Assessment Title" aria-label="Assessment Title" />
        <select id="assessment-urgency" aria-label="Assessment Urgency">
          <option value="normal">Normal</option>
          <option value="important">Important</option>
          <option value="urgent">Urgent</option>
        </select>
        ${eduButton("Send to Learner", "send-assessment", null)}
        <div id="assessment-status"></div>
      </div>
      ${eduButton("Return to Dashboard", "return-dashboard", null)}
      ${eduButton("Assign Literacy Lesson", "assign-literacy", null)}
      ${eduButton("Upload Resource", "upload-resource", null)}
      ${eduButton("Download NDIS Report PDF", "download-ndis", null)}
      <div id="progress-overview"></div>
      ${privacyNotice()}
  <div id="educator-prompt" class="mt-3" aria-live="polite"></div>
    </section>
  `;
  // Keyboard navigation for all buttons and inputs
  Array.from(container.querySelectorAll("button,input,select")).forEach((el) => {
    el.tabIndex = 0;
  });
  // Help/info button
  document.getElementById("educator-help").onclick = () => {
    alert(
      "The Educator Dashboard provides tools for lesson planning, assessment, and learner support. All actions are private and educator-reviewed.",
    );
  };
  // Button handlers
  document.getElementById("send-assessment").onclick = () => {
    const title = document.getElementById("assessment-title").value;
    const urgency = document.getElementById("assessment-urgency").value;
    if (!title) {
      document.getElementById("assessment-status").innerText = "Please enter an assessment title.";
      return;
    }
    window.sendNotificationToLearner(title, urgency);
    document.getElementById("assessment-status").innerText =
      `Assessment "${title}" sent with urgency: ${urgency}.`;
  };
  document.getElementById("return-dashboard").onclick = () => window.route("dashboard");
  document.getElementById("assign-literacy").onclick = () =>
    window.assignTask("learner1", "Literacy Lesson");
  document.getElementById("upload-resource").onclick = () =>
    window.uploadFile("learner1", "resource.pdf");
  document.getElementById("download-ndis").onclick = () =>
    window.generateNDISReport({ learner: "learner1" });
  // Rotating educational prompt
  const prompts = [
    "Tip: Use the six-module framework for lesson planning.",
    "Tip: Profiles update automatically as learners progress.",
    "Tip: All educator actions are private and logged for review.",
    "Tip: Download NDIS reports for learner support.",
  ];
  let promptIndex = 0;
  function showPrompt() {
    document.getElementById("educator-prompt").textContent = prompts[promptIndex % prompts.length];
    promptIndex++;
    setTimeout(showPrompt, 7000);
  }
  showPrompt();
}
export function assignTask(username, task) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(task);
  alert(`Task "${task}" assigned to ${username}`);
}
export function uploadFile(username, fileName) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(`File uploaded: ${fileName}`);
  alert(`File "${fileName}" uploaded to ${username}`);
}
export function generateNDISReport(data) {
  generateReport(data);
}

// ...existing code...
