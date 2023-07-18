// Created by tmorris, 2023
// Copyright Bungie, Inc.

import EventHighlight from "@Areas/Seasons/ProductPages/Season21/Components/EventHighlight/EventHighlight";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { PmpCallout } from "@UI/Marketing/Fragments/PmpCallout";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { PmpSectionHeader } from "@UI/Marketing/Fragments/PmpSectionHeader";
import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import classNames from "classnames";
import React, { memo, useCallback } from "react";
import {
  BnetStackFile,
  BnetStackPmpAnchor,
  BnetStackPmpCallToAction,
  BnetStackPmpMedia,
  BnetStackPmpMediaCarousel,
  BnetStackPmpNavigationBar,
  BnetStackS18ProductPage,
} from "../../../../../../Generated/contentstack-types";
import EventCallout from "@Areas/Seasons/ProductPages/Season21/Components/EventCallout/EventCallout";
import styles from "./EventSection.module.scss";

type EventHighlightProps = {
  heading?: string;
  top_subheading?: string;
  bottom_subheading?: string;
  image?: BnetStackFile;
};

type TResponsiveBg = BnetStackS18ProductPage["story_section"]["top_bg"];

type EventTopSectionProps = {
  content?: (
    | BnetStackPmpCallToAction
    | BnetStackPmpNavigationBar
    | BnetStackPmpAnchor
    | BnetStackPmpMediaCarousel
    | BnetStackPmpMedia
  )[];
  eventHighlight?: EventHighlightProps;
  topBackground?: TResponsiveBg;
  bottomBackground?: TResponsiveBg;
  topBanner?: BnetStackFile;
  bottomBanner?: BnetStackFile;
  leftAsideImage?: BnetStackFile;
  rightAsideImage?: BnetStackFile;
};

const EventSection: React.FC<EventTopSectionProps> = ({
  content,
  eventHighlight,
  topBackground,
  bottomBackground,
  topBanner,
  bottomBanner,
  leftAsideImage,
  rightAsideImage,
}) => {
  const { mobile } = useDataStore(Responsive);
  const getResponsiveBg = useCallback(
    (image: TResponsiveBg) => {
      const img = mobile ? image?.mobile_bg : image?.desktop_bg;

      return img?.url
        ? `url(${img?.url}?width=${mobile ? 768 : 1920})`
        : undefined;
    },
    [mobile]
  );

  if (Array.isArray(content) && content?.length === 0) {
    return null;
  }

  return (
    <>
      <div
        style={{
          backgroundImage: getResponsiveBg(topBackground),
        }}
        className={classNames(styles.eventBackground, styles.baseBackground)}
      >
        {content[0] ? (
          <PmpSectionHeader data={content[0]} classes={{}} />
        ) : null}
        {eventHighlight && <EventHighlight {...eventHighlight} />}
        {content[1] ? (
          <PmpStackedInfoThumbBlocks
            data={content[1]}
            classes={{
              heading: styles.boldedFont,
              root: styles.thumbnailBlocks,
            }}
          />
        ) : null}
        {content[2] ? (
          <PmpInfoThumbnailGroup
            data={content[2]}
            classes={{ root: styles.thumbnailGroupSpacing }}
          />
        ) : null}
      </div>
      <div
        style={{
          backgroundImage: getResponsiveBg(bottomBackground),
        }}
        className={classNames(styles.eventBotBackground, styles.baseBackground)}
      >
        {topBanner?.url && (
          <img className={styles.absoluteBase} src={topBanner.url} />
        )}
        {content[3] ? (
          <EventCallout
            data={content[3]}
            leftAsideImage={leftAsideImage}
            rightAsideImage={rightAsideImage}
          />
        ) : null}
        {content[4] ? (
          <PmpStackedInfoThumbBlocks
            data={content[4]}
            classes={{
              heading: styles.boldedFont,
              blurb: styles.thumbnailBlurb,
              root: styles.thumbnailBlocks,
            }}
          />
        ) : null}
        {bottomBanner?.url && (
          <img className={styles.bottomBanner} src={bottomBanner.url} />
        )}
      </div>
    </>
  );
};

export default memo(EventSection);
