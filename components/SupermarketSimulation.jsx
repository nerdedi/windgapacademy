import React, { useState } from 'react';
import SimulationManager from '../src/simulation/SimulationManager';

// Accessible, modular simulation template for Supermarket
function SupermarketSimulation() {
  const [cart, setCart] = useState(SimulationManager.getProgress('supermarket').cart || []);
  const [location, setLocation] = useState(SimulationManager.getProgress('supermarket').location || 'entrance');
  const [message, setMessage] = useState('Welcome to the supermarket!');
  const items = [
    { name: 'Apple', img: '/assets/images/apple.png' },
    { name: 'Banana', img: '/assets/images/banana.png' },
    { name: 'Bread', img: '/assets/images/bread.png' },
    { name: 'Milk', img: '/assets/images/milk.png' },
  ];

  // Drag-and-drop logic
  function onDragStart(e, item) {
    e.dataTransfer.setData('item', JSON.stringify(item));
  }

  function onDrop(e) {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('item'));
    addItem(item);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function goTo(area) {
    setLocation(area);
    setMessage(`You are now in the ${area}`);
    SimulationManager.setProgress('supermarket', { cart, location: area });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`You are now in the ${area}`));
    }
  }

  function addItem(item) {
    const newCart = [...cart, item.name];
    setCart(newCart);
    setMessage(`Added ${item.name} to cart.`);
    SimulationManager.setProgress('supermarket', { cart: newCart, location });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Added ${item.name} to cart.`));
    }
  }

  function checkout() {
    setMessage('Checking out... Thank you for shopping!');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('Checking out. Thank you for shopping!'));
    }
    setCart([]);
    setLocation('entrance');
    SimulationManager.setProgress('supermarket', { cart: [], location: 'entrance' });
  }

  return (
    <section aria-label="Supermarket Simulation" tabIndex={0} style={{ border: '2px solid #eee', padding: '1rem', borderRadius: '8px', background: '#f8f8ff', transition: 'background 0.5s' }}>
      <h2>Supermarket Simulation</h2>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => goTo('produce')}>Go to Produce</button>
        <button onClick={() => goTo('bakery')}>Go to Bakery</button>
        <button onClick={() => goTo('dairy')}>Go to Dairy</button>
        <button onClick={checkout}>Checkout</button>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {items.map(item => (
          <div key={item.name} style={{ textAlign: 'center', transition: 'transform 0.3s' }}>
            <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} draggable onDragStart={e => onDragStart(e, item)} />
            <button onClick={() => addItem(item)} aria-label={`Add ${item.name}`}>Add {item.name}</button>
          </div>
        ))}
      </div>
      <div onDrop={onDrop} onDragOver={onDragOver} style={{ minHeight: '80px', border: '2px dashed #aaa', borderRadius: '8px', padding: '0.5rem', background: '#fff', marginBottom: '1rem' }} aria-label="Drop items here to add to cart">
        <h3>Your Cart (Drag items here)</h3>
        <ul>
          {cart.map((item, idx) => <li key={idx} style={{ transition: 'background 0.3s' }}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}

export default SupermarketSimulation;
