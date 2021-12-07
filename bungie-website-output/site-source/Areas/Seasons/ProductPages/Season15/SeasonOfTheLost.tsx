// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import Activities15 from "@Areas/Seasons/ProductPages/Season15/Sections/Activities15";
import Gear15 from "@Areas/Seasons/ProductPages/Season15/Sections/Gear15";
import LearnMore15 from "@Areas/Seasons/ProductPages/Season15/Sections/LearnMore15";
import Rewards15 from "@Areas/Seasons/ProductPages/Season15/Sections/Rewards15";
import RewardsAndCalendar15 from "@Areas/Seasons/ProductPages/Season15/Sections/RewardsAndCalendar15";
import { Hero15 } from "@Areas/Seasons/ProductPages/Season15/Sections/Hero15";
import SeasonModal from "@Areas/Seasons/ProductPages/Season15/Components/SeasonModal";
import Season15Story from "@Areas/Seasons/ProductPages/Season15/Sections/Story15";
import SeasonPass15 from "@Areas/Seasons/ProductPages/Season15/Sections/SeasonPass15";
import { SilverBundle15 } from "@Areas/Seasons/ProductPages/Season15/Sections/SilverBundle15";
import ExoticQuest15 from "@Areas/Seasons/ProductPages/Season15/Sections/ExoticQuest15";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { HelpArticle } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./SeasonOfTheLost.module.scss";

interface SeasonOfTheLostProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const SeasonOfTheLost: React.FC<SeasonOfTheLostProps> = (props) => {
  const s15 = Localizer.Season15;

  const [heroRef, setHeroRef] = useState(null);
  const [showShatteredRealmModal, setShowShatteredRealmModal] = useState(false);
  const [showAstralModal, setShowAstralModal] = useState(false);
  const [isBodyOverflowHidden, setIsBodyOverflowHidden] = useState(false);

  const navButtonAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    "Season15NavBtnAnalyticsId",
    ""
  );

  const trailerJsonParamToLocalizedValue = (
    paramName: string
  ): string | null => {
    const trailerString = ConfigUtils.GetParameter(
      SystemNames.Season15Page,
      paramName,
      "{}"
    ).replace(/'/g, '"');
    const trailerData = JSON.parse(trailerString);

    return (
      trailerData[Localizer.CurrentCultureName] ?? trailerData["en"] ?? null
    );
  };

  const toggleShatteredRealmModal = () =>
    setShowShatteredRealmModal(!showShatteredRealmModal);

  const toggleAstralModal = () => setShowAstralModal(!showAstralModal);

  const heroTrailerId = trailerJsonParamToLocalizedValue("HeroTrailer");

  const faqParamString = `faq_${Localizer.CurrentCultureName}`;
  const faqUrl = ConfigUtils.GetParameter(
    "SeasonsFAQUrlByLocale",
    faqParamString,
    "https://help.bungie.net/hc/en-us/articles/360060130092-FAQ-for-Season-Pass-Purchases"
  );
  const supportUrl = HelpArticle("4404573128596");

  return (
    <div className={styles.all}>
      <BungieHelmet
        title={Localizer.Seasons.SeasonOfTheLost}
        image={"/7/ca/destiny/bgs/season15/s15_key-art-final.jpg"}
      >
        <body
          className={classNames(
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            ),
            styles.season15,
            { [styles.hiddenOverflow]: isBodyOverflowHidden }
          )}
        />
      </BungieHelmet>
      <Hero15
        inputRef={(ref) => setHeroRef(ref)}
        gameplayTrailerId={heroTrailerId}
      />
      <MarketingSubNav
        ids={Object.keys(idToElementsMapping)}
        renderLabel={(id) => Localizer.Destiny[`Submenu_${id}`]}
        primaryColor={"queenPurple"}
        accentColor={"teal"}
        buttonProps={{
          children: Localizer.Seasons.MenuCTALabel,
          url: RouteHelper.DestinyBuy(),
          buttonType: "teal",
          analyticsId: navButtonAnalyticsId,
        }}
        withGutter={true}
      />
      <Season15Story
        inputRef={(ref) => (idToElementsMapping["storyOnly"] = ref)}
      />
      <Activities15
        inputRef={(ref) => (idToElementsMapping["activities"] = ref)}
        toggleAstralModal={toggleAstralModal}
        toggleShatteredRealmModal={toggleShatteredRealmModal}
      />
      <ExoticQuest15 />
      {/*<Rewards15/>*/}
      <Gear15 inputRef={(ref) => (idToElementsMapping["exotics"] = ref)} />
      <SeasonPass15
        inputRef={(ref) => (idToElementsMapping["seasonPass"] = ref)}
      />
      <RewardsAndCalendar15
        inputRef={(ref) => (idToElementsMapping["rewards"] = ref)}
      />
      <SilverBundle15
        inputRef={(ref) => (idToElementsMapping["silver"] = ref)}
      />
      <div className={styles.finalSections}>
        <div className={styles.contentWrapperNormal}>
          <FirehoseNewsAndMedia
            tag={"season-15-media"}
            useUpdatedComponent={true}
            smallSeasonText={s15.SectionHeaderSeasonText}
            selectedTab={"screenshots"}
          />
          <LearnMore15
            faqBgImage={"/7/ca/destiny/bgs/season15/s15_links_buitton_2.jpg"}
            supportBgImage={
              "/7/ca/destiny/bgs/season15/s15_links_buitton_1.jpg"
            }
            supportUrl={supportUrl}
            faqUrl={faqUrl}
            smallHeaderText={s15.SectionHeaderSeasonText}
          />
        </div>
      </div>

      <SeasonModal
        title={s15.ShatteredRealmModalHeading}
        smallTitle={s15.ShatteredRealmModalSmallHeading}
        blurb={s15.ShatteredRealmModalBlurb}
        toggleShow={toggleShatteredRealmModal}
        show={showShatteredRealmModal}
        backgroundImage={
          "/7/ca/destiny/bgs/season15/s15_activities_weekly_bg_desktop.jpg"
        }
        backgroundImageMobile={
          "/7/ca/destiny/bgs/season15/s15_activities_modal_2_bg_mobile.jpg"
        }
        setIsBodyOverflowHidden={setIsBodyOverflowHidden}
      />
      <SeasonModal
        title={s15.AstralModalHeading}
        smallTitle={s15.AstralModalSmallHeading}
        blurb={s15.AstralModalBlurb}
        toggleShow={toggleAstralModal}
        show={showAstralModal}
        backgroundImage={
          "/7/ca/destiny/bgs/season15/s15_activities_astral_alignment_bg_desktop.jpg"
        }
        backgroundImageMobile={
          "/7/ca/destiny/bgs/season15/s15_activities_modal_1_bg_mobile.jpg"
        }
        setIsBodyOverflowHidden={setIsBodyOverflowHidden}
      />
    </div>
  );
};

export default SeasonOfTheLost;
