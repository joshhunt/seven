// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { FireteamDetail } from "@Areas/FireteamFinder/Components/Detail/FireteamDetail";
import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import { FireteamFinderRealTimeEventsDataStore } from "@Areas/FireteamFinder/DataStores/FireteamFinderRealTimeEventsDataStore";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RealTimeEventType } from "@Enum";
import { FireteamFinder, Notifications, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IFireteamFinderParams } from "@Routes/Definitions/RouteParams";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./Detail.module.scss";

interface DetailProps {}

export interface IMatchingApplication {
  listingId: string;
  applicationId: string;
}

export const PlayerFireteamContext = React.createContext<PlayerFireteamData>({
  fireteamLobby: null,
  fireteamListing: null,
  matchingApplication: null,
});

export const PlayerFireteamDispatchContext = React.createContext<
  PlayerFireteamDispatch
>({
  updateLobby: null,
  updateListing: null,
  updateMatchingApplication: null,
});

interface PlayerFireteamData {
  fireteamLobby: FireteamFinder.DestinyFireteamFinderLobbyResponse;
  fireteamListing: FireteamFinder.DestinyFireteamFinderListing;
  matchingApplication: {
    listingId: string;
    applicationId: string;
  };
}

interface PlayerFireteamDispatch {
  updateLobby: React.Dispatch<
    React.SetStateAction<FireteamFinder.DestinyFireteamFinderLobbyResponse>
  >;
  updateListing: React.Dispatch<
    React.SetStateAction<FireteamFinder.DestinyFireteamFinderListing>
  >;
  updateMatchingApplication: React.Dispatch<
    React.SetStateAction<IMatchingApplication>
  >;
}

