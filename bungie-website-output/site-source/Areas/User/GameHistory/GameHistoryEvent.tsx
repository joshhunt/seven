// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GameHistoryDestinyMembershipDataStore } from "./DataStores/GameHistoryDestinyMembershipDataStore";
import styles from "./GameHistoryEvent.module.scss";
import Pgcr from "@Areas/Pgcr/Pgcr";
import PgcrModal from "@Areas/Pgcr/PgcrComponents/PgcrModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeCategory, DestinyActivityModeType } from "@Enum";
import { HistoricalStats } from "@Platform";
import { Timestamp } from "@UI/Utility/Timestamp";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import React, { useEffect, useRef } from "react";

interface GameHistoryEventProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  > {
  historyItem: HistoricalStats.DestinyHistoricalStatsPeriodGroup;
}

const GameHistoryEvent: React.FC<GameHistoryEventProps> = (props) => {
  const allActivityModes = props.definitions?.DestinyActivityModeDefinition?.all();

  const _getHashFromModeType = (modeType: DestinyActivityModeType) => {
    const allActivityHashes = Object.keys(allActivityModes);

    return parseInt(
      allActivityHashes.find(
        (hash) => allActivityModes?.[hash]?.modeType === modeType
      )
    );
  };

  const activityModeHash = _getHashFromModeType(
    props.historyItem?.activityDetails?.mode
  );
  const activityModeDefinition = props.definitions?.DestinyActivityModeDefinition?.get(
    activityModeHash
  );
  const activityModeDisplayProperties =
    activityModeDefinition?.displayProperties;
  const activityHash = props.historyItem?.activityDetails?.referenceId;
  const activityDisplayProperties = props.definitions?.DestinyActivityDefinition?.get(
    activityHash
  )?.displayProperties;
  const eventValues = props.historyItem?.values;
  const gameHistoryMembershipData = useDataStore(
    GameHistoryDestinyMembershipDataStore
  );
  const modalRef = useRef(null);

  let activitySubtitle = activityDisplayProperties?.name ?? "";

  if (
    activityModeDefinition &&
    activityModeDefinition.activityModeCategory ==
      DestinyActivityModeCategory.PvP
  ) {
    const directorActivityHash =
      props.historyItem?.activityDetails?.directorActivityHash;
    const directorActivityDefinition = props.definitions?.DestinyActivityDefinition?.get(
      directorActivityHash
    );

    const cruciblePlaylistName =
      directorActivityDefinition?.displayProperties?.name ?? "";
    if (
      cruciblePlaylistName.length > 0 &&
      !cruciblePlaylistName.includes(activitySubtitle)
    ) {
      activitySubtitle = `${activitySubtitle} - ${cruciblePlaylistName}`;
    }
  }

  modalRef.current = (
    <Pgcr
      activityId={props.historyItem?.activityDetails.instanceId}
      character={gameHistoryMembershipData?.selectedCharacter?.characterId}
      ref={modalRef}
    />
  );

  const onClick = () => {
    PgcrModal.show({
      children: modalRef.current,
    });
  };

  useEffect(() => {
    return () => modalRef?.current?.close;
  });

  return (
    <div className={styles.mobileContainer}>
      <TwoLineItem
        itemTitle={activityModeDisplayProperties?.name}
        itemSubtitle={
          <span className={styles.subtitle}>{activitySubtitle}</span>
        }
        icon={
          <img
            className={styles.icon}
            src={activityModeDisplayProperties?.icon}
          />
        }
        flair={
          <div>
            {
              // this shows victory or defeat or score for rumble
              eventValues.standing?.basic?.displayValue && (
                <div className={styles.result}>
                  {eventValues?.standing?.basic?.displayValue}
                </div>
              )
            }
            <div className={styles.timestamp}>
              <Timestamp time={props.historyItem?.period} />
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
