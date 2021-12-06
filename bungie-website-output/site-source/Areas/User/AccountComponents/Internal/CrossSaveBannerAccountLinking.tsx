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
import styles from "./CrossSaveBannerAccountLinking.module.scss";

interface CrossSaveBannerAccountLinkingProps {
  isCrossSaved: boolean;
}

export const CrossSaveBannerAccountLinking: React.FC<CrossSaveBannerAccountLinkingProps> = ({
  isCrossSaved,
}) => {
  return (
    <div className={styles.crossSaveBanner}>
      {isCrossSaved ? (
        <TwoLineItem
          className={styles.bg}
          itemTitle={Localizer.Crosssave.CrossSaveAreaHeader}
          itemSubtitle={
            <div className={styles.subtitle}>
              {Localizer.Crosssave.CrossSaveActiveMessage}
            </div>
          }
          icon={
            <IconCoin
              iconImageUrl={Img(`/destiny/logos/crosssave_white.png`)}
            />
          }
          flair={
            <Button
              buttonType={"gold"}
              size={BasicSize.Small}
              url={RouteHelper.CrossSave("Recap")}
              className={styles.button}
            >
              {Localizer.crosssave.viewyoursetup}
            </Button>
          }
        />
      ) : (
        <TwoLineItem
          className={styles.bg}
          itemTitle={Localizer.CrossSave.SetupCrossSave}
          itemSubtitle={
            <div className={styles.subtitle}>
              {Localizer.CrossSave.SetupCrossSaveDesc}
            </div>
          }
          icon={
            <IconCoin
              iconImageUrl={Img(`/destiny/logos/crosssave_white.png`)}
            />
          }
          flair={
            <Button
              buttonType={"gold"}
              size={BasicSize.Small}
              url={RouteHelper.CrossSave("Activate")}
              className={styles.button}
            >
              {Localizer.groups.getstarted}
            </Button>
          }
        />
      )}
    </div>
  );
};
