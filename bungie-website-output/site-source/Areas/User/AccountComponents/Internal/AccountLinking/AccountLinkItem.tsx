// Created by larobinson, 2021
// Copyright Bungie, Inc.
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BungieCredentialType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import React from "react";
import { AccountLinkButton } from "./AccountLinkButton";
import { AccountLinkItemSubtitle } from "./AccountLinkItemSubtitle";
import { AccountLinkingFlags } from "./AccountLinkSection";

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
  membershipSpecificId?: string;
}

export const AccountLinkItem: React.FC<AccountLinkItemProps> = ({
  credentialType,
  openLinkingModal,
  flag,
  onPageUserLoggedInCred,
  displayName,
  onPublicSettingChanged,
  onCredentialChange,
  membershipSpecificId,
}) => {
  const globalStateData = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);

  const psnSystem = globalStateData.coreSettings.systems.PSNAuth;
  const xuidSystem = globalStateData.coreSettings.systems.XuidAuth;
  const stadiaSystem = globalStateData.coreSettings.systems.StadiaIdAuth;
  const steamSystem = globalStateData.coreSettings.systems.SteamIdAuth;
  const twitchSystem = globalStateData.coreSettings.systems.Twitch;

  switch (credentialType) {
    case BungieCredentialType.Xuid:
      return (
        xuidSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionxbox}
            itemSubtitle={
              <AccountLinkItemSubtitle
                flag={flag}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
                credentialType={credentialType}
                displayName={displayName}
                onPublicSettingChanged={onPublicSettingChanged}
                membershipId={membershipSpecificId}
              />
            }
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/xbox/icon.png`)}
              />
            }
            flair={
              <AccountLinkButton
                cred={BungieCredentialType.Xuid}
                onCredentialChange={onCredentialChange}
                flag={flag}
                openLinkingModal={openLinkingModal}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
              />
            }
          />
        )
      );
    case BungieCredentialType.Psnid:
      return (
        psnSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionplaystation}
            itemSubtitle={
              <AccountLinkItemSubtitle
                flag={flag}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
                credentialType={credentialType}
                displayName={displayName}
                onPublicSettingChanged={onPublicSettingChanged}
                membershipId={membershipSpecificId}
              />
            }
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/playstation/icon.png`)}
              />
            }
            flair={
              <AccountLinkButton
                cred={BungieCredentialType.Psnid}
                onCredentialChange={onCredentialChange}
                flag={flag}
                openLinkingModal={openLinkingModal}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
              />
            }
          />
        )
      );
    case BungieCredentialType.SteamId:
      return (
        steamSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionsteam}
            itemSubtitle={
              <AccountLinkItemSubtitle
                flag={flag}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
                credentialType={credentialType}
                displayName={displayName}
                onPublicSettingChanged={onPublicSettingChanged}
                membershipId={membershipSpecificId}
              />
            }
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/steam/icon.png`)}
              />
            }
            flair={
              <AccountLinkButton
                cred={BungieCredentialType.SteamId}
                onCredentialChange={onCredentialChange}
                flag={flag}
                openLinkingModal={openLinkingModal}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
              />
            }
          />
        )
      );
    case BungieCredentialType.StadiaId:
      return (
        stadiaSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptionstadia}
            itemSubtitle={
              <AccountLinkItemSubtitle
                flag={flag}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
                credentialType={credentialType}
                displayName={displayName}
                onPublicSettingChanged={onPublicSettingChanged}
                membershipId={membershipSpecificId}
              />
            }
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/stadia/icon.png`)}
              />
            }
            flair={
              <AccountLinkButton
                cred={BungieCredentialType.StadiaId}
                onCredentialChange={onCredentialChange}
                flag={flag}
                openLinkingModal={openLinkingModal}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
              />
            }
          />
        )
      );
    case BungieCredentialType.TwitchId:
      return (
        twitchSystem.enabled && (
          <TwoLineItem
            itemTitle={Localizer.Registration.networksigninoptiontwitch}
            itemSubtitle={
              <AccountLinkItemSubtitle
                flag={flag}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
                credentialType={credentialType}
                displayName={displayName}
                onPublicSettingChanged={onPublicSettingChanged}
                membershipId={membershipSpecificId}
              />
            }
            normalWhiteSpace={true}
            icon={
              <IconCoin
                iconImageUrl={Img(`/bungie/icons/logos/twitch/icon.png`)}
              />
            }
            flair={
              <AccountLinkButton
                cred={BungieCredentialType.TwitchId}
                onCredentialChange={onCredentialChange}
                flag={flag}
                openLinkingModal={openLinkingModal}
                onPageUserLoggedInCred={onPageUserLoggedInCred}
              />
            }
          />
        )
      );
    default:
      return null;
  }
};
