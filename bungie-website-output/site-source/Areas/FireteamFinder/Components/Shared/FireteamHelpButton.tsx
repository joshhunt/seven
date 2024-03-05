// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { BasicSize } from "@UIKit/UIKitUtils";
import styles from "./FireteamHelpButton.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { BsQuestionCircleFill } from "@react-icons/all-files/bs/BsQuestionCircleFill";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import React from "react";

interface FireteamHelpButtonProps {
  size?: BasicSize;
}

export const FireteamHelpButton: React.FC<FireteamHelpButtonProps> = (
  props
) => {
  return (
    <Button
      className={styles.helpButton}
      icon={<BsQuestionCircleFill />}
      buttonType={"clear"}
      size={props.size}
      url={RouteHelper.FireteamFinderHelp()}
    >
      {Localizer.fireteams.FireteamHelp}
    </Button>
  );
};
