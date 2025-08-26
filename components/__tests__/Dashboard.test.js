import { showDashboard } from '../Dashboard.js';

describe('showDashboard', () => {
  it('should render dashboard content', () => {
    const container = document.createElement('div');
    showDashboard(container, {});
    expect(container.innerHTML).toContain('Dashboard');
  });
});
