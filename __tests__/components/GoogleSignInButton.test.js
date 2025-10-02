/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GoogleSignInButton from "../../src/components/auth/GoogleSignInButton";
import * as googleAuth from "../../src/utils/googleAuth";
import { useAuth } from "../../src/contexts/AuthContext";

// Mock the googleAuth module
jest.mock("../../src/utils/googleAuth", () => ({
  initializeGoogleAuth: jest.fn(),
  signInWithGoogle: jest.fn(),
}));

// Mock the AuthContext
jest.mock("../../src/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("GoogleSignInButton", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useAuth hook
    useAuth.mockReturnValue({
      setUser: jest.fn(),
    });
  });

  it("should render correctly", () => {
    render(<GoogleSignInButton />);

    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should initialize Google Sign In on mount", () => {
    render(<GoogleSignInButton />);

    expect(googleAuth.initializeGoogleAuth).toHaveBeenCalled();
  });

  it("should apply custom className if provided", () => {
    render(<GoogleSignInButton className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should handle sign in when button is clicked", async () => {
    const mockUser = {
      user: {
        name: "Test User",
        email: "test@example.com",
      },
      token: "test-token",
    };

    googleAuth.signInWithGoogle.mockResolvedValue(mockUser);

    const mockOnSuccess = jest.fn();

    render(<GoogleSignInButton onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByRole("button"));

    // Wait for the promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(googleAuth.signInWithGoogle).toHaveBeenCalled();
    expect(useAuth().setUser).toHaveBeenCalledWith({
      id: "test@example.com",
      name: "Test User",
      email: "test@example.com",
      provider: "google",
      photoURL: "",
      authToken: "test-token",
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle error when sign in fails", async () => {
    const mockError = new Error("Sign in failed");
    googleAuth.signInWithGoogle.mockRejectedValue(mockError);

    const mockOnError = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<GoogleSignInButton onError={mockOnError} />);

    fireEvent.click(screen.getByRole("button"));

    // Wait for the promise to reject
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(googleAuth.signInWithGoogle).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Google Sign In failed:", mockError);
    expect(mockOnError).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
