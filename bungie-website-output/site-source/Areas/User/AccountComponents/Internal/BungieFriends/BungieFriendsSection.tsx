// Created by larobinson, 2021
// Copyright Bungie, Inc.

import accountStyles from "@Areas/User/Account.module.scss";
import styles from "@Areas/User/AccountComponents/BungieFriends.module.scss";
import {
  BungieFriendLineItem,
  FriendButtonData,
} from "@Areas/User/AccountComponents/Internal/BungieFriends/BungieFriendLineItem";
import { FriendsListDataStore } from "@Areas/User/AccountComponents/Internal/BungieFriends/FriendsListDataStore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { Friends } from "@Platform";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import React, { useMemo, useState } from "react";
import ReactPaginate from "react-paginate";

type BungieFriendsSectionTypes =
  | "friends"
  | "pendingRequests"
  | "outgoingRequests";

interface BungieFriendsSectionProps {
  header: string;
  subtitle: React.ReactNode;
  bungieFriendsSectionType: BungieFriendsSectionTypes;
  emptyStateString: string;
  buttonData: FriendButtonData[];
}

export const BungieFriendsSection: React.FC<BungieFriendsSectionProps> = (
  props
) => {
  const [friendsOffset, setFriendsOffset] = useState(0);
  const friendsData = useDataStore(FriendsListDataStore);
  const bungieFriendsPerPage = 30;

  const handleFriendsPageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * bungieFriendsPerPage);
    setFriendsOffset(newOffset);
  };

  const sortByPresence = (a: Friends.BungieFriend, b: Friends.BungieFriend) => {
    return a.onlineStatus ? -1 : 0;
  };

  const friendArray =
    props.bungieFriendsSectionType === "friends"
      ? useMemo(
          () =>
            friendsData[props.bungieFriendsSectionType].sort(sortByPresence),
          [friendsData.friends]
        )
      : friendsData[props.bungieFriendsSectionType];
  let successText = "";
  let errorText = "";

  if (props.bungieFriendsSectionType === "friends") {
    successText = Localizer.friends.successDesc;
    errorText = Localizer.friends.removingFriendFailed;
  } else if (props.bungieFriendsSectionType === "pendingRequests") {
    successText = Localizer.friends.successDesc;
    errorText = Localizer.Friends.ThereWasAnErrorEditing;
  } else {
    successText = `${Localizer.friends.PendingSentReq}. ${Localizer.friends.successDesc}`;
    errorText = Localizer.Friends.RemovingFriendRequestFailed;
  }

  return (
    <GridCol cols={12} className={styles.section}>
      <h3>{props.header}</h3>
      {friendArray.length > 0 ? (
        friendArray
          .slice(friendsOffset, friendsOffset + bungieFriendsPerPage)
          .map((friend, i) => {
            return (
              <BungieFriendLineItem
                key={i}
                bungieFriend={friend}
                itemSubtitle={
                  friend.onlineStatus === 1 ? (
                    <div className={styles.online}>
                      {Localizer.friends.online}
                    </div>
                  ) : (
                    <div>{Localizer.friends.offline}</div>
                  )
                }
                buttonData={props.buttonData}
                successText={successText}
                errorText={errorText}
              />
            );
          })
      ) : (
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
    </GridCol>
  );
};
