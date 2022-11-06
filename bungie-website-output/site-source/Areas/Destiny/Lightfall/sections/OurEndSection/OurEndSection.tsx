// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { LightfallTripleImageSet } from "@Areas/Destiny/Lightfall/components/LightfallTripleImageSet/LightfallTripleImageSet";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { responsiveBgImage } from "@Utilities/GraphQLUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./OurEndSection.module.scss";

interface OurEndSectionProps {
  data?: BnetStackNebulaProductPage["our_end_section"];
  TestCData?: BnetStackNebulaProductPage["img_swap_test"];
}

export const OurEndSection: React.FC<OurEndSectionProps> = (props) => {
  const { top_header, bottom_header, top_bg, bottom_bg } = props.data ?? {};

  const { mobile } = useDataStore(Responsive);
  const urlParams = UrlUtils.useQuery();

  const TestC = urlParams.get("t_sept1_ourend") === "true";

  const desktopBgTop = TestC
    ? props.TestCData?.our_end_bg?.desktop_bg
    : top_bg?.desktop_bg;
  const mobileBgTop = TestC
    ? props.TestCData?.our_end_bg?.mobile_bg
    : top_bg?.mobile_bg;

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: responsiveBgImage(
          desktopBgTop?.url,
          mobileBgTop?.url,
          mobile
        ),
      }}
    >
      <div className={styles.sectionContent}>
        <LightfallSectionHeader
          blurb={top_header?.blurb}
          heading={top_header?.heading}
          largeHeading={top_header?.large_heading}
          textBg={top_header?.text_bg?.url}
          classes={{ largeHeading: styles.largeHeading }}
          withDivider
        />
        <LightfallTripleImageSet
          data={top_header?.thumbnails?.[0]}
          classes={{
            root: styles.topImgSet,
            thumbWrapper: styles.topThumbWrapper,
          }}
        />
      </div>

      <div className={classNames(styles.section, styles.bottomSection)}>
        <div
          className={styles.sectionBg}
          style={{
            backgroundImage: responsiveBgImage(
              bottom_bg?.desktop_bg?.url,
              bottom_bg?.mobile_bg?.url,
              mobile
            ),
          }}
        />
        <div className={styles.sectionContent}>
          <LightfallSectionHeader
            classes={{ root: styles.neonHeader }}
            heading={bottom_header?.heading}
            blurb={bottom_header?.blurb}
            alignment={"right"}
            withDivider
          />
          <LightfallTripleImageSet
            data={bottom_header?.thumbnails?.[0]}
            classes={{
              root: styles.bottomImgSet,
              thumbWrapper: styles.bottomThumbWrapper,
            }}
          />
        </div>
      </div>
    </div>
  );
};
