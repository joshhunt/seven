// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FriendButtonData } from "@Areas/User/AccountComponents/Internal/BungieFriends/BungieFriendLineItem";
import { FriendsListDataStore } from "@Areas/User/AccountComponents/Internal/BungieFriends/FriendsListDataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { MouseEventHandler, useState } from "react";
import styles from "../../BungieFriends.module.scss";

interface FriendsButtonHandlerProps {
  friendMembershipId: string;
  buttonData?: FriendButtonData[];
  successText?: string;
  errorText?: string;
}

export const FriendsButtonHandler: React.FC<FriendsButtonHandlerProps> = (
  props
) => {
  const [buttonView, setButtonView] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const friendAction = (
    mId: string,
    callback: (mId: string) => Promise<any>
  ) => {
    callback(mId)
      .then((res) => {
        if (mId === props.friendMembershipId) {
          setMessage(res ? props.successText : props.errorText);
          setButtonView(false);
          res && GlobalStateDataStore.refreshUserAndRelatedData();
          res && FriendsListDataStore.actions.fetchAllFriends();
        }
      })
      .catch(ConvertToPlatformError)
      .catch((error) => Modal.error(error));
  };

  return (
    <div className={styles.buttonContainer}>
      {buttonView ? (
        props.buttonData.map((b, i) => {
          return (
            <Button
              key={i}
              size={BasicSize.Small}
              buttonType={"gold"}
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                props.friendMembershipId
                  ? friendAction(props.friendMembershipId, b.callback)
                  : Modal.open(Localizer.Messages.UserCannotFindRequestedUser);
              }}
            >
              {b?.title}
            </Button>
          );
        })
      ) : (
        <p className={styles.message}>{message}</p>
      )}
    </div>
  );
};
