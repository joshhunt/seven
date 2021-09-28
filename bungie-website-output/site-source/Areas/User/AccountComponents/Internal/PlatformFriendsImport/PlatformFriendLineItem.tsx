// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { FriendsImportUtils } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/FriendsImportUtils";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformErrorCodes, PlatformFriendType } from "@Enum";
import { Friends, Platform } from "@Platform";
import { FriendLineItem } from "@UIKit/Companion/FriendLineItem";
import { StringUtils } from "@Utilities/StringUtils";
import React from "react";
import { ConvertToPlatformError } from "../../../../../Platform/ApiIntermediary";
import { PlatformError } from "../../../../../UI/Errors/CustomErrors";
import { Button } from "../../../../../UI/UIKit/Controls/Button/Button";
import { Modal } from "../../../../../UI/UIKit/Controls/Modal/Modal";
import { BungieFriendsDataStore } from "../BungieFriends/BungieFriendsDataStore";
import { PlatformFriendsDataStore } from "./PlatformFriendsDataStore";

interface PlatformFriendLineItemProps {
  friend: Friends.PlatformFriend;
  platform: PlatformFriendType;
}

export const PlatformFriendLineItem: React.FC<PlatformFriendLineItemProps> = ({
  friend,
  platform,
  ...props
}) => {
  const { pendingRequests, outgoingRequests, friends } = useDataStore(
    BungieFriendsDataStore
  );
  const platformFriendsData = useDataStore(PlatformFriendsDataStore);
  const friendsLoc = Localizer.friends;
  const isPending = FriendsImportUtils.isInFriendArray(
    pendingRequests,
    friend?.bungieNetMembershipId
  );
  const isOutgoing = FriendsImportUtils.isInFriendArray(
    outgoingRequests,
    friend?.bungieNetMembershipId
  );

  const sendFriendRequest = async (mId: string) => {
    return Platform.SocialService.IssueFriendRequest(mId)
      .then((response) => {
        PlatformFriendsDataStore.actions.removeFromErroringIds(mId);
        PlatformFriendsDataStore.actions.addToRecentlySent(mId);

        FriendsImportUtils.getPlatformFriends(
          platform,
          null,
          platformFriendsData?.platformSpecificData?.find(
            (x) => x.platform === platform
          )?.friendsResponse?.currentPage
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        PlatformFriendsDataStore.actions.addToErroringIds(mId);
        Modal.open(Localizer.Friends.FriendRequestFailed);
      });
  };

  const cancelFriendRequest = (mId: string) => {
    const cancelFunction = isPending
      ? Platform.SocialService.DeclineFriendRequest
      : Platform.SocialService.RemoveFriendRequest;

    //use decline for incoming
    if (isPending || isOutgoing) {
      //use decline for incoming
      return cancelFunction(mId)
        .then((response) => {
          PlatformFriendsDataStore.actions.addToRecentlyCanceledMembershipIds(
            mId
          );
          BungieFriendsDataStore.actions.fetchAllFriends();
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          PlatformFriendsDataStore.actions.addToErroringIds(mId);
          if (
            e.errorCode ===
            PlatformErrorCodes.ErrorBungieFriendsUnableToRemoveRequest
          ) {
            Modal.open(<p>{Localizer.Friends.WeWereUnableToProcess}</p>);
          }
        });
    }
  };

  const recentlySent = platformFriendsData?.recentlySentMembershipIds?.includes(
    friend?.bungieNetMembershipId
  );
  const recentlyCanceled = platformFriendsData?.recentlyCanceledMembershipIds?.includes(
    friend?.bungieNetMembershipId
  );
  const hasError = platformFriendsData?.errorMembershipIds?.includes(
    friend?.bungieNetMembershipId
  );
  const friendHasBungieAccount = FriendsImportUtils.hasBungieAccount(friend);
  const isPendingOrOutgoingRequest = FriendsImportUtils.isPendingFriend(
    pendingRequests,
    outgoingRequests,
    friend
  );
  const isBungieFriend = FriendsImportUtils.isInFriendArray(
    friends,
    friend?.bungieNetMembershipId
  );

  let flair = null;

  if (friendHasBungieAccount) {
    flair = (
      <Button
        key={friend?.bungieNetMembershipId ?? 0}
        onClick={() => {
          sendFriendRequest(friend?.bungieNetMembershipId);
        }}
        buttonType={hasError ? "red" : "gold"}
      >
        {Localizer.Actions.SendRequest}
      </Button>
    );

    if (isBungieFriend) {
      flair = (
        <Button key={friend?.bungieNetMembershipId ?? 0} disabled={true}>
          {friendsLoc.AlreadyFriends}
        </Button>
      );
    } else if (isPendingOrOutgoingRequest) {
      flair = (
        <Button
          key={friend?.bungieNetMembershipId ?? 0}
          onClick={() => {
            cancelFriendRequest(friend?.bungieNetMembershipId);
          }}
          buttonType={hasError ? "red" : "white"}
        >
          {Localizer.Actions.CancelRequest}
        </Button>
      );
    }

    if (recentlySent) {
      flair = (
        <p
          className={styles.friendActionHandler}
        >{`${friendsLoc.FriendRequestSent}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
      );
    }

    if (recentlyCanceled && isPending) {
      flair = (
        <p
          className={styles.friendActionHandler}
        >{`${friendsLoc.FriendRequestDeclined}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
      );
    }

    if (recentlyCanceled && isOutgoing) {
      flair = (
        <p
          className={styles.friendActionHandler}
        >{`${friendsLoc.FriendRequestRemoved}. ${friendsLoc.ItMayTakeAFewMinutes}`}</p>
      );
    }

    if (StringUtils.isNullOrWhiteSpace(friend.bungieNetMembershipId)) {
      flair = (
        <Button key={friend?.bungieNetMembershipId ?? 0} disabled={true}>
          {friendsLoc.SendRequest}
        </Button>
      );
    }
  }

  return (
    <li className={styles.platformFriend}>
      <FriendLineItem
        bungieName={friend?.bungieGlobalDisplayName}
        membershipId={friend?.bungieNetMembershipId}
        itemSubtitle={friend?.platformDisplayName}
        icon={FriendsImportUtils.platformReactIcon(platform)}
        flair={flair}
      />
    </li>
  );
};
