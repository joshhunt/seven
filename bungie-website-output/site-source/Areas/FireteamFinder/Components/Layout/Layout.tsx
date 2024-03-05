// Created by atseng, 2023
// Copyright Bungie, Inc.

import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { Platform, Responses } from "@Platform";
import React, { useState } from "react";
import { UserUtils } from "@Utilities/UserUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import {
  BreadcrumbConfiguration,
  FireteamFinderBreadcrumb,
} from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { Header } from "./Header";
import { ButtonConfiguration } from "./HeaderButtons";
import { LoggedOutView } from "@Areas/FireteamFinder/Components/Layout/LoggedOutView";
import styles from "./Layout.module.scss";

export type FireteamFinderErrorViewType =
  | "SignedOut"
  | "NoCharacter"
  | "NotGuardianRankFive"
  | "None";

interface LayoutProps {
  buttonConfig: ButtonConfiguration;
  breadcrumbConfig: BreadcrumbConfiguration;
  title: string;
  subtitle: string;
  backgroundImage: string;
  withBetaTag?: boolean;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [errorState, setErrorState] = useState<FireteamFinderErrorViewType>(
    "None"
  );
  const [profileResponse, setProfileResponse] = React.useState<
    Responses.DestinyProfileResponse
  >();
  const loggedIn = UserUtils.isAuthenticated(globalState);
  const destinyData = useDataStore(FireteamsDestinyMembershipDataStore);

  const loadDestinyMembership = () => {
    if (loggedIn) {
      const membershipPair = {
        membershipId: globalState.loggedInUser.user.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      };

      FireteamsDestinyMembershipDataStore.actions.loadUserData(
        membershipPair,
        true
      );
    }
  };
  const getProfileResponse = () => {
    Platform.Destiny2Service.GetProfile(
      destinyData?.selectedMembership?.membershipType,
      destinyData?.selectedMembership?.membershipId,
      [
        DestinyComponentType.Characters,
        DestinyComponentType.SocialCommendations,
        DestinyComponentType.Profiles,
      ]
    ).then((result) => {
      if (result.profile.data.characterIds.length === 0) {
        setErrorState("NoCharacter");
      } else if (result.profile.data?.lifetimeHighestGuardianRank < 5) {
        setErrorState("NotGuardianRankFive");
        setProfileResponse(result);
      } else {
        setErrorState("None");
      }
    });
  };

  React.useEffect(() => loadDestinyMembership(), [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      if (
        destinyData?.selectedMembership?.membershipType &&
        destinyData?.selectedMembership?.membershipId
      ) {
        getProfileResponse();
      } else if (destinyData.loaded && !destinyData.selectedMembership) {
        setErrorState("NoCharacter");
      } else {
        loadDestinyMembership();
      }
    } else {
      setErrorState("SignedOut");
    }
  }, [
    destinyData?.loaded,
    loggedIn,
    destinyData?.selectedMembership?.membershipType,
    destinyData?.selectedMembership?.membershipId,
  ]);

  return (
    <div
      className={styles.layout}
      style={{ backgroundImage: `url(${props.backgroundImage})` }}
    >
      <BungieHelmet
        title={fireteamsLoc.Fireteams}
        description={fireteamsLoc.Fireteams}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      {/*
			At least for now, the decision has been made to not include the Oath component in the bnet version of fireteam finder because whether a user has signed it or not in the game is not exposed to the web.
			<Oath />
			*/}
      {errorState === "None" ? (
        <Grid isTextContainer={true}>
          <GridCol cols={12} className={styles.content}>
            <Header
              breadcrumbConfiguration={props.breadcrumbConfig}
              buttonConfiguration={props.buttonConfig}
              title={props.title}
              subtitle={props.subtitle}
              isLoggedIn={UserUtils.isAuthenticated(globalState)}
              withBetaTag={props.withBetaTag}
            />
            {props.children}
          </GridCol>
        </Grid>
      ) : (
        <LoggedOutView errorType={errorState} className={styles.content} />
      )}
    </div>
  );
};
