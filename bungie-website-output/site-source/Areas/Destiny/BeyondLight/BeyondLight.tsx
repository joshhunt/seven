// Created by atseng, 2020
// Copyright Bungie, Inc.

import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import React, { useRef, useState } from "react";
import { BeyondLightQuery } from "./__generated__/BeyondLightQuery.graphql";
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
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./BeyondLight.module.scss";

interface BeyondLightProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const BeyondLight: React.FC<BeyondLightProps> = (props) => {
  const { mobile, medium } = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<BeyondLightQuery>(
    graphql`
      query BeyondLightQuery($locale: String!) {
        beyond_light(uid: "bltfb9ac20b6ec799ea", locale: $locale) {
          title
          meta_imageConnection {
            edges {
              node {
                url
              }
            }
          }
          subnav {
            btn_text
            labels {
              ... on BeyondLightSubnavLabels {
                label
                label_id
              }
            }
          }
          hero {
            background {
              desktopConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              mobileConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
            buy_btn {
              btn_title
              btn_url
            }
            trailer_btn {
              btn_title
              video_id
            }
            logoConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          interactive_section {
            header {
              backgroundConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              heading
            }
            ... on BeyondLightInteractiveSection {
              interactive_guardian {
                modal_body
                modal_eyebrow
                modal_first_caption
                modal_first_subheading
                modal_second_caption
                modal_second_subheading
                modal_title
                subtitle
                title
              }
            }
            mobile_accordion {
              ... on BeyondLightInteractiveSectionMobileAccordion {
                caption_one
                caption_two
                eyebrow
                subheading_one
                subheading_two
                summary
                title
              }
            }
          }
          sections {
            ... on BeyondLightSectionsPageSection {
              page_section {
                background {
                  desktopConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  mobileConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
                section_id
                blurb
                section_title
                small_title
                info_blocks {
                  ... on BeyondLightSectionsPageSectionBlockInfoBlocksImageTextInfoBlock {
                    image_text_info_block {
                      blurb
                      heading
                      screenshotConnection {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                      thumbnailConnection {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                      video_id
                    }
                  }
                }
              }
            }
          }
          cta {
            logoConnection {
              edges {
                node {
                  url
                }
              }
            }
            btn_text
            background {
              desktopConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              mobileConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
          media {
            ... on BeyondLightMediaScreenshot {
              screenshot {
                imageConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                thumbnailConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
            ... on BeyondLightMediaVideo {
              video {
                thumbnailConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                video_id
              }
            }
            ... on BeyondLightMediaWallpaper {
              wallpaper {
                thumbnailConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                wallpaperConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { locale }
  );

  const {
    subnav,
    title,
    meta_imageConnection,
    hero,
    sections,
    cta,
    interactive_section,
    media,
  } = data?.beyond_light ?? {};

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

  const metaImg = imageFromConnection(meta_imageConnection)?.url;
  const stasisHeaderBg = imageFromConnection(
    interactive_section?.header.backgroundConnection
  ).url;
  const ctaBgImg = imageFromConnection(
    mobile
      ? cta?.background?.mobileConnection
      : cta?.background?.desktopConnection
  )?.url;
  const ctaBg = ctaBgImg ? `url(${ctaBgImg})` : undefined;

  const mediaScreenshots: IDestinyNewsMedia[] = media
    ?.filter((m) => m.screenshot)
    .map((s) => ({
      isVideo: false,
      thumbnail:
        imageFromConnection(s.screenshot?.thumbnailConnection)?.url ||
        `${imageFromConnection(s.screenshot?.imageConnection)?.url}?width=500`,
      detail: imageFromConnection(s.screenshot?.imageConnection)?.url,
    }));

  const mediaVideos: IDestinyNewsMedia[] = media
    ?.filter((m) => m.video)
    .map((v) => ({
      isVideo: true,
      thumbnail: imageFromConnection(v.video?.thumbnailConnection)?.url,
      detail: v.video?.video_id,
    }));

  const mediaWallpapers: IDestinyNewsMedia[] = media
    ?.filter((m) => m.wallpaper)
    .map((w) => ({
      isVideo: false,
      thumbnail: imageFromConnection(w.wallpaper?.thumbnailConnection).url,
      detail: imageFromConnection(w.wallpaper?.wallpaperConnection)?.url,
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
          ids={Object.keys(idToElementsMapping)}
          renderLabel={(id, index) => {
            const label = subnav?.labels.find(
              (l) => l.label_id === `${id}_nav_label`
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
          ref={(ref) => (idToElementsMapping["stasis"] = ref)}
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

        {sections?.map(({ page_section: section }, i) => {
          const sectionScreenshots = section.info_blocks
            ?.filter(({ image_text_info_block: b }) => !b.video_id)
            .map(
              ({ image_text_info_block: b }) =>
                imageFromConnection(b.screenshotConnection).url
            );

          return (
            <BeyondLightSection
              key={i}
              smallTitle={section.small_title}
              sectionTitle={section.section_title}
              blurb={section.blurb}
              sectionId={section.section_id}
              inputRef={(ref) =>
                (idToElementsMapping[section.section_id] = ref)
              }
              bg={{
                desktop: imageFromConnection(
                  section.background.desktopConnection
                ).url,
                mobile: imageFromConnection(section.background.mobileConnection)
                  .url,
              }}
              classes={{
                section: sectionStyles[i]?.section,
                bg: sectionStyles[i]?.bg,
                bgGradient: sectionStyles[i]?.bgGradient,
              }}
              flexInfoBlocks={section.info_blocks?.map(
                ({ image_text_info_block: block }) => {
                  let screenshotIndex = sectionScreenshots.findIndex(
                    (s) =>
                      s === imageFromConnection(block.screenshotConnection)?.url
                  );

                  if (screenshotIndex === -1) {
                    screenshotIndex = undefined;
                  }

                  return {
                    blurb: block.blurb,
                    blurbHeading: block.heading,
                    singleOrAllScreenshots: sectionScreenshots,
                    screenshotIndex,
                    thumbnail: imageFromConnection(block.thumbnailConnection)
                      .url,
                    videoId: block.video_id || undefined,
                  };
                }
              )}
            />
          );
        })}

        <div className={styles.cta} style={{ backgroundImage: ctaBg }}>
          <img
            className={styles.logo}
            src={imageFromConnection(cta?.logoConnection)?.url ?? ""}
          />
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
          ref={(ref) => (idToElementsMapping["media"] = ref)}
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
