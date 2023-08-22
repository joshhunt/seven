// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import React from "react";
import { BnetStackPmpStackedInfoThumbBlocks } from "../../../../../../Generated/contentstack-types";
import styles from "./ThumbnailRiver.module.scss";

interface ThumbnailRiver {
  data?: BnetStackPmpStackedInfoThumbBlocks;
}

export const ThumbnailRiver: React.FC<ThumbnailRiver> = ({ data }) => (
  <PmpStackedInfoThumbBlocks
    data={data}
    classes={{
      root: styles.infoBlocks,
      heading: styles.heading,
      blurb: styles.blurb,
      textWrapper: styles.blockTextWrapper,
      blockWrapper: styles.blockWrapper,
      thumb: styles.thumbnail,
      thumbWrapper: styles.thumbWrapper,
    }}
  />
);
