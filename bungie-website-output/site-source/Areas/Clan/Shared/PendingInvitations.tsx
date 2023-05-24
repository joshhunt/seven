// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanPendingInvitesDataStore } from "@Areas/Clan/DataStores/ClanPendingInvitesDataStore";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import settingsStyles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React from "react";
import ReactPaginate from "react-paginate";

interface PendingInvitationsProps {
  clanId: string;
}

export const PendingInvitations: React.FC<PendingInvitationsProps> = (
  props
) => {
  const clansLoc = Localizer.Clans;
  const pendingInvitesData = useDataStore(ClanPendingInvitesDataStore);

  const cancelInvite = (mtype: BungieMembershipType, mid: string) => {
    Platform.GroupV2Service.IndividualGroupInviteCancel(
      props.clanId,
      mtype,
      mid
    )
      .then(() => {
        ClanPendingInvitesDataStore.actions.getInvitationsAndFriends(
          props.clanId
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  if (
    !pendingInvitesData ||
    pendingInvitesData?.invitationsResponse?.results?.length === 0
  ) {
    return null;
  }

  const pagerPage =
    (pendingInvitesData?.invitationsResponse?.query?.currentPage ?? 0) - 1;

  return (
    <>
      <div className={settingsStyles.membersHeader}>
        <h3>{clansLoc.PendingInvitations}</h3>
      </div>
      <div>
        <ul
          className={classNames(
            styles.listCards,
            styles.admin,
            styles.invitations
          )}
        >
          {pendingInvitesData?.invitationsResponse?.results?.map((b) => {
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

            const isCrossSaved =
              !!b.destinyUserInfo?.crossSaveOverride &&
              !EnumUtils.hasFlag(
                BungieMembershipType.None,
                b.destinyUserInfo.crossSaveOverride
              );
            const isCrossSavedActive =
              isCrossSaved &&
              b.destinyUserInfo.crossSaveOverride ===
                b.destinyUserInfo.membershipType;
            const isCrossSavedInactive =
              isCrossSaved &&
              b.destinyUserInfo.crossSaveOverride !==
                b.destinyUserInfo.membershipType;

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
                        <div>
                          <Anchor url={profileLink}>
                            {b.bungieNetUserInfo
                              ? UserUtils.getBungieNameFromUserInfoCard(
                                  b.bungieNetUserInfo
                                )?.bungieGlobalName
                              : UserUtils.getBungieNameFromGroupUserInfoCard(
                                  b.destinyUserInfo
                                )?.bungieGlobalName}
                          </Anchor>
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
                                      b.destinyUserInfo?.membershipType,
                                      BungieMembershipType
                                    )
                                  ]
                                )}
                              >
                                {
                                  Localizer.Shortplatforms[
                                    EnumUtils.getStringValue(
                                      b.destinyUserInfo?.membershipType,
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
                          {ClanUtils.orderByLastSeen(
                            b.destinyUserInfo?.applicableMembershipTypes ?? [],
                            b.destinyUserInfo?.LastSeenDisplayNameType
                          ).map((p, i) => {
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
                                      b.destinyUserInfo
                                        ?.LastSeenDisplayNameType,
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
                  <div className={styles.adminActions}>
                    <Button
                      buttonType={"clear"}
                      size={BasicSize.Small}
                      onClick={() =>
                        cancelInvite(
                          b.destinyUserInfo?.membershipType,
                          b.destinyUserInfo?.membershipId
                        )
                      }
                    >
                      {clansLoc.CancelInvite}
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {!(
          pagerPage === 0 && !pendingInvitesData?.invitationsResponse?.hasMore
        ) && (
          <ReactPaginate
            pageCount={
              pagerPage > 3 && pendingInvitesData?.invitationsResponse.hasMore
                ? pagerPage + 5
                : 5
            }
            onPageChange={(selectedPage) => {
              ClanPendingInvitesDataStore.actions.getPendingInvitations(
                pendingInvitesData.clanId,
                selectedPage.selected + 1
              );
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
    </>
  );
};
