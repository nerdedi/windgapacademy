import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import CurriculumBuilderWithSaveState from "../components/CurriculumBuilderWithSaveState";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("CurriculumBuilderWithSaveState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<CurriculumBuilderWithSaveState />);
    expect(screen.getByText("Curriculum Builder")).toBeInTheDocument();
  });

  test("saves curriculum state", async () => {
    const user = userEvent.setup();
    
    // Initial render with empty localStorage
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<CurriculumBuilderWithSaveState />);
    
    // Fill out the form
    await user.type(screen.getByLabelText("Module Title"), "Test Module");
    await user.type(
      screen.getByLabelText("Module Description"),
      "Test Description"
    );
    
    // Select a subject
    await user.selectOptions(screen.getByLabelText("Subject"), "Math");
    
    // Click save button
    await user.click(screen.getByText("Save"));
    
    // Enter save name in modal
    await user.type(screen.getByLabelText("Save Name"), "Test Save");
    
    // Click save in modal
    await user.click(screen.getByText("Save").closest("button"));
    
    // Check that localStorage was updated with the correct data
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedData[0].name).toBe("Test Save");
    expect(savedData[0].data.moduleTitle).toBe("Test Module");
    expect(savedData[0].data.moduleDescription).toBe("Test Description");
    expect(savedData[0].data.selectedSubject).toBe("Math");
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
        },
      },
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    
    await act(async () => {
      render(<CurriculumBuilderWithSaveState />);
    });
    
    // Click load button
    await user.click(screen.getByText("Load"));
    
    // Click load on the saved item
    await user.click(screen.getAllByText("Load")[1]); // First one is the main button, second is in the list
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
