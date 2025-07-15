// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DataReference } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ScrollingSeasonCarousel } from "@UI/Destiny/ScrollingSeasonCarousel";
import { bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import React from "react";
import { BnetStackPmpRewardsCarousel } from "../../../Generated/contentstack-types";

type PmpRewardsCarouselProps = DataReference<
  "pmp_rewards_carousel",
  BnetStackPmpRewardsCarousel
> & {
  classes?: {
    root?: string;
  };
};

export const PmpRewardsCarousel: React.FC<PmpRewardsCarouselProps> = ({
  data,
  classes,
}) => {
  const { mobile } = useDataStore(Responsive);

  // Build seasons pass for the carousel
  const rankRows =
    data?.desktop_images?.map((img, i) => {
      return (
        <div key={i} style={{ backgroundImage: bgImageFromStackFile(img) }} />
      );
    }) ?? [];

  const mobileRankRows =
    data?.mobile_images?.map((img, i) => {
      return (
        <div key={i} style={{ backgroundImage: bgImageFromStackFile(img) }} />
      );
    }) ?? [];

  return (
    <div>
      <ScrollingSeasonCarousel
        showProgress={false}
        topLabel={<p>{data?.top_heading}</p>}
        bottomLabel={<p>{data?.bottom_heading}</p>}
      >
        {mobile ? mobileRankRows : rankRows}
      </ScrollingSeasonCarousel>
    </div>
  );
};
