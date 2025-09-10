import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { EnumMap } from "@Global/EnumMap";

import {
  loadUserData,
  selectCharactersForSelectedPlatform,
  selectAllPlatformCharacters,
  selectDestinyAccount,
  selectIsCrossSaved,
  selectMembershipData,
  selectMemberships,
  selectSelectedCharacter,
  selectSelectedCharacterId,
  selectSelectedMembership,
  selectStatus,
  updateCharacter,
  updatePlatform,
  MembershipCharacter,
  resetMembership,
  MembershipPair,
} from "@Global/Redux/slices/destinyAccountSlice";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import { SelectChangeEvent } from "@mui/material";
import { FaPlaystation } from "@react-icons/all-files/fa/FaPlaystation";
import { FaSteam } from "@react-icons/all-files/fa/FaSteam";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { GoAlert } from "@react-icons/all-files/go/GoAlert";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { Spinner } from "@UIKit/Controls/Spinner";
import { SelectIcon } from "@UIKit/Forms/SelectIconFromSvg";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { Alert, Select } from "plxp-web-ui/components/base";
import React, { ReactNode, useEffect, useState } from "react";

import styles from "./DestinyAccountComponent.module.scss";

// Character selector component with Destiny definitions
interface CharacterSelectorProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  characters: MembershipCharacter[];
  selectedCharacterId?: string;
  onChange: (value: string) => void;
  showAllPlatformCharacters: boolean;
}
function CharacterSelector({
  characters,
  selectedCharacterId,
  onChange,
  definitions,
  showAllPlatformCharacters,
}: CharacterSelectorProps): JSX.Element {
  const RegistrationLoc = Localizer?.Registration;

  const membershipDataMap = {
    [BungieMembershipType.TigerPsn]: {
      logo: <FaPlaystation style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionplaystation,
    },
    [BungieMembershipType.TigerXbox]: {
      logo: <FaXbox style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionxbox,
    },
    [BungieMembershipType.TigerSteam]: {
      logo: <FaSteam style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionsteam,
    },
    [BungieMembershipType.TigerEgs]: {
      logo: <SiEpicgames style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionegs,
    },
  };

  const MEM_CONTENT_MAP = new EnumMap(BungieMembershipType, membershipDataMap);

  const characterOptions = characters.map((character) => {
    const characterLight = `✧ ${character.characterData.light}`;
    const className = definitions.DestinyClassDefinition?.get(
      character.characterData.classHash
    ).displayProperties.name;
    const platform = MEM_CONTENT_MAP?.get(character.membershipType)?.label;

    return {
      value: character.id,
      label: Responsive?.state?.mobile
        ? `${className} ${characterLight}`
        : `${platform}: ${className} ${characterLight}`,
    };
  });

  // Find selected character for emblem
  const selectedCharacter = characters.find(
    (char) => char.id === selectedCharacterId
  );

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    onChange(value);
  };

  return (
    <Select
      labelArea={{
        labelString: null,
      }}
      selectProps={{
        displayEmpty: true,
        value: selectedCharacterId || "",
        onChange: handleChange,
        required: true,
      }}
      menuOptions={characterOptions}
      prependIcon={<SelectIcon iconUrl={selectedCharacter?.emblem} />}
    />
  );
}

// Export the character selector for external use
export const CharacterSelectorWithDefinitions = withDestinyDefinitions(
  CharacterSelector,
  {
    types: ["DestinyClassDefinition"],
  }
);

interface PlatformSelectorProps {
  memberships: any[];
  selectedMembershipType?: BungieMembershipType;
  onChange: (value: string) => void;
  isCrossSaved: boolean;
  showCrossSaveBanner?: boolean;
  isViewingOthers?: boolean;
  showAllPlatformCharacters?: boolean;
  showAllCrossSavedPlatforms?: boolean;
}

