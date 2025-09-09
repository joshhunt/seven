// Created by atseng, 2023
// Copyright Bungie, Inc.

import { LoggedOutView } from "@Areas/FireteamFinder/Components/Layout/LoggedOutView";
import { BreadcrumbConfiguration } from "@Areas/FireteamFinder/Components/Shared/FireteamFinderBreadcrumb";
import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { UserUtils } from "@Utilities/UserUtils";
import { PropsWithChildren, useEffect, useState } from "react";
import { Header } from "./Header";
import { ButtonConfiguration } from "./HeaderButtons";
import styles from "./Layout.module.scss";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import React from "react";
import classNames from "classnames";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";

export type FireteamFinderErrorViewType =
  | "SignedOut"
  | "NoCharacter"
  | "NotHighEnoughRank";

interface LayoutProps {
  buttonConfig: ButtonConfiguration;
  breadcrumbConfig: BreadcrumbConfiguration;
  title: string;
  subtitle: string;
  className?: string;
  activityFilterString?: string;
  setActivityFilterString?: (value: string) => void;
}

export const Layout = ({
  buttonConfig,
  breadcrumbConfig,
  title,
  subtitle,
  className,
  activityFilterString,
  setActivityFilterString,
  children,
}: PropsWithChildren<LayoutProps>) => {
  const fireteamsLoc = Localizer.Fireteams;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const [errorState, setErrorState] = useState<FireteamFinderErrorViewType>();
  const loggedIn = UserUtils.isAuthenticated(globalState);
  const destinyData = useDataStore(FireteamsDestinyMembershipDataStore);
  const { profile, isLoading: profileIsLoading } = useProfileData({
    membershipId: destinyData.selectedMembership?.membershipId,
    membershipType: destinyData.selectedMembership?.membershipType,
    components: [DestinyComponentType.Profiles],
  });
  const [isLoading, setIsLoading] = useState(false);
  const minimumLifetimeGuardianRank = ConfigUtils.GetParameter(
    "FireteamFinderCreationGuardianRankRequirement",
    "MinimumLifetimeGuardianRank",
    3
  );
  useEffect(() => {
    if (!loggedIn) {
      setErrorState("SignedOut");
      return;
    }
    const checkDestinyMembership = async (): Promise<
      FireteamFinderErrorViewType | undefined
    > => {
      if (destinyData.selectedMembership && profile) {
        if (
          profile.profile?.data?.lifetimeHighestGuardianRank <
          minimumLifetimeGuardianRank
        ) {
          return "NotHighEnoughRank";
        } else {
          // Their profile is valid for fireteam finder
          return;
        }
      }
      return "NoCharacter";
    };
    setIsLoading(true);
    checkDestinyMembership()
      .then(setErrorState)
      .catch((e) => {
        setErrorState(() => {
          throw e;
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loggedIn, destinyData.selectedMembership, profile]);

  return (
    <div className={classNames(styles.layout, className)}>
      <BungieHelmet
        title={fireteamsLoc.Fireteams}
        description={fireteamsLoc.Fireteams}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <SpinnerContainer loading={isLoading || profileIsLoading}>
        {!errorState ? (
          <Grid>
            <GridCol cols={12} className={styles.content}>
              <Header
                setActivityFilterString={setActivityFilterString}
                activityFilterString={activityFilterString}
                breadcrumbConfiguration={breadcrumbConfig}
                buttonConfiguration={buttonConfig}
                title={title}
                subtitle={subtitle}
                isLoggedIn={UserUtils.isAuthenticated(globalState)}
              />
              {children}
            </GridCol>
          </Grid>
        ) : (
          <LoggedOutView errorType={errorState} className={styles.content} />
        )}
      </SpinnerContainer>
    </div>
  );
};
