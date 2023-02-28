// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Shared/FireteamTags.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { FireteamPlatform } from "@Enum";
import { Img } from "@Helpers";
import { Fireteam } from "@Platform";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";
import { SiPlaystation } from "@react-icons/all-files/si/SiPlaystation";
import { SiSteam } from "@react-icons/all-files/si/SiSteam";
import { SiXbox } from "@react-icons/all-files/si/SiXbox";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import React from "react";

interface FireteamPlatformTagProps {
  fireteamSummary: Fireteam.FireteamSummary;
}

export const FireteamPlatformTag: React.FC<FireteamPlatformTagProps> = (
  props
) => {
  const fireteamPlatformIcon = (platformType: FireteamPlatform) => {
    switch (platformType) {
      case FireteamPlatform.Egs:
        return <SiEpicgames />;
      case FireteamPlatform.Steam:
        return <SiSteam />;
      case FireteamPlatform.XboxOne:
        return <SiXbox />;
      case FireteamPlatform.Playstation4:
        return <SiPlaystation />;
      case FireteamPlatform.Any:
        return (
          <IconCoin
            iconImageUrl={Img("destiny/icons/fireteams/icon_anyPlatform.png")}
          />
        );
    }
  };

  if (!props.fireteamSummary) {
    return null;
  }

  const platformStringKey = EnumUtils.getStringValue(
    props.fireteamSummary.platform,
    FireteamPlatform
  );

  if (props.fireteamSummary.platform === FireteamPlatform.Any) {
    return (
      <OneLineItem
        itemTitle={
          props.fireteamSummary.platform === FireteamPlatform.Any &&
          Localizer.Shortplatforms[platformStringKey]
        }
        className={classNames(styles.tag, styles.anyPlatform)}
        icon={
          <div className={styles.tagIcon}>
            {fireteamPlatformIcon(props.fireteamSummary.platform)}
          </div>
        }
      />
    );
  } else {
    return (
      <div className={classNames(styles.tag, styles.platform)}>
        {fireteamPlatformIcon(props.fireteamSummary.platform)}
      </div>
    );
  }
};
