import { showDigitalSkillsGame } from "../GameModules/DigitalSkillsGame.js";

describe("showDigitalSkillsGame", () => {
  it("should render digital skills game UI and advanced features", () => {
    const container = document.createElement("div");
    showDigitalSkillsGame(container);
    // Check for i18n
    expect(container.innerHTML).toMatch(
      /Digital Skills|Juego de Habilidades Digitales|لعبة المهارات الرقمية/,
    );
    // Simulate clicking settings to open modal
    const settingsBtn = container.querySelector("#settings-btn");
    if (settingsBtn) settingsBtn.click();
    // Check for settings modal and buttons
    const modal = container.querySelector("#settings-modal");
    expect(modal).not.toBeNull();
    expect(modal.querySelector("#onboarding-btn")).not.toBeNull();
    expect(modal.querySelector("#faq-btn")).not.toBeNull();
    expect(modal.querySelector("#backup-btn")).not.toBeNull();
    expect(modal.querySelector("#sync-btn")).not.toBeNull();
    // Check for challenge logic
    expect(container.querySelector("#digital-challenge")).not.toBeNull();
    // Check for accessibility
    expect(container.querySelector("#settings-btn")).not.toBeNull();
  });
});
