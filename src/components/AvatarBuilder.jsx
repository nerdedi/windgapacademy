import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { cardVariant, celebration, charBob, feedbackPop, staggerGrid } from "../utils/animations";
import { DexFox, IndyKoala, LanaOwl, LeoLion, NiaPenguin, WinnieBear } from "./CharacterAvatar";

const CHARACTERS = [
  {
    id: "lana",
    name: "Lana the Owl",
    role: "Language Guide",
    subject: "Language",
    color: "#6D28D9",
    bg: "#EDE9FE",
    Component: LanaOwl,
  },
  {
    id: "leo",
    name: "Leo the Lion",
    role: "Literacy Champion",
    subject: "Literacy",
    color: "#D97706",
    bg: "#FEF3C7",
    Component: LeoLion,
  },
  {
    id: "nia",
    name: "Nia the Penguin",
    role: "Numeracy Expert",
    subject: "Numeracy",
    color: "#0891B2",
    bg: "#CFFAFE",
    Component: NiaPenguin,
  },
  {
    id: "dex",
    name: "Dex the Fox",
    role: "Digital Explorer",
    subject: "Digital",
    color: "#EA580C",
    bg: "#FFEDD5",
    Component: DexFox,
  },
  {
    id: "indy",
    name: "Indy the Koala",
    role: "Independence Coach",
    subject: "Life Skills",
    color: "#16A34A",
    bg: "#DCFCE7",
    Component: IndyKoala,
  },
  {
    id: "winnie",
    name: "Winnie the Bear",
    role: "AI Mentor & Friend",
    subject: "General",
    color: "#92400E",
    bg: "#FEF9C3",
    Component: WinnieBear,
  },
];

const BADGES = [
  { id: "star", emoji: "⭐", label: "Star Learner" },
  { id: "brain", emoji: "🧠", label: "Big Thinker" },
  { id: "heart", emoji: "❤️", label: "Kind Heart" },
  { id: "rocket", emoji: "🚀", label: "Fast Learner" },
  { id: "trophy", emoji: "🏆", label: "Champion" },
  { id: "book", emoji: "📚", label: "Book Worm" },
];

const BG_THEMES = [
  { id: "purple", label: "Purple", from: "#EDE9FE", to: "#C4B5FD" },
  { id: "blue", label: "Sky", from: "#DBEAFE", to: "#BAE6FD" },
  { id: "green", label: "Nature", from: "#DCFCE7", to: "#D1FAE5" },
  { id: "yellow", label: "Sunny", from: "#FEF9C3", to: "#FDE68A" },
  { id: "pink", label: "Blossom", from: "#FCE7F3", to: "#FBCFE8" },
  { id: "dark", label: "Night", from: "#312E81", to: "#1E1B4B" },
];

