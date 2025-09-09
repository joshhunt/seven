import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { EnumMap } from "@Global/EnumMap";
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
import React, { ReactNode, useEffect, useMemo } from "react";

import styles from "./DestinyAccountComponent.module.scss";
import { Responsive } from "@Boot/Responsive";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { GroupsV2 } from "@Platform";
import { useMultipleProfileData } from "@Global/Context/hooks/profileDataHooks";

// Character selector component with Destiny definitions
interface CharacterSelectorProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  selectedMembershipType: BungieMembershipType;
  selectedCharacterId?: string;
  memberships: GroupsV2.GroupUserInfoCard[];
  onChange: (value: string) => void;
}
function CharacterSelector({
  selectedCharacterId,
  onChange,
  definitions,
  memberships,
  selectedMembershipType,
}: CharacterSelectorProps) {
  const RegistrationLoc = Localizer?.Registration;
  const profileRequest = useMemo(() => {
    return memberships.map((m) => ({
      membershipType: m.membershipType,
      membershipId: m.membershipId,
      components: [DestinyComponentType.Characters],
    }));
  }, [memberships]);
  const profiles = useMultipleProfileData(profileRequest);
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

  if (profiles.some((p) => p.isLoading)) {
    return null;
  }

  const MEM_CONTENT_MAP = new EnumMap(BungieMembershipType, membershipDataMap);
  const characters = profiles.flatMap((p) =>
    Object.values(p.profile?.characters?.data ?? {})
  );

  if (characters.length === 0) {
    return (
      <Alert
        severity="error"
        title={Localizer.Account.AccountError}
        message={Localizer.Format(Localizer.Crosssave.NoCharacters, {
          platform: LocalizerUtils.getPlatformAbbrForMembershipType(
            selectedMembershipType
          ),
        })}
        icon={<GoAlert />}
      />
    );
  }

  const characterOptions = characters.map((character) => {
    const characterLight = `✧ ${character.light}`;
    const className = definitions.DestinyClassDefinition?.get(
      character.classHash
    ).displayProperties.name;
    const platform = MEM_CONTENT_MAP?.get(character.membershipType)?.label;

    return {
      value: character.characterId,
      label: Responsive?.state?.mobile
        ? `${className} ${characterLight}`
        : `${platform}: ${className} ${characterLight}`,
    };
  });

  // Find selected character for emblem
  const selectedCharacter =
    characters.find((char) => char.characterId === selectedCharacterId) ??
    characters[0];

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
        value: selectedCharacter.characterId || "",
        onChange: handleChange,
        required: true,
      }}
      menuOptions={characterOptions}
      prependIcon={<SelectIcon iconUrl={selectedCharacter?.emblemPath} />}
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
  memberships: GroupsV2.GroupUserInfoCard[];
  selectedMembershipType?: BungieMembershipType;
  primaryMembershipId?: string;
  onChange: (value: string) => void;
  showCrossSaveBanner?: boolean;
  showAllPlatformCharacters?: boolean;
  showAllCrossSavedPlatforms?: boolean;
}

export function PlatformSelector({
  memberships,
  selectedMembershipType,
  primaryMembershipId,
  onChange,
  showCrossSaveBanner = false,
  showAllCrossSavedPlatforms = false,
}: PlatformSelectorProps): JSX.Element {
  if (primaryMembershipId && showCrossSaveBanner) {
    return (
      <div className={styles.crossSaveBanner}>
        {Localizer.Profile.Crosssave}
      </div>
    );
  }

  const crossSavePlatform = memberships.find(
    (membership) => membership.membershipId === primaryMembershipId
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
  const {
    destinyData,
    isLoading,
    selectMembership,
    selectCharacter,
  } = useGameData();

  // Handle platform change
  const handlePlatformChange = (value: string) => {
    selectMembership(value);
    onPlatformChange?.(value);
  };

  // Handle character change
  const handleCharacterChange = (value: string) => {
    selectCharacter(value);
    onCharacterChange?.(value);
  };

  // Loading state
  if (isLoading) {
    return <Spinner />;
  }

  // No membership data
  if (!destinyData.membershipData || !destinyData.selectedMembership) {
    return null;
  }
  const membershipData = destinyData.membershipData;
  const selectedMembership = destinyData.selectedMembership;
  const selectedCharacterId = destinyData.selectedCharacterId;

  return (
    <SystemDisabledHandler systems={["Destiny2"]}>
      {membershipData.destinyMemberships.length > 0 ? (
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
              memberships={membershipData.destinyMemberships}
              selectedMembershipType={selectedMembership?.membershipType}
              onChange={handlePlatformChange}
              primaryMembershipId={membershipData?.primaryMembershipId}
              showCrossSaveBanner={showCrossSaveBanner}
              showAllPlatformCharacters={showAllPlatformCharacters}
              showAllCrossSavedPlatforms={false}
            />
          ),
          characterSelector: (
            <CharacterSelectorWithDefinitions
              memberships={
                showAllPlatformCharacters
                  ? membershipData.destinyMemberships
                  : [selectedMembership]
              }
              selectedMembershipType={selectedMembership.membershipType}
              selectedCharacterId={selectedCharacterId}
              onChange={handleCharacterChange}
            />
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
