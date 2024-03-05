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

        const isMinGuardianRankType =
          optionCategoryString === FireteamFinderValueTypes.minGuardianRank;

        option?.values.valueDefinitions.forEach((leafOption) => {
          const valueString = leafOption?.value.toString();

          if (leafOption.flags === 1) {
            optionCategory.defaultCreateValue = valueString;
            optionCategory.defaultBrowseValue = valueString;
          }
          if (leafOption.flags === 2) {
            optionCategory.defaultBrowseValue = valueString;
          }

          const minGuardianRankLabel = leafOption?.displayProperties?.name;
          const label =
            Localizer.fireteams[
              minGuardianRankLabel.toLowerCase().replaceAll(" ", "")
            ];

          optionCategory.options.push({
            value: valueString,
            label: isMinGuardianRankType ? minGuardianRankLabel : label,
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

// // Created by atseng, 2022
// // Copyright Bungie, Inc.
//
// import {IRadioOption} from "@Areas/FireteamFinder/Components/Shared/RadioButtons";
// import {ValidFireteamFinderValueTypes} from "@Areas/FireteamFinder/Constants/FireteamValueTypes";
// import {Localizer} from "@bungie/localization";
// import {IDropdownOption} from "@UIKit/Forms/Dropdown";
//
// export interface IFireteamListingValue
// {
// 	id: string;
// 	label: string;
// 	valueType: ValidFireteamFinderValueTypes;
// 	values: string[];
// }
//
// export class FireteamOptions
// {
//
// 	public static playersCount(fireteamMaxSize: number)
// 	{
// 		const count = [];
//
// 		for (let i = 1; i <= fireteamMaxSize; i++)
// 		{
// 			count.push(i);
// 		}
//
// 		return count;
// 	}
//
// 	public static playersOptions(fireteamMaxSize: number): IRadioOption[] & IDropdownOption[]
// 	{
// 		const playerCount = FireteamOptions.playersCount(fireteamMaxSize);
//
// 		return playerCount?.map((p) =>
// 		{
// 			return {
// 				id: p.toString(),
// 				label: p.toString(),
// 				value: p.toString()
// 			}
// 		});
// 	}
//
// 	public static isScheduledOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [{
// 			id: "now",
// 			label: Localizer.fireteams.Now,
// 			value: "0"
// 		}, {
// 			id: "scheduled",
// 			label: Localizer.fireteams.Scheduled,
// 			value: "1"
// 		}];
// 	}
//
// 	public static applicationOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [{
// 			id: "auto",
// 			label: Localizer.fireteams.AutoJoin,
// 			value: "0",
// 		}, {
// 			id: "apply",
// 			label: Localizer.fireteams.ApplicationRequired,
// 			value: "1"
// 		}];
// 	}
//
// 	public static joinSettingOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [{
// 			id: "online",
// 			label: Localizer.fireteams.OnlinePlayersOnly,
// 			value: "0"
// 		}, {
// 			id: "offline",
// 			label: Localizer.fireteams.AllowOfflinePlayers,
// 			value: "1"
// 		}];
// 	}
//
// 	public static platformOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [{
// 			id: "all-platforms",
// 			label: Localizer.fireteams.AllPlatforms,
// 			value: "0"
// 		}, {
// 			id: "console",
// 			label: Localizer.fireteams.ConsolePreferred,
// 			value: "1"
// 		}, {
// 			id: "pc",
// 			label: Localizer.fireteams.PcPreferred,
// 			value: "2"
// 		}];
// 	}
//
// 	public static hasMicOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [
// 	 	{
// 			id: "no",
// 			label: Localizer.fireteams.MicNotRequired,
// 			value: "0"
// 		},
// 		{
// 			id: "yes",
// 			label: Localizer.fireteams.MicRequired,
// 			value: "1"
// 		}];
// 	}
//
// 	public static isPublicOptions(): IRadioOption[] & IDropdownOption[]
// 	{
//
// 		return [{
// 			id: "yes",
// 			label: Localizer.fireteams.Yes,
// 			value: "0"
// 		}, {
// 			id: "no",
// 			label: Localizer.fireteams.No,
// 			value: "1"
// 		}];
// 	}
//
// 	public static localeOptions(): IRadioOption[] & IDropdownOption[]
// 	{
// 		return [
// 			{
// 				id: "all-languages",
// 				label: Localizer.fireteams.AllLanguages,
// 				value: "1983949452"
// 			},
// 			{
// 				id: "English",
// 				label: Localizer.Languages["en"],
// 				value: "2536594043"
// 			},
// 			{
// 				id: "French",
// 				label: Localizer.Languages["fr"],
// 				value: "3429294921"
// 			},
// 			{
// 				id: "German",
// 				label: Localizer.Languages["de"],
// 				value: "1075153415"
// 			},
// 			{
// 				id: "Italian",
// 				label: Localizer.Languages["it"],
// 				value: "1313995651"
// 			},
// 			{
// 				id: "Portuguese",
// 				label: Localizer.Languages["pt-br"],
// 				value: "1839712070"
//
// 			},
// 			{
// 				id: "Spanish",
// 				label: Localizer.Languages["es"],
// 				value: "763883235"
// 			},
// 			{
// 				id: "Polish",
// 				label: Localizer.Languages["pl"],
// 				value: "1852914198"
// 			},
// 			{
// 				id: "Russian",
// 				label: Localizer.Languages["ru"],
// 				value: "3941764432"
// 			},
// 			{
// 				id: "Japanese",
// 				label: Localizer.Languages["ja"],
// 				value: "1656013252"
// 			},
// 			{
// 				id: "Korean",
// 				label: Localizer.Languages["ko"],
// 				value: "3871048525"
// 			},
// 			{
// 				id: "Mandarin",
// 				label: Localizer.Languages["zh-chs"],
// 				value: "1114268393"
// 			},
// 			{
// 				id: "Cantonese",
// 				label: Localizer.Languages["zh-cht"],
// 				value: "3179466437"
// 			}
// 		]
// 	}
// }
