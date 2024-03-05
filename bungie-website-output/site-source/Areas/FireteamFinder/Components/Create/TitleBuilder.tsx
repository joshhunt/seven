// Created by atseng, 2023
// Copyright Bungie, Inc.

import { CreateFireteamModalHeader } from "@Areas/FireteamFinder/Components/Create/CreateFireteamModalHeader";
import { CreateTitleInput } from "@Areas/FireteamFinder/Components/Create/CreateTitleInput";
import styles from "./TitleBuilder.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FaAngleRight } from "@react-icons/all-files/fa/FaAngleRight";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import modalStyles from "./CreateFireteamModals.module.scss";
import { Localizer } from "@bungie/localization";
import { Accordion, IAccordionItem } from "@UIKit/Layout/Accordion";
import React, { useState } from "react";

interface TitleBuilderProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderLabelGroupDefinition"
    | "DestinyFireteamFinderLabelDefinition"
  > {
  currentTitleStrings: string[];
  updateTitleHashes: React.Dispatch<React.SetStateAction<number[]>>;
  titleUpdated: (titleStrings: string[]) => void;
  closeModal: () => void;
  relevantActivitySetLabelHashes: number[];
}

const TitleBuilder: React.FC<TitleBuilderProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const [selectedStrings, setSelectedStrings] = useState<string[]>(
    props.currentTitleStrings ?? []
  );

  const labelGroupsDef = props.definitions.DestinyFireteamFinderLabelGroupDefinition.all();
  const labelsDef = props.definitions.DestinyFireteamFinderLabelDefinition.all();

  const getTitleHashes = (titleStrings: string[]) => {
    return titleStrings.map((ts) => {
      const label = Object.values(labelsDef).find(
        (l) => l.displayProperties?.name === ts
      );

      return label?.hash;
    });
  };

  const stringClicked = (chosenString: string) => {
    if (selectedStrings.includes(chosenString)) {
      //remove it
      setSelectedStrings([
        ...selectedStrings.filter((s) => s !== chosenString),
      ]);
      props.updateTitleHashes(
        getTitleHashes(selectedStrings.filter((s) => s !== chosenString))
      );
    } else {
      if (selectedStrings.length === 5) {
        Modal.open(<p>{fireteamsLoc.YouCanOnlySelectUpTo5}</p>);

        return;
      }

      //add it
      setSelectedStrings([...selectedStrings, chosenString]);
      props.updateTitleHashes(
        getTitleHashes([...selectedStrings, chosenString])
      );
    }
  };

  const titleStringSectionAccordionItem = (
    sectionHeader: string,
    titleStrings: string[]
  ): IAccordionItem => {
    return {
      triggerElement: (
        <div>
          <FaAngleRight />
          {sectionHeader}
        </div>
      ),
      triggerClassName: styles.trigger,
      collapsibleClassName: styles.collapsible,
      collapsibleElement: (
        <div className={styles.strings}>
          {titleStrings.map((s) => {
            return (
              <div
                className={classNames(styles.string, {
                  [styles.on]: selectedStrings.includes(s),
                })}
                key={`${sectionHeader}-${s}`}
                onClick={() => stringClicked(s)}
              >
                {s}
              </div>
            );
          })}
        </div>
      ),
    };
  };

  const accordionItems: IAccordionItem[] = Object.entries(labelGroupsDef)
    .sort((a, b) => b[1].descendingSortPriority - a[1].descendingSortPriority)
    .filter((lg) => lg[1]?.displayProperties?.name) //labels have a name in displayProperties
    .map((lg) => {
      const labelGroupDef = lg[1];
      const labelsForGroup = Object.values(labelsDef)?.filter(
        (l) => l?.groupHash?.toString() === lg[0]
      );
      const filteredForRelevance = labelsForGroup?.filter((l) =>
        props.relevantActivitySetLabelHashes.includes(l.hash)
      );
      const dedupedLabels = Array.from(
        new Set(filteredForRelevance?.map((l) => l.displayProperties.name))
      );

      return titleStringSectionAccordionItem(
        labelGroupDef.displayProperties.name,
        dedupedLabels
      );
    });

  return (
    <div className={modalStyles.createFireteamModal}>
      <CreateFireteamModalHeader
        title={fireteamsLoc.TitleBuilder}
        onSave={() => {
          props.titleUpdated(selectedStrings);
          props.closeModal();
        }}
        onClose={() => props.closeModal()}
      />
      <div className={styles.titleStringsWrapper}>
        <CreateTitleInput
          className={styles.titleInput}
          titleStrings={selectedStrings}
          openTitleBuilderOnClick={false}
          removeOnClick={true}
          updateTitleStrings={setSelectedStrings}
          placeholder={fireteamsLoc.SelectUpToFivePhrases}
        />
        <Accordion items={accordionItems} openClassName={styles.open} />
      </div>
    </div>
  );
};

export default withDestinyDefinitions(TitleBuilder, {
  types: [
    "DestinyFireteamFinderLabelGroupDefinition",
    "DestinyFireteamFinderLabelDefinition",
  ],
});
