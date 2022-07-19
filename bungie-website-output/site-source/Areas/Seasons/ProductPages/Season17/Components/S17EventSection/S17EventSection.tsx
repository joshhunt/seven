// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {
  extendDefaultComponents,
  PartialPmpReferenceMap,
} from "@Boot/ProceduralMarketingPageFallback";
import { Responsive } from "@Boot/Responsive";
import { useReferenceMap } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { WithContentTypeUids } from "@Utilities/GraphQLUtils";
import React, { useMemo } from "react";
import { BnetStackSeasonOfTheHaunted } from "../../../../../../Generated/contentstack-types";
import styles from "./S17EventSection.module.scss";

interface S17ProceduralEventSectionProps {
  contentChunks: BnetStackSeasonOfTheHaunted["solstice_content_chunks"];
  pmpComponentOverrides?: PartialPmpReferenceMap;
}

type TEventContentWrapper = S17ProceduralEventSectionProps["contentChunks"][number];

/* Component to procedurally render Season Event content using useReferenceMap() */
export const S17ProceduralEventSection: React.FC<S17ProceduralEventSectionProps> = (
  props
) => {
  const { contentChunks, pmpComponentOverrides } = props;

  const getContentWrapperItem = (wrapper: TEventContentWrapper) => {
    return wrapper?.content_with_background;
  };

  return (
    <div className={styles.eventWrapper}>
      {contentChunks?.map((content, i) => {
        return (
          <S17ProceduralEventContentWrapper
            key={i}
            contentWrapper={getContentWrapperItem(content)}
            pmpComponentOverrides={pmpComponentOverrides ?? {}}
          />
        );
      })}
    </div>
  );
};

interface S17ProceduralEventContentWrapperProps {
  contentWrapper: TEventContentWrapper[keyof TEventContentWrapper];
  pmpComponentOverrides: PartialPmpReferenceMap;
}

/* Renders content references from modular block, along with an optional background image to go behind all the content */
const S17ProceduralEventContentWrapper: React.FC<S17ProceduralEventContentWrapperProps> = (
  props
) => {
  const { mobile } = useDataStore(Responsive);

  const images = useCSWebpImages(
    useMemo(
      () => ({
        bgDesktop: props.contentWrapper.bg_desktop?.url,
        bgMobile: props.contentWrapper.bg_mobile?.url,
      }),
      [props.contentWrapper]
    )
  );

  const { contentWrapper, pmpComponentOverrides } = props;

  const { ReferenceMappedList } = useReferenceMap(
    extendDefaultComponents(pmpComponentOverrides),
    (contentWrapper.content as WithContentTypeUids<
      typeof contentWrapper.content
    >) ?? []
  );

  const bgImage = mobile ? images.bgMobile : images.bgDesktop;
  const bgColor = mobile
    ? contentWrapper?.mobile_bg_color
    : contentWrapper?.desktop_bg_color;

  return (
    <div
      className={styles.eventContentWrapper}
      style={{ backgroundColor: bgColor }}
    >
      {/* Using an <img/> for the background rather than a div because the height of the 
			image is variable and it needs to be able to sit behind any number of content items */}
      <img src={bgImage} className={styles.bg} />
      <div className={styles.eventContent}>
        <ReferenceMappedList />
      </div>
    </div>
  );
};
