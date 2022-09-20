import styles from "./Solo.module.scss";
import Game from "../Game";

const Solo = ({ cellsInLine, gamemode, step, difficulty }) => {
  return (
    <div className="show">
      <Game cellsInLine={cellsInLine} gamemode={gamemode} step={step} difficulty={difficulty} />
    </div>
  );
};

export default Solo;
