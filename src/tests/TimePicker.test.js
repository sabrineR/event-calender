import React from "react";
import { render } from "@testing-library/react";
import { TimePicker } from "./TimePicker";
import { formattedTimePicker } from "../utils/functions";

describe("TimePicker Component", () => {
  it("renders correctly", () => {
    const { getAllByTestId } = render(<TimePicker />);
    const timeItems = getAllByTestId("time-item");
    expect(timeItems).toHaveLength(formattedTimePicker.length);
  });

  it("renders each time item correctly", () => {
    const { getAllByTestId } = render(<TimePicker />);
    const timeItems = getAllByTestId("time-item");
    timeItems.forEach((timeItem, index) => {
      expect(timeItem.textContent).toEqual(formattedTimePicker[index]);
    });
  });
});
