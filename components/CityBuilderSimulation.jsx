import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Sophisticated City Builder Simulation - Real urban planning and management
function CityBuilderSimulation() {
  const navigate = useNavigate();

  // Complex City State Management
  const [cityData, setCityData] = useState({
    name: "New Windgap",
    population: 1000,
    budget: 50000,
    happiness: 75,
    pollution: 15,
    power: { capacity: 1200, usage: 800 },
    water: { capacity: 1000, usage: 600 },
    traffic: 25,
    crime: 10,
    education: 60,
    healthcare: 55,
    employment: 80,
    housing: 70,
  });

  const [cityGrid, setCityGrid] = useState(() => {
    // Initialize 10x10 city grid
    const grid = Array(10)
      .fill()
      .map(() => Array(10).fill({ type: "empty", level: 0 }));
    // Add some starting infrastructure
    grid[5][5] = { type: "residential", level: 1 };
    grid[4][5] = { type: "commercial", level: 1 };
    grid[6][5] = { type: "industrial", level: 1 };
    return grid;
  });

  const [selectedTool, setSelectedTool] = useState("residential");
  const [gameSpeed, setGameSpeed] = useState(1); // 0=paused, 1=normal, 2=fast
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentYear, setCurrentYear] = useState(2024);
  const [notifications, setNotifications] = useState([]);
  const [showDetailPanel, setShowDetailPanel] = useState(null);
  const [policies, setPolicies] = useState({
    taxRate: 8,
    environmentalPolicy: "moderate",
    educationFunding: "standard",
    healthcareFunding: "standard",
    policeFunding: "standard",
  });

  // Building Types with realistic costs and effects
  const buildingTypes = {
    residential: {
      cost: 5000,
      icon: "🏠",
      name: "Residential",
      effects: { population: +50, happiness: +2, power: -20, water: -15 },
    },
    commercial: {
      cost: 8000,
      icon: "🏢",
      name: "Commercial",
      effects: { employment: +10, budget: +500, traffic: +5, pollution: +2 },
    },
    industrial: {
      cost: 12000,
      icon: "🏭",
      name: "Industrial",
      effects: { employment: +20, budget: +800, pollution: +8, power: -40 },
    },
    powerPlant: {
      cost: 25000,
      icon: "⚡",
      name: "Power Plant",
      effects: { power: +500, pollution: +15, employment: +5 },
    },
    waterTreatment: {
      cost: 20000,
      icon: "💧",
      name: "Water Plant",
      effects: { water: +400, pollution: -5, employment: +3 },
    },
    school: {
      cost: 15000,
      icon: "🏫",
      name: "School",
      effects: { education: +15, happiness: +5, employment: +8 },
    },
    hospital: {
      cost: 30000,
      icon: "🏥",
      name: "Hospital",
      effects: { healthcare: +20, happiness: +8, employment: +12 },
    },
    police: {
      cost: 18000,
      icon: "🚔",
      name: "Police Station",
      effects: { crime: -15, happiness: +3, employment: +6 },
    },
    park: {
      cost: 3000,
      icon: "🌳",
      name: "Park",
      effects: { happiness: +8, pollution: -3, property: +5 },
    },
    road: {
      cost: 1000,
      icon: "🛣️",
      name: "Road",
      effects: { traffic: -2, development: +2 },
    },
  };

  // Complex simulation engine that runs every game tick
  const simulateCity = useCallback(() => {
    setCityData((prev) => {
      const newData = { ...prev };

      // Population growth based on happiness and housing
      if (newData.happiness > 60 && newData.housing > 50) {
        newData.population += Math.floor(newData.population * 0.02);
      } else if (newData.happiness < 40) {
        newData.population -= Math.floor(newData.population * 0.01);
      }

      // Budget calculations - realistic municipal finance
      const taxRevenue = Math.floor(newData.population * policies.taxRate * 0.1);
      const commercialRevenue =
        cityGrid.flat().filter((cell) => cell.type === "commercial").length * 200;
      const industrialRevenue =
        cityGrid.flat().filter((cell) => cell.type === "industrial").length * 300;

      const expenses = {
        infrastructure: Math.floor(newData.population * 0.5),
        education:
          policies.educationFunding === "high" ? newData.population * 2 : newData.population * 1,
        healthcare:
          policies.healthcareFunding === "high"
            ? newData.population * 1.5
            : newData.population * 0.8,
        police:
          policies.policeFunding === "high" ? newData.population * 1.2 : newData.population * 0.6,
      };

      const totalExpenses = Object.values(expenses).reduce((sum, exp) => sum + exp, 0);
      newData.budget += taxRevenue + commercialRevenue + industrialRevenue - totalExpenses;

      // Happiness calculation - complex multi-factor system
      let happinessChange = 0;
      if (newData.pollution > 50) happinessChange -= 2;
      if (newData.traffic > 70) happinessChange -= 1;
      if (newData.crime > 30) happinessChange -= 3;
      if (newData.education > 80) happinessChange += 2;
      if (newData.healthcare > 80) happinessChange += 2;
      if (newData.employment < 60) happinessChange -= 2;
      if (policies.taxRate > 12) happinessChange -= 1;

      newData.happiness = Math.max(0, Math.min(100, newData.happiness + happinessChange));

      // Power and water demand based on population and buildings
      const powerDemand =
        newData.population * 0.8 +
        cityGrid.flat().filter((cell) => ["commercial", "industrial"].includes(cell.type)).length *
          30;
      const waterDemand =
        newData.population * 0.6 +
        cityGrid
          .flat()
          .filter((cell) => ["commercial", "industrial", "residential"].includes(cell.type))
          .length *
          15;

      newData.power.usage = powerDemand;
      newData.water.usage = waterDemand;

      // Power/water shortages affect happiness and development
      if (newData.power.usage > newData.power.capacity) {
        newData.happiness -= 5;
        addNotification("Power shortage! Build more power plants.", "warning");
      }
      if (newData.water.usage > newData.water.capacity) {
        newData.happiness -= 3;
        addNotification("Water shortage! Build water treatment plants.", "warning");
      }

      // Traffic calculation based on population density and roads
      const roadCount = cityGrid.flat().filter((cell) => cell.type === "road").length;
      const buildingCount = cityGrid
        .flat()
        .filter((cell) => cell.type !== "empty" && cell.type !== "road").length;
      newData.traffic = Math.max(0, Math.min(100, buildingCount * 5 - roadCount * 2));

      // Crime affected by police presence and unemployment
      const policeStations = cityGrid.flat().filter((cell) => cell.type === "police").length;
      const unemploymentRate = 100 - newData.employment;
      newData.crime = Math.max(
        0,
        Math.min(100, unemploymentRate * 0.5 + newData.population / 100 - policeStations * 10),
      );

      // Random events - realistic city challenges
      if (Math.random() < 0.05) {
        // 5% chance per tick
        const events = [
          {
            type: "economic_boom",
            message: "Economic boom! +$20,000 budget",
            effect: { budget: 20000 },
          },
          {
            type: "recession",
            message: "Economic recession! -$15,000 budget",
            effect: { budget: -15000 },
          },
          {
            type: "natural_disaster",
            message: "Storm damage! Infrastructure costs +$10,000",
            effect: { budget: -10000, happiness: -10 },
          },
          {
            type: "population_growth",
            message: "Migration wave! +200 population",
            effect: { population: 200 },
          },
          {
            type: "tech_advancement",
            message: "Technology upgrade! Reduced pollution",
            effect: { pollution: -5 },
          },
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        addNotification(event.message, event.type);
        Object.keys(event.effect).forEach((key) => {
          newData[key] += event.effect[key];
        });
      }

      return newData;
    });
  }, [cityGrid, policies]);

  // Game time progression
  useEffect(() => {
    if (gameSpeed === 0) return;

    const interval = setInterval(
      () => {
        simulateCity();
        setCurrentMonth((prev) => {
          if (prev >= 12) {
            setCurrentYear((year) => year + 1);
            return 1;
          }
          return prev + 1;
        });
      },
      gameSpeed === 1 ? 3000 : 1500,
    ); // Normal: 3s, Fast: 1.5s per month

    return () => clearInterval(interval);
  }, [gameSpeed, simulateCity]);

  const addNotification = (message, type = "info") => {
    const notification = { id: Date.now(), message, type, timestamp: new Date() };
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep last 5
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const buildOnGrid = (row, col) => {
    if (cityData.budget < buildingTypes[selectedTool].cost) {
      addNotification("Insufficient funds!", "error");
      return;
    }

    if (cityGrid[row][col].type !== "empty") {
      addNotification("Cannot build here!", "error");
      return;
    }

    setCityGrid((prev) => {
      const newGrid = [...prev];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = { type: selectedTool, level: 1 };
      return newGrid;
    });

    setCityData((prev) => ({
      ...prev,
      budget: prev.budget - buildingTypes[selectedTool].cost,
      ...Object.keys(buildingTypes[selectedTool].effects).reduce((acc, key) => {
        if (key in prev) {
          if (typeof prev[key] === "object") {
            acc[key] = { ...prev[key] };
            Object.keys(buildingTypes[selectedTool].effects[key]).forEach((subKey) => {
              acc[key][subKey] =
                (acc[key][subKey] || 0) + buildingTypes[selectedTool].effects[key][subKey];
            });
          } else {
            acc[key] = prev[key] + buildingTypes[selectedTool].effects[key];
          }
        }
        return acc;
      }, {}),
    }));

    addNotification(`Built ${buildingTypes[selectedTool].name}!`, "success");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* City Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20">
        {/* City skyline effect */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 bg-white/5"
            style={{
              left: `${i * 5}%`,
              width: "4%",
              height: `${20 + Math.random() * 40}%`,
              animation: `cityGlow ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              🏙️ WINDGAP CITY BUILDER
            </h1>
            <p className="text-gray-300">Build and manage your dream city</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <div className="text-lg font-bold">
                {currentMonth}/{currentYear}
              </div>
              <div className="text-xs text-gray-400">Game Time</div>
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

        {/* City Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
          {[
            {
              label: "Population",
              value: cityData.population.toLocaleString(),
              icon: "👥",
              color: "blue",
            },
            {
              label: "Budget",
              value: formatCurrency(cityData.budget),
              icon: "💰",
              color: cityData.budget > 0 ? "green" : "red",
            },
            {
              label: "Happiness",
              value: `${cityData.happiness}%`,
              icon: "😊",
              color: cityData.happiness > 70 ? "green" : cityData.happiness > 40 ? "yellow" : "red",
            },
            {
              label: "Pollution",
              value: `${cityData.pollution}%`,
              icon: "🏭",
              color: cityData.pollution < 30 ? "green" : cityData.pollution < 60 ? "yellow" : "red",
            },
            {
              label: "Power",
              value: `${cityData.power.usage}/${cityData.power.capacity}`,
              icon: "⚡",
              color: cityData.power.usage < cityData.power.capacity ? "green" : "red",
            },
            {
              label: "Water",
              value: `${cityData.water.usage}/${cityData.water.capacity}`,
              icon: "💧",
              color: cityData.water.usage < cityData.water.capacity ? "green" : "red",
            },
            {
              label: "Traffic",
              value: `${cityData.traffic}%`,
              icon: "🚗",
              color: cityData.traffic < 40 ? "green" : cityData.traffic < 70 ? "yellow" : "red",
            },
            {
              label: "Crime",
              value: `${cityData.crime}%`,
              icon: "🚔",
              color: cityData.crime < 20 ? "green" : cityData.crime < 50 ? "yellow" : "red",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center hover:bg-white/20 transition-all duration-300`}
            >
              <div className="text-lg mb-1">{stat.icon}</div>
              <div
                className={`text-sm font-bold ${
                  stat.color === "green"
                    ? "text-green-400"
                    : stat.color === "yellow"
                      ? "text-yellow-400"
                      : stat.color === "red"
                        ? "text-red-400"
                        : "text-blue-400"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Building Tools */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">🔨 Building Tools</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Object.entries(buildingTypes).map(([key, building]) => (
              <button
                key={key}
                onClick={() => setSelectedTool(key)}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  selectedTool === key
                    ? "bg-blue-600 border-blue-400 scale-105"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
                title={`${building.name} - ${formatCurrency(building.cost)}`}
              >
                <div className="text-2xl mb-1">{building.icon}</div>
                <div className="text-xs">{formatCurrency(building.cost)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* City Grid */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">🏙️ City Grid</h3>
          <div className="grid grid-cols-10 gap-1 bg-white/5 p-4 rounded-lg max-w-2xl">
            {cityGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => buildOnGrid(rowIndex, colIndex)}
                  className={`aspect-square rounded border transition-all duration-300 hover:scale-110 ${
                    cell.type === "empty"
                      ? "bg-green-900/30 border-green-700/50 hover:bg-green-800/50"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                  title={cell.type !== "empty" ? buildingTypes[cell.type]?.name : "Empty lot"}
                >
                  <div className="text-xs">
                    {cell.type !== "empty" ? buildingTypes[cell.type]?.icon : "🌱"}
                  </div>
                </button>
              )),
            )}
          </div>
        </div>

        {/* Policy Controls */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">📋 City Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <label className="block text-sm font-semibold mb-2">
                Tax Rate: {policies.taxRate}%
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={policies.taxRate}
                onChange={(e) =>
                  setPolicies((prev) => ({ ...prev, taxRate: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                Higher taxes = more revenue, lower happiness
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <label className="block text-sm font-semibold mb-2">Education Funding</label>
              <select
                value={policies.educationFunding}
                onChange={(e) =>
                  setPolicies((prev) => ({ ...prev, educationFunding: e.target.value }))
                }
                className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="low">Low</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <label className="block text-sm font-semibold mb-2">Environmental Policy</label>
              <select
                value={policies.environmentalPolicy}
                onChange={(e) =>
                  setPolicies((prev) => ({ ...prev, environmentalPolicy: e.target.value }))
                }
                className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>
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
                    : notification.type === "warning"
                      ? "bg-yellow-900/80 border-yellow-500"
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
        @keyframes cityGlow {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

export default CityBuilderSimulation;
