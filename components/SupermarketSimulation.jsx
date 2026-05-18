import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cardVariant, charBobSm, feedbackPop, pageVariants, staggerGrid } from "../src/utils/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    emoji: "🛒",
    title: "Get a trolley or basket",
    desc: "At the entrance, pick up a trolley for a big shop or a basket for just a few things.",
    tip: "Tip: Trolleys are near the entrance. You may need a $1 or $2 coin to unlock it.",
  },
  {
    emoji: "📋",
    title: "Check your shopping list",
    desc: "Look at what you need to buy before you start walking through the aisles. A list helps you remember everything!",
    tip: "Tip: Group your list by section — all fruit together, all dairy together. It saves time!",
  },
  {
    emoji: "🗺️",
    title: "Find each section",
    desc: "Walk through the store to find your items. Look for the signs hanging from the ceiling — they tell you what's in each aisle.",
    tip: "Tip: Can't find something? Ask a staff member in a green uniform — they're always happy to help!",
  },
  {
    emoji: "🧺",
    title: "Add items to your trolley",
    desc: "Pick up each item on your list and put it in your trolley or basket. Check the price and use-by date.",
    tip: "Tip: Check the use-by date on dairy and meat. Pick the freshest one!",
  },
  {
    emoji: "💳",
    title: "Go to the checkout",
    desc: "When you have everything, head to the checkout. You can use a staffed register or the self-checkout machines.",
    tip: "Tip: Self-checkout is fast for small shops. A staffed register is better if you have lots of items.",
  },
  {
    emoji: "💰",
    title: "Pay for your shopping",
    desc: "Place items on the belt or scan them yourself. Pay with cash, card, or tap your phone. Wait for your receipt.",
    tip: "Tip: Keep your receipt! If something is wrong with an item, you'll need it to get a refund.",
  },
  {
    emoji: "🛍️",
    title: "Pack your bags and go home",
    desc: "Pack your bags carefully — heavy items like milk and cans go at the bottom. Grab your receipt and head home!",
    tip: "Tip: Bring reusable bags to save money and help the environment.",
  },
];

const ITEMS = [
  { name: "Apple",   emoji: "🍎", section: "produce", price: "$0.99" },
  { name: "Banana",  emoji: "🍌", section: "produce", price: "$0.79" },
  { name: "Broccoli",emoji: "🥦", section: "produce", price: "$2.50" },
  { name: "Bread",   emoji: "🍞", section: "bakery",  price: "$3.50" },
  { name: "Muffin",  emoji: "🧁", section: "bakery",  price: "$1.80" },
  { name: "Milk",    emoji: "🥛", section: "dairy",   price: "$2.20" },
  { name: "Cheese",  emoji: "🧀", section: "dairy",   price: "$5.00" },
  { name: "Eggs",    emoji: "🥚", section: "dairy",   price: "$4.50" },
  { name: "Yoghurt", emoji: "🍶", section: "dairy",   price: "$3.00" },
];

const AREAS = [
  { id: "entrance", label: "🚪 Entrance",  desc: "You just arrived! Get a trolley or basket first." },
  { id: "produce",  label: "🥦 Produce",   desc: "Fresh fruit and vegetables are here." },
  { id: "bakery",   label: "🍞 Bakery",    desc: "Bread, rolls, cakes and pastries." },
  { id: "dairy",    label: "🥛 Dairy",     desc: "Milk, cheese, eggs and yoghurt." },
  { id: "checkout", label: "💳 Checkout",  desc: "Pay for your items here. You're nearly done!" },
];

const WATCH_TIPS = [
  "✅ How does the person get a trolley at the entrance?",
  "✅ Which sections (fruit, bread, dairy) do they walk through?",
  "✅ How do they pay at the checkout — cash, card or tap?",
  "✅ What do they do after paying?",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // Prefer Australian voice
    const voices = window.speechSynthesis.getVoices();
    const auVoice = voices.find((v) => v.lang === "en-AU") || voices.find((v) => v.lang.startsWith("en"));
    if (auVoice) u.voice = auVoice;
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  }
}

const GREEN = "linear-gradient(135deg, #00A651 0%, #007A3D 100%)";

// ─── Main component ───────────────────────────────────────────────────────────

