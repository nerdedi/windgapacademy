import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AIAssistantService from "../services/AIAssistantService";

/**
 * AIAssistant Component
 *
 * A component that provides AI-powered assistance for AAC (Augmentative and Alternative Communication)
 * with features like sentence construction, grammar correction, and symbol-to-text interpretation.
 */
const AIAssistant = ({
  onSentenceGenerated,
  symbols = [],
  mode = "sentence", // 'sentence', 'grammar', 'interpret'
  initialText = "",
  onClose,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [inputText, setInputText] = useState(initialText);
  const [selectedSymbols, setSelectedSymbols] = useState(symbols);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    sentenceComplexity: "medium",
    grammarCorrection: true,
    vocabularyLevel: "intermediate",
    ageGroup: "all-ages",
  });

  const { currentUser } = useAuth();
  const assistantRef = useRef();

  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        AIAssistantService.initialize();

        if (currentUser?.uid) {
          await AIAssistantService.loadUserContext(currentUser.uid);
          // Load user preferences
          const userContext = AIAssistantService.userContext;
          if (userContext && userContext.preferences) {
            setPreferences((prev) => ({
              ...prev,
              ...userContext.preferences,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to initialize AI Assistant:", error);
      }
    };

    initializeAssistant();
  }, [currentUser]);

  // Update when symbols prop changes
  useEffect(() => {
    setSelectedSymbols(symbols);
  }, [symbols]);

  // Update when initialText prop changes
  useEffect(() => {
    setInputText(initialText);
  }, [initialText]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow animation to complete
    }
  };

  const handleSettingsSave = async () => {
    try {
      await AIAssistantService.updatePreferences(preferences);
      setShowSettings(false);
    } catch (error) {
      setError("Failed to save preferences");
      console.error("Error saving preferences:", error);
    }
  };

  const handleProcess = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      let response;

      switch (mode) {
        case "sentence":
          response = await AIAssistantService.constructSentence(
            selectedSymbols.length > 0 ? selectedSymbols : inputText.split(" "),
            { complexity: preferences.sentenceComplexity, ageGroup: preferences.ageGroup },
          );
          break;
        case "grammar":
          response = await AIAssistantService.correctGrammar(inputText);
          break;
        case "interpret":
          response = await AIAssistantService.interpretFromSymbols(
            selectedSymbols.length > 0 ? selectedSymbols : inputText.split(" "),
          );
          break;
        default:
          throw new Error(`Unsupported mode: ${mode}`);
      }

      setResult(response);

      // Call the onSentenceGenerated callback if provided
      if (onSentenceGenerated && response) {
        const outputText =
          mode === "sentence"
            ? response.sentence
            : mode === "grammar"
              ? response.corrected
              : response.text;

        onSentenceGenerated(outputText);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      console.error("AI Assistant error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "sentence":
        return "Sentence Construction";
      case "grammar":
        return "Grammar Correction";
      case "interpret":
        return "Symbol Interpretation";
      default:
        return "AI Assistant";
    }
  };

  const getActionLabel = () => {
    switch (mode) {
      case "sentence":
        return "Construct Sentence";
      case "grammar":
        return "Correct Grammar";
      case "interpret":
        return "Interpret Symbols";
      default:
        return "Process";
    }
  };

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`ai-assistant-container rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 max-w-lg mx-auto ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          ref={assistantRef}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              AI Assistant: {getTitle()}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleClose}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className="settings-panel mb-4">
              <h4 className="text-lg font-medium mb-2">AI Assistant Settings</h4>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Sentence Complexity</label>
                <select
                  value={preferences.sentenceComplexity}
                  onChange={(e) =>
                    setPreferences({ ...preferences, sentenceComplexity: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="simple">Simple</option>
                  <option value="medium">Medium</option>
                  <option value="complex">Complex</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Vocabulary Level</label>
                <select
                  value={preferences.vocabularyLevel}
                  onChange={(e) =>
                    setPreferences({ ...preferences, vocabularyLevel: e.target.value })
                  }
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <select
                  value={preferences.ageGroup}
                  onChange={(e) => setPreferences({ ...preferences, ageGroup: e.target.value })}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="child">Child</option>
                  <option value="teen">Teen</option>
                  <option value="adult">Adult</option>
                  <option value="all-ages">All Ages</option>
                </select>
              </div>

              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="grammarCorrection"
                  checked={preferences.grammarCorrection}
                  onChange={(e) =>
                    setPreferences({ ...preferences, grammarCorrection: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="grammarCorrection" className="text-sm font-medium">
                  Enable Grammar Correction
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded mr-2 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSettingsSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          ) : (
            <>
              {selectedSymbols.length > 0 && (
                <div className="selected-symbols mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected Symbols:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymbols.map((symbol, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
                      >
                        {typeof symbol === "object" ? symbol.name || symbol.id : symbol}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {mode !== "interpret" && selectedSymbols.length === 0 && (
                <div className="mb-4">
                  <label htmlFor="input-text" className="block text-sm font-medium mb-1">
                    {mode === "grammar" ? "Text to correct:" : "Input:"}
                  </label>
                  <textarea
                    id="input-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      mode === "grammar"
                        ? "Enter text to correct grammar..."
                        : "Enter words to construct a sentence..."
                    }
                    className="w-full p-2 border rounded min-h-[80px] dark:bg-gray-700 dark:border-gray-600"
                    disabled={isLoading}
                  />
                </div>
              )}

              {error && (
                <div className="error-message mb-4 p-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded">
                  {error}
                </div>
              )}

              {result && (
                <motion.div
                  className="result-container mb-4 p-3 bg-green-50 dark:bg-green-900 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {mode === "sentence" && (
                    <>
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Constructed Sentence:
                      </h4>
                      <p className="text-lg">{result.sentence}</p>

                      {result.suggestions?.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                            Alternatives:
                          </h4>
                          <ul className="list-disc pl-5">
                            {result.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm">
                                <button
                                  className="text-blue-600 hover:underline dark:text-blue-400"
                                  onClick={() =>
                                    onSentenceGenerated && onSentenceGenerated(suggestion)
                                  }
                                >
                                  {suggestion}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {mode === "grammar" && (
                    <>
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Corrected:
                      </h4>
                      <p className="text-lg">{result.corrected}</p>

                      {result.explanation && (
                        <div className="mt-2">
                          <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                            Explanation:
                          </h4>
                          <p className="text-sm">{result.explanation}</p>
                        </div>
                      )}
                    </>
                  )}

                  {mode === "interpret" && (
                    <>
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Interpretation:
                      </h4>
                      <p className="text-lg">{result.text}</p>

                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-green-800 dark:text-green-200 mr-2">
                          Confidence:
                        </span>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${result.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">{Math.round(result.confidence * 100)}%</span>
                      </div>
                    </>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setResult(null)}
                      className="text-sm text-gray-600 hover:underline dark:text-gray-400"
                    >
                      Clear result
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center">
                {!result && (
                  <button
                    onClick={handleProcess}
                    disabled={isLoading || (!inputText && selectedSymbols.length === 0)}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      getActionLabel()
                    )}
                  </button>
                )}

                {result && (
                  <button
                    onClick={() => {
                      if (onSentenceGenerated) {
                        const outputText =
                          mode === "sentence"
                            ? result.sentence
                            : mode === "grammar"
                              ? result.corrected
                              : result.text;
                        onSentenceGenerated(outputText);
                      }
                      handleClose();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Use This
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;
