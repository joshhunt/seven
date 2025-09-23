import * as React from "react";
import styles from "./PlaytestsPending.module.scss";

export const PlaytestsPending: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thanks for applying</h1>
      <p className={styles.message}>
        Your Marathon playtest application is{" "}
        <span className={styles.accent}>pending</span>. We’ll update your access
        here when it’s ready.
      </p>
    </div>
  );
};
