# Windgap Academy WebGL Ripple Effects

A collection of high-performance WebGL-based ripple animations and effects for enhancing the UI of Windgap Academy.

## Features

- **Interactive Ripple Backgrounds**: Create engaging, responsive backgrounds with interactive ripple animations
- **Button Ripple Effects**: Add tactile feedback to buttons and interactive elements
- **React Integration**: Fully integrated with React through hooks and components
- **Vanilla JS Support**: Can be used with or without React
- **Performance Optimized**: Uses WebGL for hardware acceleration
- **Mobile-Friendly**: Works with both mouse and touch events

## Components & Utilities

### React Components

- **RippleEffect**: A wrapper component that adds ripple animations to any UI element

  ```jsx
  import RippleEffect from "../components/RippleEffect";

  <RippleEffect color="#4f46e5" duration={800} rippleOpacity={0.3}>
    <button>Click me</button>
  </RippleEffect>;
  ```

### React Hooks

- **useRippleEffect**: For more fine-grained control over ripple animations

  ```jsx
  import { useRippleEffect } from "../hooks/useRippleEffect";

  function MyButton() {
    const ripple = useRippleEffect({ color: "#ffffff", speed: 2 });

    return (
      <button
        ref={ripple.ref}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          ripple.triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
        }}
      >
        Click me
      </button>
    );
  }
  ```

- **useRippleBackground**: For interactive backgrounds with auto-ripples

  ```jsx
  import { useRippleBackground } from "../hooks/useRippleEffect";

  function MyBackground() {
    const backgroundRipple = useRippleBackground({
      colors: ["rgba(79, 70, 229, 0.3)", "rgba(16, 185, 129, 0.3)"],
      autoInterval: 3000,
      interactive: true,
    });

    return (
      <div ref={backgroundRipple.ref} className="h-64 bg-indigo-50">
        {/* Content */}
      </div>
    );
  }
  ```

### Utility Functions

- **createRippleEffect**: Create WebGL ripple effects on any DOM element
- **createCanvasRippleEffect**: Canvas-based ripple effects for simpler use cases
- **createInteractiveRippleBackground**: Full-screen interactive ripple backgrounds

## Demo

Check out the ripple effect demos:

- Use the integrated SPA route or the Animation demo instead of a standalone HTML file. Example route: `/animation-demo` which contains ripple and WebGL effect showcases.
- `src/components/RippleDemo.jsx`: React component demo with interactive controls

## Usage Guide

### Basic Usage

1. **Simple Button Ripple**:

   ```jsx
   <RippleEffect>
     <button>Click me</button>
   </RippleEffect>
   ```

2. **Customized Ripple**:

   ```jsx
   <RippleEffect
     color="#4f46e5"
     duration={1000}
     rippleOpacity={0.5}
     expandSize={2.5}
     centerRipple={true}
   >
     <button>Click me</button>
   </RippleEffect>
   ```

3. **Interactive Background**:

   ```jsx
   function GameBackground() {
     const background = useRippleBackground({
       colors: ["rgba(79, 70, 229, 0.3)"],
       autoInterval: 3000,
     });

     return <div ref={background.ref} className="game-area" />;
   }
   ```

### Advanced Usage

For more complex scenarios, you can directly use the utility functions:

```javascript
import { createInteractiveRippleBackground } from "../utils/RippleEffectUtils";

// Create an interactive ripple background
const rippleEffect = createInteractiveRippleBackground("#container", {
  rippleColors: ["rgba(79, 70, 229, 0.3)", "rgba(16, 185, 129, 0.3)"],
  maxRipples: 10,
  autoRippleInterval: 3000,
  interactive: true,
  backgroundBlur: 10,
});

// Programmatically trigger ripples
rippleEffect.addRipple(x, y, color);

// Update options
rippleEffect.updateOptions({ rippleSpeed: 3 });

// Clean up
rippleEffect.destroy();
```

## Integration with WebGLEffects

The ripple effects are designed to work alongside the existing `WebGLEffects.js` system. You can combine them for more complex effects:

```javascript
import { createRippleEffect } from "../utils/RippleEffectUtils";
import WebGLEffects from "../systems/WebGLEffects";

// Initialize WebGL effects
const webglEffects = new WebGLEffects();

// Create a particle system
const particles = webglEffects.initParticleSystem("container");

// Add ripple effect to the same container
const ripples = createRippleEffect(document.getElementById("container"));

// Combine effects for interactions
element.addEventListener("click", (e) => {
  // Trigger ripple
  ripples.triggerRipple(e.offsetX, e.offsetY);

  // Emit particles at the same location
  particles.emit(e.offsetX, e.offsetY);
});
```

## Performance Considerations

- Use `rippleOpacity` and `fadeSpeed` to control the visual intensity of ripples
- For low-end devices, reduce `maxRipples` and increase `fadeSpeed` to improve performance
- Consider using `centerRipple` for buttons to avoid calculating click positions
- Set appropriate `autoInterval` values to avoid too many simultaneous ripples

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- iOS Safari 11+
- Chrome for Android 60+

## Credits

Developed for Windgap Academy using Three.js and WebGL.
