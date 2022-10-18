import styles from "./Menu.module.scss";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import { useState } from "react";

const Menu = ({
  profileJson,
  langJson = {},
  theme,
  whoAfk,
  setNickname,
  nickname,
}) => {
  const [profileOpened, setProfileOpened] = useState(false);

  return (
    <div className="show">
      {profileOpened && (
        <Profile
          langJson={profileJson}
          theme={theme}
          setProfileOpened={setProfileOpened}
          setNickname={setNickname}
        />
      )}
      <div
        className={
          styles.menu + " " + (theme === "white" ? styles.menuWhite : "")
        }
      >
        <div
          onClick={() => {
            setProfileOpened(true);
          }}
          className={
            (theme === "white" ? styles.profileWhite : "") +
            " " +
            styles.profile
          }
        >
          <img
            className={styles.icon}
            src="img/settings.svg"
            alt="settings"
            height={15}
            width={15}
          />
          <div className={styles.nickname}>{nickname}</div>
        </div>
        <div className={styles.btns}>
          <div className={styles.btns_solo}>
            <Link to="solo">
              <div className={styles.btn}>
                <div className={styles.btn__text}>
                  <span>🤖</span>
                  {langJson["solo"]}
                </div>
              </div>
            </Link>
            <Link to="solo-settings" className={styles.btn_settings}>
              <div className={styles.btn__text}>⚙️</div>
            </Link>
          </div>
          <Link to="multiplayer">
            <div className={styles.btn}>
              <div className={styles.btn__text}>
                <span>🤝</span> {langJson["multiplayer"]}
              </div>
            </div>
          </Link>
          <Link to="settings">
            <div
              className={
                styles.btn + " " + (theme === "white" ? styles.btnWhite : "")
              }
            >
              <div className={styles.btn__text}>
                <span>⚙️</span> {langJson["settings"]}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
