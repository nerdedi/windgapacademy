import { Howl } from "howler";
import { useCallback, useEffect, useState } from "react";

const winnieVoiceLines = {
  welcome: {
    text: "Hi, I'm Winnie! Ready to play Winnie's Words? Let's learn and have fun together!",
    audio: "assets/winnie-voice/welcome.mp3",
  },
  correct: {
    text: "Great job! You found a letter! You're on a roll!",
    audio: "assets/winnie-voice/correct.mp3",
  },
  incorrect: {
    text: "Oops! That letter isn't in the phrase. Try again, superstar!",
    audio: "assets/winnie-voice/incorrect.mp3",
  },
  win: {
    text: "Congratulations! You solved the phrase! You're a language legend!",
    audio: "assets/winnie-voice/win.mp3",
  },
  lose: {
    text: "Better luck next time! Let's try again and keep learning!",
    audio: "assets/winnie-voice/lose.mp3",
  },
  bonus: {
    text: "Bonus Round! Double points if you guess the next phrase without missing a letter!",
    audio: "assets/winnie-voice/bonus.mp3",
  },
};

// Local storage key for persisting progress
const PROGRESS_KEY = "wg_progress";

function playWinnieVoice(type) {
  const line = winnieVoiceLines[type];
  if (line && line.audio) {
    const sound = new Howl({ src: [line.audio], volume: 0.8 });
    sound.play();
    sound.on("end", () => {
      sound.unload();
    });
  }
}

const phrases = [
  "break the ice",
  "piece of cake",
  "hit the books",
  "under the weather",
  "once in a blue moon",
  "spill the beans",
  "back to square one",
  "let the cat out of the bag",
  "costs an arm and a leg",
  "the ball is in your court",
];

// Load saved progress from localStorage
function loadProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load progress:", e);
  }
  return { wins: 0, losses: 0, totalPoints: 0 };
}

