import { useEffect, useState } from "react";
import styles from "./Cell.module.scss";
import Line from "./Line";

const Cell = ({
  theme,
  setCell,
  cellContent,
  index,
  cellsInLine,
  winnerCells,
  winner,
  step,
  opponentStep,
  angle,
}) => {

  return (
    <td
      onClick={setCell}
      className={
        (theme === "white" ? styles.cellWhite : "") + " " + styles.cell
      }
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
          <div className={styles.cellX}>
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
          <div className={(styles.won) + " " + styles.cellO}>
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
      {/* line starts from the first winner cell */}
      {index === winnerCells[0] && (
        <Line
          theme={theme}
          angle={angle}
          step={step}
          opponentStep={opponentStep}
          cellsInLine={cellsInLine}
          winner={winner}
        />
      )}
    </td>
  );
};

export default Cell;
