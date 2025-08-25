// Profile Component: View and edit learner details and accessibility preferences
export function showProfile(container, userData = {}) {
  container.innerHTML = `
    <section id="profile" aria-label="Profile">
      <h2>👤 Your Profile</h2>
      <form id="profile-form">
        <label for="profile-name">Name:</label>
        <input id="profile-name" type="text" value="${userData.name || ""}" aria-label="Name" />
        <label for="profile-accessibility">Accessibility Preferences:</label>
        <select id="profile-accessibility" aria-label="Accessibility Preferences">
          <option value="default">Default</option>
          <option value="dyslexia">Dyslexia Font</option>
          <option value="easyread">Easy Read</option>
        </select>
        <button type="submit">Save</button>
      </form>
      <div id="profile-feedback" aria-live="polite"></div>
    </section>
  `;
  document.getElementById("profile-form").onsubmit = function (e) {
    e.preventDefault();
    document.getElementById("profile-feedback").innerText = "Profile saved!";
    // TODO: Save profile data to Firestore
  };
    // Animate button and heading
    applyButtonAnimation(document.getElementById('profile-btn'));
    applyHeadingAnimation(document.getElementById('profile-heading'));
    // Accessibility
    setAriaAttributes(document.getElementById('profile'), { role: 'region', label: 'Profile' });
}
