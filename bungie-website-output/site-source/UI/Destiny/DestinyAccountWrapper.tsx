// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import DestinyCharacterSelector from "@UI/Destiny/DestinyCharacterSelector";
import { DestinyPlatformSelector } from "@UI/Destiny/DestinyPlatformSelector";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { ReactNode, useEffect } from "react";
import styles from "./DestinyAccountWrapper.module.scss";

export interface IAccountFeatures {
  bnetProfile: ReactNode;
  platformSelector: ReactNode;
  characterSelector: ReactNode;
}

// Required props
interface IDestinyAccountWrapperProps extends GlobalStateComponentProps<any> {
  membershipDataStore: DestinyMembershipDataStore;
  /** Default subtitle is currently selected platform, can be overwritten or pass in a blank string to have this field blank */
  bnetProfileSubtitle?: string;
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
  membershipDataStore,
  onPlatformChange,
  onCharacterChange,
  bnetProfileSubtitle,
}) => {
  //check for changes in auth status

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(membershipDataStore);

  useEffect(() => {
    if (!destinyMembership?.loaded) {
      membershipDataStore.actions.loadUserData();
    }
  }, []);

  return destinyMembership?.membershipData ? (
    <SystemDisabledHandler systems={["Destiny2"]}>
      <RequiresAuth />
      {destinyMembership?.memberships.length > 0 ? (
        children({
          bnetProfile: (
            <div className={styles.bnetProfile}>
              <TwoLineItem
                icon={
                  <img
                    src={globalState?.loggedInUser?.user?.profilePicturePath}
                  />
                }
                itemTitle={globalState?.loggedInUser?.user?.displayName}
                itemSubtitle={
                  bnetProfileSubtitle ??
                  (destinyMembership?.selectedMembership &&
                    Localizer.Platforms[
                      EnumUtils.getStringValue(
                        destinyMembership?.selectedMembership?.membershipType,
                        BungieMembershipType
                      )
                    ])
                }
              />
            </div>
          ),
          platformSelector: (
            <DestinyPlatformSelector
              userMembershipData={destinyMembership?.membershipData}
              onChange={(value: string) => {
                membershipDataStore.actions.updatePlatform(value);
                onPlatformChange?.(value);
              }}
              defaultValue={destinyMembership?.memberships?.[0]?.membershipType}
              crossSavePairingStatus={globalState.crossSavePairingStatus}
            />
          ),
          characterSelector: (
            <>
              {destinyMembership?.selectedCharacter ? (
                <DestinyCharacterSelector
                  characterComponent={destinyMembership?.characters}
                  defaultCharacterId={
                    destinyMembership?.selectedCharacter?.characterId
                  }
                  onChange={(value: string) => {
                    membershipDataStore.actions.updateCharacter(value);
                    onCharacterChange?.(value);
                  }}
                />
              ) : (
                <div className={styles.noAccount}>
                  {destinyMembership?.selectedMembership?.membershipType
                    ? Localizer.Format(Localizer.Crosssave.NoCharacters, {
                        platform: LocalizerUtils.getPlatformNameFromMembershipType(
                          destinyMembership?.selectedMembership?.membershipType
                        ),
                      })
                    : Localizer.Messages.GroupMemberInvalidMemberType}
                </div>
              )}
            </>
          ),
        })
      ) : (
        <div className={styles.noAccount}>
          {Localizer.CodeRedemption.LinkedDestinyAccountRequiredHeader}
        </div>
      )}
    </SystemDisabledHandler>
  ) : null;
};
