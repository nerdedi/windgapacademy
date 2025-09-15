import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmailActivity() {
  const [emailStep, setEmailStep] = useState(0);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const emailSteps = [
    "Open your email app",
    "Click 'New Email' or 'Compose'",
    "Enter recipient's email address",
    "Write a clear subject line",
    "Type your message",
    "Check spelling and grammar",
    "Click 'Send'",
  ];

  const nextEmailStep = () => {
    if (emailStep < emailSteps.length - 1) {
      setEmailStep(emailStep + 1);
    }
  };

  const prevEmailStep = () => {
    if (emailStep > 0) {
      setEmailStep(emailStep - 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">📧 Email Skills</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Email Steps:</h4>
          <div className="space-y-3">
            {emailSteps.map((step, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                  index === emailStep
                    ? "bg-blue-500 text-white border-blue-500"
                    : index < emailStep
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index < emailStep
                        ? "bg-green-500 text-white"
                        : index === emailStep
                          ? "bg-white text-blue-500"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index < emailStep ? "✓" : index + 1}
                  </div>
                  <span className="font-medium">{step}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={prevEmailStep}
              disabled={emailStep === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
            >
              ← Previous
            </button>
            <button
              onClick={nextEmailStep}
              disabled={emailStep === emailSteps.length - 1}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Practice Email:</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To:</label>
              <input
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                placeholder="friend@example.com"
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Hello from me!"
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message:</label>
              <textarea
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                placeholder="Hi! How are you doing? I hope you're having a great day..."
                rows="4"
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              disabled={!emailData.to || !emailData.subject || !emailData.message}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-all duration-300"
            >
              📤 Send Email (Practice)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnlineSafetyActivity() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      id: 1,
      title: "Suspicious Email",
      description: "You receive an email saying you've won $1000. It asks for your bank details.",
      question: "What should you do?",
      options: [
        "Give them my bank details to get the money",
        "Delete the email - it's probably a scam",
        "Forward it to all my friends",
        "Reply asking for more information",
      ],
      correct: 1,
      explanation: "This is a common scam. Never give personal information to unknown senders.",
    },
    {
      id: 2,
      title: "Social Media Friend Request",
      description: "Someone you don't know sends you a friend request with no mutual friends.",
      question: "What's the safest choice?",
      options: [
        "Accept - more friends is always good",
        "Decline the request",
        "Accept and share my location with them",
        "Message them asking personal questions",
      ],
      correct: 1,
      explanation: "Only accept friend requests from people you know in real life.",
    },
    {
      id: 3,
      title: "Public WiFi",
      description: "You're at a café and want to check your bank account on public WiFi.",
      question: "What should you do?",
      options: [
        "Go ahead - WiFi is WiFi",
        "Wait until you're on a secure network",
        "Use the café's computer instead",
        "Ask other customers for their password",
      ],
      correct: 1,
      explanation: "Public WiFi isn't secure. Avoid accessing sensitive accounts on it.",
    },
  ];

  const handleAnswer = (optionIndex) => {
    if (optionIndex === selectedScenario.correct) {
      setScore(score + 10);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">🛡️ Online Safety</h3>
        <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
          Safety Score: {score}
        </div>
      </div>

      {!selectedScenario ? (
        <div>
          <p className="text-lg text-gray-600 mb-6">Choose a scenario to practice:</p>
          <div className="grid md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 p-6 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 text-left"
              >
                <h4 className="text-lg font-bold text-gray-800 mb-2">{scenario.title}</h4>
                <p className="text-gray-600 text-sm">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">{selectedScenario.title}</h4>
            <button
              onClick={() => setSelectedScenario(null)}
              className="text-gray-500 hover:text-gray-700 font-bold"
            >
              ← Back
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-gray-700">{selectedScenario.description}</p>
          </div>

          <h5 className="text-lg font-semibold mb-4">{selectedScenario.question}</h5>

          <div className="space-y-3 mb-6">
            {selectedScenario.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  index === selectedScenario.correct
                    ? "bg-green-50 border-green-300 hover:bg-green-100"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <h6 className="font-semibold text-blue-800 mb-2">💡 Safety Tip:</h6>
            <p className="text-blue-700">{selectedScenario.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function WebSearchActivity() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleResults = {
    "weather today": [
      {
        title: "Today's Weather Forecast",
        url: "weather.com",
        description: "Current weather conditions and forecast",
      },
      {
        title: "Local Weather Updates",
        url: "bom.gov.au",
        description: "Bureau of Meteorology official weather",
      },
    ],
    "healthy recipes": [
      {
        title: "10 Easy Healthy Recipes",
        url: "healthyeating.com",
        description: "Simple and nutritious meal ideas",
      },
      {
        title: "Quick Healthy Meals",
        url: "nutrition.org",
        description: "Fast recipes for busy people",
      },
    ],
    "library hours": [
      {
        title: "City Library Opening Hours",
        url: "citylibrary.gov",
        description: "Current opening times and services",
      },
      {
        title: "Library Services Guide",
        url: "library.info",
        description: "All library services and hours",
      },
    ],
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = sampleResults[query] || [
      {
        title: "Search Results for: " + searchQuery,
        url: "example.com",
        description: "No specific results found, but here's how to search better!",
      },
    ];
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🔍 Web Search Skills</h3>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold mb-4">Practice Searching:</h4>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try: weather today, healthy recipes, library hours"
            className="flex-1 border-2 border-gray-300 rounded-xl p-3 focus:border-green-500 focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300"
          >
            🔍 Search
          </button>
        </div>

        {hasSearched && (
          <div>
            <h5 className="text-lg font-semibold mb-4">Search Results:</h5>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors duration-300"
                >
                  <h6 className="text-blue-600 font-semibold mb-1">{result.title}</h6>
                  <p className="text-green-600 text-sm mb-2">{result.url}</p>
                  <p className="text-gray-600">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-blue-50 p-4 rounded-xl">
          <h6 className="font-semibold text-blue-800 mb-2">💡 Search Tips:</h6>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Use specific keywords</li>
            <li>• Check the website URL for trustworthy sources</li>
            <li>• Look for recent dates on information</li>
            <li>• Compare information from multiple sources</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DigitalLiteracyLesson() {
  const navigate = useNavigate();

  const objectives = [
    "Learn to use email effectively",
    "Understand online safety principles",
    "Practice web searching skills",
    "Recognize trustworthy websites",
    "Protect personal information online",
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
            <h1 className="text-3xl font-bold text-gray-800">💻 Digital Literacy</h1>
            <div className="w-32"></div>
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
        <EmailActivity />
        <OnlineSafetyActivity />
        <WebSearchActivity />

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
