// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieCredentialType } from "@Enum";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";
import { Localizer } from "@bungie/localization";
import styles from "./SmsPage.module.scss";

interface SmsSignInButtonProps {
  steam: boolean;
}

export const SmsSignInButton: React.FC<SmsSignInButtonProps> = (props) => {
  const onClick = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();
    });
  };

  return (
    <div className={styles.buttonContainer}>
      {props.steam ? (
        <AuthTrigger credential={BungieCredentialType.SteamId}>
          <Button
            buttonType={"white"}
            size={BasicSize.Small}
            className={styles.signIn}
          >
            {Localizer.sms.SignIn}
          </Button>
        </AuthTrigger>
      ) : (
        <Button
          buttonType={"white"}
          size={BasicSize.Small}
          onClick={onClick}
          className={styles.signIn}
        >
          {Localizer.sms.SignIn}
        </Button>
      )}
    </div>
  );
};
