// Copyright Bungie, Inc.

import regStyles from "@Areas/Marathon/Alpha/Pages/Registration/Registration.module.scss";
import styles from "./ExistingAccess.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import React, { FC } from "react";
import { useHistory } from "react-router-dom";

interface ExistingAccessProps {
  cohort?: string;
}

export const ExistingAccess: FC<ExistingAccessProps> = ({ cohort }) => {
  const history = useHistory();

  const handleGoToCodesClick = () => {
    history.push(RouteHelper.MarathonAlphaCodePickup()?.url);
  };

  return (
    <div className={styles.existingAccessContainer}>
      <div className={regStyles.commandPrompt}>
        {"> access_verification_complete > alpha_membership_found"}
      </div>

      <div className={styles.confirmationMessage}>
        {"You already have access to the Marathon Alpha program."}
      </div>

      <div className={styles.highlightedInfo}>
        {"Your Alpha access has been confirmed for cohort: "}
        <span className={regStyles.highlightedText}>
          {cohort || "Marathon Alpha"}
        </span>
        {". You can pick up your platform codes from the game codes page."}
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.selectionButton}
          onClick={handleGoToCodesClick}
        >
          {"GO_TO_PLATFORM_CODES"}
          <span className={styles.arrow}>›</span>
        </button>
      </div>
    </div>
  );
};
