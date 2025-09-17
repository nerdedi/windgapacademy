/**
 * Implementation Examples for Windgap Academy
 * 
 * This file contains practical code examples and patterns for implementing
 * common features in the Windgap Academy 3D gamified learning platform.
 */

// ============================================================================
// 🎮 3D Game Components with React Three Fiber
// ============================================================================

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Interactive 3D Avatar Component
 * Example: Student avatar in virtual classroom
 */
export function StudentAvatar({ position = [0, 0, 0], name = "Student", onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      // Look at mouse when hovered
      if (hovered) {
        meshRef.current.lookAt(state.mouse.x, state.mouse.y, 1);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={hovered ? "#4299e1" : "#2d3748"} 
          transparent
          opacity={hovered ? 0.8 : 0.6}
        />
      </Sphere>
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="#2d3748"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

/**
 * Interactive Learning Environment
 * Example: Virtual classroom with clickable objects
 */
export function VirtualClassroom({ onObjectInteract }) {
  const [selectedObject, setSelectedObject] = useState(null);
  
  const handleObjectClick = (objectId, objectType) => {
    setSelectedObject(objectId);
    onObjectInteract?.(objectId, objectType);
  };

  return (
    <>
      {/* Classroom floor */}
      <Box args={[20, 0.1, 20]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Interactive whiteboard */}
      <Box 
        args={[8, 4, 0.2]} 
        position={[0, 2, -9]}
        onClick={() => handleObjectClick('whiteboard', 'teaching-tool')}
      >
        <meshStandardMaterial color={selectedObject === 'whiteboard' ? "#90EE90" : "#FFFFFF"} />
      </Box>
      
      {/* Student desks */}
      {Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = (col - 1.5) * 3;
        const z = row * 3 - 3;
        
        return (
          <Box 
            key={i}
            args={[2, 1, 1]} 
            position={[x, 0, z]}
            onClick={() => handleObjectClick(`desk-${i}`, 'desk')}
          >
            <meshStandardMaterial 
              color={selectedObject === `desk-${i}` ? "#FFD700" : "#8B4513"} 
            />
          </Box>
        );
      })}
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
    </>
  );
}

// ============================================================================
// 🎯 Gamification System Implementation
// ============================================================================

/**
 * Experience Points (XP) System
 * Tracks and manages student progress
 */
export class ExperienceSystem {
  constructor(userId) {
    this.userId = userId;
    this.xp = 0;
    this.level = 1;
    this.listeners = new Set();
  }

  static getRequiredXP(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  addXP(amount, reason = '') {
    const oldLevel = this.level;
    this.xp += amount;
    
    // Check for level up
    while (this.xp >= ExperienceSystem.getRequiredXP(this.level + 1)) {
      this.level++;
    }
    
    // Notify listeners
    this.listeners.forEach(callback => {
      callback({
        type: 'xp_gained',
        amount,
        reason,
        newXP: this.xp,
        levelUp: this.level > oldLevel,
        newLevel: this.level
      });
    });
    
    // Save to database
    this.saveProgress();
  }

  onProgressChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async saveProgress() {
    try {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          xp: this.xp,
          level: this.level,
          timestamp: new Date()
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
}

/**
 * Achievement Badge System
 * Implements OpenBadges standard
 */
export class BadgeSystem {
  constructor(userId) {
    this.userId = userId;
    this.earnedBadges = new Set();
  }

  static BADGES = {
    FIRST_LESSON: {
      id: 'first_lesson',
      name: 'Getting Started',
      description: 'Completed your first lesson',
      image: '/badges/first-lesson.png',
      criteria: 'Complete any lesson in Windgap Academy'
    },
    PERFECT_SCORE: {
      id: 'perfect_score',
      name: 'Perfect Performance',
      description: 'Achieved 100% on a quiz',
      image: '/badges/perfect-score.png',
      criteria: 'Score 100% on any quiz or assessment'
    },
    SOCIAL_LEARNER: {
      id: 'social_learner',
      name: 'Social Learner',
      description: 'Helped a peer with their learning',
      image: '/badges/social-learner.png',
      criteria: 'Provide helpful feedback to another student'
    }
  };

  async checkAndAwardBadges(context) {
    const newBadges = [];
    
    // Check first lesson completion
    if (context.type === 'lesson_completed' && !this.earnedBadges.has('first_lesson')) {
      newBadges.push(await this.awardBadge('FIRST_LESSON'));
    }
    
    // Check perfect score
    if (context.type === 'quiz_completed' && context.score === 100 && !this.earnedBadges.has('perfect_score')) {
      newBadges.push(await this.awardBadge('PERFECT_SCORE'));
    }
    
    // Check social interaction
    if (context.type === 'peer_helped' && !this.earnedBadges.has('social_learner')) {
      newBadges.push(await this.awardBadge('SOCIAL_LEARNER'));
    }
    
    return newBadges;
  }

  async awardBadge(badgeKey) {
    const badge = BadgeSystem.BADGES[badgeKey];
    if (!badge || this.earnedBadges.has(badge.id)) {
      return null;
    }

    this.earnedBadges.add(badge.id);
    
    // Create OpenBadges-compliant badge assertion
    const assertion = {
      '@context': 'https://w3id.org/openbadges/v2',
      type: 'Assertion',
      id: `https://windgapacademy.com/badges/${badge.id}/${this.userId}`,
      recipient: {
        type: 'email',
        hashed: false,
        identity: `student-${this.userId}@windgapacademy.com`
      },
      badge: {
        type: 'BadgeClass',
        id: `https://windgapacademy.com/badges/${badge.id}`,
        name: badge.name,
        description: badge.description,
        image: badge.image,
        criteria: {
          narrative: badge.criteria
        },
        issuer: {
          type: 'Issuer',
          id: 'https://windgapacademy.com',
          name: 'Windgap Academy',
          url: 'https://windgapacademy.com'
        }
      },
      issuedOn: new Date().toISOString()
    };

    // Save to database
    await this.saveBadgeAssertion(assertion);
    
    return assertion;
  }

  async saveBadgeAssertion(assertion) {
    try {
      await fetch('/api/badges/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion)
      });
    } catch (error) {
      console.error('Failed to save badge:', error);
    }
  }
}

// ============================================================================
// 📊 Learning Analytics Implementation
// ============================================================================

/**
 * Learning Analytics Tracker
 * Tracks student interactions and learning patterns
 */
export class LearningAnalytics {
  constructor(userId, sessionId) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.events = [];
    this.startTime = Date.now();
  }

  track(eventType, data = {}) {
    const event = {
      id: this.generateEventId(),
      userId: this.userId,
      sessionId: this.sessionId,
      type: eventType,
      timestamp: Date.now(),
      data: {
        ...data,
        sessionDuration: Date.now() - this.startTime
      }
    };

    this.events.push(event);
    this.sendEvent(event);
    
    return event;
  }

  // Track specific learning events
  trackLessonStart(lessonId, lessonTitle) {
    return this.track('lesson_started', {
      lessonId,
      lessonTitle,
      startTime: Date.now()
    });
  }

  trackLessonComplete(lessonId, duration, completionRate) {
    return this.track('lesson_completed', {
      lessonId,
      duration,
      completionRate,
      endTime: Date.now()
    });
  }

  trackQuizAttempt(quizId, answers, score, timeSpent) {
    return this.track('quiz_attempted', {
      quizId,
      answers,
      score,
      timeSpent,
      attempts: this.getQuizAttempts(quizId) + 1
    });
  }

  trackGameInteraction(gameId, action, result) {
    return this.track('game_interaction', {
      gameId,
      action,
      result,
      timestamp: Date.now()
    });
  }

  track3DInteraction(objectId, interactionType, position) {
    return this.track('3d_interaction', {
      objectId,
      interactionType,
      position,
      timestamp: Date.now()
    });
  }

  trackAccessibilityUsage(feature, enabled) {
    return this.track('accessibility_usage', {
      feature,
      enabled,
      timestamp: Date.now()
    });
  }

  // Analytics calculations
  calculateEngagementScore() {
    const totalTime = Date.now() - this.startTime;
    const interactions = this.events.filter(e => 
      ['click', 'hover', 'game_interaction', '3d_interaction'].includes(e.type)
    ).length;
    
    // Engagement score based on interactions per minute
    return Math.min(100, (interactions / (totalTime / 60000)) * 10);
  }

  calculateProgressVelocity() {
    const completionEvents = this.events.filter(e => 
      ['lesson_completed', 'quiz_completed', 'achievement_earned'].includes(e.type)
    );
    
    if (completionEvents.length < 2) return 0;
    
    const timeSpan = completionEvents[completionEvents.length - 1].timestamp - 
                    completionEvents[0].timestamp;
    return completionEvents.length / (timeSpan / 3600000); // completions per hour
  }

  generateEventId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getQuizAttempts(quizId) {
    return this.events.filter(e => 
      e.type === 'quiz_attempted' && e.data.quizId === quizId
    ).length;
  }

  async sendEvent(event) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Generate learning report
  generateLearningReport() {
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      engagementScore: this.calculateEngagementScore(),
      progressVelocity: this.calculateProgressVelocity(),
      eventSummary: this.getEventSummary(),
      learningPatterns: this.identifyLearningPatterns()
    };
  }

  getEventSummary() {
    const summary = {};
    this.events.forEach(event => {
      summary[event.type] = (summary[event.type] || 0) + 1;
    });
    return summary;
  }

  identifyLearningPatterns() {
    // Simple pattern identification
    const patterns = [];
    
    // Check for quick progression pattern
    const completions = this.events.filter(e => e.type.includes('completed'));
    if (completions.length > 3) {
      const avgTime = completions.reduce((sum, e, i, arr) => {
        if (i === 0) return 0;
        return sum + (e.timestamp - arr[i-1].timestamp);
      }, 0) / (completions.length - 1);
      
      if (avgTime < 300000) { // Less than 5 minutes between completions
        patterns.push('rapid_learner');
      }
    }
    
    // Check for help-seeking behavior
    const helpEvents = this.events.filter(e => 
      e.type === 'help_requested' || e.data.action === 'hint_used'
    );
    if (helpEvents.length > 5) {
      patterns.push('help_seeker');
    }
    
    // Check for high engagement with 3D elements
    const threeD_events = this.events.filter(e => e.type === '3d_interaction');
    if (threeD_events.length > 20) {
      patterns.push('visual_learner');
    }
    
    return patterns;
  }
}

// ============================================================================
// ♿ Accessibility Implementation Examples
// ============================================================================

/**
 * Accessibility Manager
 * Manages accessibility preferences and implementations
 */
export class AccessibilityManager {
  constructor() {
    this.preferences = this.loadPreferences();
    this.observers = new Set();
  }

  loadPreferences() {
    const saved = localStorage.getItem('accessibility_preferences');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      highContrast: false,
      reduceMotion: false,
      dyslexiaFont: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicator: true
    };
  }

  savePreferences() {
    localStorage.setItem('accessibility_preferences', JSON.stringify(this.preferences));
    this.notifyObservers();
  }

  updatePreference(key, value) {
    this.preferences[key] = value;
    this.applyPreference(key, value);
    this.savePreferences();
  }

  applyPreference(key, value) {
    const root = document.documentElement;
    
    switch (key) {
      case 'fontSize':
        const fontSizes = { small: '14px', medium: '16px', large: '18px', xlarge: '22px' };
        root.style.fontSize = fontSizes[value];
        break;
        
      case 'highContrast':
        root.classList.toggle('high-contrast', value);
        break;
        
      case 'reduceMotion':
        root.classList.toggle('reduce-motion', value);
        break;
        
      case 'dyslexiaFont':
        root.classList.toggle('dyslexia-font', value);
        break;
        
      case 'focusIndicator':
        root.classList.toggle('enhanced-focus', value);
        break;
    }
  }

  applyAllPreferences() {
    Object.entries(this.preferences).forEach(([key, value]) => {
      this.applyPreference(key, value);
    });
  }

  onPreferenceChange(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => callback(this.preferences));
  }

  // Keyboard navigation helper
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      if (!this.preferences.keyboardNavigation) return;
      
      switch (event.key) {
        case 'Tab':
          this.highlightFocusableElements();
          break;
        case 'Enter':
        case ' ':
          if (event.target.getAttribute('role') === 'button') {
            event.target.click();
          }
          break;
        case 'Escape':
          this.closeModals();
          break;
      }
    });
  }

  highlightFocusableElements() {
    if (this.preferences.focusIndicator) {
      const focusable = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable.forEach(el => el.classList.add('focusable-highlight'));
    }
  }

  closeModals() {
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('[aria-label="Close"]');
      if (closeBtn) closeBtn.click();
    });
  }
}

