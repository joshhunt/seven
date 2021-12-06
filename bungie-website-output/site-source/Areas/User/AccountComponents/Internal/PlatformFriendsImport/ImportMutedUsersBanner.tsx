// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ActionSuccessModal } from "@Areas/User/AccountComponents/Internal/ActionSuccessModal";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import styles from "../../BlockedUsers.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { Icon } from "@UIKit/Controls/Icon";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useEffect, useState } from "react";

interface ImportMutedUsersBannerProps {}

export const ImportMutedUsersBanner: React.FC<ImportMutedUsersBannerProps> = (
  props
) => {
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [hasMutedUsers, setHasMutedUsers] = useState(false);

  const ImportMutedUsers = () => {
    Platform.IgnoreService.ImportToGlobal()
      .then((response) => {
        response && Modal.open(<ActionSuccessModal />);
      })
      .catch((e) => console.error(e.message));
    // If this fails, we don't need to show it to the user, because the banner won't show so the error message will not be clear.
  };

  useEffect(() => {
    Platform.IgnoreService.ManageIgnoresForUser(
      globalStateData.loggedInUser.user.membershipId
    )
      .then((data) => {
        setHasMutedUsers(data.length > 0);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }, []);

  return hasMutedUsers ? (
    <Grid className={styles.containerMuted}>
      <GridCol cols={12} className={styles.muted}>
        <Icon iconName={"exclamation-triangle"} iconType={"fa"} />
        <div className={styles.text}>
          <strong>{Localizer.friends.BlockExistingMutedUsers}</strong>
          <p
            dangerouslySetInnerHTML={sanitizeHTML(
              Localizer.Format(Localizer.Friends.ImportBlocked, {
                crossplayHelpPageUrl: RouteHelper.Help(),
              })
            )}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            size={BasicSize.Small}
            buttonType={"gold"}
            onClick={ImportMutedUsers}
          >
            {Localizer.Friends.BlockUsers}
          </Button>
          <Button
            size={BasicSize.Small}
            buttonType={"white"}
            url={RouteHelper.BlockedUsers()}
          >
            {Localizer.Friends.SeeBlockedUsers}
          </Button>
        </div>
      </GridCol>
    </Grid>
  ) : null;
};
