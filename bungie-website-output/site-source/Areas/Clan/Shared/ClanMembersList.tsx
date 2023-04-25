// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, RuntimeGroupMemberType } from "@Enum";
import { Platform, Queries } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import styles from "./ClanMembers.module.scss";

interface ClanMembersListProps {
  clanId: string;
  memberType: RuntimeGroupMemberType;
}

export const ClanMembersList: React.FC<ClanMembersListProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const [members, setMembers] = useState<Queries.SearchResultGroupMember>();

  const getClanMembers = (page: number) => {
    Platform.GroupV2Service.GetMembersOfGroup(
      props.clanId,
      page,
      props.memberType,
      ""
    ).then((result) => {
      setMembers(result);
    });
  };

  const getLocalizedHeader = (memberType: RuntimeGroupMemberType) => {
    switch (memberType) {
      case RuntimeGroupMemberType.Founder:
      case RuntimeGroupMemberType.ActingFounder:
        return clansLoc.Founder;
      case RuntimeGroupMemberType.Admin:
        return clansLoc.Admin;
      case RuntimeGroupMemberType.Member:
        return clansLoc.Member;
      case RuntimeGroupMemberType.Beginner:
        return clansLoc.Beginner;
    }

    return null;
  };

  useEffect(() => {
    getClanMembers(1);
  }, []);

  if (!members || members.results.length === 0) {
    return null;
  }

  return (
    <div className={styles.membersListWrapper}>
      <h4>{getLocalizedHeader(props.memberType)}</h4>
      <ul className={styles.listCards}>
        {members.results
          .sort((a, b) =>
            DateTime.fromISO(a.joinDate) > DateTime.fromISO(b.joinDate) ? 1 : -1
          )
          .map((m) => {
            const profileLink = m.bungieNetUserInfo
              ? RouteHelper.NewProfile({
                  mid: m.bungieNetUserInfo.membershipId,
                  mtype: EnumUtils.getStringValue(
                    BungieMembershipType.BungieNext,
                    BungieMembershipType
                  ),
                })
              : RouteHelper.NewProfile({
                  mid: m.destinyUserInfo.membershipId,
                  mtype: EnumUtils.getStringValue(
                    m.destinyUserInfo.membershipType,
                    BungieMembershipType
                  ),
                });

            const isCrossSaved =
              m.destinyUserInfo?.crossSaveOverride &&
              !EnumUtils.hasFlag(
                BungieMembershipType.None,
                m.destinyUserInfo.crossSaveOverride
              );
            const isCrossSavedActive =
              isCrossSaved &&
              m.destinyUserInfo.crossSaveOverride ===
                m.destinyUserInfo.membershipType;
            const isCrossSavedInactive =
              isCrossSaved &&
              m.destinyUserInfo.crossSaveOverride !==
                m.destinyUserInfo.membershipType;

            const membershipTypeClass = EnumUtils.getStringValue(
              m.destinyUserInfo.membershipType,
              BungieMembershipType
            );

            const orderByLastSeen = () => {
              return m.destinyUserInfo.applicableMembershipTypes.sort(
                (a, b) => {
                  if (b === m.destinyUserInfo.LastSeenDisplayNameType) {
                    return 1;
                  } else if (a === m.destinyUserInfo.LastSeenDisplayNameType) {
                    return -1;
                  }

                  return 0;
                }
              );
            };

            return (
              <li
                className={styles.memberCard}
                key={m.destinyUserInfo.membershipId}
              >
                <div className={styles.content}>
                  <div className={styles.header}>
                    <div
                      className={styles.headerIcon}
                      style={{
                        backgroundImage: `url(${
                          m.bungieNetUserInfo?.iconPath ??
                          m.destinyUserInfo?.iconPath
                        })`,
                      }}
                    />
                    <div className={styles.headerDetails}>
                      <div className={styles.cardTitle}>
                        <div>
                          <Anchor url={profileLink}>
                            {m.bungieNetUserInfo
                              ? UserUtils.getBungieNameFromUserInfoCard(
                                  m.bungieNetUserInfo
                                )?.bungieGlobalName
                              : UserUtils.getBungieNameFromGroupUserInfoCard(
                                  m.destinyUserInfo
                                )?.bungieGlobalName}
                          </Anchor>
                          {m.lastOnlineStatusChange &&
                            m.lastOnlineStatusChange !== "0" && (
                              <span className={styles.lastPlayedDate}>
                                {clansLoc.LastOnline}{" "}
                                <em>
                                  {DateTime.fromSeconds(
                                    parseInt(m.lastOnlineStatusChange)
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
                                      m.destinyUserInfo.membershipType,
                                      BungieMembershipType
                                    )
                                  ]
                                )}
                              >
                                {
                                  Localizer.Shortplatforms[
                                    EnumUtils.getStringValue(
                                      m.destinyUserInfo.membershipType,
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
                                    EnumUtils.getStringValue(
                                      p,
                                      BungieMembershipType
                                    )
                                  ],
                                  {
                                    [styles.notLastSeen]: !EnumUtils.looseEquals(
                                      p,
                                      m.destinyUserInfo.LastSeenDisplayNameType,
                                      BungieMembershipType
                                    ),
                                  }
                                )}
                              >
                                {
                                  Localizer.Shortplatforms[
                                    EnumUtils.getStringValue(
                                      p,
                                      BungieMembershipType
                                    )
                                  ]
                                }
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
