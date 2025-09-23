import { useState } from "react";

import { useGamification } from "../src/contexts/GamificationContext.js";
import { useLesson } from "../src/contexts/LessonContext.js";

import GameLauncher from "./GameLauncher.js";

export default function UnderstandingCheck() {
  const { state, setUnderstood } = useLesson();
  const { addXP, awardBadge, unlockGame } = useGamification();
  const [showLauncher, setShowLauncher] = useState(false);

  const onUnderstood = async () => {
    setUnderstood(true);
    addXP(50);
    awardBadge("Fluency Starter");
    unlockGame("fluencyGame1");
    setShowLauncher(true);
  };

  const onNeedHelp = () => {
    setUnderstood(false);
    // optionally show extra support - for now we just console
    // eslint-disable-next-line no-console
    console.log("Learner requested help for", state.topic);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Understanding check"
      className="p-4 border rounded bg-white"
    >
      <p className="mb-3">Did you understand this lesson?</p>
      <div className="flex gap-3">
        <button onClick={onUnderstood} className="btn-primary">
          I understood
        </button>
        <button onClick={onNeedHelp} className="btn-secondary">
          I need help
        </button>
      </div>
      {showLauncher && <GameLauncher gameId="fluencyGame1" goal="Practice reading fluency" />}
    </div>
  );
}
