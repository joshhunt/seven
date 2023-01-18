// Created by v-ahipp, 2022
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
import styles from "./LightfallStrandSection.module.scss";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import { LightfallTrailerBtn } from "@Areas/Destiny/Lightfall/components/LightfallTrailerBtn/LightfallTrailerBtn";
import { LightfallAnimatedText } from "@Areas/Destiny/Lightfall/components/LightfallAnimatedText/LightfallAnimatedText";

interface LightfallStrandSectionProps {
  data?: any;
}

export const LightfallStrandSection: React.FC<LightfallStrandSectionProps> = (
  props
) => {
  const { data } = props;
  const {
    icon,
    title,
    title_bg,
    heading,
    blurb,
    button = [],
    desktop_bg_top,
    mobile_bg_top,
    desktop_bg_bottom,
    mobile_bg_bottom,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);
  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        icon: icon?.url,
        titleBg: title_bg?.url,
        backgroundTop: mobile ? mobile_bg_top?.url : desktop_bg_top?.url,
        backgroundBottom: mobile
          ? mobile_bg_bottom?.url
          : desktop_bg_bottom?.url,
      }),
      [data, mobile]
    )
  );

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: [
          `url(${imgs.backgroundTop})`,
          `url(${imgs.backgroundBottom})`,
        ].join(","),
      }}
    >
      <img className={styles.icon} src={imgs.icon} alt="" />
      <LightfallAnimatedText bg={title_bg}>{title}</LightfallAnimatedText>
      <div className={styles.container}>
        <LightfallSectionHeader
          heading={heading}
          blurb={blurb}
          dividerColor="#A1FEC0"
          classes={{
            root: styles.header,
            title: styles.title,
            content: styles.content,
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
