import React from "react";
import "./assets/App.css";
import { Calender } from "./components/Calender";
import { events } from "./utils/functions";
function App() {
  return (
    <div className="App" data-testid="app-component">
      <Calender events={events} />
    </div>
  );
}

export default App;
