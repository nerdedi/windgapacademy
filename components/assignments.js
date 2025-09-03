// Render assignments dashboard/module
export function showAssignments(app, userId) {
  app.innerHTML = `
    <section class="card">
      <h2 class="text-2xl font-bold mb-4" style="color:#A32C2B">Assignments</h2>
      <div id="assignment-list"></div>
      <button class="btn-primary mt-4" onclick="window.route('dashboard')">Back to Dashboard</button>
    </section>
  `;
  // Render user's assignments
  const list = document.getElementById("assignment-list");
  if (list) {
    const tasks = userId ? listTasks(userId) : [];
    if (tasks.length === 0) {
      list.innerHTML = "<p>No assignments found.</p>";
    } else {
      list.innerHTML = "<ul>" + tasks.map((t) => `<li>${t}</li>`).join("") + "</ul>";
    }
  }
}
// Simulate database (replace with Firestore in production)
// Firestore integration for assignments

// In-memory assignments store
const assignments = {};

export function assignTask(username, task) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(task);
  // Log for educator review
  if (window && window.logEducatorAction)
    window.logEducatorAction({ type: "assignTask", username, task });
  alert(
    `Task "${task}" assigned to ${username}. This action is private and logged for educator review.`,
  );
}

export function uploadFile(username, fileName) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(`File uploaded: ${fileName}`);
  // Log for educator review
  if (window && window.logEducatorAction)
    window.logEducatorAction({ type: "uploadFile", username, fileName });
  alert(
    `File "${fileName}" uploaded to ${username}. This action is private and logged for educator review.`,
  );
}

export function listTasks(username) {
  // Privacy notice for educator
  if (window && window.showPrivacyNotice)
    window.showPrivacyNotice(
      "All assigned tasks and uploads are private and only used for supporting learners.",
    );
  return assignments[username] || [];
}
