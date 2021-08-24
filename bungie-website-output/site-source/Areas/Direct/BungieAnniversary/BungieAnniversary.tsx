// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import AnnivEditionSelector from "@Areas/Direct/BungieAnniversary/sections/AnnivEditionSelector";
import Carousel15 from "@Areas/Seasons/ProductPages/Season15/Components/Carousel15";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import ClickableImgCarousel from "@UI/Marketing/ClickableImgCarousel";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { BungieAnniversaryQuery } from "./__generated__/BungieAnniversaryQuery.graphql";
import { BungieNetLocaleMap } from "@bungie/contentstack/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization/Localizer";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./BungieAnniversary.module.scss";

interface BungieAnniversaryProps {}

const BungieAnniversary: React.FC<BungieAnniversaryProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<BungieAnniversaryQuery>(
    graphql`
      query BungieAnniversaryQuery($locale: String!) {
        bungie_30th_anniversary(uid: "blt31e725130b182abf", locale: $locale) {
          title
          meta_imageConnection {
            edges {
              node {
                url
              }
            }
          }
          hero {
            hero_logoConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_logo_alt_text
            hero_bg_image_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_bg_image_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          first_section {
            headline
            main_heading
            main_blurb
            secondary_heading
            secondary_blurb
            trailer_id {
              title
              href
            }
            bungie_fist_logoConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_bottom_bg_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_bottom_bg_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_top_bg_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_top_bg_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          anniversary_pack_section {
            section_top_bg_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_top_bg_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
            vintage_bungie_logoConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_heading
            text_image_group {
              blurb_heading
              blurb_text
              thumbnailConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              screenshotConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
            section_bottom_bg_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            section_bottom_bg_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          collection_section {
            headline
            section_heading
            section_blurb
            learn_more_btn {
              title
              href
            }
            collection_carousel_slide {
              slide_heading
              slide_imageConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
          editions_section_title
          editions_section_bg_desktopConnection {
            edges {
              node {
                url
              }
            }
          }
          editions_section_bg_mobileConnection {
            edges {
              node {
                url
              }
            }
          }
          bundle_edition_tab
          pack_edition_tab
          media_section_small_title_one
          media_section_small_title_two
        }
      }
    `,
    { locale }
  );

  // returns either the mobile or desktop url of an image based on the screen size
  const getResponsiveBgImage = (
    desktopImg: any,
    mobileImg: any,
    convertToUrlString = true
  ) => {
    const imgUrl =
      desktopImg &&
      annivImgUrlFromQueryProp(responsive.mobile ? mobileImg : desktopImg);

    if (!imgUrl) {
      return undefined;
    } else if (convertToUrlString) {
      return `url(${imgUrl})`;
    } else {
      return imgUrl;
    }
  };

  const {
    title,
    meta_imageConnection,
    hero,
    first_section,
    anniversary_pack_section,
    collection_section,
    editions_section_title,
    bundle_edition_tab,
    pack_edition_tab,
    editions_section_bg_desktopConnection,
    editions_section_bg_mobileConnection,
    media_section_small_title_one,
  } = data?.bungie_30th_anniversary ?? {};

  const heroBgImage = getResponsiveBgImage(
    hero?.hero_bg_image_desktopConnection,
    hero?.hero_bg_image_mobileConnection
  );
  const heroLogoImage = annivImgUrlFromQueryProp(hero?.hero_logoConnection);
  const firstSectionTopBg = getResponsiveBgImage(
    first_section?.section_top_bg_desktopConnection,
    first_section?.section_top_bg_mobileConnection
  );
  const bungieFistLogo = annivImgUrlFromQueryProp(
    first_section?.bungie_fist_logoConnection
  );
  const firstSectionBottomBg = getResponsiveBgImage(
    first_section?.section_bottom_bg_desktopConnection,
    first_section?.section_bottom_bg_mobileConnection
  );
  const packSectionTopBg = getResponsiveBgImage(
    anniversary_pack_section?.section_top_bg_desktopConnection,
    anniversary_pack_section?.section_top_bg_mobileConnection
  );
  const packSectionBottomBg = getResponsiveBgImage(
    anniversary_pack_section?.section_bottom_bg_desktopConnection,
    anniversary_pack_section?.section_bottom_bg_mobileConnection
  );
  const editionsSectionBg = getResponsiveBgImage(
    editions_section_bg_desktopConnection,
    editions_section_bg_mobileConnection,
    false
  );

  return (
    <div className={styles.anniversaryContent}>
      <AnniversaryHelmet title={title} img={meta_imageConnection} />

      <div className={styles.hero} style={{ backgroundImage: heroBgImage }}>
        <img className={styles.heroLogo} src={heroLogoImage} />
      </div>

      <div
        className={styles.celebrationSection}
        style={{ backgroundImage: firstSectionTopBg }}
      >
        <HeptagonPlayButton trailerId={first_section?.trailer_id?.href} />
        <h2
          className={styles.largeHeading}
          dangerouslySetInnerHTML={{ __html: first_section?.main_heading }}
        />
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={{ __html: first_section?.main_blurb }}
        />

        <img src={bungieFistLogo} className={styles.bungieFistLogo} />
        <div className={styles.divider} />
        <h3
          dangerouslySetInnerHTML={{ __html: first_section?.secondary_heading }}
        />
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={{ __html: first_section?.secondary_blurb }}
        />
        <div
          className={styles.bottomBg}
          style={{ backgroundImage: firstSectionBottomBg }}
        />
      </div>

      <div
        className={styles.anniversaryPackSection}
        style={{ backgroundImage: packSectionTopBg }}
      >
        <div className={styles.sectionTopBorder} />
        <img
          src={annivImgUrlFromQueryProp(
            anniversary_pack_section?.vintage_bungie_logoConnection
          )}
          className={styles.bungieLogo}
        />
        <h2
          className={styles.largeHeading}
          dangerouslySetInnerHTML={{
            __html: anniversary_pack_section?.section_heading,
          }}
        />
        {anniversary_pack_section?.text_image_group?.map((group, i) => {
          const flexDirection = i % 2 === 0 ? "normal" : "reverse";

          return (
            <AnnivFlexInfoImgBlock
              key={i}
              blurbHeading={group?.blurb_heading}
              blurb={group?.blurb_text}
              thumbnail={annivImgUrlFromQueryProp(group?.thumbnailConnection)}
              screenshot={annivImgUrlFromQueryProp(group?.screenshotConnection)}
              direction={flexDirection}
            />
          );
        })}

        <div
          className={styles.bottomBg}
          style={{ backgroundImage: packSectionBottomBg }}
        />
      </div>

      <div className={styles.collectionSection}>
        <div className={styles.contentWrapper}>
          <h2
            className={styles.collectionHeading}
            dangerouslySetInnerHTML={{
              __html: collection_section?.section_heading,
            }}
          />
          <p
            className={styles.collectionBlurb}
            dangerouslySetInnerHTML={{
              __html: collection_section?.section_blurb,
            }}
          />
          <a
            href={collection_section?.learn_more_btn?.href}
            className={styles.learnMoreBtn}
          >
            {collection_section?.learn_more_btn?.title}
          </a>
          <ClickableImgCarousel
            slides={collection_section?.collection_carousel_slide?.map(
              (slide, i) => {
                return {
                  image: annivImgUrlFromQueryProp(slide?.slide_imageConnection),
                  title: slide?.slide_heading,
                };
              }
            )}
            classes={{
              slideTitle: styles.slideTitle,
              slideDivider: styles.slideDivider,
              arrow: styles.carouselArrow,
              paginationIndicator: styles.carouselPaginationIndicator,
              selectedPaginationIndicator: styles.selected,
            }}
          />
        </div>
      </div>

      <AnnivEditionSelector
        sectionTitle={editions_section_title}
        annivPackTabTitle={pack_edition_tab}
        deluxePackTabTitle={bundle_edition_tab}
        bgImage={editionsSectionBg}
      />

      <div className={styles.mediaSection}>
        <div className={styles.mediaContent}>
          <FirehoseNewsAndMedia
            useUpdatedComponent={true}
            tag={"anniversary-media"}
            selectedTab={"screenshots"}
            classes={{
              tabBtn: styles.mediaTab,
              selectedTab: styles.selected,
            }}
            smallSeasonText={media_section_small_title_one}
          />
        </div>
      </div>
    </div>
  );
};

