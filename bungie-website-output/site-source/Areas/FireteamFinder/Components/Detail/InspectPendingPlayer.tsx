// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FireteamUser } from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUser";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { FireteamFinder, Platform } from "@Platform";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import React, { useEffect, useState } from "react";
import styles from "./InspectPendingPlayer.module.scss";

interface InspectPendingPlayerProps {
  memberCard: React.ReactNode;
  memberHasJoined: boolean;
  applicationId: string;
  lobbyId: string;
}

export const InspectPendingPlayer: React.FC<InspectPendingPlayerProps> = (
  props
) => {
  const title = props.memberHasJoined
    ? Localizer.fireteams.pendingmember
    : Localizer.fireteams.PendingApplication;
  const rejectText = props.memberHasJoined
    ? Localizer.fireteams.kickuser
    : Localizer.fireteams.Decline;
  const blockText = props.memberHasJoined
    ? Localizer.fireteams.kickandblockuser
    : Localizer.fireteams.DeclineAndBlock;
  const [fireteamLobby, setFireteamLobby] = useState<
    FireteamFinder.DestinyFireteamFinderLobbyResponse
  >(null);
  const destinyData = useDataStore(FireteamsDestinyMembershipDataStore);

  useEffect(() => {
    // Refresh the fireteam
    if (!fireteamLobby) {
      // Get the fireteam lobby because we are in a modal right now so we are not in the hierarchy of the Detail element

      Platform.FireteamfinderService.GetLobby(
        props.lobbyId,
        destinyData?.selectedMembership?.membershipType,
        destinyData?.selectedMembership?.membershipId,
        destinyData?.selectedCharacter?.characterId
      )
        .then((lobby) => {
          setFireteamLobby(lobby);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => console.error(e));
    }
  }, []);
  const approveApplication = () => {
    // Approve the application
    Platform.FireteamfinderService.RespondToApplication(
      {
        accepted: true,
      },
      props.applicationId,
      destinyData?.selectedMembership?.membershipType,
      destinyData?.selectedMembership?.membershipId,
      destinyData?.selectedCharacter?.characterId
    )
      .then(() => {
        window.location.reload();
      })
      .catch(ConvertToPlatformError)
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>
        {Localizer.fireteams.ApplicationResponseSubtitle}
      </div>
      {props.memberCard}
      <div className={styles.buttons}>
        {!props.memberHasJoined && (
          <Button buttonType={"gold"} onClick={approveApplication}>
            {Localizer.fireteams.acceptbutton}
          </Button>
        )}
        <Button buttonType={"white"}>{Localizer.fireteams.ViewProfile}</Button>
        <hr />
        <Button buttonType={"white"}>{rejectText}</Button>
        <Button buttonType={"red"}>{blockText}</Button>
      </div>
    </>
  );
};
