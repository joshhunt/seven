// Created by larobinson, 2020
// Copyright Bungie, Inc.

import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Definitions } from "@Platform";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import * as React from "react";
type DestinyActivityModeDefinition = Definitions.DestinyActivityModeDefinition;

// Required props
interface IDestinyActivityModesSelectorProps
  extends D2DatabaseComponentProps<
    | "DestinyActivityModeDefinition"
    | "DestinyActivityTypeDefinition"
    | "DestinyActivityDefinition"
  > {
  className?: string;
  onChange?: (value: string) => void;
}

/**
 * DestinyActivityModesSelector - Replace this description
 *  *
 * @param {IDestinyActivityModesSelectorProps} props
 * @returns
 */
class DestinyActivityModesSelector extends React.Component<
  IDestinyActivityModesSelectorProps
> {
  private readonly createActivityOptions = () => {
    const parentModes: DestinyActivityModeDefinition[] = [];
    const childModes: DestinyActivityModeDefinition[] = [];
    const activityOptions: IDropdownOption[] = [];

    const allModes = this.props.definitions.DestinyActivityModeDefinition.all();
    const allModeHashes = Object.keys(allModes);

    // Separate into modes without parents and modes with parents
    allModeHashes.forEach((hash) => {
      const modeDefinition = allModes[hash];
      const hasParent = modeDefinition.parentHashes?.length >= 1;
      const parentMode = modeDefinition.parentHashes?.[0];
      const isNested = hasParent && allModes[parentMode].parentHashes;

      if (
        !modeDefinition.redacted &&
        modeDefinition.friendlyName !== "social"
      ) {
        if (hasParent && !isNested) {
          childModes.push(modeDefinition);
        } else if (
          !modeDefinition.parentHashes ||
          modeDefinition.parentHashes.length === 0
        ) {
          parentModes.push(modeDefinition);
        }
      }
    });

    // Sort arrays
    parentModes.sort((a, b) => a.index - b.index);
    childModes.sort((a, b) => a.index - b.index);

    // Assemble family
    const familyArray = parentModes.map((parent) => {
      return {
        parentMode: parent,
        childModes: childModes.filter(
          (child) => child.parentHashes[0] === parent.hash
        ),
      };
    });

    // Create options
    familyArray.forEach((obj) => {
      activityOptions.push({
        label: obj.parentMode.displayProperties.name,
        value: obj.parentMode.modeType.toString(),
        iconPath: obj.parentMode.displayProperties.icon,
      });

      obj.childModes.forEach((child) => {
        activityOptions.push({
          label: child.displayProperties.name,
          value: child.modeType.toString(),
          iconPath: child.displayProperties.icon,
          style: { paddingLeft: "3rem" },
        });
      });
    });

    return activityOptions;
  };

  public render() {
    return (
      <Dropdown
        options={this.createActivityOptions()}
        className={this.props.className}
        onChange={(value) => this.props.onChange?.(value)}
      />
    );
  }
}

export default withDestinyDefinitions(DestinyActivityModesSelector, {
  types: [
    "DestinyActivityModeDefinition",
    "DestinyActivityTypeDefinition",
    "DestinyActivityDefinition",
  ],
});
