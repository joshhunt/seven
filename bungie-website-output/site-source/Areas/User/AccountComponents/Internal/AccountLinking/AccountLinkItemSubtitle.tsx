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
import { ConfigUtils } from "@Utilities/ConfigUtils";

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

  const adminView = membershipIdFromQuery && isAdmin;

  const crossSavedAndNotLinkedMessage =
    destinyMembershipData.isCrossSaved && !isLinked
      ? Localizer.Accountlinking.YourBungieAccountHasCross
      : "";

  const loggedInMessageFeatureCheck = ConfigUtils.SystemStatus(
    "FeatureAccountLinkingUpdate"
  )
    ? Localizer.Accountlinking.YouAreLoggedInAcc
    : Localizer.Accountlinking.YouAreLoggedInWithThis;
  const loggedInCredMessage =
    !!onPageUserLoggedInCred &&
    credentialType === onPageUserLoggedInCred &&
    loggedInMessageFeatureCheck;

  return (
    <div className={styles.relativeContainer}>
      {isLinked && <div className={styles.platformName}>{displayName}</div>}
      {!isLinked && (
        <p className={styles.noAccountMessage}>
          {Localizer.Accountlinking.LinkAccount}
        </p>
      )}
      {crossSavedAndNotLinkedMessage ? (
        <p className={styles.subtitleMessage}>
          {crossSavedAndNotLinkedMessage}
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
