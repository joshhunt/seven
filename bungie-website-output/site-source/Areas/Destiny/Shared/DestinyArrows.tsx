// Created by jlauer, 2020
// Copyright Bungie, Inc.

import styles from "./DestinyArrows.module.scss";
import classNames from "classnames";
import React from "react";

interface DestinyArrowsProps {
  classes?: {
    root?: string;
    base?: string;
    animatedArrow?: string;
  };
}

/**
 * Renders the animated double-arrow
 * @param props
 * @constructor
 */
export const DestinyArrows: React.FC<DestinyArrowsProps> = (props) => {
  const classes = classNames(styles.arrows, props.classes?.root);

  return (
    <span className={classNames(styles.arrows, props.classes?.root)}>
      <span className={classNames(styles.baseArrows, props.classes?.base)} />
      <span
        className={classNames(
          styles.animatedArrow,
          props.classes?.animatedArrow
        )}
      />
    </span>
  );
};
