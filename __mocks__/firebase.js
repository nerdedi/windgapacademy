// Firebase mocks for Jest testing
/* global jest */

const mockAuthUser = {
  uid: "test-uid",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "https://example.com/photo.jpg",
  emailVerified: true,
};

const mockAuth = {
  onAuthStateChanged: jest.fn((callback) => {
    // Call callback with null user to simulate logged out state
    callback(null);
    // Return unsubscribe function
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: mockAuthUser,
    }),
  ),
  signInWithPopup: jest.fn(() =>
    Promise.resolve({
      user: mockAuthUser,
    }),
  ),
  signInWithRedirect: jest.fn(() => Promise.resolve()),
  getRedirectResult: jest.fn(() =>
    Promise.resolve({
      user: mockAuthUser,
    }),
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: mockAuthUser,
    }),
  ),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
  currentUser: null,
};

const mockDocData = {
  id: "test-doc-id",
  name: "Test Document",
  content: "Test content",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockDoc = {
  id: "test-doc-id",
  exists: jest.fn(() => true),
  data: jest.fn(() => mockDocData),
  get: jest.fn((field) => mockDocData[field]),
  ref: {
    path: "collections/test-doc-id",
    parent: {
      path: "collections",
    },
  },
};

const mockDocs = [mockDoc];

const mockQuerySnapshot = {
  docs: mockDocs,
  empty: false,
  size: 1,
  forEach: jest.fn((callback) => mockDocs.forEach(callback)),
  map: jest.fn((callback) => mockDocs.map(callback)),
};

const mockCollectionRef = {
  path: "collections",
  doc: jest.fn(() => mockDocRef),
  where: jest.fn(() => mockCollectionRef),
  orderBy: jest.fn(() => mockCollectionRef),
  limit: jest.fn(() => mockCollectionRef),
  get: jest.fn(() => Promise.resolve(mockQuerySnapshot)),
};

const mockDocRef = {
  id: "test-doc-id",
  path: "collections/test-doc-id",
  collection: jest.fn(() => mockCollectionRef),
  get: jest.fn(() => Promise.resolve(mockDoc)),
  set: jest.fn(() => Promise.resolve()),
  update: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn((callback) => {
    callback(mockDoc);
    return jest.fn(); // Unsubscribe function
  }),
};

const mockFirestore = {
  doc: jest.fn(() => mockDocRef),
  getDoc: jest.fn(() => Promise.resolve(mockDoc)),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  collection: jest.fn(() => mockCollectionRef),
  collectionGroup: jest.fn(() => mockCollectionRef),
  query: jest.fn(() => mockCollectionRef),
  where: jest.fn(() => mockCollectionRef),
  orderBy: jest.fn(() => mockCollectionRef),
  limit: jest.fn(() => mockCollectionRef),
  getDocs: jest.fn(() => Promise.resolve(mockQuerySnapshot)),
  onSnapshot: jest.fn((ref, callback) => {
    callback(mockQuerySnapshot);
    return jest.fn(); // Unsubscribe function
  }),
  runTransaction: jest.fn((callback) => Promise.resolve(callback(mockFirestore))),
  batch: jest.fn(() => ({
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    commit: jest.fn(() => Promise.resolve()),
  })),
  serverTimestamp: jest.fn(() => new Date()),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((date) => ({ toDate: () => date })),
    fromMillis: jest.fn((ms) => ({ toDate: () => new Date(ms) })),
  },
};

// Firebase App Mock
const mockApp = {};
export const initializeApp = jest.fn(() => mockApp);
export const getApp = jest.fn(() => mockApp);
export const deleteApp = jest.fn(() => Promise.resolve());

// Firebase Auth Mocks
export const getAuth = jest.fn(() => mockAuth);
export const onAuthStateChanged = mockAuth.onAuthStateChanged;
export const signInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = mockAuth.createUserWithEmailAndPassword;
export const signOut = mockAuth.signOut;
export const sendPasswordResetEmail = jest.fn(() => Promise.resolve());
export const updateProfile = jest.fn(() => Promise.resolve());
export const updateEmail = jest.fn(() => Promise.resolve());
export const updatePassword = jest.fn(() => Promise.resolve());
export const reauthenticateWithCredential = jest.fn(() => Promise.resolve());
export const EmailAuthProvider = {
  credential: jest.fn(() => ({ type: "email", email: "test@example.com", password: "password" })),
};
export const sendEmailVerification = jest.fn(() => Promise.resolve());
export const signInWithPopup = mockAuth.signInWithPopup;
export const signInWithRedirect = mockAuth.signInWithRedirect;
export const getRedirectResult = mockAuth.getRedirectResult;
export const GoogleAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));
export const OAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));
export const FacebookAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));
export const TwitterAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));
export const GithubAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));
export const PhoneAuthProvider = jest.fn(() => ({ providerId: "phone" }));
export const multiFactor = jest.fn(() => ({
  getSession: jest.fn(() => Promise.resolve({})),
  enroll: jest.fn(() => Promise.resolve({})),
  unenroll: jest.fn(() => Promise.resolve({})),
}));
export const PhoneMultiFactorGenerator = {
  assertion: jest.fn(() => ({})),
};

// Firebase Firestore Mocks
export const getFirestore = jest.fn(() => mockFirestore);
export const doc = mockFirestore.doc;
export const getDoc = mockFirestore.getDoc;
export const setDoc = mockFirestore.setDoc;
export const updateDoc = mockFirestore.updateDoc;
export const deleteDoc = mockFirestore.deleteDoc;
export const collection = mockFirestore.collection;
export const collectionGroup = mockFirestore.collectionGroup;
export const query = mockFirestore.query;
export const where = mockFirestore.where;
export const orderBy = mockFirestore.orderBy;
export const limit = mockFirestore.limit;
export const getDocs = mockFirestore.getDocs;
export const addDoc = jest.fn(() => Promise.resolve(mockDocRef));
export const onSnapshot = mockFirestore.onSnapshot;
export const runTransaction = mockFirestore.runTransaction;
export const writeBatch = jest.fn(() => mockFirestore.batch());
export const serverTimestamp = mockFirestore.serverTimestamp;
export const Timestamp = mockFirestore.Timestamp;

// Export the firebase object for default imports
const firebase = {
  // Firebase App
  app: mockApp,
  initializeApp,
  getApp,
  deleteApp,

  // Auth
  auth: mockAuth,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,

  // Firestore
  firestore: mockFirestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  runTransaction,
  writeBatch,
  serverTimestamp,
  Timestamp,

  // Export for module/default compatibility
  default: {
    initializeApp,
    getApp,
    getAuth,
    getFirestore,
  },
};

// Export default for module imports
export default firebase;
