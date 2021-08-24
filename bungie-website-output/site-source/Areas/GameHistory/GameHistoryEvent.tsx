// Created by larobinson, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/GameHistory/GameHistoryEvent.module.scss";
import Pgcr from "@Areas/GameHistory/Pgcr/Pgcr";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import { HistoricalStats } from "@Platform";
import { Timestamp } from "@UI/Utility/Timestamp";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React from "react";

interface GameHistoryEventProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  > {
  historyItem: HistoricalStats.DestinyHistoricalStatsPeriodGroup;
}

const GameHistoryEvent: React.FC<GameHistoryEventProps> = (props) => {
  const allActivityModes = props.definitions.DestinyActivityModeDefinition.all();

  const _getHashFromModeType = (modeType: DestinyActivityModeType) => {
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

  const onClick = () => {
    Modal.open(
      <Pgcr
        activityId={props.historyItem.activityDetails.instanceId}
        basicActivityData={{
          icon: activityModeDisplayProperties.icon,
          activityName: activityModeDisplayProperties.name,
          location: activityDisplayProperties.name,
          timestamp: props.historyItem.period,
          standing: eventValues.standing?.basic?.displayValue,
        }}
      />,
      {
        isFrameless: true,
      }
    );
  };

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
        onClick={onClick}
      />
    </div>
  );
};

export default withDestinyDefinitions(GameHistoryEvent, {
  types: [
    "DestinyActivityModeDefinition",
    "DestinyActivityTypeDefinition",
    "DestinyActivityDefinition",
  ],
});
