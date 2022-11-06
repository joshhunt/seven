// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@UIKit/Companion/OneLineItem.module.scss";
import React from "react";

interface IconImagesCoinProps {
  images: string[];
}

export const IconImagesCoin: React.FC<IconImagesCoinProps> = (props) => {
  let iconImageStyle: React.CSSProperties = null;

  if (props.images && props.images.length) {
    let backgroundImage = "";

    props.images
      .filter((i) => i.length > 0)
      .forEach((image, index) => {
        backgroundImage += `${index > 0 ? ", " : ""}url("${image}")`;
      });

    iconImageStyle = {
      backgroundImage: backgroundImage,
    };
  }

  return (
    <div className={styles.iconCoin} style={iconImageStyle}>
      {props.children}
    </div>
  );
};
