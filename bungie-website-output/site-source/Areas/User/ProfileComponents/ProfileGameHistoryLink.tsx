// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { pageView } from "@Areas/User/Profile";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import styles from "./miniblock.module.scss";

interface ProfileGameHistoryLinkProps {
  updateView: React.Dispatch<React.SetStateAction<pageView>>;
}

export const ProfileGameHistoryLink: React.FC<ProfileGameHistoryLinkProps> = (
  props
) => {
  const destinyMembershipData = useDataStore(ProfileDestinyMembershipDataStore);
  const profileLoc = Localizer.Profile;
  const useReactGameHistory = ConfigUtils.SystemStatus("CoreAreaGameHistory");

  if (!destinyMembershipData?.selectedMembership) {
    return null;
  }

  return (
    <Anchor
      className={classNames(styles.mainContainer, styles.gameHistoryContainer)}
      url={
        useReactGameHistory
          ? ""
          : RouteHelper.GameHistory(
              destinyMembershipData?.selectedMembership?.membershipId,
              destinyMembershipData?.selectedMembership?.membershipType
            )
      }
      onClick={() =>
        useReactGameHistory &&
        props.updateView(pageView["destiny-game-history"])
      }
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
