// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { useDataStore } from "@bungie/datastore/DataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { HelpArticle } from "@Helpers";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { IconActionCard } from "@UI/Marketing/IconActionCard";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect } from "react";
import styles from "./BungieRewards.module.scss";

interface BungieRewardsProps {}

const BungieRewards: React.FC<BungieRewardsProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  useEffect(() => {
    // if magento store is not enabled, redirect to "claim rewards" page
    const isMagentoEnabled = ConfigUtils.SystemStatus(SystemNames.MagentoStore);

    if (!isMagentoEnabled) {
      window.location.href = `/${Localizer.CurrentCultureName}/Profile/Rewards`;
    }
  }, []);

  const rewardsLoc = Localizer.Bungierewards;

  const isUserAuthenticated = UserUtils.isAuthenticated(globalState);

  const storeBungieRewardsUrl = ConfigUtils.GetParameter(
    SystemNames.MagentoStore,
    "StoreBungieRewardsUrl",
    ""
  );
  const ctaBtnUrl = isUserAuthenticated
    ? storeBungieRewardsUrl
    : RouteHelper.Registration().url;
  const ctaBtnText = isUserAuthenticated
    ? rewardsLoc.GoToStore
    : rewardsLoc.MarketingPageAccountBtnText;

  const metaTitle = rewardsLoc.BungieRewards;
  const metaImg = rewardsImgPathString("rewards_hero_bg.png");

  return (
    <div className={styles.bungieRewardsPage}>
      <BungieHelmet title={metaTitle} image={metaImg}>
        <body
          className={classNames(SpecialBodyClasses(BodyClasses.NoSpacer))}
        />
      </BungieHelmet>

      <RewardsTitleBlock />

      <div className={classNames(styles.infoSection)}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionHeading}>
            {rewardsLoc.MarketingPageSectionHeadingOne}
          </h2>
          <p className={styles.sectionMainBlurb}>
            {rewardsLoc.MarketingPageSectionBlurbOne}
          </p>

          <div className={styles.btnsFlexWrapper}>
            <Button
              url={storeBungieRewardsUrl}
              className={styles.rewardsBtn}
              buttonType={"white"}
            >
              {rewardsLoc.ShopNow}
              <span>
                <Icon
                  className={styles.shopBtnArrowIcon}
                  iconName={"arrow-up"}
                  iconType={"fa"}
                />
              </span>
            </Button>
            <Button
              url={`/${Localizer.CurrentCultureName}/Profile/Rewards`}
              className={styles.rewardsBtn}
              buttonType={"none"}
            >
              {rewardsLoc.ClaimDigitalRewards}
            </Button>
          </div>
        </div>

        <div className={styles.rewardsGroupImg} />
      </div>
      <div className={classNames(styles.infoSection, styles.blockSection)}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionHeading}>
            {rewardsLoc.MarketingPageSectionHeadingTwo}
          </h2>
          <p className={styles.sectionMainBlurb}>
            {rewardsLoc.MarketingPageSectionBlurbTwo}
          </p>
          <p className={styles.sectionSmallBlurb}>
            {rewardsLoc.MarketingPageSmallBlurbTwo}
          </p>

          <div className={styles.rewardThumbnailsWrapper}>
            <div
              className={classNames(styles.rewardsThumbnail, styles.rewardOne)}
            />
            <div
              className={classNames(styles.rewardsThumbnail, styles.rewardTwo)}
            />
            <div
              className={classNames(
                styles.rewardsThumbnail,
                styles.rewardThree
              )}
            />
          </div>
        </div>
      </div>

      <div className={styles.bungieAccountCallout}>
        <div className={styles.calloutContent}>
          <div className={styles.bungieIcon} />
          <h3 className={styles.calloutHeading}>
            {rewardsLoc.MarketingPageAccountHeading}
          </h3>
          <p className={styles.calloutBlurb}>
            {rewardsLoc.MarketingPageAccountBlurb}
          </p>
          <Button
            url={ctaBtnUrl}
            className={styles.calloutBtn}
            buttonType={"gold"}
          >
            {ctaBtnText}
          </Button>
        </div>
      </div>

      <div className={styles.FAQBlocks}>
        <h2 className={styles.faqHeading}>{rewardsLoc.FAQTitle}</h2>
        <RewardsFAQBlock
          title={rewardsLoc.FAQBlockTitleOne}
          subtitle={rewardsLoc.FAQBlockSubtitleOne}
        />
        <RewardsFAQBlock
          title={rewardsLoc.FAQBlockTitleTwo}
          subtitle={rewardsLoc.FAQBlockSubtitleTwo}
        />
      </div>

      <div className={styles.learnMoreSection}>
        <div className={styles.learnMoreContent}>
          <h2 className={styles.learnMoreTitle}>
            {Localizer.Destiny.LearnMoreSectionTitle}
          </h2>
          <div className={styles.learnMoreBtns}>
            <IconActionCard
              cardTitle={Localizer.Destiny.LearnMoreSupportBtnTitle}
              backgroundImage={rewardsImgPathString("rewards_support_bg.jpg")}
              action={HelpArticle("360048721172")}
              classes={{ root: styles.learnMoreBtn }}
            />
          </div>
        </div>
        <div className={styles.sectionBg} />
      </div>
    </div>
  );
};

const rewardsImgPathString = (imgName: string) => {
  return `/7/ca/bungie/bgs/bungie_rewards/${imgName}`;
};

interface IRewardsTitleBlock {}

const RewardsTitleBlock: React.FC<IRewardsTitleBlock> = (props) => {
  const rewardsLoc = Localizer.Bungierewards;

  return (
    <div className={styles.rewardsHeader}>
      <h1 className={styles.title} />
      <h2 className={styles.subtitle}>{rewardsLoc.PlayEarnReward}</h2>
    </div>
  );
};

interface IRewardsFAQBlock {
  title: string;
  subtitle: string;
}

const RewardsFAQBlock: React.FC<IRewardsFAQBlock> = (props) => {
  return (
    <div className={styles.rewardsFAQBlock}>
      <p className={styles.FAQBlockTitle}>{props.title}</p>
      <p className={styles.FAQBlockSubtitle}>{props.subtitle}</p>
    </div>
  );
};

export default BungieRewards;
