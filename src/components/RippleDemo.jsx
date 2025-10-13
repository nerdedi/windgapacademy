import React, { useState } from "react";
import RippleEffect from "../components/RippleEffect";
import { useRippleBackground, useRippleEffect } from "../hooks/useRippleEffect";

/**
 * RippleDemo - A component that demonstrates different ways to use ripple effects
 */
const RippleDemo = () => {
  const [primaryColor, setPrimaryColor] = useState("rgba(79, 70, 229, 0.3)");
  const [secondaryColor, setSecondaryColor] = useState("rgba(16, 185, 129, 0.3)");
  const [autoRipples, setAutoRipples] = useState(true);
  const [rippleSpeed, setRippleSpeed] = useState(2);

  // Example using the hook directly
  const ripple = useRippleEffect({
    color: "#ffffff",
    opacity: 0.6,
    speed: rippleSpeed,
  });

  // Example using the background ripple hook
  const backgroundRipple = useRippleBackground({
    colors: [primaryColor, secondaryColor],
    autoInterval: autoRipples ? 3000 : 0,
    interactive: true,
    speed: rippleSpeed,
  });

  // Handler for button ripple
  const handleButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.triggerRipple(x, y);
  };

  // Toggle auto ripples
  const toggleAutoRipples = () => {
    const newState = !autoRipples;
    setAutoRipples(newState);
    backgroundRipple.setAutoInterval(newState ? 3000 : 0);
  };

  // Change ripple speed
  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setRippleSpeed(speed);
    ripple.updateOptions({ speed });
    backgroundRipple.updateOptions({ speed });
  };

  // Trigger a random ripple in the background
  const triggerRandomRipple = () => {
    if (!backgroundRipple.ref.current) return;

    const rect = backgroundRipple.ref.current.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    backgroundRipple.triggerRipple(x, y, Math.random() > 0.5 ? primaryColor : secondaryColor);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ripple Effect Demos</h1>

      {/* Background ripple demo */}
      <div
        ref={backgroundRipple.ref}
        className="relative h-64 rounded-lg bg-indigo-50 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-xl font-bold">Interactive Background</h2>
          <p>Click anywhere in this container</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={triggerRandomRipple}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Trigger Random Ripple
        </button>

        <button onClick={toggleAutoRipples} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {autoRipples ? "Disable" : "Enable"} Auto Ripples
        </button>

        <div className="flex flex-col">
          <label htmlFor="speed-slider" className="text-sm text-gray-700">
            Ripple Speed: {rippleSpeed}
          </label>
          <input
            id="speed-slider"
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={rippleSpeed}
            onChange={handleSpeedChange}
            className="w-48"
          />
        </div>
      </div>

      {/* Color Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex flex-col">
          <label htmlFor="primary-color" className="text-sm text-gray-700">
            Primary Color
          </label>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: primaryColor }} />
            <select
              id="primary-color"
              value={primaryColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setPrimaryColor(newColor);
                backgroundRipple.setColors([newColor, secondaryColor]);
              }}
              className="border rounded p-1"
            >
              <option value="rgba(79, 70, 229, 0.3)">Indigo</option>
              <option value="rgba(16, 185, 129, 0.3)">Green</option>
              <option value="rgba(239, 68, 68, 0.3)">Red</option>
              <option value="rgba(245, 158, 11, 0.3)">Amber</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondary-color" className="text-sm text-gray-700">
            Secondary Color
          </label>
          <div className="flex items-center">
            <div
              className="w-6 h-6 rounded-full mr-2"
              style={{ backgroundColor: secondaryColor }}
            />
            <select
              id="secondary-color"
              value={secondaryColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setSecondaryColor(newColor);
                backgroundRipple.setColors([primaryColor, newColor]);
              }}
              className="border rounded p-1"
            >
              <option value="rgba(16, 185, 129, 0.3)">Green</option>
              <option value="rgba(79, 70, 229, 0.3)">Indigo</option>
              <option value="rgba(239, 68, 68, 0.3)">Red</option>
              <option value="rgba(245, 158, 11, 0.3)">Amber</option>
            </select>
          </div>
        </div>
      </div>

      {/* Using RippleEffect component wrapper */}
      <div className="flex flex-wrap gap-4 mb-8">
        <RippleEffect color="#4f46e5" duration={800} rippleOpacity={0.3}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Component Ripple</button>
        </RippleEffect>

        <RippleEffect color="#10b981" duration={600} rippleOpacity={0.5}>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Green Ripple</button>
        </RippleEffect>

        <RippleEffect color="#ef4444" duration={1000} rippleOpacity={0.4} centerRipple={true}>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Centered Ripple</button>
        </RippleEffect>
      </div>

      {/* Using hook directly */}
      <div className="flex flex-wrap gap-4">
        <button
          ref={ripple.ref}
          onClick={handleButtonClick}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Hook-based Ripple
        </button>
      </div>

      {/* Documentation */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Usage Guide</h2>
        <p className="mb-4">There are three ways to add ripple effects to your components:</p>

        <ol className="list-decimal pl-5 space-y-4">
          <li>
            <strong>RippleEffect Component:</strong> Wrap your elements with the RippleEffect
            component.
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`<RippleEffect color="#4f46e5" duration={800}>
  <button>My Button</button>
</RippleEffect>`}
            </pre>
          </li>
          <li>
            <strong>useRippleEffect Hook:</strong> For more control, use the hook directly.
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`const ripple = useRippleEffect({ color: '#ffffff' });
// In your JSX:
<button ref={ripple.ref} onClick={handleClick}>Click Me</button>`}
            </pre>
          </li>
          <li>
            <strong>useRippleBackground Hook:</strong> For interactive backgrounds with
            auto-ripples.
            <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {`const backgroundRipple = useRippleBackground({
  colors: ['rgba(79, 70, 229, 0.3)'],
  autoInterval: 3000
});
// In your JSX:
<div ref={backgroundRipple.ref} className="my-container"></div>`}
            </pre>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default RippleDemo;
