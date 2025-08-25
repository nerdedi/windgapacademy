// Cypress E2E test: Main UI and button flow

describe('Windgap Academy Main UI Flow', () => {
  it('should load dashboard and navigate to all game modules', () => {
    cy.visit('/');
    cy.contains('Dashboard').should('be.visible');
    cy.get('button, a').each(($el) => {
      cy.wrap($el).click({ multiple: true, force: true });
    });
    cy.contains('Game').should('exist'); // Example: check game module loaded
  });
});
