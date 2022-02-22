import { DestinyShadowkeepQuery } from "@Areas/Destiny/__generated__/DestinyShadowkeepQuery.graphql";
import { IDestinyNewsMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsAndMediaUpdated } from "@Areas/Destiny/Shared/DestinyNewsAndMediaUpdated";
import { Responsive } from "@Boot/Responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import {
  BasicImageConnection,
  imageFromConnection,
} from "@Utilities/GraphQLUtils";
import React, { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./DestinyShadowkeep.module.scss";
import Hero from "./Shadowkeep/ShadowkeepHero";
import { Localizer } from "@bungie/localization";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import classNames from "classnames";

interface DestinyShadowkeepProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const DestinyShadowkeep: React.FC<DestinyShadowkeepProps> = (props) => {
  const { mobile } = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName ?? "en");
  const data = useLazyLoadQuery<DestinyShadowkeepQuery>(
    graphql`
      query DestinyShadowkeepQuery($locale: String!) {
        shadowkeep_product_page(uid: "blt844464dc79de73b7", locale: $locale) {
          title
          meta_imgConnection {
            edges {
              node {
                url
              }
            }
          }
          hero {
            btn_title
            background {
              mobileConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              desktopConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
            logoConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          subnav {
            btn_title
            labels {
              ... on ShadowkeepProductPageSubnavLabels {
                label_id
                label
              }
            }
          }
          gear_section {
            section_bg {
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
            small_title
            section_title
            info_blocks {
              ... on ShadowkeepProductPageGearSectionInfoBlocks {
                blurb
                heading
                imageConnection {
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
          story_section {
            section_bg {
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
            mobile_flames_bgConnection {
              edges {
                node {
                  url
                }
              }
            }
            small_title
            section_title
            blurb
            thumbnailConnection {
              edges {
                node {
                  url
                }
              }
            }
            thumbnail_blurb
            thumb_video_id
            thumbnail_heading
          }
          endgame_section {
            section_bg {
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
            eris_iconConnection {
              edges {
                node {
                  url
                }
              }
            }
            small_title
            section_title
            info_blocks {
              ... on ShadowkeepProductPageEndgameSectionInfoBlocks {
                blurb
                heading
                imageConnection {
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
          cta {
            section_bg {
              mobileConnection {
                edges {
                  node {
                    url
                  }
                }
              }
              desktopConnection {
                edges {
                  node {
                    url
                  }
                }
              }
            }
            btn_title
            logoConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
          media {
            screenshot {
              ... on ShadowkeepProductPageMediaScreenshot {
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
              }
            }
            video {
              ... on ShadowkeepProductPageMediaVideo {
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
            wallpaper {
              ... on ShadowkeepProductPageMediaWallpaper {
                wallpaperConnection {
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
          }
        }
      }
    `,
    { locale }
  );

  const {
    hero,
    story_section,
    gear_section,
    endgame_section,
    cta,
    subnav,
    meta_imgConnection,
    title,
    media,
  } = data?.shadowkeep_product_page ?? {};

  const getResponsiveBg = (
    desktopImg: BasicImageConnection,
    mobileImg: BasicImageConnection,
    isMobile: boolean
  ): string | undefined => {
    const img = isMobile
      ? imageFromConnection(mobileImg)?.url
      : imageFromConnection(desktopImg)?.url;

    return img ? `url(${img})` : undefined;
  };

  const [heroRef, setHeroRef] = useState(null);

  const storyBg = getResponsiveBg(
    story_section?.section_bg.desktopConnection,
    story_section?.section_bg.mobileConnection,
    mobile
  );
  const storyFlamesBg = imageFromConnection(
    story_section?.mobile_flames_bgConnection
  )?.url;
  const gearBg = getResponsiveBg(
    gear_section?.section_bg.desktopConnection,
    gear_section?.section_bg.mobileConnection,
    mobile
  );
  const endgameBg = getResponsiveBg(
    endgame_section?.section_bg.desktopConnection,
    endgame_section?.section_bg.mobileConnection,
    mobile
  );
  const ctaBg = getResponsiveBg(
    cta?.section_bg.desktopConnection,
    cta?.section_bg.mobileConnection,
    mobile
  );

  const gearScreenshots = gear_section?.info_blocks
    .filter((block) => !block.video_id)
    .map((block) => imageFromConnection(block.imageConnection)?.url);
  const endgameScreenshots = endgame_section?.info_blocks
    .filter((block) => !block.video_id)
    .map((block) => imageFromConnection(block.imageConnection)?.url);

  const endgameIcon = endgame_section?.eris_iconConnection
    ? `url(${imageFromConnection(endgame_section?.eris_iconConnection)?.url})`
    : undefined;

  const mediaScreenshots: IDestinyNewsMedia[] = media?.screenshot.map((s) => ({
    isVideo: false,
    thumbnail:
      imageFromConnection(s.thumbnailConnection)?.url ||
      `${imageFromConnection(s.screenshotConnection)?.url}?width=500`,
    detail: imageFromConnection(s.screenshotConnection)?.url,
  }));

  const mediaVideos: IDestinyNewsMedia[] = media?.video.map((v) => ({
    isVideo: true,
    thumbnail: imageFromConnection(v?.thumbnailConnection)?.url,
    detail: v?.video_id,
  }));

  const mediaWallpapers: IDestinyNewsMedia[] = media?.wallpaper.map((w) => ({
    isVideo: false,
    thumbnail: imageFromConnection(w?.thumbnailConnection).url,
    detail: imageFromConnection(w?.wallpaperConnection)?.url,
  }));

  return (
    <div className={styles.shadowkeepPage}>
      <BungieHelmet
        title={title}
        image={imageFromConnection(meta_imgConnection)?.url}
      >
        <body
          className={classNames(
            styles.shadowkeep,
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <div className={styles.shadowkeepContent}>
        <Hero inputRef={(ref) => setHeroRef(ref)} data={hero} />

        <MarketingSubNav
          ids={Object.keys(idToElementsMapping)}
          renderLabel={(id, index) => {
            const label = subnav?.labels.find(
              (l) => l.label_id === `${id}_nav_label`
            );

            return label?.label;
          }}
          buttonProps={{
            children: subnav?.btn_title,
            buttonType: "gold",
            url: RouteHelper.DestinyBuyDetail({
              productFamilyTag: "Shadowkeep",
            }),
          }}
          primaryColor={"taupe"}
          accentColor={"gold"}
        />

        <div
          className={styles.storySection}
          id={"story"}
          ref={(el) => (idToElementsMapping["story"] = el)}
        >
          <div
            className={styles.sectionBg}
            style={{ backgroundImage: storyBg }}
          />
          <div
            className={styles.mobileFlamesBg}
            style={{ backgroundImage: `url(${storyFlamesBg})` }}
          />
          <div className={styles.contentWrapper}>
            <h3 className={styles.smallTitle}>{story_section?.small_title}</h3>
            <div className={styles.titleDivider} />
            <h2
              className={styles.sectionTitle}
              dangerouslySetInnerHTML={sanitizeHTML(
                story_section?.section_title
              )}
            />
            <p className={styles.blurb}>{story_section?.blurb}</p>
            <div className={styles.thumbnailOuterWrapper}>
              <div className={styles.thumbnailWrapper}>
                <ClickableMediaThumbnail
                  videoId={story_section?.thumb_video_id}
                  thumbnail={
                    imageFromConnection(story_section?.thumbnailConnection)?.url
                  }
                  showShadowBehindPlayIcon
                />
                <p className={styles.blurbHeading}>
                  {story_section?.thumbnail_heading}
                </p>
                <p className={styles.blurb}>{story_section?.thumbnail_blurb}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={styles.moonSection}
          id={"gear"}
          ref={(el) => (idToElementsMapping["gear"] = el)}
        >
          <div
            className={classNames(styles.sectionBg, styles.top)}
            style={{ backgroundImage: gearBg }}
          />
          <div
            className={classNames(styles.sectionBg, styles.bottom)}
            style={{ backgroundImage: endgameBg }}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.topContent}>
              <h3 className={styles.smallTitle}>{gear_section?.small_title}</h3>
              <div className={styles.titleDivider} />
              <h2
                className={styles.sectionTitle}
                dangerouslySetInnerHTML={sanitizeHTML(
                  gear_section?.section_title
                )}
              />
              <div>
                {gear_section?.info_blocks?.map((block, i) => {
                  return (
                    <ShadowkeepInfoBlock
                      key={i}
                      blurb={block.blurb}
                      blurbHeading={block.heading}
                      direction={i % 2 !== 0 ? "normal" : "reverse"}
                      singleOrAllScreenshots={gearScreenshots}
                      screenshotIndex={i}
                      thumbnail={
                        imageFromConnection(block.imageConnection)?.url
                      }
                    />
                  );
                })}
              </div>
            </div>
            <div
              className={styles.bottomContent}
              id={"endgame"}
              ref={(el) => (idToElementsMapping["endgame"] = el)}
            >
              <div
                className={styles.icon}
                style={{ backgroundImage: endgameIcon }}
              />
              <h3 className={styles.smallTitle}>
                {endgame_section?.small_title}
              </h3>
              <div className={styles.titleDivider} />
              <h2
                className={styles.sectionTitle}
                dangerouslySetInnerHTML={sanitizeHTML(
                  endgame_section?.section_title
                )}
              />
              <div>
                {endgame_section?.info_blocks?.map((block, i) => {
                  return (
                    <ShadowkeepInfoBlock
                      key={i}
                      blurb={block.blurb}
                      blurbHeading={block.heading}
                      direction={i % 2 === 0 ? "normal" : "reverse"}
                      singleOrAllScreenshots={endgameScreenshots}
                      screenshotIndex={i}
                      thumbnail={
                        imageFromConnection(block.imageConnection)?.url
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cta} style={{ backgroundImage: ctaBg }}>
          <div className={styles.ctaContent}>
            <img
              className={styles.logo}
              src={imageFromConnection(cta?.logoConnection)?.url}
            />
            <Button
              url={RouteHelper.DestinyBuyDetail({
                productFamilyTag: "Shadowkeep",
              })}
              children={cta?.btn_title}
              className={styles.ctaBtn}
              buttonType={"gold"}
            />
          </div>
        </div>
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
  );
};

interface IShadowkeepInfoBlock extends ClickableMediaThumbnailProps {
  blurb: string;
  blurbHeading: string;
  direction: "normal" | "reverse";
}

const ShadowkeepInfoBlock: React.FC<IShadowkeepInfoBlock> = (props) => {
  const { blurbHeading, blurb, direction, ...rest } = props;

  const wrapperStyles: React.CSSProperties =
    props.direction === "reverse" ? { flexDirection: "row-reverse" } : {};

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
      <div className={styles.thumbnailWrapper}>
        <ClickableMediaThumbnail
          {...rest}
          showBottomShade={true}
          classes={{
            btnWrapper: styles.clickableImg,
            btnBottomShade: styles.btnShade,
          }}
        />
      </div>
    </div>
  );
};

export default DestinyShadowkeep;
