// Firebase mocks for Jest testing
/* global jest */

const mockAuth = {
  onAuthStateChanged: jest.fn((callback) => {
    // Call callback with null user to simulate logged out state
    callback(null);
    // Return unsubscribe function
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: { uid: "test-uid", email: "test@example.com" },
    }),
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: { uid: "test-uid", email: "test@example.com" },
    }),
  ),
  signOut: jest.fn(() => Promise.resolve()),
  currentUser: null,
};

const mockDoc = {
  exists: () => false,
  data: () => ({}),
};

const mockFirestore = {
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve(mockDoc)),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [],
      forEach: jest.fn(),
    }),
  ),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
};

// Firebase App Mock
export const initializeApp = jest.fn(() => ({}));

// Firebase Auth Mocks
export const getAuth = jest.fn(() => mockAuth);
export const onAuthStateChanged = mockAuth.onAuthStateChanged;
export const signInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = mockAuth.createUserWithEmailAndPassword;
export const signOut = mockAuth.signOut;
export const sendPasswordResetEmail = jest.fn();
export const updateProfile = jest.fn();
export const updateEmail = jest.fn();
export const updatePassword = jest.fn();
export const reauthenticateWithCredential = jest.fn();
export const EmailAuthProvider = {
  credential: jest.fn(),
};
export const sendEmailVerification = jest.fn();
export const signInWithPopup = jest.fn();
export const GoogleAuthProvider = jest.fn();
export const FacebookAuthProvider = jest.fn();
export const PhoneAuthProvider = jest.fn();
export const multiFactor = jest.fn();
export const PhoneMultiFactorGenerator = jest.fn();

// Firebase Firestore Mocks
export const getFirestore = jest.fn(() => mockFirestore);
export const doc = jest.fn();
export const getDoc = jest.fn(() => Promise.resolve(mockDoc));
export const setDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const getDocs = jest.fn(() =>
  Promise.resolve({
    docs: [],
    forEach: jest.fn(),
  }),
);
export const onSnapshot = jest.fn();
export const serverTimestamp = jest.fn(() => new Date());
