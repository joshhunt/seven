// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import { Friends } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";

interface BungieFriendCardProps {
  friend: Friends.BungieFriend;
  onClick?: () => void;
}

export const BungieFriendCard: React.FC<BungieFriendCardProps> = (props) => {
  const bungieName = UserUtils.getBungieNameFromBnetBungieFriend(props.friend);
  const bungieNameWithCode = bungieName
    ? `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`
    : "";

  return (
    <li
      className={styles.memberCard}
      key={props.friend.bungieNetUser.membershipId}
      onClick={() => (props.onClick ? props.onClick() : null)}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div
            className={styles.headerIcon}
            style={{
              backgroundImage: `url(${props.friend.bungieNetUser?.profilePicturePath})`,
            }}
          />
          <div className={styles.headerDetails}>
            <div className={styles.cardTitle}>
              <div>{bungieNameWithCode}</div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
