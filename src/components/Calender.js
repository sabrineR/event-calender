import React from "react";
import "../assets/Calender.css";
import { TimePicker } from "./TimePicker";
import TimeRange from "./TimeRange";

export const Calender = ({ events }) => {
  return (
    <div className="Calendar">
      <TimePicker />
      <TimeRange events={events} />
    </div>
  );
};
