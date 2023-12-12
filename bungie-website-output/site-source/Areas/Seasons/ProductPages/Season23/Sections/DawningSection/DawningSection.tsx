// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { EventCallout } from "@Areas/Seasons/ProductPages/Season23/Components/EventCallout/EventCallout";
import FeaturedImage from "@Areas/Seasons/ProductPages/Season23/Components/FeaturedImage/FeaturedImage";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { PmpSectionHeader } from "@UI/Marketing/Fragments/PmpSectionHeader";
import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import React, { memo, useCallback } from "react";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { BnetStackS18ProductPage } from "../../../../../../Generated/contentstack-types";

import styles from "./DawningSection.module.scss";

type PmpCalloutProps = {
  data?: any;
  showEvent?: boolean;
};

const DawningSection: React.FC<PmpCalloutProps> = ({ data, showEvent }) => {
  const { mobile } = useDataStore(Responsive);
  type TResponsiveBg = BnetStackS18ProductPage["story_section"]["top_bg"];

  const getResponsiveBg = useCallback(
    (image: TResponsiveBg) => {
      const img = mobile ? image?.mobile_bg : image?.desktop_bg;

      return img?.url;
    },
    [mobile]
  );

  const getSection = (title: string) =>
    data?.content?.find((tag: any) => tag?.title === title);
  const hasSection = (title: string) => Boolean(getSection(title)?.title);

  return showEvent && data?.content?.length > 0 ? (
    <>
      {hasSection("S23 - Dawning - 1") ? (
        <PmpSectionHeader
          data={getSection("S23 - Dawning - 1")}
          classes={{
            secondaryHeading: styles.sectionEyebrow,
            heading: styles.headingWithNestedSpan,
            blurb: styles.largeBaseCopy,
            root: styles.dawningHeader,
            videoBtn: styles.videoBtn,
            btnWrapper: styles.btnWrapper,
          }}
        />
      ) : null}
      {hasSection("S23 - Dawning - 2") ? (
        <PmpInfoThumbnailGroup
          data={getSection("S23 - Dawning - 2")}
          classes={{
            blurb: styles.baseCopy,
            heading: styles.baseCopy,
            thumbnail: styles.aspectRatio_1_1,
            thumbBg: styles.seasonPassThumbBg,
            thumbBlockWrapper: styles.thumbBlockWrapper,
            root: styles.bottomSpacing,
          }}
        />
      ) : null}
      {hasSection("S23 - Dawning - 3") ? (
        <FeaturedImage
          content={getSection("S23 - Dawning - 3")}
          image={data?.featured_image}
        />
      ) : null}
      {hasSection("S23 - Dawning - 4") ? (
        <EventCallout
          data={getSection("S23 - Dawning - 4")}
          classes={{
            root: styles.calloutCardRoot,
            heading: styles.headingWithNestedEyebrow,
            blurb: styles.baseCopy,
            asideImg: styles.calloutCardAside,
            upperContent: styles.calloutCardUpper,
            textWrapper: styles.calloutCardTextWrapper,
          }}
        />
      ) : null}
      {hasSection("S23 - Dawning - 5") ? (
        <PmpStackedInfoThumbBlocks
          data={getSection("S23 - Dawning - 5")}
          classes={{
            heading: styles.rewardCardHeading,
            blurb: styles.baseCopyWithLink,
          }}
        />
      ) : null}
      {data?.bottom_bg && (
        <img
          src={getResponsiveBg(data?.bottom_bg)}
          className={styles.bottomBg}
        />
      )}
    </>
  ) : null;
};

export default memo(DawningSection);
