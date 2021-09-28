// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/AccountComponents/FriendsImport.module.scss";
import { Localizer } from "@bungie/localization";
import { PlatformFriendType } from "@Enum";
import { Friends, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { ConvertToPlatformError } from "../../../../../Platform/ApiIntermediary";
import { PlatformError } from "../../../../../UI/Errors/CustomErrors";
import { FriendInviteThrottleQueue } from "./FriendInviteThrottleQueue";
import { PlatformFriendsDataStore } from "./PlatformFriendsDataStore";

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

  public static reAuth = (
    platform: PlatformFriendType,
    refreshFunction: Function
  ) => {
    BrowserUtils.openWindow(
      RouteHelper.GetReauthLink(
        UserUtils.getCredentialTypeFromPlatformFriendType(platform)
      ).url,
      "reauthui",
      () => {
        refreshFunction();
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

  public static getPlatformFriends = (
    platform: PlatformFriendType,
    onComplete?: CallableFunction,
    page?: number
  ): Promise<void | PlatformError> => {
    const currentPage = page || 0;

    PlatformFriendsDataStore.actions.updatePlatformIsLoaded(platform, false);

    return Platform.SocialService.GetPlatformFriendList(
      platform,
      currentPage.toString()
    )
      .then((response: Friends.PlatformFriendResponse) => {
        if (response) {
          PlatformFriendsDataStore.actions.setError(platform, null);

          response.hasMore
            ? (response.currentPage += 1)
            : (response.currentPage += 0);

          PlatformFriendsDataStore.actions.updatePlatformFriendResponse(
            platform,
            response
          );
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        // updates error for platform in datastore (most likely need to reauth error)
        PlatformFriendsDataStore.actions.setError(platform, e);
        Modal.error(e);
      })
      .finally(() => {
        if (onComplete) {
          onComplete();
        }
        PlatformFriendsDataStore.actions.updatePlatformIsLoaded(platform, true);
      });
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

  public static getAllPlatformFriends = (
    linkedPlatforms: PlatformFriendType[],
    onComplete?: CallableFunction
  ): void => {
    // consecutively resolves each promise that updates platform friend related data in datastore
    const friendsRequestQueue = new FriendInviteThrottleQueue();
    friendsRequestQueue.all(
      linkedPlatforms.map((platform, i) => {
        const isFinal = i === linkedPlatforms.length - 1;
        const onCompleteCallback = isFinal && onComplete ? onComplete : null;

        return FriendsImportUtils.getPlatformFriends(
          platform,
          onCompleteCallback
        );
      })
    );
  };
}
