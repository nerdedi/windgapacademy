
import { showAvatarBuilder } from '../AvatarBuilder.js';

describe('showAvatarBuilder', () => {
  it('should render avatar builder UI', () => {
    const container = document.createElement('div');
    showAvatarBuilder(container);
    expect(container.innerHTML).toContain('Avatar');
  });
});
