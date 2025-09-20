import React, { useState, useEffect } from "react";
import ModernBackground from "./ModernBackground";
import { ModernCard, ModernCardHeader, ModernCardBody, ModernCardFooter } from "./ModernCard";
import ModernInput from "./ModernInput";
import { gsap } from "gsap";

/**
 * ModernComponentsDemo - A showcase of the modern UI components
 * 
 * Features:
 * - Interactive background with gradient and mouse follow
 * - Glassmorphism cards with different styles
 * - Modern form inputs with animations
 * - Consistent dark theme styling
 */
const ModernComponentsDemo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  
  // Validate email on change
  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }, [email]);
  
  // GSAP animation on mount
  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline.fromTo(
      ".demo-card",
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out",
      }
    );
    
    return () => {
      timeline.kill();
    };
  }, []);
  
  return (
    <ModernBackground primaryColor="#2997FF" secondaryColor="#101010">
      <div className="flex flex-col min-h-screen items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-10 text-gradient">Modern UI Components</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Login Card */}
          <ModernCard className="demo-card" withGlow rounded="rounded-xl">
            <ModernCardHeader>
              <h2 className="text-2xl font-semibold text-white">Sign In</h2>
              <p className="text-zinc-400 text-sm">Enter your credentials to continue</p>
            </ModernCardHeader>
            
            <ModernCardBody>
              <div className="space-y-4">
                <ModernInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                />
                
                <ModernInput
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="mt-6">
                <button className="w-full py-3 rounded-lg bg-gradient-blue text-white font-medium transition-all hover:opacity-90 animate-pulse">
                  Sign In
                </button>
              </div>
            </ModernCardBody>
            
            <ModernCardFooter className="text-center text-zinc-500 text-sm">
              Don't have an account? <span className="text-blue-400 cursor-pointer">Sign Up</span>
            </ModernCardFooter>
          </ModernCard>
          
          {/* Features Card */}
          <ModernCard className="demo-card" withHover padding="p-8">
            <ModernCardHeader>
              <h2 className="text-2xl font-semibold text-white">Modern Features</h2>
              <p className="text-zinc-400 text-sm">Sophisticated UI components</p>
            </ModernCardHeader>
            
            <ModernCardBody>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex-center mr-3">✓</span>
                  Glassmorphism effects
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex-center mr-3">✓</span>
                  Interactive backgrounds
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex-center mr-3">✓</span>
                  GSAP-powered animations
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex-center mr-3">✓</span>
                  Modern form inputs
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex-center mr-3">✓</span>
                  Customizable components
                </li>
              </ul>
            </ModernCardBody>
            
            <ModernCardFooter className="flex justify-end">
              <button className="py-2 px-4 rounded-lg text-white border border-zinc-700 transition-all hover:bg-zinc-800">
                Learn More
              </button>
            </ModernCardFooter>
          </ModernCard>
          
          {/* Contact Card */}
          <ModernCard className="demo-card md:col-span-2" darkMode={true} padding="p-8">
            <ModernCardHeader>
              <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
              <p className="text-zinc-400 text-sm">We'd love to hear from you</p>
            </ModernCardHeader>
            
            <ModernCardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput
                id="name"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              
              <ModernInput
                id="contact-email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              
              <div className="md:col-span-2">
                <textarea 
                  className="w-full h-32 p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Your message..."
                ></textarea>
              </div>
            </ModernCardBody>
            
            <ModernCardFooter className="flex justify-end">
              <button className="py-2 px-6 rounded-lg bg-gradient-blue text-white font-medium transition-all hover:opacity-90">
                Send Message
              </button>
            </ModernCardFooter>
          </ModernCard>
        </div>
      </div>
    </ModernBackground>
  );
};

export default ModernComponentsDemo;