import { socket } from "./socket";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Game.module.scss";
import Cell from "./Cell";
import Loading from "./Loading";
import Icon from "./Icon";
import Modal from "./Modal";
import Chat from "./Chat";
import messageAudio from "../../sounds/plop.mp3";
import loseAudio from "../../sounds/lose.mp3";
import wonAudio from "../../sounds/won.mp3";
import timeoutAudio from "../../sounds/timeout.mp3";

const Multiplayer = ({
  soundOn,
  gamemode,
  loadingJson,
  chatJson,
  modalLangJson,
  myName,
  theme,
}) => {
  let navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [room, setRoom] = useState("");
  const [myRoom, setMyRoom] = useState("");
  const [opponentRoom, setOpponentsRoom] = useState("");
  const [step, setStep] = useState("");
  const [canStep, setCanStep] = useState(false);
  const [againVotes, setAgainVotes] = useState(0);
  const [againVotesBlocked, setAgainVotesBlocked] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [opponentName, setOpponentName] = useState("");
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
  const [timer, setTimer] = useState(35);
  const [timerEnemy, setTimerEnemy] = useState(35);
  const [menuModuleOpen, setMenuModuleOpen] = useState(false);
  const [whoAfk, setWhoAfk] = useState("");
  const [modalTimer, setModalTimer] = useState(10);
  const [online, setOnline] = useState(0);
  const [leaved, setLeaved] = useState(false);
  const plop = new Audio(messageAudio);
  const lose = new Audio(loseAudio);
  const won = new Audio(wonAudio);
  const timeout = new Audio(timeoutAudio);

  // when winner changing open modal
  useEffect(() => { 
    if (winner !== "" && winner !== "timeout") { // avoid opening modal when game just started
      setTimeout(() => {
        setModalOpen(true);
      }, 2500);
    } else {
      setModalOpen(false);
    }

    if (winner === step && winner !== "") {
      // when game starts client still doesn't know it's step, so winner is everyone
      setStatPlayer(statPlayer + 1); // incrementing player's score by 1
      if (soundOn) {
        setTimeout(() => {
          won.play();
        }, 2000);
      }
    } else if (winner === getOpponentStep() && winner !== "") {
      // when game starts client still doesn't know it's step, so winner is everyone
      setStatBot(statBot + 1); // incrementing opponent's score by 1
      if (soundOn) {
        setTimeout(() => {
          lose.play();
        }, 2000);
      }
    }
  }, [winner]);

  useEffect(() => {
    if (room === "" && myRoom === "") {
      // avoid emit when game started
      socket.emit("im waiting", myRoom, room);
    }
    return () => {
      socket.emit("im leaving", myRoom, room, opponentRoom); // unmount (if player just will leave to menu, disconnect event from server will not work)
    };
  }, [myRoom, room]);

  const cellsOnClick = (id) => { 
    if (canStep) { // can player step?
      socket.emit("cellClick", cells, id, room, step, myRoom, opponentRoom);
    }
  };

  const messageSend = () => { // Enter or send button pressed
    if (inputValue.length > 0 && inputValue.length < 1000) {
      socket.emit("send message", inputValue, myRoom, opponentRoom); // send message to server
      setInputValue("");
    }
  };

  const inputChange = (value) => {
    setInputValue(value);
  };

  socket.on("disconnected", () => { // when opponent left the game
    if (winner === "") {
      setLeaved(true);
      setModalOpen(true);
    }
  });

  socket.on("timer decrement", (player, timerSeconds) => { // when timer decrements
    if (player === myRoom) {
      setTimer(timerSeconds);
    } else if (player === opponentRoom) {
      setTimerEnemy(timerSeconds);
    }
  });


  socket.on("unblocked", (intervalVar) => { // server unblocking me to step
    setCanStep(true);
    setCurrentStep(step);
  });

  // restarting game
  socket.on("restart", () => {
    setWinner("");
    setCells(["", "", "", "", "", "", "", "", ""]);
    setAgainVotes(0);
    setAgainVotesBlocked(false);
    setWinnerCells([]);
    setStep(getOpponentStep());
    if (step === "x") {
      setCurrentStep(step);
    } else {
      setCurrentStep(getOpponentStep());
    }
    if (step === "x") {
      setCanStep(false);
    } else if (step === "o") {
      setCanStep(true);
    }
  });
  socket.on("blocked", () => { // server blocking me to step
    setCanStep(false);
    setCurrentStep(getOpponentStep());
  });
  
  socket.on("get message", (message) => { // getting message from server
    setMessages([...messages, message]);
  });

  useEffect(() => {
    socket.emit("get online"); // get online request
    socket.on("send online", (online) => { // getting online
      setOnline(online);
    });

    // when step timer = 0
    socket.on("timeout", (who) => {
      setChatOpen(false); // close the chat
      setCanStep(false);
      setMenuModuleOpen(true);
      setWinner("timeout");
      if (who === myRoom) {
        setWhoAfk("me");
      } else {
        setWhoAfk("opponent");
      }
      if (soundOn) {
        timeout.play();
      }
    });

    // when timer updated
    socket.on("to menu timer decrement", (timer) => {
      setModalTimer(timer);
    });

    // send player to menu
    socket.on("to menu", () => {
      navigate("/");
    });

    // when get cells from server
    socket.on("fieldReload", (cells) => {
      setCells(cells);
    });

    // when votes number updated
    socket.on("votes reload", (againVotesIncremented) => {
      setAgainVotes(againVotesIncremented);
    });

    socket.on("vote btn blocked", () => {
      setAgainVotesBlocked(true);
    });

    // when server is sending opponent's name
    socket.on("get opponent name", (name) => {
      setOpponentName(name);
    });

    // when game started
    socket.on("game started", (room, step, myRoom, opponentRoom) => {
      setMyRoom(myRoom);
      setOpponentsRoom(opponentRoom);
      setRoom(room);
      setIsLoaded(true);
      setStep(step);
      setCells(["", "", "", "", "", "", "", "", ""]);
      socket.emit("send name", myName, opponentRoom);
      setMenuModuleOpen(false);
    });

    // when me or opponent won
    socket.on("win", (winnerCells, angle, winner) => {
      setChatOpen(false); // close the chat{
      setWinnerCells(winnerCells);
      setAngle(angle);
      setWinner(winner);
    });

    return () => {
      // remove all listeners to avoid multiple them after rejoin
      socket.off("timeout");
      socket.off("restart");
      socket.off("win");
      socket.off("game started");
      socket.off("get message");
      socket.off("get opponent name");
      socket.off("vote btn blocked");
      socket.off("votes reload");
      socket.off("unblocked");
      socket.off("blocked");
      socket.off("fieldReload");
      socket.off("to menu");
      socket.off("to menu timer decrement");
      socket.off("send online");
      socket.off("get online");
    };
  }, []);

  // remove unread messages when opened chat
  useEffect(() => {
    if (chatOpen) {
      setUnreadMessages(false);
    }
  }, [chatOpen]);

  useEffect(() => {
    // set unread messages
    if (!chatOpen && messages.length > 0) {
      setUnreadMessages(true);
    }
    // play sound when opponent sends message
    if (messages[messages.length - 1]?.whose === "opponents" && soundOn) {
      plop.play();
    }
  }, [messages]);

  // get opponent's step relative my step
  const getOpponentStep = () => {
    if (step === "x") {
      return "o";
    } else if (step === "o") {
      return "x";
    }
  };

  // when i click play again
  const playAgain = () => {
    if (!againVotesBlocked) {
      // did i already click?
      socket.emit("play again", room, againVotes, myRoom, opponentRoom);
    }
  };

  // close chat modal when Escape pressed
  const enterPressed = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setChatOpen(false);
    }
  };

  return (
    <div
      className="show"
      onKeyDown={(e) => {
        enterPressed(e);
      }}
    >
      {menuModuleOpen && (
        <Modal
          leaved={leaved}
          modalLangJson={modalLangJson}
          theme={theme}
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
              chatJson={chatJson}
              theme={theme}
              inputValue={inputValue}
              inputChange={inputChange}
              messages={messages}
              messageSend={messageSend}
              setInputValue={setInputValue}
              opponentName={opponentName}
              onClose={() => {
                setChatOpen(false);
              }}
            />
          )}
          <div className={styles.top}>
            <div className={styles.chat}>
              <svg
                onClick={() => {
                  setChatOpen(true);
                }}
                width={25}
                height={25}
                alt="Chat"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill={theme === "white" ? "#000000" : "#ffffff"}
              >
                <title>53-Speech Bubble</title>
                <g id="_53-Speech_Bubble" data-name="53-Speech Bubble">
                  <path d="M12,31a1,1,0,0,1-1-1V25H1a1,1,0,0,1-1-1V2A1,1,0,0,1,1,1H31a1,1,0,0,1,1,1V24a1,1,0,0,1-1,1H18.41l-5.71,5.71A1,1,0,0,1,12,31ZM2,23H12a1,1,0,0,1,1,1v3.59l4.29-4.29A1,1,0,0,1,18,23H30V3H2Z" />
                  <rect x="7" y="7" width="10" height="2" />
                  <rect x="7" y="12" width="18" height="2" />
                  <rect x="7" y="17" width="18" height="2" />
                </g>
              </svg>
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
                  <Icon step={getOpponentStep()} color={"opponent"} size={35} />
                </div>
                <div>
                  <div className={styles.nickname}>{opponentName}</div>
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
                              opponentStep={getOpponentStep()}
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
              leaved={leaved}
              modalLangJson={modalLangJson}
              theme={theme}
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
        <Loading
          theme={theme}
          gamemode={gamemode}
          loadingJson={loadingJson}
          online={online}
        />
      )}
    </div>
  );
};

export default Multiplayer;
