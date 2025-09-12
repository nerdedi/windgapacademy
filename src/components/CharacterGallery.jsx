import React, { useState } from "react";

import AnimatedButton from "./AnimatedButton.jsx";
// Array of image data for dynamic rendering
const images = [
  {
    src: "assets/images/natalie.png",
    alt: "Natalie, Windgap Academy educator in a pinstripe suit with gold jewelry and W badge.",
  },
  {
    src: "assets/images/daisy_andy.png",
    alt: "Daisy and Andy, Windgap Academy students standing side by side. Daisy is wearing a red Windgap Academy sweater and Andy is in a teal WAL sweater.",
  },
  {
    src: "assets/images/winnie.png",
    alt: "Winnie, a friendly cloud character with teal hair, smiling and waving, wearing yellow and white sneakers.",
  },
  {
    src: "assets/images/windgap_building.png",
    alt: "Windgap Academy building.",
  },
  {
    src: "assets/images/aud_notes.png",
    alt: "Illustration of Australian currency notes.",
  },
  {
    src: "assets/images/daisy.png",
    alt: "Daisy, a student at Windgap Academy, wearing academy attire.",
  },
  {
    src: "assets/images/andy.png",
    alt: "Andy, an educator at Windgap Academy, wearing WAL sweater.",
  },
];

function CharacterGallery() {
  // Basic features
  const [selected, setSelected] = useState(null);
  const [customName, setCustomName] = useState("");
  // Advanced features and enhancements
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  // Backup/sync logic
  React.useEffect(() => {
    const saved = localStorage.getItem("characterGalleryProgress");
    if (saved) {
      const { selected, customName, score } = JSON.parse(saved);
      setSelected(selected);
      setCustomName(customName);
      setScore(score);
    }
  }, []);
  React.useEffect(() => {
    localStorage.setItem(
      "characterGalleryProgress",
      JSON.stringify({ selected, customName, score }),
    );
  }, [selected, customName, score]);
  // Error boundary
  const safeRun = (fn) => {
    try {
      fn();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };
  // Analytics
  const logEvent = (_event) => {
    /* ...analytics logic... */
  };
  // Gamification
  const completeChallenge = () => {
    setScore(score + 10);
    logEvent("Challenge completed");
    alert("Challenge complete! Score: " + (score + 10));
  };
  // Feedback
  const sendFeedback = () => {
    logEvent("Feedback sent");
    showFeedbackModal("Thank you for your feedback!");
  };

  function showFeedbackModal(message) {
    const modal = document.createElement("div");
    modal.style =
      "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);background:#fff;border:2px solid #1976d2;border-radius:12px;padding:24px;z-index:1001;min-width:320px;";
    modal.innerHTML = `<h2>Feedback</h2><p>${message}</p><button id='close-feedback'>Close</button>`;
    document.body.appendChild(modal);
    document.getElementById("close-feedback").onclick = () => modal.remove();
  }
  return (
    <div
      className="character-gallery grid grid-cols-2 md:grid-cols-4 gap-6 p-6"
      role="region"
      aria-label="Character Gallery"
    >
      {showOnboarding && (
        <div
          className="onboarding-modal"
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "2em",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 2px 8px #0002",
          }}
        >
          <h2>Welcome to Character Gallery!</h2>
          <p>
            Select and name your favorite characters. Use settings to personalize your experience.
          </p>
          <button onClick={() => setShowOnboarding(false)}>Close</button>
        </div>
      )}
      {showSettings && (
        <div
          className="settings-modal"
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            padding: "1.5em",
            borderRadius: "8px",
            zIndex: 1000,
            boxShadow: "0 2px 8px #0002",
          }}
        >
          <h3>Gallery Settings</h3>
          <label>
            <input type="checkbox" checked={score >= 10} readOnly /> Gamification Enabled
          </label>
          <br />
          <button onClick={() => setShowSettings(false)}>Close</button>
        </div>
      )}
      <button
        style={{ position: "fixed", top: "1em", right: "1em", zIndex: 1001 }}
        onClick={() => setShowSettings(true)}
      >
        Settings
      </button>
      {images.map((img, idx) => (
        <div key={idx} className="character-card card p-4 flex flex-col items-center">
          <img
            src={img.src}
            alt={img.alt}
            className="avatar-img mb-2"
            style={{
              maxWidth: "180px",
              margin: "8px",
              borderRadius: "12px",
              border: selected === idx ? "4px solid #3b82f6" : "2px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => safeRun(() => setSelected(idx))}
            tabIndex={0}
            aria-label={`Select ${img.alt}`}
            loading="lazy"
          />
          {selected === idx && (
            <div style={{ marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Custom name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                aria-label="Custom avatar name"
                style={{ padding: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <div style={{ fontSize: "0.95em", color: "#3b82f6", marginTop: "4px" }}>
                Selected! {customName ? `Name: ${customName}` : ""}
              </div>
              <button onClick={completeChallenge} style={{ marginTop: "8px" }}>
                Complete Challenge
              </button>
            </div>
          )}
          <AnimatedButton
            ariaLabel={`Select ${img.alt}`}
            onClick={() => safeRun(() => setSelected(idx))}
            text="Select"
          />
        </div>
      ))}
      <div style={{ marginTop: "2em" }}>
        <h4>Gamification Score: {score}</h4>
        <input
          type="text"
          placeholder="Send feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ padding: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={sendFeedback} style={{ marginLeft: "8px" }}>
          Send Feedback
        </button>
      </div>
      {/* Analytics and logic features will be implemented here as modules are completed */}
    </div>
  );
}

export default CharacterGallery;
