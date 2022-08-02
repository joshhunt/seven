// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { CommunitySection } from "@Areas/Destiny/FreeToPlay/Components/CommunitySection/CommunitySection";
import { FreeHero } from "@Areas/Destiny/FreeToPlay/Components/FreeHero/FreeHero";
import { FreeSection } from "@Areas/Destiny/FreeToPlay/Components/FreeSection/FreeSection";
import { FreeTripleImageSet } from "@Areas/Destiny/FreeToPlay/Components/FreeTripleImageSet/FreeTripleImageSet";
import { ThreeGuardiansGraphic } from "@Areas/Destiny/FreeToPlay/Components/ThreeGuardiansGraphic/ThreeGuardiansGraphic";
import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { PmpCallout } from "@UI/Marketing/Fragments/PmpCallout";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import { Button } from "@UIKit/Controls/Button/Button";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { bgImage, bgImageFromStackFile } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BnetStackFile,
  BnetStackFreeToPlayProductPage,
} from "../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./FreeToPlay.module.scss";

interface FreeToPlayProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const FreeToPlay: React.FC<FreeToPlayProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const [data, setData] = useState<BnetStackFreeToPlayProductPage | null>(null);
  const [wrapperRef, setWrapperRef] = useState(null);
  const rewardsCalloutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("free_to_play_product_page")
      .Entry("blt95d601ea2e2125c0")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(["rewards_callout", "video_carousel"])
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    title,
    hero,
    bottom_cta,
    gear_section,
    guardians_section,
    guide_section,
    heroes_cta_section,
    meta_img,
    section_divider,
    story_section,
    supers_section,
    platform_images,
    star_bg,
    sub_nav,
    rewards_callout,
    v2_hero,
    callout_btn_title,
    community_carousel_slides,
    community_section,
    video_carousel,
  } = data ?? {};

  const images = useCSWebpImages(
    useMemo(
      () => ({
        heroesWelcomeLogo: heroes_cta_section?.logo?.url,
        heroesWelcomeBg: heroes_cta_section?.logo_bg?.url,
        dividerImg: section_divider?.url,
        staryBg: star_bg?.url,
      }),
      [data]
    )
  );

  const scrollToRewardsCallout = () => {
    rewardsCalloutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const dividerBgImg = bgImage(images.dividerImg);

  return (
    <div className={styles.freeToPlayContent}>
      <BungieHelmet title={title} image={meta_img?.url}>
        <body
          className={classNames(
            styles.freeToPlay,
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <FreeHero
        data={hero}
        V2Data={v2_hero}
        scrollToRewardsCallout={scrollToRewardsCallout}
      />

      <MarketingSubNav
        ids={
          sub_nav?.labels?.map((l) => l.label_id.replace("_nav_label", "")) ??
          []
        }
        renderLabel={(id) => {
          return sub_nav?.labels.find((l) => l.label_id === `${id}_nav_label`)
            ?.label;
        }}
        primaryColor={"darkgray"}
        accentColor={"hotPink"}
        buttonProps={{
          children: sub_nav?.btn_text,
          onClick: () =>
            DestinySkuSelectorModal.show({
              skuTag: DestinySkuTags.NewLightDetail,
            }),
          buttonType: "hotPink",
        }}
        withGutter={true}
      />

      <div
        id={"community"}
        ref={(ref) => (idToElementsMapping["community"] = ref)}
      />
      <CommunitySection
        data={community_section}
        communityCarouselSlides={community_carousel_slides}
        videoCarousel={video_carousel}
      />

      <div
        className={styles.lowerContentWrapper}
        ref={(ref) => setWrapperRef(ref)}
      >
        <div
          className={styles.tileBg}
          style={{ backgroundImage: bgImage(images.staryBg) }}
        />

        <FreeSection
          smallTitle={story_section?.small_title}
          sectionId={"game"}
          inputRef={(ref) => (idToElementsMapping["game"] = ref)}
          classes={{
            section: styles.storySection,
            sectionBg: styles.sectionBg,
          }}
          title={story_section?.section_title}
          bg={{ desktop: story_section?.bg, mobile: story_section?.bg }}
        >
          <FreeTripleImageSet
            thumbnails={story_section?.info_thumb.map((t) => ({
              image: t.image?.url,
              blurb: t.blurb,
              heading: t.heading,
            }))}
          />
          <p className={styles.lowerText}>{story_section?.bottom_text}</p>
          <DestinyArrows classes={{ root: styles.arrows }} />
        </FreeSection>

        <div className={styles.welcomeSection}>
          <img
            className={classNames(styles.divider, styles.top)}
            loading={"lazy"}
            style={{ backgroundImage: dividerBgImg }}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.logoWrapper}>
              <img
                src={images.heroesWelcomeLogo ?? images.heroesWelcomeBg}
                className={styles.logo}
              />
              {/* if no localized logo, manually place logo text on top of logo background */}
              {!images.heroesWelcomeLogo && (
                <h2
                  className={styles.title}
                  dangerouslySetInnerHTML={sanitizeHTML(
                    heroes_cta_section?.title
                  )}
                  style={{
                    backgroundImage: bgImageFromStackFile(
                      heroes_cta_section?.text_gradient_bg
                    ),
                  }}
                />
              )}
            </div>
            <div className={styles.lowerContent}>
              <p className={styles.subtitle}>{heroes_cta_section?.subtitle}</p>
              <FreeToPlayBuyBtn btn_text={heroes_cta_section?.btn_text} />
            </div>
          </div>
          <img
            className={classNames(styles.divider, styles.bottom)}
            style={{ backgroundImage: dividerBgImg }}
          />
        </div>

        <FreeSection
          smallTitle={guardians_section?.small_title}
          sectionId={"guardians"}
          inputRef={(ref) => (idToElementsMapping["guardians"] = ref)}
          blurb={guardians_section?.blurb}
          classes={{
            section: styles.guardiansSection,
            sectionBg: styles.sectionBg,
          }}
          title={guardians_section?.section_title}
          bg={guardians_section?.bg}
        >
          <ThreeGuardiansGraphic guardians={guardians_section?.guardians} />
        </FreeSection>

        <div className={styles.superGearWrapper}>
          <FreeSection
            sectionId={"supers"}
            inputRef={(ref) => (idToElementsMapping["supers"] = ref)}
            classes={{
              section: styles.supersSection,
              sectionBg: styles.sectionBg,
              idAnchor: styles.sectionIdAnchor,
            }}
            title={supers_section?.section_title}
            blurb={supers_section?.blurb}
            bg={supers_section?.bg}
          >
            <FreeTripleImageSet
              thumbnails={supers_section?.thumbnail_images?.map((t) => ({
                image: t?.url,
              }))}
              classes={{
                wrapper: styles.thumbnails,
                thumbnailWrapper: styles.thumbnailWrapper,
              }}
            />
          </FreeSection>

          <FreeSection
            sectionId={"gear"}
            inputRef={(ref) => (idToElementsMapping["gear"] = ref)}
            classes={{
              section: styles.gearSection,
              sectionBg: styles.sectionBg,
            }}
            title={gear_section?.section_title}
            blurb={gear_section?.blurb}
          >
            <FreeTripleImageSet
              thumbnails={gear_section?.thumbnail_images.map((t) => ({
                image: t?.url,
              }))}
              classes={{
                wrapper: styles.thumbnails,
                thumbnailWrapper: styles.thumbnailWrapper,
              }}
            />
          </FreeSection>

          <div ref={rewardsCalloutRef} className={styles.calloutScrollAnchor} />
          <PmpCallout
            data={rewards_callout?.[0]}
            classes={{
              root: styles.rewardsCallout,
              heading: styles.heading,
              blurb: styles.blurb,
              upperContent: styles.flexContent,
            }}
          >
            <div className={styles.btnWrapper}>
              <FreeToPlayBuyBtn
                btn_text={callout_btn_title}
                className={styles.claimBtn}
                url={`/7${RouteHelper.Rewards().url}`}
              />
            </div>
          </PmpCallout>
        </div>

        <LazyLoadedBgDiv
          className={styles.ctaSection}
          img={bgImageFromStackFile(bottom_cta?.bg.desktop)}
        >
          <img
            className={classNames(styles.divider, styles.top)}
            style={{ backgroundImage: dividerBgImg }}
          />
          <h2 className={styles.heading}>{bottom_cta?.title}</h2>
          <div className={styles.btnWrapper}>
            <FreeToPlayBuyBtn btn_text={bottom_cta?.btn_text} />
          </div>
          <FreePlatformList platforms={platform_images} />
          <img
            className={classNames(styles.divider, styles.bottom)}
            style={{ backgroundImage: dividerBgImg }}
          />
        </LazyLoadedBgDiv>

        <FreeSection
          sectionId={"guide"}
          inputRef={(ref) => (idToElementsMapping["guide"] = ref)}
          classes={{
            section: styles.guideSection,
            sectionBg: styles.sectionBg,
          }}
          blurb={guide_section?.blurb}
          bg={guide_section?.bg}
        >
          <div className={styles.guideBtnWrapper}>
            <Button
              buttonType={"gold"}
              className={styles.guideBtn}
              url={`/${Localizer.CurrentCultureName}/Guide/Destiny2`}
            >
              {guide_section?.section_title}
            </Button>
          </div>
        </FreeSection>

        <div className={styles.bgGradient} />
      </div>
    </div>
  );
};

export const FreeToPlayBuyBtn: React.FC<{
  btn_text: string;
  className?: string;
  url?: string;
}> = ({ btn_text, className, url }) => {
  return (
    <BuyButton
      children={btn_text}
      className={classNames(styles.buyBtn, className)}
      buttonType={"hotPink"}
      url={url}
      onClick={() =>
        !url &&
        DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.NewLightDetail })
      }
    />
  );
};

export const FreePlatformList: React.FC<{ platforms: BnetStackFile[] }> = ({
  platforms,
}) => {
  return (
    <div className={styles.platformsWrapper}>
      {platforms?.map((p, i) => {
        return <img key={i} src={p?.url} className={styles.icon} />;
      })}
    </div>
  );
};

export default FreeToPlay;
