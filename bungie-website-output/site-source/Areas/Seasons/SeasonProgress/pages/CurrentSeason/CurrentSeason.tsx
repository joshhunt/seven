// Created by atseng, 2019
// Copyright Bungie, Inc.

import { SeasonHeaderLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonHeaderLayout";
import { SeasonProgressLayout } from "@Areas/Seasons/SeasonProgress/components/SeasonProgressLayout";
import RewardsCarousel from "@Areas/Seasons/SeasonProgress/components/SeasonProgressRewardsSection/RewardsCarousel/RewardsCarousel";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import SeasonProgressUtils from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { selectDestinyAccount } from "@Global/Redux/slices/destinyAccountSlice";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useState } from "react";
import styles from "./CurrentSeason.module.scss";

interface ICurrentSeasonProps
  extends D2DatabaseComponentProps<
    | "DestinyClassDefinition"
    | "DestinySeasonDefinition"
    | "DestinyProgressionDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {}

/**
 * CurrentSeason - Base Season Utility Page
 *  *
 * @param {ICurrentSeasonProps} props
 * @returns
 */
const CurrentSeason: React.FC<ICurrentSeasonProps> = (
  props: ICurrentSeasonProps
) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "coreSettings",
  ]);
  const destinyAccount = useAppSelector(selectDestinyAccount);
  const dispatch = useAppDispatch();

  /* Season definitions */
  const seasonHash =
    globalState.coreSettings.destiny2CoreSettings.currentSeasonHash;
  const seasonUtilArgs = {
    seasonHash: seasonHash,
    definitions: props.definitions,
  };

  const seasonPassHash = SeasonProgressUtils?.getCurrentSeasonPass(
    seasonUtilArgs
  )?.hash;

  return (
    <SeasonProgressLayout seasonDefinition={SeasonsDefinitions?.currentSeason}>
      <div className={styles.seasonInfoContainer}>
        <SeasonHeaderLayout
          isCurrentSeason={true}
          seasonUtilArgs={seasonUtilArgs}
        />
      </div>

      <RewardsCarousel
        seasonHash={seasonHash}
        seasonPassHash={seasonPassHash}
      />
    </SeasonProgressLayout>
  );
};

export default withDestinyDefinitions(CurrentSeason, {
  types: [
    "DestinySeasonDefinition",
    "DestinyClassDefinition",
    "DestinySeasonDefinition",
    "DestinyProgressionDefinition",
    "DestinySeasonPassDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
