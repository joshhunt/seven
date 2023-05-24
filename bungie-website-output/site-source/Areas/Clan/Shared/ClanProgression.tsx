// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanProgression.module.scss";
import clanStyles from "@Areas/Clan/ClanProfile.module.scss";
import { ClanProgressionBar } from "@Areas/Clan/Shared/ClanProgressionBar";
import { Localizer } from "@bungie/localization/Localizer";
import { World } from "@Platform";
import classNames from "classnames";
import React from "react";

interface ClanProgressionProps {
  clanProgression: { [key: number]: World.DestinyProgression };
}

export const ClanProgression: React.FC<ClanProgressionProps> = (props) => {
  const clansLoc = Localizer.Clans;

  return (
    <div
      className={classNames(
        styles.clanProgressionContainer,
        clanStyles.progressionBox
      )}
    >
      <h3 className={styles.sectionHeader}>{clansLoc.Season1}</h3>
      <p className={styles.progressionDescription}>
        {clansLoc.SeasonDescription}
      </p>
      <h4 className={styles.progressHeader}>{clansLoc.ClanLevel}</h4>
      <ClanProgressionBar
        clanProgression={props.clanProgression}
        showProgressFraction={false}
        showCap={true}
      />
    </div>
  );
};
