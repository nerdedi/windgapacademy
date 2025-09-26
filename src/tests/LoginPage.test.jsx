import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import LoginPage from "../components/LoginPage";
import { AuthProvider } from "../context/AuthContext";

// Mock the AuthContext directly to bypass Firebase import issues
jest.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    userData: null,
    loading: false,
    login: jest.fn(() => Promise.resolve()),
    signup: jest.fn(() => Promise.resolve()),
    logout: jest.fn(() => Promise.resolve()),
    updateUserProfile: jest.fn(() => Promise.resolve()),
    resetPassword: jest.fn(() => Promise.resolve()),
  }),
}));

// Also mock firebase/auth for completeness
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: "test-uid" } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: "test-uid" } })),
  signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: "test-uid" } })),
  GoogleAuthProvider: jest.fn(() => ({})),
  FacebookAuthProvider: jest.fn(() => ({})),
  AppleAuthProvider: jest.fn(() => ({})),
  sendEmailVerification: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null); // Initial state is signed out
    return jest.fn(); // Return unsubscribe function
  }),
}));

// Mock firebase firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => ({ exists: () => false, data: () => ({}) })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
}));

// Mock app
jest.mock("../../firebase", () => ({
  app: {},
}));

describe("LoginPage Component", () => {
  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form by default", () => {
    renderLoginPage();
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  test("switches to signup form when clicking signup link", () => {
    renderLoginPage();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));

    expect(screen.getByText("Join Windgap Academy")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    renderLoginPage();
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  test("shows validation error for invalid email", async () => {
    renderLoginPage();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    fireEvent.change(emailInput, {
      target: { value: "invalid-email" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    });
  });

  test("shows validation error for short password", async () => {
    renderLoginPage();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  test("submits login form with valid credentials", async () => {
    const { signInWithEmailAndPassword } = require("firebase/auth");
    renderLoginPage();

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123",
      );
    });
  });
});
