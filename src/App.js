import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Menu from "./components/Menu";
import Solo from "./components/Game/Solo";
import Settings from "./components/Settings/Settings";
import SoloSettings from "./components/Settings/SoloSettings";
import Multiplayer from "./components/Game/Multiplayer";
import Loading from "./components/Game/Loading";

function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [cellsInLine, setCellsInLine] = useState(3);
  const [step, setStep] = useState("x");
  const [nickname, setNickname] = useState("Guest");
  const [soundOn, setSoundOn] = useState(true);
  const [language, setLanguage] = useState("English");
  const [languageId, setLanguageId] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [langJson, setLangJson] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (language === "English") {
      setLanguageId("en");
    } else if (language === "Русский") {
      setLanguageId("ru");
    } else if (language === "Українська") {
      setLanguageId("ua");
    }
  }, [language]);

  useEffect(() => {
    axios.get(`lang/${languageId}.json`).then((res) => {
      setLangJson(res.data);
      setIsLoading(false);
    });
  }, [languageId]);

  return (
    <div className={`App ${theme === "white" ? "App-white" : "App-dark"}`}>
      {isLoading && (
        <Loading
          theme={theme}
          loadingJson={langJson["loading"]}
          gamemode={null}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Menu
              profileJson={langJson.profile}
              langJson={langJson.menu}
              theme={theme}
              setNickname={setNickname}
              nickname={nickname}
            />
          }
        />
        <Route
          path="solo-settings"
          element={
            <SoloSettings
              langJson={langJson.soloSettings}
              theme={theme}
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
              soundOn={soundOn}
              modalLangJson={langJson.modal}
              theme={theme}
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
          element={
            <Multiplayer
              soundOn={soundOn}
              loadingJson={langJson.loading}
              chatJson={langJson.chat}
              modalLangJson={langJson.modal}
              theme={theme}
              myName={nickname}
              gamemode="multiplayer"
            />
          }
        />
        <Route
          path="settings"
          element={
            <Settings
              langJson={langJson.settings}
              setLanguage={setLanguage}
              language={language}
              setTheme={setTheme}
              theme={theme}
              soundOn={soundOn}
              setSoundOn={setSoundOn}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
