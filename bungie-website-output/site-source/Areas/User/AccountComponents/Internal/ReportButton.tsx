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
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfirmationModalInline } from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useState } from "react";

interface ReportButtonProps {
  ignoredItemId: string;
  itemContextType: IgnoredItemType;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  ignoredItemId,
  itemContextType,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSendReport, setConfirmSendReport] = useState(false);

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  return (
    <>
      <Button
        buttonType={"red"}
        className={classNames(styles.button, styles.btnBlock, styles.btnReport)}
        onClick={() => setModalOpen(true)}
      >
        {Localizer.actions.ReportProfile}
      </Button>

      <ConfirmationModalInline
        type={"none"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        confirmButtonProps={{
          labelOverride: Localizer.actions.ReportProfile,
          onClick: () => {
            setConfirmSendReport(true);

            return true;
          },
        }}
      >
        <ReportUser
          sendReport={confirmSendReport}
          sentReport={() => setModalOpen(false)}
          ignoredItemId={ignoredItemId}
        />
      </ConfirmationModalInline>
    </>
  );
};
