// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanBannerDisplay } from "@Areas/User/ProfileComponents/ClanBanner";
import { PlatformError } from "@CustomErrors";
import { DestinyMembershipDataStorePayload } from "@Global/DataStore/DestinyMembershipDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Route } from "react-router-dom";
import styles from "./Clan.module.scss";
import React, { useEffect, useState } from "react";
import { GroupsV2, Models, Platform } from "@Platform";
import { BungieMembershipType, GroupsForMemberFilter, GroupType } from "@Enum";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";

interface ClanProps {
  mType: BungieMembershipType;
  mId: string;
  destinyMembership: DestinyMembershipDataStorePayload;
  loggedInUserClans: GroupsV2.GetGroupsForMemberResponse;
  coreSettings: Models.CoreSettingsConfiguration;
  isSelf: boolean;
}

export const Clan: React.FC<ClanProps> = (props) => {
  const [clan, setClan] = useState<GroupsV2.GroupMembership>(null);

  const loadClanInfo = () => {
    if (props.isSelf && props.loggedInUserClans?.results?.length === 0) {
      setClan(null);
    } else if (
      props.isSelf &&
      props.loggedInUserClans?.results.length > 0 &&
      props.destinyMembership.selectedMembership !== null
    ) {
      const clanResult = props.loggedInUserClans.results.find(
        (value, index) => {
          return (
            value.member.destinyUserInfo.membershipType ===
            props.destinyMembership.selectedMembership.membershipType
          );
        }
      );

      if (typeof clanResult !== "undefined") {
        setClan(clanResult);
      }
    } else {
      const problem = "problem loading clan info";

      Platform.GroupV2Service.GetGroupsForMember(
        props.mType,
        props.mId,
        GroupsForMemberFilter.All,
        GroupType.Clan
      )
        .then((clanResponse: GroupsV2.GetGroupsForMemberResponse) => {
          if (clanResponse?.results.length > 0) {
            const clanResult = clanResponse.results.find((value, index) => {
              return (
                value.member.destinyUserInfo.membershipType ===
                props.destinyMembership.selectedMembership.membershipType
              );
            });

            if (typeof clanResult !== "undefined") {
              setClan(clanResult);
            }
          }
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          console.log(problem);
          Modal.error(e);
        });
    }
  };

  useEffect(() => {
    const noCurrentClanLoaded =
      clan === null && props.destinyMembership.selectedMembership !== null;
    const clanIsDifferent =
      clan !== null &&
      !props.destinyMembership.membershipData.destinyMemberships.some(
        (dm) => dm.membershipId === clan.member.destinyUserInfo.membershipId
      );

    if (noCurrentClanLoaded || clanIsDifferent) {
      loadClanInfo();
    }
  }, [props.destinyMembership]);

  if (clan === null) {
    //empty state
    return (
      <Anchor
        className={classNames(styles.clanSection, styles.emptyState)}
        url={props.isSelf ? RouteHelper.MyClan() : RouteHelper.Clans()}
      >
        <p>{Localizer.Clans.NotAMemberOfAClan}</p>
      </Anchor>
    );
  }

  const profileLoc = Localizer.Profile;

  const clanMatesText =
    clan.group.memberCount === 1
      ? Localizer.Format(profileLoc.Clanmate, { count: clan.group.memberCount })
      : Localizer.Format(profileLoc.Clanmates, {
          count: clan.group.memberCount,
        });

  return (
    <Anchor className={styles.clanSection} url={RouteHelper.MyClan()}>
      <ClanBannerDisplay
        className={styles.clanBanner}
        bannerSettings={clan.group.clanInfo.clanBannerData}
        showStaff={true}
        replaceCanvasWithImage={false}
      />
      <div className={styles.clanInfo}>
        <h3>{clan.group.name}</h3>
        <p className={styles.about}>{clan.group.motto}</p>
        <p className={styles.membercount}>
          <span className={styles.icon}>
            <Icon iconType={"bungle"} iconName={"destinyuiroster"} />
          </span>
          {clanMatesText}
        </p>
      </div>
    </Anchor>
  );
};
