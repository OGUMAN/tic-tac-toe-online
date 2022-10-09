import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Loading.module.scss";

const Loading = ({ online }) => {
  const [points, setPoints] = useState("");

  useEffect(() => {
    setPoints(".");
  }, []);

  useEffect(() => {
    if (points === "") {
      setTimeout(() => {
        setPoints(".");
      }, 300);
    } else if (points === ".") {
      setTimeout(() => {
        setPoints("..");
      }, 300);
    } else if (points === "..") {
      setTimeout(() => {
        setPoints("...");
      }, 300);
    } else if (points === "...") {
      setTimeout(() => {
        setPoints("");
      }, 750);
    }
  }, [points]);
  return (
    <div className={styles.loading}>
      <Link to="/">
        <div className="back">
          <div className="arrow"></div>
        </div>
      </Link>
      <div className={styles.text}>Looking for an opponent {points}</div>
      <div className={styles.online}>({online} players online)</div>
    </div>
  );
};

export default Loading;
