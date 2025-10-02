/**
 * AI Assistant Service
 * Integrates with OpenAI API for complex sentence construction,
 * grammar correction, and symbol-to-text interpretation.
 *
 * This service supports the AAC (Augmentative and Alternative Communication)
 * features of the application.
 */

import { getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

class AIAssistantService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    this.model = process.env.OPENAI_MODEL || "gpt-4";
    this.db = null;
    this.initialized = false;
    this.userContext = {};
    this.maxContextLength = 10; // Maximum number of recent messages to keep for context
  }

  /**
   * Initialize the service with Firebase for storing conversation history
   */
  initialize() {
    try {
      // Get Firebase instance
      const firebaseApp = getApp();
      this.db = getFirestore(firebaseApp);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize AIAssistantService:", error);
      return false;
    }
  }

  /**
   * Load user context and preferences from Firestore
   * @param {string} userId - The user's Firebase ID
   */
  async loadUserContext(userId) {
    if (!this.initialized) {
      this.initialize();
    }

    try {
      const userDoc = await getDoc(doc(this.db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.userContext = {
          userId,
          name: userData.displayName || "User",
          preferences: userData.aiPreferences || {},
          learningProfile: userData.learningProfile || {},
          conversationHistory: userData.aiConversationHistory || [],
        };

        // Ensure conversation history doesn't exceed the maximum length
        if (this.userContext.conversationHistory.length > this.maxContextLength) {
          this.userContext.conversationHistory = this.userContext.conversationHistory.slice(
            -this.maxContextLength,
          );
        }

        return this.userContext;
      } else {
        // Create default context if user document doesn't exist or lacks AI preferences
        this.userContext = {
          userId,
          name: "User",
          preferences: {
            sentenceComplexity: "medium",
            grammarCorrection: true,
            vocabularyLevel: "intermediate",
          },
          learningProfile: {},
          conversationHistory: [],
        };

        // Save default context to Firestore
        await this.saveUserContext();

        return this.userContext;
      }
    } catch (error) {
      console.error("Error loading user context:", error);
      throw new Error(`Failed to load user context: ${error.message}`);
    }
  }

  /**
   * Save the user context back to Firestore
   */
  async saveUserContext() {
    if (!this.userContext.userId) {
      throw new Error("No user ID provided for context saving");
    }

    try {
      await setDoc(
        doc(this.db, "users", this.userContext.userId),
        {
          aiPreferences: this.userContext.preferences,
          aiConversationHistory: this.userContext.conversationHistory,
        },
        { merge: true },
      );
      return true;
    } catch (error) {
      console.error("Error saving user context:", error);
      return false;
    }
  }

  /**
   * Update user preferences for the AI assistant
   * @param {Object} preferences - Updated AI preferences
   */
  async updatePreferences(preferences) {
    this.userContext.preferences = {
      ...this.userContext.preferences,
      ...preferences,
    };
    return this.saveUserContext();
  }

  /**
   * Call the OpenAI API
   * @param {Array} messages - The conversation history in ChatGPT format
   * @returns {Promise<Object>} - The API response
   */
  async callOpenAI(messages) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }

  /**
   * Construct a complex sentence from symbols or simple words
   * @param {Array} symbols - Array of symbols or simple words
   * @param {Object} options - Additional options like target age group, complexity
   * @returns {Promise<Object>} - Enhanced sentence and suggestions
   */
  async constructSentence(symbols, options = {}) {
    if (!symbols || symbols.length === 0) {
      return { sentence: "", suggestions: [] };
    }

    const context = this.prepareUserContext();

    const complexity =
      options.complexity || this.userContext.preferences?.sentenceComplexity || "medium";
    const ageGroup = options.ageGroup || this.userContext.preferences?.ageGroup || "all-ages";

    const messages = [
      {
        role: "system",
        content: `You are an assistant for people using an AAC (Augmentative and Alternative Communication) system. 
        Your task is to help construct meaningful, natural-sounding sentences from symbols or simple words.
        - Create sentences with ${complexity} complexity
        - Target age group: ${ageGroup}
        - Be respectful and supportive
        - Maintain the original meaning intended by the symbols`,
      },
      ...context,
      {
        role: "user",
        content: `Construct a natural-sounding sentence from these symbols/words: ${symbols.join(", ")}`,
      },
    ];

    try {
      const response = await this.callOpenAI(messages);

      // Add this interaction to conversation history
      this.addToConversationHistory("user", symbols.join(", "));
      this.addToConversationHistory("assistant", response.choices[0].message.content);

      // Save updated context
      await this.saveUserContext();

      // Parse the response to extract the main sentence and suggestions
      const result = this.parseConstructionResponse(response.choices[0].message.content);

      return result;
    } catch (error) {
      console.error("Error constructing sentence:", error);
      return {
        sentence: symbols.join(" "),
        suggestions: [],
        error: error.message,
      };
    }
  }

  /**
   * Correct grammar in a sentence
   * @param {string} sentence - The sentence to correct
   * @returns {Promise<Object>} - Corrected sentence with explanations
   */
  async correctGrammar(sentence) {
    if (!sentence) {
      return { corrected: "", explanation: "" };
    }

    const context = this.prepareUserContext();

    const messages = [
      {
        role: "system",
        content: `You are a helpful grammar assistant for AAC users. 
        Correct grammar mistakes while preserving the original meaning. 
        Provide a brief, simple explanation of corrections.`,
      },
      ...context,
      {
        role: "user",
        content: `Correct the grammar in this sentence: "${sentence}"`,
      },
    ];

    try {
      const response = await this.callOpenAI(messages);

      // Add this interaction to conversation history
      this.addToConversationHistory("user", sentence);
      this.addToConversationHistory("assistant", response.choices[0].message.content);

      // Save updated context
      await this.saveUserContext();

      // Parse the response to extract the corrected sentence and explanation
      return this.parseGrammarResponse(response.choices[0].message.content, sentence);
    } catch (error) {
      console.error("Error correcting grammar:", error);
      return {
        corrected: sentence,
        explanation: "",
        error: error.message,
      };
    }
  }

  /**
   * Interpret text from symbols (symbol-to-text)
   * @param {Array} symbols - Array of symbol objects with ids, names
   * @returns {Promise<Object>} - Interpreted text and confidence score
   */
  async interpretFromSymbols(symbols) {
    if (!symbols || symbols.length === 0) {
      return { text: "", confidence: 0 };
    }

    const symbolNames = symbols.map((s) => s.name || s.id || s).join(", ");
    const context = this.prepareUserContext();

    const messages = [
      {
        role: "system",
        content: `You are an expert AAC interpreter. Your role is to interpret 
        the intended meaning from a sequence of communication symbols or simplified words. 
        Provide the most likely interpretation as natural language.`,
      },
      ...context,
      {
        role: "user",
        content: `Interpret these communication symbols into natural language: ${symbolNames}`,
      },
    ];

    try {
      const response = await this.callOpenAI(messages);

      // Add this interaction to conversation history
      this.addToConversationHistory("user", symbolNames);
      this.addToConversationHistory("assistant", response.choices[0].message.content);

      // Save updated context
      await this.saveUserContext();

      return this.parseInterpretationResponse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error interpreting symbols:", error);
      return {
        text: symbolNames.replace(",", " "),
        confidence: 0,
        error: error.message,
      };
    }
  }

  /**
   * Prepare relevant user context for API calls
   * @returns {Array} - Context messages for the API call
   */
  prepareUserContext() {
    const context = [];

    // Add user preferences if available
    if (this.userContext.preferences) {
      context.push({
        role: "system",
        content: `User preferences: ${JSON.stringify(this.userContext.preferences)}`,
      });
    }

    // Add relevant conversation history
    if (this.userContext.conversationHistory && this.userContext.conversationHistory.length > 0) {
      // Take only the last few interactions for context
      const recentHistory = this.userContext.conversationHistory.slice(-4);

      recentHistory.forEach((item) => {
        context.push({
          role: item.role,
          content: item.content,
        });
      });
    }

    return context;
  }

  /**
   * Add a message to conversation history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - The message content
   */
  addToConversationHistory(role, content) {
    if (!this.userContext.conversationHistory) {
      this.userContext.conversationHistory = [];
    }

    this.userContext.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });

    // Keep history within max length
    if (this.userContext.conversationHistory.length > this.maxContextLength) {
      this.userContext.conversationHistory = this.userContext.conversationHistory.slice(
        -this.maxContextLength,
      );
    }
  }

  /**
   * Parse the sentence construction response
   * @param {string} response - The raw response from OpenAI
   * @returns {Object} - Parsed sentence and suggestions
   */
  parseConstructionResponse(response) {
    try {
      // Default parsing - extract first sentence as the main constructed sentence
      let sentence = response.split(/[.!?]\s+/)[0].trim();
      if (sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?")) {
        sentence = sentence;
      } else {
        sentence = sentence + ".";
      }

      // Extract additional suggestions if provided
      const suggestions = [];
      if (response.includes("Alternative:") || response.includes("Alternatives:")) {
        const altPart = response.split(/Alternatives?:/i)[1];
        if (altPart) {
          const altLines = altPart.split(/[\r\n]+|[-•*]/);
          for (const line of altLines) {
            const cleanLine = line.trim();
            if (cleanLine && cleanLine.length > 3) {
              suggestions.push(cleanLine);
            }
          }
        }
      }

      return { sentence, suggestions };
    } catch (error) {
      console.error("Error parsing construction response:", error);
      return { sentence: response, suggestions: [] };
    }
  }

  /**
   * Parse the grammar correction response
   * @param {string} response - The raw response from OpenAI
   * @param {string} original - The original sentence
   * @returns {Object} - Parsed correction and explanation
   */
  parseGrammarResponse(response, original) {
    try {
      let corrected = original;
      let explanation = "";

      // Try to extract corrected sentence (usually in quotes or on its own line)
      if (response.includes('"')) {
        const match = response.match(/"([^"]+)"/);
        if (match && match[1]) {
          corrected = match[1];
        }
      } else {
        // First line might be the correction
        const lines = response.split("\n");
        if (lines.length > 0) {
          corrected = lines[0].trim();
        }
      }

      // The rest is likely the explanation
      if (response.includes("Explanation:")) {
        explanation = response.split("Explanation:")[1].trim();
      } else {
        const parts = response.split(/[\r\n]+/);
        if (parts.length > 1) {
          explanation = parts.slice(1).join(" ").trim();
        }
      }

      return { corrected, explanation };
    } catch (error) {
      console.error("Error parsing grammar response:", error);
      return { corrected: original, explanation: "" };
    }
  }

  /**
   * Parse the symbol interpretation response
   * @param {string} response - The raw response from OpenAI
   * @returns {Object} - Parsed interpretation and confidence
   */
  parseInterpretationResponse(response) {
    try {
      // Default to the full response as the interpretation
      let text = response.trim();
      let confidence = 0.8; // Default confidence

      // Extract confidence if mentioned
      if (response.includes("Confidence:")) {
        const confidencePart = response.split("Confidence:")[1].trim();
        const confidenceMatch = confidencePart.match(/(\d+(\.\d+)?)/);
        if (confidenceMatch && confidenceMatch[1]) {
          confidence = parseFloat(confidenceMatch[1]);
          // Normalize confidence to 0-1 range if it's given as percentage
          if (confidence > 1) {
            confidence = confidence / 100;
          }
        }
      }

      // If response includes "Interpretation:" extract only that part
      if (response.includes("Interpretation:")) {
        text = response.split("Interpretation:")[1].split("\n")[0].trim();
      }

      return { text, confidence };
    } catch (error) {
      console.error("Error parsing interpretation response:", error);
      return { text: response, confidence: 0.5 };
    }
  }
}

export default new AIAssistantService();
