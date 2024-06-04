// Created by atseng, 2022
// Copyright Bungie, Inc.

import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { Characters } from "@Platform";
import React from "react";
import styles from "./FireteamTags.module.scss";

interface FireteamCharacterTagProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  character: Characters.DestinyCharacterComponent;
  subclassDefinition: DestinyDefinitions.DestinyInventoryItemLiteDefinition;
}

const FireteamCharacterTag: React.FC<FireteamCharacterTagProps> = (props) => {
  const characterLight = (
    <>
      <span className={styles.powerIcon}>✧</span>
      {props.character?.light}
    </>
  );

  return (
    <div className={styles.character}>
      {props.subclassDefinition && (
        <img
          className={styles.subclassIcon}
          src={props.subclassDefinition.displayProperties.icon}
          alt={props.subclassDefinition.displayProperties.name}
        />
      )}
      <span className={styles.class}>
        {
          props.definitions.DestinyClassDefinition.get(
            props.character?.classHash
          )?.displayProperties?.name
        }
      </span>
      <span className={styles.characterLight}>{characterLight}</span>
    </div>
  );
};

export default withDestinyDefinitions(FireteamCharacterTag, {
  types: ["DestinyClassDefinition"],
});
