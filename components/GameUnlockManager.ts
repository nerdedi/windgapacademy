// Game unlock logic based on ACSF level
export function canUnlockGame(learner: { acsfLevel: number }, game: { acsfLevel: number }) {
  if (!learner || !game) return false; // Safety check for undefined values
  return learner.acsfLevel >= game.acsfLevel; // Unlock if learner's ACSF level meets or exceeds game's level requirement
}
