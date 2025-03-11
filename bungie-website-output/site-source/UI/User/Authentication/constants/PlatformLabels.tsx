import { Localizer } from "@bungie/localization";
import { BungieCredentialType } from "@Enum";
import React, { ReactNode } from "react";
import { FaPlaystation } from "@react-icons/all-files/fa/FaPlaystation";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { FaSteam } from "@react-icons/all-files/fa/FaSteam";
import { FaTwitch } from "@react-icons/all-files/fa/FaTwitch";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";

const {
  PlaystationAccount,
  EpicGameStoreAccount,
  SteamAccount,
  XboxAccount,
  TwitchAccount,
  BungieNetProfile,
} = Localizer.webauth;

const {
  networksigninoptionplaystation,
  networksigninoptionxbox,
  networksigninoptionsteam,
  networksigninoptiontwitch,
  networksigninoptionegs,
} = Localizer.Registration;

interface CredentialMapProps {
  [key: string]: {
    logo?: ReactNode;
    accountLabel?: string; // '{Platform} Account'
    platformName?: string; // '{Platform}'
  };
}

export const CREDENTIAL_CONTENT_MAP: CredentialMapProps = {
  [BungieCredentialType.Psnid]: {
    logo: <FaPlaystation />,
    platformName: networksigninoptionplaystation,
    accountLabel: PlaystationAccount,
  },
  [BungieCredentialType.Xuid]: {
    logo: <FaXbox />,
    platformName: networksigninoptionxbox,
    accountLabel: XboxAccount,
  },
  [BungieCredentialType.SteamId]: {
    logo: <FaSteam />,
    platformName: networksigninoptionsteam,
    accountLabel: SteamAccount,
  },
  [BungieCredentialType.TwitchId]: {
    logo: <FaTwitch />,
    platformName: networksigninoptiontwitch,
    accountLabel: TwitchAccount,
  },
  [BungieCredentialType.EgsId]: {
    logo: <SiEpicgames />,
    platformName: networksigninoptionegs,
    accountLabel: EpicGameStoreAccount,
  },
  ["bnet_profile"]: {
    accountLabel: BungieNetProfile,
    platformName: BungieNetProfile,
  },
};