export function PlatformSelector({
  memberships,
  selectedMembershipType,
  onChange,
  isCrossSaved,
  showCrossSaveBanner = false,
  isViewingOthers = false,
  showAllCrossSavedPlatforms = false,
}: PlatformSelectorProps): JSX.Element {
  if (isCrossSaved && showCrossSaveBanner) {
    return (
      <div className={styles.crossSaveBanner}>
        {Localizer.Profile.Crosssave}
      </div>
    );
  }

  const crossSavePlatform = memberships.find(
    (membership) => membership.membershipId === membership.primaryMembershipId
  );

  const RegistrationLoc = Localizer.Registration;

  const membershipDataMap = {
    [BungieMembershipType.TigerPsn]: {
      logo: <FaPlaystation style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionplaystation,
    },
    [BungieMembershipType.TigerXbox]: {
      logo: <FaXbox style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionxbox,
    },
    [BungieMembershipType.TigerSteam]: {
      logo: <FaSteam style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionsteam,
    },
    [BungieMembershipType.TigerEgs]: {
      logo: <SiEpicgames style={{ fontSize: "2rem" }} />,
      label: RegistrationLoc.networksigninoptionegs,
    },
  };

  const MEM_CONTENT_MAP = new EnumMap(BungieMembershipType, membershipDataMap);

  const platformOptions =
    crossSavePlatform && !showAllCrossSavedPlatforms
      ? [
          {
            label: `${crossSavePlatform.displayName}: ${
              MEM_CONTENT_MAP.get(crossSavePlatform?.membershipType)?.label
            }`,
            value: EnumUtils.getStringValue(
              crossSavePlatform.membershipType,
              BungieMembershipType
            ),
          },
        ]
      : memberships
          .filter((m) => m.membershipType !== BungieMembershipType.TigerStadia)
          .map((membership) => {
            const bMembershipTypeString = EnumUtils.getStringValue(
              membership.membershipType,
              BungieMembershipType
            );

            return {
              label: `${membership.displayName} : ${
                MEM_CONTENT_MAP.get(membership?.membershipType)?.label
              }`,
              value: bMembershipTypeString,
            };
          });

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    onChange(value);
  };

  return (
    <Select
      labelArea={{
        labelString: null,
      }}
      selectProps={{
        displayEmpty: true,
        value: selectedMembershipType
          ? EnumUtils.getStringValue(
              selectedMembershipType,
              BungieMembershipType
            )
          : "",
        onChange: handleChange,
        required: true,
      }}
      menuOptions={platformOptions}
      prependIcon={MEM_CONTENT_MAP.get(selectedMembershipType)?.logo}
    />
  );
}

// Feature components interface
export interface IAccountFeatures {
  bnetProfile: ReactNode;
  platformSelector: ReactNode;
  characterSelector: ReactNode;
}

// Component props
interface DestinyAccountComponentProps {
  bnetProfileSubtitle?: string;
  onPlatformChange?: (value: string) => void;
  onCharacterChange?: (value: string) => void;
  showCrossSaveBanner?: boolean;
  showAllPlatformCharacters?: boolean;
  children?: (accountFeatures: IAccountFeatures) => ReactNode;
}

/**
 * DestinyAccountComponent - Modern implementation of the Destiny account wrapper
 * using Redux for state management and a component library for UI
 *
 * Example usage:
 * <DestinyAccountComponent showCrossSaveBanner={true}>
 *   {({ platformSelector, characterSelector }) => (
 *         <div className="selection-controls">
 *           {platformSelector}
 *           {characterSelector}
 *         </div>
 *   )}
 * </DestinyAccountComponent>
 */
