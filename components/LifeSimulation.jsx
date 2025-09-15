import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Sophisticated Life Simulation - Manage virtual characters and their lives
function LifeSimulation() {
  const navigate = useNavigate();

  // Complex Character State Management
  const [characters, setCharacters] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      age: 25,
      gender: "non-binary",
      avatar: "👤",
      personality: { outgoing: 70, creative: 85, ambitious: 60, kind: 90 },
      needs: { hunger: 80, energy: 60, social: 40, hygiene: 70, fun: 30, comfort: 85 },
      skills: { cooking: 3, fitness: 2, creativity: 5, logic: 4, charisma: 6, handiness: 2 },
      career: { job: "Artist", level: 2, salary: 35000, performance: 75 },
      relationships: {},
      inventory: { money: 2500, items: ["laptop", "easel", "guitar"] },
      home: { type: "apartment", rooms: 3, furniture: ["bed", "couch", "kitchen", "easel"] },
      mood: "content",
      currentActivity: "idle",
      goals: ["Master Painting Skill", "Find Love", "Buy a House"],
    },
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState({ hour: 9, day: 1, season: "Spring" });
  const [notifications, setNotifications] = useState([]);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);

  // Activities with realistic effects on needs and skills
  const activities = {
    eat: {
      name: "Eat Meal",
      icon: "🍽️",
      duration: 30,
      effects: { hunger: +40, energy: +10 },
      requirements: { hunger: "<80" },
    },
    sleep: {
      name: "Sleep",
      icon: "😴",
      duration: 480,
      effects: { energy: +100, hygiene: -10 },
      requirements: { energy: "<50" },
    },
    shower: {
      name: "Take Shower",
      icon: "🚿",
      duration: 20,
      effects: { hygiene: +50, comfort: +10 },
      requirements: { hygiene: "<70" },
    },
    work: {
      name: "Go to Work",
      icon: "💼",
      duration: 480,
      effects: { energy: -30, social: +10, money: "+salary" },
      skillGain: { logic: 1, charisma: 1 },
      requirements: { energy: ">30" },
    },
    exercise: {
      name: "Exercise",
      icon: "🏃‍♀️",
      duration: 60,
      effects: { energy: -20, hygiene: -20, comfort: -10 },
      skillGain: { fitness: 2 },
      requirements: { energy: ">20" },
    },
    paint: {
      name: "Paint",
      icon: "🎨",
      duration: 120,
      effects: { fun: +30, energy: -15 },
      skillGain: { creativity: 3 },
      requirements: { items: "easel" },
    },
    socialize: {
      name: "Socialize",
      icon: "👥",
      duration: 90,
      effects: { social: +40, fun: +20 },
      skillGain: { charisma: 2 },
      requirements: {},
    },
    cook: {
      name: "Cook",
      icon: "👨‍🍳",
      duration: 45,
      effects: { hunger: +30, fun: +10 },
      skillGain: { cooking: 2 },
      requirements: {},
    },
    read: {
      name: "Read Book",
      icon: "📚",
      duration: 60,
      effects: { fun: +25, energy: -5 },
      skillGain: { logic: 2 },
      requirements: {},
    },
    playMusic: {
      name: "Play Guitar",
      icon: "🎸",
      duration: 90,
      effects: { fun: +35, energy: -10 },
      skillGain: { creativity: 2, charisma: 1 },
      requirements: { items: "guitar" },
    },
  };

  // Career progression system
  const careers = {
    Artist: {
      levels: ["Freelancer", "Gallery Artist", "Renowned Artist", "Master Artist"],
      salaries: [25000, 35000, 55000, 85000],
      requirements: { creativity: [0, 3, 6, 9] },
    },
    Tech: {
      levels: ["Junior Developer", "Developer", "Senior Developer", "Tech Lead"],
      salaries: [45000, 65000, 95000, 130000],
      requirements: { logic: [0, 4, 7, 10] },
    },
    Business: {
      levels: ["Intern", "Associate", "Manager", "Executive"],
      salaries: [30000, 50000, 80000, 120000],
      requirements: { charisma: [0, 3, 6, 9] },
    },
  };

  const character = characters[selectedCharacter];

  // Complex life simulation engine
  const simulateLife = useCallback(() => {
    setCharacters((prev) =>
      prev.map((char, index) => {
        if (index !== selectedCharacter && char.currentActivity === "idle") {
          // Auto-manage other characters' basic needs
          const newChar = { ...char };

          // Gradual need decay over time
          newChar.needs.hunger = Math.max(0, newChar.needs.hunger - 2);
          newChar.needs.energy = Math.max(0, newChar.needs.energy - 1);
          newChar.needs.hygiene = Math.max(0, newChar.needs.hygiene - 1);
          newChar.needs.social = Math.max(0, newChar.needs.social - 1);
          newChar.needs.fun = Math.max(0, newChar.needs.fun - 1);

          // Auto-satisfy critical needs
          if (newChar.needs.hunger < 20) {
            newChar.needs.hunger += 40;
            newChar.inventory.money -= 15; // Food cost
          }
          if (newChar.needs.energy < 20) {
            newChar.needs.energy = 100;
            newChar.needs.hygiene -= 10;
          }

          return newChar;
        }
        return char;
      }),
    );

    // Time progression
    setCurrentTime((prev) => {
      const newTime = { ...prev };
      newTime.hour += 1;
      if (newTime.hour >= 24) {
        newTime.hour = 0;
        newTime.day += 1;
        if (newTime.day > 28) {
          newTime.day = 1;
          const seasons = ["Spring", "Summer", "Fall", "Winter"];
          const currentIndex = seasons.indexOf(newTime.season);
          newTime.season = seasons[(currentIndex + 1) % 4];
        }
      }
      return newTime;
    });
  }, [selectedCharacter]);

  // Game time progression
  useEffect(() => {
    if (gameSpeed === 0) return;

    const interval = setInterval(
      () => {
        simulateLife();
      },
      gameSpeed === 1 ? 2000 : 1000,
    ); // Normal: 2s, Fast: 1s per hour

    return () => clearInterval(interval);
  }, [gameSpeed, simulateLife]);

  const performActivity = (activityKey) => {
    const activity = activities[activityKey];
    const char = characters[selectedCharacter];

    // Check requirements
    for (const [req, value] of Object.entries(activity.requirements)) {
      if (req === "items") {
        if (!char.inventory.items.includes(value)) {
          addNotification(`Need ${value} to ${activity.name}`, "error");
          return;
        }
      } else if (req.includes("<")) {
        const need = req.replace("<", "");
        const threshold = parseInt(value.replace("<", ""));
        if (char.needs[need] >= threshold) {
          addNotification(`${need} is too high for ${activity.name}`, "error");
          return;
        }
      } else if (req.includes(">")) {
        const need = req.replace(">", "");
        const threshold = parseInt(value.replace(">", ""));
        if (char.needs[need] <= threshold) {
          addNotification(`${need} is too low for ${activity.name}`, "error");
          return;
        }
      }
    }

    // Apply activity effects
    setCharacters((prev) =>
      prev.map((c, index) => {
        if (index === selectedCharacter) {
          const newChar = { ...c };

          // Apply need changes
          Object.entries(activity.effects).forEach(([need, change]) => {
            if (need === "money") {
              if (change === "+salary") {
                newChar.inventory.money += Math.floor(newChar.career.salary / 30); // Daily salary
              } else {
                newChar.inventory.money += change;
              }
            } else {
              newChar.needs[need] = Math.max(0, Math.min(100, newChar.needs[need] + change));
            }
          });

          // Apply skill gains
          if (activity.skillGain) {
            Object.entries(activity.skillGain).forEach(([skill, gain]) => {
              newChar.skills[skill] = Math.min(10, newChar.skills[skill] + gain * 0.1);
            });
          }

          // Update mood based on needs
          const avgNeeds = Object.values(newChar.needs).reduce((sum, need) => sum + need, 0) / 6;
          if (avgNeeds > 80) newChar.mood = "ecstatic";
          else if (avgNeeds > 60) newChar.mood = "happy";
          else if (avgNeeds > 40) newChar.mood = "content";
          else if (avgNeeds > 20) newChar.mood = "uncomfortable";
          else newChar.mood = "miserable";

          newChar.currentActivity = activityKey;

          // Check for career advancement
          const currentCareer = careers[newChar.career.job];
          if (currentCareer && newChar.career.level < currentCareer.levels.length - 1) {
            const nextLevelReqs = currentCareer.requirements;
            let canAdvance = true;
            Object.entries(nextLevelReqs).forEach(([skill, levels]) => {
              if (newChar.skills[skill] < levels[newChar.career.level + 1]) {
                canAdvance = false;
              }
            });

            if (canAdvance) {
              newChar.career.level += 1;
              newChar.career.salary = currentCareer.salaries[newChar.career.level];
              addNotification(
                `Promoted to ${currentCareer.levels[newChar.career.level]}!`,
                "success",
              );
            }
          }

          return newChar;
        }
        return c;
      }),
    );

    addNotification(`${character.name} is ${activity.name.toLowerCase()}`, "info");

    // Reset activity after duration (simplified for demo)
    setTimeout(() => {
      setCharacters((prev) =>
        prev.map((c, index) => {
          if (index === selectedCharacter) {
            return { ...c, currentActivity: "idle" };
          }
          return c;
        }),
      );
    }, 3000);
  };

  const addNotification = (message, type = "info") => {
    const notification = { id: Date.now(), message, type, timestamp: new Date() };
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 4000);
  };

  const getMoodColor = (mood) => {
    const colors = {
      ecstatic: "text-green-400",
      happy: "text-green-300",
      content: "text-blue-300",
      uncomfortable: "text-yellow-400",
      miserable: "text-red-400",
    };
    return colors[mood] || "text-gray-400";
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      ecstatic: "😍",
      happy: "😊",
      content: "😐",
      uncomfortable: "😟",
      miserable: "😢",
    };
    return emojis[mood] || "😐";
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Life Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-pink-900/20">
        {/* Floating life elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {["💝", "🏠", "💼", "🎨", "👥", "🍽️", "😊"][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              🏠 LIFE ACADEMY SIMULATOR
            </h1>
            <p className="text-gray-300">Manage virtual lives and make meaningful choices</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <div className="text-lg font-bold">
                {currentTime.hour}:00 - Day {currentTime.day}
              </div>
              <div className="text-xs text-gray-400">{currentTime.season}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setGameSpeed(0)}
                className={`px-3 py-1 rounded ${gameSpeed === 0 ? "bg-red-600" : "bg-white/20"}`}
              >
                ⏸️
              </button>
              <button
                onClick={() => setGameSpeed(1)}
                className={`px-3 py-1 rounded ${gameSpeed === 1 ? "bg-green-600" : "bg-white/20"}`}
              >
                ▶️
              </button>
              <button
                onClick={() => setGameSpeed(2)}
                className={`px-3 py-1 rounded ${gameSpeed === 2 ? "bg-blue-600" : "bg-white/20"}`}
              >
                ⏩
              </button>
            </div>
            <button
              onClick={() => navigate("/games")}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Character Selection */}
        <div className="mb-4">
          <div className="flex gap-4 items-center">
            <h3 className="text-lg font-bold">👤 Characters</h3>
            <div className="flex gap-2">
              {characters.map((char, index) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(index)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    selectedCharacter === index
                      ? "bg-purple-600 border-purple-400 scale-105"
                      : "bg-white/10 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">{char.avatar}</div>
                  <div className="text-xs">{char.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Character Info */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{character.avatar}</div>
              <h3 className="text-2xl font-bold">{character.name}</h3>
              <p className="text-gray-300">
                Age {character.age} • {character.career.job}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-2xl">{getMoodEmoji(character.mood)}</span>
                <span className={`font-semibold ${getMoodColor(character.mood)}`}>
                  {character.mood.charAt(0).toUpperCase() + character.mood.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Money:</span>
                <span className="text-green-400">
                  ${character.inventory.money.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Career Level:</span>
                <span>{careers[character.career.job]?.levels[character.career.level]}</span>
              </div>
              <div className="flex justify-between">
                <span>Salary:</span>
                <span className="text-green-400">
                  ${character.career.salary.toLocaleString()}/year
                </span>
              </div>
              <div className="flex justify-between">
                <span>Activity:</span>
                <span className="text-blue-400">
                  {character.currentActivity === "idle"
                    ? "Relaxing"
                    : activities[character.currentActivity]?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Needs Panel */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4">🎯 Needs</h4>
            <div className="space-y-3">
              {Object.entries(character.needs).map(([need, value]) => (
                <div key={need}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{need}:</span>
                    <span
                      className={`font-bold ${
                        value > 70
                          ? "text-green-400"
                          : value > 40
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        value > 70 ? "bg-green-400" : value > 40 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Panel */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4">🎓 Skills</h4>
            <div className="space-y-3">
              {Object.entries(character.skills).map(([skill, level]) => (
                <div key={skill}>
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{skill}:</span>
                    <span className="font-bold text-blue-400">Level {Math.floor(level)}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(level / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">🎯 Activities</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(activities).map(([key, activity]) => (
              <button
                key={key}
                onClick={() => performActivity(key)}
                disabled={character.currentActivity !== "idle"}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  character.currentActivity !== "idle"
                    ? "bg-gray-600 border-gray-500 opacity-50 cursor-not-allowed"
                    : "bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105"
                }`}
                title={activity.name}
              >
                <div className="text-3xl mb-2">{activity.icon}</div>
                <div className="text-sm font-semibold">{activity.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {activity.duration < 60
                    ? `${activity.duration}min`
                    : `${Math.floor(activity.duration / 60)}h`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">🎯 Life Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {character.goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
              >
                <div className="text-lg font-semibold">{goal}</div>
                <div className="text-sm text-gray-400 mt-1">In Progress...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 space-y-2 z-50">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg backdrop-blur-sm border max-w-sm ${
                  notification.type === "error"
                    ? "bg-red-900/80 border-red-500"
                    : notification.type === "success"
                      ? "bg-green-900/80 border-green-500"
                      : "bg-blue-900/80 border-blue-500"
                }`}
              >
                <div className="text-sm font-semibold">{notification.message}</div>
                <div className="text-xs text-gray-300">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default LifeSimulation;
