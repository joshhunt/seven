// Created by atseng, 2023
// Copyright Bungie, Inc.

import { CreateFireteamModalHeader } from "@Areas/FireteamFinder/Components/Create/CreateFireteamModalHeader";
import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useState } from "react";
import modalStyles from "./CreateFireteamModals.module.scss";
import styles from "./CreationTags.module.scss";

interface SelectTagsModalProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderLabelGroupDefinition"
  > {
  savedTags: string[];
  tagHashesUpdated: (tagHashes: string[]) => void;
  noHeader?: boolean;
  closeModal?: () => void;
  className?: string;
  filterView?: boolean;
}

const SelectTagsModal: React.FC<SelectTagsModalProps> = (props) => {
  const tagsDef = props.definitions?.DestinyFireteamFinderLabelGroupDefinition?.all();
  const tagGroupsDef = Object.entries(tagsDef).filter(
    (tg) => !tg[1]?.displayProperties?.name
  );
  const allTagDefs = props.definitions?.DestinyFireteamFinderLabelDefinition?.all();
  const tagsList = Object.entries(allTagDefs).filter((t) =>
    tagGroupsDef.find((tg) => tg[0] === t[1].groupHash.toString())
  );

  const allTagHashes = tagsList.map((t) => t[0]);
  const fireteamsLoc = Localizer.Fireteams;
  const [selectedTagHashes, setSelectedTagHashes] = useState<string[]>(
    props.savedTags
  );

  const handleTagClick = (tagHash: string) => {
    if (selectedTagHashes.includes(tagHash)) {
      //remove
      setSelectedTagHashes([...selectedTagHashes.filter((t) => t !== tagHash)]);
      props.tagHashesUpdated([
        ...selectedTagHashes.filter((t) => t !== tagHash),
      ]);
    } else {
      //add

      if (selectedTagHashes.length === 3) {
        //full
        Modal.open(<p>{fireteamsLoc.ThereIsAMaximumOf3Tags}</p>);

        return;
      } else {
        setSelectedTagHashes([...selectedTagHashes, tagHash]);
        props.tagHashesUpdated([...selectedTagHashes, tagHash]);
      }
    }

    return;
  };

  return (
    <div className={modalStyles.createFireteamModal}>
      {!props.noHeader && (
        <CreateFireteamModalHeader
          title={Localizer.Format(fireteamsLoc.TagsNum3, {
            num: selectedTagHashes.length,
          })}
          onClose={() => props.closeModal}
          onSave={() => {
            props.tagHashesUpdated(selectedTagHashes);
            props.closeModal();
          }}
        />
      )}
      <div className={classNames(styles.tagsWrapper, styles.selectTagWrapper)}>
        {allTagHashes.map((t) => {
          const tagDef = props.definitions.DestinyFireteamFinderLabelDefinition.get(
            t
          );

          return (
            <Button
              key={t}
              buttonType={"clear"}
              className={classNames(
                styles.tag,
                { [styles.filterView]: props.filterView },
                { [styles.on]: selectedTagHashes.includes(t) }
              )}
              onClick={() => handleTagClick(t)}
            >
              {tagDef?.displayProperties?.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(SelectTagsModal, {
  types: [
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
  ],
});
