// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { BungieFriendsDataStore } from "@Areas/User/AccountComponents/Internal/BungieFriends/BungieFriendsDataStore";
import { FriendInviteThrottleQueue } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/FriendInviteThrottleQueue";
import { FriendsImportUtils } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/FriendsImportUtils";
import { PlatformFriendsDataStore } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/PlatformFriendsDataStore";
import { PlatformFriendsList } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/PlatformFriendsList";
import { PlatformFriendsPager } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/PlatformFriendsPager";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformErrorCodes, PlatformFriendType } from "@Enum";
import { Friends, Platform } from "@Platform";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Spinner } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { CgChevronDown } from "react-icons/cg";

interface LinkedPlatformExpanderProps {
  title: string;
  linkedPlatform: PlatformFriendType;
}

export const LinkedPlatformExpander: React.FC<LinkedPlatformExpanderProps> = ({
  title,
  linkedPlatform,
}) => {
  const [openPlatformList, updateOpenPlatformList] = useState<
    PlatformFriendType[]
  >([PlatformFriendType.Unknown]);
  const platformFriendsData = useDataStore(PlatformFriendsDataStore);
  const bungieFriendsData = useDataStore(BungieFriendsDataStore);

  const specificPlatformFriendData = platformFriendsData?.platformSpecificData?.find(
    (x) => x.platform === linkedPlatform
  );
  const friendsResponse = specificPlatformFriendData?.friendsResponse;

  const hasMoreThanOnePage =
    friendsResponse?.hasMore || friendsResponse?.currentPage > 0;
  const friendsLoc = Localizer.friends;

  const friendsCount = friendsResponse?.platformFriends?.length ?? 0;
  const friendsCountString = Localizer.Format(friendsLoc.NumberFriends, {
    number: hasMoreThanOnePage ? "100+" : friendsCount.toString(),
  });

  const loaded = platformFriendsData?.platformSpecificData?.find(
    (x) => x.platform === linkedPlatform
  )?.isLoaded;
  const needsReauth =
    specificPlatformFriendData.error &&
    specificPlatformFriendData.error.errorCode ===
      PlatformErrorCodes.UserFriendsTokenNeedsRefresh;

  const classes = classNames(styles.platformHeader, {
    [styles.noFriendsPlatform]: !needsReauth && loaded && friendsCount === 0,
    [styles.loading]: !loaded,
  });

  let subtitle = null;
  if (!loaded) {
    subtitle = friendsLoc.Loading;
  }
  if (needsReauth) {
    subtitle = specificPlatformFriendData?.error.message;
  }
  if (friendsCount === 0) {
    subtitle = friendsLoc.NoFriendsOnThisPlatform;
  }

  const togglePlatformList = (plat: PlatformFriendType) => {
    let updatedPlatformList = [...openPlatformList];

    if (updatedPlatformList.includes(plat)) {
      updatedPlatformList = updatedPlatformList.filter(
        (value) => value !== plat
      );
    } else {
      updatedPlatformList.push(plat);
    }

    updateOpenPlatformList(updatedPlatformList);
  };

  const [availablePlatformFriends, setAvailablePlatformFriends] = useState(
    false
  );

  const hasAvailablePlatformFriends = () => {
    let availablePlatformFriendsCount = 0;

    if (friendsResponse?.platformFriends?.length > 0) {
      friendsResponse.platformFriends.forEach((friend, i) => {
        if (
          FriendsImportUtils.hasBungieAccount(friend) &&
          !FriendsImportUtils.isPendingFriend(
            bungieFriendsData.pendingRequests,
            bungieFriendsData.outgoingRequests,
            friend
          ) &&
          !FriendsImportUtils.isAlreadyFriend(
            bungieFriendsData.friends,
            friend
          ) &&
          !platformFriendsData?.recentlySentMembershipIds?.includes(
            friend?.bungieNetMembershipId
          ) &&
          !platformFriendsData?.recentlyCanceledMembershipIds?.includes(
            friend?.bungieNetMembershipId
          )
        ) {
          availablePlatformFriendsCount++;
        }
      });
    }

    setAvailablePlatformFriends(availablePlatformFriendsCount > 0);
  };

  useEffect(() => {
    hasAvailablePlatformFriends();
  }, [bungieFriendsData, platformFriendsData]);

  const inviteAll = async (platformFriends: Friends.PlatformFriend[]) => {
    //empty the error list we are retrying
    PlatformFriendsDataStore.actions.resetErroringIds();

    const sendFriendRequestPromises: (() => Promise<any>)[] = [];

    platformFriends.forEach((friend, i) => {
      const lastInArray = i === platformFriends.length - 1;
      //only friends that arent friends, or pending

      if (
        FriendsImportUtils.hasBungieAccount(friend) &&
        !FriendsImportUtils.isPendingFriend(
          bungieFriendsData.pendingRequests,
          bungieFriendsData.outgoingRequests,
          friend
        ) &&
        !FriendsImportUtils.isAlreadyFriend(
          bungieFriendsData.friends,
          friend
        ) &&
        !platformFriendsData?.recentlySentMembershipIds?.includes(
          friend?.bungieNetMembershipId
        ) &&
        !platformFriendsData?.recentlyCanceledMembershipIds?.includes(
          friend?.bungieNetMembershipId
        )
      ) {
        sendFriendRequestPromises.push(() =>
          Platform.SocialService.IssueFriendRequest(
            friend?.bungieNetMembershipId
          )
            .then(() => {
              PlatformFriendsDataStore.actions.addToRecentlySent(
                friend?.bungieNetMembershipId
              );
            })
            .catch((err) => ConvertToPlatformError(err))
            .catch((e) => {
              // verify that this friend has not been added since we started this bulk function.
              // this is not intended to count "already friends" as errors because it should not try to add them in the first place
              if (
                FriendsImportUtils.hasBungieAccount(friend) &&
                !FriendsImportUtils.isPendingFriend(
                  bungieFriendsData.pendingRequests,
                  bungieFriendsData.outgoingRequests,
                  friend
                ) &&
                !FriendsImportUtils.isAlreadyFriend(
                  bungieFriendsData.friends,
                  friend
                ) &&
                !platformFriendsData?.recentlySentMembershipIds?.includes(
                  friend?.bungieNetMembershipId
                ) &&
                !platformFriendsData?.recentlyCanceledMembershipIds?.includes(
                  friend?.bungieNetMembershipId
                )
              ) {
                PlatformFriendsDataStore.actions.addToErroringIds(
                  friend?.bungieNetMembershipId
                );
                Modal.error(e);
              }
            })
            .finally(() => {
              if (lastInArray) {
                BungieFriendsDataStore.actions.fetchAllFriends();
              }
            })
        );
      }
    });

    const friendQueue = new FriendInviteThrottleQueue();

    await friendQueue.all(sendFriendRequestPromises);
  };

  let flair = null;
  if (!loaded) {
    flair = <Spinner />;
  } else if (friendsCount > 0) {
    flair = (
      <span className={styles.friendsCount}>
        {friendsCountString}
        <CgChevronDown />
      </span>
    );
  }

  if (needsReauth) {
    const pageNumber = friendsResponse?.currentPage ?? 0;

    flair = (
      <div className={styles.twoButtons}>
        <Button
          buttonType={"gold"}
          onClick={() =>
            FriendsImportUtils.reAuth(linkedPlatform, () =>
              FriendsImportUtils.getPlatformFriends(
                linkedPlatform,
                null,
                pageNumber
              )
            )
          }
        >
          {Localizer.Accountlinking.Reauthorize}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.friendsImportContainer}>
      <TwoLineItem
        className={classes}
        itemTitle={title}
        itemSubtitle={subtitle}
        icon={FriendsImportUtils.platformReactIcon(linkedPlatform)}
        flair={flair}
        onClick={() =>
          !needsReauth && friendsCount > 0
            ? togglePlatformList(linkedPlatform)
            : null
        }
      />
      {openPlatformList.includes(linkedPlatform) && !needsReauth && (
        <>
          {ConfigUtils.SystemStatus("PlatformFriendBulkImporter") &&
            availablePlatformFriends && (
              <div className={styles.batchAddHeader}>
                <h3>{friendsLoc.BungieAccounts}</h3>
                <Button
                  buttonType={"text"}
                  className={styles.inviteAllButton}
                  onClick={() => inviteAll(friendsResponse?.platformFriends)}
                >
                  {friendsLoc.InviteAllOnThisPage}
                </Button>
              </div>
            )}
          <PlatformFriendsList platform={linkedPlatform} />
          <PlatformFriendsPager platform={linkedPlatform} />
        </>
      )}
    </div>
  );
};
