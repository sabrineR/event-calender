import moment from "moment";
import data from "./input.json";

const formatTime = (date) => date.format("h:mm A");

// Create a table of moments for each hour from 9 a.m. to 9 p.m.
const timeRange = Array.from({ length: 13 }, (_, i) => moment({ hour: i + 9 }));

// Format each moment and concatenate with an empty string
const foramattedTimePicker = timeRange.flatMap((time) => [
  formatTime(time),
  "",
]);

//Format events
const events = data.map((event) => {
  const { id, start, duration } = event;
  const [startHour, startMinute] = start.split(":");
  //Convert start time to pixels assuming start time is 9:00 AM
  const startTimeInPixels = (startHour - 9) * 100 + (startMinute / 60) * 100;
  //Calculate the end time in pixels based on the duration of the event
  const endTimeInPixels = startTimeInPixels + (duration / 60) * 100;
  return {
    title: id,
    start: Math.floor(startTimeInPixels),
    end: Math.floor(endTimeInPixels),
  };
});

// check events overlap occurance
const isEventsOverlap = (row, event) => {
  const partialOverlap =
    (event.start > row.start && event.start < row.end) ||
    (event.end > row.start && event.start < row.end);

  const fullOverlap =
    (event.start >= row.start && event.end <= row.end) ||
    (event.start < row.start && event.end > row.end);

  return partialOverlap || fullOverlap;
};

//Create rows for the given events
const createRows = (events) => {
  return events.reduce((rows, event) => {
    const conflictingRows = Object.keys(rows).filter((rowKey) => {
      const row = keyToEvent(rowKey);
      return isEventsOverlap(row, event);
    });

    const conflictingEvents = conflictingRows.flatMap((rowKey) => rows[rowKey]);

    const mergedRowKey = conflictingRows.reduce(mergeRowKey, event);
    const mergedEvents = [...conflictingEvents, event];

    const newRows = Object.keys(rows).reduce((newRows, rowKey) => {
      if (!conflictingRows.includes(rowKey)) {
        newRows[rowKey] = rows[rowKey];
      }
      return newRows;
    }, {});

    newRows[eventToKey(mergedRowKey)] = mergedEvents;

    return newRows;
  }, {});

  function mergeRowKey(mergedRow, rowKey) {
    const row = keyToEvent(rowKey);
    return {
      start: Math.min(mergedRow.start, row.start),
      end: Math.max(mergedRow.end, row.end),
    };
  }

  function eventToKey(event) {
    return `${event.start}-${event.end}`;
  }

  function keyToEvent(key) {
    const [start, end] = key.split("-").map((x) => parseInt(x, 10));
    return { start, end };
  }

  function isEventsOverlap(row, event) {
    return (
      (event.start >= row.start && event.start < row.end) ||
      (event.end > row.start && event.end <= row.end) ||
      (event.start <= row.start && event.end >= row.end)
    );
  }
};
//for given the rows to create columns of events
const createColumns = (columns, nextEvent) => {
  const column = findExistingColumn();

  return column ? addToExistingColumn() : addANewColumn();

  function addToExistingColumn() {
    const appendedColumn = [...column, nextEvent];

    return [
      ...columns.slice(0, columns.indexOf(column)),
      appendedColumn,
      ...columns.slice(columns.indexOf(column) + 1),
    ];
  }

  function addANewColumn() {
    return [...columns, [nextEvent]];
  }

  function findExistingColumn() {
    return columns.find((column) =>
      column.every((event) => event.end < nextEvent?.start),
    );
  }
};

export {
  foramattedTimePicker,
  events,
  isEventsOverlap,
  createRows,
  createColumns,
};
