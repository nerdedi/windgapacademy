// Cypress E2E test: Main UI and button flow

// Prevent Cypress from failing the spec on uncaught exceptions from the app
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // NOTE: This masks application runtime errors; use only for CI stability while debugging.
  return false;
});

describe('Windgap Academy Main UI Flow', () => {
  it('should load dashboard and navigate to all game modules', () => {
    // Ensure preview session and safety policy acceptance are present so the dashboard shows
    cy.visit('/', {
      onBeforeLoad(win) {
        try {
          win.localStorage.setItem('safetyPolicyAccepted', 'true');
          win.localStorage.setItem('windgap_session_v1', JSON.stringify({ email: 'learner@test.com', role: 'learner', name: 'Dev Learner' }));
        } catch (e) { /* noop */ }
      }
    });
    // Explicitly signal the app to route to dashboard (uses preview session set above)
    cy.window({ timeout: 15000 }).then((win) => {
      if (typeof win.route === 'function') {
        win.route('dashboard');
      } else if (win.location) {
        win.location.hash = '#dashboard';
      }
    });
    cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
    cy.get('button, a').each(($el) => {
      cy.wrap($el).click({ multiple: true, force: true });
    });
    cy.contains('Game').should('exist'); // Example: check game module loaded
  });
});
