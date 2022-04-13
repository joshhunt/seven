// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { IDestinyNewsMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsAndMediaUpdated } from "@Areas/Destiny/Shared/DestinyNewsAndMediaUpdated";
import SeasonModal from "@Areas/Seasons/ProductPages/Season16/Components/SeasonModal";
import Activities16 from "@Areas/Seasons/ProductPages/Season16/Sections/Activities16";
import Gear16 from "@Areas/Seasons/ProductPages/Season16/Sections/Gear16";
import { Hero16 } from "@Areas/Seasons/ProductPages/Season16/Sections/Hero16";
import LearnMore16 from "@Areas/Seasons/ProductPages/Season16/Sections/LearnMore16";
import RewardsAndCalendar16 from "@Areas/Seasons/ProductPages/Season16/Sections/RewardsAndCalendar16";
import SeasonPass16 from "@Areas/Seasons/ProductPages/Season16/Sections/SeasonPass16";
import { SilverBundle16 } from "@Areas/Seasons/ProductPages/Season16/Sections/SilverBundle16";
import Season16Story from "@Areas/Seasons/ProductPages/Season16/Sections/Story16";
import Void16 from "@Areas/Seasons/ProductPages/Season16/Sections/Void16";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { HelpArticle } from "@Helpers";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { PmpMedia } from "@UI/Marketing/Fragments/PmpMedia";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { bgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import styles from "./SeasonOfTheRisen.module.scss";

interface SeasonOfTheRisenProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const SeasonOfTheRisen: React.FC<SeasonOfTheRisenProps> = (props) => {
  const { mobile } = useDataStore(Responsive);
  const [data, setData] = useState<BnetStackSeasonOfTheRisen>();

  useEffect(() => {
    ContentStackClient()
      .ContentType("season_of_the_risen")
      .Entry("blt6d7ef885a2744902")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference("season_media")
      .toJSON()
      .fetch()
      .then((res) => {
        setData(res);
      });
  }, []);

  const {
    hero,
    title,
    activities_section_one,
    activities_section_two,
    callout_block,
    event_section,
    helm_block,
    meta_img,
    season_pass_section,
    story_section_one,
    story_section_two,
    sub_nav,
    media,
    cta,
    rewards_section,
    silver_bundle_section,
    section_heading_season_text,
    links_section,
    season_media,
  } = data ?? {};

  const [heroRef, setHeroRef] = useState(null);
  const [showSynapticModal, setShowSynapticModal] = useState(false);
  const [showPsiopsModal, setShowPsiopsModal] = useState(false);

  if (!data) {
    return <SpinnerContainer loading={true} />;
  }

  const toggleSynapticModal = () => setShowSynapticModal(!showSynapticModal);
  const togglePsiopsModal = () => setShowPsiopsModal(!showPsiopsModal);

  const openBuyModal = () => {
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.SilverBundle });
  };

  const supportUrl = HelpArticle(links_section?.link_btn[0]?.help_article_id);
  const faqUrl = HelpArticle(links_section?.link_btn[1]?.help_article_id);

  const mediaScreenshtos: IDestinyNewsMedia[] = media
    ?.filter((m) => m.screenshot)
    .map((m) => ({
      thumbnail: `${m.screenshot?.image?.url}?width=500`,
      isVideo: false,
      detail: m.screenshot?.image?.url,
    }));

  const mediaVideos: IDestinyNewsMedia[] = media
    ?.filter((m) => m.video)
    .map((m) => ({
      thumbnail: m.video?.thumbnail?.url,
      isVideo: true,
      detail: m.video?.video_id,
    }));

  const mediaWallpapers: IDestinyNewsMedia[] = media
    ?.filter((m) => m.wallpaper)
    .map((m) => ({
      thumbnail: m.wallpaper?.thumbnail?.url,
      isVideo: false,
      detail: m.wallpaper?.wallpaper?.url,
    }));

  return (
    <div className={styles.all}>
      <div className={classNames(styles.season16Content)}>
        <BungieHelmet title={title} image={meta_img?.url}>
          <body
            className={classNames(
              SpecialBodyClasses(
                BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
              )
            )}
          />
        </BungieHelmet>

        <Hero16 inputRef={(ref) => setHeroRef(ref)} data={hero} />

        <MarketingSubNav
          ids={Object.keys(idToElementsMapping)}
          renderLabel={(id) => {
            return sub_nav?.labels.find((l) => l.label_id === `${id}_label_id`)
              ?.label;
          }}
          primaryColor={"darkgray"}
          accentColor={"teal"}
          buttonProps={{
            children: sub_nav?.btn_text,
            onClick: openBuyModal,
            buttonType: "teal",
            analyticsId: data?.sub_nav?.btn_analytics_id,
          }}
          withGutter={true}
        />

        <Season16Story
          inputRef={(ref) => (idToElementsMapping["story"] = ref)}
          helmData={helm_block}
          storyOneData={story_section_one}
          storyTwoData={story_section_two}
          headerSeasonText={section_heading_season_text}
        />

        <Activities16
          inputRef={(ref) => (idToElementsMapping["activities"] = ref)}
          togglePsiopsModal={togglePsiopsModal}
          toggleSynapticModal={toggleSynapticModal}
          data={activities_section_one}
          headerSeasonText={section_heading_season_text}
        />

        <Void16
          inputRef={(ref) => (idToElementsMapping["light"] = ref)}
          data={activities_section_two}
          rewardsData={callout_block}
          headerSeasonText={section_heading_season_text}
        />

        <Gear16
          inputRef={(ref) => (idToElementsMapping["gear"] = ref)}
          data={event_section}
          headerSeasonText={section_heading_season_text}
        />

        <SeasonPass16
          inputRef={(ref) => (idToElementsMapping["pass"] = ref)}
          data={season_pass_section}
          headerSeasonText={section_heading_season_text}
        />

        <RewardsAndCalendar16
          inputRef={(ref) => (idToElementsMapping["rewards"] = ref)}
          data={rewards_section}
        />

        <SilverBundle16
          inputRef={(ref) => (idToElementsMapping["bundle"] = ref)}
          data={silver_bundle_section}
          headerSeasonText={section_heading_season_text}
        />

        <div
          className={styles.cta}
          style={{
            backgroundImage: bgImageFromStackFile(data?.cta?.bg?.desktop),
          }}
        >
          <div className={styles.ctaContent}>
            <img src={cta?.logo?.url} className={styles.ctaLogo} />
            <Button
              className={styles.ctaBtn}
              onClick={openBuyModal}
              buttonType={"teal"}
              analyticsId={data?.silver_bundle_section?.btn_analytics_id}
            >
              {cta?.btn_text}
            </Button>
          </div>
        </div>

        <div className={styles.finalSections}>
          <div className={styles.contentWrapperNormal}>
            <div
              className={classNames(styles.sectionIdAnchor, styles.mediaId)}
              id={"media"}
              ref={(ref) => (idToElementsMapping["media"] = ref)}
            />
            <PmpMedia data={season_media?.[0]} />

            <LearnMore16
              faqBgImage={links_section?.link_btn[1]?.thumbnail?.url}
              supportBgImage={links_section?.link_btn[0]?.thumbnail?.url}
              supportUrl={supportUrl}
              faqUrl={faqUrl}
              smallHeaderText={section_heading_season_text}
            />
          </div>
        </div>

        <SeasonModal
          title={activities_section_one?.btn_modal_group[0]?.title}
          smallTitle={activities_section_one?.btn_modal_group[0]?.small_title}
          blurb={activities_section_one?.btn_modal_group[0]?.modal.blurb}
          toggleShow={togglePsiopsModal}
          show={showPsiopsModal}
          backgroundImage={
            activities_section_one?.btn_modal_group[0]?.modal.bg.desktop?.url
          }
          backgroundImageMobile={
            activities_section_one?.btn_modal_group[0]?.modal.bg.mobile?.url
          }
        />

        <SeasonModal
          title={activities_section_one?.btn_modal_group[1]?.title}
          smallTitle={activities_section_one?.btn_modal_group[1]?.small_title}
          blurb={activities_section_one?.btn_modal_group[1]?.modal.blurb}
          toggleShow={toggleSynapticModal}
          show={showSynapticModal}
          backgroundImage={
            activities_section_one?.btn_modal_group[1]?.modal.bg.desktop?.url
          }
          backgroundImageMobile={
            activities_section_one?.btn_modal_group[1]?.modal.bg.mobile?.url
          }
        />
      </div>
    </div>
  );
};

export default SeasonOfTheRisen;
