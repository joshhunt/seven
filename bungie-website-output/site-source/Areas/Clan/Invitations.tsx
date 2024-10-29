// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanPendingInvitesDataStore } from "@Areas/Clan/DataStores/ClanPendingInvitesDataStore";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { InviteFriends } from "@Areas/Clan/Shared/InviteFriends";
import { PendingInvitations } from "@Areas/Clan/Shared/PendingInvitations";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";

export const Invitations: React.FC = () => {
  const params = useParams<IClanParams>();
  const history = useHistory();
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const clanId = params?.clanId ?? "0";
  const page =
    params?.page && params?.page !== "0" ? parseInt(params.page, 10) : 1;

  const clan = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === clanId
  );

  const hasPermission = ClanUtils.canInvite(clan, globalState?.loggedInUser);

  useEffect(() => {
    ClanPendingInvitesDataStore.actions.getInvitationsAndFriends(clanId);
  }, []);

  if (globalState.loaded && !hasPermission) {
    history.push(RouteHelper.NewClanSettings({ clanId: clanId }).url);

    return null;
  }

  return (
    <SettingsWrapper>
      <PendingInvitations clanId={clanId} />
      <InviteFriends clanId={clanId} />
    </SettingsWrapper>
  );
};
