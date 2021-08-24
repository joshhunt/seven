// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season15/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React from "react";
import styles from "./ExoticQuest15.module.scss";

interface ExoticQuest15Props {}

const ExoticQuest15: React.FC<ExoticQuest15Props> = (props) => {
  const s15 = Localizer.Season15;

  return (
    <div className={styles.exoticQuestSection}>
      <div className={styles.sectionIdAnchor} />
      <div className={styles.sectionBg} />
      <div className={classNames(styles.contentWrapperNormal)}>
        <LazyLoadWrapper>
          <p className={styles.smallHeading}>{s15.ExoticQuestSmallHeading}</p>
          <SectionHeader
            title={s15.ExoticQuestHeading}
            seasonText={s15.SectionHeaderSeasonText}
            sectionName={s15.ExoticQuestSectionName}
            className={styles.sectionHeader}
            isBold={true}
          />
          <div className={styles.flexContentWrapper}>
            <div className={styles.textContent}>
              <p
                className={classNames(styles.paragraphLarge)}
                dangerouslySetInnerHTML={sanitizeHTML(s15.ExoticQuestBlurb)}
              />
            </div>
          </div>
        </LazyLoadWrapper>
      </div>
      <div className={styles.contentWrapperLarge}>
        <div className={classNames(styles.crossPlayBlock)}>
          <div className={styles.contentWrapper}>
            <h4
              dangerouslySetInnerHTML={sanitizeHTML(
                s15.crossPlayCalloutHeading
              )}
            />
            <p className={classNames(styles.paragraph, styles.crossPlayBlurb)}>
              {s15.crossPlayCalloutBlurb}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExoticQuest15;
