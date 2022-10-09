import { useState } from "react";
import styles from "./Profile.module.scss";

const Profile = ({ setNickname, setProfileOpened }) => {
  const [inputValue, setInputValue] = useState("");
  const [btnBlocked, setBtnBlocked] = useState(true);

  const inputChange = (value) => {
    setInputValue(value);
    if (value.length >= 3 && value.length <= 16) {
      setBtnBlocked(false);
    } else {
      setBtnBlocked(true);
    }
  };

  const setName = () => {
    if (inputValue.length >= 3 && inputValue.length <= 16) {
      setNickname(inputValue);
      setProfileOpened(false);
    }
  };

  const enterPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setName();
    }
  };

  return (
    <div className="wrapper">
      <div className={styles.modal + " show"}>
        <div
          onClick={() => {
            setProfileOpened(false);
          }}
          className="back"
        >
          <div className="arrow"></div>
        </div>
        <div className={styles.title}>Who are you?</div>
        <input
          autoFocus
          onKeyDown={(e) => {
            enterPressed(e);
          }}
          tabIndex="0"
          onChange={(e) => {
            inputChange(e.target.value);
          }}
          className={styles.input}
          placeholder="Input your name"
        />
        <div
          onClick={setName}
          className={(btnBlocked && styles.blocked) + " " + styles.btn}
        >
          Continue
        </div>
      </div>
    </div>
  );
};

export default Profile;
