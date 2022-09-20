import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Menu from "./components/Menu";
import Solo from "./components/Solo";
import Settings from "./components/Settings";
import Multiplayer from "./components/Multiplayer";
import SoloSettings from "./components/Solo settings";

function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [cellsInLine, setCellsInLine] = useState(3);
  const [step, setStep] = useState("x");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route
          path="solo-settings"
          element={
            <SoloSettings
              cellsInLine={cellsInLine}
              setCellsInLine={setCellsInLine}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              setStep={setStep}
              step={step}
            />
          }
        />
        <Route
          path="solo"
          element={
            <Solo
              cellsInLine={cellsInLine}
              gamemode={"solo"}
              step={step}
              difficulty={difficulty}
            />
          }
        />
        <Route path="multiplayer" element={<Multiplayer />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
