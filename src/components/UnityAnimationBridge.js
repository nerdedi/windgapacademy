import React, { useEffect, useState } from 'react';
import { sendToUnity, registerUnityMessageHandler } from '../unity-integration/UnityBridge';

/**
 * Unity Animation Bridge component for controlling character animations from React
 * 
 * This component provides a simple interface to send animation commands to Unity characters
 * using the ReactAnimationManager component on the Unity side.
 */
const UnityAnimationBridge = ({ characterId, autoConnect = true }) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Register to receive messages from Unity
    const unregister = registerUnityMessageHandler('ReactAnimationManager', (message) => {
      console.log('Received message from Unity animation system:', message);
      // Process any callbacks or events from Unity if needed
    });
    
    // Connect to Unity when the component mounts if autoConnect is true
    if (autoConnect) {
      connectToUnity();
    }
    
    // Clean up the registration when the component unmounts
    return () => {
      unregister();
    };
  }, [autoConnect]);
  
  /**
   * Connect to the Unity animation system
   */
  const connectToUnity = () => {
    sendToUnity('ReactBridgeManager', 'RegisterAnimationListener', {
      listenerType: 'react',
      characterId: characterId || 'all'
    });
    
    setIsConnected(true);
  };
  
  /**
   * Play an animation on the character
   * @param {string} animationName - The name of the animation to play
   * @param {number} duration - Optional duration in seconds (0 for indefinite)
   * @param {string} targetCharacter - Optional override for the character ID
   */
  const playAnimation = (animationName, duration = 0, targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'START_ANIMATION',
      characterName: targetCharacter || characterId,
      animationName: animationName,
      duration: duration
    });
  };
  
  /**
   * Play an emote on the character
   * @param {string} emoteName - The name of the emote to play
   * @param {string} targetCharacter - Optional override for the character ID
   */
  const playEmote = (emoteName, targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'PLAY_EMOTE',
      characterName: targetCharacter || characterId,
      emoteName: emoteName
    });
  };
  
  /**
   * Make the character look at a position
   * @param {Object} position - The position to look at {x, y, z}
   * @param {number} duration - Optional duration in seconds (0 for indefinite)
   * @param {string} targetCharacter - Optional override for the character ID
   */
  const lookAt = (position, duration = 0, targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'LOOK_AT',
      characterName: targetCharacter || characterId,
      position: position,
      duration: duration
    });
  };
  
  /**
   * Make the character point at a position
   * @param {Object} position - The position to point at {x, y, z}
   * @param {boolean} useRightHand - Whether to use the right hand (true) or left hand (false)
   * @param {string} targetCharacter - Optional override for the character ID
   */
  const pointAt = (position, useRightHand = true, targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'POINT_AT',
      characterName: targetCharacter || characterId,
      position: position,
      useRightHand: useRightHand
    });
  };
  
  /**
   * Play a sequence of animations on the character
   * @param {Array} sequence - Array of sequence steps
   * @param {string} targetCharacter - Optional override for the character ID
   * 
   * Each sequence step should be an object with:
   * - animationName: string
   * - duration: number
   */
  const playSequence = (sequence, targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'PLAY_SEQUENCE',
      characterName: targetCharacter || characterId,
      sequence: sequence
    });
  };
  
  /**
   * Stop all animations and return to idle
   * @param {string} targetCharacter - Optional override for the character ID
   */
  const stopAnimation = (targetCharacter = null) => {
    if (!isConnected) connectToUnity();
    
    sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
      actionType: 'STOP_ANIMATION',
      characterName: targetCharacter || characterId
    });
  };
  
  // Return the animation control functions
  return {
    playAnimation,
    playEmote,
    lookAt,
    pointAt,
    playSequence,
    stopAnimation,
    isConnected
  };
};

export default UnityAnimationBridge;