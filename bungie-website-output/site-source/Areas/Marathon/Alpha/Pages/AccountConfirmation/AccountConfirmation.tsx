// Created by larobinson, 2024
// Copyright Bungie, Inc.

import styles from "@Areas/Marathon/Alpha/Pages/Registration/Registration.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import {
  resetFlow,
  setSelectedCredentialType,
  setShowConfirmation,
  setStep,
} from "@Global/Redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React from "react";

interface AccountConfirmationProps {}

export const AccountConfirmation: React.FC<AccountConfirmationProps> = (
  props
) => {
  const dispatch = useAppDispatch();
  const { currentStep, validAlphaCredential } = useAppSelector(
    (state) => state.registration
  );
  const handleConfirm = () => {
    dispatch(setShowConfirmation(false));
    dispatch(setStep(currentStep + 1));
  };

  const handleSignOut = async () => {
    dispatch(resetFlow());
    const returnUrl = window.location.href;

    window.location.href = `/en/User/SignOut?bru=${encodeURIComponent(
      returnUrl
    )}`;
  };

  const membershipTypeNumeral = UserUtils.getMembershipTypeFromCredentialType(
    validAlphaCredential.credentialType
  );

  return (
    <div className={styles.confirmationContent}>
      <div className={styles.commandPrompt}>{"> account_found > "}</div>
      <div className={styles.accountDetails}>
        <div className={styles.widthMaintainer}>
          {"Account Name: "}
          <span className={styles.highlightedTextBig}>
            {validAlphaCredential.credentialDisplayName}
          </span>
          <br />
          {"Type: "}
          <span className={styles.highlightedText}>
            {Localizer.platforms[BungieMembershipType[membershipTypeNumeral]]}
          </span>
        </div>
        <div className={styles.confirmationPrompt}>
          {"Do you want to use this account for the Marathon alpha?"}
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonGrid}>
            <button className={styles.selectionButton} onClick={handleConfirm}>
              {"YES_CONTINUE"}
              <span className={styles.arrow}>›</span>
            </button>
            <button
              className={classNames(styles.selectionButton)}
              onClick={handleSignOut}
            >
              {"NO_SIGN_OUT"}
              <span className={styles.arrow}>›</span>
            </button>
          </div>
          <button
            className={classNames(styles.selectionButton, styles.backButton)}
            onClick={() => {
              dispatch(setShowConfirmation(false));
              dispatch(setSelectedCredentialType(null));
            }}
          >
            {"BACK_TO_PLATFORM_SELECT"}
            <span className={styles.arrow}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};
