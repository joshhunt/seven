import React, { FC, useState } from "react";
import classNames from "classnames";
import { Button } from "@UIKit/Controls/Button/Button";
import { AllDefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Localizer } from "@bungie/localization";
import styles from "./FilterFireteamTags.module.scss";

interface FilterFireteamTagsProps {
  definitions: Pick<
    AllDefinitionsFetcherized,
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderLabelGroupDefinition"
  >;
  savedTags: string[];
  tagHashesUpdated: (tagHashes: string[]) => void;
}

const FilterFireteamTags: FC<FilterFireteamTagsProps> = ({
  tagHashesUpdated,
  definitions,
  savedTags,
}) => {
  const fireteamsLoc = Localizer.Fireteams;
  const tagsDef = definitions?.DestinyFireteamFinderLabelGroupDefinition?.all();
  const tagGroupsDef = Object.entries(tagsDef).filter(
    (tg) => !tg[1]?.displayProperties?.name
  );
  const allTagDefs = definitions?.DestinyFireteamFinderLabelDefinition?.all();
  const tagsList = Object.entries(allTagDefs).filter((t) =>
    tagGroupsDef.find((tg) => tg[0] === t[1].groupHash.toString())
  );

  const allTagHashes = tagsList.map((t) => t[0]);
  const [selectedTagHashes, setSelectedTagHashes] = useState<string[]>(
    savedTags
  );

  const handleTagClick = (tagHash: string) => {
    if (selectedTagHashes.includes(tagHash)) {
      /* Remove Tag*/
      setSelectedTagHashes([...selectedTagHashes.filter((t) => t !== tagHash)]);
      tagHashesUpdated([...selectedTagHashes.filter((t) => t !== tagHash)]);
    } else {
      /* Add Tag*/
      if (selectedTagHashes.length === 3) {
        /* Notify users of Tag Limit: 3*/
        Modal.open(<p>{fireteamsLoc.ThereIsAMaximumOf3Tags}</p>);

        return;
      } else {
        setSelectedTagHashes([...selectedTagHashes, tagHash]);
        tagHashesUpdated([...selectedTagHashes, tagHash]);
      }
    }

    return;
  };

  return (
    <div className={classNames(styles.tagsWrapper, styles.selectTagWrapper)}>
      {allTagHashes.map((t, i) => {
        const tagDef = definitions.DestinyFireteamFinderLabelDefinition.get(t);

        return (
          <Button
            key={`${t}-${i}`}
            buttonType={"clear"}
            className={classNames(styles.tag, styles.filterView, {
              [styles.on]: selectedTagHashes.includes(t),
            })}
            onClick={() => handleTagClick(t)}
          >
            {tagDef?.displayProperties?.name}
            {selectedTagHashes.includes(t) ? <span>X</span> : null}
          </Button>
        );
      })}
    </div>
  );
};

export default FilterFireteamTags;
