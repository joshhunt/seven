// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Fireteams/Fireteam.module.scss";
import FireteamCharacterTag from "@Areas/Fireteams/Shared/FireteamCharacterTag";
import { FireteamUserStatTags } from "@Areas/Fireteams/Shared/FireteamUserStatTags";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { Fireteam, Platform, Responses } from "@Platform";
import { AiOutlineCheck } from "@react-icons/all-files/ai/AiOutlineCheck";
import { BsFillMicFill } from "@react-icons/all-files/bs/BsFillMicFill";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface FireteamUserInternalProps
  extends D2DatabaseComponentProps<"DestinyInventoryItemLiteDefinition"> {
  fireteam: Fireteam.FireteamSummary;
  member: Fireteam.FireteamMember;
  //the viewer of the page is the host
  isHost: boolean;
  isAdmin: boolean;
  isSelf: boolean;
  invited: boolean;
  refreshFireteam?: () => void;
  loaded?: () => void;
}

const FireteamUserInternal: React.FC<FireteamUserInternalProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();

  const [userHasBeenInvited, setUserHasBeenInvited] = useState(props.invited);

  const character =
    profileResponse?.characters?.data &&
    Object.values(profileResponse?.characters?.data)?.filter(
      (v) => v.characterId === props.member?.characterId
    )?.[0];

  if (!props.fireteam) {
    return null;
  }

  const getProfile = () => {
    Platform.Destiny2Service.GetProfile(
      props.member.destinyUserInfo.membershipType,
      props.member.destinyUserInfo.membershipId,
      [
        DestinyComponentType.Characters,
        DestinyComponentType.SocialCommendations,
        DestinyComponentType.Profiles,
      ]
    ).then((result) => {
      setProfileResponse(result);
      props.loaded();
    });
  };

  const kickUser = (isPermanent: boolean) => {
    Platform.FireteamService.KickFromClanFireteam(
      props.fireteam.groupId,
      props.fireteam.fireteamId,
      props.member.destinyUserInfo.membershipId,
      isPermanent
    ).then((result) => {
      props.refreshFireteam();
      //removed
    });
  };

  const inviteUser = () => {
    Platform.FireteamService.IndividualInviteToDestiny2Fireteam(
      props.fireteam.groupId,
      props.fireteam.fireteamId,
      props.member.destinyUserInfo.membershipId
    ).then((result) => {
      setUserHasBeenInvited(true);

      props.refreshFireteam();
    });
  };

  useEffect(() => {
    getProfile();
  }, [props.member]);

  useEffect(() => {
    setUserHasBeenInvited(props.invited);
  }, [props.invited]);

  const emblemDef = props.definitions.DestinyInventoryItemLiteDefinition.get(
    character?.emblemHash
  );
  const bungieName = UserUtils.getBungieNameFromBnetFireteamMember(
    props.member
  );

  //the usercard is the hosts card - not the viewer of the page
  const isFireteamHost =
    props.member.destinyUserInfo.membershipId ===
    props.fireteam.ownerMembershipId;

  const showInvited = props.isHost && !isFireteamHost && userHasBeenInvited;

  return (
    <div
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
                  mid: props.member.destinyUserInfo.membershipId,
                  mtype: EnumUtils.getNumberValue(
                    props.member.destinyUserInfo.membershipType,
                    BungieMembershipType
                  ).toString(),
                }).url;
            }}
            url={RouteHelper.NewProfile({
              mid: props.member.destinyUserInfo.membershipId,
              mtype: EnumUtils.getNumberValue(
                props.member.destinyUserInfo.membershipType,
                BungieMembershipType
              ).toString(),
            })}
          >
            {bungieName.bungieGlobalName}
            <span>{bungieName.bungieGlobalCodeWithHashtag}</span>
          </Anchor>
          {props.member?.hasMicrophone && (
            <div className={styles.mic}>
              <BsFillMicFill />
              {fireteamsLoc.HasMic}
            </div>
          )}
          <div className={styles.userButtons}>
            {!isFireteamHost && props.isHost && !props.isSelf && (
              <>
                <Button
                  buttonType={"gold"}
                  size={BasicSize.Small}
                  onClick={() => inviteUser()}
                  className={classNames(styles.btnInvite, {
                    [styles.invited]: showInvited,
                  })}
                >
                  {showInvited && <AiOutlineCheck />}
                  {showInvited ? fireteamsLoc.InviteSent : fireteamsLoc.Invite}
                </Button>
                <Button
                  buttonType={"clear"}
                  size={BasicSize.Small}
                  onClick={() => kickUser(false)}
                >
                  {fireteamsLoc.Kick}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className={styles.userMeta}>
          <FireteamCharacterTag character={character} />
          <FireteamUserStatTags
            mid={props.member.destinyUserInfo.membershipId}
            mtype={props.member.destinyUserInfo.membershipType}
          />
        </div>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(FireteamUserInternal, {
  types: ["DestinyInventoryItemLiteDefinition"],
});
