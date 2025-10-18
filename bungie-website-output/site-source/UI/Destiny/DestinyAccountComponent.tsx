import { Responsive } from "@Boot/Responsive";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType, DestinyComponentType } from "@Enum";
import { EnumMap } from "@Global/EnumMap";
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
import { Alert, Select } from "plxp-web-ui/components/base";
import React, { ReactNode, useEffect, useMemo } from "react";

import styles from "./DestinyAccountComponent.module.scss";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { Characters, GroupsV2 } from "@Platform";
import { useMultipleProfileData } from "@Global/Context/hooks/profileDataHooks";

// Character selector component with Destiny definitions
interface CharacterSelectorProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  characters: Characters.DestinyCharacterComponent[];
  selectedCharacter?: Characters.DestinyCharacterComponent;
  onChange: (value: string) => void;
}
function CharacterSelector({
  characters,
  selectedCharacter,
  onChange,
  definitions,
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

  return (
    <Select
      labelArea={{
        labelString: null,
      }}
      selectProps={{
        displayEmpty: true,
        value: selectedCharacter?.characterId || "",
        onChange: (e) => onChange(e.target.value as string),
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
  onChange: (value: string) => void;
  isCrossSaved: boolean;
  primaryMembershipId?: string;
  showCrossSaveBanner?: boolean;
  showAllPlatformCharacters?: boolean;
  showAllCrossSavedPlatforms?: boolean;
}

export function PlatformSelector({
  memberships,
  selectedMembershipType,
  onChange,
  isCrossSaved,
  primaryMembershipId,
  showCrossSaveBanner = false,
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
            return {
              label: `${membership.displayName} : ${
                MEM_CONTENT_MAP.get(membership?.membershipType)?.label
              }`,
              value: membership.membershipId,
            };
          });

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
        onChange: (e) => onChange(e.target.value as string),
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
  showAllPlatformCharacters = false,
  showCrossSaveBanner = false,
}) => {
  const {
    destinyData,
    selectMembership,
    selectCharacter,
    isLoading,
  } = useGameData();
  const membershipData = destinyData.membershipData;
  const memberships = (membershipData?.destinyMemberships ?? []).filter(
    (m) =>
      !membershipData?.primaryMembershipId ||
      m.membershipId === membershipData.primaryMembershipId
  );
  const selectedMembership = destinyData.selectedMembership;
  const selectedCharacterId = destinyData.selectedCharacterId;

  const profiles = useMultipleProfileData(
    memberships.map((m) => ({
      membershipType: m.membershipType,
      membershipId: m.membershipId,
      components: [DestinyComponentType.Characters],
    }))
  );

  const characters = useMemo(() => {
    let charactersInner: Characters.DestinyCharacterComponent[] = [];
    for (const p of profiles) {
      if (!p.profile) {
        continue;
      }
      if (
        !showAllPlatformCharacters &&
        p.membershipId !== selectedMembership?.membershipId
      ) {
        continue;
      }
      charactersInner = charactersInner.concat(
        Object.values(p.profile.characters?.data ?? {})
      );
    }
    return charactersInner;
  }, [showAllPlatformCharacters, profiles]);

  const selectedCharacter = useMemo(() => {
    return profiles.find(
      (p) => p.profile?.characters?.data[selectedCharacterId]
    )?.profile.characters.data[selectedCharacterId];
  }, [profiles, selectedCharacterId]);

  useEffect(() => {
    // Selects a character if there aren't any selected.
    if (
      !selectedCharacterId &&
      profiles.length > 0 &&
      profiles.every((p) => !p.isLoading)
    ) {
      // First attempt to select the first character in the selected membership
      const selectedMembershipProfiles = profiles.find(
        (p) => p.membershipId === destinyData.selectedMembership?.membershipId
      );
      const charactersForProfile = Object.values(
        selectedMembershipProfiles?.profile?.characters?.data ?? {}
      );
      if (charactersForProfile.length > 0) {
        handleSelectCharacter(charactersForProfile[0].characterId);
      } else if (characters.length > 0) {
        // If there aren't any characters in the selected membership, select the first character in any membership
        handleSelectCharacter(characters[0].characterId);
      }
    }
  }, [profiles, selectedCharacterId]);

  const noCharacters = !characters || characters.length < 1;

  const handleSelectCharacter = (characterId: string) => {
    const newMembershipId = profiles.find(
      (p) => p.profile?.characters?.data?.[characterId]
    )?.membershipId;
    if (!newMembershipId) {
      throw new Error("This is an invalid character ID");
    }
    if (newMembershipId !== selectedMembership?.membershipId) {
      selectMembership(newMembershipId);
    }
    selectCharacter(characterId);
  };

  // Loading state
  if (isLoading && !membershipData) {
    return <Spinner />;
  }

  // No membership data
  if (!membershipData) {
    return null;
  }

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
              onChange={selectMembership}
              isCrossSaved={!!membershipData?.primaryMembershipId}
              showCrossSaveBanner={showCrossSaveBanner}
              showAllPlatformCharacters={showAllPlatformCharacters}
              showAllCrossSavedPlatforms={false}
            />
          ),
          characterSelector: (
            <>
              {characters.length > 0 ? (
                <CharacterSelectorWithDefinitions
                  characters={characters}
                  selectedCharacter={selectedCharacter}
                  onChange={handleSelectCharacter}
                />
              ) : (
                <Alert
                  severity="error"
                  title={Localizer.Account.AccountError}
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
