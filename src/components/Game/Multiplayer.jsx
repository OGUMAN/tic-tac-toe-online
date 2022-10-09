import { socket } from "./socket";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Game.module.scss";
import Cell from "./Cell";
import Loading from "./Loading";
import Icon from "./Icon";
import Modal from "./Modal";
import Chat from "./Chat";

const Multiplayer = ({ myName }) => {
  let navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [room, setRoom] = useState("");
  const [myRoom, setMyRoom] = useState("");
  const [enemysRoom, setEnemysRoom] = useState("");
  const [step, setStep] = useState("");
  const [canStep, setCanStep] = useState(false);
  const [againVotes, setAgainVotes] = useState(0);
  const [againVotesBlocked, setAgainVotesBlocked] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [enemyName, setEnemyName] = useState("");
  const [statPlayer, setStatPlayer] = useState(0);
  const [statBot, setStatBot] = useState(0);
  const cellsInLine = 3;
  const [cells, setCells] = useState([
    Array(cellsInLine * cellsInLine).fill(""),
  ]);
  const [winner, setWinner] = useState("");
  const [winnerCells, setWinnerCells] = useState([]);
  const [angle, setAngle] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const [intervalVar, setIntervalVar] = useState();
  const [timer, setTimer] = useState(35);
  const [timerEnemy, setTimerEnemy] = useState(35);
  const [menuModuleOpen, setMenuModuleOpen] = useState(false);
  const [whoAfk, setWhoAfk] = useState("");
  const [modalTimer, setModalTimer] = useState(10);
  const [online, setOnline] = useState(0);

  useEffect(() => {
    if (winner !== "" && winner !== "timeout") {
      setTimeout(() => {
        setModalOpen(true);
      }, 2500);
    } else {
      setModalOpen(false);
    }

    if (winner === step && winner !== "") {
      setStatPlayer(statPlayer + 1);
    } else if (winner === getEnemyStep() && winner !== "") {
      setStatBot(statBot + 1);
    }
  }, [winner]);

  useEffect(() => {
    if (room === "" && myRoom === "") {
      socket.emit("im waiting", myRoom, room);
    }
    return () => {
      socket.emit("im leaving", myRoom, room);
    };
  }, [myRoom, room]);

  socket.once("game started", (room, step, myRoom, enemysRoom) => {
    setMyRoom(myRoom);
    setEnemysRoom(enemysRoom);
    setRoom(room);
    setIsLoaded(true);
    setStep(step);
    setCells(["", "", "", "", "", "", "", "", ""]);
    socket.emit("send name", myName, enemysRoom);
    setMenuModuleOpen(false);
  });

  socket.once("win", (winnerCells, angle, winner) => {
    setWinnerCells(winnerCells);
    setAngle(angle);
    setWinner(winner);
  });

  socket.once("restart", () => {
    setWinner("");
    setCells(["", "", "", "", "", "", "", "", ""]);
    setAgainVotes(0);
    setAgainVotesBlocked(false);
    setWinnerCells([]);
    setStep(getEnemyStep());
    if (step === "x") {
      setCurrentStep(step);
    } else {
      setCurrentStep(getEnemyStep());
    }
    if (step === "x") {
      setCanStep(false);
    } else if (step === "o") {
      setCanStep(true);
    }
  });

  const cellsOnClick = (id) => {
    if (canStep) {
      socket.emit("cellClick", cells, id, room, step, myRoom, enemysRoom);
    }
  };

  const messageSend = () => {
    if (inputValue.length > 0 && inputValue.length < 1000) {
      socket.emit("send message", inputValue, myRoom, enemysRoom);
      setInputValue("");
    }
  };

  const inputChange = (value) => {
    setInputValue(value);
  };

  useEffect(()=>{
    socket.emit("get online");
  }, [])

  socket.once("fieldReload", (cells) => {
    setCells(cells);
  });
  socket.once("blocked", () => {
    setCanStep(false);
    setCurrentStep(getEnemyStep());
  });
  socket.once("unblocked", (intervalVar) => {
    setCanStep(true);
    setCurrentStep(step);
    setIntervalVar(intervalVar);
  });
  socket.once("votes reload", (againVotesIncremented) => {
    setAgainVotes(againVotesIncremented);
  });
  socket.once("vote btn blocked", () => {
    setAgainVotesBlocked(true);
  });
  socket.once("get enemy name", (name) => {
    setEnemyName(name);
  });
  socket.once("get message", (message) => {
    setMessages([...messages, message]);
  });
  socket.once("timeout", (who) => {
    setCanStep(false);
    setMenuModuleOpen(true);
    setWinner("timeout");
    if (who === myRoom) {
      setWhoAfk("me");
    } else {
      setWhoAfk("enemy");
    }
  });
  socket.once("send online", (online) => {
    setOnline(online);
  });

  socket.once("timer decrement", (player, timerSeconds) => {
    if (player === myRoom) {
      setTimer(timerSeconds);
    } else if (player === enemysRoom) {
      setTimerEnemy(timerSeconds);
    }
  });
  socket.once("to menu timer decrement", (timer) => {
    setModalTimer(timer);
  });
  socket.once("to menu", () => {
    navigate("/");
  });

  useEffect(() => {
    if (chatOpen) {
      setUnreadMessages(false);
    }
  }, [chatOpen]);

  useEffect(() => {
    if (!chatOpen && messages.length > 0) {
      setUnreadMessages(true);
    }
  }, [messages]);

  const getEnemyStep = () => {
    if (step === "x") {
      return "o";
    } else if (step === "o") {
      return "x";
    }
  };

  const playAgain = () => {
    if (!againVotesBlocked) {
      socket.emit("play again", room, againVotes, myRoom, enemysRoom);
    }
  };

  useEffect(() => {
    setCells(Array(cellsInLine * cellsInLine).fill(""));
  }, [cellsInLine]);

  return (
    <div className="show">
      {menuModuleOpen && (
        <Modal
          modalTimer={modalTimer}
          whoAfk={whoAfk}
          setMenuModuleOpen={setMenuModuleOpen}
          winner="timeout"
        />
      )}
      {isLoaded ? (
        <>
          {chatOpen && (
            <Chat
              inputValue={inputValue}
              inputChange={inputChange}
              messages={messages}
              messageSend={messageSend}
              setInputValue={setInputValue}
              enemyName={enemyName}
              onClose={() => {
                setChatOpen(false);
              }}
            />
          )}
          <div className={styles.top}>
            <div className={styles.chat}>
              <img
                onClick={() => {
                  setChatOpen(true);
                }}
                src="img/chat.svg"
                alt="Chat"
                width={25}
                height={25}
              />
              {unreadMessages && <div className={styles.unread}></div>}
            </div>
            <Link to="/">
              <div className="back">
                <div className="arrow"></div>
              </div>
            </Link>
            <div className={styles.stat}>
              <div className={styles.item}>
                <div>
                  <div className={styles.nickname}>{myName}</div>
                  {winner === "" && (
                    <div className={styles.seconds}>
                      {" "}
                      {currentStep === step && timer + "s"}{" "}
                    </div>
                  )}
                </div>
                <div className={styles.left}>
                  <Icon step={step} color={"me"} size={35} />
                </div>
                <div className={styles.score}>{statPlayer}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.score}>{statBot}</div>
                <div className={styles.right}>
                  <Icon step={getEnemyStep()} color={"enemy"} size={35} />
                </div>
                <div>
                  <div className={styles.nickname}>{enemyName}</div>
                  {winner === "" && (
                    <div
                      className={styles.seconds + " " + styles.seconds_right}
                    >
                      {currentStep !== step && timerEnemy + "s"}
                    </div>
                  )}
                </div>
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
                              enemyStep={getEnemyStep()}
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
              modalTimer={modalTimer}
              winner={winner}
              step={step}
              againVotesBlocked={againVotesBlocked}
              againVotes={againVotes}
              playAgain={playAgain}
              gamemode={"multiplayer"}
            />
          )}
        </>
      ) : (
        <Loading online={online} />
      )}
    </div>
  );
};

export default Multiplayer;
