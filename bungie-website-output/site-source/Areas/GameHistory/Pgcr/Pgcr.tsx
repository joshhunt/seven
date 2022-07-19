// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { MissingPgcrDataError } from "@Areas/GameHistory/Pgcr/PgcrComponents/MissingPgcrDataError";
import { PgcrLeaderStatItem } from "@Areas/GameHistory/Pgcr/PgcrComponents/PgcrLeaderStatItem";
import { PgcrReportButton } from "@Areas/GameHistory/Pgcr/PgcrComponents/PgcrReportButton";
import PgcrStatBar from "@Areas/GameHistory/Pgcr/PgcrComponents/PgcrStatBar";
import {
  initialActivityData,
  initialDerivedDefinitionHashes,
  PgcrActivityData,
  PgcrDataStore,
  PgcrDerivedDefinitionHashes,
  PgcrStatsByCharacter,
} from "@Areas/GameHistory/Pgcr/PgcrDataStore";
import { PgcrUtils } from "@Areas/GameHistory/Pgcr/PgcrUtils";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  DestinyActivityModeCategory,
  DestinyActivityModeType,
  IgnoredItemType,
} from "@Enum";
import { Localizer } from "@bungie/localization";
import { Platform } from "@Platform";
import { Timestamp } from "@UI/Utility/Timestamp";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { StringUtils } from "@Utilities/StringUtils";
import React, { useEffect, useState } from "react";
import { GameHistoryDestinyMembershipDataStore } from "../DataStores/GameHistoryDestinyMembershipDataStore";
import styles from "./Pgcr.module.scss";

export interface BasicDestinyActivityData {
  icon: string;
  activityName: string;
  location: string;
  timestamp: string;
  standing: string | null;
}

interface PgcrProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
    | "DestinyDestinationDefinition"
    | "DestinyPlaceDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  activityId: string;
  basicActivityData: BasicDestinyActivityData;
}

