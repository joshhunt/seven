import {
  ConvertToPlatformError,
  ConvertToPlatformErrorSync,
} from "@ApiIntermediary";
import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";

import { PlatformError } from "@CustomErrors";
import { DestinyComponentType, PlatformErrorCodes } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Components, Platform } from "@Platform";
import { Alert } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization/Localizer";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";

// Required props
interface IUnclaimedRewardsAlertProps {
  seasonUtilArgs: ISeasonUtilArgs;
}

const UnclaimedRewardsAlert: React.FC<IUnclaimedRewardsAlertProps> = ({
  seasonUtilArgs,
}) => {
  const selectedMembership = useGameData().destinyData.selectedMembership;
  const { profile } = useProfileData({
    membershipId: selectedMembership?.membershipId,
    membershipType: selectedMembership?.membershipType,
    components: [DestinyComponentType.CharacterProgressions],
  });
  const characterProgressions = profile?.characterProgressions;
  const [unclaimedRewards, setUnclaimedRewardsAlert] = useState<number>(0);

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "coreSettings",
  ]);
  const previousSeasonHash =
    globalState.coreSettings.destiny2CoreSettings.pastSeasonHashes[
      globalState.coreSettings.destiny2CoreSettings.pastSeasonHashes.length - 1
    ];

  useEffect(() => {
    if (!globalState?.loggedInUser) {
      setUnclaimedRewardsAlert(0);
    }
  }, [globalState?.loggedInUser]);

  useEffect(() => {
    if (characterProgressions) {
      setUnclaimedRewardsAlert(
        SeasonProgressUtils.getUnclaimedRewardsForPlatform(
          previousSeasonHash,
          seasonUtilArgs?.definitions,
          characterProgressions
        )
      );
    }
  }, [characterProgressions]);

  return (
    <div style={{ marginTop: "1rem" }}>
      {unclaimedRewards > 0 && (
        <Alert severity={"warning"}>
          {Localizer.seasons.youhaveunclaimedrewards}
        </Alert>
      )}
    </div>
  );
};

export default UnclaimedRewardsAlert;
