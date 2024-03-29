// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {
  extendDefaultComponents,
  PartialPmpReferenceMap,
} from "@Boot/ProceduralMarketingPageFallback";
import { Responsive } from "@Boot/Responsive";
import { useReferenceMap } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { WithContentTypeUids } from "@Utilities/ContentStackUtils";
import React from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./S16ProceduralEventSection.module.scss";

interface S16ProceduralEventSectionProps {
  contentChunks: BnetStackSeasonOfTheRisen["guardian_games_content_chunks"];
  pmpComponentOverrides?: PartialPmpReferenceMap;
}

type TEventContentWrapper = BnetStackSeasonOfTheRisen["guardian_games_content_chunks"][number];

/* Component to procedurally render Season Event content using useReferenceMap() */
export const S16ProceduralEventSection: React.FC<S16ProceduralEventSectionProps> = (
  props
) => {
  const { contentChunks, pmpComponentOverrides } = props;

  const getContentWrapperItem = (wrapper: TEventContentWrapper) => {
    return wrapper?.Content_With_Background;
  };

  return (
    <div className={styles.eventWrapper}>
      {contentChunks?.map((content, i) => {
        return (
          <S16ProceduralEventContentWrapper
            key={i}
            contentWrapper={getContentWrapperItem(content)}
            pmpComponentOverrides={pmpComponentOverrides ?? {}}
          />
        );
      })}
    </div>
  );
};

interface S16ProceduralEventContentWrapperProps {
  contentWrapper: TEventContentWrapper[keyof TEventContentWrapper];
  pmpComponentOverrides: PartialPmpReferenceMap;
}

/* Renders content references from modular block, along with an optional background image to go behind all the content */
const S16ProceduralEventContentWrapper: React.FC<S16ProceduralEventContentWrapperProps> = (
  props
) => {
  const { mobile } = useDataStore(Responsive);

  const { contentWrapper, pmpComponentOverrides } = props;

  const { ReferenceMappedList } = useReferenceMap(
    extendDefaultComponents(pmpComponentOverrides),
    (contentWrapper.content as WithContentTypeUids<
      typeof contentWrapper.content
    >) ?? []
  );

  const bgImage = mobile
    ? contentWrapper?.mobile_bg
    : contentWrapper?.desktop_bg;
  const bgColor = mobile
    ? contentWrapper?.bg_color_mobile
    : contentWrapper?.bg_color_desktop;

  return (
    <div
      className={styles.eventContentWrapper}
      style={{ backgroundColor: bgColor }}
    >
      {/* Using an <img/> for the background rather than a div because the height of the 
			image is variable and it needs to be able to sit behind any number of content items */}
      <img src={bgImage?.url} className={styles.bg} />
      <div className={styles.eventContent}>
        <ReferenceMappedList />
      </div>
    </div>
  );
};
