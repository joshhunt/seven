// Created by atseng, 2022
// Copyright Bungie, Inc.

export type PageType = "collections" | "triumphs";

export type CollectionType = "item" | "badge" | "none" | "lore" | "stats";

export type sortMode = "Default" | "Completion" | "Closest" | "Farthest";

export type filterMode = "All" | "Career" | "Seasonal" | "Weekly";

export const TraitSortMap = {
  All: 1434215347,
  Career: 4263853822,
  Seasonal: 2230116619,
  Weekly: 2356777566,
};
