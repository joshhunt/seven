// Created by atseng, 2020
// Copyright Bungie, Inc.

import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import React, { useEffect, useRef, useState } from "react";
import {
  BeyondLightAccordion,
  InteractiveSection,
} from "@Areas/Destiny/BeyondLight/Components";
import { BeyondLightHero } from "@Areas/Destiny/BeyondLight/V2/BeyondLightHero/BeyondLightHero";
import { BeyondLightSection } from "@Areas/Destiny/BeyondLight/V2/BeyondLightSection/BeyondLightSection";
import { IDestinyNewsMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsAndMediaUpdated } from "@Areas/Destiny/Shared/DestinyNewsAndMediaUpdated";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import { BnetStackBeyondLight } from "../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./BeyondLight.module.scss";

interface BeyondLightProps {}

const BeyondLight: React.FC<BeyondLightProps> = (props) => {
  const { mobile, medium } = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [data, setData] = useState<BnetStackBeyondLight>(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("beyond_light")
      .Entry("bltfb9ac20b6ec799ea")
      .language(locale)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    subnav,
    title,
    meta_image,
    hero,
    sections,
    cta,
    interactive_section,
    media,
  } = data ?? {};

  const sectionIdArray = sections?.map((sec) => sec.page_section.section_id);
  const ids = sectionIdArray ? ["stasis", ...sectionIdArray, "media"] : [];
  const elementRefs: HTMLDivElement[] = [];
  const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  useEffect(() => {
    ids.forEach((id, i) => (idToElementsMapping[id] = elementRefs[i]));
  }, [elementRefs]);

  const sectionStyles = [
    { section: styles.topRaidSection, bg: styles.sectionBg },
    {
      section: styles.europaSection,
      bg: styles.sectionBg,
      bgGradient: styles.bgGradient,
    },
    {
      section: styles.gearSection,
      bg: styles.sectionBg,
      bgGradient: styles.bgGradient,
    },
    { section: styles.bottomRaidSection, bg: styles.sectionBg },
  ];

  const [heroRef, setHeroRef] = useState(null);

  const metaImg = meta_image?.url;
  const stasisHeaderBg = interactive_section?.header?.background?.url;
  const ctaBgImg = mobile
    ? cta?.background?.mobile
    : cta?.background?.desktop?.url;
  const ctaBg = ctaBgImg ? `url(${ctaBgImg})` : undefined;

  const mediaScreenshots: IDestinyNewsMedia[] = media
    ?.filter((m) => m.screenshot)
    ?.map((s) => ({
      isVideo: false,
      thumbnail:
        s.screenshot?.thumbnail?.url || `${s.screenshot?.image?.url}?width=500`,
      detail: s.screenshot?.image?.url,
    }));

  const mediaVideos: IDestinyNewsMedia[] = media
    ?.filter((m) => m.video)
    ?.map((vid) => ({
      isVideo: true,
      thumbnail: vid?.video.thumbnail?.url,
      detail: vid?.video?.video_id,
    }));

  const mediaWallpapers: IDestinyNewsMedia[] = media
    ?.filter((m) => m.wallpaper)
    .map((wall) => ({
      isVideo: false,
      thumbnail: wall?.wallpaper?.thumbnail?.url,
      detail: wall?.wallpaper?.wallpaper?.url,
    }));

  return (
    <SpinnerContainer loading={!data}>
      <div className={styles.beyondLight}>
        <BungieHelmet title={title} image={metaImg}>
          <body
            className={classNames(SpecialBodyClasses(BodyClasses.NoSpacer))}
          />
        </BungieHelmet>

        <BeyondLightHero inputRef={(ref) => setHeroRef(ref)} data={hero} />

        <MarketingSubNav
          ids={ids}
          renderLabel={(id, index) => {
            const label = subnav?.labels?.find(
              (l: any) => l.label_id === `${id.toLowerCase()}_nav_label`
            );

            return label?.label;
          }}
          buttonProps={{
            children: subnav?.btn_text,
            buttonType: "gold",
            url: RouteHelper.DestinyBuyDetail({
              productFamilyTag: "BeyondLight",
            }),
          }}
          primaryColor={"lightgray"}
          accentColor={"gold"}
          withGutter
        />

        <div
          className={styles.stasisHeader}
          ref={(ref) => (elementRefs[0] = ref)}
          id={"stasis"}
          style={{
            backgroundImage: stasisHeaderBg
              ? `url(${stasisHeaderBg})`
              : undefined,
          }}
        >
          <h2
            className={styles.heading}
            dangerouslySetInnerHTML={sanitizeHTML(
              interactive_section?.header.heading
            )}
          />
        </div>

        {!medium && (
          <InteractiveSection
            itemOneTitle={interactive_section?.interactive_guardian[0]?.title}
            itemOneSubtitle={
              interactive_section?.interactive_guardian[0]?.subtitle
            }
            itemOneImagePath={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/dt9eabe7a4.png"
            }
            ItemOneCandy={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/dtcb982539a.png"
            }
            itemTwoTitle={interactive_section?.interactive_guardian[1]?.title}
            itemTwoSubtitle={
              interactive_section?.interactive_guardian[1]?.subtitle
            }
            itemTwoImagePath={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/dwfe03e48e.png"
            }
            itemThreeTitle={interactive_section?.interactive_guardian[2]?.title}
            itemThreeSubtitle={
              interactive_section?.interactive_guardian[2]?.subtitle
            }
            itemThreeImagePath={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/dh2755f46f.png"
            }
            background={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/d0d845b8a.jpg"
            }
            backgroundCandy={
              "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/dcc4990c01.png"
            }
            itemOneModalEyebrow={
              interactive_section?.interactive_guardian[0]?.modal_eyebrow
            }
            itemOneModalTitle={
              interactive_section?.interactive_guardian[0]?.modal_title
            }
            itemOneModalBodyCopy={
              interactive_section?.interactive_guardian[0]?.modal_body
            }
            itemOneModalImagePath={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m8604dde7.jpg"
            }
            itemOneModalImagePathTwo={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/mde51b149.jpg"
            }
            itemOneModalBackgroundPoster={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/ma91a4718.jpg"
            }
            itemOneModalBackgroundVideo={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/mtr8d9a115e4937.mp4"
            }
            itemOneModalLogoOne={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m5b0e3a33.png"
            }
            itemOneModalLogoTwo={
              "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m0c4599d8.png"
            }
            itemOneModalSubheadingTwo={
              interactive_section?.interactive_guardian[0]
                ?.modal_second_subheading
            }
            itemOneModalCaptionTwo={
              interactive_section?.interactive_guardian[0]?.modal_second_caption
            }
            itemOneModalSubheadingOne={
              interactive_section?.interactive_guardian[0]
                ?.modal_first_subheading
            }
            itemOneModalCaptionOne={
              interactive_section?.interactive_guardian[0]?.modal_first_caption
            }
            itemTwoModalEyebrow={
              interactive_section?.interactive_guardian[1]?.modal_eyebrow
            }
            itemTwoModalTitle={
              interactive_section?.interactive_guardian[1]?.modal_title
            }
            itemTwoModalBodyCopy={
              interactive_section?.interactive_guardian[1]?.modal_body
            }
            itemTwoModalImagePath={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m9f9bd30d.jpg"
            }
            itemTwoModalImagePathTwo={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/mac13ab84.jpg"
            }
            itemTwoModalBackgroundPoster={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m84a7b115.jpg"
            }
            itemTwoModalBackgroundVideo={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m5122f5cc.mp4"
            }
            itemTwoModalLogoOne={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m08646965.png"
            }
            itemTwoModalLogoTwo={
              "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/me7384bd1.png"
            }
            itemTwoModalSubheadingOne={
              interactive_section?.interactive_guardian[1]
                ?.modal_first_subheading
            }
            itemTwoModalCaptionOne={
              interactive_section?.interactive_guardian[1]?.modal_first_caption
            }
            itemTwoModalSubheadingTwo={
              interactive_section?.interactive_guardian[1]
                ?.modal_second_subheading
            }
            itemTwoModalCaptionTwo={
              interactive_section?.interactive_guardian[1]?.modal_second_caption
            }
            itemThreeModalBackgroundPoster={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m94fceced.jpg"
            }
            itemThreeModalBackgroundVideo={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m87d56e69.mp4"
            }
            itemThreeModalBodyCopy={
              interactive_section?.interactive_guardian[2]?.modal_body
            }
            itemThreeModalCaptionOne={
              interactive_section?.interactive_guardian[2]?.modal_first_caption
            }
            itemThreeModalCaptionTwo={
              interactive_section?.interactive_guardian[2]?.modal_second_caption
            }
            itemThreeModalEyebrow={
              interactive_section?.interactive_guardian[2]?.modal_eyebrow
            }
            itemThreeModalImagePathTwo={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/mb79ba5c3.jpg"
            }
            itemThreeModalImagePath={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m7348eaa2.jpg"
            }
            itemThreeModalLogoOne={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m86b8922d.png"
            }
            itemThreeModalLogoTwo={
              "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m377b4fe8.png"
            }
            itemThreeModalSubheadingOne={
              interactive_section?.interactive_guardian[2]
                ?.modal_first_subheading
            }
            itemThreeModalSubheadingTwo={
              interactive_section?.interactive_guardian[2]
                ?.modal_second_subheading
            }
            itemThreeModalTitle={
              interactive_section?.interactive_guardian[2]?.modal_title
            }
          />
        )}

        {medium && (
          <BeyondLightAccordion
            accordionData={[
              {
                title: interactive_section?.mobile_accordion[0].title,
                eyebrow: interactive_section?.mobile_accordion[0].eyebrow,
                summary: interactive_section?.mobile_accordion[0].summary,
                mainImage:
                  "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/w00546d36ff4b.jpg",
                itemImage:
                  "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m9f9bd30d.jpg",
                itemImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/mac13ab84.jpg",
                subheadingOne:
                  interactive_section?.mobile_accordion[0].subheading_one,
                captionOne:
                  interactive_section?.mobile_accordion[0].caption_one,
                subheadingTwo:
                  interactive_section?.mobile_accordion[0].subheading_two,
                captionTwo:
                  interactive_section?.mobile_accordion[0].caption_two,
                logoImageOne:
                  "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/m08646965.png",
                logoImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/me7384bd1.png",
                detailMainImage:
                  "/7/ca/destiny/products/79905d32d0e7/aee1fc1b8e8c5/d961218f.jpg",
              },
              {
                title: interactive_section?.mobile_accordion[1].title,
                eyebrow: interactive_section?.mobile_accordion[1].eyebrow,
                summary: interactive_section?.mobile_accordion[1].summary,
                mainImage:
                  "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/t5aa58ce9b57e.jpg",
                itemImage:
                  "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m8604dde7.jpg",
                itemImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/mde51b149.jpg",
                subheadingOne:
                  interactive_section?.mobile_accordion[1].subheading_one,
                captionOne:
                  interactive_section?.mobile_accordion[1].caption_one,
                subheadingTwo:
                  interactive_section?.mobile_accordion[1].subheading_two,
                captionTwo:
                  interactive_section?.mobile_accordion[1].caption_two,
                logoImageOne:
                  "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m5b0e3a33.png",
                logoImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/m0c4599d8.png",
                detailMainImage:
                  "/7/ca/destiny/products/79905d32d0e7/b2f3132f3f10a/0fa6abd7.jpg",
              },
              {
                title: interactive_section?.mobile_accordion[2].title,
                eyebrow: interactive_section?.mobile_accordion[2].eyebrow,
                summary: interactive_section?.mobile_accordion[2].summary,
                mainImage:
                  "/7/ca/destiny/products/79905d32d0e7/1096154d302bc2/hea0ad52ef973.jpg",
                itemImage:
                  "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m7348eaa2.jpg",
                itemImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/mb79ba5c3.jpg",
                subheadingOne:
                  interactive_section?.mobile_accordion[2].subheading_one,
                captionOne:
                  interactive_section?.mobile_accordion[2].caption_one,
                subheadingTwo:
                  interactive_section?.mobile_accordion[2].subheading_two,
                captionTwo:
                  interactive_section?.mobile_accordion[2].caption_two,
                logoImageOne:
                  "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m377b4fe8.png",
                logoImageTwo:
                  "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/m86b8922d.png",
                detailMainImage:
                  "/7/ca/destiny/products/79905d32d0e7/c00546d36ff4b/3c20e7be.jpg",
              },
            ]}
          />
        )}

        {sections?.map((sectionInstance, i: number) => {
          const section = sectionInstance?.page_section;
          const sectionScreenshots = section.info_blocks
            ?.filter((block) => !block?.image_text_info_block?.video_id)
            .map((block) => block?.image_text_info_block?.screenshot?.url);

          return (
            <BeyondLightSection
              key={i}
              smallTitle={section.small_title}
              sectionTitle={section.section_title}
              blurb={section.blurb}
              sectionId={section.section_id}
              inputRef={(ref) => (elementRefs[i + 1] = ref)}
              bg={{
                desktop: section.background?.desktop?.url,
                mobile: section.background?.mobile?.url,
              }}
              classes={{
                section: sectionStyles[i]?.section,
                bg: sectionStyles[i]?.bg,
                bgGradient: sectionStyles[i]?.bgGradient,
              }}
              flexInfoBlocks={section.info_blocks?.map((block) => {
                let screenshotIndex = sectionScreenshots?.findIndex(
                  (s) => s === block?.image_text_info_block.screenshot?.url
                );

                if (screenshotIndex === -1) {
                  screenshotIndex = undefined;
                }

                return {
                  blurb: block?.image_text_info_block?.blurb,
                  blurbHeading: block?.image_text_info_block?.heading,
                  singleOrAllScreenshots: sectionScreenshots,
                  screenshotIndex,
                  thumbnail: block?.image_text_info_block?.thumbnail?.url,
                  videoId: block?.image_text_info_block?.video_id || undefined,
                };
              })}
            />
          );
        })}

        <div className={styles.cta} style={{ backgroundImage: ctaBg }}>
          <img className={styles.logo} src={cta?.logo?.url ?? ""} />
          <Button
            url={RouteHelper.DestinyBuyDetail({
              productFamilyTag: "BeyondLight",
            })}
            buttonType={"blue"}
            className={styles.btn}
          >
            {cta?.btn_text ?? ""}
          </Button>
        </div>

        <div
          className={styles.mediaSection}
          ref={(ref) => (elementRefs[sections?.length + 1] = ref)}
          id={"media"}
        >
          <div className={styles.mediaContent}>
            <DestinyNewsAndMediaUpdated
              smallSeasonText={null}
              defaultTab={"screenshots"}
              screenshots={mediaScreenshots}
              videos={mediaVideos}
              wallpapers={mediaWallpapers}
              classes={{
                thumbnail: styles.mediaThumb,
                tabBtn: styles.mediaTab,
                selectedTab: styles.selected,
              }}
            />
          </div>
        </div>
      </div>
    </SpinnerContainer>
  );
};

export default BeyondLight;
