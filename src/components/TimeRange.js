import React from "react";
import { isEventsOverlap, createRows, createColumns } from "../utils/functions";
import { Event } from "./Event";
const TimeRange = ({ events }) => {
  //sort event by ascending order
  const sortEvent = (a, b) => a.start - b.start || b.end - a.end;

  //position is done by params: top, width, left and height
  const eventsPosition = (events) => {
    const rows = createRows(events);
    return Object.keys(rows).map((rowKey) => {
      if (rows.hasOwnProperty(rowKey)) {
        return rows[rowKey]
          .sort(sortEvent)
          .reduce(createColumns, [])
          .map((column, index, columns) => {
            let eventsOverlapInGroup = [];
            if (columns[index + 1] && columns[index + 1].length) {
              eventsOverlapInGroup = columns.filter((col) =>
                isEventsOverlap(col[0], columns[index + 1][0]),
              );
            } else {
              eventsOverlapInGroup = columns.filter((col) =>
                isEventsOverlap(col[0], column[0]),
              );
            }

            //   some columns were a common overlap for two different event groups
            //   Example: events 2, 1, 8, 5
            const isSeperated = eventsOverlapInGroup.length !== columns.length;
            const width = 90;
            let eventWidth = Math.floor(width / columns.length);

            let remainingColumns;
            if (
              rowKey ===
              rows[rowKey][0]?.start + "-" + rows[rowKey][0]?.end
            ) {
              remainingColumns = columns
                .filter((column, index) => index !== 0)
                .flat();
            }
            return column.map((event) => {
              const otherColumns = remainingColumns
                ?.filter((remainingColumn) => remainingColumn !== event)
                .flat();
              // single column without overlap
              // example event: 12
              if (
                columns.length === 1 &&
                (otherColumns === undefined || otherColumns.length === 0)
              ) {
                const eventElement = {
                  ...event,
                  widthRatio: width,
                  left: 10 + "%",
                };
                return <Event event={eventElement} />;
              }
              // first column of row and all other column of the row overlap
              if (
                event === column[0] &&
                otherColumns &&
                otherColumns.length > 2 &&
                otherColumns.every(
                  (otherColumn) => otherColumn.start <= event.end,
                )
              ) {
                // no different event groups
                if (!isSeperated) {
                  const eventElement = {
                    ...event,
                    widthRatio: eventWidth,
                    left: 10 + eventWidth * index + "%",
                  };
                  return <Event event={eventElement} />;
                }
                // column is common to different event groups
                // example event: 2
                eventWidth = Math.floor(width / (columns.length - 1));
                const eventElement = {
                  ...event,
                  widthRatio: eventWidth,
                  left: 10 + eventWidth * index + "%",
                };
                return <Event event={eventElement} />;
              }
              // other columns in event row
              if (
                otherColumns &&
                otherColumns.length &&
                otherColumns.every(
                  (otherColumn) => otherColumn.end <= event.start,
                )
              ) {
                // example event: 3
                if (!isSeperated) {
                  const eventElement = {
                    ...event,
                    widthRatio: width - eventWidth,
                    left: 10 + eventWidth + "%",
                  };
                  return <Event event={eventElement} />;
                }
                // overlap with a common event. so width is adjusted accordingly
                // example event: 5
                eventWidth = Math.floor(width / (columns.length - 1));
                const eventElement = {
                  ...event,
                  widthRatio: width - eventWidth,
                  left: 10 + eventWidth + "%",
                };
                return <Event event={eventElement} />;
              }
              // one or more overlapping event in same event group
              // example event: 13, 4
              if (!isSeperated) {
                const eventElement = {
                  ...event,
                  widthRatio: eventWidth,
                  left: 10 + eventWidth * index + "%",
                };
                return <Event event={eventElement} />;
              }
              // one or more overlapping event with a common overlapping event with another group
              // example event: 1, 8
              eventWidth = Math.floor(width / (columns.length - 1));
              const eventElement = {
                ...event,
                widthRatio: eventWidth,
                left: 10 + eventWidth * index + "%",
              };
              return <Event event={eventElement} />;
            });
          });
      }

      return [];
    });
  };

  // events were rendered as elements using eventsPosition
  const renderedEvents = eventsPosition(events);
  return <>{renderedEvents}</>;
};

export default TimeRange;