export default function SupermarketSimulation() {
  const [phase, setPhase]           = useState("video");    // video | steps | practice
  const [stepIdx, setStepIdx]       = useState(0);
  const [location, setLocation]     = useState("entrance");
  const [cart, setCart]             = useState([]);
  const [message, setMessage]       = useState("Welcome to Woolworths! Start by getting a trolley.");
  const [checkedOut, setCheckedOut] = useState(false);
  const [msgType, setMsgType]       = useState("info");      // info | success | warn

  function setMsg(text, type = "info") {
    setMessage(text);
    setMsgType(type);
    speak(text);
  }

  function goTo(area) {
    setLocation(area.id);
    setMsg(area.desc);
  }

  function addItem(item) {
    if (cart.includes(item.name)) {
      setMsg(`${item.name} is already in your trolley!`, "warn");
      return;
    }
    const next = [...cart, item.name];
    setCart(next);
    setMsg(`${item.emoji} Added ${item.name} to your trolley! (${next.length} item${next.length !== 1 ? "s" : ""})`, "success");
  }

  function checkout() {
    if (cart.length === 0) {
      setMsg("Your trolley is empty! Go to the produce, bakery or dairy sections first.", "warn");
      return;
    }
    setCheckedOut(true);
    setMsg(`🎉 You bought ${cart.length} item${cart.length !== 1 ? "s" : ""}! Fantastic shopping!`, "success");
  }

  function reset() {
    setCart([]);
    setLocation("entrance");
    setCheckedOut(false);
    setMsg("Welcome back! Time to shop again.", "info");
  }

  const currentArea   = AREAS.find((a) => a.id === location);
  const availableItems = ITEMS.filter((i) => i.section === location);
  const msgBg =
    msgType === "success" ? "bg-green-50 border-green-200 text-green-800"
    : msgType === "warn"  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                          : "bg-blue-50 border-blue-200 text-blue-800";

  // ── Phase: Video ────────────────────────────────────────────────────────────
  if (phase === "video") {
    return (
      <motion.div
        className="max-w-3xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate" exit="exit"
      >
        {/* Header */}
        <div className="rounded-2xl p-6 text-white" style={{ background: GREEN }}>
          <div className="text-4xl mb-2">🛒</div>
          <h1 className="text-2xl font-extrabold mb-1">Shopping at Woolworths</h1>
          <p className="opacity-85 text-sm">
            Watch the video below to see what a supermarket trip looks like, then we'll practise together!
          </p>
        </div>

        {/* Video */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-3">🎬 Watch: A trip to the supermarket</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm">
            <iframe
              width="100%"
              style={{ aspectRatio: "16/9", display: "block" }}
              src="https://www.youtube.com/embed/CQmIF_v4cJs?rel=0&modestbranding=1"
              title="A trip to the supermarket — Woolworths"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Watch-for tips */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="font-semibold text-green-800 mb-3">🤔 While you watch, look out for:</p>
            <motion.ul
              className="space-y-2"
              variants={staggerGrid} initial="initial" animate="animate"
            >
              {WATCH_TIPS.map((tip, i) => (
                <motion.li key={i} variants={cardVariant} className="text-green-700 text-sm flex gap-2">
                  {tip}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <motion.button
          onClick={() => setPhase("steps")}
          whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
          whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 460, damping: 18 } }}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md"
          style={{ background: GREEN }}
        >
          I've watched it — what do I do at the supermarket? →
        </motion.button>
      </motion.div>
    );
  }

  // ── Phase: Steps ────────────────────────────────────────────────────────────
  if (phase === "steps") {
    const step = STEPS[stepIdx];
    const isLast = stepIdx === STEPS.length - 1;
    return (
      <motion.div
        className="max-w-3xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate" exit="exit"
      >
        {/* Header + progress */}
        <div className="rounded-2xl p-5 text-white" style={{ background: GREEN }}>
          <h1 className="text-xl font-extrabold mb-1">📋 What to do at the supermarket</h1>
          <p className="opacity-75 text-sm mb-2">
            Step {stepIdx + 1} of {STEPS.length}
          </p>
          <div className="bg-white/25 rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ y: [0, -8, 0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              {step.emoji}
            </motion.div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">{step.title}</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">{step.desc}</p>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-left mb-4">
              <p className="text-amber-800 text-sm">{step.tip}</p>
            </div>
            <button
              onClick={() => speak(`${step.title}. ${step.desc}. ${step.tip}`)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              🔊 Read aloud
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-1">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === stepIdx   ? "w-5 h-3 bg-green-600"
                : i < stepIdx  ? "w-3 h-3 bg-green-300"
                               : "w-3 h-3 bg-gray-200"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => stepIdx > 0 ? setStepIdx((s) => s - 1) : setPhase("video")}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Back
          </motion.button>
          <motion.button
            onClick={() => isLast ? setPhase("practice") : setStepIdx((s) => s + 1)}
            whileHover={{ scale: 1.02, y: -1, transition: { type: "spring", stiffness: 380, damping: 20 } }}
            whileTap={{ scale: 0.96 }}
            className="py-3 px-8 rounded-xl font-bold text-white shadow-md"
            style={{ background: GREEN, flex: 2 }}
          >
            {isLast ? "🎮 Let's practise! →" : "Next step →"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Phase: Practice ─────────────────────────────────────────────────────────
  return (
    <motion.div
      className="max-w-3xl mx-auto p-4 space-y-4"
      variants={pageVariants} initial="initial" animate="animate"
    >
      {/* Header */}
      <div className="rounded-2xl p-5 text-white" style={{ background: GREEN }}>
        <h1 className="text-2xl font-extrabold mb-1">🎮 Practise at Woolworths</h1>
        <p className="opacity-85 text-sm">
          Move around the store, pick up items and pay at the checkout!
        </p>
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          variants={feedbackPop} initial="initial" animate="animate" exit="exit"
          className={`rounded-xl px-4 py-3 border font-medium text-sm text-center ${msgBg}`}
        >
          {message}
        </motion.div>
      </AnimatePresence>

      {checkedOut ? (
        /* ── Success screen ── */
        <motion.div
          variants={pageVariants} initial="initial" animate="animate"
          className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100"
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, 8, -6, 3, 0], transition: { duration: 0.7 } }}
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Great shopping!</h2>
          <p className="text-gray-600 mb-1">You bought: {cart.join(", ")}</p>
          <p className="text-gray-400 text-sm mb-6">You completed your supermarket trip. Well done!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              onClick={reset}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3 rounded-xl font-bold text-white shadow"
              style={{ background: GREEN }}
            >
              🔄 Shop Again
            </motion.button>
            <motion.button
              onClick={() => { reset(); setPhase("video"); }}
              whileTap={{ scale: 0.96 }}
              className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              📺 Watch Video Again
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Store navigation */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3">🗺️ Where do you want to go?</h2>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => (
                <motion.button
                  key={area.id}
                  onClick={() => goTo(area)}
                  whileHover={{ scale: 1.04, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-colors ${
                    location === area.id
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                  }`}
                >
                  {area.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Items in current section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-1">{currentArea?.label}</h2>
            <p className="text-gray-500 text-sm mb-4">{currentArea?.desc}</p>

            {location === "checkout" ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4 text-lg">
                  You have <strong>{cart.length}</strong> item{cart.length !== 1 ? "s" : ""} in your trolley.
                </p>
                {cart.length > 0 && (
                  <p className="text-sm text-gray-400 mb-6">{cart.join(", ")}</p>
                )}
                <motion.button
                  onClick={checkout}
                  whileHover={{ scale: 1.04, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-2xl font-bold text-white text-lg shadow-md"
                  style={{ background: GREEN }}
                >
                  💳 Pay Now
                </motion.button>
              </div>
            ) : location === "entrance" ? (
              <div className="text-center py-6 text-gray-500">
                <div className="text-5xl mb-3">🛒</div>
                <p>Great! You have your trolley. Now visit the <strong>Produce</strong>, <strong>Bakery</strong> or <strong>Dairy</strong> sections to pick up your items.</p>
              </div>
            ) : availableItems.length === 0 ? (
              <p className="text-gray-400 py-4 text-center">Nothing to pick up here. Try another section!</p>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                variants={staggerGrid} initial="initial" animate="animate"
              >
                {availableItems.map((item) => {
                  const inCart = cart.includes(item.name);
                  return (
                    <motion.button
                      key={item.name}
                      variants={cardVariant}
                      onClick={() => addItem(item)}
                      disabled={inCart}
                      whileHover={!inCart ? { scale: 1.05, y: -4, boxShadow: "0 10px 24px rgba(0,150,80,0.12)", transition: { type: "spring", stiffness: 360, damping: 22 } } : {}}
                      whileTap={!inCart ? { scale: 0.95 } : {}}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                        inCart
                          ? "border-green-400 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-400"
                      }`}
                    >
                      <motion.span
                        className="text-4xl mb-1"
                        animate={charBobSm.animate}
                      >
                        {item.emoji}
                      </motion.span>
                      <span className="font-semibold text-sm text-gray-700">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.price}</span>
                      {inCart && <span className="text-xs text-green-600 font-bold mt-1">✓ In trolley</span>}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Trolley summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-2">🛒 Your Trolley ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm">Empty — visit the produce, bakery or dairy sections to add items!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cart.map((name) => {
                  const item = ITEMS.find((i) => i.name === name);
                  return (
                    <span key={name} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {item?.emoji} {name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Nav back */}
      <div className="flex justify-center gap-4 pt-1">
        <button
          onClick={() => setPhase("steps")}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← Back to steps
        </button>
        <button
          onClick={() => setPhase("video")}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          📺 Watch video again
        </button>
      </div>
    </motion.div>
  );
}
