import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Loading.module.scss";

const Loading = ({ theme, gamemode, loadingJson={}, online }) => {
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
    <div className={styles.loading + " " + (theme==="white" ? styles.loadingWhite : "")}>
      {gamemode==="multiplayer" && <Link to="/">
        <div className="back">
          <div className="arrow"></div>
        </div>
      </Link>}
      <div className={styles.text}>{gamemode==="multiplayer" ? loadingJson["searchTitle"] : "Loading"} {points}</div>
      <div className={styles.online}>{gamemode==="multiplayer" && `(${online} ${loadingJson["online"]})`}</div>
    </div>
  );
};

export default Loading;