const Pgcr: React.FC<PgcrProps> = (props) => {
  const [pgcrLoaded, setPgcrLoaded] = useState(false);
  const [team1, setTeam1] = useState<PgcrStatsByCharacter>({});
  const [team2, setTeam2] = useState<PgcrStatsByCharacter>({});
  const [selectedStat, setSelectedStat] = useState<string>("");
  const pgcrData = useDataStore(PgcrDataStore);
  const destinyMembership = useDataStore(GameHistoryDestinyMembershipDataStore);
  const responsive = useDataStore(Responsive);

  useEffect(() => {
    Platform.Destiny2Service.GetPostGameCarnageReport(props.activityId)
      .then((pgcr) => {
        PgcrDataStore.actions.updatePgcr(pgcr);

        return pgcr;
      })
      .then((pgcr) => {
        const newDefinitionHashes = PgcrUtils.getDefinitionsHashesFromPgcr(
          pgcr
        );

        PgcrDataStore.actions.updatePgcrDefinitionHashes(newDefinitionHashes);

        return { pgcr: pgcr, newDefinitionHashes: newDefinitionHashes };
      })
      .then(({ pgcr, newDefinitionHashes }) => {
        const newDerivedDefinitions: PgcrDerivedDefinitionHashes = initialDerivedDefinitionHashes;

        const allActivityModes = props.definitions.DestinyActivityModeDefinition.all();
        const allActivityHashes = Object.keys(
          props.definitions.DestinyActivityModeDefinition.all()
        );
        newDerivedDefinitions.activityHash = Number(
          allActivityHashes.find(
            (hash) =>
              allActivityModes[hash].modeType ===
              newDefinitionHashes.activityModeType
          )
        );

        const activityDefinition = props.definitions.DestinyActivityDefinition.get(
          newDefinitionHashes.activityDefinitionHash
        );

        if (!!activityDefinition) {
          newDerivedDefinitions.activityTypeHash =
            activityDefinition.activityTypeHash;
          newDerivedDefinitions.destinationHash =
            activityDefinition.destinationHash;
          const destinationDefinition = props.definitions.DestinyDestinationDefinition.get(
            activityDefinition.destinationHash
          );

          if (destinationDefinition) {
            newDerivedDefinitions.placeHash = destinationDefinition.placeHash;
          }
        }

        PgcrDataStore.actions.updatePgcrDerivedDefinitionHashes(
          newDerivedDefinitions
        );

        return {
          pgcr: pgcr,
          newDefinitionHashes: newDefinitionHashes,
          derivedDefinitionHashes: newDerivedDefinitions,
        };
      })
      .then(({ pgcr, newDefinitionHashes, derivedDefinitionHashes }) => {
        const newActivityData: PgcrActivityData = initialActivityData;
        const activityDefinition = props.definitions.DestinyActivityDefinition.get(
          newDefinitionHashes.activityDefinitionHash
        );
        const allActivityModes = props.definitions.DestinyActivityModeDefinition.all();
        const activityModeHashes = Object.keys(allActivityModes);
        const activityModeHash = activityModeHashes.filter(
          (amh) =>
            allActivityModes[amh].modeType ===
            newDefinitionHashes.activityModeType
        )[0];
        const activityModeDefinition = allActivityModes[activityModeHash];
        const activityTypeDefinition = props.definitions.DestinyActivityTypeDefinition.get(
          derivedDefinitionHashes.activityTypeHash
        );

        if (!activityModeDefinition) {
          PgcrDataStore.actions.updatePgcrActivityData(newActivityData);

          throw new Error(
            `Can't find activity mode definition for hash ${newDefinitionHashes.activityModeType}`
          );
        }

        if (
          activityModeDefinition?.activityModeCategory ===
            DestinyActivityModeCategory.PvE &&
          (activityModeDefinition?.modeType ===
            DestinyActivityModeType.ScoredHeroicNightfall ||
            activityModeDefinition?.modeType ===
              DestinyActivityModeType.ScoredNightfall)
        ) {
          newActivityData.isScoredPvE = true;
        }

        if (activityModeDefinition?.parentHashes === null) {
          PgcrDataStore.actions.updatePgcrActivityData(newActivityData);

          throw new Error("Can't find parentHashes of this activity mode");
        }

        activityModeDefinition?.parentHashes.forEach((parentHash) => {
          const parent = props.definitions.DestinyActivityModeDefinition.get(
            parentHash
          );

          newActivityData.isCrucible =
            newActivityData.isCrucible ||
            parent?.modeType === DestinyActivityModeType.AllPvP;

          parent.parentHashes?.forEach((parentOfParentHash) => {
            const parentOfParent = props.definitions.DestinyActivityModeDefinition.get(
              parentOfParentHash
            );
            if (parentOfParent) {
              newActivityData.isCrucible =
                newActivityData.isCrucible ||
                parentOfParent?.modeType === DestinyActivityModeType.AllPvP;
            }
          });
        });

        if (!activityDefinition && !activityTypeDefinition) {
          PgcrDataStore.actions.updatePgcrActivityData(newActivityData);

          throw new Error(
            "activityDefinition or activityTypeDefinition are undefined"
          );
        }

        if (
          activityModeDefinition?.activityModeCategory ===
          DestinyActivityModeCategory.PvECompetitive
        ) {
          newActivityData.isGambit = true;
        }

        //SetFocusedTeamId();

        if (newActivityData.isCrucible || newActivityData.isGambit) {
          //getTeamIdForCharacter

          newActivityData.focusedTeamId = PgcrUtils.getTeamIdForCharacter(
            pgcrData.pgcr,
            destinyMembership?.selectedCharacter?.characterId
          );

          const firstTeam = pgcr.teams[0];
          if (
            newActivityData.focusedTeamId === -1 &&
            firstTeam?.teamId !== null
          ) {
            newActivityData.focusedTeamId = firstTeam.teamId;
          }
        }

        //SetOpponentTeamId();

        {
          if (pgcr.teams?.length > 1) {
            const opponentTeam = pgcr.teams?.filter(
              (a) => a.teamId !== newActivityData.focusedTeamId
            )[0];
            if (opponentTeam !== undefined && opponentTeam !== null) {
              newActivityData.opponentTeamId = opponentTeam.teamId;
            }
          } else if (
            newActivityData.isGambit &&
            newActivityData.focusedTeamId !== 0
          ) {
            pgcr.entries.forEach((entry) => {
              const team = PgcrUtils.getTeamIdFromEntry(entry);

              if (team !== -1 && team !== newActivityData.focusedTeamId) {
                newActivityData.opponentTeamId = team;
              }
            });
          }
        }

        //Set pgcr header image

        newActivityData.pgcrImage = activityModeDefinition?.pgcrImage;

        PgcrDataStore.actions.updateStats(
          PgcrUtils.createStats(newActivityData, pgcr.entries)
        );

        PgcrDataStore.actions.updatePgcrActivityData(newActivityData);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e))
      .finally(() => {
        setPgcrLoaded(true);
      });
  }, [pgcrData]);

  useEffect(() => {
    if (pgcrLoaded && pgcrData.pgcr?.teams?.length > 0) {
      const tempTeam1: PgcrStatsByCharacter = {};
      const tempTeam2: PgcrStatsByCharacter = {};

      Object.keys(pgcrData.pgcrStats?.statTableData?.statsByCharacter).forEach(
        (id: string) => {
          const character =
            pgcrData.pgcrStats?.statTableData?.statsByCharacter[id];

          if (character.team === pgcrData.pgcrActivityData.focusedTeamId) {
            tempTeam1[id] = character;
          } else if (
            character.team === pgcrData.pgcrActivityData.opponentTeamId
          ) {
            tempTeam2[id] = character;
          }
        }
      );

      setTeam1(tempTeam1);
      setTeam2(tempTeam2);
    }
  }, [pgcrData.pgcrStats?.statTableData?.statsByCharacter]);

  const _makeCharacterStatRowsFromTeam = (
    team: PgcrStatsByCharacter,
    teamLabel: string
  ) => {
    if (!pgcrData.pgcrStats?.statTableData?.statsByCharacter) {
      return null;
    }

    const isMobile = responsive.mobile;
    const statSelectionOptions: IDropdownOption[] = pgcrData.pgcrStats?.statTableData.statNames.map(
      (statName) => {
        return {
          label: makeOrAbbreviateStatName(statName),
          value: statName,
        };
      }
    );

    const getCharacterStatValue = (characterId: string | number) => {
      return pgcrData.pgcrStats?.statTableData?.statsByCharacter[
        characterId
      ].stats.find((statItem) => statItem.name === selectedStat)?.value;
    };

    return (
      <>
        <table>
          <tbody>
            {isMobile ? (
              <>
                <tr>
                  <td />
                  <td>
                    <Dropdown
                      options={statSelectionOptions}
                      onChange={(value) => setSelectedStat(value)}
                    />
                  </td>
                </tr>
                {Object.keys(team).map((ci, i) => {
                  return (
                    <tr key={i}>
                      <td className={styles.playerBox}>
                        <div className={styles.destinyRosterPlayer}>
                          <div
                            className={styles.emblem}
                            style={{
                              backgroundImage: `url(${
                                props.definitions.DestinyInventoryItemLiteDefinition.get(
                                  team[ci].emblem
                                ).displayProperties.icon
                              }`,
                            }}
                          />
                          <div className={styles.nameReportContainer}>
                            <div>{team[ci].displayName}</div>
                            <PgcrReportButton
                              ignoredItemId={team[ci]?.membershipId}
                              itemContextType={IgnoredItemType.UserProfile}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{getCharacterStatValue(ci)}</td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <>
                <tr className={styles.statNames}>
                  <td>{teamLabel}</td>
                  {pgcrData.pgcrStats?.statTableData.statNames.map((n, i) => (
                    <th key={i} className={styles.statName}>
                      {makeOrAbbreviateStatName(n)}
                    </th>
                  ))}
                </tr>
                {Object.keys(team).map((ci, i) => {
                  return (
                    <tr key={i}>
                      <td className={styles.playerBox}>
                        <div className={styles.destinyRosterPlayer}>
                          <div
                            className={styles.emblem}
                            style={{
                              backgroundImage: `url(${
                                props.definitions.DestinyInventoryItemLiteDefinition.get(
                                  team[ci].emblem
                                ).displayProperties.icon
                              }`,
                            }}
                          />
                          <div>{team[ci].displayName}</div>
                          <PgcrReportButton
                            ignoredItemId={team[ci]?.membershipId}
                            itemContextType={IgnoredItemType.UserProfile}
                          />
                        </div>
                      </td>
                      {pgcrData.pgcrStats?.statTableData?.statsByCharacter[
                        ci
                      ]?.stats.map((stat, k) => (
                        <td key={k}>{stat.value}</td>
                      ))}
                    </tr>
                  );
                })}{" "}
              </>
            )}
          </tbody>
        </table>
      </>
    );
  };

  const makeOrAbbreviateStatName = (name: string) => {
    if (
      Localizer.historicalstats[`StatName_${name}`].length > 15 &&
      !StringUtils.isNullOrWhiteSpace(
        Localizer.historicalstats[`StatNameAbbr_${name}`]
      )
    ) {
      return Localizer.historicalstats[`StatNameAbbr_${name}`];
    }

    return Localizer.historicalstats[`StatName_${name}`];
  };

  return (
    <div className={styles.contentBounds}>
      <SpinnerContainer loading={!pgcrLoaded}>
        {props.basicActivityData ? (
          <div>
            <div
              className={styles.header}
              style={{
                backgroundImage: `url(${pgcrData.pgcrActivityData?.pgcrImage})`,
              }}
            >
              <img
                className={styles.activityIcon}
                src={props.basicActivityData?.icon}
              />
              <div className={styles.activityName}>
                {props.basicActivityData?.activityName}
              </div>
              <div className={styles.activityLocation}>
                {props.basicActivityData?.location}
              </div>
              <div className={styles.infoPills}>
                <div className={styles.timestamp}>
                  <Timestamp time={props.basicActivityData?.timestamp} />
                </div>
                {props.basicActivityData?.standing && (
                  <div className={styles.standing}>
                    {props.basicActivityData.standing}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.body}>
              {pgcrData?.pgcrActivityData?.isScoredPvE && (
                <>
                  <div className={styles.subtitle}>
                    {Localizer.Pgcr.GameStatsSectionHeader}
                  </div>
                  <div className={styles.statBars}>
                    {pgcrData.pgcrStats?.statBarData.map((stat, i) => (
                      <PgcrStatBar key={i} statId={stat} />
                    ))}
                  </div>
                </>
              )}
              <div className={styles.leaderStats}>
                {pgcrData.pgcrStats?.leaderStatItemData.map((item, i) => (
                  <PgcrLeaderStatItem key={i} statId={item} />
                ))}
              </div>
              {Object.keys(pgcrData.pgcrStats?.statTableData?.statsByCharacter)
                .length > 0 && (
                <div className={styles.statTable}>
                  {Object.keys(team1).length > 0 ||
                  Object.keys(team2).length > 0 ? (
                    <>
                      {Object.keys(team1).length > 0 &&
                        _makeCharacterStatRowsFromTeam(
                          team1,
                          Localizer.Pgcr.YourTeam
                        )}
                      {Object.keys(team2).length > 0 &&
                        _makeCharacterStatRowsFromTeam(
                          team2,
                          Localizer.Pgcr.OpponentTeam
                        )}
                    </>
                  ) : (
                    _makeCharacterStatRowsFromTeam(
                      pgcrData.pgcrStats?.statTableData?.statsByCharacter,
                      ""
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <MissingPgcrDataError />
        )}
      </SpinnerContainer>
    </div>
  );
};

export default withDestinyDefinitions(Pgcr, {
  types: [
    "DestinyActivityModeDefinition",
    "DestinyActivityTypeDefinition",
    "DestinyActivityDefinition",
    "DestinyDestinationDefinition",
    "DestinyPlaceDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
