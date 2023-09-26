// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ApplicationBreadcrumb } from "@Areas/Application/Shared/ApplicationBreadcrumb";
import { ApplicationReactHookFormForm } from "@Areas/Application/Shared/ApplicationReactHookFormForm";
import { ApplicationUtils } from "@Areas/Application/Shared/ApplicationUtils";
import { Localizer } from "@bungie/localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { Applications, Platform } from "@Platform";
import { IApplicationParams } from "@Routes/RouteParams";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./Shared/Application.module.scss";

interface ApplicationDetailProps {}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = (props) => {
  const applicationLoc = Localizer.Application;

  const params = useParams<IApplicationParams>();

  const [app, setApp] = useState<Applications.Application>();

  const appId = params?.appId ? parseInt(params.appId, 10) : 0;

  const getApp = () => {
    if (ConfigUtils.SystemStatus("Applications")) {
      Platform.ApplicationService.GetApplication(appId)
        .then((result) => {
          setApp(result);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => Modal.error(e));
    }
  };

  useEffect(() => {
    getApp();
  }, []);

  if (app && !ConfigUtils.SystemStatus(SystemNames.ApplicationsReactUI)) {
    window.location.href = ApplicationUtils.redirectToRazor(
      "Detail",
      app?.applicationId.toString()
    );
  }

  return (
    <>
      <BungieHelmet
        title={app?.name ?? applicationLoc.ApplicationsLabel}
        description={app?.name ?? applicationLoc.ApplicationsLabel}
      />
      <SystemDisabledHandler
        systems={[SystemNames.ApplicationsReactUI, SystemNames.Applications]}
      >
        <Grid>
          {app && <ApplicationBreadcrumb app={app} isCreate={false} />}
          <GridCol cols={12}>
            {app ? (
              <>
                <h2 className={styles.header}>{app.name}</h2>
                <ApplicationReactHookFormForm app={app} />
              </>
            ) : (
              <h2>{applicationLoc.ApplicationNotFound}</h2>
            )}
          </GridCol>
        </Grid>
      </SystemDisabledHandler>
    </>
  );
};
