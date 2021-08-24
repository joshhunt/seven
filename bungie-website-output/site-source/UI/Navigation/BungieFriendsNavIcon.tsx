// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import React, { HTMLProps } from "react";
import styles from "./UserMenu.module.scss";

interface BungieFriendsNavIconProps extends HTMLProps<HTMLDivElement> {}

export const BungieFriendsNavIcon: React.FC<BungieFriendsNavIconProps> = (
  props
) => {
  return (
    <div>
      <Anchor url={RouteHelper.BungieFriends()} className={styles.trigger}>
        <Icon
          iconType={"material"}
          iconName={`people_alt`}
          className={styles.bungieFriendsIcon}
        />
      </Anchor>
    </div>
  );
};
