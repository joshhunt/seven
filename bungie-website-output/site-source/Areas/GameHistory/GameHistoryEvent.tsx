// Created by larobinson, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/GameHistory/GameHistoryEvent.module.scss";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { AclEnum } from "@Enum";
import { Definitions, HistoricalStats, Platform } from "@Platform";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Timestamp } from "@UI/Utility/Timestamp";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect } from "react";

interface GameHistoryEventProps {
  historyItem: HistoricalStats.DestinyHistoricalStatsPeriodGroup;
  definitions: Pick<
    AllDefinitionsFetcherized,
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  >;
}

export const GameHistoryEvent: React.FC<GameHistoryEventProps> = (props) => {
  const allActivityModes = props.definitions.DestinyActivityModeDefinition.all();

  const _getHashFromModeType = (modeType) => {
    const allActivityHashes = Object.keys(allActivityModes);

    return parseInt(
      allActivityHashes.find(
        (hash) => allActivityModes[hash].modeType === modeType
      )
    );
  };

  const activityModeHash = _getHashFromModeType(
    props.historyItem.activityDetails.mode
  );
  const activityModeDisplayProperties = props.definitions.DestinyActivityModeDefinition.get(
    activityModeHash
  ).displayProperties;
  const activityHash = props.historyItem.activityDetails.referenceId;
  const activityDisplayProperties = props.definitions.DestinyActivityDefinition.get(
    activityHash
  ).displayProperties;
  const eventValues = props.historyItem.values;

  return (
    <div>
      <TwoLineItem
        itemTitle={activityModeDisplayProperties.name}
        itemSubtitle={activityDisplayProperties.name}
        icon={
          <img
            className={styles.icon}
            src={activityModeDisplayProperties.icon}
          />
        }
        flair={
          <div>
            {
              // this shows victory or defeat or score for rumble
              eventValues.standing?.basic?.displayValue && (
                <div className={styles.result}>
                  {eventValues.standing.basic.displayValue}
                </div>
              )
            }
            <div className={styles.timestamp}>
              <Timestamp time={props.historyItem.period} />
            </div>
          </div>
        }
      />
    </div>
  );
};
