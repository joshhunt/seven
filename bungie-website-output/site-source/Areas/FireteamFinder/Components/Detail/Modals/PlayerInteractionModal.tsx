// Created by v-rgordon, 2024
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { ToastContent } from "@UIKit/Controls/Toast/Toast";
import React, { FC } from "react";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Localizer } from "@bungie/localization/Localizer";
import styles from "./PlayerInteractionModal.module.scss";

interface PlayerInteractionModalProps {
  userNameProps: UserNameProps;
  userActionProps: UserActionProps;
}

type UserNameProps = {
  name: string | React.ReactElement;
  playerHash: string | React.ReactElement;
  platform: string | React.ReactElement;
  avatarURL: string;
};

type UserActionProps = {
  bnetProfile: () => void;
  kickPlayer?: () => void;
  invite?: () => void;
};

export const PlayerInteractionModal: FC<PlayerInteractionModalProps> = (
  props
) => {
  const { avatarURL, playerHash, name, platform } = props.userNameProps;
  const { bnetProfile, kickPlayer, invite } = props.userActionProps;

  const UserActionArr = [
    {
      title: Localizer.Fireteams.ViewProfile,
      callback: bnetProfile,
    },
    {
      title: Localizer.Fireteams.Kick,
      callback: kickPlayer,
    },
    {
      title: Localizer.Fireteams.InviteToInGameFireteam,
      callback: invite,
    },
  ];

  return (
    <>
      <TwoLineItem
        className={styles.modalWrapper}
        icon={<img className={styles.avatar} alt="" src={avatarURL} />}
        itemTitle={
          <div className={styles.row}>
            <span>{name}</span>
            <span className={styles.playerHash}>{playerHash}</span>
          </div>
        }
        itemSubtitle={platform}
      />
      {UserActionArr.map((user, index) => {
        const { title, callback } = user;
        if (!callback) {
          return null;
        }

        return (
          <CustomOneLineItem title={title} callback={callback} key={index} />
        );
      })}
    </>
  );
};

type CustomOneLineItem = {
  title: string;
  callback: (e?: React.MouseEvent) => void;
  key: number | string;
};
const CustomOneLineItem: FC<CustomOneLineItem> = (props) => {
  const { title, callback, key } = props;

  return (
    <div key={key} className={styles.oneLineItem}>
      <span onClick={callback}>{title}</span>
    </div>
  );
};
