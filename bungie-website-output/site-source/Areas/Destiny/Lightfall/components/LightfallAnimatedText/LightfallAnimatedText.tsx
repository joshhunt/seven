// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import classNames from "classnames";
import React, { useMemo } from "react";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import styles from "./LightfallAnimatedText.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";

interface LightfallAnimatedTextProps extends React.HTMLProps<HTMLDivElement> {
  bg: BnetStackFile;
}

export const LightfallAnimatedText: React.FC<LightfallAnimatedTextProps> = (
  props
) => {
  const { children, bg, className } = props;

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        bg: bg?.url,
      }),
      [bg]
    )
  );

  return (
    <div
      className={classNames(styles.title, className)}
      style={{
        backgroundImage: `url(${imgs.bg})`,
      }}
    >
      <SafelySetInnerHTML html={children as string} />
    </div>
  );
};
