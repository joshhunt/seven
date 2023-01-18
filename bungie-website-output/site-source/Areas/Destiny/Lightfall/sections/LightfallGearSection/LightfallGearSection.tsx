// Created by v-ahipp, 2023
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useMemo } from "react";
import styles from "./LightfallGearSection.module.scss";
import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { PmpMediaCarousel } from "@UI/Marketing/Fragments/PmpMediaCarousel";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";

interface LightfallGearSectionProps {
  data?: any;
}

export const LightfallGearSection: React.FC<LightfallGearSectionProps> = (
  props
) => {
  const {
    title,
    blurb,
    desktop_bg_top,
    mobile_bg_top,
    desktop_bg_bottom,
    mobile_bg_bottom,
    button,
    content = [],
  } = props.data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        topBg: mobile ? mobile_bg_top?.url : desktop_bg_top?.url,
        bottomBg: mobile ? mobile_bg_bottom?.url : desktop_bg_bottom?.url,
      }),
      [desktop_bg_top, mobile_bg_top, desktop_bg_bottom, mobile_bg_bottom]
    )
  );

  return (
    <div
      className={styles.section}
      style={{ backgroundImage: `url(${imgs.bottomBg})` }}
    >
      {imgs?.topBg ? (
        <img className={styles.topBg} src={imgs.topBg} alt="" />
      ) : null}

      <div className={styles.wrap}>
        <div className={styles.container}>
          <LightfallSectionHeader
            heading={title}
            blurb={blurb}
            dividerColor="#51ADFF"
            classes={{
              root: styles.header,
              content: styles.content,
            }}
          />

          {button?.map((b: any) => (
            <LightfallTrailerBtn key={b.uid} {...b} className={styles.btn}>
              <>
                <img className={styles.btnIcon} src={b?.icon?.url} alt="" />
                {b.label}
              </>
            </LightfallTrailerBtn>
          ))}
        </div>

        {content.map((data: any) => {
          return <PmpMediaCarousel key={data.uid} data={data} classes={{}} />;
        })}
      </div>
    </div>
  );
};
