// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./ContainerBackground.module.scss";
import React from "react";

interface ContainerBackgroundProps {}

export const ContainerBackground: React.FC<ContainerBackgroundProps> = (
  props
) => {
  return <div className={styles.containerBackground} />;
};
