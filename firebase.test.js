// Mock Firebase to avoid requiring real Firebase config during tests
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

// Import functions to test
const { initializeUser, validateUserData, transformLessonPlan } = require("./firebase.js");
const { getDoc, setDoc, doc } = require("firebase/firestore");

describe("Firebase Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initializeUser", () => {
    it("should initialize new user with default learner role", async () => {
      // Mock that user doesn't exist
      getDoc.mockResolvedValue({ 
        exists: () => false 
      });
      setDoc.mockResolvedValue();
      doc.mockReturnValue({});

      const userId = "test-user-123";
      const result = await initializeUser(userId);

      expect(doc).toHaveBeenCalledWith({}, "users", userId);
      expect(setDoc).toHaveBeenCalledWith({}, expect.objectContaining({
        role: "learner",
        createdAt: expect.any(String)
      }));
      expect(result.role).toBe("learner");
    });

    it("should not overwrite existing user", async () => {
      const existingUserData = { role: "educator", name: "Existing User" };
      
      // Mock that user exists
      getDoc.mockResolvedValue({ 
        exists: () => true,
        data: () => existingUserData
      });
      
      const userId = "existing-user-123";
      const result = await initializeUser(userId);

      expect(setDoc).not.toHaveBeenCalled();
      expect(result).toEqual(existingUserData);
    });

    it("should allow overriding default values for new users", async () => {
      // Mock that user doesn't exist
      getDoc.mockResolvedValue({ 
        exists: () => false 
      });
      setDoc.mockResolvedValue();
      doc.mockReturnValue({});

      const userId = "test-user-456";
      const customData = { role: "educator", name: "Test Educator" };
      const result = await initializeUser(userId, customData);

      expect(setDoc).toHaveBeenCalledWith({}, expect.objectContaining({
        role: "educator",
        name: "Test Educator",
        createdAt: expect.any(String)
      }));
      expect(result.role).toBe("educator");
    });
  });

  describe("validateUserData", () => {
    it("should validate user data object", () => {
      expect(validateUserData({ name: "Test User", role: "learner" })).toBe(true);
      expect(validateUserData(null)).toBe(false);
      expect(validateUserData("not an object")).toBe(false);
    });
  });

  describe("transformLessonPlan", () => {
    it("should trim lesson plan string", () => {
      expect(transformLessonPlan("  lesson content  ")).toBe("lesson content");
      expect(transformLessonPlan("lesson")).toBe("lesson");
    });
  });
});