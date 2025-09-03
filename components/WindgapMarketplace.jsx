import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import useAnalytics from "../hooks/useAnalytics";
import useCustomization from "../hooks/useCustomization";
import useSecureToken from "../hooks/useSecureToken";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import Buy from "../pages/Buy";
import Exchange from "../pages/Exchange";
import Home from "../pages/Home";
import Sell from "../pages/Sell";
import {
  letterMap,
  punctuationMap1,
  punctuationMap2,
  longPunctuationMap,
} from "../utils/speechrecMappings";

import BabylonScene from "./BabylonScene";
import BackToTopButton from "./BackToTopButton";
import DropdownMenu from "./DropdownMenu";
import Footer from "./Footer";
import IslandScene from "./IslandScene";
import LottieAnimation from "./LottieAnimation";
import Navbar from "./Navbar";
import PlanetModel from "./PlanetModel";
import Spinner from "./Spinner";
import StickyNavbar from "./StickyNavbar";
import Tooltip from "./Tooltip";

const WindgapMarketplace = () => {
  // Speech recognition hooks
  useSpeechRecognition({
    commands: [
      {
        phrase: "enter calm space",
        action: () => alert("Welcome to Calm Space! (voice command)"),
      },
      {
        phrase: "exit calm space",
        action: () => alert("Exited Calm Space (voice command)"),
      },
      {
        phrase: /^close chat|exit chat$/,
        action: () => {
          setShowChat(false);
          alert("Closed chat (voice command)");
        },
      },
      {
        phrase: /^send (.+)$/,
        action: (phrase, match) => alert(`Sent message: ${match[1]}`),
      },
      {
        phrase: /.*/,
        action: (phrase) => {
          const char =
            letterMap[phrase] ||
            punctuationMap1[phrase] ||
            punctuationMap2[phrase] ||
            longPunctuationMap[phrase];
          if (char) {
            const itemMap = {
              a: "apple",
              b: "broccoli",
              c: "carrot",
              d: "daikon",
              e: "eggplant",
              f: "fennel",
              g: "garlic",
              h: "horseradish",
              i: "iceberg lettuce",
              j: "jalapeno",
              k: "kale",
              l: "leek",
              m: "mushroom",
              n: "napa cabbage",
              o: "onion",
              p: "potato",
              q: "quince",
              r: "radish",
              s: "spinach",
              t: "tomato",
              u: "ugli fruit",
              v: "vanilla bean",
              w: "watermelon",
              x: "xigua (Chinese melon)",
              y: "yam",
              z: "zucchini",
              ".": "salt",
              ",": "pepper",
              "+": "ingredient",
              "-": "ingredient (removed)",
            };
            alert(`Added ${itemMap[char] || char} to cart (voice command)`);
          } else {
            alert(`No mapping found for phrase: ${phrase}`);
          }
        },
      },
    ],
  });
  const [tokens, setTokens] = useState(100);
  const [showOnboarding, setShowOnboarding] = useState(true);
  // Live data integration points (replace with API calls)
  const [avatars, setAvatars] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  // Example: Fetch avatars/leaderboard from backend
  React.useEffect(() => {
    // Replace with real API calls
    setAvatars([
      { name: "Alice", img: "/assets/avatars/alice.png" },
      { name: "Bob", img: "/assets/avatars/bob.png" },
      { name: "Winnie", img: "/assets/avatars/winnie-mascot.png" },
    ]);
    setLeaderboard([
      { name: "Alice", score: 120 },
      { name: "Bob", score: 95 },
      { name: "Winnie", score: 80 },
    ]);
  }, []);
  const [userPrefs, setUserPrefs] = useCustomization({ campusView: "default", avatar: null });
  const [secureToken, setSecureToken] = useSecureToken();
  useAnalytics("page_view", { page: "WindgapMarketplace" });

  // Mini-game and ClubHouse handlers
  // Mini-game modal state
  const [showMiniGame, setShowMiniGame] = useState(false);
  const handleMiniGameClick = () => setShowMiniGame(true);
  const handleMiniGameComplete = () => {
    const reward = Math.floor(Math.random() * 20) + 5;
    setTokens(tokens + reward);
    setLeaderboard((prev) => [
      { name: "You", score: (prev[0]?.score || 0) + reward },
      ...prev.slice(1),
    ]);
    setShowMiniGame(false);
    alert(`Mini-game complete! You earned ${reward} tokens.`);
  };
  // ClubHouse chat modal state
  const [showChat, setShowChat] = useState(false);
  const handleClubHouseClick = () => setShowChat(true);
  const handleCloseChat = () => setShowChat(false);

  // Modular modal component
  const Modal = ({ show, onClose, title, children, ariaLabel }) =>
    show ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
          <div>{children}</div>
          {onClose && (
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={onClose}
              aria-label={`Close ${ariaLabel || title}`}
            >
              Close
            </button>
          )}
        </div>
      </div>
    ) : null;

  return (
    <main className="marketplace-container relative" aria-label="Windgap Marketplace" role="main">
      <StickyNavbar>
        <Navbar name="Windgap Academy of Learning" tokens={tokens} />
        <DropdownMenu label="Menu">
          <a href="/buy" className="block px-4 py-2 hover:bg-blue-100" role="menuitem">
            Buy
          </a>
          <a href="/sell" className="block px-4 py-2 hover:bg-blue-100" role="menuitem">
            Sell
          </a>
          <a href="/exchange" className="block px-4 py-2 hover:bg-blue-100" role="menuitem">
            Exchange
          </a>
        </DropdownMenu>
      </StickyNavbar>
      <Modal
        show={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        title="Welcome to Windgap Marketplace!"
        ariaLabel="Onboarding"
      >
        <p className="mb-4">
          Explore the campus, interact with buildings, play mini-games, and join the ClubHouse for
          social events.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowOnboarding(false)}
          aria-label="Close onboarding"
        >
          Get Started
        </button>
      </Modal>
      {/* Responsive 3D campus with interactive elements */}
      <div className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] relative bg-gradient-to-b from-blue-300 to-indigo-500">
        <Spinner show={false} size={40} className="absolute left-1/2 top-1/2" />
        {/* Lottie animation demo */}
        <div className="absolute left-8 top-8 z-30">
          <Tooltip text="Animated mascot">
            <LottieAnimation
              src="/assets/lottie/winnie.json"
              loop={true}
              style={{ width: 80, height: 80 }}
            />
          </Tooltip>
        </div>
        {/* Babylon.js 3D scene demo */}
        <div className="absolute right-8 top-8 z-30">
          <Tooltip text="3D campus demo">
            <BabylonScene createScene={window.createScene} width={200} height={120} />
          </Tooltip>
        </div>
        {/* Calm Space access button with tooltip */}
        <Tooltip text="Relax and recharge">
          <button
            className="absolute left-1/2 bottom-24 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold"
            aria-label="Enter Calm Space"
            onClick={() => alert("Welcome to Calm Space!")}
          >
            Enter Calm Space
          </button>
        </Tooltip>
        {/* Avatars and leaderboard overlays */}
        <div
          className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-lg p-2 shadow-md"
          aria-label="Leaderboard"
        >
          <h3 className="font-bold text-sm mb-1">Leaderboard</h3>
          <ul>
            {leaderboard.map((entry, i) => (
              <li key={i} className="text-xs">
                {entry.name}: {entry.score}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="absolute bottom-4 left-4 bg-white bg-opacity-80 rounded-lg p-2 shadow-md"
          aria-label="Avatars"
        >
          <h3 className="font-bold text-sm mb-1">Avatars</h3>
          <div className="flex gap-2">
            {avatars.map((a, i) => (
              <div key={i} className="flex flex-col items-center">
                <img src={a.img} alt={a.name} className="w-8 h-8 rounded-full border" />
                <span className="text-xs mt-1">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Mini-game and ClubHouse buttons */}
        <button
          className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded shadow-md"
          onClick={handleMiniGameClick}
          aria-label="Play Mini-Game"
        >
          Play Mini-Game
        </button>
        <button
          className="absolute bottom-16 right-4 bg-orange-500 text-white px-3 py-2 rounded shadow-md"
          onClick={handleClubHouseClick}
          aria-label="Open ClubHouse"
        >
          ClubHouse
        </button>
        {/* Mini-game modal */}
        <Modal
          show={showMiniGame}
          onClose={() => setShowMiniGame(false)}
          title="Mini-Game"
          ariaLabel="Mini-Game"
        >
          <p className="mb-4">Complete the challenge to earn tokens!</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
            onClick={handleMiniGameComplete}
          >
            Finish Game
          </button>
        </Modal>
        {/* ClubHouse chat modal */}
        <Modal
          show={showChat}
          onClose={handleCloseChat}
          title="ClubHouse Chat"
          ariaLabel="ClubHouse Chat"
        >
          <div className="flex-1 mb-2 overflow-y-auto" style={{ minHeight: 120 }}>
            {/* Replace with real chat messages */}
            <div className="text-xs mb-1">Alice: Hi everyone!</div>
            <div className="text-xs mb-1">Bob: Welcome to the ClubHouse!</div>
          </div>
          <input
            type="text"
            className="border rounded px-2 py-1 mb-2"
            placeholder="Type a message..."
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Send</button>
        </Modal>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy tokens={tokens} setTokens={setTokens} />} />
        <Route path="/sell" element={<Sell tokens={tokens} setTokens={setTokens} />} />
        <Route path="/exchange" element={<Exchange tokens={tokens} setTokens={setTokens} />} />
      </Routes>
      {/* Feedback form and analytics (scaffold) */}
      <form
        className="mt-8 p-4 bg-gray-100 rounded-lg shadow"
        aria-label="Feedback Form"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Feedback submitted!");
        }}
      >
        <label htmlFor="feedback" className="block font-bold mb-2">
          Feedback:
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={3}
          className="w-full p-2 border rounded mb-2"
          aria-required="true"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      <BackToTopButton />
      <Footer name="Windgap Academy of Learning" />
    </main>
  );
};

export default WindgapMarketplace;
