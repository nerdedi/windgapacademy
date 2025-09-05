// Test Firebase user initialization function

// Mock Firebase modules before importing anything that uses them
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn(() => ({})),
  addDoc: jest.fn(() => Promise.resolve()),
}));

// Now import the functions we want to test
import { initializeNewUser, validateUserData, transformLessonPlan } from './firebase.js';

describe('Firebase functions', () => {
  describe('validateUserData', () => {
    test('should validate user data correctly', () => {
      expect(validateUserData({ name: 'Test User', role: 'learner' })).toBe(true);
      expect(validateUserData(null)).toBe(false);
      expect(validateUserData('not an object')).toBe(false);
    });
  });

  describe('transformLessonPlan', () => {
    test('should trim lesson plan string', () => {
      expect(transformLessonPlan('  test plan  ')).toBe('test plan');
      expect(transformLessonPlan('no spaces')).toBe('no spaces');
    });
  });

  describe('initializeNewUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should set default role to learner for new users', async () => {
      // Mock Firebase functions for this test
      const { getDoc, setDoc } = require('firebase/firestore');
      getDoc.mockResolvedValueOnce({ exists: () => false });
      setDoc.mockResolvedValueOnce();

      const userData = await initializeNewUser('test-user-id');
      
      expect(userData.role).toBe('learner');
      expect(userData.createdAt).toBeDefined();
      expect(setDoc).toHaveBeenCalled();
    });

    test('should allow role override in user data', async () => {
      const { getDoc, setDoc } = require('firebase/firestore');
      getDoc.mockResolvedValueOnce({ exists: () => false });
      setDoc.mockResolvedValueOnce();

      const userData = await initializeNewUser('test-user-id', { role: 'educator' });
      
      expect(userData.role).toBe('educator');
    });

    test('should not overwrite existing user', async () => {
      const { getDoc, setDoc } = require('firebase/firestore');
      const existingData = { role: 'educator', createdAt: '2025-01-01' };
      getDoc.mockResolvedValueOnce({ 
        exists: () => true, 
        data: () => existingData 
      });

      const userData = await initializeNewUser('existing-user-id');
      
      expect(userData).toBe(existingData);
      expect(setDoc).not.toHaveBeenCalled();
    });
  });
});