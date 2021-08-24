// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import HelmBlock from "@Areas/Seasons/ProductPages/Season15/Components/HelmBlock";
import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season15/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import styles from "./Story15.module.scss";

interface Season15StoryProps {
  inputRef: LegacyRef<HTMLDivElement>;
}

const Season15Story: React.FC<Season15StoryProps> = (props) => {
  const s15 = Localizer.Season15;

  return (
    <div className={styles.storySection}>
      <div
        className={styles.sectionIdAnchor}
        id={"storyOnly"}
        ref={props.inputRef}
      />
      <div className={styles.topStorySection}>
        <div className={styles.sectionBg} />
        <LazyLoadWrapper
          className={classNames(
            styles.sectionContent,
            styles.contentWrapperNormal
          )}
        >
          <div className={styles.divider} />
          <SectionHeader
            title={s15.StoryMainHeading}
            seasonText={s15.SectionHeaderSeasonText}
            sectionName={s15.StorySectionName}
          />
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={sanitizeHTML(s15.StoryMainBlurb)}
          />
          <p
            className={classNames(styles.paragraph, styles.bottomStoryBlurb)}
            dangerouslySetInnerHTML={sanitizeHTML(s15.StoryMainBlurbTwo)}
          />
        </LazyLoadWrapper>
      </div>

      <div className={styles.bottomStorySection}>
        <div className={styles.sectionBg} />
        <LazyLoadWrapper
          className={classNames(
            styles.sectionContent,
            styles.contentWrapperNormal
          )}
        >
          <SectionHeader
            title={s15.StorySecondHeading}
            seasonText={s15.SectionHeaderSeasonText}
            sectionName={s15.StorySectionName}
          />
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={sanitizeHTML(s15.StorySecondBlurb)}
          />
        </LazyLoadWrapper>
      </div>

      <div className={styles.helmWrapper}>
        <div className={styles.sectionBg} />
        <div className={styles.contentWrapperLarge}>
          <HelmBlock />
        </div>
      </div>
    </div>
  );
};

export default Season15Story;
