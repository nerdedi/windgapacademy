// Virtual World Component
// Immersive, inclusive, and interactive environment for all learners
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Location definitions
const locations = {
  cathedral: {
    name: "Cathedral Clubhouse",
    icon: "🏰",
    description:
      "A grand, accessible academy building where learners gather for fun, learning, and community.",
    activities: ["Arcade Zone", "Great Hall", "Common Room"],
  },
  botanic: {
    name: "Royal Botanic Garden",
    icon: "🌳",
    description:
      "Mindfulness walks, nature exploration, and wellbeing activities. Quiet zones and visual supports for neurodivergent users.",
    activities: ["Nature Walk", "Plant Identification", "Meditation"],
  },
  zoo: {
    name: "Taronga Zoo",
    icon: "🦁",
    description: "Meet virtual animals, learn about biodiversity, and join conservation projects.",
    activities: ["Animal Encounters", "Conservation Quiz", "Virtual Safari"],
  },
  harbour: {
    name: "Darling Harbour",
    icon: "⛵",
    description:
      "Shop, dine, and explore interactive exhibits. All venues are accessible and inclusive.",
    activities: ["Shopping", "Dining", "Interactive Exhibits"],
  },
  barangaroo: {
    name: "Barangaroo Reserve",
    icon: "🌿",
    description:
      "Discover Indigenous culture, art, and community gatherings. Respect First Nations perspectives.",
    activities: ["Cultural Learning", "Art Gallery", "Community Events"],
  },
  school: {
    name: "Virtual School",
    icon: "🏫",
    description: "Collaborative learning, group projects, and inclusive classrooms.",
    activities: ["Classroom", "Library", "Science Lab"],
  },
};

// Clubhouse rooms
const rooms = {
  common: {
    name: "Common Room",
    icon: "🛋️",
    desc: "A cosy space for socialising, relaxing, and group activities.",
  },
  hall: {
    name: "Great Hall",
    icon: "🎭",
    desc: "A grand hall for assemblies, celebrations, and large events.",
  },
  dining: {
    name: "Dining Hall",
    icon: "🍽️",
    desc: "A welcoming dining area for meals, cooking games, and nutrition lessons.",
  },
  kitchen: {
    name: "Kitchen",
    icon: "🍳",
    desc: "A fully equipped kitchen for cooking activities and healthy eating lessons.",
  },
  gym: {
    name: "Gym",
    icon: "🏋️",
    desc: "Exercise, play sports, and learn about health and wellbeing.",
  },
  library: {
    name: "Library",
    icon: "📚",
    desc: "Read, research, and study in a quiet, resource-rich environment.",
  },
  art: { name: "Art Studio", icon: "🎨", desc: "Create, paint, and express yourself through art." },
  music: { name: "Music Room", icon: "🎵", desc: "Play instruments, sing, and explore music." },
  wellbeing: {
    name: "Wellbeing Centre",
    icon: "🧘",
    desc: "Relax, recharge, and access support for mental health.",
  },
};

// AI Characters
const characters = [
  {
    id: "andy",
    name: "Chancellor Andy",
    role: "Academy Leader",
    avatar: "👨‍💼",
    message: "Welcome! I oversee all academy decisions and ensure every learner is supported.",
  },
  {
    id: "natalie",
    name: "Natalie",
    role: "Head of Education",
    avatar: "👩‍🏫",
    message:
      "Hi! I'm neurodivergent too. If you feel stuck, I give the best tips for learning when your brain is a bit different!",
  },
  {
    id: "daisy",
    name: "Daisy",
    role: "Student President",
    avatar: "🌼",
    message:
      "Hey! I help learners understand concepts and make sure you always have a friend on your side!",
  },
  {
    id: "winnie",
    name: "Winnie",
    role: "AI Mentor",
    avatar: "🐻",
    message: "Hi! I can show you around, join a race, or help with any activity.",
  },
];