// ============================================================================
// 🔄 Data Management Examples
// ============================================================================

/**
 * Progress Tracking System
 * Manages student progress across different modules
 */
export class ProgressTracker {
  constructor(userId) {
    this.userId = userId;
    this.progress = new Map();
  }

  async loadProgress() {
    try {
      const response = await fetch(`/api/progress/${this.userId}`);
      const data = await response.json();
      
      data.modules.forEach(module => {
        this.progress.set(module.id, module);
      });
      
      return this.progress;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return new Map();
    }
  }

  updateModuleProgress(moduleId, lessonId, completionData) {
    if (!this.progress.has(moduleId)) {
      this.progress.set(moduleId, {
        id: moduleId,
        lessons: new Map(),
        overallProgress: 0,
        timeSpent: 0,
        lastAccessed: null
      });
    }

    const module = this.progress.get(moduleId);
    module.lessons.set(lessonId, {
      id: lessonId,
      completed: completionData.completed,
      score: completionData.score,
      timeSpent: completionData.timeSpent,
      attempts: completionData.attempts,
      completedAt: new Date()
    });

    // Recalculate overall progress
    const totalLessons = module.lessons.size;
    const completedLessons = Array.from(module.lessons.values())
      .filter(lesson => lesson.completed).length;
    
    module.overallProgress = (completedLessons / totalLessons) * 100;
    module.lastAccessed = new Date();
    module.timeSpent += completionData.timeSpent;

    this.saveProgress();
    return module;
  }

