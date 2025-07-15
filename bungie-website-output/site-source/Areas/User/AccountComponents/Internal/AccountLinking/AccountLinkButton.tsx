// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import React from "react";
import { RouteHelper } from "@Routes/RouteHelper";
import { BungieCredentialType } from "@Enum";
import { Button, ButtonProps } from "@UI/UIKit/Controls/Button/Button";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import styles from "../../AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "../../DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkingFlags } from "./AccountLinkSection";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { FaLink } from "@react-icons/all-files/fa/FaLink";

interface AccountLinkButtonProps {
  cred: BungieCredentialType;
  onCredentialChange: () => void;
  flag: AccountLinkingFlags;
  openLinkingModal: (cred: BungieCredentialType) => void;
  onPageUserLoggedInCred: BungieCredentialType;
}

export const AccountLinkButton: React.FC<AccountLinkButtonProps> = ({
  cred,
  onCredentialChange,
  flag,
  openLinkingModal,
  onPageUserLoggedInCred,
}) => {
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);

  const displayProps = {
    type: "button",
  };
  const buttonProps: ButtonProps = {
    buttonType: "red",
    size: BasicSize.Small,
    onClick: () => openUnlinkWindow(cred),
    children: Localizer.accountLinking.UnlinkAccount,
  };

  const openLinkWindow = (cr: BungieCredentialType) => {
    BrowserUtils.openWindow(
      RouteHelper.SignInPreview(cr).url,
      "linkpreviewui",
      onCredentialChange
    );
  };
  const openUnlinkWindow = (cr: BungieCredentialType) => {
    BrowserUtils.openWindow(
      RouteHelper.GetAccountUnlink(cr, 0).url,
      "linkui",
      onCredentialChange
    );
  };

  if (flag & AccountLinkingFlags.CrossSaved) {
    buttonProps.url = null;
    buttonProps.disabled = true;
    displayProps.type = "button";
  }
  if (!EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked)) {
    buttonProps.disabled = false;
    buttonProps.onClick = () => openLinkWindow(cred);
    buttonProps.buttonType = "gold";
    buttonProps.children = Localizer.accountLinking.LinkAccount;
    displayProps.type = "button";
  }
  if (
    destinyMembershipData.isCrossSaved &&
    EnumUtils.hasFlag(flag, AccountLinkingFlags.CrossSaveEligible) &&
    !EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked)
  ) {
    buttonProps.children = Localizer.crosssave.addToCrossSave;
    buttonProps.onClick = () => openLinkingModal(cred);
    displayProps.type = "button";
  }
  if (
    ConfigUtils.SystemStatus("FeatureAccountLinkingUpdate") &&
    EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked) &&
    cred !== BungieCredentialType.TwitchId
  ) {
    displayProps.type = "text";
  }
  if (!!onPageUserLoggedInCred && onPageUserLoggedInCred === cred) {
    if (ConfigUtils.SystemStatus("FeatureAccountLinkingUpdate")) {
      displayProps.type = "text";
    } else {
      buttonProps.disabled = true;
      displayProps.type = "button";
    }
  }

  return displayProps.type !== "text" ? (
    <Button {...buttonProps} className={styles.button}>
      {buttonProps.children}
    </Button>
  ) : (
    <p className={styles.linkButtonTextLabel}>
      {Localizer.accountLinking.LinkedLabel} <FaLink />
    </p>
  );
};