export function VirtualWorld() {
  const [currentLocation, setCurrentLocation] = useState("cathedral");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [showArcade, setShowArcade] = useState(false);
  const [raceResults, setRaceResults] = useState(null);

  const location = locations[currentLocation];

  const handleRace = () => {
    const racers = ["You", "Daisy (AI)", "Winnie (AI)", "Andy (AI)"];
    const results = racers
      .map((name) => ({
        name,
        time: Math.floor(Math.random() * 2000 + 1000),
      }))
      .sort((a, b) => a.time - b.time);
    setRaceResults(results);
  };

  // Arcade Mini-game
  const renderArcade = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>🎮 Arcade Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col"
            onClick={() => alert("Math Challenge: 7 + 5 = 12!")}
          >
            <span className="text-2xl">🔢</span>
            Math Challenge
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col"
            onClick={() => alert("Memory: Red, Blue, Green!")}
          >
            <span className="text-2xl">🧠</span>
            Memory Match
          </Button>
          <Button variant="outline" className="h-24 flex flex-col" onClick={handleRace}>
            <span className="text-2xl">🏃</span>
            Race!
          </Button>
        </div>
        {raceResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-2">Race Results:</h4>
            <ol className="list-decimal list-inside">
              {raceResults.map((r, i) => (
                <li key={r.name} className={i === 0 ? "font-bold text-green-600" : ""}>
                  {r.name}: {r.time}ms {i === 0 && "🏆"}
                </li>
              ))}
            </ol>
          </div>
        )}
        <Button variant="ghost" className="mt-4" onClick={() => setShowArcade(false)}>
          ← Back to Clubhouse
        </Button>
      </CardContent>
    </Card>
  );

  // Room view
  const renderRoom = () => {
    const room = rooms[currentRoom];
    if (!room) return null;
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{room.icon}</span>
            {room.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{room.desc}</p>
          <div className="flex gap-2">
            <Button onClick={() => alert(`Starting activity in ${room.name}!`)}>
              Start Activity
            </Button>
            <Button variant="outline" onClick={() => setCurrentRoom(null)}>
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Character chat
  const renderCharacterChat = () => {
    const char = characters.find((c) => c.id === activeCharacter);
    if (!char) return null;
    return (
      <Card className="mt-4 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{char.avatar}</span>
            <div>
              <h4 className="font-bold">{char.name}</h4>
              <Badge variant="secondary" className="mb-2">
                {char.role}
              </Badge>
              <p className="text-gray-700">{char.message}</p>
            </div>
          </div>
          <Button variant="ghost" className="mt-4" onClick={() => setActiveCharacter(null)}>
            End Conversation
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">🌏 Virtual World</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome to a realistic virtual Sydney! Interact, learn, and play in digital spaces
            designed for creativity, collaboration, and neurodivergent empowerment.
          </p>
        </CardContent>
      </Card>

      {/* Location Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(locations).map(([key, loc]) => (
          <Button
            key={key}
            variant={currentLocation === key ? "default" : "outline"}
            onClick={() => {
              setCurrentLocation(key);
              setCurrentRoom(null);
              setShowArcade(false);
              setActiveCharacter(null);
            }}
            className="flex items-center gap-1"
          >
            <span>{loc.icon}</span>
            {loc.name}
          </Button>
        ))}
      </div>

      {/* Current Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-3xl">{location.icon}</span>
            {location.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">{location.description}</p>

          {/* Activities */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Activities:</h4>
            <div className="flex flex-wrap gap-2">
              {location.activities.map((activity) => (
                <Badge key={activity} variant="outline">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cathedral specific features */}
          {currentLocation === "cathedral" && !showArcade && !currentRoom && !activeCharacter && (
            <>
              {/* Rooms */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Explore Rooms:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(rooms).map(([key, room]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="flex items-center gap-2 justify-start"
                      onClick={() => setCurrentRoom(key)}
                    >
                      <span>{room.icon}</span>
                      {room.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Characters */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Meet the Team:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {characters.map((char) => (
                    <Button
                      key={char.id}
                      variant="outline"
                      className="flex flex-col items-center h-auto py-3"
                      onClick={() => setActiveCharacter(char.id)}
                    >
                      <span className="text-2xl mb-1">{char.avatar}</span>
                      <span className="text-sm">{char.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowArcade(true)}>🎮 Enter Arcade</Button>
                <Link to="/game">
                  <Button variant="outline">🎯 Play Games</Button>
                </Link>
                <Link to="/calmspace">
                  <Button variant="outline">🧘 Calm Space</Button>
                </Link>
              </div>
            </>
          )}

          {/* Dynamic content */}
          {showArcade && renderArcade()}
          {currentRoom && renderRoom()}
          {activeCharacter && renderCharacterChat()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-4 flex justify-center gap-4">
        <Link to="/">
          <Button variant="outline">← Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

export default VirtualWorld;
