import { useEffect, useState } from "react";
import styles from "./Game.module.scss";
import Cell from "./Cell";
import { Link } from "react-router-dom";

const Game = ({ cellsInLine, gamemode, step, difficulty }) => {
  const [cellsNumber, setCellsNumber] = useState(cellsInLine * cellsInLine);
  const [cells, setCells] = useState([Array(cellsNumber).fill("")]);
  const [winner, setWinner] = useState("");
  const [winnerCells, setWinnerCells] = useState([]);
  const [statPlayer, setStatPlayer] = useState(0);
  const [statBot, setStatBot] = useState(0);
  const [canPlayAgain, setCanPlayAgain] = useState(false);
  const [angle, setAngle] = useState('');
  const [difficultyProbability, setDifficultyProbability] = useState(0);
  let botsStepInLine;
  let enemysStepInLine;
  let isFound = false;
  let d = [];
  let newCells;
  let gameOver=false;
  let [canPlayerStep, setCanPlayerStep] = useState(true);

  useEffect(() => {
    setCellsNumber(cellsInLine * cellsInLine);
    setCells(Array(cellsNumber).fill(""));
  }, [cellsInLine, cellsNumber]);

  useEffect(() => {
    setTimeout(() => {
        if (winner === step) {
            setStatPlayer(statPlayer + 1);
        } else if (winner === botsStep()) {
            setStatBot(statBot + 1);
        }
    }, 2250);
  }, [winner]);

  useEffect(()=>{
    switch (difficulty){
        case 1:
            setDifficultyProbability(35);
            break;
        case 2:
            setDifficultyProbability(50);
            break;
        case 3:
            setDifficultyProbability(70);
            break;
        case 4:
            setDifficultyProbability(100);
            break;
    }
  })


  const botsStep = () => {
    if (step === "x") {
      return "o";
    } else if (step === "o") {
      return "x";
    }
  };

  const playAgain = () => {
    if(canPlayAgain){
        setCanPlayerStep(true);
        setWinner("");
        setWinnerCells([]);
        setCells(Array(cellsNumber).fill(""));
        setCanPlayerStep(step);
        gameOver=false;
    }
  };

  const cellsOnClick = (id) => {
    if (cells[id] === "" && canPlayerStep && winner==='') {
        botsStepInLine = 0;
        enemysStepInLine = 0;
        isFound = false;
        d = [];

        // Players step
        newCells = cells;
        setCanPlayAgain(false);
        setCanPlayerStep(false);
        if (!gameOver) {
            //set cell that clicked
            newCells = cells.map((cell, index) => {
                if (id !== index) {
                    return cell;
                } else {
                return step;
                }
            });
            setCanPlayerStep(false);
            setCells(newCells);
        }
    

        // Checks if player won
        // Horizontal check
        for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
        enemysStepInLine = 0;
        botsStepInLine = 0;

        //checks all cells in each horizontal line
        for (let i = j; i < j + cellsInLine; i++) {
            if (newCells[i] === step) {
            enemysStepInLine++;
            if (enemysStepInLine === cellsInLine) {
                for (let k = j; k < j + cellsInLine; k++) {
                d.push(k);
                }
                setWinnerCells(d);
                setAngle('0deg')
                setWinner(step);
                gameOver=true;
                setCanPlayAgain(true);
                setCanPlayerStep(true);
            }
            }
        }
        }

        d = [];
        // Vertical check
        for (let j = 0; j < cellsInLine; j++) {
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
            if (newCells[i] === step) {
            enemysStepInLine++;
            if (enemysStepInLine === cellsInLine) {
                for (let k = j; k <= cellsInLine * cellsInLine; k += cellsInLine) {
                d.push(k);
                }
                setWinnerCells(d);
                setAngle('90deg')
                setWinner(step);
                gameOver=true;
                setCanPlayAgain(true);
                setCanPlayerStep(true);
            }
            }
        }
        }

        // Diagonal check 1
        d = [];
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = 0; i <= cellsInLine * cellsInLine; ) {
        if (newCells[i] === step) {
            enemysStepInLine++;
            if (enemysStepInLine === cellsInLine) {
            for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                d.push(k);
                k = k + cellsInLine + 1;
            }
            setWinnerCells(d);
            setAngle('45deg')
            setWinner(step);
            gameOver=true;
            setCanPlayAgain(true);
            setCanPlayerStep(true);
            }
        }
        i = i + cellsInLine + 1;
        }

        // Diagonal check 2
        d = [];
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = cellsInLine - 1; i <= cellsInLine * cellsInLine - 2; ) {
        if (newCells[i] === step) {
            enemysStepInLine++;
            if (enemysStepInLine === cellsInLine) {
            for (let k = cellsInLine - 1; k <= cellsInLine * cellsInLine - 2; ) {
                d.push(k);
                k = k + cellsInLine - 1;
            }
            setWinnerCells(d);
            setAngle('135deg')
            setWinner(step);
            gameOver=true;
            setCanPlayAgain(true);
            setCanPlayerStep(true);
            }
        }
        i = i + cellsInLine - 1;
        }

        // Bot's move
        if (!gameOver) {
            if(difficultyProbability > Math.floor(Math.random() * 100)){
            //atack
            // checks all horizontal lines
            if (!isFound && cellsInLine===3) {
                newCells = newCells.map((cell, index) => {
                    if (cell === "" && index === 4) {
                        isFound = true;
                        return botsStep();
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
            if (!isFound && winner === "") {
                for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
                enemysStepInLine = 0;
                if (!isFound) {
                    //checks all cells in each horizontal line
                    for (let i = j; i < j + cellsInLine; i++) {
                    if (newCells[i] === botsStep()) {
                        enemysStepInLine++;
                        if (enemysStepInLine === cellsInLine - 1) {
                        newCells = newCells.map((cell, index) => {
                            if (
                            cell === "" &&
                            index >= j &&
                            index <= j + cellsInLine - 1
                            ) {
                            isFound = true;
                            return botsStep();
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
            if (!isFound) {
                //checks all vertical lines
                for (let j = 0; j < cellsInLine; j++) {
                enemysStepInLine = 0;

                //checks all cells in each vertical line
                for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
                    if (newCells[i] === botsStep()) {
                    enemysStepInLine++;
                    if (enemysStepInLine === cellsInLine - 1) {
                        for (
                        let a = j;
                        a < cellsInLine * cellsInLine;
                        a += cellsInLine
                        ) {
                        if (newCells[a] === "") {
                            let b = a;
                            newCells = newCells.map((cell, index) => {
                            if (cell === "" && index === b) {
                                isFound = true;
                                return botsStep();
                            } else {
                                return cell;
                            }
                            });
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
            if (!isFound) {
                enemysStepInLine = 0;
                for (let i = 0; i <= cellsInLine * cellsInLine; ) {
                if (newCells[i] === botsStep()) {
                    enemysStepInLine++;
                }
                if (enemysStepInLine === cellsInLine - 1) {
                    for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                    if (newCells[k] === "") {
                        let c = k;
                        newCells = newCells.map((cell, index) => {
                        if (cell === "" && index === c) {
                            isFound = true;
                            return botsStep();
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
                    k = k + cellsInLine + 1;
                    }
                }
                i = i + cellsInLine + 1;
                }
            }
            if (!isFound) {
                enemysStepInLine = 0;
                for (let i = cellsInLine - 1; i <= cellsInLine * cellsInLine - 1; ) {
                if (newCells[i] === botsStep()) {
                    enemysStepInLine++;
                }
                if (enemysStepInLine === cellsInLine - 1) {
                    for (let k = cellsInLine - 1; k < cellsInLine * cellsInLine - 1; ) {
                    if (newCells[k] === "") {
                        let c = k;
                        newCells = newCells.map((cell, index) => {
                        if (cell === "" && index === c) {
                            isFound = true;
                            return botsStep();
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
                    k = k + cellsInLine - 1;
                    }
                }
                i = i + cellsInLine - 1;
                }
            }

            //protect
            // checks all horizontal lines
            if (!isFound) {
                for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
                enemysStepInLine = 0;

                //checks all cells in each horizontal line
                for (let i = j; i < j + cellsInLine; i++) {
                    if (newCells[i] === step) {
                    enemysStepInLine++;
                    if (enemysStepInLine === cellsInLine - 1) {
                        newCells = newCells.map((cell, index) => {
                        if (
                            cell === "" &&
                            index >= j &&
                            index <= j + cellsInLine - 1
                        ) {
                            isFound = true;
                            return botsStep();
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

            if (!isFound) {
                //checks all vertical lines
                for (let j = 0; j < cellsInLine; j++) {
                enemysStepInLine = 0;

                //checks all cells in each vertical line
                for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
                    if (newCells[i] === step) {
                    enemysStepInLine++;
                    if (enemysStepInLine === cellsInLine - 1) {
                        for (
                        let a = j;
                        a < cellsInLine * cellsInLine;
                        a += cellsInLine
                        ) {
                        if (newCells[a] === "") {
                            let b = a;
                            newCells = newCells.map((cell, index) => {
                            if (cell === "" && index === b) {
                                isFound = true;
                                return botsStep();
                            } else {
                                return cell;
                            }
                            });
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
            if (!isFound) {
                enemysStepInLine = 0;
                for (let i = 0; i <= cellsInLine * cellsInLine; ) {
                if (newCells[i] === step) {
                    enemysStepInLine++;
                }
                if (enemysStepInLine === cellsInLine - 1) {
                    // console.log(enemysStepInLine)
                    for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                    if (newCells[k] === "") {
                        let c = k;
                        newCells = newCells.map((cell, index) => {
                        if (cell === "" && index === c) {
                            isFound = true;
                            return botsStep();
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
                    k = k + cellsInLine + 1;
                    }
                }
                i = i + cellsInLine + 1;
                }
            }
            if (!isFound) {
                enemysStepInLine = 0;
                for (let i = cellsInLine - 1; i <= cellsInLine * cellsInLine - 1; ) {
                if (newCells[i] === step) {
                    enemysStepInLine++;
                }
                if (enemysStepInLine === cellsInLine - 1) {
                    for (let k = cellsInLine - 1; k < cellsInLine * cellsInLine - 1; ) {
                    if (newCells[k] === "") {
                        let c = k;
                        newCells = newCells.map((cell, index) => {
                        if (cell === "" && index === c) {
                            isFound = true;
                            return botsStep();
                        } else {
                            return cell;
                        }
                        });
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
        if (!isFound) {
            let freeCells = [];
            let randomCell;

            for (let k = 0; k <= cellsInLine * cellsInLine - 1; k++) {
            if (newCells[k] === "") {
                freeCells.push(k);
            }
            }

            randomCell = Math.floor(Math.random() * freeCells.length);
            newCells = newCells.map((cell, index) => {
            if (index === freeCells[randomCell]) {
                isFound = true;
                return botsStep();
            } else {
                return cell;
            }
            });
            setTimeout(() => {
            setCells(newCells);
            setCanPlayerStep(true);
            }, 700);
        }
        }

        // Checks if bot won
        // Horizontal check
        for (let j = 0; j < cellsInLine * cellsInLine; j += cellsInLine) {
        enemysStepInLine = 0;
        botsStepInLine = 0;
        //checks all cells in each horizontal line
        for (let i = j; i < j + cellsInLine; i++) {
            if (newCells[i] === botsStep()) {
            botsStepInLine++;
            if (botsStepInLine === cellsInLine) {
                for (let k = j; k < j + cellsInLine; k++) {
                d.push(k);
                }
                setWinnerCells(d);
                setAngle('0deg')
                setWinner(botsStep());
                gameOver=true;
            }
            }
        }
        }

        // Vertical check
        d = [];
        for (let j = 0; j < cellsInLine; j++) {
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = j; i < cellsInLine * cellsInLine; i += cellsInLine) {
            if (newCells[i] === botsStep()) {
            botsStepInLine++;
            if (botsStepInLine === cellsInLine) {
                for (let k = j; k <= cellsInLine * cellsInLine; k += cellsInLine) {
                d.push(k);
                }
                setWinnerCells(d);
                setAngle('90deg')
                setWinner(botsStep());
                gameOver=true;
            }
            }
        }
        }

        // Diagonal check 1
        d = [];
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = 0; i <= cellsInLine * cellsInLine; ) {
        if (newCells[i] === botsStep()) {
            botsStepInLine++;
            if (botsStepInLine === cellsInLine) {
            for (let k = 0; k <= cellsInLine * cellsInLine; ) {
                d.push(k);
                k = k + cellsInLine + 1;
            }
            setWinnerCells(d);
            setAngle('45deg')
            setWinner(botsStep());
            gameOver=true;
            }
        }
        i = i + cellsInLine + 1;
        }

        // Diagonal check 2
        d = [];
        enemysStepInLine = 0;
        botsStepInLine = 0;
        for (let i = cellsInLine - 1; i <= cellsInLine * cellsInLine - 2; ) {
        if (newCells[i] === botsStep()) {
            botsStepInLine++;
            if (botsStepInLine === cellsInLine) {
            for (let k = cellsInLine - 1; k <= cellsInLine * cellsInLine - 2; ) {
                d.push(k);
                k = k + cellsInLine - 1;
            }
            setWinnerCells(d);
            setAngle('135deg')
            setWinner(botsStep());
            gameOver=true;
            }
        }
        i = i + cellsInLine - 1;
        }
    }
  };

  return (
    <div className={styles.game}>
      <div className={styles.top}>
        <Link to="/">
          <div className='back'>
            <div className='arrow'></div>
          </div>
        </Link>
        <div className={styles.stat}>
          <div className={styles.stat__item}>
            {step==='x' ? (
                <>
                <div className={styles.stat__icon + " " + styles.stat__x}>
                    <div
                        style={{backgroundColor: step==='x' ? '#4c7fff' : step==='o' ? '#fd3f3f':null}}
                        className={styles.cellLine + " " + styles.cellLineFirst}
                        ></div>
                        <div
                        style={{backgroundColor: step==='x' ? '#4c7fff' : step==='o' ? '#fd3f3f':null}}
                        className={styles.cellLine + " " + styles.cellLineSecond}
                        ></div>
                    </div>
                    <div className={styles.stat__score}>: {statPlayer}</div>
                </>
            ) : (<>
                <div className={styles.stat__icon + " " + styles.stat__o}>
                    <div style={{borderColor: step==='o' ? '#4c7fff' : step==='x' ? '#fd3f3f':null}} className={styles.circle}></div>
                </div>
                <div className={styles.stat__score}>: {statBot}</div>
                </>
            )}
            </div>
            <div className={styles.stat__item}>
            {step==='o' ? (
                <>
                <div className={styles.stat__icon + " " + styles.stat__x}>
                    <div
                        style={{backgroundColor: step==='x' ? '#4c7fff' : step==='o' ? '#fd3f3f':null}}
                        className={styles.cellLine + " " + styles.cellLineFirst}
                        ></div>
                        <div
                        style={{backgroundColor: step==='x' ? '#4c7fff' : step==='o' ? '#fd3f3f':null}}
                        className={styles.cellLine + " " + styles.cellLineSecond}
                        ></div>
                    </div>
                    <div className={styles.stat__score}>: {statPlayer}</div>
                </>
            ) : (<>
                <div className={styles.stat__icon + " " + styles.stat__o}>
                    <div style={{borderColor: step==='o' ? '#4c7fff' : step==='x' ? '#fd3f3f':null}} className={styles.circle}></div>
                </div>
                <div className={styles.stat__score}>: {statBot}</div>
                </>
            )}
            </div>
        </div>
      </div>
      <div className={styles.field}>
        {Array.from(cells).map((cell, index) => {
          return (
            <Cell
              winnerCells={winnerCells}
              winner={winner}
              cellContent={cell}
              setCell={() => {
                cellsOnClick(index);
              }}
              index={index}
              cellsInLine={cellsInLine}
              key={index}
              step={step}
              botsStep={botsStep()}
              angle={angle}
            />
          );
        })}
        <div className={styles.borderRemover}></div>
      </div>
      <div className={styles.bottom}>
        <div onClick={playAgain} className={styles.again  + ' ' + (!canPlayAgain ? styles.blocked : '')}>
          Play again
        </div>
      </div>
    </div>
  );
};

export default Game;
