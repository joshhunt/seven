// Created by atseng, 2023
// Copyright Bungie, Inc.
import { DestinyDefinitions } from "@Definitions";

export class GuardianRankUtils {
  public static BackgroundImagesStack(
    def: DestinyDefinitions.DestinyGuardianRankDefinition,
    guardianRankConstants: DestinyDefinitions.DestinyGuardianRankConstantsDefinition,
    circleBgPath: string
  ) {
    if (!def) {
      return "";
    }

    let backgroundImages = `url(${def.foregroundImagePath})`;

    if (def.overlayImagePath) {
      backgroundImages += `, url(${def.overlayImagePath})`;
    }

    if (def.overlayMaskImagePath) {
      backgroundImages += `, url(${def.overlayMaskImagePath})`;
    }

    backgroundImages += `, url(${circleBgPath}), url(${guardianRankConstants.iconBackgrounds.backgroundPlateBlackAlphaImagePath})`;

    return backgroundImages;
  }
}
