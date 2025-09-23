// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { MissingPgcrDataError } from "@Areas/Pgcr/PgcrComponents/MissingPgcrDataError";
import { PgcrLeaderStatItem } from "@Areas/Pgcr/PgcrComponents/PgcrLeaderStatItem";
import { PgcrReportButton } from "@Areas/Pgcr/PgcrComponents/PgcrReportButton";
import PgcrStatBar from "@Areas/Pgcr/PgcrComponents/PgcrStatBar";
import {
  initialActivityData,
  initialDerivedDefinitionHashes,
  PgcrActivityData,
  PgcrDataStore,
  PgcrDerivedDefinitionHashes,
  PgcrStatsByCharacter,
} from "@Areas/Pgcr/PgcrDataStore";
import { PgcrUtils } from "@Areas/Pgcr/PgcrUtils";
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
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { HistoricalStats, Platform } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import { Anchor } from "@UI/Navigation/Anchor";
import { Timestamp } from "@UI/Utility/Timestamp";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { IoMdLink } from "@react-icons/all-files/io/IoMdLink";
import styles from "./Pgcr.module.scss";

export interface BasicDestinyActivityData {
  icon: string;
  activityName: string;
  location: string;
  timestamp: string;
  standing: HistoricalStats.DestinyHistoricalStatsValue | null;
}

interface PgcrProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
    | "DestinyDestinationDefinition"
    | "DestinyPlaceDefinition"
    | "DestinyInventoryItemLiteDefinition"
    | "DestinyActivityDifficultyTierCollectionDefinition"
  > {
  activityId: string;
  singleton?: boolean;
  character?: string;
}

