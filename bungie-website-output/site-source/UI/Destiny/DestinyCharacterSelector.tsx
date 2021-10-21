// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinyCharacterSelector.module.scss";
import {
  withDestinyDefinitions,
  D2DatabaseComponentProps,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import { Characters } from "@Platform";

// Required props
interface IDestinyCharacterSelectorProps
  extends D2DatabaseComponentProps<"DestinyClassDefinition"> {
  characterComponent: { [key: string]: Characters.DestinyCharacterComponent };
  onChange: (value: string) => void;
  defaultCharacterId?: string;
}

// Default props - these will have values set in DestinyCharacterSelector.defaultProps
interface DefaultProps {}

type Props = IDestinyCharacterSelectorProps & DefaultProps;

interface IDestinyCharacterSelectorState {
  selectedValue: string;
}

/**
 * DestinyCharacterSelector - A Destiny character dropdown selector
 *  *
 * @param {IDestinyCharacterSelectorProps} props
 * @returns
 */
class DestinyCharacterSelector extends React.Component<
  Props,
  IDestinyCharacterSelectorState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedValue:
        typeof this.props.defaultCharacterId !== "undefined"
          ? this.props.defaultCharacterId
          : "",
    };
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const characterOptions: IDropdownOption[] = [];

    Object.entries(this.props.characterComponent)?.forEach(
      (value: [string, Characters.DestinyCharacterComponent]) => {
        const charComponent = value[1];
        const characterLight = `✧ ${charComponent.light}`;

        characterOptions.push({
          iconPath: charComponent.emblemPath,
          style: {
            backgroundColor:
              typeof charComponent.emblemColor !== "undefined"
                ? `rgb(${charComponent.emblemColor.red}, ${charComponent.emblemColor.blue}, ${charComponent.emblemColor.green})`
                : `none`,
          },
          label: (
            <React.Fragment>
              {
                this.props.definitions.DestinyClassDefinition?.get(
                  charComponent?.classHash
                ).displayProperties.name
              }{" "}
              <span className={styles.light}>{characterLight}</span>
            </React.Fragment>
          ),
          value: charComponent.characterId,
          mobileLabel: `${
            this.props.definitions.DestinyClassDefinition?.get(
              charComponent?.classHash
            ).displayProperties.name
          } ${characterLight}`,
        });
      }
    );

    return (
      <Dropdown
        onChange={(newValue: string) => this.onDropdownChange(newValue)}
        options={characterOptions}
        selectedValue={this.state.selectedValue}
      />
    );
  }

  private onDropdownChange(newValue: string) {
    this.props.onChange(newValue);

    this.setState({
      selectedValue: newValue,
    });
  }
}

export default withDestinyDefinitions(DestinyCharacterSelector, {
  types: ["DestinyClassDefinition"],
});
