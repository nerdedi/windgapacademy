// Game unlock logic based on ACSF level
export function canUnlockGame(learner: { acsfLevel: number }, game: { acsfLevel: number }) {
  return learner.acsfLevel >= game.acsfLevel;
}
