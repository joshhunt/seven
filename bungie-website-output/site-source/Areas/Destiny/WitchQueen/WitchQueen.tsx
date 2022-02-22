// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { WitchQueenQuery } from "@Areas/Destiny/WitchQueen/__generated__/WitchQueenQuery.graphql";
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
import { imageFromConnection } from "@Utilities/GraphQLUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import styles from "./WitchQueen.module.scss";

const WitchQueen: React.FC = () => {
  const responsive = useDataStore(Responsive);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [hasHeroLoaded, setHasHeroLoaded] = useState(false);
  // indicates if a check has been made for a hash in the current url
  const [hasCheckedForHash, setHasCheckedForHash] = useState(false);
  const [editionsRef, setEditionsRef] = useState<null | HTMLDivElement>(null);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<WitchQueenQuery>(
    graphql`
      query WitchQueenQuery($locale: String!) {
        nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {
          title
          meta_imageConnection {
            edges {
              node {
                url
              }
            }
          }
          hero {
            hero_date_text
          }
          page_bottom_img_desktopConnection {
            edges {
              node {
                url
              }
            }
          }
          page_bottom_img_mobileConnection {
            edges {
              node {
                url
              }
            }
          }
          section_heading_wq_text
          editions_section_title
          editions_tab_anniversary_bundle
          editions_tab_standard
          editions_tab_deluxe
          editions_section_bg_desktopConnection {
            edges {
              node {
                url
              }
            }
          }
          collectors_edition_bg_imageConnection {
            edges {
              node {
                url
              }
            }
          }
          locale_supports_gradient_font
          sticky_buy_nav {
            buy_btn_text
            dropdown_title
            wq_logo_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            wq_logo_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
            mobile_dropdown_label
          }
          sticky_nav_skus {
            ... on NovaProductPageStickyNavSkusWqSku {
              wq_sku {
                label
                sku_tag
              }
            }
          }
          section_blocks {
            ... on NovaProductPageSectionBlocksSectionContent {
              section_content {
                section
                section_class
                section_bg_desktopConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                section_bg_mobileConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                img_above_headingConnection {
                  edges {
                    node {
                      url
                    }
                  }
                }
                section_heading
                primary_section_blurbs {
                  blurb_text
                  uses_special_font
                }
                clickable_thumbnails {
                  thumbnail_imgConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  screenshot_imgConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  img_caption
                  bottom_caption
                  video_id
                }
                image_and_text_blocks {
                  blurb
                  blurb_heading
                  thumbnail_imgConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  screenshot_imgConnection {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  caption
                  video_id
                }
              }
            }
          }
        }
      }
    `,
    { locale }
  );

  // if user provided a hash of 'editions' in the url, scroll to the corresponding element if the editions selector has loaded
  if (
    editionsRef &&
    window.location.hash === "#editions" &&
    !hasCheckedForHash
  ) {
    editionsRef.scrollIntoView();
    // update state to prevent this block from being executed again
    setHasCheckedForHash(true);
  }

  const {
    title,
    meta_imageConnection,
    page_bottom_img_desktopConnection,
    page_bottom_img_mobileConnection,
    hero,
    section_blocks,
    section_heading_wq_text,
    editions_section_title,
    editions_tab_anniversary_bundle,
    editions_tab_deluxe,
    editions_tab_standard,
    editions_section_bg_desktopConnection,
    collectors_edition_bg_imageConnection,
    locale_supports_gradient_font,
    sticky_buy_nav,
    sticky_nav_skus,
  } = data?.nova_product_page ?? {};

  const useStickyNav = UrlUtils.QueryToObject()?.t_nov9_nav === "true";

  return (
    <SpinnerContainer loading={!data || !hasHeroLoaded}>
      <WitchQueenHelmet
        title={title}
        img={WQImgUrlFromQueryProp(meta_imageConnection)}
      />
      <div className={styles.witchQueenContent}>
        <div ref={heroRef}>
          <WQHero setHasLoaded={setHasHeroLoaded} />
        </div>

        <div className={styles.wqLowerContent}>
          {useStickyNav && (
            <WQStickyBuyNav
              heroRef={heroRef}
              logo={
                responsive.mobile
                  ? imageFromConnection(
                      sticky_buy_nav?.wq_logo_mobileConnection
                    )?.url
                  : imageFromConnection(
                      sticky_buy_nav?.wq_logo_desktopConnection
                    )?.url
              }
              skus={sticky_nav_skus?.map((s) => {
                return { label: s.wq_sku.label, sku: s.wq_sku.sku_tag };
              })}
              buyBtnText={sticky_buy_nav?.buy_btn_text}
              dropdownTitle={sticky_buy_nav?.dropdown_title}
              dateText={hero.hero_date_text}
              mobileSkuLabel={sticky_buy_nav?.mobile_dropdown_label}
            />
          )}

          {/* map over modular blocks from contentStack for each section of the page */}
          {section_blocks?.map((sectionObj, i) => {
            const {
              section_class,
              section_bg_desktopConnection,
              section_bg_mobileConnection,
              img_above_headingConnection,
              image_and_text_blocks,
              clickable_thumbnails,
              primary_section_blurbs,
              section_heading,
              section: sectionName,
            } = sectionObj.section_content;

            return (
              <WQSkinnyBlurbSection
                key={i}
                classes={{
                  root: styles[section_class],
                  sectionBg: styles.sectionBg,
                  heading: styles.sectionHeading,
                  blurbWrapper: styles.sectionBlurbWrapper,
                  sectionTopBorder: styles.sectionTopBorder,
                  imgAboveHeading: styles.imgAboveHeading,
                }}
                heading={section_heading}
                imgAboveHeading={WQImgUrlFromQueryProp(
                  img_above_headingConnection
                )}
                useGradientFont={locale_supports_gradient_font}
                headingSectionName={sectionName}
                headingSmallWQText={section_heading_wq_text}
                desktopBgImage={WQImgUrlFromQueryProp(
                  section_bg_desktopConnection
                )}
                mobileBgImage={WQImgUrlFromQueryProp(
                  section_bg_mobileConnection
                )}
                bodyBlurbs={primary_section_blurbs.map((blurbObj) => {
                  return {
                    blurb: blurbObj?.blurb_text,
                    hasSpecialFont: blurbObj?.uses_special_font,
                  };
                })}
              >
                {(clickable_thumbnails?.length ?? 0) > 0 && (
                  <div className={styles.sectionImagesWrapper}>
                    {clickable_thumbnails.map((img, j: number) => {
                      return (
                        <WQClickableImg
                          key={j}
                          thumbnail={WQImgUrlFromQueryProp(
                            img?.thumbnail_imgConnection
                          )}
                          screenshots={clickable_thumbnails.map((thumb) =>
                            WQImgUrlFromQueryProp(
                              thumb?.screenshot_imgConnection
                            )
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
                      styles[`imageTextBlock${section_class}`],
                      styles.bottomContentWrapper
                    )}
                  >
                    {image_and_text_blocks?.map((blockObj, j: number) => {
                      const isFlexReverse = j % 2 !== 0;

                      const screenshotsInSection = image_and_text_blocks.filter(
                        (b) => !b.video_id
                      );
                      const screenshot = imageFromConnection(
                        blockObj.screenshot_imgConnection
                      )?.url;
                      let screenshotIndex = screenshotsInSection.findIndex(
                        (s) =>
                          screenshot &&
                          screenshot ===
                            imageFromConnection(s.screenshot_imgConnection)?.url
                      );

                      if (screenshotIndex === -1) {
                        screenshotIndex = undefined;
                      }

                      return (
                        <WQFlexInfoImgBlock
                          key={j}
                          blurb={blockObj?.blurb}
                          blurbHeading={blockObj?.blurb_heading}
                          thumbnail={WQImgUrlFromQueryProp(
                            blockObj?.thumbnail_imgConnection
                          )}
                          screenshotsInSection={screenshotsInSection.map((s) =>
                            WQImgUrlFromQueryProp(s?.screenshot_imgConnection)
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

          <div className={styles.editionsAnchor} id={"editions"} />
          <WQEditionSelector
            sectionTitle={editions_section_title}
            standardTabTitle={editions_tab_standard}
            deluxeTabTitle={editions_tab_deluxe}
            annivPackTabTitle={editions_tab_anniversary_bundle}
            bgImage={WQImgUrlFromQueryProp(
              editions_section_bg_desktopConnection
            )}
            ceBgImage={WQImgUrlFromQueryProp(
              collectors_edition_bg_imageConnection
            )}
            editionsRef={(ref) => setEditionsRef(ref)}
          />

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
              src={WQImgUrlFromQueryProp(
                responsive.mobile
                  ? page_bottom_img_mobileConnection
                  : page_bottom_img_desktopConnection
              )}
            />
          </div>
        </div>
      </div>
    </SpinnerContainer>
  );
};

// returns the url of an image from an its property in the contentStack query
export const WQImgUrlFromQueryProp = (property: any) => {
  return property?.edges[0]?.node?.url;
};

const WitchQueenHelmet: React.FC<{ title: string; img: string }> = ({
  title,
  img,
}) => {
  return (
    <BungieHelmet title={title} image={img}>
      <body
        className={classNames(
          SpecialBodyClasses(BodyClasses.NoSpacer),
          styles.witchQueen
        )}
      />
    </BungieHelmet>
  );
};

export default WitchQueen;
