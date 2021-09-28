// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/BungieFriends.module.scss";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import React from "react";

// These might come from different places depending on what kind of data we have at hand
interface FriendSpecificProps {
  bungieName: string;
  membershipId: string;
  icon: React.ReactNode;
}

// This is data that is specific to the action/use of the line item
export interface LineItemRelevantProps {
  itemSubtitle?: React.ReactNode;
  flair?: React.ReactNode;
}

type FriendLineItemProps = FriendSpecificProps & LineItemRelevantProps;

export const FriendLineItem: React.FC<FriendLineItemProps> = (props) => {
  return (
    <TwoLineItem
      itemTitle={props.bungieName}
      itemSubtitle={props.itemSubtitle}
      className={styles.twoLine}
      icon={props.icon}
      flair={props.flair}
    />
  );
};
