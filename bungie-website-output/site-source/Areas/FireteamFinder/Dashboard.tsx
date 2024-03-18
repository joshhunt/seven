// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import CharacterSelect from "@Areas/FireteamFinder/Components/Dashboard/CharacterSelect/CharacterSelect";
import LobbyStatusCard from "@Areas/FireteamFinder/Components/Dashboard/LobbyStatusCard/LobbyStatusCard";
import ScheduledListings from "@Areas/FireteamFinder/Components/Dashboard/ScheduledListings/ScheduledListings";
import { Layout } from "@Areas/FireteamFinder/Components/Layout/Layout";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { FireteamFinder, Platform } from "@Platform";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { useEffect, useState } from "react";

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const bgImage =
    "/7/ca/destiny/bgs/fireteamfinder/fireteam_finder_create_bg.jpg";
  /* Active Fireteam Lobby */
  const [currentFireteamLobby, setCurrentFireteamLobby] = useState<
    FireteamFinder.DestinyFireteamFinderLobbyResponse
  >();
  /* Active Fireteam Listing */
  const [activeFireteam, setActiveFireteam] = useState<
    FireteamFinder.DestinyFireteamFinderListing
  >();
  /* All inactive player lobbies */
  const [playerLobbies, setPlayerLobbies] = useState<
    FireteamFinder.DestinyFireteamFinderLobbyResponse[]
  >();
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);

  /* Get user's active listings. Setting current and inactive player lobbies */
  useEffect(() => {
    if (
      destinyMembership &&
      destinyMembership?.selectedCharacter?.characterId
    ) {
      Platform.FireteamfinderService.GetPlayerLobbies(
        destinyMembership.selectedMembership.membershipType,
        destinyMembership.selectedMembership.membershipId,
        destinyMembership?.selectedCharacter?.characterId,
        100,
        ""
      ).then((response) => {
        setPlayerLobbies(
          response?.lobbies?.filter(
            (itm: FireteamFinder.DestinyFireteamFinderLobbyResponse) =>
              itm?.state === 1 && itm?.listingId !== "0"
          )
        );
        setCurrentFireteamLobby(
          response?.lobbies?.find(
            (itm: FireteamFinder.DestinyFireteamFinderLobbyResponse) =>
              itm?.state === 2
          )
        );
      });
    } else {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [destinyMembership?.selectedMembership?.membershipId]);

  /* Get and set Active Fireteam listing, update when current lobby changes */
  useEffect(() => {
    if (
      currentFireteamLobby?.listingId &&
      destinyMembership &&
      destinyMembership?.selectedCharacter?.characterId
    ) {
      Platform.FireteamfinderService.GetListing(currentFireteamLobby.listingId)
        .then((r) => {
          setActiveFireteam(r);
        })
        .catch(ConvertToPlatformError)
        .catch((e) => {
          Modal.error(e);
        });
    }
  }, [
    currentFireteamLobby,
    destinyMembership?.selectedMembership?.membershipId,
  ]);

  return (
    <SystemDisabledHandler
      systems={[SystemNames.Destiny2, SystemNames.FireteamFinder]}
    >
      <Layout
        breadcrumbConfig={"dashboard"}
        buttonConfig={"dashboard"}
        title={Localizer.Fireteams.FireteamFinder}
        subtitle={Localizer.Fireteams.FindPlayersAndInviteThem}
        backgroundImage={bgImage}
        withBetaTag={true}
      >
        <CharacterSelect />
        <LobbyStatusCard activeFireteam={activeFireteam} />
        <ScheduledListings playerLobbies={playerLobbies} />
      </Layout>
    </SystemDisabledHandler>
  );
};
