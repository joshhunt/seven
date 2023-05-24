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

  const getLink = () => {
    const path = window.location.pathname.toLowerCase();

    const profileAnchor = (
      <Anchor url={RouteHelper.NewClanProfile({ clanId: props.clanId })}>
        <FaAngleLeft />
        {clansLoc.ClanProfile}
      </Anchor>
    );
    const settingsAnchor = (
      <Anchor url={RouteHelper.NewClanSettings({ clanId: props.clanId })}>
        <FaAngleLeft />
        {clansLoc.ClanSettings}
      </Anchor>
    );

    if (path.includes("/settings")) {
      return profileAnchor;
    } else if (path.includes("/profile")) {
      if (canViewSettings) {
        return settingsAnchor;
      }

      return profileAnchor;
    } else {
      return settingsAnchor;
    }
  };

  return <div className={styles.breadcrumb}>{getLink()}</div>;
};
