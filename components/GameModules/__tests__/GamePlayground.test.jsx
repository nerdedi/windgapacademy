import React from "react";
import { render, screen } from "@testing-library/react";
import GamePlayground from "../GamePlayground";

test("renders GamePlayground", () => {
  render(<GamePlayground />);
  expect(screen.getByText(/Game Playground/i)).toBeInTheDocument();
});
