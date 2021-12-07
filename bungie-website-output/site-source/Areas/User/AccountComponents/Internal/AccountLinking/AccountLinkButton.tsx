// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import React from "react";
import { RouteHelper } from "../../../../../Global/Routes/RouteHelper";
import { BungieCredentialType } from "../../../../../Platform/BnetPlatform.TSEnum";
import {
  Button,
  ButtonProps,
} from "../../../../../UI/UIKit/Controls/Button/Button";
import { BasicSize } from "../../../../../UI/UIKit/UIKitUtils";
import { BrowserUtils } from "../../../../../Utilities/BrowserUtils";
import { EnumUtils } from "../../../../../Utilities/EnumUtils";
import styles from "../../AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "../../DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkingFlags } from "./AccountLinkSection";

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
  }
  if (!EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked)) {
    buttonProps.disabled = false;
    buttonProps.onClick = () => openLinkWindow(cred);
    buttonProps.buttonType = "gold";
    buttonProps.children = Localizer.accountLinking.LinkAccount;
  }
  if (
    destinyMembershipData.isCrossSaved &&
    EnumUtils.hasFlag(flag, AccountLinkingFlags.CrossSaveEligible) &&
    !EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked)
  ) {
    buttonProps.children = Localizer.crosssave.addToCrossSave;
    buttonProps.onClick = () => openLinkingModal(cred);
  }

  if (!!onPageUserLoggedInCred && onPageUserLoggedInCred === cred) {
    buttonProps.disabled = true;
  }

  return (
    <Button {...buttonProps} className={styles.button}>
      {buttonProps.children}
    </Button>
  );
};