function saveAvatar(config) {
  try {
    localStorage.setItem("windgap_avatar", JSON.stringify(config));
  } catch (_) {}
}
function loadAvatar() {
  try {
    const raw = localStorage.getItem("windgap_avatar");
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export default function AvatarBuilder() {
  const saved = loadAvatar();
  const [selectedChar, setSelectedChar] = useState(saved?.characterId || "lana");
  const [selectedBg, setSelectedBg] = useState(saved?.bgTheme || "purple");
  const [selectedBadge, setSelectedBadge] = useState(saved?.badge || null);
  const [displayName, setDisplayName] = useState(saved?.displayName || "");
  const [wasSaved, setWasSaved] = useState(false);

  const char = CHARACTERS.find((c) => c.id === selectedChar) || CHARACTERS[0];
  const bg = BG_THEMES.find((b) => b.id === selectedBg) || BG_THEMES[0];
  const AvatarSVG = char.Component;

  function handleSave() {
    saveAvatar({
      characterId: selectedChar,
      bgTheme: selectedBg,
      badge: selectedBadge,
      displayName,
    });
    setWasSaved(true);
    setTimeout(() => setWasSaved(false), 2500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${char.color} 0%, ${char.color}BB 100%)` }}
      >
        <h1 className="text-3xl font-extrabold mb-1">Avatar Builder</h1>
        <p className="opacity-80">Choose your character guide and personalise your profile!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — selections */}
        <div className="lg:col-span-2 space-y-5">
          {/* Choose character */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Choose Your Guide</h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              variants={staggerGrid}
              initial="initial"
              animate="animate"
            >
              {CHARACTERS.map((c) => {
                const Comp = c.Component;
                const isSelected = selectedChar === c.id;
                return (
                  <motion.button
                    key={c.id}
                    variants={cardVariant}
                    onClick={() => setSelectedChar(c.id)}
                    whileHover={{
                      scale: 1.04,
                      y: -4,
                      transition: { type: "spring", stiffness: 360, damping: 22 },
                    }}
                    whileTap={{
                      scale: 0.94,
                      transition: { type: "spring", stiffness: 460, damping: 20 },
                    }}
                    animate={
                      isSelected
                        ? {
                            scale: 1.05,
                            transition: { type: "spring", stiffness: 400, damping: 18 },
                          }
                        : { scale: 1 }
                    }
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-colors ${
                      isSelected
                        ? "border-[#0B6E8F] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={isSelected ? { backgroundColor: c.bg } : {}}
                  >
                    <Comp size={64} />
                    <span className="font-bold text-sm text-gray-800 mt-2">{c.name}</span>
                    <span className="text-xs text-gray-500">{c.role}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Background theme */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-3">Background Theme</h2>
            <div className="flex gap-3 flex-wrap">
              {BG_THEMES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBg(b.id)}
                  title={b.label}
                  className={`w-12 h-12 rounded-xl border-2 transition-all ${selectedBg === b.id ? "border-[#0B6E8F] scale-110 shadow" : "border-gray-200 hover:border-gray-400"}`}
                  style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{bg.label} theme selected</p>
          </div>

          {/* Badge */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-3">Choose a Badge</h2>
            <div className="flex gap-3 flex-wrap">
              {BADGES.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id === selectedBadge ? null : badge.id)}
                  title={badge.label}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedBadge === badge.id ? "border-[#0B6E8F] bg-blue-50 shadow" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-xs text-gray-600 mt-1">{badge.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Display name */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg mb-3">Your Display Name</h2>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={30}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B6E8F] focus:outline-none text-gray-800 text-base"
            />
          </div>
        </div>

        {/* Right — live preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-4">
            <h2 className="font-bold text-gray-800 text-lg mb-4 text-center">Preview</h2>
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3 transition-all"
              style={{ background: `linear-gradient(135deg, ${bg.from}, ${bg.to})` }}
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedChar}
                    variants={celebration}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div animate={charBob.animate}>
                      <AvatarSVG size={110} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                {selectedBadge && (
                  <motion.span
                    key={selectedBadge}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: { type: "spring", stiffness: 500, damping: 18 },
                    }}
                    className="absolute -bottom-1 -right-1 text-2xl"
                    title={BADGES.find((b) => b.id === selectedBadge)?.label}
                  >
                    {BADGES.find((b) => b.id === selectedBadge)?.emoji}
                  </motion.span>
                )}
              </div>
              <div className="text-center">
                <p className="font-extrabold text-gray-800 text-base">
                  {displayName || "Your Name"}
                </p>
                <p className="text-sm font-medium" style={{ color: char.color }}>
                  {char.role}
                </p>
                <p className="text-xs text-gray-500">{char.subject} learner</p>
              </div>
            </div>
            <motion.button
              onClick={handleSave}
              whileHover={{
                scale: 1.03,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{
                scale: 0.94,
                y: 2,
                transition: { type: "spring", stiffness: 500, damping: 18 },
              }}
              className="w-full mt-4 py-3 rounded-xl font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg, #0B6E8F, #095a74)" }}
            >
              {wasSaved ? "✓ Saved!" : "💾 Save Avatar"}
            </motion.button>
            <AnimatePresence>
              {wasSaved && (
                <motion.p
                  variants={feedbackPop}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center text-green-600 text-sm font-medium mt-2"
                >
                  Your avatar has been saved!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
