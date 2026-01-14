import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import settingsStyles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { InviteModal } from "@Areas/Clan/Shared/InviteModal";
import { SearchInput } from "@Areas/Clan/Shared/SearchInput";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { Friends, GroupsV2, Platform, User } from "@Platform";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import modalStyles from "./InviteModal.module.scss";

interface InviteFriendsProps {
  clanId: string;
  invitations?: GroupsV2.GroupMemberApplication[];
  updateInvites?: () => void;
}

export const InviteFriends: React.FC<InviteFriendsProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const [invites, setInvites] = useState<GroupsV2.GroupMemberApplication[]>([]);
  const [friends, setFriends] = useState<Friends.BungieFriend[]>([]);

  const [searchedDestinyUsers, setSearchedDestinyUsers] = useState<
    User.UserInfoCard[]
  >();
  const [searchedBungieUsers, setSearchedBungieUsers] = useState<
    User.UserSearchResponseDetail[]
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const refTimer = useRef<number | null>(null);
  const startSearchThrottleTimer = (name: string) => {
    if (refTimer.current !== null) {
      return;
    }

    refTimer.current = setTimeout(() => {
      searchForUsers(name);
    }, 500);
  };
  const stopSearchThrottleTimer = () => {
    if (refTimer.current === null) {
      return;
    }

    clearTimeout(refTimer.current);
    refTimer.current = null;
  };

  useEffect(() => {
    // cleanup function
    return () => {
      if (refTimer.current !== null) {
        clearTimeout(refTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    getPendingInvitations();
    getFriends();
  }, []);

  const getPendingInvitations = async () => {
    // These results aren't actually paged
    const result = await Platform.GroupV2Service.GetInvitedIndividuals(
      props.clanId,
      1
    );
    setInvites(result?.results ?? []);
  };

  const getFriends = async () => {
    const result = await Platform.SocialService.GetFriendList();
    setFriends(result?.friends ?? []);
  };

  const searchForUsers = (value: string) => {
    setSearchedDestinyUsers(undefined);
    setSearchedBungieUsers(undefined);

    if (value !== "") {
      const bungieGlobalName = value.split("#");

      setIsSearching(true);

      const destinyUserName: User.ExactSearchRequest = {
        displayName: bungieGlobalName[0] ?? value,
        displayNameCode: bungieGlobalName[1]
          ? parseInt(bungieGlobalName[1].slice(0, 4), 10)
          : 0,
      };

      Promise.allSettled([
        Platform.UserService.SearchByGlobalNamePost(
          {
            displayNamePrefix: bungieGlobalName?.[0]
              ? bungieGlobalName[0]
              : value,
          },
          0
        ),
        Platform.Destiny2Service.SearchDestinyPlayerByBungieName(
          destinyUserName,
          BungieMembershipType.All
        ),
      ])
        .then((result) => {
          result[0].status === "fulfilled" &&
            setSearchedBungieUsers(
              result[0]?.value.searchResults?.filter(
                (u) => u.destinyMemberships?.length > 0
              )
            );
          result[1].status === "fulfilled" &&
            setSearchedDestinyUsers(result[1].value);
        })
        .finally(() => setIsSearching(false));
    }
  };

  const openInviteModal = (mId: string, mType: BungieMembershipType) => {
    const inviteModal = Modal.open(
      <InviteModal
        membershipId={mId}
        membershipType={mType}
        clanId={props.clanId}
        inviteSent={() => {
          inviteModal.current.close();

          getPendingInvitations();
        }}
      />,
      { className: modalStyles.inviteModal }
    );
  };

  const hasBungieUsersWithDestinyAccountsNotPending = searchedBungieUsers
    ?.filter((u) => u.destinyMemberships?.length > 0)
    ?.find(
      (u) =>
        !invites.find(
          (iv) =>
            iv.bungieNetUserInfo?.membershipId === u?.bungieNetMembershipId
        )
    );
  const hasDestinyUsersNotPending = searchedDestinyUsers?.find(
    (u) =>
      !invites.find(
        (iv) => iv.destinyUserInfo?.membershipId === u?.membershipId
      )
  );
  const hasFriendsWithDestinyAccountsNotPending = friends.find(
    (u) =>
      !invites.find(
        (iv) =>
          iv.bungieNetUserInfo?.membershipId === u?.bungieNetUser?.membershipId
      )
  );

  return (
    <>
      <div className={settingsStyles.membersHeader}>
        <h3>{clansLoc.IssueInvitation}</h3>
      </div>
      <SearchInput
        placeholder={clansLoc.InvitationSearch}
        updateSearchString={(value) => {
          setSearchTerm(value);

          stopSearchThrottleTimer();

          value !== "" && startSearchThrottleTimer(value);
        }}
      />
      <div
        className={classNames(
          styles.membersListWrapper,
          styles.suggestedInvites
        )}
      >
        {friends.length === 0 && <p>{clansLoc.ThereWereNoResults}</p>}
        {searchTerm === "" && hasFriendsWithDestinyAccountsNotPending && (
          <ul className={classNames(styles.listCards)}>
            {friends.map((b) => {
              if (!b.bungieNetUser) {
                //doesn't have a bungieNet account, cannot invite
                return null;
              }

              if (
                invites.find(
                  (iv) =>
                    b.bungieNetUser.membershipId ===
                    iv.bungieNetUserInfo?.membershipId
                )
              ) {
                //already has invitation
                return null;
              }

              const bungieName = UserUtils.getBungieNameFromBnetBungieFriend(b);
              const bungieNameWithCode = bungieName
                ? `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`
                : "";

              return (
                <li
                  key={b.lastSeenAsMembershipId}
                  className={styles.memberCard}
                  onClick={() =>
                    openInviteModal(
                      b.bungieNetUser.membershipId,
                      BungieMembershipType.BungieNext
                    )
                  }
                >
                  <div className={styles.content}>
                    <OneLineItem
                      itemTitle={bungieNameWithCode}
                      icon={
                        <IconCoin
                          iconImageUrl={
                            b.bungieNetUser.profilePicturePath ??
                            `/img/profile/avatars/default_avatar.gif`
                          }
                        />
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {hasBungieUsersWithDestinyAccountsNotPending && (
          <SpinnerContainer loading={isSearching}>
            <h4>{clansLoc.BungieNetUsers}</h4>
            <ul
              className={classNames(
                styles.listCards,
                styles.admin,
                styles.suggestedInvites
              )}
            >
              {searchedBungieUsers?.map((b) => {
                const bungieNameWithCode = `${b.bungieGlobalDisplayName}${
                  b.bungieGlobalDisplayNameCode
                    ? `#${b.bungieGlobalDisplayNameCode}`
                    : ""
                }`;

                return (
                  <li
                    className={styles.memberCard}
                    key={b.bungieNetMembershipId}
                    onClick={() =>
                      openInviteModal(
                        b.bungieNetMembershipId,
                        BungieMembershipType.BungieNext
                      )
                    }
                  >
                    <div className={styles.content}>
                      <OneLineItem
                        itemTitle={bungieNameWithCode}
                        icon={
                          <IconCoin
                            iconImageUrl={`/img/profile/avatars/default_avatar.gif`}
                          />
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </SpinnerContainer>
        )}

        {hasDestinyUsersNotPending && (
          <SpinnerContainer loading={isSearching}>
            <h4>{clansLoc.PlatformUsers}</h4>
            <ul
              className={classNames(
                styles.listCards,
                styles.admin,
                styles.suggestedInvites
              )}
            >
              {searchedDestinyUsers
                ?.filter((u) => {
                  return !invites.find(
                    (iv) => iv.destinyUserInfo?.membershipId === u?.membershipId
                  );
                })
                .map((b) => {
                  const bungieName = UserUtils.getBungieNameFromUserInfoCard(b);
                  const bungieNameWithCode = bungieName
                    ? `${bungieName.bungieGlobalName}${bungieName.bungieGlobalCodeWithHashtag}`
                    : "";

                  return (
                    <li
                      className={styles.memberCard}
                      key={b.membershipId}
                      onClick={() =>
                        openInviteModal(b.membershipId, b.membershipType)
                      }
                    >
                      <div className={styles.content}>
                        <OneLineItem
                          itemTitle={bungieNameWithCode}
                          icon={
                            <IconCoin
                              iconImageUrl={
                                b.iconPath ??
                                `/img/profile/avatars/default_avatar.gif`
                              }
                            />
                          }
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </SpinnerContainer>
        )}
      </div>
    </>
  );
};
