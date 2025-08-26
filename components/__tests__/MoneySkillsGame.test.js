import { showMoneySkillsGame } from '../GameModules/MoneySkillsGame.js';

describe('showMoneySkillsGame', () => {
  it('should render money skills game UI', () => {
    const container = document.createElement('div');
    showMoneySkillsGame(container);
    expect(container.innerHTML).toContain('Money Skills');
// ...existing code...
});
  });
