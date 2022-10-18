import { useEffect, useState } from "react";
import styles from "./Line.module.scss";

const Line = ({ theme, cellsInLine, winner, step, opponentStep, angle }) => {
  const [width, setWidth] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    // winner = me?
    if (winner === step) {
      setTimeout(() => {
        setWidth(`calc(${cellsInLine} * 100% + ${cellsInLine}px)`);
        setColor(theme === "white" ? "#535bc9" : "#10111f");
      }, 1100);
      // winner = opponent?
    } else if (winner === opponentStep) {
      setTimeout(() => {
        setWidth(`calc(${cellsInLine} * 100% + ${cellsInLine}px)`);
        setColor(theme === "white" ? "#c25151" : "#160f0f");
      }, 1100);
    }
    // angle is diagonal?
    if (angle === "45deg" || angle === "135deg") {
      setTimeout(() => {
        // calculate the square diagonal length (d=√2a)
        setWidth(`calc(${Math.sqrt(2 * 1)} * 100% - 40px)`);
      }, 1100);
    }
  });

  return (
    <div
      className={
        styles.line +
        " " +
        (angle === "90deg"
          ? styles.line90deg
          : angle === "45deg"
          ? styles.line45deg
          : angle === "135deg"
          ? styles.line135deg
          : null)
      }
      style={{ width: width, backgroundColor: color }}
    />
  );
};

export default Line;
