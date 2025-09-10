import { ConvertToPlatformError } from "@ApiIntermediary";
import SeasonProgressUtils, {
  ISeasonUtilArgs,
} from "@Areas/Seasons/SeasonProgress/utils/SeasonProgressUtils";

import { PlatformError } from "@CustomErrors";
import { DestinyComponentType, PlatformErrorCodes } from "@Enum";
import {
  loadUserData,
  resetMembership,
  selectSelectedMembership,
} from "@Global/Redux/slices/destinyAccountSlice";
import { useAppSelector } from "@Global/Redux/store";
import { SystemNames } from "@Global/SystemNames";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Components, Platform } from "@Platform";
import { Alert } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization/Localizer";

// Required props
interface IUnclaimedRewardsAlertProps {
  seasonUtilArgs: ISeasonUtilArgs;
}

const UnclaimedRewardsAlert: React.FC<IUnclaimedRewardsAlertProps> = ({
  seasonUtilArgs,
}) => {
  const destiny2Disabled = !ConfigUtils.SystemStatus(SystemNames.Destiny2);
  const selectedMembership = useAppSelector(selectSelectedMembership);
  const [characterProgressions, setCharacterProgressions] = useState<
    Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent
  >(null);
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
    if (characterProgressions !== null) {
      setUnclaimedRewardsAlert(
        SeasonProgressUtils.getUnclaimedRewardsForPlatform(
          previousSeasonHash,
          seasonUtilArgs?.definitions,
          characterProgressions
        )
      );
    }
  }, [characterProgressions]);

  useEffect(() => {
    if (!destiny2Disabled && selectedMembership && globalState?.loggedInUser) {
      Platform.Destiny2Service.GetProfile(
        selectedMembership?.membershipType,
        selectedMembership?.membershipId,
        [DestinyComponentType.CharacterProgressions]
      )
        .then((data) => {
          setCharacterProgressions(data?.characterProgressions);
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          if (e.errorCode === PlatformErrorCodes.DestinyAccountNotFound) {
            // don't do anything, we already pop a lot of modals, they'll know if they see no characters on an accounts
          } else {
            Modal.error(e);
          }
        });
    }
  }, [selectedMembership, globalState?.loggedInUser]);

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
