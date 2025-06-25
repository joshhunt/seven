// Created by larobinson, 2025
// Copyright Bungie, Inc.

import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ClientDeviceType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CodeRow } from "./CodeRowItem";
import { FriendCodes } from "./FriendCodes";
import styles from "./GameCodesSection.module.scss";

interface IGameCodesRouteParams {
  membershipId?: string;
}

export const GameCodes: React.FC = () => {
  const [codes, setCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const history = useHistory();

  useEffect(() => {
    loadMarketplaceCodes();
  }, []);

  const loadMarketplaceCodes = async () => {
    setIsLoading(true);
    try {
      const response = await Platform.TokensService.MarketplacePlatformCodeOfferHistory();
      if (response && Array.isArray(response)) {
        setCodes(response);
      }
    } catch (error) {
      console.error("Error loading codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const NoCodesMessage = () => {
    return (
      <div className={styles.noCodesMessage}>
        You don't have any game codes available.
      </div>
    );
  };

  if (
    !globalState?.loggedInUser?.userAcls ||
    !AclHelper.hasGameCodesAccess(globalState?.loggedInUser?.userAcls)
  ) {
    history.replace(RouteHelper.CodeRedemptionReact()?.url);
  }

  return (
    <RequiresAuth>
      {isLoading ? (
        <div className={styles.loadingContainer}>Loading game codes...</div>
      ) : (
        <>
          {codes?.length === 0 ? (
            <NoCodesMessage />
          ) : (
            codes?.map((code, index) => {
              return (
                <CodeRow
                  key={index}
                  title={code.OfferDisplayName}
                  platform={EnumUtils.getStringValue(
                    code.deviceType,
                    ClientDeviceType
                  )}
                  code={code.platformCode}
                />
              );
            })
          )}
        </>
      )}
    </RequiresAuth>
  );
};
