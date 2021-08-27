// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ActivityOutputFormat, BungieMembershipType } from "@Enum";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Contracts, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { OneLineItem } from "@UIKit/Companion/OneLineItem";
import { Icon } from "@UIKit/Controls/Icon";
import React, { useEffect, useState } from "react";
import styles from "./BungieView.module.scss";
import { Localizer } from "@bungie/localization/Localizer";

interface BungieNetActivityProps {
  membershipId: string;
}

export const BungieNetActivity: React.FC<BungieNetActivityProps> = (props) => {
  const [forumActivity, setForumActivity] = useState<
    Contracts.ActivityMessageSearchResponse
  >(null);

  const GetForumActivity = () => {
    Platform.ActivityService.GetForumActivityForUserV2(
      props.membershipId,
      1,
      ActivityOutputFormat.BNet
    ).then((response) => {
      setForumActivity(response);
    });
  };

  useEffect(() => {
    GetForumActivity();
  }, [props.membershipId]);

  if (forumActivity === null) {
    return null;
  }

  const generateActivityMessageFragment = (message: string) => {
    const newMessage = message;

    const html = document.createElement("div");
    html.innerHTML = message;

    const anchorsInMessage = Array.from(html.getElementsByTagName("a"));

    anchorsInMessage.forEach((anchor) => {
      if (anchor.hasAttribute("data-topicid")) {
        //replace with this
        const id = anchor.getAttribute("data-topicid");

        anchor.href = RouteHelper.Post(id).url;
      } else if (anchor.hasAttribute("data-groupid")) {
        //group topic link
        const id = anchor.getAttribute("data-groupid");
        anchor.href = RouteHelper.Post(id).url;
      } else if (anchor.hasAttribute("data-grouptopicId")) {
        //group topic link
        const groupId = anchor.getAttribute("data-groupid");
        const topicId = anchor.getAttribute("data-grouptopicid");
        anchor.href = RouteHelper.GroupsPost(groupId, topicId).url;
      } else if (anchor.hasAttribute("data-postid")) {
        //post link
        const id = anchor.getAttribute("data-postid");

        anchor.href = RouteHelper.Post(id).url;
      } else if (anchor.hasAttribute("data-ccid")) {
        //community content activity link

        const id = anchor.getAttribute("data-ccid");

        anchor.href = RouteHelper.CreationsDetail(id).url;
      } else if (anchor.hasAttribute("[data-tag]")) {
        // Tag Text
        const id = anchor.getAttribute("data-tag");

        anchor.href = RouteHelper.ForumsTag(id).url;
      } else if (anchor.hasAttribute("[data-membershipid]")) {
        //profile
        const id = anchor.getAttribute("data-membershipid");

        anchor.href = RouteHelper.NewProfile({
          mid: id,
        }).url;
      } else if (anchor.hasAttribute("[data-characterid]")) {
        const mType =
          BungieMembershipType[
            anchor.getAttribute(
              "data-membershiptype"
            ) as keyof typeof BungieMembershipType
          ];
        const destinyId = anchor.getAttribute("data-destinymembershipid");
        const characterId = anchor.getAttribute("data-characterid");

        anchor.href = RouteHelper.Gear(destinyId, mType, characterId).url;
      } else if (anchor.hasAttribute("[data-applicationid]")) {
        const applicationId = anchor.getAttribute("data-applicationid");

        anchor.href = RouteHelper.ApplicationDetail(applicationId).url;
      }
    });

    return (
      <OneLineItem
        itemTitle={<SafelySetInnerHTML html={html.innerHTML} />}
        icon={<Icon iconType={"material"} iconName={"forum"} />}
      />
    );
  };

  return (
    <div className={styles.forumActivity}>
      <h3>{Localizer.Profile.ForumActivity}</h3>
      <ul>
        {forumActivity.results.map(
          (activityMessage: Contracts.ActivityMessage) => {
            return (
              <li key={activityMessage.activity.activityId}>
                {generateActivityMessageFragment(activityMessage.message)}
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
