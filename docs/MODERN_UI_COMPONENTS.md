# Modern UI Components for Windgap Academy

This collection of modern UI components has been created to enhance the Windgap Academy platform with sophisticated, contemporary design elements.

## Components Overview

### ModernBackground

A dynamic, interactive background component that creates an engaging visual experience for users.

```jsx
import ModernBackground from "./components/ModernBackground";

<ModernBackground 
  primaryColor="#2997FF" 
  secondaryColor="#101010"
  hasNoise={true}
  interactive={true}
>
  {/* Your content here */}
</ModernBackground>
```

**Props:**
- `primaryColor` - Main gradient color (default: #2997FF)
- `secondaryColor` - Secondary gradient color (default: #101010)
- `hasNoise` - Whether to add subtle noise texture (default: true)
- `interactive` - Whether background responds to mouse movement (default: true)
- `className` - Additional CSS classes

### ModernCard

A glassmorphism-style card component with customizable appearance and animations.

```jsx
import { ModernCard, ModernCardHeader, ModernCardBody, ModernCardFooter } from "./components/ModernCard";

<ModernCard darkMode={true} withHover={true} withGlow={false}>
  <ModernCardHeader>
    <h2>Card Title</h2>
  </ModernCardHeader>
  
  <ModernCardBody>
    <p>Card content goes here</p>
  </ModernCardBody>
  
  <ModernCardFooter>
    <button>Action Button</button>
  </ModernCardFooter>
</ModernCard>
```

**Props:**
- `darkMode` - Dark or light appearance (default: true)
- `withHover` - Enable hover animation (default: true)
- `withGlow` - Enable glow animation (default: false)
- `padding` - Custom padding (default: "p-6")
- `rounded` - Border radius (default: "rounded-2xl")
- `className` - Additional CSS classes

### ModernInput

A sophisticated input component with animated label and validation states.

```jsx
import ModernInput from "./components/ModernInput";

const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

<ModernInput
  id="email"
  type="email"
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required={true}
/>
```

**Props:**
- `id` - Input ID (required)
- `type` - Input type (default: "text")
- `label` - Input label (required)
- `value` - Input value (required)
- `onChange` - Change handler (required)
- `darkMode` - Dark or light appearance (default: true)
- `error` - Error message for validation (default: "")
- `required` - Whether the field is required (default: false)
- `autoComplete` - HTML autocomplete attribute (default: "off")

## Utility Classes

### Glassmorphism

```jsx
<div className="glass">Light glass panel</div>
<div className="glass-dark">Dark glass panel</div>
<div className="modern-glass">Enhanced light glass</div>
<div className="modern-glass-dark">Enhanced dark glass</div>
```

### Gradients & Textures

```jsx
<h1 className="text-gradient">Gradient Text</h1>
<div className="bg-gradient-blue">Gradient Background</div>
<div className="bg-noise">Subtle Noise Texture</div>
```

### Animations

```jsx
<div className="animate-fadeIn">Fade in from bottom</div>
<div className="animate-float">Gentle floating motion</div>
<div className="animate-glow">Pulsing glow effect</div>
<div className="animate-shimmer">Shimmer effect</div>
<div className="animate-pulse">Subtle pulsing animation</div>
```

## Demo Component

A showcase of all components working together is available in `ModernComponentsDemo.jsx`. You can import and render this component to see all the modern UI elements in action:

```jsx
import ModernComponentsDemo from "./components/ModernComponentsDemo";

function App() {
  return <ModernComponentsDemo />;
}
```

## Integration

To use these components in your application:

1. Make sure your Tailwind config includes the custom utilities
2. Import the GSAP library if not already installed: `npm install gsap`
3. Import the components where needed
4. Enjoy your modern UI!