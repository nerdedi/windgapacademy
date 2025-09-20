import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaVolumeUp, FaPlay, FaPause, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAccessibility } from "../context/AccessibilityContext";
import { useLearningPreferences } from "../context/LearningPreferencesContext";

/**
 * LearningModeComponents
 *
 * A collection of components designed for different learning modes:
 * - Visual learning
 * - Auditory learning
 * - Kinesthetic/Interactive learning
 * - Text-based learning
 * - Game-based learning
 * - Social learning
 *
 * These components provide neurodivergent-friendly alternatives for presenting
 * the same content in different ways, accommodating various learning preferences.
 */

/**
 * VisualLearningContent - For visual/spatial learners
 *
 * Features:
 * - Imagery and diagrams
 * - Mind maps
 * - Color-coding
 * - Infographics
 * - Animations (with reduced motion support)
 */
export const VisualLearningContent = ({
  content,
  images,
  diagrams,
  highlightColor = "#3b82f6",
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();

  // Extract visual learning strength
  const visualStrength = preferences.learningStyles?.visual || 3;

  // Determine visual presentation complexity based on learning strength
  const visualComplexity = visualStrength >= 4 ? "high" : visualStrength >= 3 ? "medium" : "low";

  return (
    <div className="visual-learning-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
        <h3 className="text-lg font-medium">Visual Learning Content</h3>
      </div>

      {/* Main content with visual enhancements */}
      <div className="space-y-6">
        {/* Text content with visual enhancements */}
        <div
          className="prose max-w-none"
          style={{
            color: settings.visualMode === "high-contrast" ? "#ffffff" : "#333333",
          }}
        >
          {content}
        </div>

        {/* Visual content elements */}
        {images && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {images.map((image, index) => (
              <div key={`image-${index}`} className="relative">
                <img
                  src={image.src}
                  alt={image.alt || "Visual learning image"}
                  className="rounded-lg w-full h-auto"
                  style={{
                    filter: settings.reduceBrightness ? "brightness(0.85)" : "none",
                    border: `2px solid ${highlightColor}`,
                  }}
                />
                {image.caption && (
                  <p className="text-sm text-center mt-2 text-gray-700">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Diagrams and infographics */}
        {diagrams && diagrams.length > 0 && (
          <div className="my-6">
            {diagrams.map((diagram, index) => (
              <div key={`diagram-${index}`} className="mb-6">
                <h4 className="font-medium mb-2">{diagram.title}</h4>
                <div className="border rounded-lg p-4" style={{ borderColor: highlightColor }}>
                  <img src={diagram.src} alt={diagram.alt || "Diagram"} className="w-full h-auto" />
                </div>
                {diagram.explanation && (
                  <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">
                    {diagram.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Color coding legend if applicable */}
        {visualComplexity === "high" && settings.colorCodeCategories && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Color Legend</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>Key concepts</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Examples</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                <span>Related ideas</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                <span>Important notes</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * AuditoryLearningContent - For auditory learners
 *
 * Features:
 * - Text-to-speech
 * - Audio recordings
 * - Verbal explanations
 * - Audio controls (speed, volume)
 */
export const AuditoryLearningContent = ({ content, audioSrc, audioType = "explanation" }) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  // Extract auditory learning strength
  const auditoryStrength = preferences.learningStyles?.auditory || 3;

  // Text-to-speech function
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set speech rate based on settings
      const speechRate =
        settings.narrationSpeed === "slow" ? 0.8 : settings.narrationSpeed === "fast" ? 1.2 : 1;
      utterance.rate = speechRate;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle audio player controls
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Play/pause audio
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Format time (seconds -> mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="auditory-learning-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
        <h3 className="text-lg font-medium">Auditory Learning Content</h3>
      </div>

      {/* Text content that can be read aloud */}
      <div className="prose max-w-none mb-6">{content}</div>

      {/* Text-to-speech button */}
      <button
        onClick={() => speakText(content)}
        className="mb-6 flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
      >
        <FaVolumeUp className="mr-2" />
        <span>Read Aloud</span>
      </button>

      {/* Audio player if audio source is provided */}
      {audioSrc && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">
            {audioType === "explanation"
              ? "Audio Explanation"
              : audioType === "lecture"
                ? "Lecture Recording"
                : audioType === "discussion"
                  ? "Discussion Audio"
                  : "Audio Content"}
          </h4>

          <audio ref={audioRef} src={audioSrc} preload="metadata" className="hidden" />

          <div className="bg-gray-100 rounded-lg p-4">
            {/* Play/pause button and time display */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-gray-300 rounded-full mb-4">
              <div
                className="absolute h-2 bg-green-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  setCurrentTime(time);
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                  }
                }}
                className="absolute w-full h-2 opacity-0 cursor-pointer"
              />
            </div>

            {/* Controls for volume and playback rate */}
            <div className="flex flex-wrap justify-between">
              <div className="flex items-center">
                <span className="text-sm mr-2">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>

              <div className="flex items-center">
                <span className="text-sm mr-2">Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                  className="text-sm border rounded p-1"
                >
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional auditory learning supports based on strength */}
      {auditoryStrength >= 4 && (
        <div className="mt-4 bg-green-50 p-3 rounded-lg">
          <h4 className="font-medium mb-1">Learning Tips:</h4>
          <ul className="text-sm list-disc list-inside">
            <li>Try repeating key concepts aloud</li>
            <li>Discuss this content with others when possible</li>
            <li>Record your own summary to listen to later</li>
            <li>Use rhymes or songs to remember important points</li>
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * KinestheticLearningContent - For hands-on/kinesthetic learners
 *
 * Features:
 * - Interactive exercises
 * - Drag-and-drop activities
 * - Simulations
 * - Physical activities suggestions
 */
export const KinestheticLearningContent = ({ content, activities = [] }) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();
  const [completedActivities, setCompletedActivities] = useState([]);

  // Extract kinesthetic learning strength
  const kinestheticStrength = preferences.learningStyles?.kinesthetic || 3;

  // Mark activity as complete/incomplete
  const toggleActivity = (index) => {
    setCompletedActivities((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="kinesthetic-learning-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
        <h3 className="text-lg font-medium">Interactive Learning Content</h3>
      </div>

      {/* Brief text content introduction */}
      <div className="prose max-w-none mb-6">{content}</div>

      {/* Hands-on activities */}
      <div className="space-y-6 mb-6">
        <h4 className="font-medium">Learning Activities</h4>

        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={`activity-${index}`}
                className={`border rounded-lg p-4 transition-all ${
                  completedActivities.includes(index)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={completedActivities.includes(index)}
                      onChange={() => toggleActivity(index)}
                      className="h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">{activity.title}</h5>
                    <p className="text-gray-600 mt-1">{activity.description}</p>

                    {activity.steps && activity.steps.length > 0 && (
                      <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                        {activity.steps.map((step, stepIndex) => (
                          <li key={`step-${stepIndex}`}>{step}</li>
                        ))}
                      </ol>
                    )}

                    {activity.tip && (
                      <div className="mt-2 text-sm bg-orange-100 p-2 rounded text-orange-800">
                        <strong>Tip:</strong> {activity.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">No activities available for this content.</div>
        )}
      </div>

      {/* Movement suggestions for kinesthetic learners */}
      {kinestheticStrength >= 3 && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Movement Suggestions</h4>
          <p className="text-sm mb-3">Try these movements while learning to enhance retention:</p>

          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 bg-orange-200 rounded-full mr-2 mt-1"></span>
              <span>Stand up and walk around while reviewing key points</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 bg-orange-200 rounded-full mr-2 mt-1"></span>
              <span>Use hand gestures to represent concepts</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 bg-orange-200 rounded-full mr-2 mt-1"></span>
              <span>Draw or trace diagrams with your finger</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 bg-orange-200 rounded-full mr-2 mt-1"></span>
              <span>Take short movement breaks every 15-20 minutes</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * TextBasedLearningContent - For reading/writing learners
 *
 * Features:
 * - Well-structured text content
 * - Note-taking prompts
 * - Text highlighting
 * - Written exercises
 */
export const TextBasedLearningContent = ({
  content,
  keyPoints = [],
  vocabulary = [],
  writingPrompts = [],
}) => {
  const { settings } = useAccessibility();
  const { preferences } = useLearningPreferences();
  const [notes, setNotes] = useState("");
  const [showPrintableVersion, setShowPrintableVersion] = useState(false);

  // Extract reading/writing learning strength
  const readingWritingStrength = preferences.learningStyles?.readingWriting || 3;

  return (
    <div className="reading-writing-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
        <h3 className="text-lg font-medium">Text-Based Learning Content</h3>
      </div>

      {/* Controls */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowPrintableVersion(!showPrintableVersion)}
          className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          {showPrintableVersion ? "Exit Print View" : "Printable Version"}
        </button>
      </div>

      {/* Main content */}
      <div className={showPrintableVersion ? "print:block" : ""}>
        {/* Text content */}
        <div
          className={`prose max-w-none mb-6 ${showPrintableVersion ? "text-black bg-white" : ""}`}
          style={{
            lineHeight:
              settings.lineSpacing === "normal" ? 1.5 : settings.lineSpacing === "wide" ? 1.8 : 2,
            fontSize:
              settings.fontSize === "small"
                ? "0.875rem"
                : settings.fontSize === "medium"
                  ? "1rem"
                  : settings.fontSize === "large"
                    ? "1.125rem"
                    : "1.25rem",
          }}
        >
          {content}
        </div>

        {/* Key points/summary */}
        {keyPoints.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Key Points</h4>
            <ul className="list-disc list-inside space-y-2 pl-4">
              {keyPoints.map((point, index) => (
                <li key={`point-${index}`} className="text-gray-800">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vocabulary */}
        {vocabulary.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-2">Key Terms</h4>
            <dl className="space-y-3">
              {vocabulary.map((term, index) => (
                <div key={`term-${index}`} className="bg-gray-50 p-3 rounded">
                  <dt className="font-medium">{term.term}</dt>
                  <dd className="text-gray-700 mt-1">{term.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Note-taking area - hide in print view */}
      {!showPrintableVersion && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          ></textarea>
        </div>
      )}

      {/* Writing prompts - hide in print view */}
      {!showPrintableVersion && writingPrompts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Writing Prompts</h4>
          <div className="space-y-3">
            {writingPrompts.map((prompt, index) => (
              <div key={`prompt-${index}`} className="bg-purple-50 p-3 rounded-lg">
                <p className="text-purple-800">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional tips based on reading/writing strength */}
      {!showPrintableVersion && readingWritingStrength >= 4 && (
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-medium mb-1">Study Tips:</h4>
          <ul className="text-sm list-disc list-inside">
            <li>Rewrite key concepts in your own words</li>
            <li>Create flashcards for important terms</li>
            <li>Organize information into outlines or mind maps</li>
            <li>Summarize what you've learned in writing</li>
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * GameBasedLearningContent - For game-based learning
 *
 * Features:
 * - Quiz games
 * - Interactive challenges
 * - Point systems
 * - Progress tracking
 */
export const GameBasedLearningContent = ({ content, quizQuestions = [], challenges = [] }) => {
  const { settings } = useAccessibility();
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [points, setPoints] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setPoints(0);
    setShowFeedback(false);
  };

  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (quizCompleted) return;

    // Check if this question has already been answered
    const existingAnswer = quizAnswers.find((a) => a.questionIndex === questionIndex);
    if (existingAnswer) return;

    const question = quizQuestions[questionIndex];
    const isCorrect = answerIndex === question.correctAnswerIndex;

    // Update points
    if (isCorrect) {
      setPoints((prev) => prev + 10);
    }

    // Show feedback if immediate feedback is enabled
    if (settings.showFeedbackImmediately) {
      setFeedbackMessage(
        isCorrect
          ? "Correct! " + (question.explanation || "")
          : "Not quite. " + (question.explanation || ""),
      );
      setFeedbackIsCorrect(isCorrect);
      setShowFeedback(true);

      // Hide feedback after a delay
      setTimeout(() => {
        setShowFeedback(false);

        // Move to next question after feedback
        if (questionIndex < quizQuestions.length - 1) {
          setCurrentQuizQuestion(questionIndex + 1);
        } else {
          setQuizCompleted(true);
        }
      }, 2500);
    } else {
      // Move to next question immediately if feedback is disabled
      if (questionIndex < quizQuestions.length - 1) {
        setCurrentQuizQuestion(questionIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }

    // Record answer
    setQuizAnswers((prev) => [...prev, { questionIndex, answerIndex, isCorrect }]);
  };

  // Calculate quiz score
  const calculateScore = () => {
    const correctAnswers = quizAnswers.filter((a) => a.isCorrect).length;
    return {
      correct: correctAnswers,
      total: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100),
    };
  };

  return (
    <div className="game-based-learning-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <h3 className="text-lg font-medium">Game-Based Learning</h3>
        </div>

        {/* Points display */}
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {points} points
        </div>
      </div>

      {/* Brief content introduction */}
      <div className="prose max-w-none mb-6">{content}</div>

      {/* Quiz game */}
      {quizQuestions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Knowledge Challenge</h4>

            {/* Quiz progress */}
            <div className="text-sm text-gray-500">
              Question {currentQuizQuestion + 1} of {quizQuestions.length}
            </div>
          </div>

          {/* Quiz content */}
          <div className="bg-yellow-50 rounded-lg p-4">
            {!quizCompleted ? (
              <>
                {/* Current question */}
                <div className="mb-4">
                  <h5 className="font-medium mb-2">
                    {quizQuestions[currentQuizQuestion].question}
                  </h5>

                  {/* Answer options */}
                  <div className="space-y-2">
                    {quizQuestions[currentQuizQuestion].answers.map((answer, answerIndex) => {
                      const hasBeenAnswered = quizAnswers.some(
                        (a) => a.questionIndex === currentQuizQuestion,
                      );

                      return (
                        <button
                          key={`answer-${answerIndex}`}
                          onClick={() => handleAnswerSelect(currentQuizQuestion, answerIndex)}
                          disabled={hasBeenAnswered || showFeedback}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            hasBeenAnswered
                              ? answerIndex ===
                                quizQuestions[currentQuizQuestion].correctAnswerIndex
                                ? "bg-green-100 border border-green-300"
                                : quizAnswers.find((a) => a.questionIndex === currentQuizQuestion)
                                      ?.answerIndex === answerIndex
                                  ? "bg-red-100 border border-red-300"
                                  : "bg-white border border-gray-200"
                              : "bg-white border border-gray-200 hover:bg-yellow-100 hover:border-yellow-300"
                          }`}
                        >
                          {answer}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback message */}
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg ${
                      feedbackIsCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {feedbackMessage}
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      currentQuizQuestion > 0 && setCurrentQuizQuestion((prev) => prev - 1)
                    }
                    disabled={currentQuizQuestion === 0 || showFeedback}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                  >
                    <FaChevronLeft className="mr-1" />
                    Previous
                  </button>

                  <button
                    onClick={() => {
                      if (currentQuizQuestion < quizQuestions.length - 1) {
                        setCurrentQuizQuestion((prev) => prev + 1);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    disabled={
                      currentQuizQuestion === quizQuestions.length - 1 ||
                      showFeedback ||
                      !quizAnswers.some((a) => a.questionIndex === currentQuizQuestion)
                    }
                    className="flex items-center px-3 py-1 text-sm bg-yellow-100 rounded disabled:opacity-50"
                  >
                    Next
                    <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </>
            ) : (
              // Quiz results
              <div className="text-center py-4">
                <h5 className="font-medium text-xl mb-3">Challenge Complete!</h5>

                {/* Score display */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {calculateScore().percentage}%
                  </div>
                  <div className="text-gray-600">
                    You got {calculateScore().correct} out of {calculateScore().total} questions
                    correct.
                  </div>
                </div>

                {/* Point award */}
                <div className="bg-yellow-100 inline-block px-4 py-2 rounded-lg mb-4">
                  <div className="text-yellow-800 font-medium">+{points} points earned!</div>
                </div>

                {/* Try again button */}
                <div>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive challenges */}
      {challenges.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Learning Challenges</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge, index) => (
              <div
                key={`challenge-${index}`}
                className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
              >
                <div className="flex items-start">
                  <div className="bg-yellow-200 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium">{challenge.title}</h5>
                    <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>

                    {challenge.pointValue && (
                      <div className="mt-2 text-sm font-medium text-yellow-600">
                        Worth {challenge.pointValue} points
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SocialLearningContent - For social learners
 *
 * Features:
 * - Discussion prompts
 * - Collaborative activities
 * - Peer teaching suggestions
 * - Group work templates
 */
export const SocialLearningContent = ({
  content,
  discussionPrompts = [],
  groupActivities = [],
}) => {
  return (
    <div className="social-learning-element p-4 rounded-lg bg-white shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
        <h3 className="text-lg font-medium">Social Learning Content</h3>
      </div>

      {/* Brief content introduction */}
      <div className="prose max-w-none mb-6">{content}</div>

      {/* Discussion prompts */}
      {discussionPrompts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Discussion Prompts</h4>

          <div className="space-y-3">
            {discussionPrompts.map((prompt, index) => (
              <div
                key={`prompt-${index}`}
                className="bg-pink-50 p-4 rounded-lg border border-pink-200"
              >
                <p className="text-gray-800">{prompt.question}</p>

                {prompt.hint && (
                  <div className="mt-2 text-sm text-pink-700 bg-pink-100 p-2 rounded">
                    <strong>Tip:</strong> {prompt.hint}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group activities */}
      {groupActivities.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Collaborative Activities</h4>

          <div className="space-y-4">
            {groupActivities.map((activity, index) => (
              <div key={`activity-${index}`} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-pink-700">{activity.title}</h5>
                <p className="text-gray-600 mt-1 mb-3">{activity.description}</p>

                {activity.groupSize && (
                  <div className="text-sm bg-gray-50 px-3 py-1 rounded inline-block mb-2">
                    Group size: {activity.groupSize} people
                  </div>
                )}

                {activity.steps && activity.steps.length > 0 && (
                  <ol className="list-decimal list-inside text-sm mt-3 space-y-1">
                    {activity.steps.map((step, stepIndex) => (
                      <li key={`step-${stepIndex}`}>{step}</li>
                    ))}
                  </ol>
                )}

                {activity.roles && activity.roles.length > 0 && (
                  <div className="mt-3">
                    <h6 className="text-sm font-medium mb-1">Suggested Roles:</h6>
                    <ul className="text-sm list-disc list-inside">
                      {activity.roles.map((role, roleIndex) => (
                        <li key={`role-${roleIndex}`}>{role}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * AdaptiveLearningContent - Container component that displays content in user's preferred learning mode
 *
 * Features:
 * - Automatically selects best learning mode based on user preferences
 * - Allows manual switching between modes
 * - Integrates with learning preferences context
 */
export const AdaptiveLearningContent = ({
  children,
  textContent,
  visualContent = {},
  auditoryContent = {},
  kinestheticContent = {},
  readingWritingContent = {},
  gameBasedContent = {},
  socialContent = {},
}) => {
  const { preferences } = useLearningPreferences();
  const [activeMode, setActiveMode] = useState("auto");

  // Determine the best learning mode based on preferences
  const getBestLearningMode = () => {
    if (!preferences || !preferences.learningStyles) return "visual";

    const styles = preferences.learningStyles;
    const maxValue = Math.max(
      styles.visual || 0,
      styles.auditory || 0,
      styles.kinesthetic || 0,
      styles.readingWriting || 0,
    );

    if (maxValue === styles.visual) return "visual";
    if (maxValue === styles.auditory) return "auditory";
    if (maxValue === styles.kinesthetic) return "kinesthetic";
    if (maxValue === styles.readingWriting) return "readingWriting";

    // Default to visual if all are equal
    return "visual";
  };

  // Get the actual mode to display (resolving "auto")
  const getDisplayMode = () => {
    if (activeMode === "auto") {
      return getBestLearningMode();
    }
    return activeMode;
  };

  const displayMode = getDisplayMode();

  // Render the appropriate content based on the display mode
  const renderContent = () => {
    switch (displayMode) {
      case "visual":
        return (
          <VisualLearningContent
            content={textContent}
            images={visualContent.images || []}
            diagrams={visualContent.diagrams || []}
            highlightColor={visualContent.highlightColor}
          />
        );
      case "auditory":
        return (
          <AuditoryLearningContent
            content={textContent}
            audioSrc={auditoryContent.audioSrc}
            audioType={auditoryContent.audioType}
          />
        );
      case "kinesthetic":
        return (
          <KinestheticLearningContent
            content={textContent}
            activities={kinestheticContent.activities || []}
          />
        );
      case "readingWriting":
        return (
          <TextBasedLearningContent
            content={textContent}
            keyPoints={readingWritingContent.keyPoints || []}
            vocabulary={readingWritingContent.vocabulary || []}
            writingPrompts={readingWritingContent.writingPrompts || []}
          />
        );
      case "gameBased":
        return (
          <GameBasedLearningContent
            content={textContent}
            quizQuestions={gameBasedContent.quizQuestions || []}
            challenges={gameBasedContent.challenges || []}
          />
        );
      case "social":
        return (
          <SocialLearningContent
            content={textContent}
            discussionPrompts={socialContent.discussionPrompts || []}
            groupActivities={socialContent.groupActivities || []}
          />
        );
      default:
        return (
          <div className="p-4">
            <p>Error: Unknown learning mode selected.</p>
          </div>
        );
    }
  };

  return (
    <div className="adaptive-learning-content mb-8">
      {/* Mode selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Learning Mode</h3>
          <div className="text-sm">
            <span className="text-gray-500 mr-1">Current:</span>
            <span className="font-medium">
              {displayMode === "visual"
                ? "Visual"
                : displayMode === "auditory"
                  ? "Auditory"
                  : displayMode === "kinesthetic"
                    ? "Interactive"
                    : displayMode === "readingWriting"
                      ? "Reading/Writing"
                      : displayMode === "gameBased"
                        ? "Game-Based"
                        : displayMode === "social"
                          ? "Social"
                          : "Auto"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveMode("auto")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "auto"
                ? "bg-blue-100 text-blue-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setActiveMode("visual")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "visual"
                ? "bg-blue-100 text-blue-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setActiveMode("auditory")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "auditory"
                ? "bg-green-100 text-green-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Auditory
          </button>
          <button
            onClick={() => setActiveMode("kinesthetic")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "kinesthetic"
                ? "bg-orange-100 text-orange-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Interactive
          </button>
          <button
            onClick={() => setActiveMode("readingWriting")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "readingWriting"
                ? "bg-purple-100 text-purple-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reading/Writing
          </button>
          <button
            onClick={() => setActiveMode("gameBased")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "gameBased"
                ? "bg-yellow-100 text-yellow-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Game-Based
          </button>
          <button
            onClick={() => setActiveMode("social")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeMode === "social"
                ? "bg-pink-100 text-pink-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Social
          </button>
        </div>
      </div>

      {/* Content display */}
      {renderContent()}

      {/* Optional children */}
      {children}
    </div>
  );
};

export default {
  VisualLearningContent,
  AuditoryLearningContent,
  KinestheticLearningContent,
  TextBasedLearningContent,
  GameBasedLearningContent,
  SocialLearningContent,
  AdaptiveLearningContent,
};
