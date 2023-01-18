// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import React from "react";
import styles from "./LightfallTrailerBtn.module.scss";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import {
  PmpButton,
  PmpButtonProps,
} from "@UI/Marketing/FragmentComponents/PmpButton";
import classNames from "classnames";

interface LightfallTrailerBtnProps extends Omit<PmpButtonProps, "icon"> {
  icon?: BnetStackFile;
  label?: string;
}

export const LightfallTrailerBtn: React.FC<LightfallTrailerBtnProps> = (
  props
) => {
  const { icon, label, className, ...button } = props;

  return (
    <PmpButton
      {...button}
      button_type={"none"}
      icon={undefined}
      className={classNames([styles.btn, className])}
    >
      <>
        {icon ? (
          <img
            className={styles.btnIcon}
            src={icon?.url}
            width={42}
            height={42}
            alt=""
          />
        ) : null}
        {label}
      </>
    </PmpButton>
  );
};
