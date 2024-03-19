// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { LoggedOutView } from "@Areas/FireteamFinder/Components/Layout/LoggedOutView";
import { BreadcrumbConfiguration } from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { FireteamLegacyExperienceButton } from "@Areas/FireteamFinder/Components/Shared/FireteamLegacyExperienceButton";
import SelectActivity from "@Areas/FireteamFinder/Components/Shared/SelectActivity";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform, Responses } from "@Platform";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Spinner, SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useState,
} from "react";
import { Header } from "./Header";
import { ButtonConfiguration } from "./HeaderButtons";
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
  activityFilterString?: string;
  setActivityFilterString?: (value: string) => void;
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
  const [destinyMemberships, setDestinyMemberships] = React.useState<
    GroupsV2.GroupUserInfoCard[]
  >();
  const loggedIn = UserUtils.isAuthenticated(globalState);
  const destinyData = useDataStore(FireteamsDestinyMembershipDataStore);
  const { activityFilterString, setActivityFilterString } = props;
  const [destinyDataLoaded, setDestinyDataLoaded] = useState(false);

  const loadDestinyMembership = () => {
    Platform?.UserService?.GetMembershipDataById(
      globalState.loggedInUser.user.membershipId,
      BungieMembershipType.BungieNext
    )
      .then((result) => {
        if (result.destinyMemberships?.length > 0) {
          setDestinyMemberships(result?.destinyMemberships);
          getProfileResponse(
            result?.destinyMemberships[0].membershipType,
            result?.destinyMemberships[0].membershipId
          );
          FireteamsDestinyMembershipDataStore.actions.loadUserData({
            membershipId: result?.destinyMemberships[0].membershipId,
            membershipType: result?.destinyMemberships[0].membershipType,
          });
        } else {
          setErrorState("NoCharacter");
          setDestinyDataLoaded(true);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      });
  };
  const getProfileResponse = (
    membershipType: BungieMembershipType,
    membershipId: string
  ) => {
    Platform.Destiny2Service.GetProfile(membershipType, membershipId, [
      DestinyComponentType.Characters,
      DestinyComponentType.SocialCommendations,
      DestinyComponentType.Profiles,
    ])
      .then((result) => {
        if (
          result.profile.data.characterIds.length === 0 ||
          result.profile?.data?.userInfo?.applicableMembershipTypes?.length ===
            0
        ) {
          setErrorState("NoCharacter");
          setDestinyDataLoaded(true);
        } else if (result.profile.data?.lifetimeHighestGuardianRank < 5) {
          setErrorState("NotGuardianRankFive");
          setDestinyDataLoaded(true);
          setProfileResponse(result);
        } else {
          setErrorState("None");
          setDestinyDataLoaded(true);
        }
      })
      .finally(() => {
        setDestinyDataLoaded(true);
      });
  };

  React.useEffect(() => {
    if (loggedIn) {
      if (!destinyMemberships) {
        loadDestinyMembership();
      } else if (
        destinyMemberships &&
        destinyMemberships.length > 0 &&
        !destinyData.selectedMembership
      ) {
        FireteamsDestinyMembershipDataStore.actions.loadUserData();
      } else if (destinyMemberships && destinyMemberships.length === 0) {
        setErrorState("NoCharacter");
        setDestinyDataLoaded(true);
      } else if (
        destinyMemberships &&
        destinyMemberships.length > 0 &&
        destinyData.selectedMembership &&
        !profileResponse
      ) {
        getProfileResponse(
          destinyData.selectedMembership.membershipType,
          destinyData.selectedMembership.membershipId
        );
      } else if (
        destinyMemberships &&
        destinyMemberships.length > 0 &&
        destinyData.selectedMembership &&
        profileResponse
      ) {
        setErrorState("None");
      }
    } else {
      FireteamsDestinyMembershipDataStore?.actions?.resetMembership();
      setErrorState("SignedOut");
      setDestinyDataLoaded(true);
    }
  }, [
    UserUtils.isAuthenticated(globalState),
    destinyMemberships,
    destinyData?.loaded,
  ]);

  const renderChildren = (): React.ReactNode => {
    return Children.map(props.children, (child) => {
      if (isValidElement(child) && child.type === SelectActivity) {
        return cloneElement(child as ReactElement, {
          activityFilterString,
          setActivityFilterString,
        });
      }

      return child;
    });
  };

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
      <SpinnerContainer loading={!destinyDataLoaded}>
        {errorState === "None" ? (
          <Grid isTextContainer={true}>
            <GridCol cols={12} className={styles.content}>
              <Header
                setActivityFilterString={setActivityFilterString}
                activityFilterString={activityFilterString}
                breadcrumbConfiguration={props.breadcrumbConfig}
                buttonConfiguration={props.buttonConfig}
                title={props.title}
                subtitle={props.subtitle}
                isLoggedIn={UserUtils.isAuthenticated(globalState)}
                withBetaTag={props.withBetaTag}
              />
              {renderChildren()}
            </GridCol>
          </Grid>
        ) : (
          <LoggedOutView errorType={errorState} className={styles.content} />
        )}
        <FireteamLegacyExperienceButton />
      </SpinnerContainer>
    </div>
  );
};
