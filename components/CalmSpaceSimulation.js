import React, { useState } from 'react';
import SimulationManager from '../src/simulation/SimulationManager';

// Accessible, modular simulation template for CalmSpace
function CalmSpaceSimulation() {
  const [mode, setMode] = useState(SimulationManager.getProgress('calmspace').mode || 'relax');
  const [message, setMessage] = useState('Take a moment to relax.');
  const modes = [
    { name: 'Relax', img: '/assets/images/relax.png', desc: 'Gentle music and visuals.' },
    { name: 'Focus', img: '/assets/images/focus.png', desc: 'Calm, focused environment.' },
    { name: 'Breathe', img: '/assets/images/breathe.png', desc: 'Guided breathing exercise.' },
  ];

  function changeMode(newMode) {
    setMode(newMode);
    setMessage(`Switched to ${newMode} mode.`);
    SimulationManager.setProgress('calmspace', { mode: newMode });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Switched to ${newMode} mode.`));
    }
  }

  return (
    <section aria-label="CalmSpace Simulation" tabIndex={0} style={{ border: '2px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f0f8ff', transition: 'background 0.5s' }}>
      <h2>CalmSpace Simulation</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        {modes.map(m => (
          <div key={m.name} style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
            <img src={m.img} alt={m.name} style={{ width: '60px', height: '60px', objectFit: 'contain', filter: mode === m.name ? 'brightness(1.2)' : 'none', transition: 'filter 0.3s' }} />
            <button onClick={() => changeMode(m.name)} aria-label={`Switch to ${m.name}`}>{m.name}</button>
            <div style={{ fontSize: '0.9em', color: '#555' }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div>
        <h3>Current Mode</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em', transition: 'color 0.3s', color: '#1565c0' }}>{mode}</p>
      </div>
    </section>
  );
}

export default CalmSpaceSimulation;
