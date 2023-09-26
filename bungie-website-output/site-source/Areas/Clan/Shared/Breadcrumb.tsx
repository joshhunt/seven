// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { FaAngleLeft } from "@react-icons/all-files/fa/FaAngleLeft";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import styles from "./Breadcrumb.module.scss";

interface BreadcrumbProps {
  clanId: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);

  const clan = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === props.clanId
  );

  const canViewSettings = ClanUtils.canViewAdmin(clan, globalState);
  const isMember = !!globalState.loggedInUserClans?.results?.find(
    (c) => c.group?.groupId === props.clanId
  );

  const path = window.location.pathname.toLowerCase();
  const isSettingsPage = path.includes("/settings");
  const isProfilePage = path.includes("/profile");

  const getLink = () => {
    const settingsAnchor = (
      <Anchor url={RouteHelper.NewClanSettings({ clanId: props.clanId })}>
        <FaAngleLeft />
        {clansLoc.ClanSettings}
      </Anchor>
    );
    const chatAnchor = (
      <Anchor url={RouteHelper.ClanChat(props.clanId)}>
        <FaAngleLeft />
        {clansLoc.ClanMember}
      </Anchor>
    );

    if (!canViewSettings && isMember) {
      return chatAnchor;
    }

    if (isProfilePage) {
      if (canViewSettings) {
        return settingsAnchor;
      }
    } else {
      return settingsAnchor;
    }

    return null;
  };

  if (isSettingsPage) {
    return null;
  }

  return <div className={styles.breadcrumb}>{getLink()}</div>;
};
