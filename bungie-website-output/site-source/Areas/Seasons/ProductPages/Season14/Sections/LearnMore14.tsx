// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import BlockPlusButton from "@Areas/Seasons/ProductPages/Season14/Components/BlockPlusButton";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Localizer } from "@Global/Localization/Localizer";
import React from "react";
import styles from "./LearnMore14.module.scss";

interface LearnMore14Props {
  faqBgImage?: string;
  faqUrl?: string;
  supportBgImage?: string;
  supportUrl?: string;
  rewardsBgImage?: string;
  rewardsUrl?: string;
  /* small text to appear to right of section heading */
  smallHeaderText: string;
}

const LearnMore14: React.FC<LearnMore14Props> = (props) => {
  return (
    <div className={styles.learnMore}>
      <SectionHeader
        title={Localizer.Destiny.LearnMoreSectionTitle}
        seasonText={props.smallHeaderText}
        sectionName={Localizer.Destiny.LearnMoreLinksSmallHeading}
        className={styles.sectionHeader}
        isBold={true}
      />
      <div className={styles.btnsWrapper}>
        {props.supportUrl && (
          <BlockPlusButton
            title={Localizer.Destiny.LearnMoreSupportBtnTitle}
            link={props.supportUrl}
            className={styles.learnMoreBtn}
            backgroundImage={props.supportBgImage}
          />
        )}
        {props.faqUrl && (
          <BlockPlusButton
            title={Localizer.Destiny.LearnMoreFAQBtnTitle}
            link={props.faqUrl}
            className={styles.learnMoreBtn}
            backgroundImage={props.faqBgImage}
          />
        )}
        {props.rewardsUrl && (
          <BlockPlusButton
            title={Localizer.Destiny.LearnMoreRewardsBtnTitle}
            link={props.rewardsUrl}
            className={styles.learnMoreBtn}
            backgroundImage={props.rewardsBgImage}
          />
        )}
      </div>
    </div>
  );
};

export default LearnMore14;
