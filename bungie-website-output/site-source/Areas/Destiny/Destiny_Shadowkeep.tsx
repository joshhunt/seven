import { IDestinyNewsMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsAndMediaUpdated } from "@Areas/Destiny/Shared/DestinyNewsAndMediaUpdated";
import { Responsive } from "@Boot/Responsive";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { Spinner } from "@UIKit/Controls/Spinner";
import { bgImageFromStackFile } from "@Utilities/ContentStackUtils";
import React, { useEffect, useState } from "react";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./DestinyShadowkeep.module.scss";
import Hero from "./Shadowkeep/ShadowkeepHero";
import { Localizer } from "@bungie/localization";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import classNames from "classnames";

interface DestinyShadowkeepProps {}

const idToElementsMapping: { [key: string]: HTMLDivElement } = {};

const DestinyShadowkeep: React.FC<DestinyShadowkeepProps> = (props) => {
  const isMobile = useDataStore(Responsive)?.mobile;

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName ?? "en");
  const [data, setData] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("shadowkeep_product_page")
      .Entry("blt844464dc79de73b7")
      .language(locale)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    title,
    meta_img,
    hero,
    subnav,
    story_section,
    gear_section,
    endgame_section,
    cta,
    media,
  } = data ?? {};

  const [heroRef, setHeroRef] = useState(null);

  if (!data) {
    return <Spinner on={true} />;
  }

  const storyBg = bgImageFromStackFile(story_section.section_bg.desktop);
  const storyBgMobile = bgImageFromStackFile(story_section.section_bg.mobile);
  const storyFlamesBg = story_section?.mobile_flames_bg?.url;
  const gearBgDesktop = bgImageFromStackFile(gear_section?.section_bg.desktop);
  const gearBgMobile = bgImageFromStackFile(gear_section?.section_bg.mobile);
  const endgameBgDesktop = bgImageFromStackFile(
    endgame_section?.section_bg.desktop
  );
  const endgameBgMobile = bgImageFromStackFile(
    endgame_section?.section_bg.mobile
  );
  const ctaBgDesktop = bgImageFromStackFile(cta?.section_bg.desktop);
  const ctaBgMobile = bgImageFromStackFile(cta?.section_bg.mobile);
  const gearScreenshots = gear_section?.info_blocks
    .filter((block: { video_id: any }) => !block.video_id)
    .map((block: { image: any }) => block.image?.url);
  const endgameScreenshots = endgame_section?.info_blocks
    .filter((block: { video_id: any }) => !block.video_id)
    .map((block: { image: any }) => block.image?.url);

  const endgameIcon = endgame_section?.eris_icon
    ? `url(${endgame_section?.eris_icon?.url})`
    : undefined;

  const mediaScreenshots: IDestinyNewsMedia[] = media?.screenshots?.map(
    (s: any) => ({
      isVideo: false,
      thumbnail:
        s.screenshot?.thumbnail?.url || `${s.screenshot?.image?.url}?width=500`,
      detail: s.screenshot?.image?.url,
    })
  );

  const mediaVideos: IDestinyNewsMedia[] = media?.videos?.map((vid: any) => ({
    isVideo: true,
    thumbnail: vid.thumbnail?.url,
    detail: vid.video_id,
  }));

  const mediaWallpapers: IDestinyNewsMedia[] = media?.wallpapers?.map(
    (wall: any) => ({
      isVideo: false,
      thumbnail: wall?.thumbnail?.url,
      detail: wall?.wallpaper?.url,
    })
  );

  // map over subnav labels coming from CS to ensure labels are in correct order
  const subNavIds = subnav?.labels
    ?.map((eLabel: { label_id: string }) => {
      const navId = eLabel.label_id?.replace("_nav_label", "");

      return idToElementsMapping[navId] && navId;
    })
    .filter((eLabel: any) => !!eLabel);

  return (
    <div className={styles.shadowkeepPage}>
      <BungieHelmet title={title} image={meta_img?.url}>
        <body
          className={classNames(
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <div className={styles.shadowkeepContent}>
        <Hero inputRef={(ref) => setHeroRef(ref)} data={hero} />

        <MarketingSubNav
          ids={subNavIds}
          renderLabel={(id, index) => {
            const currentLabel = subnav?.labels.find(
              (currLabel: { label_id: string }) =>
                currLabel.label_id === `${id}_nav_label`
            );

            return currentLabel?.label;
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
            style={{ backgroundImage: isMobile ? storyBgMobile : storyBg }}
          />
          <div
            className={styles.mobileFlamesBg}
            style={{ backgroundImage: `url(${storyFlamesBg})` }}
          />
          <div className={styles.contentWrapper}>
            <h3 className={styles.smallTitle}>{story_section?.small_title}</h3>
            <div className={styles.titleDivider} />
            <h2
              dangerouslySetInnerHTML={sanitizeHTML(
                story_section?.section_title
              )}
            />
            <p className={styles.blurb}>{story_section?.blurb}</p>
            <div className={styles.thumbnailOuterWrapper}>
              <div className={styles.thumbnailWrapper}>
                <ClickableMediaThumbnail
                  videoId={story_section?.thumb_video_id}
                  thumbnail={story_section?.thumbnail?.url}
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
            style={{ backgroundImage: isMobile ? gearBgMobile : gearBgDesktop }}
          />
          <div
            className={classNames(styles.sectionBg, styles.bottom)}
            style={{
              backgroundImage: isMobile ? endgameBgMobile : endgameBgDesktop,
            }}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.topContent}>
              <h3 className={styles.smallTitle}>{gear_section?.small_title}</h3>
              <div className={styles.titleDivider} />
              <h2
                dangerouslySetInnerHTML={sanitizeHTML(
                  gear_section?.section_title
                )}
              />
              <div>
                {gear_section?.info_blocks?.map(
                  (
                    block: {
                      blurb: string;
                      heading: string;
                      image: { url: string };
                    },
                    i: number
                  ) => {
                    return (
                      <ShadowkeepInfoBlock
                        key={i}
                        blurb={block.blurb}
                        blurbHeading={block.heading}
                        direction={i % 2 !== 0 ? "normal" : "reverse"}
                        singleOrAllScreenshots={gearScreenshots}
                        screenshotIndex={i}
                        thumbnail={block.image?.url}
                      />
                    );
                  }
                )}
              </div>
            </div>
            <div
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
                dangerouslySetInnerHTML={sanitizeHTML(
                  endgame_section?.section_title
                )}
              />
              <div>
                {endgame_section?.info_blocks?.map(
                  (
                    block: {
                      blurb: string;
                      heading: string;
                      image: { url: string };
                    },
                    i: number
                  ) => {
                    return (
                      <ShadowkeepInfoBlock
                        key={i}
                        blurb={block.blurb}
                        blurbHeading={block.heading}
                        direction={i % 2 === 0 ? "normal" : "reverse"}
                        singleOrAllScreenshots={endgameScreenshots}
                        screenshotIndex={i}
                        thumbnail={block.image?.url}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.cta}
          style={{ backgroundImage: isMobile ? ctaBgMobile : ctaBgDesktop }}
        >
          <div className={styles.ctaContent}>
            <img className={styles.logo} src={cta?.logo?.url} />
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
          classes={{ btnWrapper: styles.clickableImg }}
        />
      </div>
    </div>
  );
};

export default DestinyShadowkeep;