export const Detail: React.FC<DetailProps> = (props) => {
  const { lobbyId } = useParams<IFireteamFinderParams>();
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const fireteamFinderUpdate = useDataStore(
    FireteamFinderRealTimeEventsDataStore
  );
  const [fireteam, setFireteam] = useState<
    FireteamFinder.DestinyFireteamFinderListing
  >(null);
  const [lobby, setLobby] = useState<
    FireteamFinder.DestinyFireteamFinderLobbyResponse
  >(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isFireteamMember, setIsFireteamMember] = useState<boolean>(isOwner);
  const [matchingApplication, setMatchingApplication] = useState<
    IMatchingApplication
  >(null);

  const FireteamNotFound = () => (
    <div
      style={{
        margin: "2rem auto",
        display: "flex",
        justifyContent: "center" + "",
      }}
    >
      <Button
        url={RouteHelper.FireteamFinder()}
        buttonType={"gold"}
        size={BasicSize.Small}
      >
        {Localizer.fireteams.ReturnToDashboard}
      </Button>
    </div>
  );

  useEffect(() => {
    if (fireteamFinderUpdate?.eventData?.events) {
      if (
        !destinyMembership?.selectedMembership?.membershipId ||
        !destinyMembership?.selectedMembership?.membershipType
      ) {
        FireteamsDestinyMembershipDataStore.actions.loadUserData();
      } else {
        // We only need to know if any of the real time events are for this lobby since we will be fetching the lobby data which will update anything that changed
        const foundUpdateForCurrentLobby = fireteamFinderUpdate.eventData.events.find(
          (e: Notifications.RealTimeEventData) =>
            e.eventType === RealTimeEventType.FireteamFinderUpdate &&
            e.fireteamFinderLobbyId === lobbyId
        );

        if (foundUpdateForCurrentLobby) {
          Platform.FireteamfinderService.GetLobby(
            lobbyId,
            destinyMembership?.selectedMembership?.membershipType,
            destinyMembership?.selectedMembership?.membershipId,
            destinyMembership?.selectedCharacter?.membershipId
          )
            .then((response) => {
              setLobby(response);
              const owner = !!destinyMembership?.memberships?.find(
                (membership) =>
                  membership.membershipId === response.owner.membershipId
              );
              setIsOwner(owner);

              Platform.FireteamfinderService.GetListing(
                response?.listingId
              ).then((listing) => setFireteam(listing));
            })
            .finally(() => {
              FireteamFinderRealTimeEventsDataStore.actions.clearEventData();
            });
        }
      }
    }
  }, [destinyMembership, fireteamFinderUpdate, lobbyId]);

  useEffect(() => {
    if (lobbyId) {
      const checkAllPlayerApplicationsForMatch = () => {
        Platform.FireteamfinderService.GetPlayerApplications(
          destinyMembership?.selectedMembership?.membershipType,
          destinyMembership?.selectedMembership?.membershipId,
          destinyMembership?.selectedCharacter?.characterId,
          500,
          ""
        )
          .then((result) => {
            if (result.applications?.length > 0) {
              const matchApplication = result.applications?.find((app) => {
                return (
                  app.applicantSet?.applicants?.findIndex(
                    (applicant) =>
                      applicant.playerId.membershipId ===
                      destinyMembership?.selectedMembership?.membershipId
                  ) !== -1
                );
              });

              if (matchApplication) {
                setMatchingApplication({
                  listingId: matchApplication?.listingId,
                  applicationId: matchApplication?.applicationId,
                });
              } else {
                setMatchingApplication(null);
              }
            }
          })
          .catch(ConvertToPlatformError)
          .catch((e) => {
            Modal.error(e);
          });
      };

      const checkAllPlayerLobbiesForMatch = () => {
        Platform.FireteamfinderService.GetPlayerLobbies(
          destinyMembership?.selectedMembership?.membershipType,
          destinyMembership?.selectedMembership?.membershipId,
          destinyMembership?.selectedCharacter?.characterId,
          500,
          ""
        )
          .then((result) => {
            if (result.lobbies?.length > 0) {
              const matchingLobby = result.lobbies?.find(
                (option: FireteamFinder.DestinyFireteamFinderLobbyResponse) => {
                  return option?.lobbyId === lobbyId;
                }
              );

              if (matchingLobby) {
                setIsFireteamMember(true);
              }
            }
          })
          .catch(ConvertToPlatformError)
          .catch((e) => {
            Modal.error(e);
          });
      };

      if (
        !destinyMembership?.selectedMembership?.membershipId ||
        !destinyMembership?.selectedMembership?.membershipType
      ) {
        FireteamsDestinyMembershipDataStore.actions.loadUserData();
      } else {
        checkAllPlayerApplicationsForMatch();
        checkAllPlayerLobbiesForMatch();
        Platform.FireteamfinderService.GetLobby(
          lobbyId,
          destinyMembership.selectedMembership.membershipType,
          destinyMembership.selectedMembership.membershipId,
          destinyMembership?.selectedCharacter?.membershipId
        ).then((response) => {
          setLobby(response);
          const owner = !!destinyMembership?.memberships?.find(
            (membership) =>
              membership.membershipId === response.owner.membershipId
          );
          setIsOwner(owner);

          Platform.FireteamfinderService.GetListing(
            response?.listingId
          ).then((listing) => setFireteam(listing));
        });
      }
    }
  }, [lobbyId, destinyMembership]);

  const getButtonConfig = () => {
    if (!fireteam) {
      return "none";
    }
    if (isOwner) {
      return "admin";
    } else if (isFireteamMember) {
      return "member";
    } else if (!!matchingApplication) {
      return "detail-applied";
    } else {
      return "detail";
    }
  };

  return (
    <PlayerFireteamContext.Provider
      value={{
        fireteamLobby: lobby,
        fireteamListing: fireteam,
        matchingApplication,
      }}
    >
      <PlayerFireteamDispatchContext.Provider
        value={{
          updateLobby: setLobby,
          updateListing: setFireteam,
          updateMatchingApplication: setMatchingApplication,
        }}
      >
        <Layout
          breadcrumbConfig={isOwner ? "admin" : "detail"}
          buttonConfig={getButtonConfig()}
          title={Localizer.Fireteams.FireteamDetails}
          subtitle={Localizer.Fireteams.FindPlayersAndInviteThem}
          className={styles.background}
        >
          {fireteam ? (
            <FireteamDetail
              isOwner={isOwner}
              fireteam={fireteam}
              lobby={lobby}
            />
          ) : (
            <FireteamNotFound />
          )}
        </Layout>
      </PlayerFireteamDispatchContext.Provider>
    </PlayerFireteamContext.Provider>
  );
};
