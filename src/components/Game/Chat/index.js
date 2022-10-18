import { useRef, useEffect } from "react";
import styles from "./Chat.module.scss";

const Chat = ({ chatJson, theme, onClose, opponentName, messageSend, messages, inputChange, inputValue }) => {
  const messagesEndRef = useRef(null);

  const scrollDown = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if(messages[messages.length-1]?.whose==="my"){
      scrollDown();
    }
  }, [messages]);

  useEffect(() => {
    scrollDown();
  }, []);

  const enterPressed = (e) => {
    if(e.key==="Enter"){
      e.preventDefault();
      messageSend();
    }
  }

  return (
    <div className="wrapper">
      <div className={(theme==="white" ? styles.chatWhite : "") + " " + styles.chat + " show"}>
        <div onClick={onClose} className="back">
          <div className="arrow"></div>
        </div>

        <div className={styles.correspondence}>
          {messages.length===0 ? <div className={styles.empty}>{chatJson.empty}</div> : messages.map((message, index) => {
            return (
              <div key={index} className={styles.messageWrapper + ' ' + (message.whose === "my"
              ? styles.myMessageWrapper
              : message.whose === "opponent"
              ? styles.opponentMessageWrapper
              : null)}>
                <div
                  className={
                    styles.message +
                    " " +
                    (message.whose === "my"
                      ? styles.myMessage                      : message.whose === "opponent"
                      ? styles.opponentMessage
                      : null)
                  }
                >
                  <div className={styles.text}>{message.text}</div>
                  <div className={styles.time}>{message.time}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
        <div className={styles.input}>
          <input autoFocus value={inputValue} onChange={(e)=>{inputChange(e.target.value)}} onKeyDown={(e)=>{enterPressed(e)}} tabIndex="0" type="input" placeholder={`${chatJson.placeholder} ${opponentName}`} />
          <div onClick={messageSend} className={(theme==="white" ? styles.sendBtnWhite : "") + " " + styles.sendBtn}>
            <svg width={35} height={35} alt="send" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Artboard-155</title><g id="Send"><path d="M20.447,11.105l-16-8A1,1,0,0,0,3.152,4.53L7.82,12,3.152,19.47a1,1,0,0,0,1.3,1.425l16-8a1,1,0,0,0,0-1.79ZM6.731,17.517,9.554,13H12a1,1,0,0,0,0-2H9.554L6.731,6.483,17.764,12Z" style={{fill: theme==="white" ? "#232323" : "#b5b5b5"}}/></g></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
