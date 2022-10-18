import styles from "./Settings.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const SoloSettings = ({
  langJson={},
  theme,
  setCellsInLine,
  cellsInLine,
  setDifficulty,
  difficulty,
  setStep,
  step,
}) => {
  const [difficultyName, setDifficultyName] = useState(langJson["medium"]);
  const [difficultyColor, setDifficultyColor] = useState("");

  useEffect(() => {
    switch (difficulty) {
      case 1:
        setDifficultyName(langJson["easy"]);
        setDifficultyColor("#338928");
        break;
      case 2:
        setDifficultyName(langJson["medium"]);
        setDifficultyColor("#3167d2");
        break;
      case 3:
        setDifficultyName(langJson["hard"]);
        setDifficultyColor("#b53f34");
        break;
      case 4:
        setDifficultyName(langJson["impossible"]);
        setDifficultyColor("#973fa3");
        break;
      default:
        break;
    }
  }, [difficulty, langJson]);

  const onClickPlus = () => {
    if (cellsInLine < 6) {
      setCellsInLine(cellsInLine + 1);
    }
  };

  const onClickMinus = () => {
    if (cellsInLine > 3) {
      setCellsInLine(cellsInLine - 1);
    }
  };

  const onDifficultyPlus = () => {
    if (difficulty < 4) {
      setDifficulty(difficulty + 1);
    }
  };

  const onDifficultyMinus = () => {
    if (difficulty > 1) {
      setDifficulty(difficulty - 1);
    }
  };

  return (
    <div className={(theme==="white" ? styles.settingsWhite : "") + " " + styles.settings + " show"}>
      <Link to="/">
        <div className="back">
          <div className="arrow"></div>
        </div>
      </Link>
      <h1 className="title">{langJson["title"]}</h1>
      <div className={styles.property}>
        <div className={styles.text}>{langJson["difficulty"]}:</div>
        <div
          onClick={onDifficultyMinus}
          className={(theme==="white" ? styles.difficultyChangeWhite : "") + ' ' + styles.difficultyMinus}
          style={{ opacity: difficulty < 2 && "0.35" }}
        ></div>
        <div
          style={{ backgroundColor: difficultyColor }}
          className={styles.value + " " + styles.difficultyName}
        >
          {difficultyName}
        </div>
        <div
          onClick={onDifficultyPlus}
          className={(theme==="white" ? styles.difficultyChangeWhite : "") + ' ' + styles.difficultyPlus}
          style={{ opacity: difficulty > 3 && "0.35" }}
        ></div>
      </div>
      <div className={styles.property}>
        <div className={styles.text}>{langJson["fieldWidth"]}:</div>
        <div
          onClick={onClickMinus}
          className={styles.cellsMinus}
          style={{ opacity: cellsInLine < 4 && "0.3" }}
        >
          -
        </div>
        <div className={styles.value + " " + styles.cellsInLine}>
          {cellsInLine}
        </div>
        <div
          onClick={onClickPlus}
          className={styles.cellsPlus}
          style={{ opacity: cellsInLine > 5 && "0.3" }}
        >
          +
        </div>
      </div>
      <div className={styles.property}>
        <div className={styles.text}>{langJson["character"]}:</div>
        <div className={styles.value + " " + styles.character}>
          <div
            onClick={() => {
              setStep("x");
            }}
            className={styles.cell_x}
            style={{ opacity: step !== "x" && "0.35" }}
          >
            <div className={styles.cellLine + " " + styles.cellLineFirst}></div>
            <div
              className={styles.cellLine + " " + styles.cellLineSecond}
            ></div>
          </div>
          <div className={styles.slash}> / </div>
          <div
            onClick={() => {
              setStep("o");
            }}
            className={styles.cell_o}
            style={{ opacity: step !== "o" && "0.35" }}
          >
            <div className={styles.circle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoloSettings;
