// Created by larobinson, 2024
// Copyright Bungie, Inc.

import { FireteamFinderValueTypes } from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
import { Localizer } from "@bungie/localization/Localizer";
import { DefinitionsFetcherized } from "@Database/DestinyDefinitions/DestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import { IDropdownOption } from "@UI/UIKit/Forms/Dropdown";

export interface IOptionCategory {
  hash: number;
  options: IDropdownOption[];
  defaultBrowseValue: string;
  defaultCreateValue: string;
}

export class FireteamOptions {
  private readonly allOptionDefinitions: {
    [p: string]: DestinyDefinitions.DestinyFireteamFinderOptionDefinition;
  } = {};

  constructor(
    private readonly OptionDefinitions: DefinitionsFetcherized<
      "DestinyFireteamFinderOptionDefinition"
    >
  ) {
    this.allOptionDefinitions = OptionDefinitions.all();
  }

  public createOptionsTree = () => {
    const _addOptionalNull = (optionCategory: IOptionCategory) => {
      optionCategory.options.unshift({
        label: Localizer.fireteams.Any,
        value: "-1",
      });
    };

    const optionTree: Record<string, IOptionCategory> = {};

    // tags titles and activities are special cases
    Object.values(this.allOptionDefinitions)
      .sort((a, b) => b.descendingSortPriority - a.descendingSortPriority)
      .forEach((option) => {
        const optionCategoryString = option.hash.toString();

        optionTree[optionCategoryString] = {} as IOptionCategory;

        const optionCategory = optionTree[optionCategoryString];
        optionCategory.options = [];
        optionCategory.hash = option.hash;

        option?.values.valueDefinitions.forEach((leafOption) => {
          const valueString = leafOption?.value.toString();

          if (leafOption.flags === 1) {
            optionCategory.defaultCreateValue = valueString;
            optionCategory.defaultBrowseValue = valueString;
          }
          if (leafOption.flags === 2) {
            optionCategory.defaultBrowseValue = valueString;
          }

          optionCategory.options.push({
            value: valueString,
            label: leafOption?.displayProperties?.name,
          });
        });
      });

    optionTree["100000000"] = {} as IOptionCategory;

    // The game doesn't really have this concept, but we need to add it for the UI
    optionTree["100000000"].options = [
      {
        label: Localizer.fireteams.Now,
        value: "0",
      },
      {
        label: Localizer.fireteams.Scheduled,
        value: "1",
      },
    ];

    optionTree["100000000"].defaultCreateValue = "0";
    optionTree["100000000"].defaultBrowseValue = "1";

    return optionTree;
  };
}
