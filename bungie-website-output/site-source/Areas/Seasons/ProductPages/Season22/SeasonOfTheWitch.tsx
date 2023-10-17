// Created by ahipp, 2023
// Copyright Bungie, Inc.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import {
  DefaultPmpComponents,
  extendDefaultComponents,
  PartialPmpReferenceMap,
} from "@Boot/ProceduralMarketingPageFallback";
import { Responsive } from "@Boot/Responsive";
import { useReferenceMap } from "@bungie/contentstack/ReferenceMap/ReferenceMap";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { WithContentTypeUids } from "@Utilities/ContentStackUtils";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { PmpNavigationBar } from "@UI/Marketing/FragmentComponents/PmpNavigationBar";
import { PmpCallout } from "@UI/Marketing/Fragments/PmpCallout";
import { PmpIconActionCards } from "@UI/Marketing/Fragments/PmpIconActionCards/PmpIconActionCards";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { PmpMedia } from "@UI/Marketing/Fragments/PmpMedia";
import { PmpMediaCarousel } from "@UI/Marketing/Fragments/PmpMediaCarousel";
import { PmpRewardsList } from "@UI/Marketing/Fragments/PmpRewardsList/PmpRewardsList";
import { PmpSectionHeader } from "@UI/Marketing/Fragments/PmpSectionHeader";
import { PmpStackedInfoThumbBlocks } from "@UI/Marketing/Fragments/PmpStackedInfoThumbBlocks";
import { PmpCallToAction } from "@UI/Marketing/FragmentComponents/PmpCallToAction";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BuyButton } from "@UIKit/Controls/Button/BuyButton";
import cardStyles from "@UI/Marketing/IconActionCard.module.scss";
import { BnetStackS18ProductPage } from "../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import EventCallout from "@Areas/Seasons/ProductPages/Season22/Components/EventCallout/EventCallout";
import FeaturedImage from "@Areas/Seasons/ProductPages/Season22/Components/FeaturedImage/FeaturedImage";
import { S22Hero } from "@Areas/Seasons/ProductPages/Season22/Components/Hero/S22Hero";
import RewardsAndCalendar21 from "@Areas/Seasons/ProductPages/Season22/Components/SeasonPassRewards/S22SeasonPassRewards";

import styles from "./SeasonOfTheWitch.module.scss";

interface SeasonOfTheWitchProps {}

/* All pmp component overrides can be specified globally here since they all reference the same stylesheet */
const pmpComponentOverrides: PartialPmpReferenceMap = {
  pmp_section_header: (ref) => (
    <PmpSectionHeader
      data={ref?.data}
      classes={{
        heading: styles.sectionHeading,
        blurb: styles.sectionHeaderBlurb,
      }}
    />
  ),
  pmp_callout: (ref) => <PmpCallout data={ref?.data} classes={{}} />,
  pmp_icon_action_cards: (ref) => (
    <PmpIconActionCards data={ref?.data} classes={{}} />
  ),
  pmp_info_thumbnail_group: (ref) => (
    <PmpInfoThumbnailGroup
      data={ref?.data}
      classes={{
        blurb: styles.infoThumbnailsGroupBlurb,
      }}
    />
  ),
  pmp_media_carousel: (ref) => (
    <PmpMediaCarousel
      data={ref?.data}
      classes={{
        slideBlurb: styles.slideBlurb,
      }}
    />
  ),
  pmp_media: (ref) => <PmpMedia data={ref?.data} classes={{}} />,
  pmp_rewards_list: (ref) => (
    <PmpRewardsList data={ref?.data} classes={{ root: styles.rewardsList }} />
  ),
  pmp_stacked_info_thumb_blocks: (ref) => (
    <PmpStackedInfoThumbBlocks data={ref?.data} classes={{}} />
  ),
};

