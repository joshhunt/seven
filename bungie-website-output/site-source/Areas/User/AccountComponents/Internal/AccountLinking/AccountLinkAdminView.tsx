// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React from "react";
import styles from "../../AccountLinking.module.scss";
import { AccountDestinyMembershipDataStore } from "../../DataStores/AccountDestinyMembershipDataStore";

interface AccountLinkAdminViewProps {
  membershipId: string;
}

export const AccountLinkAdminView: React.FC<AccountLinkAdminViewProps> = ({
  membershipId,
}) => {
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);

  if (!membershipId) {
    return null;
  }

  return (
    <div>
      <p className={styles.admin}>{`MembershipId: ${membershipId}`}</p>
      <p
        className={styles.admin}
      >{`CrossSave: ${destinyMembershipData.isCrossSaved}`}</p>
    </div>
  );
};
