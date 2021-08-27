// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { useDataStore } from "@bungie/datastore/DataStore";
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

  const punishmentOptions = EnumUtils.getStringKeys(
    ModeratorRequestedPunishment
  ).map((rs: string) => ({
    label: Localizer.Forums["Moderator" + rs],
    value: rs,
  }));

  const reportOptions = globalState.coreSettings.ignoreReasons
    .sort((value1, value2) => {
      const defaultSort1 = value1.isDefault ? -1 : 0;
      const defaultSort2 = value2.isDefault ? -1 : 0;

      return (
        defaultSort1 - defaultSort2 ||
        parseInt(value1.identifier) - parseInt(value2.identifier)
      );
    })
    .map((value) => ({
      label: Localizer.Forums["report_" + value.identifier],
      value: value.identifier,
    }));

  const [selectedPunishment, setSelectedPunishment] = useState<string>(
    punishmentOptions[0].value
  );
  const [selectedReason, setSelectedReason] = useState<string>(
    reportOptions[0].value
  );

  const sendReport = () => {
    Platform.IgnoreService.FlagItem({
      ignoredItemId,
      ignoredItemType: IgnoredItemType.UserProfile,
      comment: "",
      reason: selectedReason,
      itemContextId: "0", //ItemContextId is set to its default here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
      itemContextType: IgnoredItemType.UserProfile,
      requestedPunishment:
        ModeratorRequestedPunishment[
          selectedPunishment as keyof typeof ModeratorRequestedPunishment
        ],
      requestedBlastBan: false,
    })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

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
            sendReport();

            return true;
          },
        }}
      >
        <h3>{Localizer.Forums.WhyReport}</h3>
        <Dropdown
          className={styles.report}
          options={reportOptions}
          onChange={(value) => setSelectedReason(value)}
        />

        <PermissionsGate permissions={[1]}>
          <h3>{Localizer.Forums.ModeratorRequestedPunishment}</h3>
          <p>{Localizer.Helptext.AdminMessageReportingWarning}</p>
          <Dropdown
            className={styles.report}
            options={punishmentOptions}
            onChange={(value) =>
              setSelectedPunishment(
                value as keyof typeof ModeratorRequestedPunishment
              )
            }
          />
        </PermissionsGate>
      </ConfirmationModalInline>
    </>
  );
};
