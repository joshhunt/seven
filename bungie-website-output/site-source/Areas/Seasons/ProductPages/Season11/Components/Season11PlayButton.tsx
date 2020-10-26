import React from "react";
import styles from "./Season11PlayButton.module.scss";
import classNames from "classnames";

export interface Season11PlayButtonClasses {
  root?: string;
  circle?: string;
  icon?: string;
}

interface Season11PlayButtonProps {
  classes?: Season11PlayButtonClasses;
  onClick?: () => void;
}

export const Season11PlayButton: React.FC<Season11PlayButtonProps> = (
  props
) => {
  const { onClick, classes } = props;

  return (
    <button
      className={classNames(styles.playButton, classes?.root)}
      onClick={onClick}
    >
      <div className={classNames(styles.playCircle, classes?.circle)}>
        <div className={classNames(styles.playIcon, classes?.icon)} />
      </div>
    </button>
  );
};
