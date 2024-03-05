// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./FireteamTags.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Characters } from "@Platform";
import React from "react";

interface FireteamCharacterTagProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  character: Characters.DestinyCharacterComponent;
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
