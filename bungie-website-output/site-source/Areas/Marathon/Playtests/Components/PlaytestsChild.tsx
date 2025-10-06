import React from "react";
import styles from "./PlaytestSharedStyles.module.scss";
import { Img } from "@Helpers";

export const PlaytestsChild: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.img} src={Img("/marathon/icons/warning.svg")} />
      <h1 className={styles.title}>Unable to Participate</h1>
      <p className={styles.message}>
        Sorry, but players under the age of 18 aren’t eligible to participate in
        the Marathon Closed Technical Test.
      </p>
    </div>
  );
};
