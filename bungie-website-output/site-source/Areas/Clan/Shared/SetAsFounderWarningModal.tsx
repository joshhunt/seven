// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { useState } from "react";
import styles from "./SetAsFounderWarningModal.module.scss";

interface SetAsFounderWarningModalProps {
  clanId: string;
  membershipType: BungieMembershipType;
  membershipId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SetAsFounderWarningModal: React.FC<SetAsFounderWarningModalProps> = (
  props
) => {
  const clansLoc = Localizer.Clans;
  const [enableConfirmButton, setEnableConfirmButton] = useState(false);

  const setNewFounder = () => {
    Platform.GroupV2Service.AbdicateFoundership(
      props.clanId,
      props.membershipType,
      props.membershipId
    )
      .then(() => {
        //do nothing, page should just update
        props.onConfirm();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        props.onCancel();
        Modal.error(e);
      });
  };

  return (
    <div className={styles.wrapper}>
      <h3>{clansLoc.SetAsFounderConfirmationTitle}</h3>
      <p>
        {Localizer.Format(clansLoc.SetAsFounderConfirmationPrompt, {
          SetAsFounderConfirmationText: clansLoc.SetAsFounderConfirmationText,
        })}
      </p>
      <div>
        <input
          type="text"
          placeholder={clansLoc.SetAsFounderConfirmationText}
          onChange={(e) => {
            if (e.target.value === clansLoc.SetAsFounderConfirmationText) {
              setEnableConfirmButton(true);
            }
          }}
        />
      </div>
      <div className={styles.buttons}>
        <Button
          buttonType={"clear"}
          size={BasicSize.Small}
          onClick={() => props.onCancel()}
        >
          {Localizer.Actions.Cancel}
        </Button>
        <Button
          buttonType={enableConfirmButton ? "gold" : "disabled"}
          disabled={!enableConfirmButton}
          size={BasicSize.Small}
          onClick={() => setNewFounder()}
        >
          {Localizer.Actions.Confirm}
        </Button>
      </div>
    </div>
  );
};
