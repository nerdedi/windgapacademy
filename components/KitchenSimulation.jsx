import React, { useState } from 'react';
import SimulationManager from '../src/simulation/SimulationManager';

// Accessible, modular simulation template for Kitchen
function KitchenSimulation() {
  const [ingredients, setIngredients] = useState(SimulationManager.getProgress('kitchen').ingredients || []);
  const [step, setStep] = useState(SimulationManager.getProgress('kitchen').step || 0);
  const [message, setMessage] = useState('Let’s start cooking!');
  const recipeSteps = [
    'Crack the egg into a bowl.',
    'Add milk and whisk together.',
    'Pour mixture into pan.',
    'Cook until set.',
    'Serve and enjoy!'
  ];
  const ingredientList = [
    { name: 'Egg', img: '/assets/images/egg.png' },
    { name: 'Milk', img: '/assets/images/milk.png' },
    { name: 'Butter', img: '/assets/images/butter.png' },
  ];

  function addIngredient(ingredient) {
    const newIngredients = [...ingredients, ingredient.name];
    setIngredients(newIngredients);
    setMessage(`Added ${ingredient.name}.`);
    SimulationManager.setProgress('kitchen', { ingredients: newIngredients, step });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Added ${ingredient.name}`));
    }
  }

  function nextStep() {
    if (step < recipeSteps.length - 1) {
      const newStep = step + 1;
      setStep(newStep);
      setMessage(recipeSteps[newStep]);
      SimulationManager.setProgress('kitchen', { ingredients, step: newStep });
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(recipeSteps[newStep]));
      }
    } else {
      setMessage('Recipe complete!');
      SimulationManager.setProgress('kitchen', { ingredients, step });
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Recipe complete!'));
      }
    }
  }

  return (
    <section aria-label="Kitchen Simulation" tabIndex={0} style={{ border: '2px solid #eee', padding: '1rem', borderRadius: '8px', background: '#fff8f0', transition: 'background 0.5s' }}>
      <h2>Kitchen Simulation</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {ingredientList.map(ing => (
          <div key={ing.name} style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
            <img src={ing.img} alt={ing.name} style={{ width: '60px', height: '60px', objectFit: 'contain', filter: ingredients.includes(ing.name) ? 'brightness(1.2)' : 'none', transition: 'filter 0.3s' }} />
            <button onClick={() => addIngredient(ing)} aria-label={`Add ${ing.name}`}>Add {ing.name}</button>
          </div>
        ))}
      </div>
      <div>
        <h3>Ingredients Added</h3>
        <ul>
          {ingredients.map((item, idx) => <li key={idx} style={{ transition: 'background 0.3s', background: '#ffe' }}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h3>Recipe Progress</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.1em', transition: 'color 0.3s', color: '#d2691e' }}>Step {step + 1}: {recipeSteps[step]}</p>
        <button onClick={nextStep} disabled={step >= recipeSteps.length - 1}>Next Step</button>
      </div>
    </section>
  );
}

export default KitchenSimulation;
