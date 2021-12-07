// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import React, { useContext, useState } from "react";
import { GlobalStateDataStore } from "../../../../../Global/DataStore/GlobalStateDataStore";
import { BungieCredentialType } from "../../../../../Platform/BnetPlatform.TSEnum";
import { Checkbox } from "../../../../../UI/UIKit/Forms/Checkbox";
import { EnumUtils } from "../../../../../Utilities/EnumUtils";
import { ViewerPermissionContext } from "../../../Account";
import styles from "../../AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "../../DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkAdminView } from "./AccountLinkAdminView";
import { AccountLinkingFlags } from "./AccountLinkSection";

interface AccountLinkItemSubtitleProps {
  flag: AccountLinkingFlags;
  onPageUserLoggedInCred: BungieCredentialType;
  credentialType: BungieCredentialType;
  displayName: string;
  onPublicSettingChanged: (
    checked: boolean,
    credentialType: BungieCredentialType
  ) => void;
  membershipId: string;
}

export const AccountLinkItemSubtitle: React.FC<AccountLinkItemSubtitleProps> = ({
  flag,
  onPageUserLoggedInCred,
  credentialType,
  displayName,
  onPublicSettingChanged,
  membershipId,
}) => {
  const globalStateData = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);
  const crossSaveEligible = EnumUtils.hasFlag(
    flag,
    AccountLinkingFlags.CrossSaveEligible
  );
  const isLinked = EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked);
  const isCrossSave = EnumUtils.hasFlag(flag, AccountLinkingFlags.CrossSaved);
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const [isPublic, setIsPublic] = useState(
    isSelf &&
      globalStateData.credentialTypes.find(
        (x) => x.credentialType === credentialType
      )?.isPublic
  );

  const isCrossSavedAndLinked =
    destinyMembershipData.isCrossSaved && crossSaveEligible && isLinked;
  const adminView = membershipIdFromQuery && isAdmin;

  const crossSavedAndLinkedMessage = isCrossSavedAndLinked
    ? Localizer.Accountlinking.DisableCrossSaveToUnlink
    : "";
  const crossSavedAndNotLinkedMessage =
    destinyMembershipData.isCrossSaved && !isLinked
      ? Localizer.Accountlinking.YourBungieAccountHasCross
      : "";

  const loggedInCredMessage =
    !!onPageUserLoggedInCred &&
    credentialType === onPageUserLoggedInCred &&
    Localizer.Accountlinking.YouAreLoggedInWithThis;

  return (
    <div className={styles.relativeContainer}>
      {isLinked && <div className={styles.platformName}>{displayName}</div>}
      {!isLinked && (
        <p className={styles.noAccountMessage}>
          {Localizer.Accountlinking.LinkAccount}
        </p>
      )}
      {crossSavedAndLinkedMessage || crossSavedAndNotLinkedMessage ? (
        <p className={styles.subtitleMessage}>
          {crossSavedAndLinkedMessage || crossSavedAndNotLinkedMessage}
        </p>
      ) : null}
      {isLinked && (
        <p className={styles.subtitleMessage}>{loggedInCredMessage}</p>
      )}
      {!isCrossSave && isLinked && (
        <Checkbox
          checked={isPublic}
          label={Localizer.Userpages.LinkAccountPrivacyLabel}
          onChecked={(updatedChecked: boolean) => {
            onPublicSettingChanged(updatedChecked, credentialType);
            setIsPublic(updatedChecked);
          }}
        />
      )}
      {adminView && <AccountLinkAdminView membershipId={membershipId} />}
    </div>
  );
};
