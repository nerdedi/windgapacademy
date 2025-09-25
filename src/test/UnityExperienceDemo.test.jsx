import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import UnityExperienceDemo from "../components/UnityExperienceDemo";
import { useAuth } from "../context/AuthContext";
import { getProgressData, saveProgressData } from "../utils/ProgressService";

// Mock the dependencies
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../utils/ProgressService", () => ({
  getProgressData: jest.fn(),
  saveProgressData: jest.fn(),
}));

// Mock the OptimizedUnityPlayer component
jest.mock("../components/OptimizedUnityPlayer", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ onLoaded, onError, onUnityMessage }) => {
      // Store the callbacks for test access
      global.unityCallbacks = {
        onLoaded,
        onError,
        onUnityMessage,
      };

      return (
        <div data-testid="unity-player">
          <button data-testid="simulate-loaded" onClick={() => onLoaded({ name: "UnityInstance" })}>
            Simulate Unity Loaded
          </button>
          <button data-testid="simulate-error" onClick={() => onError(new Error("Test error"))}>
            Simulate Unity Error
          </button>
          <button
            data-testid="simulate-progress"
            onClick={() => onUnityMessage("ProgressUpdate", { progress: 0.5 })}
          >
            Simulate Progress Update
          </button>
          <button
            data-testid="simulate-completion"
            onClick={() => onUnityMessage("ExperienceCompleted", { score: 100 })}
          >
            Simulate Experience Completed
          </button>
          <button
            data-testid="simulate-achievement"
            onClick={() =>
              onUnityMessage("AchievementUnlocked", {
                id: "test-achievement",
                title: "Test Achievement",
                description: "Test description",
              })
            }
          >
            Simulate Achievement
          </button>
        </div>
      );
    }),
  };
});

// Mock UI components
jest.mock("../components/ui/LoadingSpinner", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="loading-spinner">Loading...</div>,
  };
});

jest.mock("../components/ui/ErrorAlert", () => {
  return {
    __esModule: true,
    default: ({ message }) => <div data-testid="error-alert">{message}</div>,
  };
});

describe("UnityExperienceDemo Component", () => {
  // Default props for tests
  const defaultProps = {
    experienceId: "test-experience",
    lessonId: "test-lesson",
    title: "Test Experience",
    description: "Test Description",
    buildUrl: "/test/build/url",
  };

  // Mock user
  const mockUser = {
    uid: "test-user-123",
    displayName: "Test User",
    email: "test@example.com",
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ currentUser: mockUser });
    getProgressData.mockResolvedValue(null); // No previous progress by default
  });

  it("renders correctly with loading state", () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Test Experience")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("loads previous progress data when available", async () => {
    const mockProgress = {
      progress: 0.7,
      achievements: [
        { id: "achievement1", title: "First Achievement", description: "You did it!" },
      ],
      lastActivity: {
        type: "quiz_completed",
        timestamp: new Date().toISOString(),
      },
    };

    getProgressData.mockResolvedValue(mockProgress);

    render(<UnityExperienceDemo {...defaultProps} />);

    await waitFor(() => {
      expect(getProgressData).toHaveBeenCalledWith(
        mockUser.uid,
        defaultProps.experienceId,
        defaultProps.lessonId,
      );
      expect(screen.getByText("70% Complete")).toBeInTheDocument();
      expect(screen.getByText("First Achievement")).toBeInTheDocument();
    });
  });

  it("handles Unity loading correctly", async () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate Unity loaded event
    fireEvent.click(screen.getByTestId("simulate-loaded"));

    await waitFor(() => {
      // Loading spinner should be gone
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("handles Unity error correctly", async () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate Unity error event
    fireEvent.click(screen.getByTestId("simulate-error"));

    await waitFor(() => {
      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
      expect(screen.getByText("Failed to load Unity experience: Test error")).toBeInTheDocument();
    });
  });

  it("handles progress updates from Unity", async () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate Unity progress update
    fireEvent.click(screen.getByTestId("simulate-progress"));

    await waitFor(() => {
      expect(screen.getByText("50% Complete")).toBeInTheDocument();
      expect(saveProgressData).toHaveBeenCalledWith(
        mockUser.uid,
        defaultProps.experienceId,
        defaultProps.lessonId,
        expect.objectContaining({
          progress: 0.5,
        }),
      );
    });
  });

  it("handles experience completion from Unity", async () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate experience completion
    fireEvent.click(screen.getByTestId("simulate-completion"));

    await waitFor(() => {
      expect(screen.getByText("Experience Completed!")).toBeInTheDocument();
      expect(screen.getByText("100% Complete")).toBeInTheDocument();
      expect(saveProgressData).toHaveBeenCalledWith(
        mockUser.uid,
        defaultProps.experienceId,
        defaultProps.lessonId,
        expect.objectContaining({
          progress: 1,
          completed: true,
          score: 100,
        }),
        expect.anything(),
      );
    });
  });

  it("handles achievements from Unity", async () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate achievement unlocked
    fireEvent.click(screen.getByTestId("simulate-achievement"));

    await waitFor(() => {
      expect(screen.getByText("Test Achievement")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(saveProgressData).toHaveBeenCalledWith(
        mockUser.uid,
        defaultProps.experienceId,
        defaultProps.lessonId,
        expect.objectContaining({
          achievements: expect.arrayContaining([
            expect.objectContaining({
              id: "test-achievement",
              title: "Test Achievement",
            }),
          ]),
        }),
        true,
      );
    });
  });

  it("handles fullscreen toggle correctly", () => {
    render(<UnityExperienceDemo {...defaultProps} />);

    const fullscreenButton = screen.getByLabelText("Enter fullscreen");
    const container = document.querySelector(".unity-experience-demo");

    // Initially not fullscreen
    expect(container).not.toHaveClass("fullscreen");

    // Toggle fullscreen on
    fireEvent.click(fullscreenButton);
    expect(container).toHaveClass("fullscreen");

    // Toggle fullscreen off
    fireEvent.click(fullscreenButton);
    expect(container).not.toHaveClass("fullscreen");
  });

  it("does not load progress or send messages when user is not authenticated", async () => {
    useAuth.mockReturnValue({ currentUser: null });

    render(<UnityExperienceDemo {...defaultProps} />);

    // Simulate Unity loaded
    fireEvent.click(screen.getByTestId("simulate-loaded"));

    await waitFor(() => {
      expect(getProgressData).not.toHaveBeenCalled();
    });
  });
});
