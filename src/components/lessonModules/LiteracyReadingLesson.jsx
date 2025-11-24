import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReadingTextActivity() {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const stories = [
    {
      title: "The Friendly Dog",
      text: "Max is a friendly dog. He lives in a small house with his family. Every morning, Max likes to play in the garden. He runs around and chases butterflies. Max&apos;s favorite toy is a red ball. When it&apos;s time for dinner, Max sits by his bowl and waits patiently.",
      question: "What is Max&apos;s favorite toy?",
      options: ["A blue ball", "A red ball", "A yellow ball", "A green ball"],
      correct: "A red ball",
    },
    {
      title: "Going to the Park",
      text: "Sarah and her mom went to the park on Saturday. The sun was shining and the birds were singing. Sarah played on the swings and went down the slide. She met a new friend named Emma. They played together for an hour before it was time to go home.",
      question: "Who did Sarah meet at the park?",
      options: ["Emma", "Anna", "Lucy", "Kate"],
      correct: "Emma",
    },
    {
      title: "The School Library",
      text: "The school library is a quiet place where students can read books. Mrs. Johnson is the librarian. She helps students find books they like. The library has many different types of books: adventure stories, science books, and picture books. Students must be quiet in the library.",
      question: "Who is the librarian?",
      options: ["Mrs. Smith", "Mrs. Johnson", "Mrs. Brown", "Mrs. Wilson"],
      correct: "Mrs. Johnson",
    },
  ];

  const checkAnswer = () => {
    const isCorrect = selectedAnswer === stories[currentStory].correct;
    if (isCorrect) {
      setScore(score + 10);
    }
    setShowResult(true);
  };

  const nextStory = () => {
    setCurrentStory((currentStory + 1) % stories.length);
    setSelectedAnswer("");
    setShowResult(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">📖 Reading Comprehension</h3>
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h4 className="text-xl font-bold text-gray-800 mb-4">{stories[currentStory].title}</h4>

        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <p className="text-lg leading-relaxed text-gray-700">{stories[currentStory].text}</p>
        </div>

        <div className="mb-6">
          <h5 className="text-lg font-semibold text-gray-800 mb-4">
            {stories[currentStory].question}
          </h5>

          <div className="space-y-3">
            {stories[currentStory].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedAnswer === option
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300"
                } ${showResult && option === stories[currentStory].correct ? "bg-green-500 text-white border-green-500" : ""}
                ${showResult && selectedAnswer === option && option !== stories[currentStory].correct ? "bg-red-500 text-white border-red-500" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Check Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl font-bold text-center ${
                selectedAnswer === stories[currentStory].correct
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {selectedAnswer === stories[currentStory].correct
                ? "🎉 Correct! Great reading!"
                : `❌ The correct answer was: ${stories[currentStory].correct}`}
            </div>
            <button
              onClick={nextStory}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Next Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SignsAndSymbolsActivity() {
  const [selectedSign, setSelectedSign] = useState(null);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);

  const signs = [
    { id: 1, symbol: "🚫", meaning: "No Entry", color: "bg-red-500" },
    { id: 2, symbol: "🚻", meaning: "Restroom", color: "bg-blue-500" },
    { id: 3, symbol: "🚭", meaning: "No Smoking", color: "bg-gray-500" },
    { id: 4, symbol: "♿", meaning: "Wheelchair Access", color: "bg-green-500" },
    { id: 5, symbol: "🚗", meaning: "Parking", color: "bg-yellow-500" },
    { id: 6, symbol: "🏥", meaning: "Hospital", color: "bg-red-600" },
  ];

  const meanings = [
    "No Entry",
    "Restroom",
    "No Smoking",
    "Wheelchair Access",
    "Parking",
    "Hospital",
  ];

  const handleSignSelect = (sign) => {
    setSelectedSign(sign);
  };

  const handleMeaningMatch = (meaning) => {
    if (selectedSign && selectedSign.meaning === meaning) {
      setMatches({ ...matches, [selectedSign.id]: meaning });
      setScore(score + 10);
      setSelectedSign(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">🚦 Signs & Symbols</h3>
        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
          Score: {score}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Select a Sign:</h4>
          <div className="grid grid-cols-2 gap-4">
            {signs.map((sign) => (
              <button
                key={sign.id}
                onClick={() => handleSignSelect(sign)}
                disabled={matches[sign.id]}
                className={`${sign.color} ${
                  selectedSign?.id === sign.id ? "ring-4 ring-blue-500 scale-110" : ""
                } ${
                  matches[sign.id] ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                } p-8 rounded-2xl text-white font-bold text-4xl transition-all duration-300 shadow-lg`}
              >
                {sign.symbol}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Match to Meaning:</h4>
          <div className="space-y-3">
            {meanings.map((meaning) => (
              <button
                key={meaning}
                onClick={() => handleMeaningMatch(meaning)}
                disabled={Object.values(matches).includes(meaning)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  Object.values(matches).includes(meaning)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white hover:bg-green-50 border-gray-200 hover:border-green-300"
                }`}
              >
                {meaning}
              </button>
            ))}
          </div>
        </div>
      </div>

      {Object.keys(matches).length === signs.length && (
        <div className="mt-8 bg-green-500 text-white p-6 rounded-2xl text-center font-bold animate-bounce">
          🎉 Perfect! You matched all signs correctly!
        </div>
      )}
    </div>
  );
}

function LiteracyChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const skills = [
    { id: 1, text: "Reads short texts with understanding", icon: "📖" },
    { id: 2, text: "Recognises common signs and symbols", icon: "🚦" },
    { id: 3, text: "Answers questions about text content", icon: "❓" },
    { id: 4, text: "Understands main ideas in stories", icon: "💡" },
    { id: 5, text: "Can identify key details", icon: "🔍" },
  ];

  const toggleCheck = (id) => {
    setCheckedItems({ ...checkedItems, [id]: !checkedItems[id] });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">✅ Literacy Skills Checklist</h3>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-bold text-orange-600">
              {completedCount}/{skills.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
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
                  ? "bg-orange-50 border-orange-300 text-orange-800"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{skill.icon}</span>
                <span className="flex-1 font-medium">{skill.text}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    checkedItems[skill.id]
                      ? "bg-orange-500 border-orange-500 text-white"
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
          <div className="mt-6 bg-orange-500 text-white p-4 rounded-xl text-center font-bold animate-bounce">
            🎉 Excellent! You&apos;re a reading champion!
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiteracyReadingLesson() {
  const navigate = useNavigate();

  const objectives = [
    "Read and interpret short texts",
    "Recognise signs and symbols",
    "Answer questions about a text",
    "Understand main ideas in stories",
    "Identify key details and information",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
            <h1 className="text-3xl font-bold text-gray-800">📖 Literacy: Reading & Signs</h1>
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
              <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-700">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Activities */}
        <ReadingTextActivity />
        <SignsAndSymbolsActivity />
        <LiteracyChecklist />

        {/* Completion Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
          >
            🎉 Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
