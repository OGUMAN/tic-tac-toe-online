import styles from "./Icon.module.scss";

const Icon = ({ step, size, color }) => {
  return (
    <>
      {step === "x" ? (
        <div className={styles.stat__icon + " " + styles.stat__x}>
          <div
            style={{
              backgroundColor:
                color === "me"
                  ? "#4c7fff"
                  : color === "enemy"
                  ? "#fd3f3f"
                  : null,
              width: `${size}px`,
            }}
            className={styles.cellLine + " " + styles.cellLineFirst}
          ></div>
          <div
            style={{
              backgroundColor:
                color === "me"
                  ? "#4c7fff"
                  : color === "enemy"
                  ? "#fd3f3f"
                  : null,
              width: `${size}px`,
            }}
            className={styles.cellLine + " " + styles.cellLineSecond}
          ></div>
        </div>
      ) : step === "o" ? (
        <div className={styles.stat__icon + " " + styles.stat__o}>
          <div
            style={{
              borderColor:
                color === "me"
                  ? "#4c7fff"
                  : color === "enemy"
                  ? "#fd3f3f"
                  : null,
              width: `${size-5}px`,
              height: `${size-5}px`,
            }}
            className={styles.circle}
          ></div>
        </div>
      ) : null}
    </>
  );
};

export default Icon;
