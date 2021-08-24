// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { GameHistoryDestinyMembershipDataStore } from "./DataStores/GameHistoryDestinyMembershipDataStore";
import GameHistoryEvent from "@Areas/GameHistory/GameHistoryEvent";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStore";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { HistoricalStats, Platform } from "@Platform";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import DestinyActivityModesSelector from "@UI/Destiny/DestinyActivityModeSelector";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./GameHistory.module.scss";

interface GameHistoryProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  > {}

/**
 * GameHistory - Component that shows filterable game history data
 *  *
 * @param {GameHistoryProps} props
 * @returns
 */
const GameHistory: React.FC<GameHistoryProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(GameHistoryDestinyMembershipDataStore);

  // Initialize types
  const initialHistory: HistoricalStats.DestinyActivityHistoryResults = null;
  const initialActivityMode: DestinyActivityModeType =
    DestinyActivityModeType.None;

  const [activityMode, setActivityMode] = useState(initialActivityMode);
  const [history, setHistory] = useState(initialHistory);

  const hasHistory = history?.activities?.length > 0;
  const showAllModeTypes = activityMode === 0;

  useEffect(() => {
    UserUtils.isAuthenticated(globalState) &&
      destinyMembership.selectedCharacter &&
      onCharacterChange(destinyMembership.selectedCharacter.characterId);
  }, [destinyMembership.selectedCharacter]);

  const onCharacterChange = (value: string) => {
    UserUtils.isAuthenticated(globalState) &&
      destinyMembership.characters[value].characterId &&
      Platform.Destiny2Service.GetActivityHistory(
        destinyMembership.selectedMembership.membershipType,
        destinyMembership.selectedMembership.membershipId,
        destinyMembership.characters[value].characterId,
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
    <>
      <BungieHelmet
        title={Localizer.profile.SubNav_GameHistory}
        image={Img("/ca/destiny/bgs/new_light/newlight_pvp_1_16x9.jpg")}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.header}>
        <h1>{Localizer.profile.SubNav_GameHistory}</h1>
      </div>
      <Grid>
        <GridCol cols={12}>
          <RequiresAuth
            onSignIn={() =>
              GameHistoryDestinyMembershipDataStore.actions.loadUserData()
            }
          >
            <DestinyAccountWrapper
              onCharacterChange={onCharacterChange}
              membershipDataStore={GameHistoryDestinyMembershipDataStore}
            >
              {({
                platformSelector,
                characterSelector,
                bnetProfile,
              }: IAccountFeatures) => (
                <>
                  {bnetProfile}
                  <div className={styles.flex}>
                    {platformSelector}
                    {characterSelector}
                    <div className={styles.activityModeSelector}>
                      <DestinyActivityModesSelector
                        onChange={(value) => onActivityChange(Number(value))}
                      />
                    </div>
                  </div>
                </>
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
                    .filter((ac) =>
                      ac.activityDetails.modes.includes(activityMode)
                    )
                    .map((historyItem, i) => (
                      <GameHistoryEvent key={i} historyItem={historyItem} />
                    ))
                )
              ) : (
                <div>{Localizer.Profile.NoGamesFound}</div>
              )}
            </div>
          </RequiresAuth>
        </GridCol>
      </Grid>
    </>
  );
};

export default withDestinyDefinitions(GameHistory, {
  types: [
    "DestinyActivityModeDefinition",
    "DestinyActivityTypeDefinition",
    "DestinyActivityDefinition",
  ],
});
