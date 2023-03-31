import { useState } from "react";
import styles from "./Profile.module.scss";

const Profile = ({ langJson, theme, setNickname, setProfileOpened }) => {
  const [inputValue, setInputValue] = useState("");
  const [btnBlocked, setBtnBlocked] = useState(true);

  const inputChange = (value) => {
    const valueStrip = value.trim();
    setInputValue(valueStrip)
    if (valueStrip.length >= 3 && valueStrip.length <= 16) {
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

  const anyKeyPressed = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setName();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setProfileOpened(false);
    }
  };

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
        <div
          onClick={() => {
            setProfileOpened(false);
          }}
          className="back"
        >
          <div className="arrow"></div>
        </div>
        <div className={styles.title}>{langJson["title"]}</div>
        <input
          autoFocus
          onKeyDown={(e) => {
            anyKeyPressed(e);
          }}
          tabIndex="0"
          onChange={(e) => {
            inputChange(e.target.value);
          }}
          className={styles.input}
          placeholder={langJson["placeholder"]}
          value={inputValue}
        />
        <div
          onClick={setName}
          className={(btnBlocked && styles.blocked) + " " + styles.btn}
        >
          {langJson["btn"]}
        </div>
      </div>
    </div>
  );
};

export default Profile;
