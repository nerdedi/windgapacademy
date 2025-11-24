import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AlphabetSoundsActivity() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const letters = [
    { letter: "A", sound: "ay", word: "Apple", emoji: "🍎" },
    { letter: "B", sound: "buh", word: "Ball", emoji: "⚽" },
    { letter: "C", sound: "kuh", word: "Cat", emoji: "🐱" },
    { letter: "D", sound: "duh", word: "Dog", emoji: "🐕" },
    { letter: "E", sound: "eh", word: "Egg", emoji: "🥚" },
    { letter: "F", sound: "fuh", word: "Fish", emoji: "🐟" },
    { letter: "G", sound: "guh", word: "Goat", emoji: "🐐" },
    { letter: "H", sound: "huh", word: "Hat", emoji: "👒" },
  ];

  const playSound = (letter) => {
    setSelectedLetter(letter);
    setCurrentSound(letter.sound);
    // In a real app, you&apos;d play audio here
    setTimeout(() => setCurrentSound(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">🔤 Alphabet Sounds</h3>
        <div className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold">
          Score: {score}
        </div>
      </div>

      {currentSound && (
        <div className="bg-pink-500 text-white p-4 rounded-2xl mb-6 text-center font-bold animate-pulse">
          🔊 "{currentSound}" sound
        </div>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {letters.map((item) => (
          <button
            key={item.letter}
            onClick={() => playSound(item)}
            className={`${
              selectedLetter?.letter === item.letter
                ? "bg-pink-500 text-white scale-110"
                : "bg-white hover:bg-pink-50"
            } p-6 rounded-2xl border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 shadow-lg hover:scale-105`}
          >
            <div className="text-3xl font-bold mb-2">{item.letter}</div>
            <div className="text-2xl mb-1">{item.emoji}</div>
            <div className="text-sm font-medium">{item.word}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 font-medium">Click on letters to hear their sounds!</p>
      </div>
    </div>
  );
}

function SightWordsActivity() {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const sightWords = [
    { word: "the", difficulty: "easy" },
    { word: "and", difficulty: "easy" },
    { word: "you", difficulty: "easy" },
    { word: "that", difficulty: "medium" },
    { word: "with", difficulty: "medium" },
    { word: "have", difficulty: "medium" },
    { word: "this", difficulty: "medium" },
    { word: "will", difficulty: "hard" },
    { word: "your", difficulty: "hard" },
    { word: "from", difficulty: "hard" },
  ];

  const checkWord = () => {
    const isCorrect = userInput.toLowerCase() === sightWords[currentWord].word;
    if (isCorrect) {
      setScore(score + 10);
    }
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setUserInput("");
      setCurrentWord((currentWord + 1) % sightWords.length);
    }, 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">👁️ Sight Words Practice</h3>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="mb-6">
          <div
            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4 ${getDifficultyColor(sightWords[currentWord].difficulty)}`}
          >
            {sightWords[currentWord].difficulty.toUpperCase()}
          </div>
          <div className="text-6xl font-bold text-gray-800 mb-6 tracking-wider">
            {sightWords[currentWord].word.toUpperCase()}
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 mb-4">Type the word you see:</p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="border-2 border-gray-300 rounded-xl p-4 text-2xl font-bold text-center w-64 mx-auto"
              placeholder="Type here..."
              onKeyPress={(e) => e.key === "Enter" && checkWord()}
            />
            <div>
              <button
                onClick={checkWord}
                disabled={!userInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Check Word
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`p-6 rounded-2xl font-bold text-xl ${
              userInput.toLowerCase() === sightWords[currentWord].word
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {userInput.toLowerCase() === sightWords[currentWord].word
              ? "🎉 Correct! Well done!"
              : `❌ Try again! The word was "${sightWords[currentWord].word}"`}
          </div>
        )}
      </div>
    </div>
  );
}

function SentenceStartersActivity() {
  const [selectedStarter, setSelectedStarter] = useState("");
  const [selectedEnding, setSelectedEnding] = useState("");
  const [completedSentences, setCompletedSentences] = useState([]);

  const starters = [
    "I like to",
    "My favorite",
    "Today I will",
    "I can see",
    "I want to",
    "My family",
  ];

  const endings = [
    "play outside",
    "read books",
    "eat pizza",
    "color is blue",
    "go swimming",
    "loves me",
  ];

  const createSentence = () => {
    if (selectedStarter && selectedEnding) {
      const sentence = `${selectedStarter} ${selectedEnding}.`;
      setCompletedSentences([...completedSentences, sentence]);
      setSelectedStarter("");
      setSelectedEnding("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">📝 Sentence Builders</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Choose a Starter:</h4>
          <div className="space-y-2">
            {starters.map((starter, index) => (
              <button
                key={index}
                onClick={() => setSelectedStarter(starter)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedStarter === starter
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white hover:bg-green-50 border-gray-200 hover:border-green-300"
                }`}
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Choose an Ending:</h4>
          <div className="space-y-2">
            {endings.map((ending, index) => (
              <button
                key={index}
                onClick={() => setSelectedEnding(ending)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedEnding === ending
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white hover:bg-green-50 border-gray-200 hover:border-green-300"
                }`}
              >
                {ending}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(selectedStarter || selectedEnding) && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Your Sentence:</h4>
          <div className="text-2xl font-bold text-gray-800 mb-4 p-4 bg-gray-50 rounded-xl">
            {selectedStarter} {selectedEnding}
            {selectedStarter && selectedEnding ? "." : "..."}
          </div>

          {selectedStarter && selectedEnding && (
            <button
              onClick={createSentence}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              ✅ Complete Sentence
            </button>
          )}
        </div>
      )}

      {completedSentences.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Your Completed Sentences:</h4>
          <div className="space-y-2">
            {completedSentences.map((sentence, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-lg">{sentence}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LanguageChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const skills = [
    { id: 1, text: "Knows alphabet letters and sounds", icon: "🔤" },
    { id: 2, text: "Reads common sight words", icon: "👁️" },
    { id: 3, text: "Builds simple sentences", icon: "📝" },
    { id: 4, text: "Understands phonics patterns", icon: "🔊" },
    { id: 5, text: "Can spell basic words", icon: "✏️" },
  ];

  const toggleCheck = (id) => {
    setCheckedItems({ ...checkedItems, [id]: !checkedItems[id] });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">✅ Language Skills Checklist</h3>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-bold text-purple-600">
              {completedCount}/{skills.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / skills.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleCheck(skill.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                checkedItems[skill.id]
                  ? "bg-purple-50 border-purple-300 text-purple-800"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{skill.icon}</span>
                <span className="flex-1 font-medium">{skill.text}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    checkedItems[skill.id]
                      ? "bg-purple-500 border-purple-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {checkedItems[skill.id] && "✓"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {completedCount === skills.length && (
          <div className="mt-6 bg-purple-500 text-white p-4 rounded-xl text-center font-bold animate-bounce">
            🎉 Amazing! You&apos;ve mastered all language skills!
          </div>
        )}
      </div>
    </div>
  );
}

export default function LanguagePhonicsLesson() {
  const navigate = useNavigate();

  const objectives = [
    "Knowledge of the alphabet and sounds",
    "Read and spell sight words",
    "Build simple sentences",
    "Understand phonics patterns",
    "Practice writing and spelling",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
            >
              <span className="text-xl">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">🔤 Language: Phonics & Sight Words</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Learning Objectives */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Learning Objectives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-700">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Activities */}
        <AlphabetSoundsActivity />
        <SightWordsActivity />
        <SentenceStartersActivity />
        <LanguageChecklist />

        {/* Completion Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
          >
            🎉 Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
