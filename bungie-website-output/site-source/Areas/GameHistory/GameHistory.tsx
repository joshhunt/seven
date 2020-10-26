// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { GameHistoryEvent } from "@Areas/GameHistory/GameHistoryEvent";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyActivityModeType } from "@Enum";
import { useDataStore } from "@Global/DataStore";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localizer";
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
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useMemo, useState } from "react";
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
 * @param {IGameHistoryProps} props
 * @returns
 */
const GameHistory: React.FC<GameHistoryProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  // DestinyMembershipDataStore maintains the membership and character data for the dropdowns used in DestinyAccountWrapper
  const destinyMembershipDataStore = useMemo(
    () =>
      new DestinyMembershipDataStore(
        UserUtils.loggedInUserMembershipIdFromCookie
      ),
    []
  );
  const destinyMembership = useDataStore(destinyMembershipDataStore);

  // Initialize types
  const initialHistory: HistoricalStats.DestinyActivityHistoryResults = null;
  const initialActivityMode: DestinyActivityModeType =
    DestinyActivityModeType.None;

  const [activityMode, setActivityMode] = useState(initialActivityMode);
  const [loaded, setLoaded] = useState(false);
  const [history, setHistory] = useState(initialHistory);

  const hasHistory = history?.activities?.length >= 1;
  const showAllModeTypes = activityMode === 0;

  // This runs twice, once when the connection is made to the datastore, there is no selectedCharacter yet so the onCharacterChange doesn't fire, and once when the data is loaded for the datastore
  useEffect(() => {
    UserUtils.isAuthenticated(globalState) &&
      destinyMembership.selectedCharacter &&
      onCharacterChange(destinyMembership.selectedCharacter.characterId);
  }, [destinyMembership.initialDataLoaded]);

  const onCharacterChange = (value: string) => {
    setLoaded(false);

    UserUtils.isAuthenticated(globalState) &&
      destinyMembership.initialDataLoaded &&
      Platform.Destiny2Service.GetActivityHistory(
        destinyMembership.selectedMembership.membershipType,
        destinyMembership.selectedMembership.membershipId,
        destinyMembership.characters[value].characterId,
        activityMode,
        20,
        0
      )
        .then((data) => {
          setHistory(data);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
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
          <RequiresAuth>
            <DestinyAccountWrapper onCharacterChange={onCharacterChange}>
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
                        onChange={(value) => onActivityChange(value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </DestinyAccountWrapper>
            <SpinnerContainer className={styles.historyTable} loading={!loaded}>
              {hasHistory ? (
                showAllModeTypes ? (
                  history.activities.map((historyItem, i) => (
                    <GameHistoryEvent
                      key={i}
                      historyItem={historyItem}
                      definitions={props.definitions}
                    />
                  ))
                ) : (
                  history.activities
                    .filter((ac) =>
                      ac.activityDetails.modes.includes(activityMode)
                    )
                    .map((historyItem, i) => (
                      <GameHistoryEvent
                        key={i}
                        historyItem={historyItem}
                        definitions={props.definitions}
                      />
                    ))
                )
              ) : (
                <div />
              )}
            </SpinnerContainer>
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
