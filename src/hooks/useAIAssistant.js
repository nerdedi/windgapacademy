import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AIAssistantService from "../services/AIAssistantService";

/**
 * Custom hook for using the AI Assistant functionality across the application
 * Provides methods for sentence construction, grammar correction, and symbol interpretation
 */
const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const initializeAssistant = async () => {
      try {
        const initialized = AIAssistantService.initialize();
        setIsInitialized(initialized);

        if (initialized && currentUser?.uid) {
          await AIAssistantService.loadUserContext(currentUser.uid);
        }
      } catch (err) {
        console.error("Failed to initialize AI Assistant:", err);
        setError("Failed to initialize AI Assistant");
      }
    };

    if (!AIAssistantService.initialized) {
      initializeAssistant();
    } else {
      setIsInitialized(true);
    }
  }, [currentUser]);

  /**
   * Construct a natural-sounding sentence from symbols or words
   */
  const constructSentence = useCallback(
    async (symbols, options) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isInitialized) {
          AIAssistantService.initialize();
        }

        const result = await AIAssistantService.constructSentence(symbols, options);
        return result;
      } catch (err) {
        setError(err.message || "Failed to construct sentence");
        return { sentence: symbols.join(" "), suggestions: [], error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized],
  );

  /**
   * Correct grammar in a text
   */
  const correctGrammar = useCallback(
    async (text) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isInitialized) {
          AIAssistantService.initialize();
        }

        const result = await AIAssistantService.correctGrammar(text);
        return result;
      } catch (err) {
        setError(err.message || "Failed to correct grammar");
        return { corrected: text, explanation: "", error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized],
  );

  /**
   * Interpret meaning from symbols
   */
  const interpretSymbols = useCallback(
    async (symbols) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!isInitialized) {
          AIAssistantService.initialize();
        }

        const result = await AIAssistantService.interpretFromSymbols(symbols);
        return result;
      } catch (err) {
        setError(err.message || "Failed to interpret symbols");
        return {
          text: Array.isArray(symbols) ? symbols.join(" ") : symbols,
          confidence: 0,
          error: err.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized],
  );

  /**
   * Update AI assistant preferences
   */
  const updatePreferences = useCallback(
    async (preferences) => {
      setError(null);

      try {
        if (!isInitialized) {
          AIAssistantService.initialize();
        }

        return await AIAssistantService.updatePreferences(preferences);
      } catch (err) {
        setError(err.message || "Failed to update preferences");
        return false;
      }
    },
    [isInitialized],
  );

  return {
    constructSentence,
    correctGrammar,
    interpretSymbols,
    updatePreferences,
    isLoading,
    error,
    isInitialized,
  };
};

export default useAIAssistant;
