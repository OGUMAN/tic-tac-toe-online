import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Settings.module.scss";

const Settings = ({
  langJson={},
  language,
  setLanguage,
  soundOn,
  setSoundOn,
  theme,
  setTheme,
}) => {
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const langOnClick = (lang) => {
    setLanguage(lang);
    setLanguagesOpen(false);
  };

  return (
    <div className="show">
      <div
        className={
          styles.settings +
          " " +
          (theme === "white" ? styles.settingsWhite : "")
        }
      >
        <Link to="/">
          <div className="back">
            <div className="arrow"></div>
          </div>
        </Link>
        {languagesOpen && (
          <div className="wrapper show">
            <div className={styles.languageModal}>
              <div
                onClick={() => {
                  setLanguagesOpen(false);
                }}
                className="back"
              >
                <div className="arrow"></div>
              </div>
              <div className="title">{langJson["choseLanguage"]}</div>
              <div
                onClick={() => {
                  langOnClick("English");
                }}
                className={styles.langOption}
              >
                English
              </div>
              <div
                onClick={() => {
                  langOnClick("Українська");
                }}
                className={styles.langOption}
              >
                Українська
              </div>
              <div
                onClick={() => {
                  langOnClick("Русский");
                }}
                className={styles.langOption}
              >
                Русский
              </div>
            </div>
          </div>
        )}
        <h1 className="title">
          {langJson["title"]}
        </h1>
        <div className={styles.property}>
          <div className={styles.text}>{langJson["sound"]}:</div>
          <div
            onClick={() => {
              setSoundOn(!soundOn);
            }}
            className={styles.value + " " + styles.sound}
          >
            <img
              height={25}
              width={25}
              src={`img/sound-${soundOn ? "on" : "off"}.svg`}
              alt={`Sound ${soundOn ? "on" : "off"}`}
            />
          </div>
        </div>
        <div className={styles.property}>
          <div className={styles.text}>{langJson["language"]}:</div>
          <div
            onClick={() => {
              setLanguagesOpen(true);
            }}
            className={styles.value + " " + styles.language}
          >
            {language}
          </div>
        </div>
        <div className={styles.property}>
          <div className={styles.text}>{langJson["theme"]}:</div>
          <div
            style={{
              backgroundColor: theme === "dark" ? "#373737" : "#4b73c3",
            }}
            className={styles.value + " " + styles.theme}
          >
            <img
              onClick={() => {
                setTheme("dark");
              }}
              style={{ opacity: theme === "white" && "0.3" }}
              height={25}
              width={25}
              src="img/moon.svg"
              alt="moon"
            />
            <img
              onClick={() => {
                setTheme("white");
              }}
              style={{ opacity: theme === "dark" && "0.3" }}
              height={25}
              width={25}
              src="img/sun.svg"
              alt="sun"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
