// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";
import styles from "./GameHistory.module.scss";

interface ProfileGameHistoryLinkProps {}

export const ProfileGameHistoryLink: React.FC<ProfileGameHistoryLinkProps> = (
  props
) => {
  const destinyMembershipData = useDataStore(ProfileDestinyMembershipDataStore);

  if (!destinyMembershipData?.selectedMembership) {
    return null;
  }

  return (
    <Anchor
      className={styles.link}
      url={RouteHelper.GameHistory(
        destinyMembershipData.selectedMembership.membershipId,
        destinyMembershipData.selectedMembership.membershipType
      )}
    >
      <GiBackwardTime />
      {Localizer.Profile.ViewMyRecentGames}
      <BiChevronRight />
    </Anchor>
  );
};
