// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { BanButton } from "@Areas/Clan/Shared/BanButton";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { PlatformErrorCodes, RuntimeGroupMemberType } from "@Enum";
import { GroupsV2, Platform, User } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";

interface ClanApplicationAdminButtonsProps {
  clanId: string;
  applicant: GroupsV2.GroupMemberApplication;
  updatePending: () => void;
}

export const ClanApplicationAdminButtons: React.FC<ClanApplicationAdminButtonsProps> = (
  props
) => {
  const clanMembersData = useDataStore(ClanMembersDataStore);
  const clansLoc = Localizer.Clans;

  const denyApplicant = () => {
    const memberships: User.UserMembership[] = [
      {
        membershipType: props.applicant?.destinyUserInfo?.membershipType,
        membershipId: props.applicant?.destinyUserInfo?.membershipId,
        displayName: props.applicant?.destinyUserInfo?.displayName,
        bungieGlobalDisplayName: null,
      },
    ];

    const groupApplicationListRequest = {
      memberships: memberships,
      message: "",
    };

    Platform.GroupV2Service.DenyPendingForList(
      groupApplicationListRequest,
      props.clanId
    )
      .then(() => {
        props.updatePending();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const approveApplicant = () => {
    const groupApplicationRequest: GroupsV2.GroupApplicationRequest = {
      message: "",
    };

    Platform.GroupV2Service.ApprovePending(
      groupApplicationRequest,
      props.clanId,
      props.applicant?.destinyUserInfo?.membershipType,
      props.applicant?.destinyUserInfo?.membershipId
    )
      .then(() => {
        ClanMembersDataStore.actions.getMembersOfType(
          props.clanId,
          [RuntimeGroupMemberType.Beginner, RuntimeGroupMemberType.Member],
          "",
          1
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (
          e.errorCode === PlatformErrorCodes.ClanApplicantInClanSoNowInvited
        ) {
          props.updatePending();
        }

        Modal.error(e);
      });
  };

  return (
    <div className={styles.adminActions}>
      <BanButton
        clanId={props.clanId}
        membershipId={props.applicant.destinyUserInfo.membershipId}
        membershipType={props.applicant.destinyUserInfo.membershipType}
        refreshList={() => props.updatePending()}
      />
      <Button
        buttonType={"clear"}
        size={BasicSize.Small}
        onClick={() => denyApplicant()}
      >
        {clansLoc.Deny}
      </Button>
      <Button
        buttonType={"clear"}
        size={BasicSize.Small}
        onClick={() => approveApplicant()}
      >
        {clansLoc.Approve}
      </Button>
    </div>
  );
};
