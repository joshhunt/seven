// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { responsiveBgImage } from "@Utilities/ContentStackUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useMemo } from "react";
import styles from "./LightfallNeonSection.module.scss";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";

interface LightfallNeonSectionProps {
  data?: any;
}

export const LightfallNeonSection: React.FC<LightfallNeonSectionProps> = (
  props
) => {
  const { data } = props;
  const { title, blurb, button, desktop_bg, mobile_bg, content = [] } =
    data ?? {};

  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile ? mobile_bg?.url : desktop_bg?.url,
      }),
      [mobile, desktop_bg, mobile_bg]
    )
  );

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: imgs?.background && `url(${imgs?.background})`,
      }}
    >
      <div className={styles.container}>
        <LightfallSectionHeader
          heading={title}
          blurb={blurb}
          dividerColor="#FF4BC5"
          classes={{
            root: styles.header,
            content: styles.content,
          }}
        >
          {button?.map((b: any) => (
            <LightfallTrailerBtn key={b.uid} {...b} className={styles.btn}>
              <>
                <img className={styles.btnIcon} src={b?.icon?.url} alt="" />
                {b.label}
              </>
            </LightfallTrailerBtn>
          ))}
        </LightfallSectionHeader>
      </div>

      {content.map((d: any) => {
        return (
          <PmpInfoThumbnailGroup
            key={d.uid}
            data={d}
            classes={{
              root: styles.root,
              caption: styles.caption,
              thumbBlockWrapper: styles.thumbBlockWrapper,
              thumbBg: styles.thumbBg,
            }}
          />
        );
      })}
    </div>
  );
};
