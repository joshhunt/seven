// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { useEffect, useState } from "react";

interface ReportClanProps {
  ignoredItemId: string;
  sendReport: boolean;
  sentReport: () => void;
  reportType: IgnoredItemType;
}

export const ReportClan: React.FC<ReportClanProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
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
  const [sentReport, setSentReport] = useState(false);

  useEffect(() => {
    if (!sentReport && props.sendReport) {
      sendReport();
    }
  }, [props.sendReport]);

  const sendReport = () => {
    Platform.IgnoreService.FlagItem({
      ignoredItemId: props.ignoredItemId,
      ignoredItemType: props.reportType,
      comment: "",
      reason: selectedReason,
      itemContextId: "0", //ItemContextId is set to its default here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
      itemContextType: props.reportType,
      requestedPunishment:
        ModeratorRequestedPunishment[
          selectedPunishment as keyof typeof ModeratorRequestedPunishment
        ],
      requestedBlastBan: false,
    })
      .then(() => {
        props.sentReport();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  return (
    <>
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
    </>
  );
};
