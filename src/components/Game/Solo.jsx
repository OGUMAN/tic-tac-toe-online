import { useEffect, useState } from "react";
import styles from "./Game.module.scss";
import Cell from "./Cell";
import Modal from "./Modal";
import Icon from "./Icon";
import { Link } from "react-router-dom";
import loseAudio from "../../sounds/lose.mp3";
import wonAudio from "../../sounds/won.mp3";

const Solo = ({
  soundOn,
  modalLangJson = {},
  cellsInLine,
  step,
  difficulty,
  myName,
  theme,
}) => {
  const [cellsNumber, setCellsNumber] = useState(cellsInLine * cellsInLine);
  const [cells, setCells] = useState([Array(cellsNumber).fill("")]);
  const [winner, setWinner] = useState("");
  const [winnerCells, setWinnerCells] = useState([]);
  const [statPlayer, setStatPlayer] = useState(0);
  const [statBot, setStatBot] = useState(0);
  const [canPlayAgain, setCanPlayAgain] = useState(false);
  const [angle, setAngle] = useState("");
  const [difficultyProbability, setDifficultyProbability] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  let botStepInLine;
  let opponentStepInLine;
  let isFound = false;
  let d = [];
  let newCells;
  let gameOver = false;
  let [canPlayerStep, setCanPlayerStep] = useState(true);
  const lose = new Audio(loseAudio);
  const won = new Audio(wonAudio);

  // when winner changing open modal
  useEffect(() => {
    if (winner !== "") {
      // avoid opening modal when game just started
      if (winner !== "draw") {
        // if winner = me or opponent, open modal after 1750ms (to see crossing cells)
        setTimeout(() => {
          setModalOpen(true);
        }, 1750);
      } else {
        // else if winner = draw, open modal instantly
        setModalOpen(true);
      }
    }
    if (soundOn) {
      // is sound turned on
      if (winner === step) {
        // winner = me?
        setTimeout(() => {
          won.play();
        }, 1750);
      } else if (winner === botStep()) {
        // or winner = opponent?
        setTimeout(() => {
          lose.play();
        }, 1750);
      }
    }
  }, [winner]);

  useEffect(() => {
    setCellsNumber(cellsInLine * cellsInLine);
    setCells(Array(cellsNumber).fill(""));
  }, [cellsInLine, cellsNumber]); // when change field width, rerender cells

  useEffect(() => {
    setTimeout(() => {
      if (winner === step) {
        // winner = me?
        setStatPlayer(statPlayer + 1); // my score +=1
      } else if (winner === botStep()) {
        setStatBot(statBot + 1); // opponent's score +=1
      }
    }, 2250);
  }, [winner]); // when winner changing

  useEffect(() => {
    // chance that bot will think (difficulty)
    switch (difficulty) {
      case 1:
        setDifficultyProbability(35); // chance = 35%
        break;
      case 2:
        setDifficultyProbability(50); // chance = 50%
        break;
      case 3:
        setDifficultyProbability(70); // chance = 70%
        break;
      case 4:
        setDifficultyProbability(100); // chance = 100%
        break;
    }
  });

  const botStep = () => {
    // get bot's step relative my step
    if (step === "x") {
      return "o";
    } else if (step === "o") {
      return "x";
    }
  };

  // when player clicked to play again
  const playAgain = () => {
    if (canPlayAgain) {
      setCanPlayerStep(true);
      setWinner("");
      setWinnerCells([]);
      setCells(Array(cellsNumber).fill(""));
      setCanPlayerStep(step);
      setModalOpen(false);
      gameOver = false;
    }
  };

  // when winner found
  const ifWinnerFound = (deg, who, d) => {
    setWinnerCells(d);
    setAngle(deg);
    setWinner(who);
    gameOver = true;
    setCanPlayAgain(true);
    setCanPlayerStep(true);
  };

  // setting cell by "x" or "o"
  const setCell = (id, who) => {
    return newCells.map((cell, index) => {
      if (id !== index) {
        // if index != needed id
        return cell; // return that cell without changing
      } else {
        return who; // return replaced cell
      }
    });
  };

  // checking field are there 3 cells in a row
  const checkCells = (who) => {
    // using loop, to break it when winner found or it's draw
    checkCellsLoop: for (let i = 0; i < 5; i++) {
      if (i === 0) {
        for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
          opponentStepInLine = 0;
          botStepInLine = 0;

          //checks all cells in each horizontal line
          for (let i = j; i < j + cellsInLine; i++) {
            if (newCells[i] === who) {
              opponentStepInLine++;
              if (opponentStepInLine === cellsInLine) {
                for (let k = j; k < j + cellsInLine; k++) {
                  d.push(k);
                }
                ifWinnerFound("0deg", who, d);
                break checkCellsLoop;
              }
            }
          }
        }
      }
      // Vertical check
      if (i === 1) {
        d = [];
        for (let j = 0; j < cellsInLine; j++) {
          opponentStepInLine = 0;
          botStepInLine = 0;
          for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
            if (newCells[i] === who) {
              opponentStepInLine++;
              if (opponentStepInLine === cellsInLine) {
                for (
                  let k = j;
                  k <= cellsInLine * cellsInLine;
                  k += cellsInLine
                ) {
                  d.push(k);
                }
                ifWinnerFound("90deg", who, d);
                break checkCellsLoop;
              }
            }
          }
        }
      }

      // Diagonal check 1
      if (i === 2) {
        d = [];
        opponentStepInLine = 0;
        botStepInLine = 0;
        for (let i = 0; i <= cellsInLine * cellsInLine; ) {
          if (newCells[i] === who) {
            opponentStepInLine++;
            if (opponentStepInLine === cellsInLine) {
              for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                d.push(k);
                k = k + cellsInLine + 1;
              }
              ifWinnerFound("45deg", who, d);
              break checkCellsLoop;
            }
          }
          i = i + cellsInLine + 1;
        }
      }

      // Diagonal check 2
      if (i === 3) {
        d = [];
        opponentStepInLine = 0;
        botStepInLine = 0;
        for (let i = cellsInLine - 1; i <= cellsInLine * cellsInLine - 2; ) {
          if (newCells[i] === who) {
            opponentStepInLine++;
            if (opponentStepInLine === cellsInLine) {
              for (
                let k = cellsInLine - 1;
                k <= cellsInLine * cellsInLine - 2;

              ) {
                d.push(k);
                k = k + cellsInLine - 1;
              }
              ifWinnerFound("135deg", who, d);
              break checkCellsLoop;
            }
          }
          i = i + cellsInLine - 1;
        }
      }

      // check is it draw
      if (i === 4) {
        let busyCells = 0;
        for (let i = 0; i <= cellsNumber - 1; i++) {
          if (cells[i] === "x" || cells[i] === "o") {
            busyCells++;
          }
          if (busyCells === cellsNumber - 1) {
            setWinner("draw");
            setCanPlayAgain(true);
            break checkCellsLoop;
          }
        }
      }
    }
  };

  // when clicked on any cell
  const cellsOnClick = (id) => {
    if (cells[id] === "" && canPlayerStep && winner === "") {
      botStepInLine = 0;
      opponentStepInLine = 0;
      isFound = false;
      d = [];

      // player's step
      newCells = cells;
      setCanPlayAgain(false);
      setCanPlayerStep(false);
      if (!gameOver) {
        //set cell that clicked
        newCells = setCell(id, step);
        setCanPlayerStep(false);
        setCells(newCells);
      }
      // check if player won
      checkCells(step);

      // bot's move
      if (!gameOver) {
        // difficulty - a chance that bot will think how step or just step randomly
        if (difficultyProbability > Math.floor(Math.random() * 100)) {
          // if field is 3x3, bot should step to center
          if (!isFound && cellsInLine === 3 && newCells[4] === "") {
            newCells = setCell(4, botStep());
            isFound = true;
            setTimeout(() => {
              setCells(newCells);
              setCanPlayAgain(true);
              setCanPlayerStep(true);
            }, 700);
          }
          //attack
          // check all horizontal lines
          if (!isFound && winner === "") {
            for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
              opponentStepInLine = 0;
              if (!isFound) {
                for (let i = j; i < j + cellsInLine; i++) {
                  if (newCells[i] === botStep()) {
                    opponentStepInLine++;
                    if (opponentStepInLine === cellsInLine - 1) {
                      newCells = newCells.map((cell, index) => {
                        if (
                          cell === "" &&
                          index >= j &&
                          index <= j + cellsInLine - 1
                        ) {
                          isFound = true;
                          return botStep();
                        } else {
                          return cell;
                        }
                      });
                      setTimeout(() => {
                        setCells(newCells);
                        setCanPlayAgain(true);
                        setCanPlayerStep(true);
                      }, 700);
                    }
                  }
                }
              }
            }
          }
          //check all vertical lines
          if (!isFound) {
            for (let j = 0; j < cellsInLine; j++) {
              opponentStepInLine = 0;

              //checks all cells in each vertical line
              for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
                if (newCells[i] === botStep()) {
                  opponentStepInLine++;
                  if (opponentStepInLine === cellsInLine - 1) {
                    for (
                      let a = j;
                      a < cellsInLine * cellsInLine;
                      a += cellsInLine
                    ) {
                      if (newCells[a] === "") {
                        isFound = true;
                        newCells = newCells = setCell(a, botStep());
                      }
                    }
                  }
                }
                setTimeout(() => {
                  setCells(newCells);
                  setCanPlayAgain(true);
                  setCanPlayerStep(true);
                }, 700);
              }
            }
          }
          //check diagonal from left top (\)
          if (!isFound) {
            opponentStepInLine = 0;
            for (let i = 0; i <= cellsInLine * cellsInLine; ) {
              if (newCells[i] === botStep()) {
                opponentStepInLine++;
              }
              if (opponentStepInLine === cellsInLine - 1) {
                for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                  if (newCells[k] === "") {
                    isFound = true;
                    newCells = newCells = setCell(k, botStep());
                    setTimeout(() => {
                      setCells(newCells);
                      setCanPlayAgain(true);
                      setCanPlayerStep(true);
                    }, 700);
                  }
                  k = k + cellsInLine + 1;
                }
              }
              i = i + cellsInLine + 1;
            }
          }
          //check diagonal from right top (/)
          if (!isFound) {
            opponentStepInLine = 0;
            for (
              let i = cellsInLine - 1;
              i <= cellsInLine * cellsInLine - 1;

            ) {
              if (newCells[i] === botStep()) {
                opponentStepInLine++;
              }
              if (opponentStepInLine === cellsInLine - 1) {
                for (
                  let k = cellsInLine - 1;
                  k < cellsInLine * cellsInLine - 1;

                ) {
                  if (newCells[k] === "") {
                    isFound = true;
                    newCells = newCells = setCell(k, botStep());
                    setTimeout(() => {
                      setCells(newCells);
                      setCanPlayAgain(true);
                      setCanPlayerStep(true);
                    }, 700);
                  }
                  k = k + cellsInLine - 1;
                }
              }
              i = i + cellsInLine - 1;
            }
          }

          //protect
          // check all horizontal lines
          if (!isFound) {
            for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
              opponentStepInLine = 0;

              //checks all cells in each horizontal line
              for (let i = j; i < j + cellsInLine; i++) {
                if (newCells[i] === step) {
                  opponentStepInLine++;
                  if (opponentStepInLine === cellsInLine - 1) {
                    newCells = newCells.map((cell, index) => {
                      if (
                        cell === "" &&
                        index >= j &&
                        index <= j + cellsInLine - 1
                      ) {
                        isFound = true;
                        return botStep();
                      } else {
                        return cell;
                      }
                    });
                    setTimeout(() => {
                      setCells(newCells);
                      setCanPlayAgain(true);
                      setCanPlayerStep(true);
                    }, 700);
                  }
                }
              }
            }
          }
          //check all vertical lines
          if (!isFound) {
            //checks all vertical lines
            for (let j = 0; j < cellsInLine; j++) {
              opponentStepInLine = 0;

              //checks all cells in each vertical line
              for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
                if (newCells[i] === step) {
                  opponentStepInLine++;
                  if (opponentStepInLine === cellsInLine - 1) {
                    for (
                      let a = j;
                      a < cellsInLine * cellsInLine;
                      a += cellsInLine
                    ) {
                      if (newCells[a] === "") {
                        isFound=true;
                        newCells = setCell(a, botStep());
                      }
                    }
                  }
                }
                setTimeout(() => {
                  setCells(newCells);
                  setCanPlayAgain(true);
                  setCanPlayerStep(true);
                }, 700);
              }
            }
          }
          //check diagonal from left top (\)
          if (!isFound) {
            opponentStepInLine = 0;
            for (let i = 0; i <= cellsInLine * cellsInLine; ) {
              if (newCells[i] === step) {
                opponentStepInLine++;
              }
              if (opponentStepInLine === cellsInLine - 1) {
                for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                  if (newCells[k] === "") {
                    isFound=true;
                    newCells = setCell(k, botStep());
                    setTimeout(() => {
                      setCells(newCells);
                      setCanPlayAgain(true);
                      setCanPlayerStep(true);
                    }, 700);
                  }
                  k = k + cellsInLine + 1;
                }
              }
              i = i + cellsInLine + 1;
            }
          }
          //check diagonal from right top (/)
          if (!isFound) {
            opponentStepInLine = 0;
            for (
              let i = cellsInLine - 1;
              i <= cellsInLine * cellsInLine - 1;

            ) {
              if (newCells[i] === step) {
                opponentStepInLine++;
              }
              if (opponentStepInLine === cellsInLine - 1) {
                for (
                  let k = cellsInLine - 1;
                  k < cellsInLine * cellsInLine - 1;

                ) {
                  if (newCells[k] === "") {
                    isFound=true;
                    newCells = newCells = setCell(k, botStep());
                    setTimeout(() => {
                      setCells(newCells);
                      setCanPlayerStep(true);
                    }, 700);
                  }
                  k = k + cellsInLine - 1;
                }
              }
              i = i + cellsInLine - 1;
            }
          }
        }

        //step randomly
        if (!isFound) {
          let freeCells = [];
          let randomCell;

          for (let k = 0; k <= cellsInLine * cellsInLine - 1; k++) {
            if (newCells[k] === "") {
              freeCells.push(k);
            }
          }

          randomCell = Math.floor(Math.random() * freeCells.length);
          isFound = true;
          newCells = setCell(freeCells[randomCell], botStep());
          setTimeout(() => {
            setCells(newCells);
            setCanPlayerStep(true);
          }, 700);
        }

        // check if bot won
        checkCells(botStep());
      }
    }
  };

  return (
    <div className="show">
      <div className={styles.top}>
        <Link to="/">
          <div className="back">
            <div className="arrow"></div>
          </div>
        </Link>
        <div className={styles.stat}>
          <div className={styles.item}>
            <div className={styles.nickname}>{myName}</div>
            <div className={styles.left}>
              <Icon step={step} color={"me"} size={35} />
            </div>
            <div className={styles.score}>{statPlayer}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.score}>{statBot}</div>
            <div className={styles.right}>
              <Icon step={botStep()} color={"opponent"} size={35} />
            </div>
            <div className={styles.nickname}>Bot</div>
          </div>
        </div>
      </div>
      <div className={styles.game}>
        <table
          border="1"
          cellSpacing="0"
          cellPadding="10"
          className={styles.field}
        >
          <tbody>
            {Array(cellsInLine)
              .fill("")
              .map((el, index) => (
                <tr
                  key={index}
                  style={{ height: `calc(100% / ${cellsInLine})` }}
                >
                  {Array.from(cells).map((cell, idx) => {
                    if (
                      idx >= index * cellsInLine &&
                      idx < index * cellsInLine + cellsInLine
                    ) {
                      return (
                        <Cell
                          theme={theme}
                          winnerCells={winnerCells}
                          winner={winner}
                          cellContent={cell}
                          setCell={() => {
                            cellsOnClick(idx);
                          }}
                          index={idx}
                          cellsInLine={cellsInLine}
                          key={idx}
                          step={step}
                          opponentStep={botStep()}
                          angle={angle}
                        />
                      );
                    }
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <Modal
          modalLangJson={modalLangJson}
          theme={theme}
          winner={winner}
          step={step}
          playAgain={playAgain}
          gamemode={"solo"}
        />
      )}
    </div>
  );
};

export default Solo;
