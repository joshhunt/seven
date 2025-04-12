import { ConvertToPlatformError } from "@ApiIntermediary";
import { EmailValidationStatus } from "@Enum";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "./EmailVerification.module.scss";

interface IEmailVerification {
  email: string;
  onContinue: () => void;
}

export const EmailVerification: FC<IEmailVerification> = ({
  email,
  onContinue,
}) => {
  const history = useHistory();
  const [emailVerified, setEmailVerified] = useState(false);

  const emailSettingsLink =
    (RouteHelper.EmailAndSms()?.legacy ? "" : "7") +
    RouteHelper.EmailAndSms()?.url;
  const handleEmailSettings = () => {
    const anchor = UrlUtils.getHrefAsLocation(emailSettingsLink);
    history.push(UrlUtils.resolveUrl(anchor, false, true));
  };

  useEffect(() => {
    Platform.UserService.GetCurrentUser()
      .then((user) => {
        if (
          user?.emailStatus &&
          (user.emailStatus & EmailValidationStatus.VALID) ===
            EmailValidationStatus.VALID
        ) {
          setEmailVerified(true);
        } else {
          setEmailVerified(false);
        }
      })
      .catch((e) => {
        ConvertToPlatformError(e).then((error) => {
          console.error(error);
        });
      });
  }, []);

  return (
    <div className={styles.verificationBlock}>
      <div className={styles.commandPrompt}>
        {emailVerified
          ? "> email_verified > alpha_communications"
          : "> email_verification_required >"}
      </div>

      {!emailVerified && (
        <div className={styles.emailStatus}>
          <span className={styles.warningText}>WARNING: </span>
          {
            "Unverified Email Found. Email verification is required to proceed with alpha registration"
          }
        </div>
      )}

      {!emailVerified && (
        <div className={styles.consentPrompt}>
          {
            "After verification, please allow up to 5 minutes for your account to reflect its verified status."
          }
        </div>
      )}

      <div className={styles.emailDisplay}>
        <div className={styles.label}>
          {emailVerified ? "Verified Email: " : "Current Email: "}
        </div>
        <span className={styles.emailHighlighted}>
          {email ? email : "void"}
        </span>
      </div>

      <div className={styles.optionsGrid}>
        {emailVerified && (
          <button className={styles.selectionButton} onClick={onContinue}>
            {"CONFIRM_AND_CONTINUE"}
            <span className={styles.arrow}>›</span>
          </button>
        )}
        {!emailVerified && (
          <button
            className={styles.selectionButton}
            onClick={handleEmailSettings}
          >
            {"VERIFY_EMAIL"}
            <span className={styles.arrow}>›</span>
          </button>
        )}
        <button
          className={styles.selectionButton}
          onClick={handleEmailSettings}
        >
          {"CHANGE_EMAIL"}
          <span className={styles.arrow}>›</span>
        </button>
      </div>

      {emailVerified && (
        <div className={styles.consentPrompt}>
          {
            "By continuing, you agree to receive communications about the Marathon Alpha"
          }
        </div>
      )}
    </div>
  );
};
