// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import Activities14 from "@Areas/Seasons/ProductPages/Season14/Sections/Activities14";
import Gear14 from "@Areas/Seasons/ProductPages/Season14/Sections/Gear14";
import LearnMore14 from "@Areas/Seasons/ProductPages/Season14/Sections/LearnMore14";
import Rewards14 from "@Areas/Seasons/ProductPages/Season14/Sections/Rewards14";
import RewardsAndCalendar14 from "@Areas/Seasons/ProductPages/Season14/Sections/RewardsAndCalendar14";
import Season14ArmorSynthesis from "@Areas/Seasons/ProductPages/Season14/Sections/ArmorSynthesis14";
import { Season14Hero } from "@Areas/Seasons/ProductPages/Season14/Sections/Hero14";
import SeasonModal from "@Areas/Seasons/ProductPages/Season14/Components/SeasonModal";
import Season14Story from "@Areas/Seasons/ProductPages/Season14/Sections/Story14";
import SeasonPass14 from "@Areas/Seasons/ProductPages/Season14/Sections/SeasonPass14";
import { SilverBundle14 } from "@Areas/Seasons/ProductPages/Season14/Sections/SilverBundle14";
import VaultOfGlass14 from "@Areas/Seasons/ProductPages/Season14/Sections/VaultOfGlass14";
import { SeasonsDefinitions } from "@Areas/Seasons/SeasonsDefinitions";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import React, { LegacyRef, useState } from "react";
import styles from "./SeasonOfTheSplicer.module.scss";

interface SeasonOfTheSplicerProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const SeasonOfTheSplicer: React.FC<SeasonOfTheSplicerProps> = (props) => {
  const s14 = Localizer.Season14;

  const [heroRef, setHeroRef] = useState(null);
  const [showExpungeModal, setShowExpungeModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const navButtonAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season14Page,
    "Season14NavBtnAnalyticsId",
    ""
  );

  const trailerJsonParamToLocalizedValue = (
    paramName: string
  ): string | null => {
    const trailerString = ConfigUtils.GetParameter(
      SystemNames.Season14Page,
      paramName,
      "{}"
    ).replace(/'/g, '"');
    const trailerData = JSON.parse(trailerString);

    return (
      trailerData[Localizer.CurrentCultureName] ?? trailerData["en"] ?? null
    );
  };

  const toggleExpungeModal = () => {
    setShowExpungeModal(!showExpungeModal);
  };

  const toggleOverrideModal = () => {
    setShowOverrideModal(!showOverrideModal);
  };

  const heroTrailer = trailerJsonParamToLocalizedValue("HeroTrailer");

  const faqParamString = `faq_${Localizer.CurrentCultureName}`;
  const faqUrl = ConfigUtils.GetParameter(
    "SeasonsFAQUrlByLocale",
    faqParamString,
    "https://help.bungie.net/hc/en-us/articles/360060130092-FAQ-for-Season-Pass-Purchases"
  );
  const supportParamString = `help_${Localizer.CurrentCultureName}`;
  const supportUrl = ConfigUtils.GetParameter(
    SystemNames.Season14HelpArticleUrlByLocale,
    supportParamString,
    "https://help.bungie.net/hc/en-us/articles/360059443812"
  );

  return (
    <div className={styles.all}>
      <BungieHelmet
        title={SeasonsDefinitions.seasonOfTheSplicer.title}
        image={SeasonsDefinitions.seasonOfTheSplicer.image}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            SpecialBodyClasses(BodyClasses.NoSpacer)
          )}
        />
      </BungieHelmet>
      <Season14Hero
        trailerId={heroTrailer}
        heroLogo={`/7/ca/destiny/bgs/season14/logos/logo_${Localizer.CurrentCultureName}.png`}
        inputRef={(ref) => setHeroRef(ref)}
      />
      <MarketingSubNav
        ids={Object.keys(idToElementsMapping)}
        renderLabel={(id) => Localizer.Destiny[`Submenu_${id}`]}
        primaryColor={"splicerBlue"}
        accentColor={"teal"}
        buttonProps={{
          children: Localizer.Seasons.MenuCTALabel,
          url: RouteHelper.DestinyBuy(),
          buttonType: "teal",
          analyticsId: navButtonAnalyticsId,
        }}
        withGutter={true}
      />
      <Season14Story
        inputRef={(ref) => (idToElementsMapping["storyOnly"] = ref)}
      />
      <Activities14
        inputRef={(ref) => (idToElementsMapping["activities"] = ref)}
        toggleOverrideModal={toggleOverrideModal}
        toggleExpungeModal={toggleExpungeModal}
      />
      <VaultOfGlass14 inputRef={(ref) => (idToElementsMapping["raid"] = ref)} />
      <Rewards14 />
      <Season14ArmorSynthesis
        inputRef={(ref) => (idToElementsMapping["tech"] = ref)}
      />
      <Gear14 inputRef={(ref) => (idToElementsMapping["exotics"] = ref)} />
      <SeasonPass14
        inputRef={(ref) => (idToElementsMapping["seasonPass"] = ref)}
      />
      <RewardsAndCalendar14
        inputRef={(ref) => (idToElementsMapping["rewards"] = ref)}
        calendarInputRef={(ref) => (idToElementsMapping["calendar"] = ref)}
        toggleCalendarModal={toggleExpungeModal}
        calendarBtnTitle={s14.CalendarBtnTitle}
      />
      <SilverBundle14 inputRef={(ref) => ref} />
      <div className={styles.finalSections}>
        <div className={styles.contentWrapperNormal}>
          <FirehoseNewsAndMedia
            tag={"season-14-media"}
            useUpdatedComponent={true}
            smallSeasonText={s14.SectionHeaderSeasonText}
            selectedTab={"screenshots"}
          />
          <LearnMore14
            faqBgImage={"/7/ca/destiny/bgs/season14/s14_links_button_2.jpg"}
            supportBgImage={"/7/ca/destiny/bgs/season14/s14_links_button_1.jpg"}
            supportUrl={supportUrl}
            faqUrl={faqUrl}
            smallHeaderText={s14.SectionHeaderSeasonText}
          />
        </div>
      </div>

      <SeasonModal
        title={s14.ExpungeModalHeading}
        smallTitle={s14.ExpungeModalSmallHeading}
        blurb={s14.ExpungeModalBlurb}
        toggleShow={toggleExpungeModal}
        show={showExpungeModal}
        backgroundImage={
          "/7/ca/destiny/bgs/season14/s14_activities_expunge_modal_bg_desktop.jpg"
        }
        backgroundImageMobile={
          "/7/ca/destiny/bgs/season14/s14_activities_expunge_modal_bg_mobile.jpg"
        }
      />
      <SeasonModal
        title={s14.OverrideModalHeading}
        smallTitle={s14.OverrideModalSmallHeading}
        blurb={s14.OverrideModalBlurb}
        toggleShow={toggleOverrideModal}
        show={showOverrideModal}
        backgroundImage={
          "/7/ca/destiny/bgs/season14/s14_activities_override_modal_bg_desktop.jpg"
        }
        backgroundImageMobile={
          "/7/ca/destiny/bgs/season14/s14_activities_override_modal_bg_mobile.jpg"
        }
      />
    </div>
  );
};

export default SeasonOfTheSplicer;
