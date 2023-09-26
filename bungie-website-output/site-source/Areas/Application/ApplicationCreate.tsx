// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ApplicationBreadcrumb } from "@Areas/Application/Shared/ApplicationBreadcrumb";
import { ApplicationEmailVerification } from "@Areas/Application/Shared/ApplicationEmailVerification";
import { ApplicationReactHookFormForm } from "@Areas/Application/Shared/ApplicationReactHookFormForm";
import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { EmailValidationStatus } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import styles from "./Shared/ApplicationCreate.module.scss";

interface ApplicationCreateProps {}

export const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const emailVerified =
    globalState?.loggedInUser?.emailStatus === EmailValidationStatus.VALID;
  const applicationLoc = Localizer.Application;

  if (!ConfigUtils.SystemStatus(SystemNames.ApplicationsReactUI)) {
    window.location.href = ApplicationUtils.redirectToRazor("Create");
  }

  return (
    <RequiresAuth
      onSignIn={() => GlobalStateDataStore.actions.refreshCurrentUser()}
    >
      <BungieHelmet
        title={applicationLoc.ApplicationsLabel}
        description={applicationLoc.ApplicationsLabel}
      />
      <SystemDisabledHandler
        systems={[SystemNames.ApplicationsReactUI, SystemNames.Applications]}
      >
        <Grid>
          <ApplicationBreadcrumb isCreate={true} />
          <GridCol cols={12}>
            <h2 className={styles.header}>{applicationLoc.CreatePageTitle}</h2>
            {emailVerified ? (
              <ApplicationReactHookFormForm />
            ) : (
              <ApplicationEmailVerification />
            )}
          </GridCol>
        </Grid>
      </SystemDisabledHandler>
    </RequiresAuth>
  );
};
