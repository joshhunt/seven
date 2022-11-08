// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { CommunitySection } from "@Areas/Destiny/FreeToPlay/Components/CommunitySection/CommunitySection";
import { DestinyNewLightHero } from "@Areas/Destiny/DestinyNewLightHero";
import { FreeSection } from "@Areas/Destiny/FreeToPlay/Components/FreeSection/FreeSection";
import { FreeTripleImageSet } from "@Areas/Destiny/FreeToPlay/Components/FreeTripleImageSet/FreeTripleImageSet";
import { ThreeGuardiansGraphic } from "@Areas/Destiny/FreeToPlay/Components/ThreeGuardiansGraphic/ThreeGuardiansGraphic";
import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import { Button } from "@UIKit/Controls/Button/Button";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { bgImage, bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import {
  BnetStackFile,
  BnetStackNewLightProductPage,
} from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./DestinyNewLight.module.scss";

interface FreeToPlayProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const FreeToPlay: React.FC<FreeToPlayProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const [data, setData] = useState<BnetStackNewLightProductPage | null>(null);
  const [wrapperRef, setWrapperRef] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("new_light_product_page")
      .Entry("blta481f40130ba4bb3")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(["video_carousel"])
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    meta_title,
    hero,
    bottom_cta,
    gear_section,
    guardians_section,
    guide_section,
    meta_img,
    section_divider,
    story_section,
    supers_section,
    platform_images,
    star_bg,
    sub_nav,
    community_carousel_slides,
    community_section,
    video_carousel,
  } = data ?? {};

  const images = useCSWebpImages(
    useMemo(
      () => ({
        dividerImg: section_divider?.url,
        staryBg: star_bg?.url,
      }),
      [data]
    )
  );

  const dividerBgImg = bgImage(images.dividerImg);

  return (
    <div className={styles.freeToPlayContent}>
      <BungieHelmet title={meta_title} image={meta_img?.url}>
        <body
          className={classNames(
            styles.freeToPlay,
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <DestinyNewLightHero data={data?.hero} platformIcons={platform_images} />

      <MarketingSubNav
        ids={Object.keys(idToElementsMapping)}
        renderLabel={(id) => {
          return sub_nav?.labels.find((l) => l.label_id === `${id}_nav_label`)
            ?.label;
        }}
        primaryColor={"darkgray"}
        accentColor={"gold"}
        buttonProps={{
          children: sub_nav?.btn_text,
          onClick: () =>
            DestinySkuSelectorModal.show({
              skuTag: DestinySkuTags.NewLightDetail,
            }),
          buttonType: "gold",
        }}
        withGutter={true}
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
        </FreeSection>

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
        </div>

        <LazyLoadedBgDiv
          className={styles.ctaSection}
          img={bottom_cta?.bg?.desktop?.url}
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
            blurb: styles.blurb,
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
              {guide_section?.btn_text}
            </Button>
          </div>
        </FreeSection>

        <div className={styles.bgGradient} />

        <div
          id={"community"}
          ref={(ref) => (idToElementsMapping["community"] = ref)}
        />
        <CommunitySection
          data={community_section}
          communityCarouselSlides={community_carousel_slides}
          videoCarousel={video_carousel}
        />
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
      buttonType={"gold"}
      url={url}
      onClick={() =>
        !url &&
        DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.NewLightDetail })
      }
    />
  );
};

export const FreePlatformList: React.FC<{
  platforms: BnetStackFile[];
  className?: string;
}> = ({ platforms, className }) => {
  return (
    <div className={classNames(styles.platformsWrapper, className)}>
      {platforms?.map((p, i) => {
        return <img key={i} src={p?.url} className={styles.icon} />;
      })}
    </div>
  );
};

export default FreeToPlay;
