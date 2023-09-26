// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ApplicationsList } from "@Areas/Application/Shared/ApplicationsList";
import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { Applications, Platform, Queries } from "@Platform";
import { DiGithubAlt } from "@react-icons/all-files/di/DiGithubAlt";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./Shared/ApplicationIndex.module.scss";

interface ApplicationIndexProps {}

export const ApplicationIndex: React.FC<ApplicationIndexProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [applicationsResult, setApplicationsResult] = useState<
    Queries.SearchResultApplication
  >();
  const applicationLoc = Localizer.Application;

  if (!ConfigUtils.SystemStatus(SystemNames.ApplicationsReactUI)) {
    window.location.href = ApplicationUtils.redirectToRazor("Index");
  }

  const getUserApplications = () => {
    if (UserUtils.isAuthenticated(globalState)) {
      const input: Applications.ApplicationQuery = {
        name: undefined,
        ownerMembershipId: globalState.loggedInUser?.user?.membershipId,
        itemsPerPage: undefined,
        currentPage: 0,
        requestContinuationToken: undefined,
      };

      Platform.ApplicationService.PrivateApplicationSearch(input).then(
        (result) => {
          setApplicationsResult(result);
        }
      );
    }
  };

  useEffect(() => {
    getUserApplications();
  }, []);

  return (
    <RequiresAuth
      onSignIn={() => GlobalStateDataStore.actions.refreshCurrentUser()}
    >
      <BungieHelmet
        title={applicationLoc.ApplicationsLabel}
        description={applicationLoc.ApplicationsLabel}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div className={styles.headerImage} />
      <SystemDisabledHandler
        systems={[SystemNames.ApplicationsReactUI, SystemNames.Applications]}
      >
        <Grid>
          <GridCol cols={12}>
            <div className={styles.header}>
              <h2>{applicationLoc.YourApps}</h2>
              <Button buttonType={"gold"} url={RouteHelper.ApplicationCreate()}>
                {applicationLoc.Create}
              </Button>
            </div>
            {applicationsResult?.results?.length ? (
              <ApplicationsList applicationsSearchResult={applicationsResult} />
            ) : (
              <p className={styles.noAppMessage}>
                {applicationLoc.NoApplicationsExist}
              </p>
            )}
            <p className={styles.developerCommunity}>
              <DiGithubAlt />
              <SafelySetInnerHTML html={applicationLoc.DeveloperCommunity} />
            </p>
          </GridCol>
        </Grid>
      </SystemDisabledHandler>
    </RequiresAuth>
  );
};
