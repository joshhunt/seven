// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { ApplicationCard } from "@Areas/FireteamFinder/Components/Detail/ApplicationCard";
import styles from "@Areas/FireteamFinder/Components/Detail/FireteamDetail.module.scss";
import FireteamSummary from "@Areas/FireteamFinder/Components/Detail/FireteamSummary";
import userStyles from "@Areas/FireteamFinder/Components/Detail/UserCards/Fireteams.module.scss";
import { FireteamUser } from "@Areas/FireteamFinder/Components/Detail/UserCards/FireteamUser";
import FireteamListingCard from "@Areas/FireteamFinder/Components/Shared/FireteamListingCard";
import { FireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { PlayerFireteamContext } from "@Areas/FireteamFinder/Detail";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, DestinyFireteamFinderLobbyState } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { FireteamFinder, Platform } from "@Platform";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";

interface FireteamDetailProps {
  isOwner: boolean;
  fireteam: FireteamFinder.DestinyFireteamFinderListing;
  lobby: FireteamFinder.DestinyFireteamFinderLobbyResponse;
}

export const FireteamDetail: React.FC<FireteamDetailProps> = ({
  isOwner,
  fireteam,
  lobby,
}) => {
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [pendingApplications, setPendingApplications] = useState<
    FireteamFinder.DestinyFireteamFinderApplication[]
  >([]);
  const isActive = lobby?.state === DestinyFireteamFinderLobbyState.Active;
  const requiresApplication =
    fireteam?.settings?.listingValues?.find(
      (listingVal) =>
        listingVal?.valueType?.toString() ===
        FireteamFinderValueTypes.applicationRequirement
    )?.values?.[0] === 1;
  const viewerIsHost =
    destinyMembership?.memberships?.findIndex(
      (membership) => membership?.membershipId === lobby?.owner?.membershipId
    ) !== -1;
  const { matchingApplication } = useContext(PlayerFireteamContext);
  const [applicationCards, setApplicationCards] = useState([]);
  const [memberCards, setMemberCards] = useState([]);

  useEffect(() => {
    async function fetchApplicationData() {
      const cards = [];

      for (const application of pendingApplications) {
        const isSelf = !!destinyMembership.memberships?.find(
          (dm) => dm.membershipId === application?.submitterId.membershipId
        );
        const response = await Platform.UserService.GetMembershipDataById(
          application?.submitterId.membershipId,
          BungieMembershipType.All
        );
        const correctMembershipType = response?.destinyMemberships?.find(
          (dm) => dm.membershipId === application?.submitterId.membershipId
        )?.membershipType;

        cards.push(
          <ApplicationCard
            key={application.applicationId}
            application={application}
            lobbyId={lobby?.lobbyId}
            memberCard={
              <FireteamUser
                key={application?.submitterId?.membershipId}
                isHost={viewerIsHost}
                invited={true}
                isSelf={isSelf}
                isActive={isActive}
                member={{
                  ...application?.submitterId,
                  membershipType: correctMembershipType,
                }}
                fireteam={lobby}
                applicationId={application?.applicationId}
              />
            }
          />
        );
      }

      setApplicationCards(cards);
    }

    fetchApplicationData();
  }, [pendingApplications.length, lobby, viewerIsHost, destinyMembership]);

  useEffect(() => {
    async function fetchMemberData() {
      const cards = [];

      for (const player of lobby?.players) {
        const isSelf = !!destinyMembership.memberships?.find(
          (dm) => dm.membershipId === player?.playerId?.membershipId
        );
        const thisPlayerIsHost =
          player?.playerId?.membershipId === lobby?.owner?.membershipId;
        let correctMembershipType = BungieMembershipType.All;

        if (thisPlayerIsHost && viewerIsHost) {
          correctMembershipType =
            destinyMembership?.selectedMembership?.membershipType;
        } else {
          const response = await Platform.UserService.GetMembershipDataById(
            player?.playerId?.membershipId,
            BungieMembershipType.All
          );
          correctMembershipType = response?.destinyMemberships?.find(
            (dm) => dm.membershipId === player?.playerId?.membershipId
          )?.membershipType;
        }

        cards.push(
          <FireteamUser
            key={player?.playerId?.membershipId}
            isHost={viewerIsHost}
            invited={
              player?.playerId?.membershipId !== lobby?.owner?.membershipId
            }
            isSelf={isSelf}
            isActive={isActive}
            member={{
              ...player.playerId,
              membershipType: correctMembershipType,
            }}
            fireteam={lobby}
          />
        );
      }

      setMemberCards(cards);
    }

    fetchMemberData();
  }, [lobby, viewerIsHost, destinyMembership]);
  const availableSlots = (availableNumSlots: number) => {
    const slots = [];

    for (let i = 0; i < availableNumSlots; i++) {
      if (viewerIsHost) {
        slots.push(
          <div
            key={i}
            className={classNames(userStyles.emptyUser, userStyles.user)}
          >
            {Localizer.fireteams.WaitingForMemberToJoin}
          </div>
        );
      } else {
        slots.push(
          <div
            key={i}
            className={classNames(userStyles.emptyUser, userStyles.user)}
          >
            {Localizer.fireteams.AvailableSlot}
          </div>
        );
      }
    }

    return slots.length ? slots : null;
  };

  useEffect(() => {
    FireteamsDestinyMembershipDataStore.actions.loadUserData();
  }, [UserUtils.isAuthenticated(globalState)]);

  useEffect(() => {
    Platform.FireteamfinderService.GetListingApplications(
      fireteam?.listingId,
      destinyMembership?.selectedMembership?.membershipType,
      destinyMembership?.selectedMembership?.membershipId,
      destinyMembership?.selectedCharacter?.characterId,
      100,
      "",
      "0"
    ).then((result) => {
      // this will exclude accepted and declined applications, only those waiting on owner to accept or decline will show
      setPendingApplications(
        result?.applications.filter((app) => app?.state === 2)
      );

      // should add button to get next page of applications
    });
  }, [fireteam?.listingId]);

  return (
    <div className={styles.container}>
      {!isActive && isOwner && (
        <div className={styles.helpText}>
          {Localizer.fireteams.activatehelptext}
        </div>
      )}
      {requiresApplication &&
        !isOwner &&
        !(matchingApplication?.listingId === lobby?.listingId) && (
          <div className={styles.helpText}>
            {Localizer.fireteams.FireteamRequiresApplication}
          </div>
        )}
      {requiresApplication &&
        !isOwner &&
        matchingApplication?.listingId === lobby?.listingId && (
          <div className={classNames(styles.helpText)}>
            {Localizer.fireteams.ApplicationSubmittedToast}
          </div>
        )}
      <FireteamListingCard fireteam={fireteam} largeActivityName={true} />
      <div className={styles.membersAndSummaryContainer}>
        <div className={styles.members}>
          <h4>{Localizer.fireteams.Members.toUpperCase()}</h4>
          {memberCards}
          {availableSlots(fireteam?.availableSlots)}
        </div>
        <div className={styles.summary}>
          {isOwner && pendingApplications && pendingApplications.length > 0 && (
            <div>
              <h4>{Localizer.Fireteams.PendingApplications}</h4>
              {applicationCards}
            </div>
          )}
          <h4>{Localizer.fireteams.ExtraInfo.toUpperCase()}</h4>
          <FireteamSummary fireteam={fireteam} />
        </div>
      </div>
    </div>
  );
};
