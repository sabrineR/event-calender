import React from "react";
import { foramattedTimePicker } from "../utils/functions";

export const TimePicker = () => {
  return foramattedTimePicker.map((time, index) => (
    <div className="Time-item" key={index} data-testid="time-item">
      {time}
    </div>
  ));
};
