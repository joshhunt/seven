import * as React from "react";
import { Characters, Definitions } from "@Platform";
import styles from "./DestinyCharacterCard.module.scss";
import classNames from "classnames";
import { StringUtils } from "@Utilities/StringUtils";

interface CharacterDefinitions {
  races: { [key: number]: Definitions.DestinyRaceDefinition };
  classes: { [key: number]: Definitions.DestinyClassDefinition };
  items: { [key: number]: Definitions.DestinyInventoryItemDefinition };
}

interface IDestinyCharacterCardProps extends React.HTMLProps<HTMLDivElement> {
  character: Characters.DestinyCharacterComponent;
  definitions: CharacterDefinitions;
  children?: undefined; // Disallow children
}

interface IDestinyCharacterCardState {}

/**
 * Renders a Destiny character card
 *  *
 * @param {IDestinyCharacterCardProps} props
 * @returns
 */
export class DestinyCharacterCard extends React.Component<
  IDestinyCharacterCardProps,
  IDestinyCharacterCardState
> {
  constructor(props: IDestinyCharacterCardProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { character, definitions, className, ...rest } = this.props;

    let raceDef: Definitions.DestinyRaceDefinition = null;
    let classDef: Definitions.DestinyClassDefinition = null;
    let emblemDef: Definitions.DestinyInventoryItemDefinition = null;
    if (definitions) {
      raceDef = definitions.races[character.raceHash];
      classDef = definitions.classes[character.classHash];
      emblemDef = definitions.items[character.emblemHash];
    }

    const classes = classNames(styles.character, className);

    return (
      <div
        className={classes}
        style={{ backgroundImage: `url(${emblemDef.secondarySpecial})` }}
        {...rest}
      >
        <div className={styles.avatar}>
          <div
            className={styles.avatarImage}
            style={{ backgroundImage: `url(${emblemDef.secondaryOverlay})` }}
          />
        </div>
        <div className={styles.text}>
          <div className={styles.identity}>
            <div className={styles.class}>
              {classDef.genderedClassNamesByGenderHash[character.genderHash]}
            </div>
            <div className={styles.about}>
              {raceDef.genderedRaceNamesByGenderHash[character.genderHash]}
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
