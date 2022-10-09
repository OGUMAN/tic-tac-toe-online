import { useEffect, useState } from "react";
import styles from "./Cell.module.scss";
import Line from "./Line";
import Icon from "../Icon";

const Cell = ({
  setCell,
  cellContent,
  index,
  cellsInLine,
  winnerCells,
  winner,
  step,
  enemyStep,
  angle,
}) => {
  const [isWinnerCell, setIsWinnerCell] = useState(false);

  useEffect(() => {
    for (let i = 0; i <= winnerCells.length - 1; i++) {
      if (index === winnerCells[i]) {
        setTimeout(() => {
          setIsWinnerCell(true);
        }, 1000 + (200 * i) / winnerCells.length);
      }
    }
  }, [winnerCells]);

  useEffect(() => {
    setIsWinnerCell(false);
  }, [winner]);

  return (
    <td
      onClick={setCell}
      className={styles.cell}
      style={{
        width: `calc(100% / ${cellsInLine})`,
        height: `calc(100% / ${cellsInLine})`,
        position:
          angle !== "45deg" &&
          angle !== "135deg" &&
          index === winnerCells[0] &&
          "relative",
      }}
    >
      <div className={styles.cellContent}>
        {cellContent === "x" ? (
          <div className={(isWinnerCell && styles.won) + " " + styles.cellX}>
            <div
              style={{
                backgroundColor:
                  step === "x" ? "#4c7fff" : step === "o" ? "#fd3f3f" : null,
              }}
              className={styles.cellLine + " " + styles.cellLineFirst}
            ></div>
            <div
              style={{
                backgroundColor:
                  step === "x" ? "#4c7fff" : step === "o" ? "#fd3f3f" : null,
              }}
              className={styles.cellLine + " " + styles.cellLineSecond}
            ></div>
          </div>
        ) : cellContent === "o" ? (
          <div className={(isWinnerCell && styles.won) + " " + styles.cellY}>
            <div
              style={{
                borderColor:
                  step === "o" ? "#4c7fff" : step === "x" ? "#fd3f3f" : null,
              }}
              className={styles.circle}
            ></div>
          </div>
        ) : (
          ""
        )}
      </div>
      {index === winnerCells[0] && (
        <Line
          angle={angle}
          step={step}
          enemyStep={enemyStep}
          cellsInLine={cellsInLine}
          winner={winner}
        />
      )}
    </td>
  );
};

export default Cell;
