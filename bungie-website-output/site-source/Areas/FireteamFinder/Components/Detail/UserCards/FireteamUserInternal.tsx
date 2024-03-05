// Created by atseng, 2023
// Copyright Bungie, Inc.

import FireteamCharacterTag from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamCharacterTag";
import styles from "@Areas/FireteamFinder/Components/Detail/UserCards/Fireteams.module.scss";
import { FireteamUserStatTags } from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUserStatTags";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { FireteamFinder, Platform, Responses } from "@Platform";
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
  fireteam: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  member: FireteamFinder.DestinyFireteamFinderPlayerId;
  //the viewer of the page is the host
  isHost: boolean;
  isSelf: boolean;
  invited: boolean;
  refreshFireteam?: () => void;
  loaded?: () => void;
  applicationId?: string;
  hideKick?: boolean;
}

const FireteamUserInternal: React.FC<FireteamUserInternalProps> = (props) => {
  const [profileResponse, setProfileResponse] = useState<
    Responses.DestinyProfileResponse
  >();
  const { loggedInUser } = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const [userHasBeenInvited, setUserHasBeenInvited] = useState(props.invited);

  const character =
    profileResponse?.characters?.data &&
    Object.values(profileResponse?.characters?.data)?.filter(
      (v) => v.characterId === props.member?.characterId
    )?.[0];
  const bungieName = UserUtils.getBungieNameFromUserInfoCard(
    profileResponse?.profile?.data?.userInfo
  );

  const getProfile = () => {
    Platform.Destiny2Service.GetProfile(
      props.member.membershipType,
      props.member.membershipId,
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
      targetBungieId: props.member?.membershipId,
      targetCharacterId: props.member?.characterId,
      targetMembershipType: props.member?.membershipType,
    };

    Platform.FireteamfinderService.KickPlayer(
      input,
      props.fireteam?.lobbyId,
      props.member?.membershipId,
      destinyMembership?.selectedMembership?.membershipType,
      destinyMembership?.selectedMembership?.membershipId,
      destinyMembership?.selectedCharacter?.characterId
    ).then((result) => {
      window.location.reload();
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

  //the usercard is the hosts card - not the viewer of the page
  const isFireteamHost =
    props.member.membershipId === props.fireteam.owner?.membershipId;

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
          <div className={styles.userButtons}>
            {!isFireteamHost && props.isHost && !props.isSelf && (
              <>
                {/*<Button buttonType={"gold"} size={BasicSize.Small} onClick={() => acceptUser()}*/}
                {/*		className={classNames(styles.btnInvite, {[styles.invited]: showInvited})}>{Localizer.fireteams.accept}</Button>*/}
                {!props.hideKick && (
                  <Button
                    buttonType={"clear"}
                    size={BasicSize.Small}
                    onClick={() => kickUser()}
                  >
                    {Localizer.fireteams.kick}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.userMeta}>
          <FireteamCharacterTag character={character} />
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
