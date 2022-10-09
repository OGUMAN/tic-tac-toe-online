import { useRef, useEffect } from "react";
import styles from "./Chat.module.scss";

const Chat = ({ onClose, enemyName, messageSend, messages, inputChange, inputValue }) => {
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
      <div className={styles.chat + " show"}>
        <div onClick={onClose} className="back">
          <div className="arrow"></div>
        </div>

        <div className={styles.correspondence}>
          {messages.length===0 ? <div className={styles.empty}>There are no messages yet</div> : messages.map((message, index) => {
            return (
              <div key={index} className={styles.messageWrapper + ' ' + (message.whose === "my"
              ? styles.myMessageWrapper
              : message.whose === "enemys"
              ? styles.enemysMessageWrapper
              : null)}>
                <div
                  className={
                    styles.message +
                    " " +
                    (message.whose === "my"
                      ? styles.myMessage
                      : message.whose === "enemys"
                      ? styles.enemysMessage
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
          <input autoFocus value={inputValue} onChange={(e)=>{inputChange(e.target.value)}} onKeyDown={(e)=>{enterPressed(e)}} tabIndex="0" type="input" placeholder={`Message to ${enemyName}`} />
          <div onClick={messageSend} className={styles.sendBtn}>
            <img src="img/send.svg" width={35} height={35} alt="send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
