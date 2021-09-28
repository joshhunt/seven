// Created by larobinson, 2021
// Copyright Bungie, Inc.

import accountStyles from "@Areas/User/Account.module.scss";
import styles from "@Areas/User/AccountComponents/BungieFriends.module.scss";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { Friends } from "@Platform";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { SpinnerContainer } from "../../../../../UI/UIKit/Controls/Spinner";
import { BungieFriendLineItem } from "./BungieFriendLineItem";
import { BungieFriendsDataStore } from "./BungieFriendsDataStore";

export type BungieFriendsSectionType =
  | "friends"
  | "pendingRequests"
  | "outgoingRequests";

interface BungieFriendsSectionProps {
  header: string;
  subtitle: React.ReactNode;
  bungieFriendsSectionType: BungieFriendsSectionType;
  emptyStateString: string;
}

export const BungieFriendsSection: React.FC<BungieFriendsSectionProps> = (
  props
) => {
  const [friendsOffset, setFriendsOffset] = useState(0);
  const friendsData = useDataStore(BungieFriendsDataStore);
  const bungieFriendsPerPage = 30;

  const handleFriendsPageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * bungieFriendsPerPage);
    setFriendsOffset(newOffset);
  };

  const sortByPresence = (a: Friends.BungieFriend, b: Friends.BungieFriend) => {
    return a?.onlineStatus ? -1 : 0;
  };

  const friendArray =
    props.bungieFriendsSectionType === "friends"
      ? friendsData?.[props.bungieFriendsSectionType]?.sort(sortByPresence)
      : friendsData?.[props.bungieFriendsSectionType];

  return (
    <GridCol cols={12} className={styles.section}>
      <h3>{props.header}</h3>
      <SpinnerContainer loading={friendsData.loading}>
        {friendArray
          ?.slice(friendsOffset, friendsOffset + bungieFriendsPerPage)
          .map((friend, i) => {
            return (
              <BungieFriendLineItem
                key={i}
                bungieFriend={friend}
                itemSubtitle={
                  friend?.onlineStatus === 1 ? (
                    <div className={styles.online}>
                      {Localizer.friends.online}
                    </div>
                  ) : (
                    <div>{Localizer.friends.offline}</div>
                  )
                }
                section={props.bungieFriendsSectionType}
              />
            );
          })}
        {friendArray?.length === 0 && (
          <div className={styles.noRequests}>{props.emptyStateString}</div>
        )}
        <hr />
        {friendArray.length > bungieFriendsPerPage && (
          <ReactPaginate
            onPageChange={(e) => handleFriendsPageChange(e)}
            pageCount={Math.ceil(friendArray.length / bungieFriendsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            previousLabel={Localizer.usertools.previousPage}
            nextLabel={Localizer.usertools.nextPage}
            containerClassName={accountStyles.paginateInterface}
            activeClassName={accountStyles.active}
            previousClassName={accountStyles.prev}
            nextClassName={accountStyles.next}
            disabledClassName={accountStyles.disabled}
          />
        )}
      </SpinnerContainer>
    </GridCol>
  );
};
