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
import { UrlUtils } from "@Utilities/UrlUtils";
import React, { useEffect, useState, useRef } from "react";
import styles from "./ZendeskAuth.module.scss";

interface ZendeskAuthProps {}

const ZendeskAuth: React.FC<ZendeskAuthProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const queryString = new URLSearchParams(window.location.search);
  const returnToKey = "return_to=";
  const returnToValue = queryString?.get(returnToKey);
  const [error, setError] = useState<PlatformError>();
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const redirectToZendesk = () => {
    Platform.UserService.ZendeskHelpAuthenticate(returnToKey + returnToValue)
      .then((result) => {
        if (result?.length) {
          const parsedResult = UrlUtils.parseUrl(result);
          formRef.current.action = parsedResult.endpoint;
          inputRef.current.value = parsedResult.jwt;
          formRef.current.submit();
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
      <form ref={formRef} method="post">
        <input ref={inputRef} type="hidden" name="jwt" />
      </form>
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
