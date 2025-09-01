
import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const winnieVoiceLines = {
  welcome: {
    text: "Hi, I'm Winnie! Ready to play Winnie's Words? Let's learn and have fun together!",
    audio: "assets/winnie-voice/welcome.mp3"
  },
  correct: {
    text: "Great job! You found a letter! You're on a roll!",
    audio: "assets/winnie-voice/correct.mp3"
  },
  incorrect: {
    text: "Oops! That letter isn't in the phrase. Try again, superstar!",
    audio: "assets/winnie-voice/incorrect.mp3"
  },
  win: {
    text: "Congratulations! You solved the phrase! You're a language legend!",
    audio: "assets/winnie-voice/win.mp3"
  },
  lose: {
    text: "Better luck next time! Let's try again and keep learning!",
    audio: "assets/winnie-voice/lose.mp3"
  },
  bonus: {
    text: "Bonus Round! Double points if you guess the next phrase without missing a letter!",
    audio: "assets/winnie-voice/bonus.mp3"
  }
};

function playWinnieVoice(type) {
  const line = winnieVoiceLines[type];
  if (line && line.audio) {
    const sound = new Howl({ src: [line.audio], volume: 0.8 });
    sound.play();
    sound.on('end', () => {
      sound.unload();
    });
  }
}

const phrases = [
  'break the ice',
  'piece of cake',
  'hit the books',
  'under the weather',
  'once in a blue moon',
  'spill the beans',
  'back to square one',
  'let the cat out of the bag',
  'costs an arm and a leg',
  'the ball is in your court'
];

export function WinniesWordsGameShow() {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[Math.floor(Math.random() * phrases.length)]);
  const [revealed, setRevealed] = useState(Array(currentPhrase.replace(/ /g, '').length).fill(false));
  const [missed, setMissed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost', 'bonus'
  const [winnieSpeech, setWinnieSpeech] = useState(winnieVoiceLines.welcome.text);
  const [usedLetters, setUsedLetters] = useState([]);
  const [bonusScore, setBonusScore] = useState(0);

  useEffect(() => {
    setWinnieSpeech(winnieVoiceLines.welcome.text);
    playWinnieVoice('welcome');
  }, []);

  const phraseLetters = currentPhrase.replace(/ /g, '').split('');

  function handleLetterClick(letter, idx) {
    if (gameState !== 'playing' || usedLetters.includes(letter)) return;
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
      setWinnieSpeech(winnieVoiceLines.correct.text);
      playWinnieVoice('correct');
      if (newRevealed.every(Boolean)) {
        setGameState('won');
        setWins(wins + 1);
        setWinnieSpeech(winnieVoiceLines.win.text);
        playWinnieVoice('win');
      }
    } else {
      setMissed(missed + 1);
      setWinnieSpeech(winnieVoiceLines.incorrect.text);
      playWinnieVoice('incorrect');
      if (missed + 1 >= 5) {
        setGameState('lost');
        setLosses(losses + 1);
        setWinnieSpeech(winnieVoiceLines.lose.text);
        playWinnieVoice('lose');
      }
    }
  }

  function handleRestart() {
    const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(newPhrase);
    setRevealed(Array(newPhrase.replace(/ /g, '').length).fill(false));
    setMissed(0);
    setGameState('playing');
    setUsedLetters([]);
    setWinnieSpeech(winnieVoiceLines.welcome.text);
    setBonusScore(0);
    playWinnieVoice('welcome');
  }

  function handleBonusRound() {
    setGameState('bonus');
    setWinnieSpeech(winnieVoiceLines.bonus.text);
    playWinnieVoice('bonus');
    setBonusScore(0);
    setRevealed(Array(currentPhrase.replace(/ /g, '').length).fill(false));
    setUsedLetters([]);
    setMissed(0);
  }

  function handleBonusLetter(letter) {
    if (gameState !== 'bonus' || usedLetters.includes(letter)) return;
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
      playWinnieVoice('correct');
      if (newRevealed.every(Boolean)) {
        setGameState('won');
        setWins(wins + 1);
        setWinnieSpeech('Bonus round ended!');
      }
    } else {
      setGameState('lost');
      setWinnieSpeech('Bonus round ended!');
    }
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="winnies-words-game-show max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        <img src="/assets/winnie-mascot.png" alt="Winnie Mascot" className="w-16 h-16 mr-4" />
        <div className="speech-bubble bg-yellow-100 p-3 rounded-xl text-lg font-semibold animate-bounce-in">
          {winnieSpeech}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Phrase:</h2>
        <div className="flex flex-wrap gap-2 text-2xl font-mono">
          {currentPhrase.split('').map((char, idx) =>
            char === ' ' ? (
              <span key={idx} className="mx-2"> </span>
            ) : (
              <span key={idx} className={revealed[phraseLetters.indexOf(char)] ? 'text-green-600' : 'text-gray-400'}>
                {revealed[phraseLetters.indexOf(char)] ? char : '_'}
              </span>
            )
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Choose a letter:</h3>
        <div className="grid grid-cols-13 gap-1">
          {alphabet.map((letter, idx) => (
            <button
              key={letter}
              className={`px-2 py-1 rounded ${usedLetters.includes(letter) ? 'bg-gray-300' : 'bg-blue-200 hover:bg-blue-400'} font-bold`}
              disabled={usedLetters.includes(letter) || gameState !== 'playing'}
              onClick={() => handleLetterClick(letter, idx)}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex justify-between">
        <span>Missed: {missed} / 5</span>
        <span>Wins: {wins} | Losses: {losses}</span>
      </div>
      {gameState === 'won' && (
        <div className="text-green-700 font-bold mb-2">You won! Play again?</div>
      )}
      {gameState === 'lost' && (
        <div className="text-red-700 font-bold mb-2">You lost! Try again?</div>
      )}
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={handleRestart}>Restart</button>
        <button className="btn btn-secondary" onClick={handleBonusRound}>Bonus Round!</button>
      </div>
      {gameState === 'bonus' && (
        <div className="mt-4">
          <h3 className="font-semibold">Bonus Round! Double points for correct guesses!</h3>
          <div className="grid grid-cols-13 gap-1">
            {alphabet.map((letter, idx) => (
              <button
                key={letter}
                className={`px-2 py-1 rounded ${usedLetters.includes(letter) ? 'bg-gray-300' : 'bg-purple-200 hover:bg-purple-400'} font-bold`}
                disabled={usedLetters.includes(letter) || gameState !== 'bonus'}
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
