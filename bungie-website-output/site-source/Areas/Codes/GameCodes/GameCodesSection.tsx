// Created by larobinson, 2025
// Copyright Bungie, Inc.

import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { AclEnum, ClientDeviceType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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

  const cohortMapKey = AclHelper.getMarathonAclAsCohortMapKey(
    globalState?.loggedInUser?.userAcls
  );
  const cohortIsAllottedFriendLinks = async (cohortMapKey: string) => {
    try {
      const friendUrls = await Platform.UserService.GetMarathonFriendInviteUrls(
        cohortMapKey
      );
      if (!friendUrls || friendUrls.length === 0) {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking friend links:", error);
      return false;
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
    !AclHelper.hasMarathonAccess(globalState?.loggedInUser?.userAcls)
  ) {
    history.replace(RouteHelper.CodeRedemptionReact()?.url);
  }

  return (
    <RequiresAuth>
      <SystemDisabledHandler systems={["MarathonAlpha"]} name="Marathon Alpha">
        {cohortMapKey ? (
          <div className={styles.container}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                Loading game codes...
              </div>
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
          </div>
        ) : (
          <NoCodesMessage />
        )}
      </SystemDisabledHandler>
      <SystemDisabledHandler
        systems={["MarathonAlphaFriendCodes"]}
        name="Marathon Alpha"
      >
        {cohortIsAllottedFriendLinks(cohortMapKey) && <FriendCodes />}
      </SystemDisabledHandler>
    </RequiresAuth>
  );
};