export const DestinyAccountComponent: React.FC<DestinyAccountComponentProps> = ({
  children,
  bnetProfileSubtitle,
  onPlatformChange,
  onCharacterChange,
  showAllPlatformCharacters = false,
  showCrossSaveBanner = false,
}) => {
  const dispatch = useAppDispatch();

  // Get state from Redux
  const destinyAccount = useAppSelector(selectDestinyAccount);
  const membershipData = useAppSelector(selectMembershipData);
  const memberships = useAppSelector(selectMemberships);
  const selectedMembership = useAppSelector(selectSelectedMembership);
  const characters = useAppSelector(
    showAllPlatformCharacters
      ? selectAllPlatformCharacters
      : selectCharactersForSelectedPlatform
  );
  const selectedCharacter = useAppSelector(selectSelectedCharacter);
  const selectedCharacterId = useAppSelector(selectSelectedCharacterId);
  const isCrossSaved = useAppSelector(selectIsCrossSaved);
  const status = useAppSelector(selectStatus);

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    if (!UserUtils.isAuthenticated(globalState)) {
      dispatch(resetMembership());
    } else {
      let membershipPair: MembershipPair = {
        membershipId: globalState?.loggedInUser?.user?.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      };
      dispatch(loadUserData({ membershipPair }));
    }
  }, [globalState?.loggedInUser?.user?.membershipId]);

  // Handle platform change
  const handlePlatformChange = (value: string) => {
    dispatch(updatePlatform(value));
    onPlatformChange?.(value);
  };

  // Handle character change
  const handleCharacterChange = (value: string) => {
    dispatch(updateCharacter(value));
    onCharacterChange?.(value);
  };

  // Error conditions
  const errorFetchingMembership = !selectedMembership?.membershipType;
  const noCharacters =
    !errorFetchingMembership && (!characters || characters.length < 1);

  // Loading state
  if (status === "loading" && !membershipData) {
    return <Spinner />;
  }

  // No membership data
  if (!membershipData) {
    return null;
  }

  const isViewingOthers =
    destinyAccount?.membershipData?.bungieNetUser?.membershipId !==
    globalState?.loggedInUser?.user?.membershipId;

  return (
    <SystemDisabledHandler systems={["Destiny2"]}>
      {memberships?.length > 0 ? (
        children({
          bnetProfile: (
            <div className={styles.bnetProfile}>
              <TwoLineItem
                icon={
                  <img
                    src={membershipData?.bungieNetUser?.profilePicturePath}
                    alt="Profile"
                  />
                }
                itemTitle={membershipData?.bungieNetUser?.displayName}
                itemSubtitle={
                  bnetProfileSubtitle ??
                  (selectedMembership &&
                    Localizer.Platforms[
                      EnumUtils.getStringValue(
                        selectedMembership?.membershipType,
                        BungieMembershipType
                      )
                    ])
                }
              />
            </div>
          ),
          platformSelector: !showAllPlatformCharacters && (
            <PlatformSelector
              memberships={memberships}
              selectedMembershipType={selectedMembership?.membershipType}
              onChange={handlePlatformChange}
              isCrossSaved={isCrossSaved}
              showCrossSaveBanner={showCrossSaveBanner}
              isViewingOthers={isViewingOthers}
              showAllPlatformCharacters={showAllPlatformCharacters}
              showAllCrossSavedPlatforms={false}
            />
          ),
          characterSelector: (
            <>
              {selectedCharacter ? (
                <CharacterSelectorWithDefinitions
                  characters={characters}
                  selectedCharacterId={selectedCharacterId}
                  onChange={handleCharacterChange}
                  showAllPlatformCharacters={showAllPlatformCharacters}
                />
              ) : (
                <Alert
                  severity="error"
                  title={
                    errorFetchingMembership
                      ? Localizer.Account.AccountError
                      : ""
                  }
                  message={
                    noCharacters
                      ? Localizer.Format(Localizer.Crosssave.NoCharacters, {
                          platform: LocalizerUtils.getPlatformAbbrForMembershipType(
                            selectedMembership?.membershipType
                          ),
                        })
                      : ""
                  }
                  icon={<GoAlert />}
                >
                  {noCharacters
                    ? Localizer.Format(Localizer.Crosssave.NoCharacters, {
                        platform: LocalizerUtils.getPlatformAbbrForMembershipType(
                          selectedMembership?.membershipType
                        ),
                      })
                    : ""}
                </Alert>
              )}
            </>
          ),
        })
      ) : (
        <Alert
          severity="error"
          message={Localizer.CodeRedemption.LinkedDestinyAccountRequiredHeader}
        >
          {Localizer.CodeRedemption.LinkedDestinyAccountRequiredHeader}
        </Alert>
      )}
    </SystemDisabledHandler>
  );
};
