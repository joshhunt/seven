// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import styles from "../../../../../UI/UIKit/Controls/Modal/ConfirmationModal.module.scss";
import { PlatformError } from "@CustomErrors";
import { Contracts, Friends, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";

interface RemoveFriendModalProps {
  bungieFriend: Friends.BungieFriend;
  openModal: boolean;
  onRemove: () => void;
  onClose: () => void;
  onErrorRemovingFriend: (e: PlatformError) => void;
}

export const RemoveFriendModal: React.FC<RemoveFriendModalProps> = (props) => {
  const friendsLoc = Localizer.friends;
  const membershipId = props.bungieFriend?.bungieNetUser?.membershipId;

  const removeFriend = () => {
    Platform.SocialService.RemoveFriend(membershipId)
      .then((response) => {
        props.onRemove();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        props.onErrorRemovingFriend(e);
      });
  };

  const blockAndRemoveFriend = () => {
    //Reason and ItemContextId are set to their defaults here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
    const ignoreItemRequest = {
      ignoredItemId: membershipId,
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
        removeFriend();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        props.onErrorRemovingFriend(e);
      });
  };

  const handleRemoveFriendClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    removeFriend();
  };

  const handleBlockAndRemoveFriendClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    blockAndRemoveFriend();
  };

  if (!props.bungieFriend || !props.openModal) {
    return null;
  }

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
              {Localizer.Format(friendsLoc.ConfirmFriendRemoval, {
                Username: UserUtils.getBungieNameFromBnetBungieFriend(
                  props.bungieFriend
                )?.bungieGlobalName,
              })}
            </h2>
            <div className={styles.message}>
              {friendsLoc.BlockAndRemoveFriendDesc}
            </div>
          </div>
        </div>
        <div className={classNames(styles.buttons, styles.buttonsWithSpace)}>
          <Button
            className={styles.cancelButton}
            size={BasicSize.Small}
            buttonType={"white"}
            onClick={(e) => {
              e.preventDefault();
              props.onClose();
            }}
          >
            {Localizer.Actions.canceldialogbutton}
          </Button>
          <Button
            className={styles.confirmButton}
            size={BasicSize.Small}
            buttonType={"gold"}
            onClick={(e) => handleBlockAndRemoveFriendClick(e)}
          >
            {friendsLoc.BlockAndRemoveFriend}
          </Button>
          <Button
            className={styles.confirmButton}
            size={BasicSize.Small}
            buttonType={"gold"}
            onClick={(e) => handleRemoveFriendClick(e)}
          >
            {friendsLoc.Remove}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
