// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { LightfallTripleImageSet } from "@Areas/Destiny/Lightfall/components/LightfallTripleImageSet/LightfallTripleImageSet";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { responsiveBgImage } from "@Utilities/ContentStackUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useMemo } from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./OurEndSection.module.scss";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";

interface OurEndSectionProps {
  data?: any;
}

export const OurEndSection: React.FC<OurEndSectionProps> = (props) => {
  const { data } = props;
  const { title, blurb, button = [], desktop_bg, desktop_video, mobile_bg } =
    data ?? {};
  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? mobile_bg?.url : null,
      }),
      [data, mobile]
    )
  );

  return (
    <div
      className={styles.section}
      style={{ backgroundImage: imgs.background && `url(${imgs.background})` }}
    >
      {!mobile && desktop_video && (
        <video
          className={styles.heroVid}
          poster={desktop_bg?.url}
          autoPlay
          muted
          playsInline
          loop
          controls={false}
        >
          <source src={desktop_video?.url} type={"video/mp4"} />
        </video>
      )}
      <div className={styles.container}>
        <LightfallSectionHeader
          heading={title}
          blurb={blurb}
          dividerColor="#D40066"
          classes={{
            content: styles.content,
            title: styles.title,
          }}
        >
          {button.map((b: any) => (
            <LightfallTrailerBtn key={b.uid} {...b} className={styles.btn}>
              <>
                <img className={styles.btnIcon} src={b?.icon?.url} alt="" />
                {b.label}
              </>
            </LightfallTrailerBtn>
          ))}
        </LightfallSectionHeader>
      </div>
    </div>
  );
};
