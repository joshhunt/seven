import React from "react";
import { Localizer } from "@bungie/localization/Localizer";
import styles from "./NoFireteamsFound.module.scss";

const NoFireteamsFound: React.FC = () => {
  const ClansLoc = Localizer.clans;

  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateIcon} />
      <h4 className={styles.emptyHeader}>{ClansLoc.NoFireteamsFound}</h4>
      <p>{ClansLoc.CreateOneOrTryChanging}</p>
    </div>
  );
};

export default NoFireteamsFound;
