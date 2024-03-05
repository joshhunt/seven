// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { useState } from "react";
import modalStyles from "./CreateFireteamModals.module.scss";
import styles from "./CreationTags.module.scss";
import SelectTagsModal from "./SelectTagsModal";

interface CreationTagsProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
  > {
  setTagsStrings: React.Dispatch<React.SetStateAction<string[]>>;
}

const CreationTags: React.FC<CreationTagsProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const [savedTagHashes, setSavedTagHashes] = useState<string[]>([]);

  const openSelectTagModal = () => {
    const modalInstance = Modal.open(
      <SelectTagsModal
        savedTags={savedTagHashes}
        tagHashesUpdated={(tagHashes) => {
          props.setTagsStrings(tagHashes);
          setSavedTagHashes(tagHashes);
        }}
        noHeader={false}
        closeModal={() => modalInstance.current.close()}
      />,
      {
        onlyAllowCloseButtonToClose: true,
        className: modalStyles.createFireteamModalWrapper,
      }
    );
  };

  return (
    <div className={styles.tags}>
      <h6 className={styles.sectionHeader}>
        {Localizer.Format(fireteamsLoc.TagsNum3, {
          num: savedTagHashes.length,
        })}
      </h6>
      <div className={styles.tagsWrapper}>
        {savedTagHashes.map((t) => (
          <div key={t} className={styles.tag}>
            {
              props.definitions?.DestinyFireteamFinderLabelDefinition?.get(t)
                .displayProperties?.name
            }
          </div>
        ))}
        <Button
          className={styles.tag}
          buttonType={"white"}
          onClick={() => openSelectTagModal()}
        >
          {fireteamsLoc.SelectTags}
        </Button>
      </div>
    </div>
  );
};

export default withDestinyDefinitions(CreationTags, {
  types: [
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
  ],
});
