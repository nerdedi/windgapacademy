/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AppleSignInButton from "../../src/components/auth/AppleSignInButton";
import { useAuth } from "../../src/contexts/AuthContext";
import * as appleAuth from "../../src/utils/appleAuth";

// Mock the appleAuth module
jest.mock("../../src/utils/appleAuth", () => ({
  initializeAppleAuth: jest.fn(),
  signInWithApple: jest.fn(),
}));

// Mock the AuthContext
jest.mock("../../src/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("AppleSignInButton", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useAuth hook
    useAuth.mockReturnValue({
      setUser: jest.fn(),
    });
  });

  it("should render correctly", () => {
    render(<AppleSignInButton />);

    expect(screen.getByText("Sign in with Apple")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should initialize Apple Sign In on mount", () => {
    render(<AppleSignInButton />);

    expect(appleAuth.initializeAppleAuth).toHaveBeenCalled();
  });

  it("should apply custom className if provided", () => {
    render(<AppleSignInButton className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should handle sign in when button is clicked", async () => {
    const mockUser = {
      user: {
        name: {
          firstName: "John",
          lastName: "Doe",
        },
        email: "john.doe@example.com",
      },
      token: "test-token",
    };

    appleAuth.signInWithApple.mockResolvedValue(mockUser);

    const mockOnSuccess = jest.fn();

    render(<AppleSignInButton onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByRole("button"));

    // Wait for the promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(appleAuth.signInWithApple).toHaveBeenCalled();
    expect(useAuth().setUser).toHaveBeenCalledWith({
      id: "john.doe@example.com",
      name: "John Doe",
      email: "john.doe@example.com",
      provider: "apple",
      photoURL: "",
      authToken: "test-token",
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle error when sign in fails", async () => {
    const mockError = new Error("Sign in failed");
    appleAuth.signInWithApple.mockRejectedValue(mockError);

    const mockOnError = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<AppleSignInButton onError={mockOnError} />);

    fireEvent.click(screen.getByRole("button"));

    // Wait for the promise to reject
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(appleAuth.signInWithApple).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Apple Sign In failed:", mockError);
    expect(mockOnError).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
