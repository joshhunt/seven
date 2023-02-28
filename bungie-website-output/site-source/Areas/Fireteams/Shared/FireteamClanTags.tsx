// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Shared/FireteamTags.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Fireteam } from "@Platform";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import classNames from "classnames";
import React from "react";

interface FireteamClanTagsProps {
  fireteamSummary: Fireteam.FireteamSummary;
}

export const FireteamClanTags: React.FC<FireteamClanTagsProps> = (props) => {
  if (props.fireteamSummary?.groupId === "0") {
    return null;
  }

  const fireteamsLoc = Localizer.Fireteams;

  return (
    <>
      {props.fireteamSummary.isPublic && (
        <OneLineItem
          itemTitle={fireteamsLoc.PublicFireteam}
          className={classNames(styles.tag)}
        />
      )}
      <OneLineItem
        itemTitle={fireteamsLoc.ClanHosted}
        className={classNames(styles.tag)}
      />
    </>
  );
};
