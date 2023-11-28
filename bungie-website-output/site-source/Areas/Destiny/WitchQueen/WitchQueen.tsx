// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { WQClickableImg } from "@Areas/Destiny/WitchQueen/components/WQClickableImg/WQClickableImg";
import WQEditionSelector from "@Areas/Destiny/WitchQueen/components/WQEditionSelector/WQEditionSelector";
import { WQFlexInfoImgBlock } from "@Areas/Destiny/WitchQueen/components/WQFlexInfoImgBlock/WQFlexInfoImgBlock";
import WQSkinnyBlurbSection from "@Areas/Destiny/WitchQueen/components/WQSkinnyBlurbSection/WQSkinnyBlurbSection";
import WQStickyBuyNav from "@Areas/Destiny/WitchQueen/components/WQStickyBuyNav/WQStickyBuyNav";
import WQHero from "@Areas/Destiny/WitchQueen/sections/WQHero/WQHero";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./WitchQueen.module.scss";
import { ScrollToAnchorTags } from "@UI/Navigation/ScrollToAnchorTags";

const WitchQueen: React.FC = () => {
  const responsive = useDataStore(Responsive);
  const heroRef = useRef<HTMLDivElement | null>(null);
  // indicates if a check has been made for a hash in the current url
  const [hasCheckedForHash, setHasCheckedForHash] = useState(false);
  const [editionsRef, setEditionsRef] = useState<null | HTMLDivElement>(null);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [data, setData] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("nova_product_page")
      .Entry("blt6927482d223d0222")
      .language(locale)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    title,
    meta_image,
    page_bottom_img_desktop,
    page_bottom_img_mobile,
    hero,
    section_blocks,
    section_heading_wq_text,
    editions_section_title,
    editions_tab_anniversary_bundle,
    editions_tab_deluxe,
    editions_tab_standard,
    editions_section_bg_desktop,
    collectors_edition_bg_image,
    locale_supports_gradient_font,
    sticky_buy_nav,
    sticky_nav_skus,
  } = data ?? {};

  return (
    <SpinnerContainer loading={!data}>
      <WitchQueenHelmet title={title} img={bgImageFromStackFile(meta_image)} />
      <ScrollToAnchorTags animate={true} />
      <div className={styles.witchQueenContent}>
        <div ref={heroRef}>
          <WQHero heroContent={data?.hero} />
        </div>

        <div className={styles.wqLowerContent}>
          <WQStickyBuyNav
            heroRef={heroRef}
            logo={
              responsive.mobile
                ? sticky_buy_nav?.wq_logo_mobile?.url
                : sticky_buy_nav?.wq_logo_desktop?.url
            }
            skus={sticky_nav_skus?.map((s: any) => {
              return { label: s.wq_sku.label, sku: s.wq_sku.sku_tag };
            })}
            buyBtnText={sticky_buy_nav?.buy_btn_text}
            dropdownTitle={sticky_buy_nav?.dropdown_title}
            dateText={hero?.hero_date_text}
          />

          {/* map over modular blocks from contentStack for each section of the page */}
          {section_blocks?.map((sectionObj: any, i: number) => {
            const {
              identifier,
              section_class,
              section_bg_desktop,
              section_bg_mobile,
              img_above_heading,
              image_and_text_blocks,
              clickable_thumbnails,
              primary_section_blurbs,
              section_heading,
              section: sectionName,
            } = sectionObj.section_content;

            return (
              <WQSkinnyBlurbSection
                key={i}
                id={identifier}
                classes={{
                  root: styles[section_class],
                  sectionBg: styles.sectionBg,
                  heading: styles.sectionHeading,
                  blurbWrapper: styles.sectionBlurbWrapper,
                  sectionTopBorder: styles.sectionTopBorder,
                  imgAboveHeading: styles.imgAboveHeading,
                }}
                heading={section_heading}
                imgAboveHeading={img_above_heading?.url}
                useGradientFont={locale_supports_gradient_font}
                headingSectionName={sectionName}
                headingSmallWQText={section_heading_wq_text}
                desktopBgImage={bgImageFromStackFile(section_bg_desktop)}
                mobileBgImage={bgImageFromStackFile(section_bg_mobile)}
                bodyBlurbs={primary_section_blurbs.map((blurbObj: any) => {
                  return {
                    blurb: blurbObj?.blurb_text,
                    hasSpecialFont: blurbObj?.uses_special_font,
                  };
                })}
              >
                {(clickable_thumbnails?.length ?? 0) > 0 && (
                  <div className={styles.sectionImagesWrapper}>
                    {clickable_thumbnails.map((img: any, j: number) => {
                      return (
                        <WQClickableImg
                          key={j}
                          thumbnail={bgImageFromStackFile(img?.thumbnail_img)}
                          screenshots={clickable_thumbnails.map(
                            (image: any) => image?.screenshot_img?.url
                          )}
                          screenshotIndex={j}
                          caption={img?.img_caption}
                          bottomCaption={img?.bottom_caption}
                          videoId={img?.video_id}
                          classes={{
                            root: styles.clickableThumbnailWrapper,
                            img: styles.clickableThumbnail,
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {(image_and_text_blocks?.length ?? 0) > 0 && (
                  <div
                    className={classNames(
                      styles[`imageTextBlock${section_class}`]
                    )}
                  >
                    {image_and_text_blocks?.map((blockObj: any, j: number) => {
                      const isFlexReverse =
                        identifier === "activities" ? j % 2 === 0 : j % 2 !== 0;

                      const screenshotsInSection = image_and_text_blocks.filter(
                        (b: any) => !b.video_id
                      );
                      const screenshot = blockObj.screenshot_img?.url;
                      let screenshotIndex = screenshotsInSection.findIndex(
                        (s: any) =>
                          screenshot && screenshot === s.screenshot_img?.url
                      );

                      if (screenshotIndex === -1) {
                        screenshotIndex = undefined;
                      }

                      return (
                        <WQFlexInfoImgBlock
                          key={j}
                          blurb={blockObj?.blurb}
                          blurbHeading={blockObj?.blurb_heading}
                          thumbnail={bgImageFromStackFile(
                            blockObj?.thumbnail_img
                          )}
                          screenshotsInSection={screenshotsInSection.map(
                            (s: any) => s?.screenshot_img?.url
                          )}
                          screenshotIndex={screenshotIndex}
                          direction={isFlexReverse ? "reverse" : "normal"}
                          videoId={blockObj?.video_id || undefined}
                          caption={blockObj?.caption}
                          isAltStyle={section_class === "campaignSection"}
                        />
                      );
                    })}
                  </div>
                )}
              </WQSkinnyBlurbSection>
            );
          })}

          <div className={styles.mediaSection}>
            <div className={styles.mediaContent}>
              <FirehoseNewsAndMedia
                tag={"witch-queen-media"}
                useUpdatedComponent={true}
                selectedTab={"screenshots"}
                classes={{
                  tabBtn: styles.mediaTab,
                  selectedTab: styles.selected,
                  sectionTitle: styles.mediaSectionTitle,
                }}
              />
            </div>
          </div>
          <div className={styles.bottomImgWrapper}>
            <img
              className={styles.bottomImg}
              src={
                responsive.mobile
                  ? page_bottom_img_mobile?.url
                  : page_bottom_img_desktop?.url
              }
            />
          </div>
        </div>
      </div>
    </SpinnerContainer>
  );
};

const WitchQueenHelmet: React.FC<{ title: string; img: string }> = ({
  title,
  img,
}) => {
  return (
    <BungieHelmet title={title} image={img}>
      <body
        className={classNames(
          SpecialBodyClasses(
            BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
          ),
          styles.witchQueen
        )}
      />
    </BungieHelmet>
  );
};

export default WitchQueen;
