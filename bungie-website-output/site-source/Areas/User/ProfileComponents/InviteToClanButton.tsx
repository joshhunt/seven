// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/Profile.module.scss";
import { ClanSelector } from "@Areas/User/ProfileComponents/ClanSelector";
import { PlatformError } from "@CustomErrors";
import { DestinyMembershipDataStorePayload } from "@Global/DataStore/DestinyMembershipDataStore";
import { Localizer } from "@bungie/localization";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Platform, GroupsV2 } from "@Platform";
import {
  GroupsForMemberFilter,
  GroupType,
  GroupPotentialMemberStatus,
} from "@Enum";

interface InviteToClanButtonProps {
  onPageUserDestinyMembership: DestinyMembershipDataStorePayload;
  loggedInUserClans: GroupsV2.GetGroupsForMemberResponse;
}

export const InviteToClanButton: React.FC<InviteToClanButtonProps> = (
  props
) => {
  const [showClanSelectorModal, toggleShowClanSelectorModal] = useState<
    boolean
  >(false);
  const [userClans, setUserClans] = useState<string[]>([]);
  const [userPendingClans, setUserPendingClans] = useState<string[]>([]);

  const clansLoc = Localizer.Clans;

  const getClanMembershipsForOnpageUser = () => {
    const promises: Promise<
      | GroupsV2.GetGroupsForMemberResponse
      | GroupsV2.GroupPotentialMembershipSearchResponse
    >[] = [];

    const pendingClanPromises: Promise<
      GroupsV2.GroupPotentialMembershipSearchResponse
    >[] = [];
    const clanPromises: Promise<GroupsV2.GetGroupsForMemberResponse>[] = [];

    props.onPageUserDestinyMembership.memberships.forEach((membership) => {
      clanPromises.push(
        Platform.GroupV2Service.GetGroupsForMember(
          membership.membershipType,
          membership.membershipId,
          GroupsForMemberFilter.All,
          GroupType.Clan
        )
      );
      pendingClanPromises.push(
        Platform.GroupV2Service.GetPotentialGroupsForMember(
          membership.membershipType,
          membership.membershipId,
          GroupPotentialMemberStatus.Invitee,
          GroupType.Clan
        )
      );
      pendingClanPromises.push(
        Platform.GroupV2Service.GetPotentialGroupsForMember(
          membership.membershipType,
          membership.membershipId,
          GroupPotentialMemberStatus.Applicant,
          GroupType.Clan
        )
      );
    });

    Promise.all(clanPromises)
      .then((data) => {
        const _userClans: string[] = [];

        for (const d of data) {
          _userClans.push(...d.results.map((value) => value.group.groupId));
        }

        setUserClans(_userClans);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));

    Promise.all(pendingClanPromises)
      .then((data) => {
        const _userPendingClans: string[] = [];

        for (const d of data) {
          _userPendingClans.push(
            ...d.results.map((value) => value.group.groupId)
          );
        }

        setUserPendingClans(_userPendingClans);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const sendInviteForClan = (clanId: string) => {
    const input: GroupsV2.GroupApplicationRequest = {
      message: "",
    };

    //send the invite
    Platform.GroupV2Service.IndividualGroupInvite(
      input,
      clanId,
      props.onPageUserDestinyMembership.selectedMembership.membershipType,
      props.onPageUserDestinyMembership.selectedMembership.membershipId
    )
      .then(() => {
        //refresh the master list
        getClanMembershipsForOnpageUser();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const inviteToClan = () => {
    //which clan?
    const clans = props.loggedInUserClans;

    if (clans.results.length > 1) {
      //show the clan select modal
      toggleShowClanSelectorModal(true);
    } else {
      sendInviteForClan(clans.results[0].group.groupId);
    }
  };

  useEffect(() => {
    getClanMembershipsForOnpageUser();
  }, []);

  if (typeof props.loggedInUserClans === "undefined") {
    return null;
  }

  //this onpageuser is in all of the same clans as the viewer -> hide it, otherwise show it
  const hideInviteButton = props.loggedInUserClans.results?.every((value) =>
    userClans.includes(value.group.groupId)
  );

  //this onpageuser has a pending state in at least once of the viewers clans
  const showPendingInviteButtonState =
    (props.loggedInUserClans.results?.filter((value) =>
      userPendingClans.includes(value.group.groupId)
    ).length ?? 0) > 0;

  const loggedInUserClansWithNoState =
    props.loggedInUserClans?.results.filter(
      (value) =>
        !userClans.includes(value.group.groupId) &&
        !userPendingClans.includes(value.group.groupId)
    ) ?? [];

  return (
    <>
      {props.loggedInUserClans.results?.length > 0 && !hideInviteButton && (
        <>
          <Button
            buttonType={
              showPendingInviteButtonState &&
              loggedInUserClansWithNoState.length === 0
                ? "disabled"
                : "white"
            }
            className={classNames(styles.button, styles.btnClanInvite)}
            onClick={inviteToClan}
          >
            {showPendingInviteButtonState
              ? clansLoc.PendingMembership
              : clansLoc.InviteToClan}
          </Button>
          <ClanSelector
            clans={loggedInUserClansWithNoState}
            showModal={showClanSelectorModal}
            sendInvite={() => sendInviteForClan}
            onClose={() => toggleShowClanSelectorModal(false)}
          />
        </>
      )}
    </>
  );
};