const Pgcr: React.FC<PgcrProps> = (props) => {
  const [pgcrLoaded, setPgcrLoaded] = useState(false);
  const [team1, setTeam1] = useState<PgcrStatsByCharacter>({});
  const [team2, setTeam2] = useState<PgcrStatsByCharacter>({});
  const [basicActivityData, setBasicActivityData] = useState<
    BasicDestinyActivityData
  >(null);
  const pgcrData = useDataStore(PgcrDataStore);
  const [selectedStat, setSelectedStat] = useState<string>(
    pgcrData.pgcrStats?.statTableData?.statNames[0]
  );
  const responsive = useDataStore(Responsive);
  const [showError, setShowError] = useState(false);
  const globalstate = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    setPgcrLoaded(false);

    Platform.Destiny2Service.GetPostGameCarnageReport(props.activityId)
      .then((pgcr) => {
        if (!pgcr) {
          setShowError(true);

          return;
        } else {
          showError && setShowError(false);
        }

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
        const difficultyTierCollection = props.definitions.DestinyActivityDifficultyTierCollectionDefinition.get(
          activityDefinition?.difficultyTierCollectionHash
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
          EnumUtils.looseEquals(
            activityModeDefinition?.activityModeCategory,
            DestinyActivityModeCategory.PvE,
            DestinyActivityModeCategory
          ) &&
          (EnumUtils.looseEquals(
            activityModeDefinition?.modeType,
            DestinyActivityModeType.ScoredHeroicNightfall,
            DestinyActivityModeType
          ) ||
            EnumUtils.looseEquals(
              activityModeDefinition?.modeType,
              DestinyActivityModeType.ScoredNightfall,
              DestinyActivityModeType
            ))
        ) {
          newActivityData.isScoredPvE = true;
        }

        if (!activityModeDefinition?.parentHashes) {
          PgcrDataStore.actions.updatePgcrActivityData(newActivityData);

          throw new Error("Can't find parentHashes of this activity mode");
        }

        activityModeDefinition?.parentHashes?.forEach((parentHash) => {
          const parent = props.definitions.DestinyActivityModeDefinition.get(
            parentHash
          );

          newActivityData.isCrucible =
            newActivityData.isCrucible ||
            EnumUtils.looseEquals(
              parent?.modeType,
              DestinyActivityModeType.AllPvP,
              DestinyActivityModeType
            );

          parent.parentHashes?.forEach((parentOfParentHash) => {
            const parentOfParent = props.definitions.DestinyActivityModeDefinition.get(
              parentOfParentHash
            );
            if (parentOfParent) {
              newActivityData.isCrucible =
                newActivityData.isCrucible ||
                EnumUtils.looseEquals(
                  parent?.modeType,
                  DestinyActivityModeType.AllPvP,
                  DestinyActivityModeType
                );
            }
          });
        });

        if (!activityDefinition && !activityTypeDefinition) {
          PgcrDataStore.actions.updatePgcrActivityData(newActivityData);
        }

        if (
          EnumUtils.looseEquals(
            activityModeDefinition?.activityModeCategory,
            DestinyActivityModeCategory.PvECompetitive,
            DestinyActivityModeCategory
          )
        ) {
          newActivityData.isGambit = true;
        }

        if (newActivityData.isCrucible || newActivityData.isGambit) {
          if (props.character) {
            newActivityData.focusedTeamId = PgcrUtils.getTeamIdForCharacter(
              pgcr,
              props.character
            );
          } else {
            const firstTeam = pgcr.teams?.[0];
            if (newActivityData.focusedTeamId === -1 && firstTeam?.teamId) {
              newActivityData.focusedTeamId = firstTeam.teamId;
              newActivityData.focusedTeamStanding =
                firstTeam.standing?.basic?.value;
            }
          }
        }

        {
          if (pgcr.teams?.length > 1) {
            const opponentTeam = pgcr.teams?.find(
              (a) => a.teamId !== newActivityData.focusedTeamId
            );
            if (opponentTeam) {
              newActivityData.opponentTeamId = opponentTeam.teamId;
              newActivityData.focusedTeamStanding =
                opponentTeam.standing?.basic?.value;
            }
          } else if (
            newActivityData.isGambit &&
            newActivityData.focusedTeamId !== -1
          ) {
            pgcr.entries.forEach((entry) => {
              const team = PgcrUtils.getTeamIdFromEntry(entry);

              if (team !== -1 && team !== newActivityData.focusedTeamId) {
                newActivityData.opponentTeamId = team;
              }
            });
          }
        }

        newActivityData.pgcrImage = activityDefinition?.pgcrImage;

        const activityModeDisplayProperties =
          activityModeDefinition?.displayProperties;
        const activityDisplayProperties = activityDefinition?.displayProperties;
        const characterEntry = props.character
          ? pgcr?.entries.find(
              (entry) => entry?.characterId === props.character
            )
          : pgcr?.entries[0];
        const difficultyName =
          difficultyTierCollection?.difficultyTiers[pgcr.activityDifficultyTier]
            ?.displayProperties.name;
        const defaultLocation =
          activityDisplayProperties?.name ||
          Localizer.destiny.CLASSIFIED_UNAVAILABLE_SOURCE;

        let location = difficultyName
          ? `${defaultLocation}: ${difficultyName}`
          : defaultLocation;

        // show the director selected activity name (playlist) for Crucible (PvP) activities
        if (
          activityModeDefinition.activityModeCategory ===
          DestinyActivityModeCategory.PvP
        ) {
          const directorActivityDefinition = props.definitions.DestinyActivityDefinition.get(
            newDefinitionHashes.directorActivityHash
          );
          const directorActivityName =
            directorActivityDefinition?.displayProperties?.name ?? "";

          if (
            directorActivityName.length > 0 &&
            !directorActivityName.includes(defaultLocation)
          ) {
            location = `${defaultLocation} - ${directorActivityName}`;
          }
        }

        setBasicActivityData({
          icon: activityModeDisplayProperties?.icon,
          activityName:
            activityModeDisplayProperties?.name ||
            Localizer.destiny.CLASSIFIED_UNAVAILABLE_SOURCE,
          location,
          timestamp: pgcr?.period,
          standing: characterEntry?.values?.standing,
        });

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

      Object.keys(pgcrData.pgcrStats?.statTableData?.statsByCharacter)?.forEach(
        (id: string) => {
          const char =
            pgcrData.pgcrStats?.statTableData?.statsByCharacter?.[id];
          if (char.team === pgcrData.pgcrActivityData.focusedTeamId) {
            tempTeam1[id] = char;
          } else if (char.team === pgcrData.pgcrActivityData.opponentTeamId) {
            tempTeam2[id] = char;
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
    const statSelectionOptions: IDropdownOption[] = pgcrData.pgcrStats?.statTableData?.statNames?.map(
      (statName) => {
        return {
          label: makeOrAbbreviateStatName(statName),
          value: statName,
        };
      }
    );
    const getCharacterStatValue = (characterId: string | number) => {
      return pgcrData.pgcrStats?.statTableData?.statsByCharacter?.[
        characterId
      ].stats.find(
        (statItem) => statItem?.name && statItem?.name === selectedStat
      )?.value;
    };

    return (
      <>
        <table>
          {isMobile ? (
            <>
              <thead>
                <th />
                <th>
                  <Dropdown
                    options={statSelectionOptions}
                    onChange={(value) => setSelectedStat(value)}
                  />
                </th>
              </thead>
              <tbody>
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
                                  team?.[ci]?.emblem
                                )?.displayProperties?.icon
                              }`,
                            }}
                          />
                          <div className={styles.nameReportContainer}>
                            <div>{team?.[ci]?.displayName}</div>
                            {UserUtils.isAuthenticated(globalstate) && (
                              <PgcrReportButton
                                ignoredItemId={team?.[ci]?.membershipId}
                                itemContextType={IgnoredItemType.UserProfile}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{getCharacterStatValue(ci)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <th>{teamLabel}</th>
                {pgcrData.pgcrStats?.statTableData?.statNames?.map((n, i) => (
                  <th key={i} className={styles.statName}>
                    {makeOrAbbreviateStatName(n)}
                  </th>
                ))}
              </thead>
              <tbody>
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
                                  team?.[ci]?.emblem
                                )?.displayProperties?.icon
                              }`,
                            }}
                          />
                          <div>{team?.[ci]?.displayName}</div>
                          <PgcrReportButton
                            ignoredItemId={team?.[ci]?.membershipId}
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
                })}
              </tbody>
            </>
          )}
        </table>
      </>
    );
  };

  const makeOrAbbreviateStatName = (name: string) => {
    if (
      Localizer.historicalstats[`StatName_${name}`].length > 15 &&
      !Localizer.historicalstats[`StatNameAbbr_${name}`].startsWith("##")
    ) {
      return Localizer.historicalstats[`StatNameAbbr_${name}`];
    }

    return Localizer.historicalstats[`StatName_${name}`];
  };

  const pgcrDirectLink = props.character
    ? RouteDefs.Areas.Pgcr.getAction("Index").resolve(
        { id: props.activityId },
        { character: props.character }
      ).url
    : RouteDefs.Areas.Pgcr.getAction("Index").resolve({ id: props.activityId })
        .url;

  return (
    <div
      className={classNames(styles.contentBounds, {
        [styles.fullWidth]: props.singleton,
      })}
    >
      <SpinnerContainer loading={!pgcrLoaded}>
        {showError && <MissingPgcrDataError />}
        {basicActivityData && (
          <div>
            <div
              className={styles.header}
              style={{
                backgroundImage: `url(${pgcrData.pgcrActivityData?.pgcrImage})`,
              }}
            >
              {!props.singleton && (
                <Anchor
                  className={styles.pgcrDirectLink}
                  url={pgcrDirectLink}
                  legacy={false}
                >
                  <IoMdLink />
                </Anchor>
              )}
              <img
                className={styles.activityIcon}
                src={basicActivityData?.icon}
              />
              <div className={styles.activityName}>
                {basicActivityData?.activityName}
              </div>
              <div className={styles.activityLocation}>
                {basicActivityData?.location}
              </div>
              <div className={styles.infoPills}>
                <div className={styles.timestamp}>
                  <Timestamp time={basicActivityData?.timestamp} />
                </div>
                {basicActivityData?.standing?.basic?.displayValue &&
                  props.character && (
                    <div
                      className={classNames(styles.standing, {
                        [styles.defeat]:
                          basicActivityData?.standing?.basic?.displayValue?.toLowerCase() ===
                          "defeat",
                      })}
                    >
                      {basicActivityData?.standing?.basic?.displayValue}
                    </div>
                  )}
              </div>
            </div>
            <div className={styles.body}>
              {pgcrData?.pgcr?.teams?.length > 1 && (
                <div className={styles.statBars}>
                  {pgcrData.pgcrStats?.statBarData?.map((stat, i) => (
                    <PgcrStatBar key={i} statId={stat} />
                  ))}
                </div>
              )}
              <div>
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
    "DestinyActivityDifficultyTierCollectionDefinition",
  ],
});
