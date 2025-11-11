import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import DestinyCharacterCard from "@UI/Destiny/DestinyCharacterCard";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { UserUtils } from "@Utilities/UserUtils";
import React, { RefObject, useEffect, useState } from "react";
import styles from "./CharacterSelect.module.scss";
import { useGameData } from "@Global/Context/hooks/gameDataHooks";
import { useProfileData } from "@Global/Context/hooks/profileDataHooks";
import { DestinyComponentType } from "@Enum";
import { DestinyAccountComponent } from "@UI/Destiny/DestinyAccountComponent";

interface CharacterSelectProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderOptionDefinition"
    | "DestinyFireteamFinderActivitySetDefinition"
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyActivityDefinition"
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyClassDefinition"
    | "DestinyRaceDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  compressed?: boolean;
}

interface CharacterModalProps {
  onClose: () => void;
}
const CharacterSelect: React.FC<CharacterSelectProps> = (props) => {
  const destinyData = useGameData().destinyData;
  const { profile } = useProfileData({
    membershipId: destinyData.selectedMembership?.membershipId,
    membershipType: destinyData.selectedMembership?.membershipType,
    components: [DestinyComponentType.Characters],
  });
  const fireteamsLoc = Localizer.Fireteams;
  const selectCharacter = fireteamsLoc.SelectCharacterAndPlatform;
  const autoSave = fireteamsLoc.changesAutoSave;
  const [modalRef, setModalRef] = useState<RefObject<Modal>>(null);
  const ModalView: React.FC = () => {
    return (
      <div className={styles.selectModalWrapper}>
        <h2 className={styles.modalHeading}>{selectCharacter}</h2>
        <p className={styles.modalSubheading}>{autoSave}</p>
        <DestinyAccountComponent
          showCrossSaveBanner={false}
          showAllPlatformCharacters={false}
        >
          {({ platformSelector, characterSelectorCard }) => (
            <div>
              {platformSelector}
              <div className={styles.cardWrapper}>{characterSelectorCard}</div>
            </div>
          )}
        </DestinyAccountComponent>
      </div>
    );
  };

  const onClickCharacterEdit = () => {
    setModalRef(Modal.open(<ModalView />));
  };

  useEffect(() => {
    if (destinyData.selectedCharacterId) {
      modalRef?.current.close();
    }
  }, [destinyData.selectedCharacterId]);

  const selectedCharacter =
    profile?.characters?.data[destinyData.selectedCharacterId];
  return (
    <div className={styles.characterSelectorWrapper}>
      <button
        type="button"
        className={styles.buttonWrapper}
        onClick={() => onClickCharacterEdit()}
      >
        <DestinyCharacterCard
          className={styles.characterCard}
          character={selectedCharacter}
          compressedView
        />
      </button>
    </div>
  );
};

export default withDestinyDefinitions(CharacterSelect, {
  types: [
    "DestinyFireteamFinderActivitySetDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityDefinition",
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyClassDefinition",
    "DestinyRaceDefinition",
    "DestinyInventoryItemLiteDefinition",
    "DestinyFireteamFinderOptionDefinition",
  ],
});
