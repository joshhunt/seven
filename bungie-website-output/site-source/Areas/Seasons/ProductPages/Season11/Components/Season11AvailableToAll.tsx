import { Localizer } from "@Global/Localizer";
import React from "react";
import styles from "./Season11AvailableToAll.module.scss";
import classNames from "classnames";

interface AvailableToAllProps {
  className?: string;
}

export const Season11AvailableToAll: React.FC<AvailableToAllProps> = (
  props
) => {
  return (
    <div className={classNames(styles.wrapper, props.className)}>
      {Localizer.Season11.AvailableToAll}
    </div>
  );
};
