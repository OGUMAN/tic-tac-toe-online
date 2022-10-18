import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Modal.module.scss";

const Modal = ({
  leaved,
  modalLangJson = {},
  theme,
  winner,
  step,
  playAgain,
  againVotesBlocked,
  againVotes,
  gamemode,
  whoAfk,
  modalTimer,
}) => {
  let navigate = useNavigate();
  const wonImgs = [
    "ballons.svg",
    "ballons2.svg",
    "fireworks.svg",
    "fireworks2.svg",
    "happy.svg",
  ];
  const lostImgs = ["crying.svg", "crying2.svg"];
  const drawImgs = ["handshake.svg"];
  const timeoutImgs = ["alarm.svg"];
  const [modalImg, setModalImg] = useState("");

  const getRandomEl = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  useEffect(() => {
    if (leaved) {
      setModalImg("exit.svg ");
    } else if (winner === "draw") {
      setModalImg(getRandomEl(drawImgs));
    } else if (winner === "timeout") {
      setModalImg(getRandomEl(timeoutImgs));
    } else if (step === winner) {
      setModalImg(getRandomEl(wonImgs));
    } else if (step !== winner) {
      setModalImg(getRandomEl(lostImgs));
    }
  }, [winner]);

  return (
    <div className="wrapper">
      <div
        className={
          (theme === "white" ? styles.modalWhite : "") +
          " " +
          styles.modal +
          " show"
        }
      >
        <img src={`img/${modalImg}`} width={80} height={80} alt="Firework" />
        <div>
          <div className={"title " + styles.title}>
            {leaved
              ? modalLangJson["leavedTitle"]
              : winner === "draw"
              ? modalLangJson["drawTitle"]
              : winner === "timeout"
              ? whoAfk === "me"
                ? modalLangJson["youKickedTitle"]
                : modalLangJson["opponentKickedTitle"]
              : winner === step
              ? modalLangJson["winTitle"]
              : modalLangJson["lostTitle"]}
          </div>
          {winner !== "draw" && !leaved && (
            <div className={styles.text}>
              {winner === "timeout"
                ? whoAfk === "me"
                  ? modalLangJson["youKickedDesc"]
                  : modalLangJson["opponentKickedDesc"]
                : winner === step
                ? modalLangJson["winDesc"]
                : modalLangJson["lostDesc"]}
            </div>
          )}
        </div>
        {winner !== "timeout" && !leaved && (
          <div
            onClick={playAgain}
            className={
              styles.again +
              " " +
              styles.again_multiplayer +
              " " +
              (againVotesBlocked && styles.blocked)
            }
          >
            {modalLangJson["playAgain"]}
            <span>{gamemode === "multiplayer" && `(${againVotes}/2)`}</span>
          </div>
        )}
        <Link to="/" className={styles.leave}>
          {winner === "timeout" || leaved
            ? modalLangJson["toMenu"]
            : gamemode === "multiplayer"
            ? modalLangJson["playAgain"]
            : modalLangJson["toMenu"]}
          {gamemode !== "solo" && ` (${modalTimer})`}
        </Link>
      </div>
    </div>
  );
};

export default Modal;
