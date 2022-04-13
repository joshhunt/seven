// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ISearchItemDisplayProperties } from "@Areas/Search/Shared/SearchTabContent";
import { Localizer } from "@bungie/localization";
import { Img } from "@Helpers";
import { Content, Definitions, GroupsV2, User } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React from "react";

export class SearchUtils {
  public static GetDisplayPropertiesFromItemSearch(
    itemList: Definitions.DestinyEntitySearchResultItem[]
  ): ISearchItemDisplayProperties[] {
    return (
      itemList?.map((item) => {
        return {
          url: RouteHelper.DestinyItemDefinition(item.hash.toString()),
          title: item.displayProperties.name,
          subtitle: item.displayProperties.description,
          icon: <IconCoin iconImageUrl={item.displayProperties.icon} />,
          flair: null,
        };
      }) ?? []
    );
  }

  public static GetDisplayPropertiesFromNewsSearch(
    newsList: Content.ContentItemPublicContract[]
  ): ISearchItemDisplayProperties[] {
    return (
      newsList?.map((item) => {
        const timeDiffFromNow = DateTime.fromISO(item.creationDate).diffNow(
          "days"
        );

        return {
          url: RouteHelper.NewsArticle(parseInt(item.contentId, 10)),
          title: item.properties["Title"],
          subtitle: <SafelySetInnerHTML html={item.properties["Subtitle"]} />,
          icon: <IconCoin iconImageUrl={item.properties["ArticleBanner"]} />,
          flair:
            timeDiffFromNow.days > 7
              ? DateTime.fromISO(item.creationDate).toLocaleString({
                  month: "short",
                  day: "2-digit",
                })
              : Localizer.Format(Localizer.Time.DaysAgo, {
                  days: Math.round(
                    Math.abs(
                      DateTime.fromISO(item.creationDate).diffNow("days").days
                    )
                  ),
                }),
        };
      }) ?? []
    );
  }

  public static GetDisplayPropertiesFromDestinyUserSearch(
    destinyUserList: User.UserInfoCard[]
  ): ISearchItemDisplayProperties[] {
    return (
      destinyUserList?.map((user) => {
        const bungieName = UserUtils.getBungieNameFromUserInfoCard(user);
        const membershipId = user.membershipId;

        return {
          url: RouteHelper.Profile(membershipId),
          title: `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`,
          subtitle: "",
          icon: (
            <IconCoin
              iconImageUrl={Img(`bungie/icons/logos/bungienet/icon.png`)}
            />
          ),
        };
      }) ?? []
    );
  }

  public static GetDisplayPropertiesFromActivitiesSearch(
    activitiesList: Definitions.DestinyEntitySearchResultItem[]
  ): ISearchItemDisplayProperties[] {
    return (
      activitiesList?.map((item) => {
        return {
          url: RouteHelper.DestinyItemDefinition(item.hash.toString()),
          title: item.displayProperties.name,
          subtitle: item.displayProperties.description,
          icon: <IconCoin iconImageUrl={item.displayProperties.icon} />,
        };
      }) ?? []
    );
  }

  public static GetDisplayPropertiesFromUserSearch(
    userList: User.UserSearchResponseDetail[]
  ): ISearchItemDisplayProperties[] {
    return (
      userList?.map((user) => {
        const bungieName = UserUtils.getBungieNameFromUserSearchResponseDetail(
          user
        );
        const membershipId =
          user.bungieNetMembershipId ??
          user.destinyMemberships?.[0]?.membershipId;

        return {
          url: RouteHelper.Profile(membershipId),
          title: `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`,
          subtitle: "",
          icon: (
            <IconCoin
              iconImageUrl={Img(`bungie/icons/logos/bungienet/icon.png`)}
            />
          ),
        };
      }) ?? []
    );
  }

  public static GetDisplayPropertiesFromClanSearch(
    clanList: GroupsV2.GroupV2Card[]
  ): ISearchItemDisplayProperties[] {
    return (
      clanList?.map((clan) => {
        return {
          url: RouteHelper.Clan(clan.groupId),
          title: clan.name,
          subtitle: clan.about,
          icon: <IconCoin iconImageUrl={clan.avatarPath} />,
        };
      }) ?? []
    );
  }
}
