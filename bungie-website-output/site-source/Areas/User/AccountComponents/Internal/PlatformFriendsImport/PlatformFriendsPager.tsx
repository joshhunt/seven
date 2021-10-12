// Created by larobinson, 2021
// Copyright Bungie, Inc.

import sharedStyles from "@Areas/User/Account.module.scss";
import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformFriendType } from "@Enum";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { BungieFriendsDataStore } from "../BungieFriends/BungieFriendsDataStore";
import { FriendsImportUtils } from "./FriendsImportUtils";
import { PlatformFriendsDataStore } from "./PlatformFriendsDataStore";

interface PlatformFriendsPagerProps {
  platform: PlatformFriendType;
}

export const PlatformFriendsPager: React.FC<PlatformFriendsPagerProps> = ({
  platform,
}) => {
  const platformFriendsData = useDataStore(PlatformFriendsDataStore);
  const platformSpecificData = platformFriendsData?.platformSpecificData?.find(
    (x) => x.platform === platform
  );

  const hasMorePages = platformSpecificData?.friendsResponse?.hasMore;
  const onFirstPage = !(platformSpecificData?.friendsResponse?.currentPage > 0);

  const handleRequestsPageChange = (pageNumber: { selected: number }) => {
    FriendsImportUtils.getPlatformFriends(platform, null, pageNumber.selected);
    BungieFriendsDataStore.actions.fetchAllFriends();
  };

  if (!hasMorePages || onFirstPage) {
    return null;
  }

  return (
    <ReactPaginate
      onPageChange={(e) => handleRequestsPageChange(e)}
      pageCount={platformSpecificData.totalPages}
      pageRangeDisplayed={0}
      forcePage={platformSpecificData.friendsResponse.currentPage ?? 0}
      marginPagesDisplayed={0}
      previousLabel={Localizer.usertools.previousPage}
      nextLabel={Localizer.usertools.nextPage}
      containerClassName={sharedStyles.paginateInterface}
      activeClassName={sharedStyles.active}
      previousClassName={sharedStyles.prev}
      nextClassName={sharedStyles.next}
      disabledClassName={sharedStyles.disabled}
      breakClassName={styles.paginateBreak}
    />
  );
};
