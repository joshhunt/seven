import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import * as React from "react";
import { Characters } from "@Platform";
import styles from "./DestinyCharacterCard.module.scss";
import classNames from "classnames";
import { StringUtils } from "@Utilities/StringUtils";

interface IDestinyCharacterCardProps
  extends React.HTMLProps<HTMLDivElement>,
    D2DatabaseComponentProps<
      | "DestinyClassDefinition"
      | "DestinyRaceDefinition"
      | "DestinyInventoryItemLiteDefinition"
    > {
  character: Characters.DestinyCharacterComponent;
  children?: undefined; // Disallow children
}

interface IDestinyCharacterCardState {}

/**
 * Renders a Destiny character card
 *  *
 * @param {IDestinyCharacterCardProps} props
 * @returns
 */
class DestinyCharacterCard extends React.Component<
  IDestinyCharacterCardProps,
  IDestinyCharacterCardState
> {
  constructor(props: IDestinyCharacterCardProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { character, className, definitions, ...rest } = this.props;

    if (!definitions || !character) {
      return null;
    }

    const raceDef = definitions.DestinyRaceDefinition.get(character?.raceHash);
    const classDef = definitions.DestinyClassDefinition.get(
      character?.classHash
    );
    const emblemDef = definitions.DestinyInventoryItemLiteDefinition.get(
      character?.emblemHash
    );

    const classes = classNames(styles.character, className);

    return (
      <div
        className={classes}
        style={{ backgroundImage: `url(${emblemDef?.secondarySpecial ?? ""})` }}
        {...rest}
      >
        <div className={styles.avatar}>
          <div
            className={styles.avatarImage}
            style={{
              backgroundImage: `url(${emblemDef?.secondaryOverlay ?? ""})`,
            }}
          />
        </div>
        <div className={styles.text}>
          <div className={styles.identity}>
            <div className={styles.class}>
              {classDef?.genderedClassNamesByGenderHash[character.genderHash] ??
                ""}
            </div>
            <div className={styles.about}>
              {raceDef?.displayProperties?.name ?? ""}
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.light}>
              {StringUtils.LightIcon} {character.light}
            </div>
            <div className={styles.level}>
              {character.levelProgression.level}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withDestinyDefinitions(DestinyCharacterCard, {
  types: [
    "DestinyClassDefinition",
    "DestinyRaceDefinition",
    "DestinyInventoryItemLiteDefinition",
  ],
});
