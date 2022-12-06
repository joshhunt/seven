// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import GameHistoryEvent from "@Areas/User/GameHistory/GameHistoryEvent";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { HistoricalStats, Platform } from "@Platform";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import DestinyActivityModesSelector from "@UI/Destiny/DestinyActivityModeSelector";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
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
  const itemsRequested = 20;
  const membershipData = useDataStore(ProfileDestinyMembershipDataStore);

  // Initialize types
  const initialHistory: HistoricalStats.DestinyActivityHistoryResults = null;
  const initialActivityMode: DestinyActivityModeType =
    DestinyActivityModeType.None;

  const [activityMode, setActivityMode] = useState(initialActivityMode);
  const [history, setHistory] = useState(initialHistory);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const hasHistory = history?.activities?.length > 0;
  const showAllModeTypes = activityMode === 0;

  useEffect(() => {
    ProfileDestinyMembershipDataStore.actions.loadUserData(
      props.initialUserPair
    );
  }, []);

  useEffect(() => {
    updateActivityHistory();
  }, [
    membershipData?.selectedCharacter,
    membershipData?.selectedMembership,
    activityMode,
    currentPage,
  ]);

  const updateActivityHistory = () => {
    if (
      membershipData?.selectedMembership &&
      membershipData?.selectedCharacter
    ) {
      Platform.Destiny2Service.GetActivityHistory(
        membershipData?.selectedMembership?.membershipType,
        membershipData?.selectedMembership?.membershipId,
        membershipData?.selectedCharacter?.characterId,
        activityMode,
        20,
        currentPage
      )
        .then((data) => {
          if (data?.activities?.length < itemsRequested) {
            setIsLastPage(true);
          }

          setHistory(data);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          setHistory(null);
        });
    } else {
      setHistory(null);
    }
  };

  const onActivityChange = (value: number) => {
    setCurrentPage(0);
    setActivityMode(value);
  };

  const onCharacterChange = (value: string) => {
    if (!membershipData?.characters?.[value]?.characterId) {
      setHistory(null);
    }

    setCurrentPage(0);
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
      {hasHistory && (
        <div className={styles.pagerButtons}>
          {currentPage > 1 && (
            <Button onClick={() => setCurrentPage(currentPage - 1)}>
              {Localizer.Actions.Previous}
            </Button>
          )}
          {!isLastPage && (
            <Button onClick={() => setCurrentPage(currentPage + 1)}>
              {Localizer.Actions.Next}
            </Button>
          )}
        </div>
      )}
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
