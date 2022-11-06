// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import GameHistoryEvent from "@Areas/User/GameHistory/GameHistoryEvent";
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
  const membershipData = useDataStore(ProfileDestinyMembershipDataStore);

  // Initialize types
  const initialHistory: HistoricalStats.DestinyActivityHistoryResults = null;
  const initialActivityMode: DestinyActivityModeType =
    DestinyActivityModeType.None;

  const [activityMode, setActivityMode] = useState(initialActivityMode);
  const [history, setHistory] = useState(initialHistory);

  const hasHistory = history?.activities?.length > 0;
  const showAllModeTypes = activityMode === 0;

  useEffect(() => {
    ProfileDestinyMembershipDataStore.actions.loadUserData(
      props.initialUserPair
    );
  }, []);

  useEffect(() => {
    membershipData?.selectedCharacter
      ? onCharacterChange(membershipData?.selectedCharacter.characterId)
      : setHistory(null);
  }, [membershipData?.selectedCharacter, membershipData?.selectedMembership]);

  const onCharacterChange = (value: string) => {
    membershipData?.characters[value].characterId &&
      Platform.Destiny2Service.GetActivityHistory(
        membershipData?.selectedMembership?.membershipType,
        membershipData?.selectedMembership?.membershipId,
        membershipData?.characters?.[value]?.characterId,
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
        membershipDataStore={ProfileDestinyMembershipDataStore}
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
