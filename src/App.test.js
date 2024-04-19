import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders the App component correctly", () => {
    const { getByTestId } = render(<App />);
    const appComponent = getByTestId("app-component");
    expect(appComponent).toBeInTheDocument();
  });
});
