// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { Img } from "@Helpers";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import classNames from "classnames";
import React from "react";
import styles from "./CrossSaveActiveBadge.module.scss";

interface CrossSaveActiveBadgeProps {
  className: string;
}

export const CrossSaveActiveBadge: React.FC<CrossSaveActiveBadgeProps> = (
  props
) => {
  return (
    <OneLineItem
      className={classNames(props.className, styles.badge)}
      itemTitle={Localizer.Crosssave.CrossSaveIsActive}
      icon={
        <div className={styles.icon}>
          <IconCoin iconImageUrl={Img(`destiny/logos/crosssave_white.png`)} />
        </div>
      }
    />
  );
};
