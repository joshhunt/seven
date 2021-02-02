// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { useDataStore } from "@Global/DataStore";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import DestinyCharacterSelector from "@UI/Destiny/DestinyCharacterSelector";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode, useEffect, useMemo } from "react";
import styles from "./DestinyAccountWrapper.module.scss";

export interface IAccountFeatures {
  platformSelector: ReactNode;
  characterSelector: ReactNode;
  bnetProfile: ReactNode;
}

// Required props
interface IDestinyAccountWrapperProps extends GlobalStateComponentProps<any> {
  /** Enables a parent to do something with the value returned when a different platform is selected */
  onPlatformChange?: (value: string) => void;
  /** Enables a parent to do something with the value returned when a different character is selected */
  onCharacterChange?: (value: string) => void;
}

// Default props - these will have values set in DestinyAccountWrapper.defaultProps
interface DefaultProps {
  /** This wrapper includes one's bnet profile info, a platform selector, and character selector but they can be placed in any order */
  children?: (accountFeatures: IAccountFeatures) => ReactNode;
}

export type Props = IDestinyAccountWrapperProps & DefaultProps;

/**
 * DestinyAccountWrapper - Provides header with Destiny account info and guardian selectors
 *  *
 * @param {IDestinyAccountWrapperProps} props
 * @returns
 */
export const DestinyAccountWrapper: React.FC<Props> = ({
  children,
  onPlatformChange,
  onCharacterChange,
}) => {
  const destinyMembershipDataStore = useMemo(
    () =>
      new DestinyMembershipDataStore(
        UserUtils.loggedInUserMembershipIdFromCookie
      ),
    []
  );

  //check for changes in auth status
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(destinyMembershipDataStore);

  return destinyMembership.initialDataLoaded ? (
    <Grid>
      <SystemDisabledHandler systems={["Destiny2"]}>
        <RequiresAuth />
        {children({
          platformSelector: (
            <DestinyPlatformSelector
              userMembershipData={destinyMembership.membershipData}
              onChange={async (
                value: EnumStrings<typeof BungieMembershipType>
              ) => {
                await destinyMembershipDataStore.actions.updatePlatform(value);
                onPlatformChange?.(value);
              }}
              defaultValue={destinyMembership.memberships[0].membershipType}
              crossSavePairingStatus={globalState.crossSavePairingStatus}
            />
          ),
          characterSelector: (
            <DestinyCharacterSelector
              characterComponent={destinyMembership.characters}
              defaultCharacterId={
                destinyMembership.selectedCharacter.characterId
              }
              onChange={(value: string) => {
                destinyMembershipDataStore.actions.updateCharacter(value);
                onCharacterChange?.(value);
              }}
            />
          ),
          bnetProfile: (
            <div className={styles.bnetProfile}>
              <TwoLineItem
                icon={
                  <img
                    src={destinyMembership.selectedCharacter?.emblemPath}
                    alt={Localizer.profile.EmblemAltText}
                  />
                }
                itemTitle={globalState.loggedInUser.user.displayName}
                itemSubtitle={
                  Localizer.Platforms[
                    EnumUtils.getStringValue(
                      destinyMembership.selectedMembership.membershipType,
                      BungieMembershipType
                    )
                  ]
                }
              />
            </div>
          ),
        })}
      </SystemDisabledHandler>
    </Grid>
  ) : null;
};
