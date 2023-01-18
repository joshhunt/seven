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
import React from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./OutrunTheEndSection.module.scss";

interface OutrunTheEndSectionProps {
  data?: BnetStackNebulaProductPage["outrun_section"];
  ctaBtnText?: string;
}

export const OutrunTheEndSection: React.FC<OutrunTheEndSectionProps> = (
  props
) => {
  const {
    bottom_header,
    bottom_bg,
    top_header,
    top_bg,
    weapon_img,
    info_blocks,
  } = props.data ?? {};

  const { mobile } = useDataStore(Responsive);

  const topBg = responsiveBgImageFromStackFile(
    top_bg?.desktop_bg,
    top_bg?.mobile_bg,
    mobile
  );
  const bottomBg = responsiveBgImageFromStackFile(
    bottom_bg?.desktop_bg,
    bottom_bg?.mobile_bg,
    mobile
  );

  return (
    <div
      className={styles.section}
      style={{ backgroundImage: `${topBg}, ${bottomBg}` }}
    >
      <div className={styles.sectionContent}>
        <LightfallSectionHeader
          heading={top_header?.heading}
          blurb={top_header?.blurb}
          alignment={"center"}
        />
        <PmpStackedInfoThumbBlocks
          data={info_blocks?.[0]}
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

        <img src={weapon_img?.url} className={styles.weaponImg} />

        <LightfallSectionHeader
          heading={bottom_header?.heading}
          blurb={bottom_header?.blurb}
          largeHeading={bottom_header?.large_heading}
          textBg={bottom_header?.text_bg?.url}
          classes={{ largeHeading: styles.weaponLargeHeading }}
          alignment={"center"}
        >
          <div className={styles.cta}>
            <p className={styles.ctaHeading}>{bottom_header?.cta_heading}</p>
            <Anchor
              className={styles.ctaLink}
              style={{ backgroundImage: bgImage(bottom_header?.cta_bg?.url) }}
              url={RouteHelper.DestinyBuyDetail({
                productFamilyTag: "Lightfall",
              })}
            >
              {bottom_header?.cta_link_text}
            </Anchor>
          </div>
        </LightfallSectionHeader>
        <Button
          url={RouteHelper.DestinyBuyDetail({ productFamilyTag: "Lightfall" })}
          className={styles.buyBtn}
        >
          {props.ctaBtnText}
        </Button>
      </div>
    </div>
  );
};
