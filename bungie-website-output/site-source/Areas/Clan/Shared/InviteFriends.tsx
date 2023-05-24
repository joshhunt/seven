// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanPendingInvitesDataStore } from "@Areas/Clan/DataStores/ClanPendingInvitesDataStore";
import { BungieFriendCard } from "@Areas/Clan/Shared/BungieFriendCard";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import modalStyles from "./InviteModal.module.scss";
import settingsStyles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { InviteModal } from "@Areas/Clan/Shared/InviteModal";
import { SearchInput } from "@Areas/Clan/Shared/SearchInput";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType } from "@Enum";
import { Friends, GroupsV2, Platform, User } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface InviteFriendsProps {
  clanId: string;
  invitations?: GroupsV2.GroupMemberApplication[];
  updateInvites?: () => void;
}

export const InviteFriends: React.FC<InviteFriendsProps> = (props) => {
  const clansLoc = Localizer.Clans;
  const clanPendingInvitesData = useDataStore(ClanPendingInvitesDataStore);

  const [searchedUsers, setSearchedUsers] = useState<User.UserInfoCard[]>();
  const [searchTerm, setSearchTerm] = useState("");

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

  const getSuggestedUsers = () => {
    //
    ClanPendingInvitesDataStore.actions.getFriends();
  };

  const searchForUsers = (value: string) => {
    setSearchedUsers(undefined);

    const bungieGlobalName = value.split("#");

    const destinyUserName: User.ExactSearchRequest = {
      displayName: bungieGlobalName[0],
      displayNameCode: parseInt(bungieGlobalName[1], 10),
    };

    Platform.Destiny2Service.SearchDestinyPlayerByBungieName(
      destinyUserName,
      BungieMembershipType.All
    ).then((result) => {
      //update
      setSearchedUsers(result);
    });
  };

  const openInviteModal = (friend: Friends.BungieFriend) => {
    const inviteModal = Modal.open(
      <InviteModal
        friend={friend}
        clanId={props.clanId}
        inviteSent={() => {
          inviteModal.current.close();

          ClanPendingInvitesDataStore.actions.getPendingInvitations(
            props.clanId
          );
        }}
      />,
      { className: modalStyles.inviteModal }
    );
  };

  const sendInviteToSearchUser = (mtype: BungieMembershipType, mid: string) => {
    Platform.GroupV2Service.IndividualGroupInvite(
      { message: "" },
      props.clanId,
      mtype,
      mid
    ).then((result) => {
      //update
    });
  };

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
        {clanPendingInvitesData?.friendsListResponse &&
          clanPendingInvitesData?.friendsListResponse?.friends?.length ===
            0 && <p>{clansLoc.ThereWereNoResults}</p>}
        {searchTerm === "" &&
          clanPendingInvitesData?.friendsListResponse &&
          clanPendingInvitesData?.friendsListResponse?.friends?.length > 0 && (
            <ul className={classNames(styles.listCards)}>
              {clanPendingInvitesData?.friendsListResponse?.friends?.map(
                (b) => {
                  if (
                    clanPendingInvitesData?.invitationsResponse?.results
                      ?.length &&
                    clanPendingInvitesData?.invitationsResponse?.results?.find(
                      (iv) =>
                        b.bungieNetUser.membershipId ===
                        iv.bungieNetUserInfo?.membershipId
                    )
                  ) {
                    //already has invitation
                    return null;
                  }

                  return (
                    <BungieFriendCard
                      key={b.lastSeenAsMembershipId}
                      friend={b}
                      onClick={() => openInviteModal(b)}
                    />
                  );
                }
              )}
            </ul>
          )}

        {searchedUsers && searchedUsers?.length > 0 && (
          <SpinnerContainer loading={true}>
            <ul
              className={classNames(
                styles.listCards,
                styles.admin,
                styles.suggestedInvites
              )}
            >
              {searchedUsers
                ?.filter((u) =>
                  clanPendingInvitesData?.invitationsResponse?.results?.find(
                    (iv) => iv.destinyUserInfo?.membershipId !== u?.membershipId
                  )
                )
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
                        sendInviteToSearchUser(b.membershipType, b.membershipId)
                      }
                    >
                      <div className={styles.content}>
                        <div className={styles.header}>
                          <div
                            className={styles.headerIcon}
                            style={{
                              backgroundImage: `url(/img/profile/avatars/default_avatar.gif)`,
                            }}
                          />
                          <div className={styles.headerDetails}>
                            <div className={styles.cardTitle}>
                              <div>{bungieNameWithCode}</div>
                            </div>
                          </div>
                        </div>
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
