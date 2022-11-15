// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";
import styles from "./EmailToRewardsBanner.module.scss";

export const EmailToRewardsBanner = () => {
  return (
    <div className={styles.banner}>
      <TwoLineItem
        className={styles.bg}
        itemTitle={Localizer.Nav.BungieRewards}
        itemSubtitle={
          <div className={styles.subtitle}>
            {Localizer.UserPages.DigitalRewardsEligible}
          </div>
        }
        icon={
          <IconCoin
            iconImageUrl={Img("bungie/icons/logos/bungienet/septagon.png")}
          />
        }
        flair={
          <Button
            buttonType={"gold"}
            size={BasicSize.Small}
            url={RouteHelper.DigitalRewards()}
            className={styles.button}
          >
            {Localizer.UserPages.SeeBungieRewards}
          </Button>
        }
      />
    </div>
  );
};
