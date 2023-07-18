// Created by ahipp, 2023
// Copyright Bungie, Inc.

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
import { WithContentTypeUids } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BnetStackS18ProductPage } from "../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import styles from "./SeasonOfTheDeep.module.scss";
import { S21Hero } from "@Areas/Seasons/ProductPages/Season21/Components/Hero/S21Hero";
import RewardsAndCalendar21 from "@Areas/Seasons/ProductPages/Season21/Components/SeasonPassRewards/S21SeasonPassRewards";
import EventSection from "@Areas/Seasons/ProductPages/Season21/Components/EventTopSection/EventSection";
interface SeasonOfTheDeepProps {}

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

const SeasonOfTheDeep = (props: SeasonOfTheDeepProps) => {
  const [data, setData] = useState<null | any>(null);
  const { mobile } = useDataStore(Responsive);

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
    "event_section.content",
    "rewards_section.content",
    "season_pass_section.content",
    "bundle_section.content",
    "cta_section.content",
    "cta_section.content.buttons",
    "media_section.content",
    "learn_more_section.content",
  ];

  useEffect(() => {
    ContentStackClient()
      .ContentType("s21_product_page")
      .Entry("bltf007f0d6601766af")
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
    (bg: TResponsiveBg): string => {
      const img = mobile ? bg?.mobile_bg : bg?.desktop_bg;

      return img?.url || undefined;
    },
    [mobile]
  );

  const {
    title,
    hero,
    sub_nav,
    sub_nav_btn_text,
    story_section,
    activities_section,
    mission_section,
    event_section,
    gear_section,
    season_pass_section,
    rewards_section,
    bundle_section,
    cta_section,
    media_section,
    learn_more_section,
  } = data ?? {};

  const openBuyModal = () => {
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.SilverBundle });
  };

  const params = new URLSearchParams(location.search);
  const paidMediaDefault = !params.get("hero") || !mobile;

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
        <S21Hero
          data={hero}
          scrollToEvent={scrollToEventSection}
          showCTA={false}
          openBuyModal={openBuyModal}
          showEventButton={mission_section?.show_section}
        />

        {paidMediaDefault ? (
          <>
            {/* SUB NAV */}
            <PmpNavigationBar
              data={sub_nav?.[0]}
              accentColor={"s21"}
              primaryColor={"s21"}
              buttonProps={{
                children: sub_nav_btn_text,
                onClick: openBuyModal,
                buttonType: "gold",
              }}
            />

            <div className={styles.storyActivitiesWrapper}>
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
                          textWrapper: styles.storySectionHeading,
                          blurb: styles.storySectionBlurb,
                        }}
                      />
                    ),
                  }}
                />
              </div>

              {/* ACTIVITIES */}
              <div
                id={"activity"}
                className={classNames(styles.section, styles.activities)}
              >
                <PmpSectionHeader
                  data={activities_section?.content[0]}
                  classes={{
                    root: styles.activitiesSalvagesSectionHeader,
                    textWrapper: styles.activitiesSalvagesTextWrapper,
                    blurb: styles.activitiesSalvagesBlurb,
                  }}
                />

                <div
                  className={styles.activitiesBackground}
                  style={{
                    backgroundImage: getResponsiveBg(activities_section?.bg),
                  }}
                >
                  <PmpSectionHeader
                    data={activities_section?.content[1]}
                    classes={{
                      root: classNames([
                        styles.activitiesSectionHeader,
                        styles.activitiesOceanSectionHeader,
                      ]),
                      heading: classNames([
                        styles.sectionHeading,
                        styles.activitiesOceanSectionHeading,
                      ]),
                    }}
                  />
                  <S20ProceduralContent
                    content={activities_section?.content.slice(2)}
                    pmpComponents={{
                      ...pmpComponentOverrides,
                      pmp_section_header: (ref) => (
                        <PmpSectionHeader
                          data={ref?.data}
                          classes={{
                            root: styles.activitiesSectionHeader,
                            secondaryHeading:
                              styles.activitiesSectionSmallHeading,
                            heading: classNames([
                              styles.sectionHeading,
                              styles.activitiesSectionHeading,
                            ]),
                            headingsFlexWrapper:
                              styles.activitiesSectionHeaderHeadingsFlexWrapper,
                            blurb: styles.activitiesSectionHeaderBlurb,
                          }}
                        />
                      ),
                      pmp_info_thumbnail_group: (ref) => (
                        <PmpInfoThumbnailGroup
                          data={ref?.data}
                          classes={{
                            thumbBlockWrapper:
                              styles.activitiesThumbBlockWrapper,
                            thumbnail: styles.activitiesThumbnail,
                            thumbBg: styles.activitiesThumbnails,
                          }}
                        />
                      ),
                      pmp_callout: (ref) => (
                        <PmpCallout
                          data={ref?.data}
                          classes={{
                            root: classNames(styles.activitiesCalloutBase, {
                              [styles.activitiesCallout]: !mission_section?.show_section,
                              [styles.activitiesCalloutV2]:
                                mission_section?.show_section,
                            }),
                            upperContent: classNames(
                              styles.activitiesCalloutUpperContent,
                              {
                                [styles.activitiesCalloutUpperContentSpacing]:
                                  mission_section?.show_section,
                              }
                            ),
                            heading: styles.activitiesCalloutHeading,
                            textWrapper: classNames({
                              [styles.activitiesTextWrapper]: !mission_section?.show_section,
                              [styles.activitiesTextWrapperV2]:
                                mission_section?.show_section,
                            }),
                            asideImg: classNames({
                              [styles.activitiesCalloutAsideImage]: !mission_section?.show_section,
                              [styles.activitiesCalloutAsideImageV2]:
                                mission_section?.show_section,
                            }),
                            blurb: styles.activitiesCalloutBlurb,
                          }}
                        />
                      ),
                      pmp_icon_action_cards: (ref) => (
                        <PmpIconActionCards data={ref?.data} classes={{}} />
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {mission_section?.show_section && (
              <div id="mission">
                <div
                  className={styles.sectionDivider}
                  style={{ background: "#3393AB" }}
                />
                <PmpSectionHeader
                  data={mission_section?.content[0]}
                  classes={{
                    root: classNames(
                      styles.missionSectionRoot,
                      styles.missionSectionPadding
                    ),
                    textWrapper: styles.missionSectionOneText,
                    secondaryHeading: styles.missionEyebrow,
                    headingsFlexWrapper: styles.centerText,
                    blurb: styles.centerText,
                    heading: styles.missionHeading,
                  }}
                />
                <div
                  id="weapon"
                  className={classNames(
                    styles.missionBackground,
                    styles.baseBackground
                  )}
                  style={{
                    backgroundImage: getResponsiveBg(
                      mission_section?.content[1]
                    ),
                  }}
                >
                  <img
                    src={getResponsiveImg(
                      mission_section?.primary_weapon_image
                    )}
                    className={styles.primaryImage}
                  />
                  <PmpSectionHeader
                    data={mission_section?.content[1]}
                    classes={{
                      root: styles.missionSectionTwoRoot,
                      textWrapper: styles.missionSectionTwoText,
                      secondaryHeading: styles.missionEyebrow,
                      headingsFlexWrapper: styles.centerText,
                      blurb: styles.centerText,
                      heading: styles.missionHeading,
                    }}
                  />
                </div>
              </div>
            )}

            {event_section?.show_section && (
              <div id="solstice" ref={eventRef}>
                <EventSection
                  content={event_section?.content}
                  eventHighlight={event_section?.event_highlight}
                  topBackground={event_section?.top_bg}
                  bottomBackground={event_section?.bottom_bg}
                  topBanner={event_section?.top_banner}
                  bottomBanner={event_section?.bottom_banner}
                  leftAsideImage={event_section?.left_aside_image}
                  rightAsideImage={event_section?.right_aside_image}
                />
              </div>
            )}

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

            {/* SEASON PASS */}
            <div
              id={"season-pass"}
              className={classNames(
                styles.section,
                styles.sectionWhite,
                styles.seasonPass
              )}
              style={{
                backgroundImage: getResponsiveBg(season_pass_section?.bg),
              }}
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
                  pmp_info_thumbnail_group: (ref) => (
                    <PmpInfoThumbnailGroup
                      data={ref?.data}
                      classes={{
                        root: styles.seasonPassThumbnails,
                      }}
                    />
                  ),
                }}
              />
            </div>

            {/* REWARDS */}
            <div
              className={styles.sectionDivider}
              style={{ backgroundColor: "#C02885" }}
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
                  "linear-gradient(90deg, #00A0CE 10.94%, #7AF7FA 55.21%, #00A0CE 89.58%)",
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
                  dangerouslySetInnerHTML={sanitizeHTML(
                    bundle_section?.disclaimer
                  )}
                />
              </div>
            </div>

            {/* CTA */}
            <div
              className={styles.sectionDivider}
              style={{
                background:
                  "linear-gradient(270deg, #023033 0%, #1E728C 25.45%, #478EA5 49.6%, #225D70 71.36%, #023033 100%)",
              }}
            />
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
          </>
        ) : null}
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

export default SeasonOfTheDeep;
