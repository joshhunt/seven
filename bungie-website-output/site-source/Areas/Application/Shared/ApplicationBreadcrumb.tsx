// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { AclEnum } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Applications } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import styles from "./ApplicationBreadcrumb.module.scss";
import React from "react";

interface ApplicationBreadcrumbProps {
  app?: Applications.Application;
  isCreate: boolean;
}

export const ApplicationBreadcrumb: React.FC<ApplicationBreadcrumbProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const applicationLoc = Localizer.Application;

  const hasElevatedReadPermission = ApplicationUtils.hasElevatedReadPermission(
    globalState,
    props.app
  );

  const owner = props.app?.team?.[0]?.user;

  const ownerBungieName = UserUtils.getBungieNameFromUserInfoCard(owner);

  const ownerDisplayName = owner
    ? ownerBungieName
      ? `${ownerBungieName?.bungieGlobalName}${ownerBungieName?.bungieGlobalCodeWithHashtag} (${owner?.membershipId})`
      : `${owner.displayName} (${owner.membershipId})`
    : applicationLoc.OwnerUnknown;

  const breadcrumbDivider = "//";

  return (
    <GridCol cols={12} className={styles.breadcrumb}>
      {props.isCreate || (props.app && hasElevatedReadPermission) ? (
        <div className="breadcrumb">
          <Anchor url={RouteHelper.Applications()}>
            {applicationLoc.YourApps}
          </Anchor>{" "}
          {breadcrumbDivider}
          {props.app ? (
            <>
              <span>{props.app.name}</span> {breadcrumbDivider}
              <span>{ownerDisplayName}</span>
            </>
          ) : (
            <span>{applicationLoc.CreatePageTitle}</span>
          )}
        </div>
      ) : null}
    </GridCol>
  );
};
