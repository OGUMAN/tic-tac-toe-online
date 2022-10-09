import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Solo from "./components/Game/Solo";
import Settings from "./components/Game/Solo";
import Multiplayer from "./components/Game/Multiplayer";
import SoloSettings from "./components/Solo settings";

function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [cellsInLine, setCellsInLine] = useState(3);
  const [step, setStep] = useState("x");
  const [nickname, setNickname] = useState("Guest");

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Menu setNickname={setNickname} nickname={nickname} />}
        />
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
              myName={nickname}
            />
          }
        />
        <Route
          path="multiplayer"
          element={<Multiplayer myName={nickname} gamemode={"multiplayer"} />}
        />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