const SeasonOfTheWitch = (props: SeasonOfTheWitchProps) => {
  const [data, setData] = useState<null | any>(null);
  const { medium, mobile } = useDataStore(Responsive);

  const eventRef = useRef<HTMLDivElement | null>(null);

  // To be reconnected
  // const contentReferences: (`${keyof BnetStackS20ProductPage}.content` | keyof BnetStackS20ProductPage | string)[] = [
  const contentReferences = [
    "sub_nav",
    "platforms.button",
    "story_section.content",
    "activities_section.content",
    "mission_section.content",
    "gear_section.content",
    "rewards_section.content",
    "free_for_all_section",
    "free_for_all_section.content",
    "season_pass_section.content",
    "s22_section.content",
    "s22_section.featured.copy",
    "s22_section.featured.image",
    "s22_section.bg_assets",
    "s22_section.bg_assets.layer_1",
    "bundle_section.content",
    "cta_section.content",
    "cta_section.content.buttons",
    "media_section.content",
    "learn_more_section.content",
  ];

  useEffect(() => {
    ContentStackClient()
      .ContentType("s22_product_page")
      .Entry("blt1aa49ff22a096f78")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(contentReferences)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const scrollToEventSection = () => {
    eventRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  type TResponsiveBg = BnetStackS18ProductPage["story_section"]["top_bg"];

  const getResponsiveBg = useCallback(
    (image: TResponsiveBg) => {
      const img = mobile ? image?.mobile_bg : image?.desktop_bg;

      return img?.url
        ? `url(${img?.url}?width=${mobile ? 768 : 1920})`
        : undefined;
    },
    [mobile]
  );

  const getResponsiveImg = useCallback(
    (image: TResponsiveBg) => {
      const img = medium ? image?.mobile_bg : image?.desktop_bg;

      return img?.url || undefined;
    },
    [medium]
  );
  const {
    title,
    hero,
    sub_nav,
    sub_nav_btn_text,
    story_section,
    activities_section,
    free_for_all_section,
    gear_section,
    season_pass_section,
    rewards_section,
    bundle_section,
    cta_section,
    media_section,
    learn_more_section,
    s22_section,
  } = data ?? {};

  const openBuyModal = () => {
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.SilverBundle });
  };

  const showEvent = hero?.scroll_button?.label?.length > 0;
  const { layer_1, layer_2, layer_3 } = s22_section?.bg_assets || {};
  const eventBottomBg = getResponsiveImg(s22_section?.bottom_bg);

  return (
    <div className={styles.seasonOfDefiance}>
      <BungieHelmet title={title}>
        <body
          className={classNames(
            SpecialBodyClasses(
              BodyClasses.NoSpacer | BodyClasses.HideServiceAlert
            )
          )}
        />
      </BungieHelmet>

      <div className={styles.pageFixedContent}>
        {/* HERO */}
        <S22Hero
          data={hero}
          scrollToEvent={scrollToEventSection}
          showCTA={false}
          openBuyModal={openBuyModal}
          showEventButton={showEvent}
        />

        {/* SUB NAV */}
        <PmpNavigationBar
          data={sub_nav?.[0]}
          accentColor={"s22"}
          primaryColor={"s22"}
          buttonProps={{
            children: sub_nav_btn_text,
            onClick: openBuyModal,
            buttonType: "gold",
          }}
        />

        {/* STORY */}
        <div
          id={"story"}
          className={classNames(styles.section, styles.story)}
          style={{ backgroundImage: getResponsiveBg(story_section?.bg) }}
        >
          <S20ProceduralContent
            content={story_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.storySectionHeader,
                    secondaryHeading: styles.storySectionSecondaryHeading,
                    textWrapper: styles.storySectionHeaderTextWrapper,
                    blurb: styles.storySectionHeaderTextBlurb,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* ACTIVITIES */}
        <div
          className={styles.sectionDivider}
          style={{
            background:
              "linear-gradient(-90deg, #D1FF63 0%, rgba(209, 255, 99, 0.00) 100%)",
          }}
        />
        <div
          id={"activity"}
          className={classNames(styles.section, styles.activities)}
          style={{ backgroundImage: getResponsiveBg(activities_section?.bg) }}
        >
          <S20ProceduralContent
            content={activities_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.activitiesSectionHeader,
                  }}
                />
              ),
              pmp_icon_action_cards: (ref) => (
                <PmpIconActionCards
                  data={ref?.data}
                  cardProps={{
                    icon: (
                      <svg
                        className={classNames(
                          cardStyles.btnIcon,
                          styles.activitiesIconActionCardBtnIcon
                        )}
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                      >
                        <path
                          d="M0 0H28V28H16V24H24V4L4 4V20.9522L13 12H8V8H20V20H16V15L3 28H0V0Z"
                          fill="currentColor"
                        />
                      </svg>
                    ),
                    classes: {
                      background: styles.activitiesIconActionCardBackground,
                    },
                  }}
                />
              ),
              pmp_stacked_info_thumb_blocks: (ref) => (
                <PmpStackedInfoThumbBlocks
                  data={ref?.data}
                  classes={{
                    root: styles.activitiesInfoThumbBlocks,
                    heading: styles.activitiesInfoThumbBlocksHeading,
                  }}
                />
              ),
              pmp_callout: (ref) => (
                <PmpCallout
                  data={ref?.data}
                  classes={{
                    root: styles.activitiesCallout,
                    heading: styles.activitiesCalloutHeading,
                    blurb: styles.activitiesCalloutBlurb,
                    upperContent: styles.activitiesCalloutUpperContent,
                    asideImg: styles.activitiesCalloutAsideImg,
                    thumbsWrapper: styles.freeForAllCalloutThumbsWrapper,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* GEAR */}
        <div
          id={"gear"}
          className={classNames(
            styles.section,
            styles.sectionWhite,
            styles.gear
          )}
          style={{ backgroundImage: getResponsiveBg(gear_section?.bg) }}
        >
          <S20ProceduralContent
            content={gear_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.gearSectionHeader,
                    heading: classNames([
                      styles.sectionHeading,
                      styles.gearSectionHeading,
                    ]),
                    smallTitle: styles.gearSectionHeaderSmallTitle,
                  }}
                />
              ),
              pmp_media_carousel: (ref) => (
                <PmpMediaCarousel
                  data={ref?.data}
                  classes={{
                    root: styles.gearSectionMediaCarousel,
                    slideBlurb: styles.gearSectionMediaCarouselBlurb,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* Event */}
        {showEvent && (
          <div id={"event"} ref={eventRef} className={styles.eventContainer}>
            {s22_section?.content?.find(
              (itm: any) => itm?._content_type_uid === "pmp_section_header"
            )?.uid && (
              <PmpSectionHeader
                data={s22_section?.content?.find(
                  (itm: any) => itm?._content_type_uid === "pmp_section_header"
                )}
                classes={{
                  root: styles.sectionHeaderRoot,
                  heading: styles.sectionHeaderHeadingEvent,
                  videoBtn: styles.sectionHeaderVidButtonEvent,
                }}
              />
            )}
            {s22_section?.content?.find(
              (itm: any) =>
                itm?._content_type_uid === "pmp_info_thumbnail_group"
            )?.uid && (
              <div className={styles.candyContainer}>
                <PmpInfoThumbnailGroup
                  data={s22_section?.content?.find(
                    (itm: any) =>
                      itm?._content_type_uid === "pmp_info_thumbnail_group"
                  )}
                />
                {layer_3 && (
                  <img src={layer_3?.url} className={styles.candy_3} />
                )}
                {layer_2 && (
                  <img src={layer_2?.url} className={styles.candy_2} />
                )}
              </div>
            )}

            <FeaturedImage
              image={s22_section?.featured?.image}
              content={s22_section?.featured?.copy?.[0]}
              candy={layer_1}
            />
            <EventCallout
              data={s22_section?.content?.find(
                (itm: any) => itm?._content_type_uid === "pmp_callout"
              )}
            />
            {s22_section?.content?.find(
              (itm: any) =>
                itm?._content_type_uid === "pmp_stacked_info_thumb_blocks"
            )?.uid && (
              <PmpStackedInfoThumbBlocks
                data={s22_section?.content?.find(
                  (itm: any) =>
                    itm?._content_type_uid === "pmp_stacked_info_thumb_blocks"
                )}
                classes={{
                  blurb: styles.infoThumbBlurbEvent,
                  heading: styles.infoThumbHeadingEvent,
                }}
              />
            )}
            {eventBottomBg && (
              <img src={eventBottomBg} className={styles.bottomBgEvent} />
            )}
          </div>
        )}

        {/* Free For All */}
        <div
          id={"free-for-all"}
          className={classNames(styles.section, styles.freeForAll)}
          style={{ backgroundImage: getResponsiveBg(free_for_all_section?.bg) }}
        >
          <S20ProceduralContent
            content={free_for_all_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.freeForAllSectionHeader,
                    textWrapper: styles.freeForAllSectionHeaderTextWrapper,
                    headingsFlexWrapper: styles.freeForAllHeadingsFlexWrapper,
                    secondaryHeading:
                      styles.freeForAllSectionHeaderSecondaryHeading,
                    heading: styles.freeForAllSectionHeaderHeading,
                    blurb: styles.freeForAllBlurb,
                    btnWrapper: styles.freeForAllSectionHeaderBtnWrapper,
                    lowerContent: styles.freeForAllSectionHeaderLowerContent,
                  }}
                />
              ),
              pmp_callout: (ref) => (
                <PmpCallout
                  data={ref?.data}
                  classes={{
                    root: styles.freeForAllCallout,
                    upperContent: styles.freeForAllCalloutUpperContent,
                    textWrapper: styles.freeForAllCalloutTextWrapper,
                    thumbsWrapper: styles.freeForAllCalloutThumbsWrapper,
                    heading: styles.freeForAllCalloutHeading,
                    blurb: styles.freeForAllBlurb,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* SEASON PASS */}
        <div
          id={"season-pass"}
          className={classNames(styles.section, styles.seasonPass)}
          style={{ backgroundImage: getResponsiveBg(season_pass_section?.bg) }}
        >
          <S20ProceduralContent
            content={season_pass_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.seasonPassSectionHeader,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* REWARDS */}
        <div
          className={styles.sectionDivider}
          style={{ backgroundColor: "#D4DB52" }}
        />
        <div
          id={"rewards"}
          className={classNames(styles.section, styles.rewards)}
          style={{ backgroundImage: getResponsiveBg(rewards_section?.bg) }}
        >
          <h2
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.free_rewards
            )}
            className={styles.rewardsTitle}
          />
          <RewardsAndCalendar21 />
          <h3
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.season_pass_rewards
            )}
            className={styles.rewardsTitle}
          />
          <S20ProceduralContent
            content={rewards_section?.content}
            pmpComponents={pmpComponentOverrides}
          />
        </div>

        {/* BUNDLE */}
        <div
          className={styles.sectionDivider}
          style={{
            background:
              "linear-gradient(270deg, rgba(212, 219, 82, 0.00) 11.46%, #D4DB52 48.44%, rgba(212, 219, 82, 0.00) 86.98%)",
          }}
        />
        <div
          id={"bundle"}
          className={classNames(styles.section, styles.bundle)}
          style={{ backgroundImage: getResponsiveBg(bundle_section?.bg) }}
        >
          <img
            className={styles.bundleSectionBgBleed}
            src={bundle_section?.bg_bleed?.url}
            alt=""
          />
          <S20ProceduralContent
            content={bundle_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.bundleSectionHeader,
                    heading: styles.bundleSectionHeading,
                  }}
                />
              ),
            }}
          />
          <div className={styles.content}>
            <BuyButton
              sheen={0}
              url={RouteHelper.DestinyBuyDetail({
                productFamilyTag: "silverbundle",
              })}
              buttonType={"none"}
              className={styles.buyBtn}
            >
              {bundle_section?.buy_btn_text ?? ""}
            </BuyButton>
            <p
              className={styles.disclaimer}
              dangerouslySetInnerHTML={sanitizeHTML(bundle_section?.disclaimer)}
            />
          </div>
        </div>

        {/* CTA */}
        <PmpCallToAction
          data={cta_section?.content?.[0]}
          classes={{
            root: classNames(styles.section, styles.callToAction),
            button: styles.callToActionButton,
          }}
        />

        {/* MEDIA */}
        <div id={"media"} className={styles.anchor} />
        <div className={classNames(styles.section, styles.media)}>
          <S20ProceduralContent
            content={media_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_media: (ref) => (
                <PmpMedia
                  data={ref?.data}
                  classes={{
                    root: styles.mediaSectionHeader,
                    tab: styles.mediaTab,
                    selectedTab: styles.mediaSelectedTab,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* LEARN MORE */}
        <div id={"learn-more"} className={styles.anchor} />
        <div className={classNames(styles.section, styles.learnMore)}>
          <S20ProceduralContent
            content={learn_more_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.learnMoreSectionHeader,
                    heading: styles.learnMoreHeading,
                  }}
                />
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* Mapped type of props for each pmp component */
type DefaultComponentParameters = {
  [key in keyof typeof DefaultPmpComponents]: Parameters<
    typeof DefaultPmpComponents[key]
  >[0];
};

/* 'data' prop type for any pmp component defined in 'DefaultPmpComponents'; 
Used for type checking of content passed in to procedural content component */
type TPmpComponentData = DefaultComponentParameters[keyof DefaultComponentParameters]["data"];

interface S20ProceduralContentProps {
  pmpComponents?: PartialPmpReferenceMap;
  content: TPmpComponentData[];
}

/* Renders group of content using useReferenceMap */
const S20ProceduralContent = (props: S20ProceduralContentProps) => {
  const { pmpComponents, content } = props;

  const { ReferenceMappedList } = useReferenceMap(
    extendDefaultComponents(pmpComponents),
    (content as WithContentTypeUids<typeof content>) ?? []
  );

  return <ReferenceMappedList />;
};

export default SeasonOfTheWitch;
