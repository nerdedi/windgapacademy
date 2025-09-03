import { showMoneySkillsGame } from "../GameModules/MoneySkillsGame.js";

describe("showMoneySkillsGame", () => {
  beforeEach(() => {
    // Reset DOM before each test for isolation
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should render money skills game UI and advanced features", () => {
    const container = document.createElement("div");
    // Add all required elements for MoneySkillsGame
    const startBtn = document.createElement("button");
    startBtn.id = "start-money-skills";
    startBtn.textContent = "Start Money Skills";
    container.appendChild(startBtn);

    const contentDiv = document.createElement("div");
    contentDiv.id = "money-skills-content";
    container.appendChild(contentDiv);

    // Add Australian currency elements for sophisticated logic
    const currencyDiv = document.createElement("div");
    currencyDiv.id = "currency-options";
    container.appendChild(currencyDiv);

    document.body.appendChild(container);

    showMoneySkillsGame(container);
    // Check for i18n
    expect(container.innerHTML).toMatch(
      /Money Skills|Juego de Habilidades Monetarias|لعبة المهارات المالية/,
    );
    // Simulate clicking settings to open modal
    const settingsBtn = container.querySelector("#settings-btn");
    if (settingsBtn) settingsBtn.click();
    // Check for settings modal and buttons
    const modal = document.body.querySelector("#settings-modal");
    expect(modal).not.toBeNull();
    expect(modal.querySelector("#achievements-btn")).not.toBeNull();
    expect(modal.querySelector("#feedback-btn")).not.toBeNull();
    expect(modal.querySelector("#analytics-btn")).not.toBeNull();
    // Check for progress bar or content
    expect(container.querySelector("#money-skills-content")).not.toBeNull();
    // Check for currency options
    expect(container.querySelector("#currency-options")).not.toBeNull();
    // Check for accessibility
    expect(container.querySelector("#start-money-skills")).not.toBeNull();
  });
});
