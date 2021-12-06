// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ActionSuccessModal } from "@Areas/User/AccountComponents/Internal/ActionSuccessModal";
import { ReportUser } from "@Areas/User/ProfileComponents/ReportUser";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { Contracts, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import styles from "@UIKit/Controls/Modal/ConfirmationModal.module.scss";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { BasicSize } from "@UIKit/UIKitUtils";
import { IBungieName } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { ReactElement, useState } from "react";

interface BlockAndReportModalProps {
  membershipId: string;
  bungieGlobalNameObject: IBungieName;
  openModal: boolean;
  onSuccess: () => void;
  onClose: () => void;
  onError: (e: PlatformError) => void;
}

export const BlockAndReportModal: React.FC<BlockAndReportModalProps> = (
  props
) => {
  const profileLoc = Localizer.Profile;

  const [confirmSendReport, setConfirmSendReport] = useState(false);
  const [showReportOptionsChecked, setShowReportOptionsChecked] = useState(
    false
  );

  const block = () => {
    //Reason and ItemContextId are set to their defaults here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
    const ignoreItemRequest = {
      ignoredItemId: props.membershipId,
      ignoredItemType: IgnoredItemType.User,
      comment: "",
      reason: "0",
      itemContextId: "0",
      itemContextType: 0,
      requestedPunishment: ModeratorRequestedPunishment.Unknown,
      requestedBlastBan: false,
    } as Contracts.IgnoreItemRequest;

    Platform.IgnoreService.IgnoreItem(ignoreItemRequest)
      .then((response: Contracts.IgnoreDetailResponse) => {
        let message: string | ReactElement = "";

        if (response) {
          message = <ActionSuccessModal />;
          props.onSuccess();
        } else {
          message = profileLoc.ThereWasAProblemBlocking;
        }

        Modal.open(message);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const blockAndReport = () => {
    //block and report
    block();

    setConfirmSendReport(true);
  };

  return (
    <Modal preventUserClose={true} open={props.openModal}>
      <div className={styles.confirmationModalContent}>
        <div className={styles.topContent}>
          <Icon
            iconName={"warning"}
            iconType="material"
            className={classNames(styles.icon, styles.warning)}
          />
          <div className={styles.message}>
            <h2 className={styles.modalTitle}>
              {Localizer.Format(profileLoc.AreYouSureYouWantToBlock, {
                username:
                  props.bungieGlobalNameObject.bungieGlobalName +
                  props.bungieGlobalNameObject.bungieGlobalCodeWithHashtag,
              })}
            </h2>
            <Checkbox
              checked={showReportOptionsChecked}
              onChecked={() =>
                setShowReportOptionsChecked(!showReportOptionsChecked)
              }
              label={profileLoc.YouCanAlsoReportThisUser}
            />
            {showReportOptionsChecked && (
              <ReportUser
                ignoredItemId={props.membershipId}
                sendReport={confirmSendReport}
                sentReport={props.onSuccess}
              />
            )}
          </div>
        </div>
        <div className={classNames(styles.buttons, styles.buttonsWithSpace)}>
          <Button
            className={styles.cancelButton}
            size={BasicSize.Small}
            buttonType={"white"}
            onClick={() => {
              props.onClose();
            }}
          >
            {Localizer.Actions.canceldialogbutton}
          </Button>
          {showReportOptionsChecked && (
            <Button
              className={styles.confirmButton}
              size={BasicSize.Small}
              buttonType={"gold"}
              onClick={() => blockAndReport()}
            >
              {profileLoc.BlockAndReport}
            </Button>
          )}
          <Button
            className={styles.confirmButton}
            size={BasicSize.Small}
            buttonType={"gold"}
            onClick={() => block()}
          >
            {profileLoc.Block}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
