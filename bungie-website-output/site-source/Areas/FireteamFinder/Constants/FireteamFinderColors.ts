// Created by larobinson, 2024
// Copyright Bungie, Inc.
type FireteamFinderColorsType = Record<number, string>;

export class FireteamFinderColors {
  /**
   * This is a way to link the root activity hash to the color
   * Ideally, we would be able to use the colors passed down in content, but unfortunately they do not match the colors used in the game
   **/

  public static readonly hexCode: FireteamFinderColorsType = {
    230724421: "#F9B3CC",
    278399529: "#00D4d4",
    837763036: "#DEBDA4",
    1851422462: "#74A5C5",
    2207641731: "#D15E57",
    3648411525: "#5C91B8",
    3803311165: "#565555",
    4019545829: "#19C8A4",
    0: "AAAAAA",
  };
}
