/**
 * @jest-environment jsdom
 */

import * as firebase from "firebase/app";
import * as firestore from "firebase/firestore";
import AIAssistantService from "../../src/services/AIAssistantService";

const { getApp } = firebase;
const { getFirestore, doc, getDoc, setDoc } = firestore;

// Mock Firebase - Jest will automatically use mocks from __mocks__

// Mock fetch for OpenAI API calls
global.fetch = jest.fn();

describe("AIAssistantService", () => {
  const mockUser = { uid: "test-user-123" };
  const mockFirestore = { collection: jest.fn() };
  const mockUserDoc = {
    exists: () => true,
    data: () => ({
      displayName: "Test User",
      aiPreferences: {
        sentenceComplexity: "medium",
        grammarCorrection: true,
      },
      aiConversationHistory: [
        { role: "user", content: "Hello", timestamp: "2023-01-01T12:00:00Z" },
      ],
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Direct assignment instead of mockReturnValue
    firebase.getApp = jest.fn().mockReturnValue({});
    firestore.getFirestore = jest.fn().mockReturnValue(mockFirestore);
    firestore.getDoc = jest.fn().mockResolvedValue(mockUserDoc);
    firestore.setDoc = jest.fn().mockResolvedValue({});

    // Reset service state
    AIAssistantService.initialized = false;
    AIAssistantService.userContext = {};
    AIAssistantService.db = null;
  });

  test("initialize should set up Firebase correctly", () => {
    const result = AIAssistantService.initialize();

    expect(getApp).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
    expect(AIAssistantService.initialized).toBe(true);
    expect(result).toBe(true);
  });

  test("loadUserContext should load user data from Firestore", async () => {
    AIAssistantService.initialize();

    await AIAssistantService.loadUserContext(mockUser.uid);

    expect(doc).toHaveBeenCalledWith(mockFirestore, "users", mockUser.uid);
    expect(getDoc).toHaveBeenCalled();
    expect(AIAssistantService.userContext).toEqual(
      expect.objectContaining({
        userId: mockUser.uid,
        name: "Test User",
        preferences: {
          sentenceComplexity: "medium",
          grammarCorrection: true,
        },
      }),
    );
  });

  test("loadUserContext should create default context if user doc does not exist", async () => {
    AIAssistantService.initialize();

    getDoc.mockResolvedValueOnce({ exists: () => false });

    await AIAssistantService.loadUserContext(mockUser.uid);

    expect(AIAssistantService.userContext).toEqual(
      expect.objectContaining({
        userId: mockUser.uid,
        name: "User",
        preferences: {
          sentenceComplexity: "medium",
          grammarCorrection: true,
          vocabularyLevel: "intermediate",
        },
      }),
    );
    expect(setDoc).toHaveBeenCalled();
  });

  test("saveUserContext should save to Firestore", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: { sentenceComplexity: "simple" },
      conversationHistory: [],
    };

    const result = await AIAssistantService.saveUserContext();

    expect(doc).toHaveBeenCalledWith(mockFirestore, "users", mockUser.uid);
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      {
        aiPreferences: { sentenceComplexity: "simple" },
        aiConversationHistory: [],
      },
      { merge: true },
    );
    expect(result).toBe(true);
  });

  test("updatePreferences should update preferences and save", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: { sentenceComplexity: "simple" },
    };

    jest.spyOn(AIAssistantService, "saveUserContext").mockResolvedValue(true);

    await AIAssistantService.updatePreferences({
      sentenceComplexity: "complex",
      newSetting: true,
    });

    expect(AIAssistantService.userContext.preferences).toEqual({
      sentenceComplexity: "complex",
      newSetting: true,
    });
    expect(AIAssistantService.saveUserContext).toHaveBeenCalled();
  });

  test("constructSentence should call OpenAI API correctly", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: { sentenceComplexity: "simple" },
      conversationHistory: [],
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                "I want to play outside. Alternatives: - I would like to play outdoors. - Can I go outside to play?",
            },
          },
        ],
      }),
    };

    global.fetch.mockResolvedValue(mockResponse);
    jest.spyOn(AIAssistantService, "saveUserContext").mockResolvedValue(true);

    const symbols = ["I", "want", "play", "outside"];
    const result = await AIAssistantService.constructSentence(symbols);

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch.mock.calls[0][0]).toContain("/chat/completions");
    expect(global.fetch.mock.calls[0][1].body).toContain('"model":');
    expect(global.fetch.mock.calls[0][1].headers).toEqual(
      expect.objectContaining({
        "Content-Type": "application/json",
        Authorization: expect.stringContaining("Bearer "),
      }),
    );

    expect(result).toEqual({
      sentence: "I want to play outside.",
      suggestions: expect.arrayContaining([
        expect.stringContaining("I would like to play outdoors"),
        expect.stringContaining("Can I go outside to play"),
      ]),
    });

    expect(AIAssistantService.saveUserContext).toHaveBeenCalled();
  });

  test("correctGrammar should call OpenAI API correctly", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: { grammarCorrection: true },
      conversationHistory: [],
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'Corrected: "I am going to the store." Explanation: Changed "me going" to "I am going" for proper subject pronoun.',
            },
          },
        ],
      }),
    };

    global.fetch.mockResolvedValue(mockResponse);
    jest.spyOn(AIAssistantService, "saveUserContext").mockResolvedValue(true);

    const result = await AIAssistantService.correctGrammar("me going to the store");

    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual({
      corrected: "I am going to the store.",
      explanation: 'Changed "me going" to "I am going" for proper subject pronoun.',
    });

    expect(AIAssistantService.saveUserContext).toHaveBeenCalled();
  });

  test("interpretFromSymbols should call OpenAI API correctly", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: {},
      conversationHistory: [],
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: "Interpretation: I need help please. Confidence: 85%",
            },
          },
        ],
      }),
    };

    global.fetch.mockResolvedValue(mockResponse);
    jest.spyOn(AIAssistantService, "saveUserContext").mockResolvedValue(true);

    const symbols = [
      { id: "sym1", name: "I" },
      { id: "sym10", name: "help" },
      { id: "sym11", name: "please" },
    ];

    const result = await AIAssistantService.interpretFromSymbols(symbols);

    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual({
      text: "I need help please.",
      confidence: 0.85,
    });

    expect(AIAssistantService.saveUserContext).toHaveBeenCalled();
  });

  test("should handle API error gracefully", async () => {
    AIAssistantService.initialize();
    AIAssistantService.userContext = {
      userId: mockUser.uid,
      preferences: {},
      conversationHistory: [],
    };

    const mockErrorResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: { message: "API rate limit exceeded" },
      }),
    };

    global.fetch.mockResolvedValue(mockErrorResponse);

    await expect(AIAssistantService.constructSentence(["hello"])).rejects.toThrow(
      "OpenAI API error: API rate limit exceeded",
    );
  });
});
