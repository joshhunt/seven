// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ViewerPermissionContext } from "@Areas/User/Account";
import styles from "@Areas/User/AccountComponents/AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkingFlags } from "@Areas/User/AccountComponents/Internal/AccountLinkSection";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieCredentialType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button, ButtonProps } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Checkbox } from "@UIKit/Forms/Checkbox";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { ChangeEvent, useContext, useState } from "react";

export interface PublicCheckBoxEventTarget extends EventTarget {
  checked: boolean;
}

export interface PublicCheckBoxMouseEvent
  extends React.MouseEvent<HTMLElement> {
  target: PublicCheckBoxEventTarget;
}

interface AccountLinkItemProps {
  onPageUserLoggedInCred: BungieCredentialType | null;
  credentialType: BungieCredentialType;
  openLinkingModal: (cred: BungieCredentialType) => void;
  displayName: string;
  flag: AccountLinkingFlags;
  onPublicSettingChanged: (
    checked: boolean,
    credentialType: BungieCredentialType
  ) => void;
  /** Callback to run after credential changes link status */
  onCredentialChange?: () => void;
}

export const AccountLinkItem: React.FC<AccountLinkItemProps> = ({
  credentialType,
  openLinkingModal,
  flag,
  onPageUserLoggedInCred,
  displayName,
  onPublicSettingChanged,
  onCredentialChange,
}) => {
  const globalStateData = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const [checked, setChecked] = useState(
    isSelf && EnumUtils.hasFlag(flag, AccountLinkingFlags.Public)
  );

  const openLinkWindow = (cred: BungieCredentialType) => {
    BrowserUtils.openWindow(
      RouteHelper.GetAccountLink(cred, 0).url,
      "linkui",
      onCredentialChange
    );
  };
  const openUnlinkWindow = (cred: BungieCredentialType) => {
    BrowserUtils.openWindow(
      RouteHelper.GetAccountUnlink(cred, 0).url,
      "linkui",
      onCredentialChange
    );
  };

  interface AccountLinkingButtonProps {
    cred: BungieCredentialType;
  }

  /* Button creator */
  const AccountLinkingButton: React.FC<AccountLinkingButtonProps> = ({
    cred,
  }) => {
    const buttonProps: ButtonProps = {
      buttonType: "red",
      size: BasicSize.Small,
      onClick: () => openUnlinkWindow(cred),
      children: Localizer.accountLinking.UnlinkAccount,
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

  /* Subtitle Creator */
  const AccountLinkItemSubtitle: React.FC = () => {
    const crossSaveEligible = EnumUtils.hasFlag(
      flag,
      AccountLinkingFlags.CrossSaveEligible
    );
    const isLinked = EnumUtils.hasFlag(flag, AccountLinkingFlags.Linked);
    const isCrossSave = EnumUtils.hasFlag(flag, AccountLinkingFlags.CrossSaved);
    const isPublic = EnumUtils.hasFlag(flag, AccountLinkingFlags.Public);

    const crossSavedMessage =
      destinyMembershipData.isCrossSaved && crossSaveEligible && isLinked
        ? Localizer.Accountlinking.DisableCrossSaveToUnlink
        : Localizer.Accountlinking.YourBungieAccountHasCross;

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
        {crossSavedMessage ? (
          <p className={styles.subtitleMessage}>{crossSavedMessage}</p>
        ) : null}
        {isLinked && (
          <p className={styles.subtitleMessage}>{loggedInCredMessage}</p>
        )}
        {!isCrossSave && isLinked && (
          <Checkbox
            checked={checked}
            label={Localizer.Userpages.LinkAccountPrivacyLabel}
            onChecked={(updatedChecked: boolean) => {
              onPublicSettingChanged(updatedChecked, credentialType);
              setChecked(updatedChecked);
            }}
          />
        )}
      </div>
    );
  };

  const psnSystem = globalStateData.coreSettings.systems.PSNAuth;
  const xuidSystem = globalStateData.coreSettings.systems.XuidAuth;
  const stadiaSystem = globalStateData.coreSettings.systems.StadiaIdAuth;
  const steamSystem = globalStateData.coreSettings.systems.SteamIdAuth;
  const twitchSystem = globalStateData.coreSettings.systems.Twitch;

  /* Account Link Item creator */
  switch (credentialType) {
    case BungieCredentialType.Xuid:
      return (
        xuidSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionxbox}
            itemSubtitle={<AccountLinkItemSubtitle />}
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/xbox/icon.png`)}
              />
            }
            flair={<AccountLinkingButton cred={BungieCredentialType.Xuid} />}
          />
        )
      );
    case BungieCredentialType.Psnid:
      return (
        psnSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionplaystation}
            itemSubtitle={<AccountLinkItemSubtitle />}
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/playstation/icon.png`)}
              />
            }
            flair={<AccountLinkingButton cred={BungieCredentialType.Psnid} />}
          />
        )
      );
    case BungieCredentialType.SteamId:
      return (
        steamSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionsteam}
            itemSubtitle={<AccountLinkItemSubtitle />}
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/steam/icon.png`)}
              />
            }
            flair={<AccountLinkingButton cred={BungieCredentialType.SteamId} />}
          />
        )
      );
    case BungieCredentialType.StadiaId:
      return (
        stadiaSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionstadia}
            itemSubtitle={<AccountLinkItemSubtitle />}
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/stadia/icon.png`)}
              />
            }
            flair={
              <AccountLinkingButton cred={BungieCredentialType.StadiaId} />
            }
          />
        )
      );
    case BungieCredentialType.TwitchId:
      return (
        twitchSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptiontwitch}
            itemSubtitle={<AccountLinkItemSubtitle />}
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/twitch/icon.png`)}
              />
            }
            flair={
              <AccountLinkingButton cred={BungieCredentialType.TwitchId} />
            }
          />
        )
      );
    default:
      return null;
  }
};
