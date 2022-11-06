// Created by atseng, 2022
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Responses } from "@Platform";
import { GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React from "react";
import styles from "./ScoreHeader.module.scss";

interface ScoreHeaderProps
  extends D2DatabaseComponentProps<"DestinyPresentationNodeDefinition"> {
  profileResponse: Responses.DestinyProfileResponse;
}

const ScoreHeader: React.FC<ScoreHeaderProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const rootNodeDef = props.definitions.DestinyPresentationNodeDefinition.get(
    globalState.coreSettings?.destiny2CoreSettings?.activeTriumphsRootNodeHash
  );

  const locale = LocalizerUtils.useAltChineseCultureString(
    Localizer.CurrentCultureName
  );

  return (
    <GridCol cols={12} className={styles.totalScore}>
      <div className={styles.presentationNodeSectionTitle}>
        {Localizer.Triumphs.TotalScore}
      </div>
      <div className={styles.triumphScore}>
        <div className={classNames(styles.scoreNumber, styles.activeScore)}>
          <span className={styles.scoreNumerator}>
            {props.profileResponse?.profileRecords?.data?.activeScore?.toLocaleString(
              locale
            ) ?? 0}
          </span>
          <span className={styles.scoreDenominator}>
            {rootNodeDef.maxCategoryRecordScore?.toLocaleString(locale)}
          </span>
        </div>
        <div className={classNames(styles.scoreNumber, styles.legacyScore)}>
          <span className={styles.scoreNumerator}>
            {props.profileResponse?.profileRecords?.data?.lifetimeScore?.toLocaleString(
              locale
            ) ?? 0}
          </span>
          <span className={styles.scoreDenominator} />
        </div>
      </div>
    </GridCol>
  );
};

export default withDestinyDefinitions(ScoreHeader, {
  types: ["DestinyPresentationNodeDefinition"],
});
