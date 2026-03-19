import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Tic-Tac-Toe title and New Game button", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /tic-tac-toe/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument();
});
