import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Modal.module.scss";

const Modal = ({
  winner,
  step,
  playAgain,
  againVotesBlocked,
  againVotes,
  gamemode,
  setMenuModuleOpen,
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
  const lostImgs = ["crying.svg", "crying2.svg", "angry.svg"];
  const drawImgs = ["handshake.svg"];
  const wonTitles = ["Congratulations!"];
  const lostTitles = ["Compassion!", "Oh no!"];

  const timeoutImgs = ["alarm.svg", "alarm2.svg"];

  const [modalImg, setModalImg] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const getRandomEl = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  useEffect(() => {
    if (winner === "draw") {
      setModalImg(getRandomEl(drawImgs));
    } else if (winner === "timeout") {
      setModalImg(getRandomEl(timeoutImgs));
    } else if (step === winner) {
      setModalImg(getRandomEl(wonImgs));
      setModalTitle(getRandomEl(wonTitles));
    } else if (step !== winner) {
      setModalImg(getRandomEl(lostImgs));
      setModalTitle(getRandomEl(lostTitles));
    }
  }, [winner]);

  return (
    <div className="wrapper">
      <div className={styles.modal + " show"}>
        <img src={`img/${modalImg}`} width={80} height={80} alt="Firework" />
        <div>
          <div className={styles.title}>
            {winner === "draw"
              ? "It's Draw!"
              : winner === "timeout"
              ? whoAfk === "me"
                ? "You were kicked out!"
                : "Your opponent was kicked out!"
              : modalTitle}
          </div>
          <div className={styles.text}>
            {winner === "draw"
              ? ""
              : winner === "timeout"
              ? whoAfk === "me"
                ? "You took too much time."
                : "Your opponent took too much time."
              : step === winner
              ? "You are winner"
              : "You lost the battle"}
          </div>
        </div>
        {winner !== "timeout" && (
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
            Play again{" "}
            <span>{gamemode === "multiplayer" && `(${againVotes}/2)`}</span>
          </div>
        )}
        <Link to="/" className={styles.leave}>
          {winner === "timeout"
            ? "Close"
            : gamemode === "multiplayer"
            ? "Leave room"
            : "To menu"}
          {gamemode !== "solo" && ` (${modalTimer})`}
        </Link>
      </div>
    </div>
  );
};

export default Modal;
