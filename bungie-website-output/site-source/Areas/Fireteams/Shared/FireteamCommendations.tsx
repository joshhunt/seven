// Created by atseng, 2022
// Copyright Bungie, Inc.

import classNames from "classnames";
import styles from "./FireteamTags.module.scss";
import { Img } from "@Helpers";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import React from "react";

interface FireteamCommendationsProps {
  totalScore: number;
  className?: string;
}

export const FireteamCommendations: React.FC<FireteamCommendationsProps> = (
  props
) => {
  return (
    <div className={classNames(styles.commendation, props.className)}>
      <IconCoin
        iconImageUrl={Img("destiny/icons/profile/commendationsicon.png")}
      />
      <span>{props.totalScore ?? 0}</span>
    </div>
  );
};
