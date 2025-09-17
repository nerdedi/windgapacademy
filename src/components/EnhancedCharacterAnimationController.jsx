import React, { useState, useEffect } from 'react';
import UnityAnimationBridge from './UnityAnimationBridge';

/**
 * Enhanced version of the CharacterAnimationController component that works
 * with the Unity Animation System Extension.
 * 
 * This component provides a UI for controlling character animations in Unity
 * and demonstrates how to use the UnityAnimationBridge.
 */
const EnhancedCharacterAnimationController = ({
  characterId = "winnie",
  width = 300,
  height = 200,
  showControls = true,
  defaultAnimation = "idle",
}) => {
  const [selectedAnimation, setSelectedAnimation] = useState(defaultAnimation);
  const [selectedEmote, setSelectedEmote] = useState("happy");
  const [duration, setDuration] = useState(3.0);
  const [lookAtPosition, setLookAtPosition] = useState({ x: 0, y: 1.7, z: 2 });
  
  // Get animation control functions from the bridge
  const {
    playAnimation,
    playEmote,
    lookAt,
    pointAt,
    playSequence,
    stopAnimation,
    isConnected
  } = UnityAnimationBridge({ characterId });
  
  // Play the default animation on mount
  useEffect(() => {
    if (defaultAnimation) {
      playAnimation(defaultAnimation);
    }
  }, [defaultAnimation]);
  
  // Common animations for different characters
  const commonAnimations = [
    { id: "idle", label: "Idle" },
    { id: "talk", label: "Talk" },
    { id: "teaching", label: "Teaching" },
    { id: "thinking", label: "Thinking" },
    { id: "encourage", label: "Encourage" },
    { id: "celebrate", label: "Celebrate" },
    { id: "confused", label: "Confused" },
    { id: "surprised", label: "Surprised" },
  ];
  
  // Common emotes
  const commonEmotes = [
    { id: "happy", label: "Happy" },
    { id: "sad", label: "Sad" },
    { id: "thinking", label: "Thinking" },
    { id: "confused", label: "Confused" },
    { id: "surprised", label: "Surprised" },
  ];
  
  // Example sequences
  const exampleSequences = [
    {
      id: "greeting",
      label: "Greeting",
      sequence: [
        { animationName: "talk", duration: 2.0 },
        { animationName: "celebrate", duration: 1.5 },
        { animationName: "idle", duration: 0.5 },
      ]
    },
    {
      id: "teaching",
      label: "Teaching",
      sequence: [
        { animationName: "teaching", duration: 3.0 },
        { animationName: "thinking", duration: 1.5 },
        { animationName: "talk", duration: 2.5 },
        { animationName: "celebrate", duration: 1.0 },
      ]
    }
  ];
  
  // Handle playing an animation
  const handlePlayAnimation = () => {
    playAnimation(selectedAnimation, duration);
  };
  
  // Handle playing an emote
  const handlePlayEmote = () => {
    playEmote(selectedEmote);
  };
  
  // Handle looking at a position
  const handleLookAt = () => {
    lookAt(lookAtPosition, 3.0);
  };
  
  // Handle pointing at a position
  const handlePointAt = (useRightHand = true) => {
    pointAt(lookAtPosition, useRightHand);
  };
  
  // Handle playing a sequence
  const handlePlaySequence = (sequenceId) => {
    const sequence = exampleSequences.find(seq => seq.id === sequenceId);
    if (sequence) {
      playSequence(sequence.sequence);
    }
  };
  
  // If controls are hidden, just return an empty container
  if (!showControls) {
    return <div style={{ width, height }} />;
  }
  
  return (
    <div style={{ width, border: '1px solid #ccc', borderRadius: '8px', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ marginTop: 0 }}>Character Animation Controls</h3>
      <p>Character ID: {characterId}</p>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Basic Animation</h4>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <select 
            value={selectedAnimation}
            onChange={(e) => setSelectedAnimation(e.target.value)}
            style={{ flex: 1, padding: '8px', marginRight: '8px' }}
          >
            {commonAnimations.map(anim => (
              <option key={anim.id} value={anim.id}>{anim.label}</option>
            ))}
          </select>
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            style={{ width: '80px', padding: '8px' }}
            min="0"
            step="0.5"
          />
        </div>
        <button 
          onClick={handlePlayAnimation}
          style={{ width: '100%', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Play Animation
        </button>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Emotes</h4>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <select 
            value={selectedEmote}
            onChange={(e) => setSelectedEmote(e.target.value)}
            style={{ flex: 1, padding: '8px', marginRight: '8px' }}
          >
            {commonEmotes.map(emote => (
              <option key={emote.id} value={emote.id}>{emote.label}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handlePlayEmote}
          style={{ width: '100%', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Play Emote
        </button>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Procedural Animations</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button 
            onClick={handleLookAt}
            style={{ flex: 1, padding: '8px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
          >
            Look At
          </button>
          <button 
            onClick={() => handlePointAt(true)}
            style={{ flex: 1, padding: '8px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Point At
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <h4>Animation Sequences</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {exampleSequences.map(sequence => (
            <button
              key={sequence.id}
              onClick={() => handlePlaySequence(sequence.id)}
              style={{ padding: '8px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {sequence.label} Sequence
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => stopAnimation()}
        style={{ width: '100%', padding: '8px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Stop All Animations
      </button>
    </div>
  );
};

export default EnhancedCharacterAnimationController;