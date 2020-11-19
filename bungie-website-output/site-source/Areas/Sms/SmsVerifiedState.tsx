// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { SmsDataStore } from "@Areas/Sms/SmsDataStore";
import { Localizer } from "@Global/Localizer";
import { Platform } from "@Platform";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";
import styles from "./SmsPage.module.scss";

interface SmsVerifiedStateProps {}

export const SmsVerifiedState: React.FC<SmsVerifiedStateProps> = (props) => {
  const openConfirmationModal = () => {
    ConfirmationModal.show({
      type: "warning",
      title: Localizer.Sms.RemovePhoneNumber,
      children: Localizer.Sms.ConfirmRemove,
      confirmButtonProps: {
        labelOverride: Localizer.Sms.Remove,
        onClick: () => {
          removePhoneLinking();

          return true;
        },
      },
    });
  };

  const removePhoneLinking = () => {
    Platform.UserService.RemovePhoneNumber()
      .then((response) => {
        response && SmsDataStore.updatePhase("PhoneEntry");
        SmsDataStore.updateLastDigits("");
      })
      .catch(Modal.error);
  };

  return (
    <>
      <div>{Localizer.Sms.AccountVerified}</div>
      <div className={styles.verifiedState}>
        <Icon
          iconType={"fa"}
          iconName={"check-circle"}
          className={styles.successIcon}
        />
        <div className={styles.phoneTemplate}>
          {Localizer.Sms.settingsverifiedmessage}
        </div>
      </div>
      <Button
        buttonType={"white"}
        size={BasicSize.Small}
        onClick={openConfirmationModal}
        className={styles.removeButton}
      >
        {Localizer.Sms.RemovePhoneNumber}
      </Button>
    </>
  );
};
