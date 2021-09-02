// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { FriendsImport } from "@Areas/User/AccountComponents/FriendsImport";
import { BungieFriendsSection } from "@Areas/User/AccountComponents/Internal/BungieFriends/BungieFriendsSection";
import { FriendsListDataStore } from "@Areas/User/AccountComponents/Internal/BungieFriends/FriendsListDataStore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization/Localizer";
import { Friends, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React, { useEffect, useState } from "react";
import styles from "./BungieFriends.module.scss";

interface BungieFriendsProps {}

export const BungieFriends: React.FC<BungieFriendsProps> = (props) => {
  const [showFriendsImport, toggleFriendsImport] = useState<boolean>(false);
  const friendsData = useDataStore(FriendsListDataStore);

  useEffect(() => {
    FriendsListDataStore.actions.fetchAllFriends();
  }, []);

  return (
    <div>
      {ConfigUtils.SystemStatus("PlatformFriendImporter") && (
        <GridCol cols={12} className={styles.banner}>
          <div className={styles.importArea}>
            <h3>{Localizer.friends.bungiefriends}</h3>
            <p>{Localizer.friends.importfriendsDesc}</p>
            <Button
              buttonType={"gold"}
              onClick={() => toggleFriendsImport(!showFriendsImport)}
            >
              {Localizer.friends.importfriends}
            </Button>
          </div>
          {showFriendsImport && (
            <FriendsImport bungieFriends={friendsData.friends} />
          )}
        </GridCol>
      )}
      <BungieFriendsSection
        header={Localizer.groups.pending}
        bungieFriendsSectionType={"pendingRequests"}
        emptyStateString={Localizer.friends.nopending}
        subtitle={Localizer.friends.pendingRequestDesc}
        buttonData={[
          {
            title: Localizer.actions.accept,
            callback: Platform.SocialService.AcceptFriendRequest,
          },
          {
            title: Localizer.actions.decline,
            callback: Platform.SocialService.DeclineFriendRequest,
          },
        ]}
      />
      <BungieFriendsSection
        header={Localizer.account.bungieFriends}
        bungieFriendsSectionType={"friends"}
        emptyStateString={Localizer.friends.nofriends}
        subtitle={(friend: Friends.BungieFriend) => {
          return friend.onlineStatus === 1 ? (
            <div className={styles.online}>{Localizer.friends.online}</div>
          ) : (
            <div>{Localizer.friends.offline}</div>
          );
        }}
        buttonData={[
          {
            title: Localizer.friends.removebutton,
            callback: Platform.SocialService.RemoveFriend,
          },
        ]}
      />
      <BungieFriendsSection
        header={Localizer.friends.OutgoingRequests}
        bungieFriendsSectionType={"outgoingRequests"}
        emptyStateString={Localizer.friends.nooutgoing}
        subtitle={Localizer.friends.PendingSentReq}
        buttonData={[
          {
            title: Localizer.friends.removebutton,
            callback: Platform.SocialService.RemoveFriendRequest,
          },
        ]}
      />
    </div>
  );
};
