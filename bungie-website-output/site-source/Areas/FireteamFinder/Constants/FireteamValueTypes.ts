// Created by larobinson, 2023
// Copyright Bungie, Inc.

export type FireteamFinderValueTypesKeys = keyof typeof FireteamFinderValueTypes;
export type ValidFireteamFinderValueTypes = typeof FireteamFinderValueTypes[FireteamFinderValueTypesKeys];

export const FireteamFinderValueTypes = {
  activity: "659460014",
  title: "41817931",
  tags: "596184710",
  applicationRequirement: "3211435268",
  joinSetting: "848039488",
  platform: "3154631366",
  size: "3171466570",
  mic: "3027343179",
  locale: "2118214747",
  minGuardianRank: "4213007492",
  scheduled: "100000000",
} as const;

export type FireteamFinderValueGroupTypesKeys = keyof typeof FireteamFinderValueGroupTypes;
export type ValidFireteamFinderValueGroupTypes = typeof FireteamFinderValueGroupTypes[FireteamFinderValueGroupTypesKeys];

export const FireteamFinderValueGroupTypes = {
  titleGroup: "507358802",
  tagGroup: "2661136296",
  joinSettingGroup: "3934189557",
  sizeGroup: "2903655180",
  micGroup: "2701937801",
  localeGroup: "1657872321",
  minGuardianRankGroup: "1081843287",
} as const;