export function WinniesWordsGameShow() {
  // Load persisted progress on mount
  const [userProgress, setUserProgress] = useState(loadProgress);
  const [currentPhrase, setCurrentPhrase] = useState(
    phrases[Math.floor(Math.random() * phrases.length)],
  );
  const [revealed, setRevealed] = useState(
    Array(currentPhrase.replace(/ /g, "").length).fill(false),
  );
  const [missed, setMissed] = useState(0);
  const [wins, setWins] = useState(userProgress.wins);
  const [losses, setLosses] = useState(userProgress.losses);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'won', 'lost', 'bonus'
  const [winnieSpeech, setWinnieSpeech] = useState(winnieVoiceLines.welcome.text);
  const [usedLetters, setUsedLetters] = useState([]);
  const [bonusScore, setBonusScore] = useState(0);
  // ARIA live region announcement
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setWinnieSpeech(winnieVoiceLines.welcome.text);
    playWinnieVoice("welcome");
  }, []);

  // Persist progress to localStorage whenever wins/losses change
  useEffect(() => {
    const progress = { wins, losses, totalPoints: bonusScore };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    setUserProgress(progress);
  }, [wins, losses, bonusScore]);

  const phraseLetters = currentPhrase.replace(/ /g, "").split("");

  // Handler for letter guesses - memoized for keyboard listener
  const handleLetterGuess = useCallback((letter) => {
    const upperLetter = letter.toUpperCase();
    const lowerLetter = letter.toLowerCase();

    if (gameState !== "playing" || usedLetters.includes(lowerLetter)) return;

    let found = false;
    const newRevealed = [...revealed];
    phraseLetters.forEach((l, i) => {
      if (l.toLowerCase() === lowerLetter) {
        newRevealed[i] = true;
        found = true;
      }
    });
    setRevealed(newRevealed);
    setUsedLetters([...usedLetters, lowerLetter]);

    if (found) {
      setWinnieSpeech(winnieVoiceLines.correct.text);
      setAnnouncement(`Correct! The letter ${upperLetter} is in the phrase.`);
      playWinnieVoice("correct");
      if (newRevealed.every(Boolean)) {
        setGameState("won");
        setWins(w => w + 1);
        setWinnieSpeech(winnieVoiceLines.win.text);
        setAnnouncement("Congratulations! You won! You solved the phrase!");
        playWinnieVoice("win");
      }
    } else {
      const newMissed = missed + 1;
      setMissed(newMissed);
      setWinnieSpeech(winnieVoiceLines.incorrect.text);
      setAnnouncement(`Incorrect. The letter ${upperLetter} is not in the phrase. ${5 - newMissed} lives remaining.`);
      playWinnieVoice("incorrect");
      if (newMissed >= 5) {
        setGameState("lost");
        setLosses(l => l + 1);
        setWinnieSpeech(winnieVoiceLines.lose.text);
        setAnnouncement("Game over. Better luck next time!");
        playWinnieVoice("lose");
      }
    }
  }, [gameState, usedLetters, revealed, phraseLetters, missed]);

  // Keyboard input handler - allows typing letters directly
  useEffect(() => {
    if (gameState !== "playing") return;

    const onKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      // Only handle A-Z keys
      if (letter >= 'A' && letter <= 'Z' && letter.length === 1) {
        handleLetterGuess(letter);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameState, handleLetterGuess]);

  function handleLetterClick(letter, idx) {
    handleLetterGuess(letter);
  }

  function handleRestart() {
    const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(newPhrase);
    setRevealed(Array(newPhrase.replace(/ /g, "").length).fill(false));
    setMissed(0);
    setGameState("playing");
    setUsedLetters([]);
    setWinnieSpeech(winnieVoiceLines.welcome.text);
    setBonusScore(0);
    setAnnouncement("New game started! Guess the phrase.");
    playWinnieVoice("welcome");
  }

  function handleBonusRound() {
    setGameState("bonus");
    setWinnieSpeech(winnieVoiceLines.bonus.text);
    playWinnieVoice("bonus");
    setBonusScore(0);
    setRevealed(Array(currentPhrase.replace(/ /g, "").length).fill(false));
    setUsedLetters([]);
    setMissed(0);
  }

  function handleBonusLetter(letter) {
    if (gameState !== "bonus" || usedLetters.includes(letter)) return;
    let found = false;
    const newRevealed = [...revealed];
    phraseLetters.forEach((l, i) => {
      if (l.toLowerCase() === letter.toLowerCase()) {
        newRevealed[i] = true;
        found = true;
      }
    });
    setRevealed(newRevealed);
    setUsedLetters([...usedLetters, letter]);
    if (found) {
      setBonusScore(bonusScore + 2);
      setWinnieSpeech(winnieVoiceLines.correct.text);
      playWinnieVoice("correct");
      if (newRevealed.every(Boolean)) {
        setGameState("won");
        setWins(wins + 1);
        setWinnieSpeech("Bonus round ended!");
      }
    } else {
      setGameState("lost");
      setWinnieSpeech("Bonus round ended!");
    }
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <div className="winnies-words-game-show max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg" role="main" aria-label="Winnie's Words Game">
      {/* ARIA live region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <div className="flex items-center mb-4">
        <img src="/assets/winnie-mascot.png" alt="Winnie Mascot" className="w-16 h-16 mr-4" />
        <div className="speech-bubble bg-yellow-100 p-3 rounded-xl text-lg font-semibold animate-bounce-in" aria-live="polite">
          {winnieSpeech}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Phrase:</h2>
        <div className="flex flex-wrap gap-2 text-2xl font-mono" aria-label={`Phrase to guess: ${revealed.every(Boolean) ? currentPhrase : currentPhrase.split('').map((c, i) => c === ' ' ? ' ' : (revealed[phraseLetters.indexOf(c)] ? c : 'blank')).join('')}`}>
          {currentPhrase.split("").map((char, idx) =>
            char === " " ? (
              <span key={idx} className="mx-2" aria-hidden="true">
                {" "}
              </span>
            ) : (
              <span
                key={idx}
                className={
                  revealed[phraseLetters.indexOf(char)] ? "text-green-600" : "text-gray-400"
                }
                aria-label={revealed[phraseLetters.indexOf(char)] ? char : "blank"}
              >
                {revealed[phraseLetters.indexOf(char)] ? char : "_"}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Choose a letter (click or type):</h3>
        <div className="grid grid-cols-13 gap-1" role="group" aria-label="Letter buttons">
          {alphabet.map((letter, idx) => (
            <button
              key={letter}
              className={`px-2 py-1 rounded ${usedLetters.includes(letter) ? "bg-gray-300" : "bg-blue-200 hover:bg-blue-400 focus:ring-2 focus:ring-blue-500"} font-bold transition-colors`}
              disabled={usedLetters.includes(letter) || gameState !== "playing"}
              onClick={() => handleLetterClick(letter, idx)}
              aria-label={`Letter ${letter.toUpperCase()}${usedLetters.includes(letter) ? ', already guessed' : ''}`}
              aria-pressed={usedLetters.includes(letter)}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex justify-between" role="status" aria-live="polite">
        <span aria-label={`Lives remaining: ${5 - missed} out of 5`}>Lives: {"❤️".repeat(5 - missed)}{"🖤".repeat(missed)}</span>
        <span>
          Wins: {wins} | Losses: {losses}
        </span>
      </div>
      {gameState === "won" && (
        <div className="text-green-700 font-bold mb-2" role="alert">You won! Play again?</div>
      )}
      {gameState === "lost" && (
        <div className="text-red-700 font-bold mb-2" role="alert">You lost! The phrase was: "{currentPhrase}". Try again?</div>
      )}
      <div className="flex gap-2">
        <button
          className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-colors"
          onClick={handleRestart}
          aria-label="Start a new game"
        >
          {gameState === "playing" ? "Restart" : "Play Again"}
        </button>
        <button
          className="btn btn-secondary px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 transition-colors"
          onClick={handleBonusRound}
          disabled={gameState !== "won"}
          aria-label="Start bonus round for double points"
        >
          Bonus Round!
        </button>
      </div>
      {gameState === "bonus" && (
        <div className="mt-4">
          <h3 className="font-semibold">Bonus Round! Double points for correct guesses!</h3>
          <div className="grid grid-cols-13 gap-1">
            {alphabet.map((letter, idx) => (
              <button
                key={letter}
                className={`px-2 py-1 rounded ${usedLetters.includes(letter) ? "bg-gray-300" : "bg-purple-200 hover:bg-purple-400"} font-bold`}
                disabled={usedLetters.includes(letter) || gameState !== "bonus"}
                onClick={() => handleBonusLetter(letter)}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-2">Bonus Score: {bonusScore}</div>
        </div>
      )}
    </div>
  );
}
