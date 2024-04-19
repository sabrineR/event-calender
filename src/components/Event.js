import React from "react";

export const Event = ({ event }) => {
  // Event positioning
  const boxStyle = ({ start, end, left, widthRatio }) => ({
    height: `${end - start}px`,
    top: `${50 + start}px`,
    left,
    width: `${widthRatio}%`,
  });

  return (
    <div className="Event-box" style={boxStyle(event)} key={event.title}>
      <div
        className="Event-item"
        style={{ top: event.end - event.start > 30 ? 10 : 0 }}>
        {event.title}
      </div>
    </div>
  );
};
