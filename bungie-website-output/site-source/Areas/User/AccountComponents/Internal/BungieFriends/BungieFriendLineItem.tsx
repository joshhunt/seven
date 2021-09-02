// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { FriendsButtonHandler } from "@Areas/User/AccountComponents/Internal/BungieFriends/FriendsButtonHandler";
import { BungieMembershipType } from "@Enum";
import { Friends } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import styles from "../../BungieFriends.module.scss";

export interface FriendButtonData {
  title: string;
  callback: (mId: string) => Promise<any>;
}

interface BungieFriendLineItemProps {
  bungieFriend: Friends.BungieFriend;
  itemSubtitle: React.ReactNode;
  buttonData: FriendButtonData[];
  successText: string;
  errorText: string;
}

export const BungieFriendLineItem: React.FC<BungieFriendLineItemProps> = ({
  bungieFriend,
  ...props
}) => {
  return (
    <Anchor
      className={styles.friendLine}
      url={RouteHelper.TargetProfile(
        bungieFriend?.bungieNetUser?.membershipId,
        BungieMembershipType.BungieNext
      )}
    >
      <hr />
      <TwoLineItem
        itemTitle={
          UserUtils.getBungieNameFromBnetBungieFriend(bungieFriend)
            ?.bungieGlobalName
        }
        itemSubtitle={props.itemSubtitle}
        className={styles.twoLine}
        icon={
          <IconCoin
            iconImageUrl={UserUtils.bungieFriendProfilePicturePath(
              bungieFriend
            )}
          />
        }
        flair={
          <FriendsButtonHandler
            buttonData={props.buttonData}
            friendMembershipId={bungieFriend?.bungieNetUser?.membershipId}
            successText={props.successText}
            errorText={props.errorText}
          />
        }
      />
    </Anchor>
  );
};
