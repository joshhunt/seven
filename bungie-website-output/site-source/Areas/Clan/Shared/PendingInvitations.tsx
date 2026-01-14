import { ConvertToPlatformErrorSync } from "@ApiIntermediary";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import settingsStyles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface PendingInvitationsProps {
  clanId: string;
}

export const PendingInvitations: React.FC<PendingInvitationsProps> = (
  props
) => {
  const clansLoc = Localizer.Clans;
  const [invites, setInvites] = useState<GroupsV2.GroupMemberApplication[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getPendingInvitations(page);
  }, [page]);

  const getPendingInvitations = async (page: number) => {
    const result = await Platform.GroupV2Service.GetInvitedIndividuals(
      props.clanId,
      page
    );
    setInvites(result?.results ?? []);
    setHasMore(!!result?.hasMore);
  };

  const cancelInvite = async (mtype: BungieMembershipType, mid: string) => {
    try {
      await Platform.GroupV2Service.IndividualGroupInviteCancel(
        props.clanId,
        mtype,
        mid
      );
      await getPendingInvitations(page);
    } catch (ex) {
      const err = ConvertToPlatformErrorSync(ex);
      Modal.error(err);
    }
  };

  if (invites.length === 0) {
    return null;
  }

  return (
    <>
      <div className={settingsStyles.membersHeader}>
        <h3>{clansLoc.PendingInvitations}</h3>
      </div>
      <div
        className={classNames(
          styles.membersListWrapper,
          styles.admin,
          styles.invitations
        )}
      >
        <ul className={styles.listCards}>
          {invites.map((b) => {
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
                          {isCrossSavedInactive ? (
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
                              <div
                                className={classNames(
                                  styles.platformType,
                                  styles.notLastSeen
                                )}
                              >
                                {clansLoc.InactiveCharacters}
                              </div>
                            </>
                          ) : (
                            <div
                              className={classNames(
                                styles.platformType,
                                styles[
                                  EnumUtils.getStringValue(
                                    b.destinyUserInfo.membershipType,
                                    BungieMembershipType
                                  )
                                ]
                              )}
                            >
                              {
                                Localizer.Shortplatforms[
                                  EnumUtils.getStringValue(
                                    b.destinyUserInfo.membershipType,
                                    BungieMembershipType
                                  )
                                ]
                              }
                            </div>
                          )}
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
        {/* these results are not actually paged */}
        {/* <ReactPaginate
					pageCount={page > 3 && hasMore ? page + 5 : 5}
					onPageChange={(selectedPage) => {
						setPage(selectedPage.selected)
					}}
					
					forcePage={page}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					previousLabel={Localizer.usertools.previousPage}
					nextLabel={Localizer.usertools.nextPage}
					containerClassName={styles.paginateInterface}
					activeClassName={styles.active}
					previousClassName={styles.prev}
					nextClassName={styles.next}
					disabledClassName={styles.disabled}
				/> */}
      </div>
    </>
  );
};
