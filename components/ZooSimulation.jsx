import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 3D Zoo Simulation with immersive learning
function ZooSimulation() {
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState("Lion");
  const [currentHabitat, setCurrentHabitat] = useState("Savanna");
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [gameMode, setGameMode] = useState("explore"); // explore, learn, quiz, feed
  const [playerStats, setPlayerStats] = useState({
    animalsDiscovered: 3,
    factsLearned: 12,
    quizzesCompleted: 5,
    feedingExperience: 8,
  });
  const [showAnimalInfo, setShowAnimalInfo] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Welcome to the Virtual Zoo!");

  const animals = [
    {
      name: "Lion",
      emoji: "🦁",
      habitat: "Savanna",
      facts: [
        "Lions are known as the king of the jungle, but they actually live in grasslands and savannas.",
        "A lion's roar can be heard from up to 5 miles away.",
        "Lions are the only cats that live in groups called prides.",
        "Female lions do most of the hunting for the pride.",
      ],
      diet: "Carnivore",
      lifespan: "10-14 years",
      weight: "120-190 kg",
      speed: "80 km/h",
      conservation: "Vulnerable",
      quiz: {
        question: "What is a group of lions called?",
        options: ["Pack", "Herd", "Pride", "Flock"],
        correct: 2,
      },
    },
    {
      name: "Elephant",
      emoji: "🐘",
      habitat: "Savanna",
      facts: [
        "Elephants are the largest land animals on Earth.",
        "They can weigh up to 6,000 kg and live for 60-70 years.",
        "Elephants have excellent memories and can recognize hundreds of individuals.",
        "They use their trunks for breathing, smelling, touching, and grabbing objects.",
      ],
      diet: "Herbivore",
      lifespan: "60-70 years",
      weight: "4,000-6,000 kg",
      speed: "40 km/h",
      conservation: "Endangered",
      quiz: {
        question: "How much can an adult elephant weigh?",
        options: ["1,000 kg", "3,000 kg", "6,000 kg", "10,000 kg"],
        correct: 2,
      },
    },
    {
      name: "Giraffe",
      emoji: "🦒",
      habitat: "Savanna",
      facts: [
        "Giraffes are the tallest mammals on Earth, reaching heights of up to 18 feet.",
        "Their long necks contain the same number of vertebrae as humans - just 7!",
        "Giraffes only need 5-30 minutes of sleep per day.",
        "Their tongues are 18-20 inches long and dark purple to protect from sunburn.",
      ],
      diet: "Herbivore",
      lifespan: "20-25 years",
      weight: "800-1,200 kg",
      speed: "60 km/h",
      conservation: "Vulnerable",
      quiz: {
        question: "How tall can giraffes grow?",
        options: ["12 feet", "15 feet", "18 feet", "25 feet"],
        correct: 2,
      },
    },
    {
      name: "Penguin",
      emoji: "🐧",
      habitat: "Arctic",
      facts: [
        "Penguins are flightless birds that are excellent swimmers.",
        "They can dive up to 500 meters deep and hold their breath for 20 minutes.",
        "Emperor penguins are the tallest and heaviest of all penguin species.",
        "Penguins huddle together to stay warm in freezing temperatures.",
      ],
      diet: "Carnivore",
      lifespan: "15-20 years",
      weight: "1-40 kg",
      speed: "8 km/h on land, 35 km/h in water",
      conservation: "Stable",
      quiz: {
        question: "How deep can penguins dive?",
        options: ["100 meters", "300 meters", "500 meters", "1000 meters"],
        correct: 2,
      },
    },
    {
      name: "Monkey",
      emoji: "🐵",
      habitat: "Rainforest",
      facts: [
        "Monkeys are highly intelligent primates with complex social structures.",
        "They use tools and can learn to solve problems.",
        "Many species of monkeys have prehensile tails that act like a fifth hand.",
        "Monkeys communicate through vocalizations, facial expressions, and body language.",
      ],
      diet: "Omnivore",
      lifespan: "10-30 years",
      weight: "0.1-35 kg",
      speed: "55 km/h",
      conservation: "Varies by species",
      quiz: {
        question: "What makes a monkey's tail special?",
        options: ["It's colorful", "It's prehensile", "It's very long", "It's fluffy"],
        correct: 1,
      },
    },
    {
      name: "Polar Bear",
      emoji: "🐻‍❄️",
      habitat: "Arctic",
      facts: [
        "Polar bears are the largest land carnivores in the world.",
        "Their fur appears white but is actually transparent and hollow.",
        "They are excellent swimmers and can swim for hours without rest.",
        "Polar bears have black skin underneath their fur to absorb heat.",
      ],
      diet: "Carnivore",
      lifespan: "20-30 years",
      weight: "150-680 kg",
      speed: "40 km/h",
      conservation: "Vulnerable",
      quiz: {
        question: "What color is polar bear skin?",
        options: ["White", "Pink", "Black", "Brown"],
        correct: 2,
      },
    },
  ];

  const habitats = ["Savanna", "Arctic", "Rainforest"];

  const currentAnimal = animals.find((a) => a.name === selectedAnimal);
  const habitatAnimals = animals.filter((a) => a.habitat === currentHabitat);

  // Game Functions
  const visitAnimal = (animal) => {
    setSelectedAnimal(animal.name);
    setShowAnimalInfo(true);
    setPlayerStats((prev) => ({
      ...prev,
      animalsDiscovered: prev.animalsDiscovered + (prev.animalsDiscovered < animals.length ? 1 : 0),
    }));

    // Text-to-speech
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `You're now observing the ${animal.name}. ${animal.facts[0]}`,
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const changeHabitat = (habitat) => {
    setCurrentHabitat(habitat);
    setSelectedAnimal(animals.find((a) => a.habitat === habitat)?.name || animals[0].name);
    setShowAnimalInfo(false);
  };

  const startQuiz = (animal) => {
    setCurrentQuiz(animal.quiz);
    setGameMode("quiz");
  };

  const answerQuiz = (selectedOption) => {
    if (selectedOption === currentQuiz.correct) {
      setScore((prev) => prev + 10);
      setPlayerStats((prev) => ({
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        factsLearned: prev.factsLearned + 1,
      }));
      alert("Correct! Well done! 🎉");
    } else {
      alert("Not quite right. Try again! 🤔");
    }
    setCurrentQuiz(null);
    setGameMode("explore");
  };

  const feedAnimal = (animal) => {
    setPlayerStats((prev) => ({
      ...prev,
      feedingExperience: prev.feedingExperience + 1,
    }));

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `You fed the ${animal.name}! They seem very happy and healthy.`,
      );
      window.speechSynthesis.speak(utterance);
    }

    alert(`🍎 You fed the ${animal.name}! They're very grateful!`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            currentHabitat === "Savanna"
              ? "bg-gradient-to-b from-orange-900/30 to-yellow-900/30"
              : currentHabitat === "Arctic"
                ? "bg-gradient-to-b from-blue-900/30 to-cyan-900/30"
                : "bg-gradient-to-b from-green-900/30 to-emerald-900/30"
          }`}
        ></div>

        {/* Animated particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              🦁 VIRTUAL ZOO EXPLORER
            </h1>
            <p className="text-gray-300 mt-2">Discover amazing animals in their natural habitats</p>
          </div>
          <button
            onClick={() => navigate("/games")}
            className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            ← Back to Games
          </button>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Animals Discovered",
              value: playerStats.animalsDiscovered,
              icon: "🦁",
              max: animals.length,
            },
            { label: "Facts Learned", value: playerStats.factsLearned, icon: "📚", max: 50 },
            {
              label: "Quizzes Completed",
              value: playerStats.quizzesCompleted,
              icon: "🧠",
              max: 20,
            },
            {
              label: "Feeding Experience",
              value: playerStats.feedingExperience,
              icon: "🍎",
              max: 30,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-300">{stat.label}</div>
              <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(stat.value / stat.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Habitat Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🌍 Choose Habitat</h2>
          <div className="flex gap-4">
            {habitats.map((habitat) => (
              <button
                key={habitat}
                onClick={() => changeHabitat(habitat)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentHabitat === habitat
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {habitat === "Savanna" ? "🌾" : habitat === "Arctic" ? "❄️" : "🌳"} {habitat}
              </button>
            ))}
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {habitatAnimals.map((animal, index) => (
            <div
              key={animal.name}
              className={`group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 cursor-pointer ${
                selectedAnimal === animal.name
                  ? "ring-2 ring-blue-400 scale-105"
                  : "hover:scale-105"
              }`}
              onClick={() => visitAnimal(animal)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{animal.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{animal.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
                  <div>Diet: {animal.diet}</div>
                  <div>Lifespan: {animal.lifespan}</div>
                  <div>Weight: {animal.weight}</div>
                  <div>Status: {animal.conservation}</div>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startQuiz(animal);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    🧠 Quiz
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      feedAnimal(animal);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    🍎 Feed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {currentQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-2xl w-full">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">🧠 Animal Quiz</h3>
            <div className="text-xl text-gray-200 mb-8 text-center">{currentQuiz.question}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuiz(index)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentQuiz(null);
                setGameMode("explore");
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Animal Info Modal */}
      {showAnimalInfo && currentAnimal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{currentAnimal.emoji}</div>
              <h3 className="text-4xl font-bold text-white mb-2">{currentAnimal.name}</h3>
              <p className="text-gray-300">Learn fascinating facts about this amazing animal!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">📊 Quick Facts</h4>
                <div className="space-y-2 text-gray-300">
                  <div>
                    <strong>Diet:</strong> {currentAnimal.diet}
                  </div>
                  <div>
                    <strong>Lifespan:</strong> {currentAnimal.lifespan}
                  </div>
                  <div>
                    <strong>Weight:</strong> {currentAnimal.weight}
                  </div>
                  <div>
                    <strong>Speed:</strong> {currentAnimal.speed}
                  </div>
                  <div>
                    <strong>Conservation Status:</strong> {currentAnimal.conservation}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-white mb-4">🧠 Did You Know?</h4>
                <div className="space-y-3">
                  {currentAnimal.facts.map((fact, index) => (
                    <div key={index} className="text-gray-300 text-sm leading-relaxed">
                      • {fact}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startQuiz(currentAnimal)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                🧠 Take Quiz
              </button>
              <button
                onClick={() => feedAnimal(currentAnimal)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                🍎 Feed Animal
              </button>
              <button
                onClick={() => setShowAnimalInfo(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

export default ZooSimulation;
