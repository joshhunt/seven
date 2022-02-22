// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import React from "react";
import styles from "./LearnMore16.module.scss";

interface LearnMore16Props {
  faqBgImage?: string;
  faqUrl?: string;
  supportBgImage?: string;
  supportUrl?: string;
  rewardsBgImage?: string;
  rewardsUrl?: string;
  /* small text to appear to right of section heading */
  smallHeaderText: string;
}

const LearnMore16: React.FC<LearnMore16Props> = (props) => {
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
          <IconActionCard
            cardTitle={Localizer.Destiny.LearnMoreSupportBtnTitle}
            action={props.supportUrl}
            classes={{ root: styles.learnMoreBtn }}
            backgroundImage={props.supportBgImage}
          />
        )}
        {props.faqUrl && (
          <IconActionCard
            cardTitle={Localizer.Destiny.LearnMoreFAQBtnTitle}
            action={props.faqUrl}
            classes={{ root: styles.learnMoreBtn }}
            backgroundImage={props.faqBgImage}
          />
        )}
        {props.rewardsUrl && (
          <IconActionCard
            cardTitle={Localizer.Destiny.LearnMoreRewardsBtnTitle}
            action={props.rewardsUrl}
            classes={{ root: styles.learnMoreBtn }}
            backgroundImage={props.rewardsBgImage}
          />
        )}
      </div>
    </div>
  );
};

export default LearnMore16;
