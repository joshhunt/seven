// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import styles from "./miniblock.module.scss";

interface ProfileGameHistoryLinkProps {}

export const ProfileGameHistoryLink: React.FC<ProfileGameHistoryLinkProps> = (
  props
) => {
  const destinyMembershipData = useDataStore(ProfileDestinyMembershipDataStore);
  const profileLoc = Localizer.Profile;

  if (!destinyMembershipData?.selectedMembership) {
    return null;
  }

  return (
    <Anchor
      className={classNames(styles.mainContainer, styles.gameHistoryContainer)}
      url={RouteHelper.GameHistory(
        destinyMembershipData?.selectedMembership?.membershipId,
        destinyMembershipData?.selectedMembership?.membershipType
      )}
    >
      <h4>{profileLoc.GameHistory}</h4>
      <div className={styles.total}>
        <span>{profileLoc.ViewMyRecentGames}</span>
        <span>
          <BiChevronRight />
        </span>
      </div>
    </Anchor>
  );
};
