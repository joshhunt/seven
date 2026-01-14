import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { BanButton } from "@Areas/Clan/Shared/BanButton";
import styles from "@Areas/Clan/Shared/ClanMembers.module.scss";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { KickButton } from "@Areas/Clan/Shared/KickButton";
import { SetAsFounderWarningModal } from "@Areas/Clan/Shared/SetAsFounderWarningModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, RuntimeGroupMemberType } from "@Enum";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";

interface ClanMemberAdminButtonsProps {
  clanId: string;
  clanMember: GroupsV2.GroupMember;
}

export const ClanMemberAdminButtons: React.FC<ClanMemberAdminButtonsProps> = (
  props
) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useGameData().destinyData.membershipData;
  const clansLoc = Localizer.Clans;

  const isViewerSelf = !!destinyMembership?.destinyMemberships?.find(
    (m) => m.membershipId === props.clanMember.destinyUserInfo.membershipId
  );
  const isViewerFounder = !!globalState.loggedInUserClans?.results.find(
    (c) =>
      c.member.memberType > RuntimeGroupMemberType.Admin &&
      c.group.groupId === props.clanId
  );
  const isViewerAdmin =
    isViewerFounder ||
    !!globalState.loggedInUserClans?.results.find(
      (c) =>
        c.member.memberType > RuntimeGroupMemberType.Member &&
        c.group.groupId === props.clanId
    );

  const adminFounderInAllGroups = ClanUtils.isBnetAdmin(
    globalState.loggedInUser
  );
  const canBanMembers = adminFounderInAllGroups || isViewerAdmin;
  const canChangeMembers = adminFounderInAllGroups || isViewerAdmin;
  const canChangeMemberLevels = adminFounderInAllGroups || isViewerAdmin;
  const canPromoteToAdmin = adminFounderInAllGroups || isViewerFounder;
  const canSetAsFounder = adminFounderInAllGroups || isViewerFounder;

  const maxPromotion = canPromoteToAdmin
    ? RuntimeGroupMemberType.Admin
    : RuntimeGroupMemberType.Member;

  const promoteMember = (
    membershipId: string,
    membershipType: BungieMembershipType,
    currentMemberType: RuntimeGroupMemberType
  ) => {
    changeClanMembership(
      membershipId,
      membershipType,
      currentMemberType,
      currentMemberType + 1
    );
  };

  const demoteMember = (
    membershipId: string,
    membershipType: BungieMembershipType,
    currentMemberType: RuntimeGroupMemberType
  ) => {
    changeClanMembership(
      membershipId,
      membershipType,
      currentMemberType,
      currentMemberType - 1
    );
  };

  const changeClanMembership = (
    membershipId: string,
    membershipType: BungieMembershipType,
    prevMemberType: RuntimeGroupMemberType,
    newMemberType: RuntimeGroupMemberType
  ) => {
    Platform.GroupV2Service.EditGroupMembership(
      props.clanId,
      membershipType,
      membershipId,
      newMemberType
    )
      .then(() => {
        //refresh
        ClanMembersDataStore.actions.getMembersOfType(
          props.clanId,
          [prevMemberType, newMemberType],
          "",
          1
        );
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const setAsFounder = (
    membershipType: BungieMembershipType,
    membershipId: string
  ) => {
    const modal = Modal.open(
      <SetAsFounderWarningModal
        clanId={props.clanId}
        membershipType={membershipType}
        membershipId={membershipId}
        onConfirm={() => {
          modal.current.close();

          //refresh everything
          ClanMembersDataStore.actions.getMembersOfType(props.clanId, [
            RuntimeGroupMemberType.Admin,
            RuntimeGroupMemberType.ActingFounder,
            RuntimeGroupMemberType.Founder,
          ]);
        }}
        onCancel={() => modal.current.close()}
      />,
      {
        preventUserClose: true,
      }
    );
  };

  return (
    <div className={styles.adminActions}>
      {((canBanMembers &&
        !isViewerSelf &&
        props.clanMember.memberType < RuntimeGroupMemberType.ActingFounder &&
        canPromoteToAdmin) ||
        (props.clanMember.memberType < RuntimeGroupMemberType.Admin &&
          canChangeMembers)) && (
        <>
          <BanButton
            clanId={props.clanId}
            membershipId={props.clanMember.destinyUserInfo.membershipId}
            membershipType={props.clanMember.destinyUserInfo.membershipType}
            refreshList={() =>
              ClanMembersDataStore.actions.getMembersOfType(props.clanId, [
                props.clanMember.memberType,
              ])
            }
          />
          <KickButton
            clanId={props.clanId}
            membershipId={props.clanMember.destinyUserInfo.membershipId}
            membershipType={props.clanMember.destinyUserInfo.membershipType}
            refreshList={() =>
              ClanMembersDataStore.actions.getMembersOfType(props.clanId, [
                props.clanMember.memberType,
              ])
            }
          />
        </>
      )}
      {canChangeMemberLevels && (
        <>
          {props.clanMember.memberType > RuntimeGroupMemberType.Beginner &&
            props.clanMember.memberType <= maxPromotion && (
              <Button
                buttonType={"clear"}
                size={BasicSize.Small}
                onClick={() =>
                  demoteMember(
                    props.clanMember.destinyUserInfo.membershipId,
                    props.clanMember.destinyUserInfo.membershipType,
                    props.clanMember.memberType
                  )
                }
              >
                {clansLoc.Demote}
              </Button>
            )}
          {props.clanMember.memberType < maxPromotion && (
            <Button
              buttonType={"gold"}
              size={BasicSize.Small}
              onClick={() =>
                promoteMember(
                  props.clanMember.destinyUserInfo.membershipId,
                  props.clanMember.destinyUserInfo.membershipType,
                  props.clanMember.memberType
                )
              }
            >
              {clansLoc.Promote}
            </Button>
          )}
        </>
      )}
      {canSetAsFounder &&
        props.clanMember.memberType === RuntimeGroupMemberType.Admin && (
          <Button
            buttonType={"gold"}
            size={BasicSize.Small}
            onClick={() =>
              setAsFounder(
                props.clanMember.destinyUserInfo.membershipType,
                props.clanMember.destinyUserInfo.membershipId
              )
            }
          >
            {clansLoc.SetAsFounder}
          </Button>
        )}
    </div>
  );
};
