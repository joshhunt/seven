// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import settingsStyles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { AclEnum, BungieMembershipType, RuntimeGroupMemberType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform, Queries } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory, useParams } from "react-router";

interface BannedProps {}

export const Banned: React.FC<BannedProps> = (props) => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const clanId = params?.clanId ?? "0";

  const [bannedMembersResponse, setBannedMembersResponse] = useState<
    Queries.SearchResultGroupBan
  >();

  const getBannedUsers = (page = 1) => {
    Platform.GroupV2Service.GetBannedMembersOfGroup(clanId, page)
      .then((result) => {
        setBannedMembersResponse(result);
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const unban = (mtype: BungieMembershipType, mid: string) => {
    Platform.GroupV2Service.UnbanMember(clanId, mtype, mid).then(() => {
      getBannedUsers();
    });
  };

  const pagerPage = (bannedMembersResponse?.query?.currentPage ?? 0) - 1;

  useEffect(() => {
    getBannedUsers();
  }, []);

  if (!bannedMembersResponse) {
    return null;
  }

  return (
    <SettingsWrapper>
      <div className={settingsStyles.membersHeader}>
        <h3>{clansLoc.BannedMembers}</h3>
      </div>
      <div>
        {bannedMembersResponse &&
          bannedMembersResponse?.results?.length === 0 && (
            <p>{clansLoc.NoOneIsBanned}</p>
          )}
        {bannedMembersResponse && bannedMembersResponse?.results?.length > 0 && (
          <ul className={classNames(styles.listCards, styles.admin)}>
            {bannedMembersResponse?.results?.map((b) => {
              const profileLink = b.bungieNetUserInfo
                ? RouteHelper.NewProfile({
                    mid: b.bungieNetUserInfo.membershipId,
                    mtype: EnumUtils.getStringValue(
                      BungieMembershipType.BungieNext,
                      BungieMembershipType
                    ),
                  })
                : RouteHelper.NewProfile({
                    mid: b.destinyUserInfo.membershipId,
                    mtype: EnumUtils.getStringValue(
                      b.destinyUserInfo.membershipType,
                      BungieMembershipType
                    ),
                  });

              const username = `${b.destinyUserInfo.displayName} (${
                Localizer.Platforms[
                  EnumUtils.getStringValue(
                    b.destinyUserInfo.membershipType,
                    BungieMembershipType
                  )
                ]
              })`;

              return (
                <li
                  className={styles.memberCard}
                  key={b.destinyUserInfo.membershipId}
                >
                  <div className={styles.content}>
                    <div className={styles.header}>
                      <div
                        className={styles.headerIcon}
                        style={{
                          backgroundImage: `url(${
                            b.bungieNetUserInfo?.iconPath ??
                            b.destinyUserInfo?.iconPath
                          })`,
                        }}
                      />
                      <div className={styles.headerDetails}>
                        <div className={styles.cardTitle}>
                          <div className={styles.bannedUserName}>
                            <Anchor url={profileLink}>{username}</Anchor>
                            <em className={styles.subtitle}>
                              {b.bungieNetUserInfo?.supplementalDisplayName
                                ? b.bungieNetUserInfo.supplementalDisplayName
                                : ""}
                            </em>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.adminActions}>
                      <Button
                        buttonType={"gold"}
                        size={BasicSize.Small}
                        onClick={() =>
                          unban(
                            b.destinyUserInfo?.membershipType,
                            b.destinyUserInfo?.membershipId
                          )
                        }
                      >
                        {clansLoc.Unban}
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {!(pagerPage === 0 && !bannedMembersResponse?.hasMore) && (
          <ReactPaginate
            pageCount={
              pagerPage > 3 && bannedMembersResponse.hasMore ? pagerPage + 5 : 5
            }
            onPageChange={(newPage) => {
              getBannedUsers(newPage.selected + 1);
            }}
            forcePage={pagerPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            previousLabel={Localizer.usertools.previousPage}
            nextLabel={Localizer.usertools.nextPage}
            containerClassName={styles.paginateInterface}
            activeClassName={styles.active}
            previousClassName={styles.prev}
            nextClassName={styles.next}
            disabledClassName={styles.disabled}
          />
        )}
      </div>
    </SettingsWrapper>
  );
};
