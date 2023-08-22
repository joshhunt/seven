// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/News/NewsPreview.module.scss";
import { ISearchItemDisplayProperties } from "@Areas/Search/Shared/SearchTabContent";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { Img } from "@Helpers";
import { Content, Definitions, GroupsV2, User } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { BnetStackNewsArticle } from "../../../Generated/contentstack-types";

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
    newsList?: []
  ): ISearchItemDisplayProperties[] {
    return (
      newsList?.map((articleData: BnetStackNewsArticle) => {
        const { image, mobile_image, subtitle, date, title, url } = articleData;

        const creationDate = date;
        const timeDiffFromNow = DateTime.fromISO(creationDate).diffNow("days");

        return {
          url: RouteHelper.NewsArticle({
            articleUrl: url?.hosted_url?.slice(1),
          }),
          title: title,
          subtitle: <SafelySetInnerHTML html={subtitle} />,
          icon: <IconCoin iconImageUrl={mobile_image?.url} />,
          flair:
            timeDiffFromNow.days > 7
              ? DateTime.fromISO(creationDate).toLocaleString({
                  month: "short",
                  day: "2-digit",
                })
              : Localizer.Format(Localizer.Time.DaysAgo, {
                  days: Math.round(
                    Math.abs(
                      DateTime.fromISO(creationDate).diffNow("days").days
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
          url: RouteHelper.NewProfile({
            mid: membershipId,
            mtype: EnumUtils.getNumberValue(
              user.membershipType,
              BungieMembershipType
            ).toString(),
          }),
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

        const destinyMembership = user.destinyMemberships?.[0];

        const membershipId = destinyMembership
          ? destinyMembership.membershipId
          : user.bungieNetMembershipId;

        const membershipType = EnumUtils.getNumberValue(
          destinyMembership
            ? destinyMembership.membershipType
            : BungieMembershipType.BungieNext,
          BungieMembershipType
        );

        return {
          url: RouteHelper.NewProfile({
            mid: membershipId,
            mtype: membershipType.toString(),
          }),
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