const HeptagonPlayButton: React.FC<{ trailerId: string }> = ({ trailerId }) => {
  const showVideo = (videoId: string) => {
    YoutubeModal.show({ videoId });
  };

  return (
    <div
      className={styles.heptagonPlayBtnWrapper}
      onClick={() => showVideo(trailerId)}
    >
      <HeptagonSvg className={styles.outerHeptagon} />
      <HeptagonSvg className={styles.innerHeptagon} />
      <Icon
        className={styles.playIcon}
        iconType={"material"}
        iconName={"play_arrow"}
      />
    </div>
  );
};

const HeptagonSvg: React.FC<{ className: string }> = ({ className }) => {
  return (
    <svg
      className={classNames(styles.heptagonSvg, className)}
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1209.25 1217"
    >
      <polygon
        className={styles.heptagonPoly}
        points="604.62 0.98 130.81 229.15 13.79 741.86 341.68 1153.02 867.57 1153.02 1195.46 741.86 1078.44 229.15 604.62 0.98"
      />
    </svg>
  );
};

const AnniversaryHelmet: React.FC<{ title: string; img: any }> = ({
  title,
  img,
}) => {
  return (
    <BungieHelmet title={title} image={annivImgUrlFromQueryProp(img)}>
      <body
        className={classNames(
          SpecialBodyClasses(BodyClasses.NoSpacer),
          styles.bungieAnniversary
        )}
      />
    </BungieHelmet>
  );
};

interface WQFlexInfoImgBlockProps {
  blurb: string;
  blurbHeading: string;
  thumbnail: string;
  screenshot: string;
  direction: "normal" | "reverse";
}

export const AnnivFlexInfoImgBlock: React.FC<WQFlexInfoImgBlockProps> = (
  props
) => {
  const showImage = () => {
    Modal.open(<img src={`${props.screenshot}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  const wrapperStyles: React.CSSProperties =
    props.direction === "reverse" ? { flexDirection: "row-reverse" } : {};

  const thumbImg = props.thumbnail ? `url(${props.thumbnail})` : undefined;

  return (
    <div className={styles.flexInfoImgBlock} style={wrapperStyles}>
      <div
        className={classNames(styles.blurbWrapper, {
          [styles.reversed]: props.direction === "reverse",
        })}
      >
        <p className={styles.blurbHeading}>{props.blurbHeading}</p>
        <p className={styles.blurb}>{props.blurb}</p>
      </div>
      <div className={styles.clickableImg} onClick={showImage}>
        <div className={styles.aspectRatioBox} />
        <div className={styles.img} style={{ backgroundImage: thumbImg }} />
        <div className={styles.bottomShade} />
      </div>
    </div>
  );
};

const annivImgUrlFromQueryProp = (property: any) => {
  return property?.edges?.[0]?.node?.url;
};

export default BungieAnniversary;
