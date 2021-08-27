// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Dropdown, IDropdownOption } from "@UIKit/Forms/Dropdown";
import { FormikTextInput } from "@UIKit/Forms/FormikForms/FormikTextInput";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useState } from "react";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { Contracts, Platform } from "@Platform";

interface ReportButtonProps {
  ignoredItemId: string;
  itemContextType: IgnoredItemType;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  ignoredItemId,
  itemContextType,
}) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const [comment, setComment] = useState<string>();
  const [selectedPunishment, setSelectedPunishment] = useState<string>();
  const [selectedReason, setSelectedReason] = useState<string>();

  const punishmentOptions = EnumUtils.getStringKeys(
    ModeratorRequestedPunishment
  ).map((rs: string) => {
    return {
      label: Localizer.Forums["Moderator" + rs],
      value: rs,
    } as IDropdownOption;
  });

  const reportOptions = globalState.coreSettings.ignoreReasons
    .sort((value1, value2) => {
      return parseInt(value1.identifier) - parseInt(value2.identifier);
    })
    .map((value) => {
      return {
        label: Localizer.Forums["report_" + value.identifier],
        value: value.displayName,
      } as IDropdownOption;
    });

  const showOptions = () => {
    ConfirmationModal.show({
      type: "none",
      children: (
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
      ),
      confirmButtonProps: {
        labelOverride: Localizer.actions.ReportProfile,
        onClick: () => {
          report();

          return true;
        },
      },
    });
  };

  const report = () => {
    //ItemContextId is set to their defaults here. The C# code expects Longs, we can only provide ints or strings in js -- the endpoint knows how to handle it
    const ignoreItemRequest = {
      ignoredItemId,
      ignoredItemType: IgnoredItemType.UserProfile,
      comment: comment,
      reason: selectedReason,
      itemContextId: "0",
      itemContextType: IgnoredItemType.UserProfile,
      requestedPunishment:
        ModeratorRequestedPunishment[
          selectedPunishment as keyof typeof ModeratorRequestedPunishment
        ],
      requestedBlastBan: false,
    } as Contracts.IgnoreItemRequest;

    Platform.IgnoreService.FlagItem(ignoreItemRequest)
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  return (
    <Button
      buttonType={"red"}
      className={classNames(styles.button, styles.btnBlock, styles.btnReport)}
      onClick={showOptions}
    >
      {Localizer.actions.ReportProfile}
    </Button>
  );
};
