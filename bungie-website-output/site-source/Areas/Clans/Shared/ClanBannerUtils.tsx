// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ClanBanner, Utilities } from "@Platform";
import React from "react";

export class ClanBannerUtils {
  public static getImagePathFromBannerSource(
    items: { [p: number]: string },
    id: number
  ): string {
    return items[id];
  }

  public static getColorStringFromBannerSource(
    items: { [p: number]: Utilities.PixelDataARGB },
    id: number
  ): string {
    const color = items[id];

    return `${color?.red || 0},${color?.green || 0},${color?.blue || 0}`;
  }

  public static getDecalFromBannerSource(
    items: { [p: number]: ClanBanner.ClanBannerDecal },
    id: number
  ): ClanBanner.ClanBannerDecal {
    return items[id];
  }
}
