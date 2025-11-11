// Created by atseng, 2023
// Copyright Bungie, Inc.

import { PlayerInteractionModal } from "@Areas/FireteamFinder/Components/Detail/Modals/PlayerInteractionModal";
import FireteamCharacterTag from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamCharacterTag";
import styles from "@Areas/FireteamFinder/Components/Detail/UserCards/Fireteams.module.scss";
import { FireteamUserStatTags } from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUserStatTags";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  BungieMembershipType,
  DestinyComponentType,
  DestinyItemType,
} from "@Enum";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { FireteamFinder, Platform, Responses } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Toast } from "@UIKit/Controls/Toast/Toast";
import { DestinyConstants } from "@Utilities/DestinyConstants";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface FireteamUserInternalProps
  extends D2DatabaseComponentProps<"DestinyInventoryItemLiteDefinition"> {
  fireteam: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  member: FireteamFinder.DestinyFireteamFinderPlayerId;
  //the viewer of the page is the host
  isHost: boolean;
  isSelf: boolean;
  invited: boolean;
  isActive: boolean;
  refreshFireteam?: () => void;
  loaded?: () => void;
  applicationId?: string;
  hideKick?: boolean;
}

const FireteamUserInternal: React.FC<FireteamUserInternalProps> = (props) => {
  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();
  const { destinyData } = useGameData();

  const character =
    profileResponse?.characters?.data &&
    Object.values(profileResponse?.characters?.data)?.filter(
      (v) => v.characterId === props.member?.characterId
    )?.[0];
  const bungieName = UserUtils.getBungieNameFromUserInfoCard(
    profileResponse?.profile?.data?.userInfo
  );
  //the usercard is the hosts card - not the viewer of the page
  const isFireteamHost =
    props.member.membershipId === props.fireteam.owner?.membershipId;
  const showInvite = !isFireteamHost && props.isHost && props.isActive;
  const showKick = !isFireteamHost && props.isHost && !props.isSelf;
  const getProfile = () => {
    Platform.Destiny2Service.GetProfile(
      props.member.membershipType,
      props.member.membershipId,
      [
        DestinyComponentType.Characters,
        DestinyComponentType.SocialCommendations,
        DestinyComponentType.Profiles,
        DestinyComponentType.CharacterEquipment,
      ]
    ).then((result) => {
      setProfileResponse(result);
      props.loaded();
    });
  };

  const acceptUser = () => {
    Platform.FireteamfinderService.RespondToApplication(
      {
        accepted: true,
      },
      props.applicationId,
      props.member?.membershipType,
      props.member?.membershipId,
      props.member?.characterId
    ).then((result) => {
      window.location.reload();
    });
  };

  const kickUser = () => {
    const input = {
      targetCharacterId: props.member?.characterId,
      targetMembershipType: props.member?.membershipType,
    };

    Platform.FireteamfinderService.KickPlayer(
      input,
      props.fireteam?.lobbyId,
      props.member?.membershipId,
      destinyData?.selectedMembership?.membershipType,
      destinyData?.selectedMembership?.membershipId,
      destinyData?.selectedCharacterId
    ).then((result) => {
      window.location.reload();
    });
  };

  const showBnetProfile = () => {
    window.location.href =
      "/7" +
      RouteHelper.NewProfile({
        mid: props.member.membershipId,
        mtype: EnumUtils.getNumberValue(
          props.member.membershipType,
          BungieMembershipType
        ).toString(),
      }).url;
  };

  const inviteToInGameFireteam = () => {
    const invitedPlayer = profileResponse.profile.data.userInfo;

    Platform.FireteamfinderService.FireteamFinderNetworkSessionInvite(
      props.fireteam.lobbyId,
      props.fireteam.owner.membershipType,
      props.fireteam.owner.characterId,
      invitedPlayer.membershipType,
      invitedPlayer.membershipId
    ).then((successfulInvite) => {
      if (successfulInvite) {
        return Toast.show(Localizer.fireteams.InviteSent, {
          position: "br",
          type: "success",
        });
      }

      return Toast.show(Localizer.fireteams.MyInviteIsnTWorking, {
        position: "br",
        type: "error",
      });
    });
  };

  useEffect(() => {
    props.member && props.fireteam && getProfile();
  }, [props.member]);

  if (!props.fireteam) {
    return null;
  }

  const emblemDef = props.definitions.DestinyInventoryItemLiteDefinition.get(
    character?.emblemHash
  );

  const subclassItem = profileResponse?.characterEquipment?.data?.[
    character?.characterId
  ]?.items?.filter((item) => {
    const itemDef = props.definitions.DestinyInventoryItemLiteDefinition.get(
      item.itemHash
    );

    return (
      itemDef?.itemType === DestinyItemType.Subclass ||
      itemDef?.inventory?.bucketTypeHash === DestinyConstants.SubclassBucketHash
    );
  })?.[0];

  const subclassDefinition = subclassItem
    ? props.definitions.DestinyInventoryItemLiteDefinition.get(
        subclassItem.itemHash
      )
    : null;
  const showPlayerInteractionModal = () => {
    return Modal.open(
      <PlayerInteractionModal
        userNameProps={{
          playerHash: bungieName.bungieGlobalCodeWithHashtag,
          avatarURL:
            destinyData.membershipData?.destinyMemberships?.[0]?.iconPath,
          platform:
            Localizer.Platforms[
              EnumUtils.getStringValue(
                props.member?.membershipType,
                BungieMembershipType
              )
            ],
          name: bungieName.bungieGlobalName,
        }}
        userActionProps={{
          bnetProfile: showBnetProfile,
          kickPlayer: showKick ? kickUser : null,
          invite: showInvite ? inviteToInGameFireteam : null,
        }}
      />
    );
  };

  return (
    <div
      onClick={showPlayerInteractionModal}
      className={classNames(styles.userCard, styles.user, {
        [styles.emptyUser]: !profileResponse,
      })}
      style={{ backgroundImage: `url(${emblemDef?.secondarySpecial})` }}
    >
      <div
        className={styles.userAvatar}
        style={{ backgroundImage: `url(${character?.emblemPath})` }}
      />
      <div className={styles.userContent}>
        <div className={styles.userName}>
          <Anchor
            onClick={(e) => {
              e.preventDefault();

              //this way the modal closes
              window.location.href =
                "/7" +
                RouteHelper.NewProfile({
                  mid: props.member.membershipId,
                  mtype: EnumUtils.getNumberValue(
                    props.member.membershipType,
                    BungieMembershipType
                  ).toString(),
                }).url;
            }}
            url={RouteHelper.NewProfile({
              mid: props.member.membershipId,
              mtype: EnumUtils.getNumberValue(
                props.member.membershipType,
                BungieMembershipType
              ).toString(),
            })}
          >
            {bungieName.bungieGlobalName}
            <span>{bungieName.bungieGlobalCodeWithHashtag}</span>
          </Anchor>
        </div>
        <div className={styles.userMeta}>
          <FireteamCharacterTag
            character={character}
            subclassDefinition={subclassDefinition}
          />
          <FireteamUserStatTags
            mid={props.member.membershipId}
            mtype={props.member.membershipType}
          />
        </div>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(FireteamUserInternal, {
  types: ["DestinyInventoryItemLiteDefinition"],
});
