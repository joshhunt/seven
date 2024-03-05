// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, MembershipOption } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";

interface JoinButtonProps {
  clanId: string;
  potentialMemberMap: {
    [K in EnumStrings<
      typeof BungieMembershipType
    >]?: GroupsV2.GroupPotentialMember;
  };
  membershipMap: {
    [K in EnumStrings<typeof BungieMembershipType>]?: GroupsV2.GroupMember;
  };
  membershipOption: MembershipOption;
  callback?: () => void;
}

export const JoinButton: React.FC<JoinButtonProps> = (props) => {
  if (props.membershipOption === MembershipOption.Closed) {
    return null;
  }

  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const destinyMembership = useDataStore(ClanDestinyMembershipDataStore);
  const clansLoc = Localizer.Clans;

  const isCrossSaved = !!globalState.crossSavePairingStatus
    ?.primaryMembershipType;
  const multiplePlatformsCanJoin =
    !isCrossSaved && destinyMembership?.memberships?.length > 1;

  const joinClan = (membershipType: BungieMembershipType) => {
    const applicationRequest: GroupsV2.GroupApplicationRequest = {
      message: "",
    };

    //join
    Platform.GroupV2Service.RequestGroupMembership(
      applicationRequest,
      props.clanId,
      membershipType
    )
      .then(() => {
        //join success
        props.callback && props.callback();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  const signInToJoin = () => {
    //show the auth
    const signInModal = Modal.signIn(() => {
      ClanDestinyMembershipDataStore.actions.loadUserData();
      console.log("called in join");

      signInModal.current.close();
    });
  };

  if (!UserUtils.isAuthenticated(globalState)) {
    return (
      <Button
        size={BasicSize.Medium}
        buttonType={"gold"}
        onClick={() => signInToJoin()}
      >
        {clansLoc.JoinClan}
      </Button>
    );
  }

  return (
    <>
      {destinyMembership.memberships.map((m) => {
        if (
          Object.values(props.potentialMemberMap).find(
            (pm) => pm.destinyUserInfo.membershipType === m.membershipType
          )
        ) {
          //this membershipType has a pending membership
          return null;
        }

        if (
          Object.values(props.membershipMap).find(
            (mm) => mm.destinyUserInfo.membershipType === m.membershipType
          )
        ) {
          //this membershipType has a membership
          return null;
        }

        const isStadiaPrimaryCrossSave =
          globalState?.crossSavePairingStatus?.primaryMembershipType ===
          BungieMembershipType.TigerStadia;

        if (
          m.membershipType === BungieMembershipType.TigerStadia &&
          !isStadiaPrimaryCrossSave
        ) {
          //Stadia membershipType but its not the primary cross save account
          return null;
        }

        return (
          <Button
            key={m.membershipType}
            size={BasicSize.Medium}
            buttonType={"gold"}
            onClick={() => joinClan(m.membershipType)}
          >
            {multiplePlatformsCanJoin
              ? Localizer.Format(clansLoc.JoinClanOnPlatform, {
                  platform:
                    Localizer.Platforms[
                      EnumUtils.getStringValue(
                        m.membershipType,
                        BungieMembershipType
                      )
                    ],
                })
              : clansLoc.JoinClan}
          </Button>
        );
      })}
    </>
  );
};
