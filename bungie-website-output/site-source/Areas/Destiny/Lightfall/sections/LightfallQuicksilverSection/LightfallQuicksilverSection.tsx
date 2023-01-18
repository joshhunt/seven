// Created by v-ahipp, 2023
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
import styles from "./LightfallQuicksilverSection.module.scss";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallAnimatedText } from "@Areas/Destiny/Lightfall/components/LightfallAnimatedText/LightfallAnimatedText";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";

interface LightfallQuicksilverSectionProps {
  data?: any;
}

export const LightfallQuicksilverSection: React.FC<LightfallQuicksilverSectionProps> = (
  props
) => {
  const {
    title,
    title_bg,
    heading,
    heading_bg,
    blurb,
    mobile_bg,
    desktop_bg,
    weapon_img,
    button,
  } = props.data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? mobile_bg?.url : desktop_bg?.url,
        weapon: weapon_img?.url,
      }),
      [desktop_bg, mobile_bg, weapon_img]
    )
  );

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: imgs?.background && `url(${imgs?.background})`,
      }}
    >
      <img src={weapon_img?.url} className={styles.weaponImg} alt={title} />

      <LightfallAnimatedText className={styles.title} bg={title_bg}>
        {title}
      </LightfallAnimatedText>

      <h2 className={styles.titleSmall}>{title}</h2>
      <div className={styles.content}>
        <h3
          className={styles.heading}
          style={
            {
              "--quicksilver-link-bg":
                heading_bg?.url && `url(${heading_bg.url})`,
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={sanitizeHTML(heading)}
        />
        <p className={styles.blurb}>{blurb}</p>
        {button?.map(({ label, uid, ...b }: any) => (
          <PmpButton key={uid} {...b} className={styles.buyBtn}>
            {label}
          </PmpButton>
        ))}
      </div>
    </div>
  );
};
