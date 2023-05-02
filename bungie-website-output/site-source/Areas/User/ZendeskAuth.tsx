// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./ZendeskAuth.module.scss";

interface ZendeskAuthProps {}

const ZendeskAuth: React.FC<ZendeskAuthProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const queryString = new URLSearchParams(window.location.search);
  const returnToValue = queryString?.get("return_to");
  const returnToKey = "return_to=";
  const [error, setError] = useState<PlatformError>();

  const redirectToZendesk = () => {
    Platform.UserService.ZendeskHelpAuthenticate(returnToKey + returnToValue)
      .then((result) => {
        if (result?.length) {
          window.location.href = result;
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        setError(e);
      });
  };

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      redirectToZendesk();
    }
  }, []);

  return (
    <RequiresAuth onSignIn={() => redirectToZendesk()}>
      {error && (
        <div className={styles.errorMessage}>
          <h2>{Localizer.error.Error}</h2>
          <SafelySetInnerHTML html={error.message} />
        </div>
      )}
    </RequiresAuth>
  );
};

export default ZendeskAuth;
