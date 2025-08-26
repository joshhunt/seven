import React from "react";
import { Localizer } from "@bungie/localization/Localizer";
import styles from "./NoFireteamsFound.module.scss";
import classNames from "classnames";

interface NoFireteamsFoundProps {
  small?: boolean;
}

const NoFireteamsFound: React.FC<NoFireteamsFoundProps> = ({
  small = false,
}) => {
  const ClansLoc = Localizer.clans;

  return (
    <div
      className={classNames(styles.emptyStateContainer, {
        [styles.small]: small,
      })}
    >
      <div className={styles.emptyStateIcon} />
      <h4 className={styles.emptyHeader}>{ClansLoc.NoFireteamsFound}</h4>
      {!small && <p>{ClansLoc.CreateOneOrTryChanging}</p>}
    </div>
  );
};

export default NoFireteamsFound;
