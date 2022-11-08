// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import AnnivEditionSelector from "@Areas/Direct/BungieAnniversary/sections/AnnivEditionSelector";
import { AnnivRewardsList } from "@Areas/Direct/BungieAnniversary/sections/AnnivRewardsList";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { Button } from "@UIKit/Controls/Button/Button";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization/Localizer";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./BungieAnniversary.module.scss";

interface BungieAnniversaryProps {}

const BungieAnniversary: React.FC<BungieAnniversaryProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [data, setData] = useState(null);

  useEffect(() => {
    ContentStackClient()
      .ContentType("bungie_30th_anniversary_v2")
      .Entry("blt94f096071905697b")
      .language(locale)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

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
    meta_image,
    hero,
    celebration_section,
    dungeon_section,
    free_to_play_section,
    gjallarhorn_section,
    media_section_small_title_two,
    requirement_headline,
    rewards_list_section,
    rewards_section,
    bungie_logo,
    editions_section_title,
    bundle_edition_tab,
    pack_edition_tab,
    editions_section_bg_desktop,
    media_section_small_title_one,
    subnav_btn_text,
  } = data ?? {};

  const subnavLinks = [
    {
      id: dungeon_section?.subnav_detail.section_id,
      label: dungeon_section?.subnav_detail.subnav_label,
    },
    {
      id: gjallarhorn_section?.subnav_detail.section_id,
      label: gjallarhorn_section?.subnav_detail.section_label,
    },
    {
      id: free_to_play_section?.subnav_detail.section_id,
      label: free_to_play_section?.subnav_detail.subnav_label,
    },
    {
      id: celebration_section?.subnav_detail.section_id,
      label: celebration_section?.subnav_detail.subnav_label,
    },
  ];

  const heroBgImage = getResponsiveBgImage(
    hero?.hero_bg_image_desktop,
    hero?.hero_bg_image_mobile
  );
  const heroLogoImage = annivImgUrlFromQueryProp(hero?.hero_logo);
  const dungeonBg = getResponsiveBgImage(
    dungeon_section?.section_bg_desktop,
    dungeon_section?.section_bg_mobile
  );
  const celebrationBg = getResponsiveBgImage(
    celebration_section?.section_bg_desktop,
    celebration_section?.section_bg_mobile
  );
  const gallySectionBg = getResponsiveBgImage(
    gjallarhorn_section?.bg_desktop,
    gjallarhorn_section?.bg_mobile
  );
  const rewardsSectionBg = getResponsiveBgImage(
    rewards_section?.section_bg_desktop,
    rewards_section?.section_bg_mobile
  );
  const rewardsListSectionBg = getResponsiveBgImage(
    rewards_list_section?.section_bg_desktop,
    rewards_list_section?.section_bg_mobile
  );
  const freeToPlaySectionTopBg = getResponsiveBgImage(
    free_to_play_section?.top_bg_desktop,
    free_to_play_section?.top_bg_mobile
  );
  const freeToPlaySectionBottomBg = getResponsiveBgImage(
    free_to_play_section?.bottom_bg_desktop,
    free_to_play_section?.bottom_bg_mobile
  );
  const editionsSectionBg = annivImgUrlFromQueryProp(
    editions_section_bg_desktop
  );

  return (
    <div className={styles.anniversaryContent}>
      <AnniversaryHelmet title={title} img={meta_image} />

      <div className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: heroBgImage }}
        />
        <div className={styles.heroContent}>
          <img className={styles.heroLogo} src={heroLogoImage} />
          <div className={styles.heroBtns}>
            <Button
              className={styles.trailerBtn}
              onClick={() =>
                YoutubeModal.show({ videoId: hero?.trailer_btn.trailer_id })
              }
              disabled={!hero?.trailer_btn.trailer_id}
            >
              {hero?.trailer_btn.title}
            </Button>
            <Button
              className={styles.buyBtn}
              url={`/7/${Localizer.CurrentCultureName}/Destiny/Buy/Anniversary`}
            >
              {hero?.buy_btn.title}
            </Button>
          </div>
          <p className={styles.availabilityText}>{hero?.availability_text}</p>
        </div>
      </div>

      <MarketingSubNav
        ids={subnavLinks.map((l) => l.id)}
        renderLabel={(id, i) => subnavLinks[i]?.label}
        primaryColor={"darkBlue"}
        accentColor={"gold"}
        buttonProps={{
          children: subnav_btn_text,
          url: `/7/${Localizer.CurrentCultureName}/Destiny/Buy/Anniversary`,
          buttonType: "gold",
        }}
        withGutter={true}
      />

      <div className={styles.dungeonSection}>
        <div
          className={styles.sectionBg}
          style={{ backgroundImage: dungeonBg }}
          id={subnavLinks[0].id}
        />
        <div className={styles.dungeonContent}>
          <SectionSmallTitle title={dungeon_section?.small_title} />
          <h2
            className={styles.largeHeading}
            dangerouslySetInnerHTML={sanitizeHTML(
              dungeon_section?.section_title
            )}
          />
          <p className={styles.blurb}>{dungeon_section?.main_blurb}</p>

          <Requires30thBanner
            crest={annivImgUrlFromQueryProp(bungie_logo)}
            text={requirement_headline}
          />

          <div className={styles.thumbnailsWrapper}>
            {dungeon_section?.info_block.map((b: any, i: number) => {
              return (
                <div className={styles.flexBlock} key={i}>
                  <ClickableMediaThumbnail
                    screenshotIndex={i}
                    singleOrAllScreenshots={dungeon_section?.info_block.map(
                      (block: any) => annivImgUrlFromQueryProp(block.img)
                    )}
                    thumbnail={annivImgUrlFromQueryProp(b.img, 500)}
                    classes={{ btnWrapper: styles.thumbnail }}
                    showBottomShade
                  />
                  <h4>{b.title}</h4>
                  <p>{b.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.gallySection} id={subnavLinks[1].id}>
        <div
          className={styles.sectionBg}
          style={{ backgroundImage: gallySectionBg }}
        />
        <img
          className={styles.logo}
          src={annivImgUrlFromQueryProp(gjallarhorn_section?.gjallarhorn_logo)}
        />
        <p className={styles.blurb}>{gjallarhorn_section?.blurb}</p>
      </div>

      <div className={styles.rewardsSection}>
        ={" "}
        <div
          className={styles.sectionBg}
          style={{ backgroundImage: rewardsSectionBg }}
        />
        <div className={styles.sectionTopBorder} />
        <div className={styles.weaponImg}>
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${annivImgUrlFromQueryProp(
                gjallarhorn_section?.weapon_img
              )})`,
            }}
          />
        </div>
        <div className={styles.sectionContent}>
          <SectionSmallTitle title={rewards_section?.small_title} />
          <h2
            className={styles.largeHeading}
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.section_title
            )}
          />
          <p className={styles.blurb}>{rewards_section?.blurb}</p>

          <Requires30thBanner
            crest={annivImgUrlFromQueryProp(bungie_logo)}
            text={requirement_headline}
          />

          {rewards_section?.text_image_group.map((group: any, i: number) => {
            const flexDirection = i % 2 === 0 ? "normal" : "reverse";

            return (
              <AnnivFlexInfoImgBlock
                screenshotIndex={i}
                singleOrAllScreenshots={rewards_section?.text_image_group.map(
                  (g: any) => annivImgUrlFromQueryProp(g.img)
                )}
                thumbnail={annivImgUrlFromQueryProp(group.img, 700)}
                blurbHeading={group.blurb_heading}
                blurb={group.blurb}
                direction={flexDirection}
                key={i}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.freeToPlaySection} id={subnavLinks[2].id}>
        ={" "}
        <div
          className={classNames(styles.sectionBg, styles.top)}
          style={{ backgroundImage: freeToPlaySectionTopBg }}
        />
        <div className={styles.sectionTopBorder} />
        ={" "}
        <div
          className={classNames(styles.sectionBg, styles.bottom)}
          style={{ backgroundImage: freeToPlaySectionBottomBg }}
        />
        <div className={styles.sectionContent}>
          <SectionSmallTitle title={free_to_play_section?.small_title} />
          <h2
            className={styles.largeHeading}
            dangerouslySetInnerHTML={sanitizeHTML(
              free_to_play_section?.section_title
            )}
          />
          <p className={styles.blurb}>
            {free_to_play_section?.secondary_heading}
          </p>

          {free_to_play_section?.text_image_group.map(
            (group: any, i: number) => {
              const flexDirection = i % 2 === 0 ? "normal" : "reverse";

              return (
                <AnnivFlexInfoImgBlock
                  screenshotIndex={i}
                  singleOrAllScreenshots={free_to_play_section?.text_image_group.map(
                    (g: any) => annivImgUrlFromQueryProp(g.img)
                  )}
                  thumbnail={annivImgUrlFromQueryProp(group.img, 700)}
                  blurbHeading={group.blurb_heading}
                  blurb={group.blurb}
                  direction={flexDirection}
                  key={i}
                />
              );
            }
          )}
        </div>
      </div>

      <div className={styles.rewardsListSection}>
        <div
          className={styles.sectionBg}
          style={{ backgroundImage: rewardsListSectionBg }}
        />
        <div className={styles.sectionTopBorder} />
        <div className={styles.listWrapper}>
          <AnnivRewardsList
            oddRowBgColor={"red"}
            evenRowBgColor={"blue"}
            logo={annivImgUrlFromQueryProp(rewards_list_section?.crest)}
            rewardGroups={rewards_list_section?.rewards_table.reward_group.map(
              (rg: any) => {
                return {
                  groupName: rg.group_name,
                  isFree: rg.is_free,
                  rows: rg.rows.map((row: any) => {
                    return {
                      isFree: row.is_free,
                      reward: row.reward_name,
                    };
                  }),
                };
              }
            )}
            packOwnerHeading={rewards_list_section?.pack_owners_heading}
            freeForAllHeading={rewards_list_section?.free_heading}
          />
        </div>
      </div>

      <div
        className={styles.celebrationSection}
        id={subnavLinks[3].id}
        style={{ backgroundImage: celebrationBg }}
      >
        <div className={styles.sectionTopBorder} />
        <HeptagonPlayButton trailerId={celebration_section?.trailer_id} />
        <h2
          className={styles.largeHeading}
          dangerouslySetInnerHTML={sanitizeHTML(
            celebration_section?.section_title
          )}
        />
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(celebration_section?.blurb)}
        />
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

interface AnnivFlexInfoImgBlockProps extends ClickableMediaThumbnailProps {
  blurb: string;
  blurbHeading: string;
  direction: "normal" | "reverse";
}

export const AnnivFlexInfoImgBlock: React.FC<AnnivFlexInfoImgBlockProps> = (
  props
) => {
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

/* small title for a section with a divider beneath */
const SectionSmallTitle = (props: { title: string }) => {
  return (
    <>
      <h3 className={styles.sectionSmallTitle}>{props.title}</h3>
      <div className={styles.smallTitleDivider} />
    </>
  );
};

const Requires30thBanner = (props: { crest: string; text: string }) => {
  return (
    <div className={styles.requirementBanner}>
      <div className={styles.crestWrapper}>
        <div
          className={styles.crest}
          style={{ backgroundImage: `url(${props.crest})` }}
        />
      </div>
      <p>{props.text}</p>
      <div className={styles.spacer} />
    </div>
  );
};

const annivImgUrlFromQueryProp = (property: any, width?: number) => {
  const img = property?.url;

  return `${img}${width ? `?width=${width}` : ""}`;
};

export default BungieAnniversary;
