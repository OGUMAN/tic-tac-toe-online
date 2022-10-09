import { useEffect, useState } from "react";
import styles from "./Line.module.scss";

const Line = ({ cellsInLine, winner, step, enemyStep, angle }) => {
  const [width, setWidth] = useState(0);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (winner === step) {
      setTimeout(() => {
        setWidth(`calc(${cellsInLine} * 100% + ${cellsInLine}px)`);
        setColor("#10111f");
      }, 2000);
    } else if (winner === enemyStep) {
      setTimeout(() => {
        setWidth(`calc(${cellsInLine} * 100% + ${cellsInLine}px)`);
        setColor("#160f0f");
      }, 2000);
    }
    if (angle === "45deg" || angle === "135deg") {
      setTimeout(() => {
        setWidth(`calc(${Math.sqrt(2 * 1)} * 100% - 40px)`);
      }, 2000);
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
