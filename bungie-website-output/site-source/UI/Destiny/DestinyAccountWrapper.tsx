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
  /** Shows the cross save banner in the platformSelector if user is cross saved */
  showCrossSaveBanner?: boolean;
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
  showCrossSaveBanner,
}) => {
  //check for changes in auth status

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const membershipData = useDataStore(membershipDataStore);

  const isViewingSelf =
    globalState.loggedInUser?.user?.membershipId &&
    membershipData?.membershipData?.bungieNetUser?.membershipId &&
    globalState.loggedInUser?.user?.membershipId ===
      membershipData?.membershipData?.bungieNetUser?.membershipId;

  useEffect(() => {
    if (!membershipData?.loaded) {
      membershipDataStore.actions.loadUserData();
    }
  }, []);

  const errorFetchingMembership =
    !membershipData || !membershipData?.selectedMembership?.membershipType;
  const noCharacters =
    !errorFetchingMembership &&
    (!membershipData?.characters ||
      Object.keys(membershipData?.characters)?.length < 1);

  return membershipData?.membershipData ? (
    <SystemDisabledHandler systems={["Destiny2"]}>
      {membershipData?.memberships.length > 0 ? (
        children({
          bnetProfile: (
            <div className={styles.bnetProfile}>
              <TwoLineItem
                icon={
                  <img
                    src={
                      membershipData?.membershipData?.bungieNetUser
                        ?.profilePicturePath
                    }
                  />
                }
                itemTitle={
                  membershipData?.membershipData?.bungieNetUser?.displayName
                }
                itemSubtitle={
                  bnetProfileSubtitle ??
                  (membershipData?.selectedMembership &&
                    Localizer.Platforms[
                      EnumUtils.getStringValue(
                        membershipData?.selectedMembership?.membershipType,
                        BungieMembershipType
                      )
                    ])
                }
              />
            </div>
          ),
          platformSelector: (
            <DestinyPlatformSelector
              userMembershipData={membershipData?.membershipData}
              onChange={(value: string) => {
                membershipDataStore.actions.updatePlatform(value);
                onPlatformChange?.(value);
              }}
              defaultValue={membershipData?.memberships?.[0]?.membershipType}
              selectedValue={
                membershipDataStore?.state?.selectedMembership?.membershipType
              }
              isViewingOthers={!isViewingSelf}
              showCrossSaveBanner={showCrossSaveBanner}
            />
          ),
          characterSelector: (
            <>
              {membershipData?.selectedCharacter ? (
                <DestinyCharacterSelector
                  characterComponent={membershipData?.characters}
                  defaultCharacterId={
                    membershipData?.selectedCharacter?.characterId
                  }
                  onChange={(value: string) => {
                    membershipDataStore.actions.updateCharacter(value);
                    onCharacterChange?.(value);
                  }}
                />
              ) : (
                <div className={styles.errors}>
                  {errorFetchingMembership && Localizer.Account.AccountError}
                  {noCharacters &&
                    Localizer.Format(Localizer.Crosssave.NoCharacters, {
                      platform: LocalizerUtils.getPlatformNameFromMembershipType(
                        membershipData?.selectedMembership?.membershipType
                      ),
                    })}
                </div>
              )}
            </>
          ),
        })
      ) : (
        <div className={styles.errors}>
          {Localizer.CodeRedemption.LinkedDestinyAccountRequiredHeader}
        </div>
      )}
    </SystemDisabledHandler>
  ) : null;
};
