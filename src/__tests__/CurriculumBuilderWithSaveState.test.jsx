import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import CurriculumBuilderWithSaveState from "../components/curriculum/CurriculumBuilderWithSaveState";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock the Modal component
jest.mock("../components/ui/Modal", () => {
  return ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
        {children}
      </div>
    );
  };
});

describe("CurriculumBuilderWithSaveState", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test("renders the curriculum builder with save/load buttons", () => {
    render(<CurriculumBuilderWithSaveState />);

    // Check that the component renders correctly
    expect(screen.getByText("Curriculum Builder")).toBeInTheDocument();
    expect(screen.getByText("Load")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Generate Module")).toBeInTheDocument();
  });

  test("saves curriculum state to localStorage", async () => {
    const user = userEvent.setup();
    render(<CurriculumBuilderWithSaveState />);

    // Fill out the form
    await user.selectOptions(screen.getByLabelText("Select Subject"), "Science");
    await user.type(screen.getByPlaceholderText("Enter module title"), "Test Module Title");
    await user.type(screen.getByPlaceholderText("Describe the module"), "Test Module Description");

    // Click save button and fill save name
    await user.click(screen.getByText("Save"));
    await user.type(screen.getByPlaceholderText("My Curriculum Plan"), "Test Save");
    await user.click(screen.getByText("Save").closest("button"));

    // Check that localStorage was called with the correct data
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "windgap-curriculum-saves",
      expect.stringContaining("Test Save"),
    );

    // The saved data should include our form values
    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedData[0].name).toBe("Test Save");
    expect(savedData[0].data.selectedSubject).toBe("Science");
    expect(savedData[0].data.moduleTitle).toBe("Test Module Title");
    expect(savedData[0].data.moduleDescription).toBe("Test Module Description");
  });

  test("loads saved curriculum state", async () => {
    const user = userEvent.setup();

    // Setup localStorage with a saved state
    const savedState = [
      {
        id: "123456789",
        name: "Test Save",
        timestamp: new Date().toISOString(),
        data: {
          selectedSubject: "Art",
          moduleTitle: "Loaded Module Title",
          moduleDescription: "Loaded Module Description",
          learningObjectives: "Loaded Objectives",
          assessmentStrategy: "Loaded Strategy",
        },
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    render(<CurriculumBuilderWithSaveState />);

    // Click load button
    await user.click(screen.getByText("Load"));

    // Check the saved item is displayed
    expect(screen.getByText("Test Save")).toBeInTheDocument();

    // Click load on the saved item
    await user.click(screen.getAllByText("Load")[1]); // First one is the main button, second is in the list

    // Check that the form is populated with the loaded data
    expect(screen.getByDisplayValue("Art")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Loaded Module Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Loaded Module Description")).toBeInTheDocument();
  });

  test("deletes saved curriculum state", async () => {
    const user = userEvent.setup();

    // Setup localStorage with a saved state
    const savedState = [
      {
        id: "123456789",
        name: "Test Save",
        timestamp: new Date().toISOString(),
        data: {
          selectedSubject: "Art",
          moduleTitle: "Loaded Module Title",
          moduleDescription: "Loaded Module Description",
        },
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    render(<CurriculumBuilderWithSaveState />);

    // Click load button to see saved states
    await user.click(screen.getByText("Load"));

    // Click delete on the saved item
    await user.click(screen.getByText("Delete"));

    // Confirm deletion
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    await user.click(screen.getByText("Delete").closest("button"));

    // Check that localStorage was updated to remove the item
    expect(localStorageMock.setItem).toHaveBeenCalledWith("windgap-curriculum-saves", "[]");
  });
});
