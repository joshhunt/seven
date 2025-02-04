// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { ConfirmPlatformLinkingModal } from "@Areas/User/AccountComponents/Internal/ConfirmPlatformLinkingModal";
import { FriendsImportUtils } from "@Areas/User/AccountComponents/Internal/PlatformFriendsImport/FriendsImportUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType, PlatformFriendType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { BungieFriendsDataStore } from "./Internal/BungieFriends/BungieFriendsDataStore";
import { LinkedPlatformExpander } from "./Internal/PlatformFriendsImport/LinkedPlatformExpander";
import { PlatformFriendsDataStore } from "./Internal/PlatformFriendsImport/PlatformFriendsDataStore";

export const FriendsImport = () => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const platformFriendsData = useDataStore(PlatformFriendsDataStore);

  const [validPlatformsToLink, setValidPlatformsToLink] = useState<
    PlatformFriendType[]
  >([]);
  const [validPlatformsLinked, setValidPlatformsLinked] = useState<
    PlatformFriendType[]
  >([]);

  const getValidPlatforms = () => {
    const _validPlatformsToLink: PlatformFriendType[] = [];
    const _validPlatformsLinked: PlatformFriendType[] = [];

    EnumUtils.getStringKeys(BungieCredentialType).forEach((cred) => {
      try {
        const credEnum =
          BungieCredentialType[cred as keyof typeof BungieCredentialType];
        const platformFriendType = UserUtils.getPlatformTypeFromTypeFromCredentialType(
          credEnum
        );

        if (
          globalState.loggedInUser?.publicCredentialTypes.includes(credEnum)
        ) {
          _validPlatformsLinked.push(platformFriendType);
        } else {
          _validPlatformsToLink.push(platformFriendType);
        }
      } catch {
        //skipped - not valid credentialType
      }
    });

    setValidPlatformsLinked(_validPlatformsLinked);
    setValidPlatformsToLink(_validPlatformsToLink);

    // since updating validPlatformLinked would be a race condition, pass in the value it will be updated to directly
    platformFriendsData?.platformSpecificData &&
      FriendsImportUtils.getAllPlatformFriends(_validPlatformsLinked);
  };

  const openLinkPreview = (platform: PlatformFriendType) => {
    BrowserUtils.openWindow(
      RouteHelper.SignInPreview(
        UserUtils.getCredentialTypeFromPlatformFriendType(platform)
      ).url,
      "linkpreviewui",
      () => {
        GlobalStateDataStore.refreshUserAndRelatedData(true).then(() => {
          //load the platforms friends
          FriendsImportUtils.getPlatformFriends(platform);
        });
      }
    );
  };

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      // get valid platforms
      getValidPlatforms();
      BungieFriendsDataStore.actions.fetchAllFriends();
    }
  }, [globalState?.loggedInUser]);

  if (!UserUtils.isAuthenticated(globalState)) {
    return null;
  }

  return (
    <div className={styles.friendsImport}>
      <div className={styles.linkedPlatforms}>
        {validPlatformsLinked.map((platform, i) => {
          const strings = FriendsImportUtils.getStringsForPlatformList(
            platform
          );

          return (
            <LinkedPlatformExpander
              key={i}
              title={strings.title}
              linkedPlatform={platform}
            />
          );
        })}
      </div>
      <div className={styles.unlinkedPlatforms}>
        {validPlatformsToLink.map((platform, index) => {
          const strings = FriendsImportUtils.getStringsForPlatformList(
            platform
          );

          return (
            <div className={styles.friendsImportContainer} key={index}>
              <TwoLineItem
                className={classNames(
                  styles.platformHeader,
                  styles.linkPlatform
                )}
                itemTitle={LocalizerUtils.getPlatformAbbrForMembershipType(
                  UserUtils.getBungieMembershipTypeFromPlatformFriendType(
                    platform
                  )
                )}
                itemSubtitle={Localizer.Format(
                  Localizer.Friends.LinkPlatformToImportFriends,
                  { platform: strings.title }
                )}
                icon={FriendsImportUtils.platformReactIcon(platform)}
                flair={
                  <Button
                    className={styles.linkButton}
                    buttonType={"gold"}
                    size={BasicSize.Small}
                    onClick={() => {
                      openLinkPreview(platform);
                    }}
                  >
                    {Localizer.Format(Localizer.Friends.LinkPlatform, {
                      platform: strings.title,
                    })}
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
