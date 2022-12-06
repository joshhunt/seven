// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { ReportUser } from "@Areas/User/ProfileComponents/ReportUser";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { ReportItem } from "@UI/Report/ReportItem";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfirmationModalInline } from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useState } from "react";

export interface ReportButtonProps {
  ignoredItemId: string;
  itemContextType: IgnoredItemType;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  ignoredItemId,
  itemContextType,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  return (
    <Button
      buttonType={"red"}
      className={classNames(styles.button, styles.btnBlock, styles.btnReport)}
      onClick={() => {
        const modal = Modal.open(
          <ReportItem
            ignoredItemId={ignoredItemId}
            reportType={itemContextType}
            onReset={() => modal.current.close()}
          />
        );
      }}
    >
      {Localizer.actions.ReportProfile}
    </Button>
  );
};
