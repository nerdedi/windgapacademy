import React, { useState } from 'react';
import SimulationManager from '../src/simulation/SimulationManager';

// Accessible, modular simulation template for Zoo
function ZooSimulation() {
  const [animal, setAnimal] = useState(SimulationManager.getProgress('zoo').animal || 'Lion');
  const [message, setMessage] = useState('Welcome to the Zoo!');
  const animals = [
    { name: 'Lion', img: '/assets/images/lion.png', fact: 'Lions are known as the king of the jungle.' },
    { name: 'Elephant', img: '/assets/images/elephant.png', fact: 'Elephants are the largest land animals.' },
    { name: 'Giraffe', img: '/assets/images/giraffe.png', fact: 'Giraffes have the longest necks of any animal.' },
  ];

  function visitAnimal(name) {
    setAnimal(name);
    const animalObj = animals.find(a => a.name === name);
    setMessage(`Visiting the ${name}. ${animalObj ? animalObj.fact : ''}`);
    SimulationManager.setProgress('zoo', { animal: name });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Visiting the ${name}. ${animalObj ? animalObj.fact : ''}`));
    }
  }

  return (
    <section aria-label="Zoo Simulation" tabIndex={0} style={{ border: '2px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f8fff0', transition: 'background 0.5s' }}>
      <h2>Zoo Simulation</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        {animals.map(a => (
          <div key={a.name} style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
            <img src={a.img} alt={a.name} style={{ width: '60px', height: '60px', objectFit: 'contain', filter: animal === a.name ? 'brightness(1.2)' : 'none', transition: 'filter 0.3s' }} />
            <button onClick={() => visitAnimal(a.name)} aria-label={`Visit ${a.name}`}>{a.name}</button>
            <div style={{ fontSize: '0.9em', color: '#555' }}>{a.fact}</div>
          </div>
        ))}
      </div>
      <div>
        <h3>Current Animal</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em', transition: 'color 0.3s', color: '#388e3c' }}>{animal}</p>
      </div>
    </section>
  );
}

export default ZooSimulation;
