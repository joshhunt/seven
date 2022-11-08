// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import HelmBlock from "@Areas/Seasons/ProductPages/Season16/Components/HelmBlock";
import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season16/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { PmpCallout } from "@UI/Marketing/Fragments/PmpCallout";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Story16.module.scss";

interface Season16StoryProps {
  inputRef: LegacyRef<HTMLDivElement>;
  storyOneData: BnetStackSeasonOfTheRisen["story_section_one"];
  storyTwoData: BnetStackSeasonOfTheRisen["story_section_two"];
  headerSeasonText: string;
  helmData: BnetStackSeasonOfTheRisen["helm_callout"];
}

const Season16Story: React.FC<Season16StoryProps> = ({
  storyOneData,
  storyTwoData,
  helmData,
  inputRef,
  headerSeasonText,
}) => {
  const { mobile } = useDataStore(Responsive);

  const topBg = responsiveBgImageFromStackFile(
    storyOneData?.bg.desktop,
    storyOneData?.bg.mobile,
    mobile
  );
  const bottomBg = responsiveBgImageFromStackFile(
    storyTwoData?.bg.desktop,
    storyTwoData?.bg.mobile,
    mobile
  );

  return (
    <div className={styles.storySection}>
      <div className={styles.sectionIdAnchor} id={"story"} ref={inputRef} />
      <div className={styles.topStorySection}>
        <div className={styles.sectionBg} style={{ backgroundImage: topBg }} />
        <LazyLoadWrapper
          className={classNames(
            styles.sectionContent,
            styles.contentWrapperNormal
          )}
        >
          <div className={styles.divider} />
          <SectionHeader
            title={storyOneData?.heading}
            seasonText={headerSeasonText}
            sectionName={storyOneData?.section_name}
          />
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={sanitizeHTML(storyOneData?.blurb)}
          />
        </LazyLoadWrapper>
      </div>

      <div className={styles.bottomStorySection}>
        <div
          className={styles.sectionBg}
          style={{ backgroundImage: bottomBg }}
        />
        <LazyLoadWrapper
          className={classNames(
            styles.sectionContent,
            styles.contentWrapperNormal
          )}
        >
          <SectionHeader
            title={storyTwoData?.heading}
            seasonText={headerSeasonText}
            sectionName={storyTwoData?.section_name}
          />
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={sanitizeHTML(storyTwoData?.blurb)}
          />
        </LazyLoadWrapper>
      </div>

      <div className={styles.helmWrapper}>
        <div className={styles.contentWrapperLarge}>
          <PmpCallout data={helmData?.[0]} />
        </div>
      </div>
    </div>
  );
};

export default Season16Story;
