// Created by atseng, 2022
// Copyright Bungie, Inc.

import { IRadioOption } from "@Areas/Fireteams/Shared/RadioButtons";
import { Localizer } from "@bungie/localization";

export class FireteamRadioOptions {
  public static playersCount(fireteamMaxSize: number) {
    const count = [1];

    for (let i = 2; i < fireteamMaxSize; i++) {
      count.push(i);
    }

    return count;
  }

  public static playersRadioOptions(fireteamMaxSize: number): IRadioOption[] {
    const playerCount = FireteamRadioOptions.playersCount(fireteamMaxSize);

    return playerCount?.map((p) => {
      return {
        id: p.toString(),
        label: p.toString(),
        value: p.toString(),
      };
    });
  }

  public static isScheduledRadioOptions(): IRadioOption[] {
    const fireteamsLoc = Localizer.Fireteams;

    return [
      {
        id: "now",
        label: fireteamsLoc.Now,
        value: "0",
      },
      {
        id: "scheduled",
        label: fireteamsLoc.Scheduled,
        value: "1",
      },
    ];
  }

  public static platformRadioOptions(): IRadioOption[] {
    const fireteamsLoc = Localizer.Fireteams;

    return [
      {
        id: "crossplay",
        label: fireteamsLoc.Crossplay,
        value: "0",
      },
      {
        id: "restricted",
        label: fireteamsLoc.OnlyOnMyPlatform,
        value: "1",
      },
    ];
  }

  public static hasMicRadioOptions(): IRadioOption[] {
    const fireteamsLoc = Localizer.Fireteams;

    return [
      {
        id: "yes",
        label: fireteamsLoc.Yes,
        value: "0",
      },
      {
        id: "no",
        label: fireteamsLoc.No,
        value: "1",
      },
    ];
  }

  public static isPublic(): IRadioOption[] {
    const fireteamsLoc = Localizer.Fireteams;

    return [
      {
        id: "yes",
        label: fireteamsLoc.Yes,
        value: "0",
      },
      {
        id: "no",
        label: fireteamsLoc.No,
        value: "1",
      },
    ];
  }
}
