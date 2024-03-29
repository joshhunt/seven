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
import {
  PlayerFireteamContext,
  PlayerFireteamDispatchContext,
} from "@Areas/FireteamFinder/Detail";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { FireteamFinder, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
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
  const { updateMatchingApplication } = useContext(
    PlayerFireteamDispatchContext
  );
  const { matchingApplication } = useContext(PlayerFireteamContext);
  const [refresh, setRefresh] = useState(false);
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
          <FireteamUser
            member={lobby?.owner}
            isHost={isOwner}
            fireteam={lobby}
            refreshFireteam={() => setRefresh((x) => !x)}
            invited={false}
            isSelf={viewerIsHost}
          />
          {lobby?.players
            .filter(
              (m) => m.playerId.membershipId !== lobby?.owner.membershipId
            )
            .map((member) => {
              const isSelf = !!destinyMembership.memberships?.find(
                (dm) => dm.membershipId === member.playerId.membershipId
              );

              return (
                <FireteamUser
                  key={member.playerId.membershipId}
                  isHost={viewerIsHost}
                  invited={true}
                  isSelf={isSelf}
                  member={member.playerId}
                  refreshFireteam={() => setRefresh((x) => !x)}
                  fireteam={lobby}
                />
              );
            })}
          {availableSlots(fireteam?.availableSlots)}
          <br />
          {isOwner && pendingApplications && pendingApplications.length > 0 && (
            <div>
              <h4>{Localizer.Fireteams.PendingApplications}</h4>
              {pendingApplications.map((application) => {
                const isSelf = !!destinyMembership.memberships?.find(
                  (dm) =>
                    dm.membershipId === application?.submitterId.membershipId
                );

                return (
                  <ApplicationCard
                    key={lobby?.lobbyId}
                    application={application}
                    lobbyId={lobby?.lobbyId}
                    memberCard={
                      <FireteamUser
                        key={application?.submitterId?.membershipId}
                        isHost={viewerIsHost}
                        invited={true}
                        isSelf={isSelf}
                        member={application?.submitterId}
                        refreshFireteam={null}
                        fireteam={lobby}
                        hideKick={true}
                      />
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.summary}>
          <h4>{Localizer.fireteams.ExtraInfo.toUpperCase()}</h4>
          <FireteamSummary fireteam={fireteam} />
        </div>
      </div>
    </div>
  );
};
