import React from "react";
import styles from "./PlaytestSharedStyles.module.scss";
import { Img } from "@Helpers";

export const PlaytestsPending = () => {
  // This first state is for users who submitted a survey for an earlier playtest which lets them know we submitted an application on their behalf
  return (
    <div className={styles.container}>
      <img
        className={styles.img}
        src={Img("/marathon/icons/check.png")}
        alt="Application Under Review"
      />
      <h1 className={styles.title}>Application Received</h1>
      <span className={styles.subtitle}>
        Your application to past Marathon playtests has been renewed for the
        Closed Technical Test. No further action is needed! If you opted in to
        email communications, you'll receive an email if you're selected.
        Otherwise, bookmark this page to check the status of your application
        starting October 20. (Note: Participation in previous tests doesn't
        guarantee acceptance into the Closed Technical Test.)
      </span>
    </div>
  );
};