  async saveProgress() {
    try {
      const progressData = {
        userId: this.userId,
        modules: Array.from(this.progress.values()).map(module => ({
          ...module,
          lessons: Array.from(module.lessons.values())
        })),
        updatedAt: new Date()
      };

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  getOverallProgress() {
    if (this.progress.size === 0) return 0;
    
    const totalProgress = Array.from(this.progress.values())
      .reduce((sum, module) => sum + module.overallProgress, 0);
    
    return totalProgress / this.progress.size;
  }

  getModuleProgress(moduleId) {
    return this.progress.get(moduleId) || null;
  }

  getRecommendations() {
    const recommendations = [];
    
    // Recommend modules with low progress
    Array.from(this.progress.values()).forEach(module => {
      if (module.overallProgress < 50) {
        recommendations.push({
          type: 'continue_module',
          moduleId: module.id,
          reason: 'Complete this module to improve your overall progress'
        });
      }
    });

    // Recommend based on time spent
    const avgTimePerModule = Array.from(this.progress.values())
      .reduce((sum, module) => sum + module.timeSpent, 0) / this.progress.size;
    
    Array.from(this.progress.values()).forEach(module => {
      if (module.timeSpent < avgTimePerModule * 0.5) {
        recommendations.push({
          type: 'review_module',
          moduleId: module.id,
          reason: 'Spend more time on this module to better understand the concepts'
        });
      }
    });

    return recommendations;
  }
}

// ============================================================================
// 🎨 UI Component Examples
// ============================================================================

/**
 * Progress Visualization Component
 * Shows student progress with animations
 */
export function ProgressRing({ progress = 0, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4299e1"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

/**
 * Interactive Quiz Component
 * Example implementation with accessibility features
 */
export function InteractiveQuiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId, answerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore(answers, questions);
    onComplete?.(answers, score);
  };

  const calculateScore = (answers, questions) => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  if (submitted) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <ProgressRing progress={calculateScore(answers, questions)} />
        <p className="mt-4 text-gray-600">
          You scored {calculateScore(answers, questions)}%
        </p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <ProgressRing 
            progress={(currentQuestion / questions.length) * 100} 
            size={40} 
            strokeWidth={4} 
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
        
        <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${question.id}`}>
          {question.options.map((option, index) => (
            <label
              key={index}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="mr-3"
                aria-describedby={`option-${index}-description`}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!answers[question.id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!answers[question.id]}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 📱 Mobile and PWA Examples
// ============================================================================

/**
 * Mobile-Optimized Touch Controls
 * For 3D interactions on mobile devices
 */
export function Mobile3DControls({ onGesture }) {
  const [touches, setTouches] = useState([]);
  const [gestureStart, setGestureStart] = useState(null);

  const handleTouchStart = (event) => {
    const touchList = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }));
    
    setTouches(touchList);
    setGestureStart({
      touches: touchList,
      time: Date.now()
    });
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    
    const currentTouches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY
    }));

    if (gestureStart && currentTouches.length === 1 && gestureStart.touches.length === 1) {
      // Single finger drag - rotate camera
      const dx = currentTouches[0].x - gestureStart.touches[0].x;
      const dy = currentTouches[0].y - gestureStart.touches[0].y;
      
      onGesture?.({
        type: 'rotate',
        deltaX: dx,
        deltaY: dy
      });
    } else if (currentTouches.length === 2 && gestureStart.touches.length === 2) {
      // Two finger pinch - zoom
      const distance1 = Math.sqrt(
        Math.pow(gestureStart.touches[1].x - gestureStart.touches[0].x, 2) +
        Math.pow(gestureStart.touches[1].y - gestureStart.touches[0].y, 2)
      );
      
      const distance2 = Math.sqrt(
        Math.pow(currentTouches[1].x - currentTouches[0].x, 2) +
        Math.pow(currentTouches[1].y - currentTouches[0].y, 2)
      );
      
      const scale = distance2 / distance1;
      
      onGesture?.({
        type: 'zoom',
        scale: scale
      });
    }
    
    setTouches(currentTouches);
  };

  const handleTouchEnd = () => {
    setTouches([]);
    setGestureStart(null);
  };

  return (
    <div
      className="absolute inset-0 z-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    />
  );
}

// Export all examples for use in other files
export {
  ExperienceSystem,
  BadgeSystem,
  LearningAnalytics,
  AccessibilityManager,
  ProgressTracker
};