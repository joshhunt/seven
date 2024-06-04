import { FireteamsDestinyMembershipDataStore } from "@Areas/FireteamFinder/DataStores/FireteamsDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  DestinyAccountWrapper,
  IAccountFeatures,
} from "@UI/Destiny/DestinyAccountWrapper";
import DestinyCharacterCard from "@UI/Destiny/DestinyCharacterCard";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { UserUtils } from "@Utilities/UserUtils";
import React, { RefObject, useEffect, useState } from "react";
import styles from "./CharacterSelect.module.scss";

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
  > {}

interface CharacterModalProps {
  onClose: () => void;
}
const CharacterSelect: React.FC<CharacterSelectProps> = () => {
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const fireteamsLoc = Localizer.Fireteams;
  const selectCharacter = fireteamsLoc.SelectCharacterAndPlatform;
  const autoSave = fireteamsLoc.changesAutoSave;
  const currentChararacter = fireteamsLoc.currentCharacter;
  const edit = `(${fireteamsLoc.Edit})`;
  const [modalRef, setModalRef] = useState<RefObject<Modal>>(null);
  const ModalView: React.FC = () => {
    return (
      <div className={styles.selectModalWrapper}>
        <h2 className={styles.modalHeading}>{selectCharacter}</h2>
        <p className={styles.modalSubheading}>{autoSave}</p>

        <DestinyAccountWrapper
          membershipDataStore={FireteamsDestinyMembershipDataStore}
          showCrossSaveBanner={false}
        >
          {({ platformSelector, characterCardSelector }: IAccountFeatures) => (
            <div>
              {platformSelector}
              <div className={styles.cardWrapper}>{characterCardSelector}</div>
            </div>
          )}
        </DestinyAccountWrapper>
      </div>
    );
  };

  const onClickCharacterEdit = () => {
    setModalRef(Modal.open(<ModalView />));
  };

  useEffect(() => {
    if (!destinyMembership?.selectedMembership) {
      FireteamsDestinyMembershipDataStore.actions.loadUserData();
    }
  }, [UserUtils.isAuthenticated(globalState)]);

  useEffect(() => {
    modalRef?.current.close();
  }, [destinyMembership?.selectedCharacter]);

  if (destinyMembership?.selectedMembership && !destinyMembership?.characters) {
    return <p>{Localizer.Clans.adestiny2characterisrequired}</p>;
  }

  return (
    <div className={styles.characterSelectorWrapper}>
      <button
        className={styles.buttonWrapper}
        onClick={() => onClickCharacterEdit()}
      >
        <p className={styles.copyContainer}>
          <span className={styles.heading}>{currentChararacter}</span>
          <span className={styles.subheading}>{edit}</span>
        </p>
        <DestinyCharacterCard
          className={styles.characterCard}
          character={destinyMembership?.selectedCharacter}
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
