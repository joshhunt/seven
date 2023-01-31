// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { RouteHelper } from "@Routes/RouteHelper";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import {
  bgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import React, { useMemo } from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./OutrunTheEndSection.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";

interface OutrunTheEndSectionProps {
  data?: any;
  ctaBtnText?: string;
}

export const OutrunTheEndSection: React.FC<OutrunTheEndSectionProps> = (
  props
) => {
  const { data } = props;
  const {
    bottom_header,
    desktop_bg,
    mobile_bg,
    heading,
    blurb,
    weapon_img,
    content,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? mobile_bg?.url : desktop_bg?.url,
      }),
      [data, mobile]
    )
  );

  return (
    <div
      className={styles.section}
      style={{ backgroundImage: `url(${imgs.background})` }}
    >
      <div className={styles.sectionContent}>
        <LightfallSectionHeader
          heading={heading}
          blurb={blurb}
          classes={{
            root: styles.header,
            content: styles.content,
          }}
        />

        <PmpStackedInfoThumbBlocks
          data={content?.[0]}
          classes={{
            root: styles.infoBlocks,
            heading: styles.heading,
            blurb: styles.blurb,
            textWrapper: styles.blockTextWrapper,
            blockWrapper: styles.blockWrapper,
            thumb: styles.thumbnail,
            thumbWrapper: styles.thumbWrapper,
          }}
          reverseAlignment={true}
        />
      </div>
    </div>
  );
};
