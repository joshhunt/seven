// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanApplicationAdminButtons } from "@Areas/Clan/Shared/ClanApplicationAdminButtons";
import { ClanMemberAdminButtons } from "@Areas/Clan/Shared/ClanMemberAdminButtons";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import { ClanMemberListType } from "@Areas/Clan/Shared/ClanMembersList";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GroupsV2 } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

interface UserCardProps {
  clanId: string;
  m: GroupsV2.GroupMember | GroupsV2.GroupMemberApplication;
  listType: ClanMemberListType;
  updatePending?: () => void;
}

export const UserCard: React.FC<UserCardProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const isApplication = Object.hasOwn(props.m, "resolveState");

  const profileLink = props.m.bungieNetUserInfo
    ? RouteHelper.NewProfile({
        mid: props.m.bungieNetUserInfo.membershipId,
        mtype: EnumUtils.getStringValue(
          BungieMembershipType.BungieNext,
          BungieMembershipType
        ),
      })
    : RouteHelper.NewProfile({
        mid: props.m.destinyUserInfo.membershipId,
        mtype: EnumUtils.getStringValue(
          props.m.destinyUserInfo.membershipType,
          BungieMembershipType
        ),
      });

  const isCrossSaved =
    !!props.m.destinyUserInfo?.crossSaveOverride &&
    !EnumUtils.hasFlag(
      BungieMembershipType.None,
      props.m.destinyUserInfo.crossSaveOverride
    );
  const isCrossSavedActive =
    isCrossSaved &&
    props.m.destinyUserInfo.crossSaveOverride ===
      props.m.destinyUserInfo.membershipType;
  const isCrossSavedInactive =
    isCrossSaved &&
    props.m.destinyUserInfo.crossSaveOverride !==
      props.m.destinyUserInfo.membershipType;

  const orderByLastSeen = () => {
    return props.m.destinyUserInfo?.applicableMembershipTypes?.sort((a, b) => {
      if (b === props.m.destinyUserInfo?.LastSeenDisplayNameType) {
        return 1;
      } else if (a === props.m.destinyUserInfo?.LastSeenDisplayNameType) {
        return -1;
      }

      return 0;
    });
  };

  const useGroupMemberType = (
    member: GroupsV2.GroupMember | GroupsV2.GroupMemberApplication
  ): GroupsV2.GroupMember => {
    return member as GroupsV2.GroupMember;
  };

  const useGroupApplicationType = (
    member: GroupsV2.GroupMember | GroupsV2.GroupMemberApplication
  ): GroupsV2.GroupMemberApplication => {
    return member as GroupsV2.GroupMemberApplication;
  };

  return (
    <li
      className={styles.memberCard}
      key={props.m.destinyUserInfo.membershipId}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div
            className={styles.headerIcon}
            style={{
              backgroundImage: `url(${
                props.m.bungieNetUserInfo?.iconPath ??
                props.m.destinyUserInfo?.iconPath
              })`,
            }}
          >
            {!isApplication && props.listType === "compact" && (
              <span
                className={classNames(styles.userStatus, {
                  [styles.online]: useGroupMemberType(props.m).isOnline,
                })}
              />
            )}
          </div>
          <div className={styles.headerDetails}>
            <div className={styles.cardTitle}>
              <div>
                <Anchor url={profileLink}>
                  {props.m.bungieNetUserInfo
                    ? UserUtils.getBungieNameFromUserInfoCard(
                        props.m.bungieNetUserInfo
                      )?.bungieGlobalName
                    : UserUtils.getBungieNameFromGroupUserInfoCard(
                        props.m.destinyUserInfo
                      )?.bungieGlobalName}
                </Anchor>
                {!isApplication &&
                  props.listType !== "compact" &&
                  useGroupMemberType(props.m).lastOnlineStatusChange &&
                  useGroupMemberType(props.m).lastOnlineStatusChange !==
                    "0" && (
                    <span className={styles.lastPlayedDate}>
                      {clansLoc.LastOnline}{" "}
                      <em>
                        {DateTime.fromSeconds(
                          parseInt(
                            useGroupMemberType(props.m).lastOnlineStatusChange
                          )
                        )
                          .toUTC()
                          .toFormat("MMMM dd")}
                      </em>
                    </span>
                  )}
              </div>
              <div className={styles.platformTypes}>
                {isCrossSavedActive && (
                  <div
                    style={{
                      backgroundImage: `url(/img/theme/bungienet/icons/icon_cross_save_sm_light.png)`,
                    }}
                    className={styles.crossSaveIcon}
                  />
                )}
                {isCrossSavedInactive && (
                  <>
                    <div
                      className={classNames(
                        styles.platformType,
                        styles[
                          EnumUtils.getStringValue(
                            props.m.destinyUserInfo?.membershipType,
                            BungieMembershipType
                          )
                        ]
                      )}
                    >
                      {
                        Localizer.Shortplatforms[
                          EnumUtils.getStringValue(
                            props.m.destinyUserInfo?.membershipType,
                            BungieMembershipType
                          )
                        ]
                      }
                    </div>
                    <div className={styles.notLastSeen}>
                      {clansLoc.InactiveCharacters}
                    </div>
                  </>
                )}
                {orderByLastSeen().map((p, i) => {
                  return (
                    <div
                      key={i}
                      className={classNames(
                        styles.platformType,
                        styles[
                          EnumUtils.getStringValue(p, BungieMembershipType)
                        ],
                        {
                          [styles.notLastSeen]: !EnumUtils.looseEquals(
                            p,
                            props.m.destinyUserInfo?.LastSeenDisplayNameType,
                            BungieMembershipType
                          ),
                        }
                      )}
                    >
                      {
                        Localizer.Shortplatforms[
                          EnumUtils.getStringValue(p, BungieMembershipType)
                        ]
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {!isApplication && props.listType === "admin" && (
          <ClanMemberAdminButtons
            clanId={props.clanId}
            clanMember={useGroupMemberType(props.m)}
          />
        )}
        {isApplication && (
          <ClanApplicationAdminButtons
            clanId={props.clanId}
            applicant={useGroupApplicationType(props.m)}
            updatePending={() => props.updatePending()}
          />
        )}
      </div>
    </li>
  );
};
