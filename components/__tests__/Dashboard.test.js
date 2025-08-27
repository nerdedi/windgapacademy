import { showDashboard } from '../Dashboard.js';

describe('showDashboard', () => {
  it('should render dashboard content and advanced features', () => {
    const container = document.createElement('div');
    showDashboard(container, {});
    // Check for i18n
    expect(container.innerHTML).toMatch(/Dashboard|Panel/);
    // Check for achievements
    expect(container.innerHTML).toContain('Achievements');
    // Check for feedback form
    expect(container.querySelector('#feedback-form')).not.toBeNull();
  // Check for progress charts section
  expect(container.querySelector('#dashboard-charts')).not.toBeNull();
    // Check for progress bar
    expect(container.querySelector('#progress-bar')).not.toBeNull();
    // Check for recent activities
    expect(container.innerHTML).toContain('Recent Activities');
    // Check for theme and language selectors
    expect(container.querySelector('#theme-select')).not.toBeNull();
    expect(container.querySelector('#lang-select')).not.toBeNull();
    // Check for help button
    expect(container.querySelector('#dashboard-help')).not.toBeNull();
  });
});
