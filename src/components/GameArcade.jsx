import React, { useState } from "react";
import { Link } from "react-router-dom";

import { MiniAvatar } from "./CharacterAvatar";
import { getCharacterForSubject } from "./Characters";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Actual game components
function MoneyCountingGame({ onBack }) {
  const [targetAmount, setTargetAmount] = useState(getRandomAmount());
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Select coins and notes to match the target!");

  function getRandomAmount() {
    return Math.floor(Math.random() * 20) + 1 + Math.floor(Math.random() * 4) * 0.25;
  }

  const coins = [0.05, 0.1, 0.2, 0.5, 1, 2];
  const notes = [5, 10, 20, 50];

  function addMoney(value) {
    const newAmount = selectedAmount + value;
    setSelectedAmount(newAmount);

    if (Math.abs(newAmount - targetAmount) < 0.01) {
      setMessage("🎉 Correct! Great job!");
      setScore((s) => s + 10);
      setTimeout(() => {
        setTargetAmount(getRandomAmount());
        setSelectedAmount(0);
        setMessage("Select coins and notes to match the target!");
      }, 1500);
    } else if (newAmount > targetAmount) {
      setMessage("Too much! Try again.");
      setTimeout(() => {
        setSelectedAmount(0);
        setMessage("Select coins and notes to match the target!");
      }, 1000);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>💰 Money Counting Game</CardTitle>
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            Target: ${targetAmount.toFixed(2)}
          </div>
          <div className="text-2xl text-blue-600">Selected: ${selectedAmount.toFixed(2)}</div>
          <div className="text-lg mt-2">{message}</div>
          <Badge variant="secondary" className="mt-2">
            Score: {score}
          </Badge>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Coins</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {coins.map((c) => (
              <Button
                key={c}
                onClick={() => addMoney(c)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                ${c < 1 ? c.toFixed(2) : c}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Notes</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {notes.map((n) => (
              <Button
                key={n}
                onClick={() => addMoney(n)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                ${n}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => setSelectedAmount(0)}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WordMatchGame({ onBack }) {
  const wordPairs = [
    { word: "cat", image: "🐱" },
    { word: "dog", image: "🐕" },
    { word: "apple", image: "🍎" },
    { word: "sun", image: "☀️" },
    { word: "book", image: "📚" },
    { word: "tree", image: "🌳" },
  ];

  const [currentWord, setCurrentWord] = useState(wordPairs[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Match the word to the picture!");

  React.useEffect(() => {
    shuffleOptions();
  }, [currentWord]);

  function shuffleOptions() {
    const shuffled = [...wordPairs].sort(() => Math.random() - 0.5).slice(0, 4);
    if (!shuffled.find((w) => w.word === currentWord.word)) {
      shuffled[0] = currentWord;
    }
    setOptions(shuffled.sort(() => Math.random() - 0.5));
  }

  function selectAnswer(word) {
    if (word === currentWord.word) {
      setMessage("🎉 Correct!");
      setScore((s) => s + 10);
      setTimeout(() => {
        const nextWord = wordPairs[Math.floor(Math.random() * wordPairs.length)];
        setCurrentWord(nextWord);
        setMessage("Match the word to the picture!");
      }, 1000);
    } else {
      setMessage("Try again!");
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📚 Word Match Game</CardTitle>
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">{currentWord.image}</div>
          <div className="text-lg">{message}</div>
          <Badge variant="secondary" className="mt-2">
            Score: {score}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <Button
              key={i}
              onClick={() => selectAnswer(opt.word)}
              className="text-xl py-6"
              variant="outline"
            >
              {opt.word}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MathQuizGame({ onBack }) {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Solve the problem!");

  function getCorrectAnswer() {
    if (operator === "+") return num1 + num2;
    if (operator === "-") return num1 - num2;
    if (operator === "×") return num1 * num2;
    return num1 + num2;
  }

  function checkAnswer() {
    if (parseInt(userAnswer) === getCorrectAnswer()) {
      setMessage("🎉 Correct!");
      setScore((s) => s + 10);
      setTimeout(newProblem, 1000);
    } else {
      setMessage(`Try again! The answer was ${getCorrectAnswer()}`);
      setTimeout(newProblem, 1500);
    }
  }

  function newProblem() {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setOperator(["+", "-", "×"][Math.floor(Math.random() * 3)]);
    setUserAnswer("");
    setMessage("Solve the problem!");
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🔢 Math Quiz</CardTitle>
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-4">
            {num1} {operator} {num2} = ?
          </div>
          <div className="text-lg">{message}</div>
          <Badge variant="secondary" className="mt-2">
            Score: {score}
          </Badge>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="text-3xl w-24 text-center border-2 rounded-lg p-2"
            placeholder="?"
          />
          <Button onClick={checkAnswer} size="lg">
            Check
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
            <Button
              key={n}
              variant="outline"
              onClick={() => setUserAnswer(userAnswer + n)}
              className="w-10 h-10"
            >
              {n}
            </Button>
          ))}
          <Button variant="outline" onClick={() => setUserAnswer("")}>
            C
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunicationGame({ onBack }) {
  const scenarios = [
    {
      situation: "You want to ask a teacher for help",
      options: ["Hey!", "Excuse me, can you help me please?", "Help now!"],
      correct: 1,
    },
    {
      situation: "You want to join a game with friends",
      options: ["Give me a turn!", "Can I play with you?", "Move over!"],
      correct: 1,
    },
    {
      situation: "Someone gives you a gift",
      options: ["I don't like it", "Thank you so much!", "Whatever"],
      correct: 1,
    },
    {
      situation: "You accidentally bump into someone",
      options: ["Watch it!", "I'm so sorry, are you okay?", "..."],
      correct: 1,
    },
  ];

  const [currentScenario, setCurrentScenario] = useState(scenarios[0]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Choose the best response!");

  function selectAnswer(index) {
    if (index === currentScenario.correct) {
      setMessage("🎉 Great choice! That's polite and friendly!");
      setScore((s) => s + 10);
      setTimeout(() => {
        setCurrentScenario(scenarios[Math.floor(Math.random() * scenarios.length)]);
        setMessage("Choose the best response!");
      }, 1500);
    } else {
      setMessage("Think about how that might make someone feel. Try again!");
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>💬 Communication Quest</CardTitle>
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-xl font-semibold bg-blue-50 p-4 rounded-lg mb-4">
            📋 {currentScenario.situation}
          </div>
          <div className="text-lg">{message}</div>
          <Badge variant="secondary" className="mt-2">
            Score: {score}
          </Badge>
        </div>

        <div className="space-y-3">
          {currentScenario.options.map((opt, i) => (
            <Button
              key={i}
              onClick={() => selectAnswer(i)}
              variant="outline"
              className="w-full text-left justify-start py-4"
            >
              {opt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Game definitions with metadata
const games = [
  {
    id: "money",
    title: "Money Counting",
    description: "Practice counting Australian coins and notes",
    icon: "💰",
    color: "bg-green-100",
    subject: "numeracy",
    difficulty: "easy",
    xpReward: 50,
    component: MoneyCountingGame,
  },
  {
    id: "words",
    title: "Word Match",
    description: "Match words to pictures for reading practice",
    icon: "📚",
    color: "bg-blue-100",
    subject: "literacy",
    difficulty: "easy",
    xpReward: 50,
    component: WordMatchGame,
  },
  {
    id: "math",
    title: "Math Quiz",
    description: "Practice addition, subtraction and multiplication",
    icon: "🔢",
    color: "bg-yellow-100",
    subject: "numeracy",
    difficulty: "medium",
    xpReward: 75,
    component: MathQuizGame,
  },
  {
    id: "communication",
    title: "Communication Quest",
    description: "Practice social and communication skills",
    icon: "💬",
    color: "bg-purple-100",
    subject: "language",
    difficulty: "medium",
    xpReward: 60,
    component: CommunicationGame,
  },
  {
    id: "life-skills",
    title: "Life Skills Challenge",
    description: "Learn everyday independence skills",
    icon: "🏠",
    color: "bg-pink-100",
    subject: "independence",
    difficulty: "easy",
    xpReward: 50,
    component: null, // Links to simulations
  },
  {
    id: "digital",
    title: "Digital Explorer",
    description: "Navigate technology and digital literacy",
    icon: "💻",
    color: "bg-cyan-100",
    subject: "digital",
    difficulty: "medium",
    xpReward: 70,
    component: null, // Coming soon
  },
];

const simulations = [
  { id: "supermarket", title: "Supermarket", icon: "🛒", path: "/supermarket" },
  { id: "clubhouse", title: "Clubhouse", icon: "🏠", path: "/clubhouse" },
  { id: "kitchen", title: "Kitchen", icon: "🍳", path: "/kitchen" },
  { id: "calmspace", title: "Calm Space", icon: "🧘", path: "/calmspace" },
  { id: "zoo", title: "Zoo", icon: "🦁", path: "/zoo" },
];

export default function GameArcade() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [playingGame, setPlayingGame] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredGames =
    filter === "all" ? games : games.filter((g) => g.subject === filter || g.difficulty === filter);

  const renderGameCard = (game) => {
    const guide = getCharacterForSubject(game.subject);
    return (
      <Card
        key={game.id}
        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${game.color}`}
        onClick={() => setSelectedGame(game)}
      >
        <CardContent className="p-4">
          <div className="text-4xl mb-2">{game.icon}</div>
          <h3 className="font-bold text-lg">{game.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{game.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MiniAvatar
                character={
                  game.subject === "language"
                    ? "lana"
                    : game.subject === "literacy"
                      ? "leo"
                      : game.subject === "numeracy"
                        ? "nia"
                        : game.subject === "digital"
                          ? "dex"
                          : "indy"
                }
                size={24}
              />
              <span className="text-xs">{guide.name}</span>
            </div>
            <Badge variant="secondary">+{game.xpReward} XP</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // If playing a game, render the game component
  if (playingGame && playingGame.component) {
    const GameComponent = playingGame.component;
    return (
      <GameComponent
        onBack={() => {
          setPlayingGame(null);
          setSelectedGame(null);
        }}
      />
    );
  }

  if (selectedGame) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">{selectedGame.icon}</span>
              {selectedGame.title}
            </CardTitle>
            <Button variant="outline" onClick={() => setSelectedGame(null)}>
              ← Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg mb-4">{selectedGame.description}</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge>Difficulty: {selectedGame.difficulty}</Badge>
              <Badge variant="secondary">+{selectedGame.xpReward} XP</Badge>
            </div>
            {selectedGame.component ? (
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => setPlayingGame(selectedGame)}
              >
                🎮 Play Now!
              </Button>
            ) : selectedGame.id === "life-skills" ? (
              <div className="space-y-3">
                <p className="text-gray-600">Try our life skills simulations:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {simulations.map((sim) => (
                    <Link key={sim.id} to={sim.path}>
                      <Button variant="outline">
                        {sim.icon} {sim.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-xl mb-2">🚧 Coming Soon!</p>
                <p>This game is being developed. Try our other games!</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Guide:{" "}
              <MiniAvatar
                character={
                  selectedGame.subject === "language"
                    ? "lana"
                    : selectedGame.subject === "literacy"
                      ? "leo"
                      : selectedGame.subject === "numeracy"
                        ? "nia"
                        : selectedGame.subject === "digital"
                          ? "dex"
                          : "indy"
                }
                size={24}
                style={{ display: "inline-block", verticalAlign: "middle" }}
              />{" "}
              {getCharacterForSubject(selectedGame.subject).name}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">🎮 Game Arcade</h2>
        <div className="flex gap-2">
          {["all", "easy", "medium", "numeracy", "literacy"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredGames.map(renderGameCard)}
      </div>

      {/* Simulations Section */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-xl mb-4">🌍 Virtual Simulations</h3>
        <div className="flex flex-wrap gap-3">
          {simulations.map((sim) => (
            <Link key={sim.id} to={sim.path}>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="text-xl">{sim.icon}</span>
                {sim.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Characters Section */}
      <div className="border-t pt-6 mt-6">
        <h3 className="font-semibold text-xl mb-4">👥 Meet Your Guides</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["language", "literacy", "numeracy", "digital", "independence"].map((subject) => {
            const char = getCharacterForSubject(subject);
            const charId =
              subject === "language"
                ? "lana"
                : subject === "literacy"
                  ? "leo"
                  : subject === "numeracy"
                    ? "nia"
                    : subject === "digital"
                      ? "dex"
                      : "indy";
            return (
              <div key={subject} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <MiniAvatar character={charId} size={48} />
                <span className="font-semibold text-sm mt-1">{char.name}</span>
                <span className="text-xs text-gray-500 capitalize">{subject}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
