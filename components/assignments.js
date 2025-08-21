// Simulate database (replace with Firestore in production)
// Firestore integration for assignments

// In-memory assignments store
const assignments = {};

export function assignTask(username, task) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(task);
  // Log for educator review
  if (window.logEducatorAction) window.logEducatorAction({ type: "assignTask", username, task });
  alert(
    `Task "${task}" assigned to ${username}. This action is private and logged for educator review.`,
  );
}

export function uploadFile(username, fileName) {
  if (!assignments[username]) assignments[username] = [];
  assignments[username].push(`File uploaded: ${fileName}`);
  // Log for educator review
  if (window.logEducatorAction)
    window.logEducatorAction({ type: "uploadFile", username, fileName });
  alert(
    `File "${fileName}" uploaded to ${username}. This action is private and logged for educator review.`,
  );
}

export function listTasks(username) {
  // Privacy notice for educator
  if (window.showPrivacyNotice)
    window.showPrivacyNotice(
      "All assigned tasks and uploads are private and only used for supporting learners.",
    );
  return assignments[username] || [];
}
