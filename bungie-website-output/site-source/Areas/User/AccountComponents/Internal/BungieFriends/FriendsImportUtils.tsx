// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { PlatformFriendType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Friends } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";

export interface PlatformStrings {
  title: string;
  subtitle: string;
}

export class FriendsImportUtils {
  public static platformReactIcon = (platform: PlatformFriendType) => {
    switch (platform) {
      case PlatformFriendType.Xbox:
        return <FaXbox className={styles.platformIcon} />;

      case PlatformFriendType.PSN:
        return <FaPlaystation className={styles.platformIcon} />;

      case PlatformFriendType.Steam:
        return <FaSteam className={styles.platformIcon} />;
    }
  };

  public static getStringsForPlatformList = (
    platform: PlatformFriendType
  ): PlatformStrings => {
    switch (platform) {
      case PlatformFriendType.PSN:
        return {
          title: Localizer.Platforms.TigerPsn,
          subtitle: "",
        };

      case PlatformFriendType.Steam:
        return {
          title: Localizer.Platforms.TigerSteam,
          subtitle: "",
        };
      case PlatformFriendType.Xbox:
        return {
          title: Localizer.Platforms.TigerXbox,
          subtitle: "",
        };

      default:
        return { title: "", subtitle: "" };
    }
  };

  public static reAuth = (platform: PlatformFriendType) => {
    BrowserUtils.openWindow(
      RouteHelper.GetReauthLink(
        UserUtils.getCredentialTypeFromPlatformFriendType(platform)
      ).url,
      "reauthui",
      () => {
        window.location.reload();
      }
    );
  };

  public static isInFriendArray = (
    requestsArray: Friends.BungieFriend[],
    mId: string
  ) => {
    return (
      requestsArray.findIndex((bungieFriend) => {
        return bungieFriend.bungieNetUser?.membershipId === mId;
      }) > -1
    );
  };

  public static hasBungieAccount = (platformFriend: Friends.PlatformFriend) => {
    return !StringUtils.isNullOrWhiteSpace(
      platformFriend.bungieNetMembershipId
    );
  };

  public static isAlreadyFriend = (
    bungieFriends: Friends.BungieFriend[],
    platformFriend: Friends.PlatformFriend
  ) => {
    return (
      bungieFriends.findIndex((value: Friends.BungieFriend) => {
        return (
          value.bungieNetUser?.membershipId ===
          platformFriend.bungieNetMembershipId
        );
      }) > -1
    );
  };

  public static isPendingFriend = (
    incomingRequests: Friends.BungieFriend[],
    outgoingRequests: Friends.BungieFriend[],
    platformFriend: Friends.PlatformFriend
  ) => {
    return (
      FriendsImportUtils.isInFriendArray(
        incomingRequests,
        platformFriend.bungieNetMembershipId
      ) ||
      FriendsImportUtils.isInFriendArray(
        outgoingRequests,
        platformFriend.bungieNetMembershipId
      )
    );
  };
}
