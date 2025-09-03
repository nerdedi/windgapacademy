import React, { useState } from "react";

import SimulationManager from "../src/simulation/SimulationManager";

// Accessible, modular simulation template for Clubhouse
function ClubhouseSimulation() {
  const [activity, setActivity] = useState(
    SimulationManager.getProgress("clubhouse").activity || "welcome",
  );
  const [message, setMessage] = useState("Welcome to the Clubhouse!");

  const activities = [
    { name: "Games", img: "/assets/images/games.png", desc: "Play fun games with friends." },
    { name: "Music", img: "/assets/images/music.png", desc: "Enjoy music and sing along." },
    { name: "Story", img: "/assets/images/story.png", desc: "Listen to or tell stories." },
  ];

  function startActivity(name) {
    setActivity(name);
    setMessage(`Starting ${name} activity.`);
    SimulationManager.setProgress("clubhouse", { activity: name });
    if ("speechSynthesis" in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Starting ${name} activity.`));
    }
  }

  return (
    <section
      aria-label="Clubhouse Simulation"
      tabIndex={0}
      style={{
        border: "2px solid #eee",
        padding: "1rem",
        borderRadius: "8px",
        background: "#f0fff8",
        transition: "background 0.5s",
      }}
    >
      <h2>Clubhouse Simulation</h2>
      <p>{message}</p>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        {activities.map((act) => (
          <div key={act.name} style={{ textAlign: "center", transition: "transform 0.3s" }}>
            <img
              src={act.img}
              alt={act.name}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "contain",
                filter: activity === act.name ? "brightness(1.2)" : "none",
                transition: "filter 0.3s",
              }}
            />
            <button onClick={() => startActivity(act.name)} aria-label={`Start ${act.name}`}>
              {act.name}
            </button>
            <div style={{ fontSize: "0.9em", color: "#555" }}>{act.desc}</div>
          </div>
        ))}
      </div>
      <div>
        <h3>Current Activity</h3>
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.2em",
            transition: "color 0.3s",
            color: "#00796b",
          }}
        >
          {activity}
        </p>
      </div>
    </section>
  );
}

export default ClubhouseSimulation;
