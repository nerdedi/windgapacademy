// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SensoryChecklist from "../components/SensoryChecklist";

describe("SensoryChecklist", () => {
  it("renders all checklist items", () => {
    render(<SensoryChecklist />);
    expect(screen.getByText(/Sensory Preferences Checklist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reduced screen brightness/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sensitive to animations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/control or mute audio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/background sounds/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/less cluttered interface/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheduled breaks/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/distraction-free/i)).toBeInTheDocument();
  });

  it("submits selected values", () => {
    const handleSubmit = jest.fn();
    render(<SensoryChecklist onSubmit={handleSubmit} />);
    fireEvent.click(screen.getByLabelText(/reduced screen brightness/i));
    fireEvent.click(screen.getByLabelText(/sensitive to animations/i));
    fireEvent.click(screen.getByText(/Submit/i));
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        reduceBrightness: true,
        reduceMotion: true,
      }),
    );
    expect(screen.getByText(/Thank you for submitting/i)).toBeInTheDocument();
  });

  it("renders in readOnly mode", () => {
    render(<SensoryChecklist readOnly initialValues={{ reduceBrightness: true }} />);
    expect(screen.getByLabelText(/reduced screen brightness/i)).toBeChecked();
    expect(screen.getByText(/Sensory Preferences Checklist/i)).toBeInTheDocument();
    expect(screen.queryByText(/Submit/i)).not.toBeInTheDocument();
  });
});
