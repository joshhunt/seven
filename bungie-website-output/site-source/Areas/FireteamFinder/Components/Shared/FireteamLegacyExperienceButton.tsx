// Created by larobinson, 2024
// Copyright Bungie, Inc.

import styles from "@Areas/FireteamFinder/Components/Layout/LoggedOutView.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import React from "react";

interface FireteamLegacyExperienceButtonProps {}

export const FireteamLegacyExperienceButton: React.FC<FireteamLegacyExperienceButtonProps> = (
  props
) => {
  return (
    <div className={styles.buttonContainer}>
      <Button
        buttonType={"darkblue2"}
        className={styles.oldExperienceButton}
        url={RouteHelper?.DeprecatedReactFireteams()}
      >
        <div className={styles.icon}>
          <img
            className={styles.fireteamFinderIcon}
            src={Img("/destiny/bgs/fireteams/icon_header_fireteamsSearch.svg")}
            alt={Localizer.Fireteams.FireteamFinder}
            role="presentation"
          />
        </div>

        <div>
          <div>{Localizer.Fireteams.FindFireteam}</div>
          <div className={styles.subtitle}>
            {Localizer.Fireteams.OldFireteamsLink}
          </div>
        </div>

        <div className={styles.icon}>
          <img
            className={styles.arrow}
            src={Img("destiny/icons/arrow.svg")}
            role="presentation"
          />
        </div>
      </Button>
    </div>
  );
};
