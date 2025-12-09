import { useCallback, useState } from "react";
import {
  FaAward,
  FaBolt,
  FaBookOpen,
  FaBrain,
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaHeart,
  FaStar,
  FaTimesCircle,
  FaTrophy,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

// Game data
const GAME_PHRASES = [
  "DIGITAL LITERACY",
  "COMMUNICATION SKILLS",
  "MONEY MANAGEMENT",
  "LIFE SKILLS",
  "INDEPENDENCE",
  "SOCIAL INTERACTION",
  "PROBLEM SOLVING",
  "TIME MANAGEMENT",
  "HEALTHY LIVING",
];

const LEARNING_MODULES = [
  {
    id: "literacy",
    name: "Literacy",
    icon: FaBookOpen,
    color: "from-blue-500 to-blue-600",
    lessons: 12,
  },
  {
    id: "numeracy",
    name: "Numeracy",
    icon: FaBrain,
    color: "from-purple-500 to-purple-600",
    lessons: 15,
  },
  {
    id: "digital",
    name: "Digital Skills",
    icon: FaBolt,
    color: "from-green-500 to-green-600",
    lessons: 10,
  },
  {
    id: "life",
    name: "Life Skills",
    icon: FaHeart,
    color: "from-pink-500 to-pink-600",
    lessons: 18,
  },
];

const WindgapAcademy = () => {
  const [currentView, setCurrentView] = useState("home");
  const [userProgress, setUserProgress] = useState({
    totalPoints: 0,
    streak: 0,
    completedLessons: 0,
    badges: [],
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Winnie's Words Game State
  const [gameState, setGameState] = useState({
    phrase: "",
    guessedLetters: [],
    lives: 5,
    wins: 0,
    losses: 0,
    isPlaying: false,
    gameOver: false,
    won: false,
  });

  const initializeGame = useCallback(() => {
    const randomPhrase = GAME_PHRASES[Math.floor(Math.random() * GAME_PHRASES.length)];
    setGameState({
      phrase: randomPhrase,
      guessedLetters: [],
      lives: 5,
      wins: gameState.wins,
      losses: gameState.losses,
      isPlaying: true,
      gameOver: false,
      won: false,
    });
  }, [gameState.wins, gameState.losses]);

  const handleLetterGuess = useCallback(
    (letter) => {
      if (gameState.gameOver || gameState.guessedLetters.includes(letter)) return;

      const newGuessedLetters = [...gameState.guessedLetters, letter];
      const isCorrect = gameState.phrase.includes(letter);

      let newLives = gameState.lives;
      if (!isCorrect) {
        newLives -= 1;
        if (soundEnabled) playSound("wrong");
      } else {
        if (soundEnabled) playSound("correct");
      }

      // Check win condition
      const allLettersGuessed = gameState.phrase
        .split("")
        .filter((char) => char !== " ")
        .every((char) => newGuessedLetters.includes(char));

      const newGameState = {
        ...gameState,
        guessedLetters: newGuessedLetters,
        lives: newLives,
      };

      if (allLettersGuessed) {
        newGameState.gameOver = true;
        newGameState.won = true;
        newGameState.wins = gameState.wins + 1;
        setUserProgress((prev) => ({
          ...prev,
          totalPoints: prev.totalPoints + 100,
          completedLessons: prev.completedLessons + 1,
        }));
        if (soundEnabled) playSound("win");
      } else if (newLives === 0) {
        newGameState.gameOver = true;
        newGameState.won = false;
        newGameState.losses = gameState.losses + 1;
        if (soundEnabled) playSound("lose");
      }

      setGameState(newGameState);
    },
    [gameState, soundEnabled],
  );

  const playSound = (type) => {
    // Placeholder for sound effects - can integrate with Web Audio API
    console.log(`Playing ${type} sound`);
  };

  const renderPhrase = () => {
    return gameState.phrase.split("").map((char, index) => {
      if (char === " ") {
        return <div key={index} className="w-4" aria-hidden="true" />;
      }
      const isGuessed = gameState.guessedLetters.includes(char);
      return (
        <div
          key={index}
          className="w-12 h-16 border-b-4 border-[#A32C2B] flex items-center justify-center text-2xl font-bold text-[#A32C2B] mx-1"
          role="text"
          aria-label={isGuessed ? `Letter ${char}` : "Hidden letter"}
        >
          {isGuessed ? char : ""}
        </div>
      );
    });
  };

  const renderKeyboard = () => {
    const rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M"],
    ];

    return rows.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="flex justify-center gap-2 mb-2"
        role="group"
        aria-label={`Keyboard row ${rowIndex + 1}`}
      >
        {row.map((letter) => {
          const isGuessed = gameState.guessedLetters.includes(letter);
          const isCorrect = gameState.phrase.includes(letter);

          let buttonClass =
            "w-12 h-12 rounded-lg font-bold text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FBBF24]";

          if (isGuessed) {
            buttonClass += isCorrect
              ? " bg-green-500 text-white cursor-not-allowed"
              : " bg-red-500 text-white cursor-not-allowed";
          } else {
            buttonClass += " bg-[#5ED1D2] text-[#A32C2B] hover:bg-[#A32C2B] hover:text-white";
          }

          return (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={gameState.gameOver || isGuessed}
              className={buttonClass}
              aria-label={`Letter ${letter}${isGuessed ? (isCorrect ? " - correct" : " - incorrect") : ""}`}
              aria-pressed={isGuessed}
            >
              {letter}
            </button>
          );
        })}
      </div>
    ));
  };

  // Home View
  const HomeView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5ED1D2] via-[#A32C2B] to-[#FBBF24] rounded-3xl p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNGRkYiLz48L2c+PC9zdmc+')] animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Windgap Academy
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Empowering neurodivergent learners aged 16+ with accessible, engaging education
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentView("modules")}
              className="bg-white text-[#A32C2B] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
              aria-label="Navigate to learning modules"
            >
              Start Learning
            </button>
            <button
              onClick={() => setCurrentView("game")}
              className="bg-[#FBBF24] text-[#A32C2B] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
              aria-label="Play Winnie's Words game"
            >
              Play Winnie&apos;s Words
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        role="region"
        aria-label="Your learning statistics"
      >
        {[
          {
            icon: FaBullseye,
            label: "Total Points",
            value: userProgress.totalPoints,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
          },
          {
            icon: FaChartLine,
            label: "Streak Days",
            value: userProgress.streak,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
          },
          {
            icon: FaCheckCircle,
            label: "Completed",
            value: userProgress.completedLessons,
            color: "bg-gradient-to-br from-green-500 to-green-600",
          },
          {
            icon: FaAward,
            label: "Badges",
            value: userProgress.badges.length,
            color: "bg-gradient-to-br from-purple-500 to-purple-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all`}
          >
            <stat.icon className="w-10 h-10 mb-3 opacity-80" aria-hidden="true" />
            <p className="text-sm opacity-80 mb-1">{stat.label}</p>
            <p className="text-4xl font-bold" aria-label={`${stat.label}: ${stat.value}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Learning Modules */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-[#A32C2B]">Your Learning Path</h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Available learning modules"
        >
          {LEARNING_MODULES.map((module) => (
            <div
              key={module.id}
              onClick={() => setCurrentView("modules")}
              onKeyPress={(e) => e.key === "Enter" && setCurrentView("modules")}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer border-2 border-transparent hover:border-[#5ED1D2] focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
              role="listitem"
              tabIndex={0}
              aria-label={`${module.name} module, ${module.lessons} lessons available, 35% complete`}
            >
              <div
                className={`bg-gradient-to-br ${module.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}
              >
                <module.icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{module.name}</h3>
              <p className="text-gray-600 mb-4">{module.lessons} lessons available</p>
              <div
                className="w-full bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-valuenow={35}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-[#5ED1D2] h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2" aria-label="Progress: 35 percent complete">
                35% complete
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Game View
  const GameView = () => (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-[#FBBF24] via-[#5ED1D2] to-[#A32C2B] rounded-3xl p-8 shadow-2xl">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <FaBookOpen className="w-12 h-12 text-[#A32C2B]" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                Winnie&apos;s Words
              </h1>
              <p className="text-white text-lg opacity-90">Guess the phrase and learn!</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-white rounded-full p-3 hover:scale-110 transform transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <FaVolumeUp className="w-6 h-6 text-[#A32C2B]" />
            ) : (
              <FaVolumeMute className="w-6 h-6 text-[#A32C2B]" />
            )}
          </button>
        </div>

        {/* Score Display */}
        <div className="flex justify-center gap-8 mb-8" role="region" aria-label="Game score">
          <div className="bg-white/90 rounded-2xl px-8 py-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Wins</p>
            <p className="text-3xl font-bold text-green-600" aria-label={`${gameState.wins} wins`}>
              {gameState.wins}
            </p>
          </div>
          <div className="bg-white/90 rounded-2xl px-8 py-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Losses</p>
            <p
              className="text-3xl font-bold text-red-600"
              aria-label={`${gameState.losses} losses`}
            >
              {gameState.losses}
            </p>
          </div>
        </div>

        {!gameState.isPlaying ? (
          /* Start Screen */
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
              <FaTrophy className="w-24 h-24 text-[#FBBF24] mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-[#A32C2B] mb-4">Ready to Play?</h2>
              <p className="text-gray-600 text-lg mb-8">
                Guess letters to reveal the hidden phrase. You have 5 lives!
              </p>
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-[#5ED1D2] to-[#A32C2B] text-white px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transform transition-all shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
                aria-label="Start new game"
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          /* Game Screen */
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Lives Display */}
            <div
              className="flex justify-center gap-3 mb-8"
              role="status"
              aria-label={`${gameState.lives} lives remaining`}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`transition-all transform ${i < gameState.lives ? "scale-100" : "scale-75 opacity-30"}`}
                >
                  <FaHeart
                    className={`w-12 h-12 ${i < gameState.lives ? "text-red-500" : "text-gray-300"}`}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>

            {/* Phrase Display */}
            <div
              className="flex flex-wrap justify-center mb-8 gap-2"
              role="region"
              aria-label="Phrase to guess"
              aria-live="polite"
            >
              {renderPhrase()}
            </div>

            {/* Game Over Message */}
            {gameState.gameOver && (
              <div
                className={`text-center mb-6 p-6 rounded-2xl ${gameState.won ? "bg-green-100" : "bg-red-100"}`}
                role="alert"
              >
                {gameState.won ? (
                  <>
                    <FaCheckCircle
                      className="w-16 h-16 text-green-600 mx-auto mb-3"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations! 🎉</h3>
                    <p className="text-green-700">You solved: {gameState.phrase}</p>
                  </>
                ) : (
                  <>
                    <FaTimesCircle
                      className="w-16 h-16 text-red-600 mx-auto mb-3"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl font-bold text-red-800 mb-2">Game Over</h3>
                    <p className="text-red-700">The phrase was: {gameState.phrase}</p>
                  </>
                )}
                <button
                  onClick={initializeGame}
                  className="mt-4 bg-[#5ED1D2] text-white px-8 py-3 rounded-full font-bold hover:bg-[#A32C2B] transition-all focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
                  aria-label="Play another game"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Keyboard */}
            <div className="mt-8" role="region" aria-label="Letter keyboard">
              {renderKeyboard()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modules View
  const ModulesView = () => (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-[#A32C2B]">Learning Modules</h1>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        role="list"
        aria-label="Available learning modules"
      >
        {LEARNING_MODULES.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
            role="listitem"
          >
            <div className={`bg-gradient-to-br ${module.color} p-8`}>
              <module.icon className="w-16 h-16 text-white mb-4" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-white">{module.name}</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-600 mb-6 text-lg">
                {module.lessons} interactive lessons designed for your learning style
              </p>
              <div
                className="space-y-4 mb-6"
                role="list"
                aria-label={`Lessons in ${module.name} module`}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
                    role="listitem"
                    tabIndex={0}
                    aria-label={`Lesson ${i + 1}, 15 minutes`}
                  >
                    <FaStar className="w-5 h-5 text-[#FBBF24]" aria-hidden="true" />
                    <span className="font-semibold text-gray-700">Lesson {i + 1}</span>
                    <span className="ml-auto text-sm text-gray-500">15 min</span>
                  </div>
                ))}
              </div>
              <button
                className="w-full bg-[#5ED1D2] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#A32C2B] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#FBBF24]"
                aria-label={`Start ${module.name} module`}
              >
                Start Module
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav
        className="bg-white shadow-lg sticky top-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#5ED1D2] to-[#A32C2B] rounded-2xl p-3">
                <FaBookOpen className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-extrabold text-[#A32C2B]">Windgap Academy</span>
            </div>
            <div className="flex gap-2" role="group" aria-label="View navigation">
              {[
                { id: "home", label: "Home" },
                { id: "modules", label: "Modules" },
                { id: "game", label: "Game" },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-[#FBBF24] ${
                    currentView === view.id
                      ? "bg-[#A32C2B] text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={`Navigate to ${view.label}`}
                  aria-current={currentView === view.id ? "page" : undefined}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8" role="main">
        {currentView === "home" && <HomeView />}
        {currentView === "game" && <GameView />}
        {currentView === "modules" && <ModulesView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">
            © 2025 Windgap Academy • NDIS Compliant • Educator Reviewed • Ad-Free
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WindgapAcademy;
