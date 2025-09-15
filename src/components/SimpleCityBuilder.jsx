import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SimpleCityBuilder() {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([
    { id: 1, x: 2, y: 2, type: "residential" },
    { id: 2, x: 4, y: 4, type: "commercial" },
    { id: 3, x: 6, y: 3, type: "office" },
  ]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildMode, setBuildMode] = useState("residential");
  const [cityStats, setCityStats] = useState({
    population: 1250,
    happiness: 85,
    budget: 50000,
    buildings: 3,
  });

  const gridSize = 10;

  const handleCellClick = (x, y) => {
    // Check if position is occupied
    const occupied = buildings.some((b) => b.x === x && b.y === y);

    if (!occupied) {
      const newBuilding = {
        id: Date.now(),
        x,
        y,
        type: buildMode,
      };
      setBuildings((prev) => [...prev, newBuilding]);

      // Update stats
      setCityStats((prev) => ({
        population: prev.population + 50,
        happiness: Math.min(100, prev.happiness + 2),
        budget: prev.budget - 5000,
        buildings: prev.buildings + 1,
      }));
    }
  };

  const removeBuilding = (buildingId) => {
    setBuildings((prev) => prev.filter((b) => b.id !== buildingId));
    setSelectedBuilding(null);
    setCityStats((prev) => ({
      population: Math.max(0, prev.population - 50),
      happiness: Math.max(0, prev.happiness - 1),
      budget: prev.budget + 3000,
      buildings: Math.max(0, prev.buildings - 1),
    }));
  };

  const getBuildingColor = (type) => {
    const colors = {
      residential: "bg-green-500",
      commercial: "bg-blue-500",
      industrial: "bg-yellow-500",
      office: "bg-purple-500",
      skyscraper: "bg-red-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getBuildingEmoji = (type) => {
    const emojis = {
      residential: "🏠",
      commercial: "🏢",
      industrial: "🏭",
      office: "🏢",
      skyscraper: "🏗️",
    };
    return emojis[type] || "🏢";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/games")}
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            🎓 Windgap Academy
          </button>
          <div className="flex items-center space-x-6">
            <span className="text-gray-400">City Builder</span>
            <button
              onClick={() => navigate("/games")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-screen pt-16">
        {/* Game Area */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              🏙️ City Builder
            </h1>

            {/* Grid */}
            <div className="grid grid-cols-10 gap-1 bg-gray-800 p-4 rounded-2xl">
              {Array.from({ length: gridSize * gridSize }, (_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                const building = buildings.find((b) => b.x === x && b.y === y);

                return (
                  <div
                    key={index}
                    className={`
                      aspect-square border border-gray-600 rounded cursor-pointer transition-all duration-200
                      ${
                        building
                          ? `${getBuildingColor(building.type)} hover:scale-110 ${selectedBuilding === building.id ? "ring-2 ring-white" : ""}`
                          : "bg-gray-700 hover:bg-gray-600"
                      }
                    `}
                    onClick={() => {
                      if (building) {
                        setSelectedBuilding(building.id);
                      } else {
                        handleCellClick(x, y);
                      }
                    }}
                  >
                    {building && (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {getBuildingEmoji(building.type)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 bg-gray-900 p-6 border-l border-gray-700">
          <h2 className="text-2xl font-bold mb-6">City Control</h2>

          {/* City Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-sm text-gray-400">Population</div>
              <div className="text-xl font-bold text-blue-400">
                {cityStats.population.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-sm text-gray-400">Happiness</div>
              <div className="text-xl font-bold text-green-400">{cityStats.happiness}%</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-sm text-gray-400">Budget</div>
              <div className="text-xl font-bold text-yellow-400">
                ${cityStats.budget.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <div className="text-sm text-gray-400">Buildings</div>
              <div className="text-xl font-bold text-purple-400">{cityStats.buildings}</div>
            </div>
          </div>

          {/* Building Tools */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Build Mode</h3>
              <div className="space-y-2">
                {["residential", "commercial", "industrial", "office", "skyscraper"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBuildMode(type)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                      buildMode === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    <span>{getBuildingEmoji(type)}</span>
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedBuilding && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Selected Building</h3>
                <button
                  onClick={() => removeBuilding(selectedBuilding)}
                  className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all"
                >
                  🗑️ Remove Building
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Click empty cells to build</li>
              <li>• Click buildings to select them</li>
              <li>• Choose building type first</li>
              <li>• Watch your city grow!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleCityBuilder;
