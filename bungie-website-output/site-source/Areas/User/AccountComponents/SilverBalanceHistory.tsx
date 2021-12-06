// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Platform, Queries } from "@Platform";
import React, { useEffect, useState } from "react";

/*
	Data needed: 
	Silver balance history with 
	[x] order num
	[x] date
	[x] quant change 
 */

interface SilverBalanceHistoryProps {}

export const SilverBalanceHistory: React.FC<SilverBalanceHistoryProps> = (
  props
) => {
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const [history, setHistory] = useState<
    Queries.SearchResultEververseChangeEvent
  >(null);

  AccountDestinyMembershipDataStore.actions.loadUserData();

  useEffect(() => {
    if (destinyMember.loaded) {
      Platform.TokensService.EververseChangePurchaseHistory(
        destinyMember.membershipData.destinyMemberships[0].membershipId,
        destinyMember.membershipData.destinyMemberships[0].membershipType,
        0
      ).then((data) => {
        return;
      });
    }
  }, [destinyMember.loaded]);

  return <div />;
};
