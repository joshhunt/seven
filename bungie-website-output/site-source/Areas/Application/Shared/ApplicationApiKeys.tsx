// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ApplicationApiKeyMenu } from "@Areas/Application/Shared/ApplicationApiKeyMenu";
import styles from "@Areas/Application/Shared/ApplicationApiKeys.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { ApiKeyStatus, OAuthApplicationType } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { Applications, Platform } from "@Platform";
import { MdControlPoint } from "@react-icons/all-files/md/MdControlPoint";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";

interface ApplicationApiKeysProps {
  app: Applications.Application;
  hasWritePermission: boolean;
}

export const ApplicationApiKeys: React.FC<ApplicationApiKeysProps> = ({
  app,
  hasWritePermission,
}) => {
  const openAuthEnabled = ConfigUtils.SystemStatus(
    SystemNames.OpenAuthentication
  );
  const applicationLoc = Localizer.Application;
  const maxKeysAllowed = ConfigUtils.GetParameter(
    SystemNames.Applications,
    SystemNames.MaximumApiKeysPerApplication,
    2
  );

  const [keys, setKeys] = useState<Applications.ApplicationApiKey[]>();

  const getApiKeys = () => {
    Platform.ApplicationService.GetApplicationApiKeys(app.applicationId)
      .then((result) => {
        setKeys(result);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const addApiKey = useCallback(() => {
    Platform.ApplicationService.CreateApiKey(app.applicationId)
      .then((result) => {
        //refresh the keys
        getApiKeys();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }, [app.applicationId]);

  useEffect(() => {
    app && getApiKeys();
  }, []);

  const oAuthAuthorizationUrl = `${Localizer.CurrentCultureName}/OAuth/Authorize`;

  return (
    <>
      <h3>{applicationLoc.ApiKeys}</h3>
      <div className={styles.apiKeys}>
        {keys?.map((k) => {
          return (
            <div key={k.apiKeyId} className={styles.apiKey}>
              {hasWritePermission && (
                <ApplicationApiKeyMenu
                  applicationKey={k}
                  callback={() => getApiKeys()}
                />
              )}
              <div className={styles.keyField}>
                <h4>{applicationLoc.ApiKey}</h4>
                <p>{k.apiKey}</p>
              </div>
              {openAuthEnabled && (
                <div className={styles.keyField}>
                  <h4>{applicationLoc.AuthorizationUrl}</h4>
                  <p>{k.authorizationUrl}</p>
                </div>
              )}

              {app && app?.applicationType !== 0 && (
                <div className={styles.keyField}>
                  <div>
                    <h4>{applicationLoc.OAuthAuthorizationUrl}</h4>
                    <p className={styles.link}>{oAuthAuthorizationUrl}</p>
                    <h4>{applicationLoc.ClientID}</h4>
                    <p>{k.apiKeyId}</p>
                    {app?.applicationType ===
                      OAuthApplicationType.Confidential && (
                      <>
                        <h4>{applicationLoc.ClientSecret}</h4>
                        <p>{k.clientSecret}</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.keyField}>
                <h4>{applicationLoc.KeyStatus}</h4>
                <p>
                  {k.status === ApiKeyStatus.Active
                    ? applicationLoc.keystatusactive
                    : applicationLoc.keystatusdisabled}
                </p>
              </div>
            </div>
          );
        })}

        {hasWritePermission && keys?.length < maxKeysAllowed && (
          <Button
            className={classNames(styles.addAppButton, styles.apiKey)}
            buttonType={"text"}
            onClick={() => addApiKey()}
          >
            <MdControlPoint />
            {applicationLoc.AddKey}
          </Button>
        )}
      </div>
    </>
  );
};
