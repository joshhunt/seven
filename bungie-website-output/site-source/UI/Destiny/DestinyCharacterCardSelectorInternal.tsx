// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { BungieMembershipType } from "@Enum";
import { DestinyMembershipDataStore } from "@Global/DataStore/DestinyMembershipDataStore";
import { Characters } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "@UI/Destiny/DestinyCharacterCardSelector.module.scss";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";
import React, { ReactElement, useEffect, useState } from "react";

interface DestinyCharacterCardSelectorInternalProps
  extends D2DatabaseComponentProps<
    | "DestinyClassDefinition"
    | "DestinyRaceDefinition"
    | "DestinyGenderDefinition"
    | "DestinyInventoryItemLiteDefinition"
  > {
  characters: { [p: string]: Characters.DestinyCharacterComponent };
  selectedCharacterId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  dataStore: DestinyMembershipDataStore;
  showEmptyStates: boolean;
  linkToGear: boolean;
  loaded: () => void;
}

interface ICharacterProps {
  id: string;
  iconPath: string;
  backgroundPath: string;
  class: string;
  race: string;
  gender: string;
  light: ReactElement;
}

const DestinyCharacterCardSelectorInternal: React.FC<DestinyCharacterCardSelectorInternalProps> = (
  props
) => {
  const [charactersList, setCharactersList] = useState<ICharacterProps[]>([]);

  const mapCharacters = () => {
    const characterList: ICharacterProps[] = [];

    Object.entries(props.characters).forEach(
      (value: [string, Characters.DestinyCharacterComponent]) => {
        const charComponent = value[1];

        const def = props.definitions.DestinyInventoryItemLiteDefinition.get(
          charComponent.emblemHash
        );

        characterList.push({
          iconPath: def.secondaryOverlay,
          backgroundPath: def.secondarySpecial,
          light: (
            <React.Fragment>
              <span className={styles.light}>
                <span>✧</span>
                {charComponent.light}
              </span>
            </React.Fragment>
          ),
          class: props.definitions.DestinyClassDefinition?.get(
            charComponent?.classHash
          ).displayProperties.name,
          id: charComponent.characterId,
          race: props.definitions.DestinyRaceDefinition.get(
            charComponent?.raceHash
          ).displayProperties.name,
          gender: props.definitions.DestinyGenderDefinition.get(
            charComponent?.genderHash
          ).displayProperties.name,
        });
      }
    );

    setCharactersList(characterList);

    if (props.selectedCharacterId === "" && characterList.length) {
      updateSelectedCharacter(characterList[0].id);
    }

    props.loaded();
  };

  const updateSelectedCharacter = (id: string) => {
    props.dataStore.actions.updateCharacter(id);
  };

  const characterItem = (characterProps: ICharacterProps) => {
    return (
      <Anchor
        url={
          props.linkToGear &&
          RouteHelper.Gear(
            props?.membershipId,
            props?.membershipType,
            characterProps.id
          )
        }
        onClick={(e) => {
          !props.linkToGear && e.preventDefault();

          updateSelectedCharacter(characterProps.id);
        }}
        key={characterProps.id}
        className={classNames(styles.character, {
          [styles.selected]: characterProps.id === props?.selectedCharacterId,
        })}
        style={{ backgroundImage: `url(${characterProps?.backgroundPath})` }}
      >
        <div
          className={styles.icon}
          style={{ backgroundImage: `url(${characterProps.iconPath})` }}
        />
        <div className={styles.text}>
          <h4>{characterProps.class}</h4>
          <h5>{characterProps.race}</h5>
        </div>
        {characterProps.light}
      </Anchor>
    );
  };

  const renderEmptyCharacterItems = (numCharacters: number) => {
    return [...Array(3 - numCharacters)].map((e, i) => (
      <EmptyCharacterItem key={i} index={numChars + (i + 1)} />
    ));
  };

  useEffect(() => {
    mapCharacters();
  }, [props.characters]);

  const numChars = charactersList.length;

  return (
    <div className={styles.characterList}>
      {numChars > 0 &&
        charactersList.map((value, index) => {
          return characterItem(value);
        })}
      {props.showEmptyStates && renderEmptyCharacterItems(numChars)}
    </div>
  );
};

export default withDestinyDefinitions(DestinyCharacterCardSelectorInternal, {
  types: [
    "DestinyClassDefinition",
    "DestinyRaceDefinition",
    "DestinyGenderDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});

interface IEmptyCharacterItemProps {
  index: number;
}

const EmptyCharacterItem: React.FC<IEmptyCharacterItemProps> = (props) => {
  return (
    <div
      key={props.index}
      className={classNames(styles.character, styles.emptyCharacter)}
    >
      {Localizer.Format(Localizer.Profile.CharacterSlotNumber, {
        number: props.index.toString(),
      })}
    </div>
  );
};
