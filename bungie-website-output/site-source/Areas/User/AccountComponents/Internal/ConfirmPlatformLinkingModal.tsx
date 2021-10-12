// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/Internal/ConfirmPlatformLinkingModal.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, PlatformFriendType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button, ButtonTypes } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useState } from "react";
import { ConfirmationModalInline } from "../../../../UI/UIKit/Controls/Modal/ConfirmationModal";

interface ConfirmPlatformLinkingModalProps {
  /** Control whether the confirmation modal shows or not */
  open: boolean;
  onClose: () => void;
  /** The specific credential in question, but passed in as a PlatformFriend, so can only be of credentials with a PlatformFriendType */
  platform?: PlatformFriendType;
  /** The specific credential in question */
  credential?: BungieCredentialType;
  /** All credentials linked for user */
  credentials?: BungieCredentialType[];
}

export const ConfirmPlatformLinkingModal: React.FC<ConfirmPlatformLinkingModalProps> = (
  props
) => {
  const { open, platform } = props;

  const credential =
    props.credential ??
    UserUtils.getCredentialTypeFromPlatformFriendType(platform);

  const globalState = useDataStore(GlobalStateDataStore, [
    "crossSavePairingStatus",
  ]);

  const accountlinkingLoc = Localizer.Accountlinking;
  const linkAccountString = accountlinkingLoc.LinkAccount;
  const typeToContinue = Localizer.Format(
    accountlinkingLoc.TypeConfirmstringToContinue,
    { confirmString: linkAccountString }
  );
  const [typedString, setTypedString] = useState("");
  const [stringsMatch, setStringsMatch] = useState(false);

  const isCrossSaved =
    globalState?.crossSavePairingStatus &&
    typeof globalState.crossSavePairingStatus.primaryMembershipId !==
      "undefined";

  if (credential === BungieCredentialType.None) {
    return null;
  }

  //getting credentialTypes here instead of GlobalStateDataStore to determine successful linking because there is a race condition in GlobalStateDataStore preventing us
  const getCredentialTypes = () => {
    Platform.UserService.GetCredentialTypesForAccount().then(
      (response: Contract.GetCredentialTypesForAccountResponse[]) => {
        if (response?.find((value) => value.credentialType === credential)) {
          Modal.open(accountlinkingLoc.SuccessfullyLinked);
        }
      }
    );
  };

  const linkPlatform = () => {
    BrowserUtils.openWindow(
      RouteHelper.GetAccountLink(credential, 0).url,
      "loginui",
      () => {
        GlobalStateDataStore.refreshUserAndRelatedData(true).then(() =>
          getCredentialTypes()
        );
      }
    );
  };

  const credentialString =
    accountlinkingLoc[
      EnumUtils.getStringValue(credential, BungieCredentialType)
    ];

  return (
    <ConfirmationModalInline
      open={open}
      type={"info"}
      contentClassName={styles.linkPlatformWarningContent}
      confirmButtonProps={{
        buttonType: stringsMatch ? "gold" : "disabled",
        disable: !stringsMatch,
        labelOverride: linkAccountString,
        onClick: () => {
          linkPlatform();

          return true;
        },
      }}
      cancelButtonProps={{
        buttonType: "white",
        onClick: () => true,
      }}
    >
      <div>
        {isCrossSaved && (
          <div className={styles.crossSaveWarningHeader}>
            <h3>{accountlinkingLoc.CrossSave}</h3>
            <p>{accountlinkingLoc.YourBungieAccountHasCross}</p>
          </div>
        )}

        <div className={styles.crossSaveWarningBody}>
          {isCrossSaved && (
            <ul className={styles.crossSaveWarnings}>
              <li>
                {Localizer.Format(accountlinkingLoc.YourCrossSaveGuardians, {
                  platform: credentialString,
                })}
              </li>
              <li className={styles.importantPoint}>
                {Localizer.Format(accountlinkingLoc.YouWillNotBeAbleToUnlink, {
                  platform: credentialString,
                })}
              </li>
            </ul>
          )}
          <p>{typeToContinue}</p>

          <input
            name={"linkAccountConfirm"}
            type={"text"}
            value={typedString}
            disabled={false}
            className={styles.textInput}
            placeholder={linkAccountString}
            onChange={(e) => {
              e.preventDefault();

              setTypedString(e.target.value);
              setStringsMatch(
                e.target.value.trim().toLowerCase() ===
                  linkAccountString.trim().toLowerCase()
              );
            }}
          />
        </div>
      </div>
    </ConfirmationModalInline>
  );
};
