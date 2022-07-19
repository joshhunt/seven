// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GameHistoryDestinyMembershipDataStore } from "./DataStores/GameHistoryDestinyMembershipDataStore";
import GameHistoryEvent from "@Areas/GameHistory/GameHistoryEvent";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { HistoricalStats, Platform } from "@Platform";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import DestinyActivityModesSelector from "@UI/Destiny/DestinyActivityModeSelector";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./GameHistory.module.scss";

interface GameHistoryProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  > {
  initialUserPair: MembershipPair;
  children?: React.ReactNode;
}

/**
 * GameHistory - Component that shows filterable game history data
 *  *
 * @param {GameHistoryProps} props
 * @returns
 */
const GameHistory: React.FC<GameHistoryProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const gameHistoryMembershipData = useDataStore(
    GameHistoryDestinyMembershipDataStore
  );

  // Initialize types
  const initialHistory: HistoricalStats.DestinyActivityHistoryResults = null;
  const initialActivityMode: DestinyActivityModeType =
    DestinyActivityModeType.None;

  const [activityMode, setActivityMode] = useState(initialActivityMode);
  const [history, setHistory] = useState(initialHistory);

  const hasHistory = history?.activities?.length > 0;
  const showAllModeTypes = activityMode === 0;

  useEffect(() => {
    GameHistoryDestinyMembershipDataStore.actions.loadUserData(
      props.initialUserPair
    );
  }, [props.initialUserPair]);

  useEffect(() => {
    UserUtils.isAuthenticated(globalState) &&
    gameHistoryMembershipData?.selectedCharacter
      ? onCharacterChange(
          gameHistoryMembershipData?.selectedCharacter.characterId
        )
      : setHistory(null);
  }, [
    gameHistoryMembershipData?.selectedCharacter,
    gameHistoryMembershipData?.selectedMembership,
  ]);

  const onCharacterChange = (value: string) => {
    UserUtils.isAuthenticated(globalState) &&
      gameHistoryMembershipData?.characters[value].characterId &&
      Platform.Destiny2Service.GetActivityHistory(
        gameHistoryMembershipData?.selectedMembership?.membershipType,
        gameHistoryMembershipData?.selectedMembership?.membershipId,
        gameHistoryMembershipData?.characters?.[value]?.characterId,
        activityMode,
        20,
        0
      ).then((data) => {
        setHistory(data);
      });
  };

  const onActivityChange = (value: number) => {
    setActivityMode(value);
  };

  return (
    <div>
      <DestinyAccountWrapper
        onCharacterChange={onCharacterChange}
        membershipDataStore={GameHistoryDestinyMembershipDataStore}
      >
        {({ platformSelector, characterSelector }: IAccountFeatures) => (
          <div>
            <div className={styles.flex}>
              {platformSelector}
              {characterSelector}
              <div className={styles.activityModeSelector}>
                <DestinyActivityModesSelector
                  onChange={(value) => onActivityChange(Number(value))}
                />
              </div>
            </div>
          </div>
        )}
      </DestinyAccountWrapper>
      <div className={styles.historyTable}>
        {hasHistory ? (
          showAllModeTypes ? (
            history.activities.map((historyItem, i) => (
              <GameHistoryEvent key={i} historyItem={historyItem} />
            ))
          ) : (
            history.activities
              .filter((ac) => ac.activityDetails.modes.includes(activityMode))
              .map((historyItem, i) => (
                <GameHistoryEvent key={i} historyItem={historyItem} />
              ))
          )
        ) : (
          <div>{Localizer.Profile.NoGamesFound}</div>
        )}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(GameHistory, {
  types: [
    "DestinyActivityModeDefinition",
    "DestinyActivityTypeDefinition",
    "DestinyActivityDefinition",
  ],
});
