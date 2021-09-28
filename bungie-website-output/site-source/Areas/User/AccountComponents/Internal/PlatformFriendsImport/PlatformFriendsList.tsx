// Created by larobinson, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { FriendsImportUtils } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/FriendsImportUtils";
import { PlatformFriendLineItem } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/PlatformFriendLineItem";
import { PlatformFriendsDataStore } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/PlatformFriendsDataStore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { PlatformFriendType } from "@Enum";
import { Friends } from "@Platform";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import React from "react";

interface PlatformFriendsListProps {
  platform: PlatformFriendType;
}

export const PlatformFriendsList: React.FC<PlatformFriendsListProps> = ({
  platform,
}) => {
  const platformFriendsData = useDataStore(PlatformFriendsDataStore);
  const friendsLoc = Localizer.friends;

  return (
    <ul className={styles.platformFriends}>
      {platformFriendsData?.platformSpecificData
        ?.find((x) => x.platform === platform)
        ?.friendsResponse?.platformFriends.map(
          (friend: Friends.PlatformFriend, i) => {
            const noBungieAccount = !FriendsImportUtils.hasBungieAccount(
              friend
            );

            if (noBungieAccount) {
              return (
                <li className={styles.platformFriend} key={i}>
                  <OneLineItem
                    className={styles.noBungieAccount}
                    itemTitle={Localizer.Format(
                      friendsLoc.UserDoesNotHaveABungie,
                      { user: friend.platformDisplayName }
                    )}
                    title={friend.platformDisplayName}
                  />
                </li>
              );
            }

            return (
              <PlatformFriendLineItem
                key={friend.bungieNetMembershipId}
                friend={friend}
                platform={platform}
              />
            );
          }
        )}
    </ul>
  );
};
