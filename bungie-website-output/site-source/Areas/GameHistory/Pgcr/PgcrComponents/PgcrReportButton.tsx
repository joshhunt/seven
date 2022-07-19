// Created by larobinson, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/GameHistory/Pgcr/Pgcr.module.scss";
import { ReportButtonProps } from "@Areas/User/AccountComponents/Internal/ReportButton";
import { ReportUser } from "@Areas/User/ProfileComponents/ReportUser";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfirmationModalInline } from "@UIKit/Controls/Modal/ConfirmationModal";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useState } from "react";

interface PgcrReportButtonProps extends ReportButtonProps {}

export const PgcrReportButton: React.FC<PgcrReportButtonProps> = (
  { ignoredItemId },
  itemContextType
) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSendReport, setConfirmSendReport] = useState(false);

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  return (
    <>
      <div
        aria-role={"button"}
        className={styles.button}
        onClick={() => setModalOpen(true)}
      >
        {Localizer.Profile.ProfileAction_Report}
      </div>

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
