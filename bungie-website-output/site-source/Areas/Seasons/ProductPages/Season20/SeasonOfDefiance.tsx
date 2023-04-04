// Created by atseng, 2023
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
import styles from "./SeasonOfDefiance.module.scss";
import { S20Hero } from "@Areas/Seasons/ProductPages/Season20/Components/Hero/S20Hero";
import RewardsAndCalendar20 from "@Areas/Seasons/ProductPages/Season20/Components/SeasonPassRewards/S20SeasonPassRewards";
import S20PlatformsBar from "@Areas/Seasons/ProductPages/Season20/Components/PlatformsBar/S20PlatformsBar";

interface SeasonOfDefianceProps {}

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

const SeasonOfDefiance = (props: SeasonOfDefianceProps) => {
  const [data, setData] = useState<null | any>(null);
  const responsive = useDataStore(Responsive);

  const eventRef = useRef<HTMLDivElement | null>(null);

  // To be reconnected
  // const contentReferences: (`${keyof BnetStackS20ProductPage}.content` | keyof BnetStackS20ProductPage | string)[] = [
  const contentReferences = [
    "sub_nav",
    "platforms.button",
    "story_section.content",
    "activities_section.content",
    "event_section.content",
    "gear_section.content",
    "season_pass_section.content",
    "bungie_rewards_section.content",
    "rewards_section.content",
    "event_section.content",
    "bundle_section.content",
    "cta_section.content",
    "cta_section.content.buttons",
    "media_section.content",
    "learn_more_section.content",
  ];

  useEffect(() => {
    ContentStackClient()
      .ContentType("s20_product_page")
      .Entry("blt7ffc4e6d19af508f")
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
    (bg: TResponsiveBg) => {
      const img = responsive.mobile ? bg?.mobile_bg : bg?.desktop_bg;

      return img?.url
        ? `url(${img?.url}?width=${responsive.mobile ? 768 : 1920})`
        : undefined;
    },
    [responsive]
  );

  const {
    title,
    hero,
    sub_nav,
    sub_nav_btn_text,
    platforms,
    story_section,
    activities_section,
    event_section,
    gear_section,
    season_pass_section,
    bungie_rewards_section,
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
  const paidMediaPlatformBar = params.get("platforms");

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
        <S20Hero data={hero} scrollToEvent={scrollToEventSection} />

        {/* SUB NAV */}
        {paidMediaPlatformBar ? (
          <S20PlatformsBar data={platforms} />
        ) : (
          <PmpNavigationBar
            data={sub_nav?.[0]}
            accentColor={"s18blue"}
            primaryColor={"s18blue"}
            buttonProps={{
              children: sub_nav_btn_text,
              onClick: openBuyModal,
              buttonType: "gold",
            }}
          />
        )}

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
                    textWrapper: styles.storySectionHeading,
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
                    secondaryHeading: styles.activitiesSectionSmallHeading,
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
                    thumbBlockWrapper: styles.activitiesThumbBlockWrapper,
                    thumbnail: styles.activitiesThumbnail,
                    thumbBg: styles.activitiesThumbnails,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* MISSION */}
        {event_section?.display_event_section ? (
          <>
            <div
              className={styles.sectionDivider}
              style={{
                background:
                  "linear-gradient(90deg, #6146E7 0%, #B3A5FC 50%, #6146E7 100%)",
              }}
            />
            <div
              id={"mission"}
              className={classNames(styles.section, styles.event)}
              style={{
                backgroundImage: [
                  getResponsiveBg(event_section?.top_bg),
                  getResponsiveBg(event_section?.bottom_bg),
                  "linear-gradient(180deg, #0B2553 80%, #020D2C 80%)",
                ].join(","),
              }}
            >
              <PmpSectionHeader
                data={event_section?.content?.[0]}
                classes={{
                  root: styles.eventSectionTopRoot,
                  textWrapper: styles.eventSectionTextWrapper,
                }}
              />

              <PmpSectionHeader
                data={event_section?.content?.[1]}
                classes={{
                  root: styles.eventSectionBottomRoot,
                  textWrapper: styles.eventSectionTextWrapper,
                }}
              />
            </div>
          </>
        ) : null}

        {/* GEAR */}
        <div
          className={styles.sectionDivider}
          style={{
            background:
              "linear-gradient(90deg, #005465 0%, #7AE9FF 50%, #005465 100%)",
          }}
        />
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
                    heading: styles.seasonPassSectionHeading,
                  }}
                />
              ),
              pmp_info_thumbnail_group: (ref) => (
                <PmpInfoThumbnailGroup
                  data={ref?.data}
                  classes={{
                    root: styles.seasonPassThumbnailsGroup,
                    blurb: styles.seasonPassThumbnailsGroupBlurb,
                  }}
                />
              ),
              pmp_callout: (ref) => (
                <>
                  <div id={"rewards"} className={styles.anchor} />
                  <PmpCallout
                    data={ref?.data}
                    classes={{
                      root: styles.seasonPassCallout,
                      heading: styles.seasonPassCalloutHeading,
                      asideImg: styles.seasonPassCalloutAsideImg,
                      textWrapper: styles.seasonPassCalloutTextWrapper,
                    }}
                  />
                </>
              ),
            }}
          />
        </div>

        {/* BUNGIE REWARDS */}
        <div
          className={styles.sectionDivider}
          style={{ backgroundColor: "#1D9CD4" }}
        />
        <div
          id={"bungie-rewards"}
          className={classNames(styles.section, styles.bungieRewards)}
          style={{
            backgroundImage: getResponsiveBg(bungie_rewards_section?.bg),
          }}
        >
          <div className={styles.bungieRewardsSectionHeader}>
            <img
              src={bungie_rewards_section?.section_header?.logo?.url}
              className={styles.bungieRewardsSectionHeaderLogo}
              alt={bungie_rewards_section?.logo?.desciption}
            />
            <p
              className={styles.bungieRewardsSectionHeaderBlurb}
              dangerouslySetInnerHTML={sanitizeHTML(
                bungie_rewards_section?.section_header?.blurb
              )}
            />
          </div>
          <S20ProceduralContent
            content={bungie_rewards_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_stacked_info_thumb_blocks: (ref) => (
                <PmpStackedInfoThumbBlocks
                  data={ref?.data}
                  classes={{
                    root: styles.bungieRewardsThumbBlocks,
                    reverse: styles.bungieRewardsThumbBlocksReverse,
                    blockWrapper: styles.bungieRewardsThumbBlocksBlockWrapper,
                    textWrapper: styles.bungieRewardsThumbBlocksTextWrapper,
                    heading: styles.bungieRewardsThumbBlocksHeading,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* REWARDS */}
        <div
          className={styles.sectionDivider}
          style={{ backgroundColor: "#a304B21" }}
        />
        <div
          id={"season-rewards"}
          className={classNames(styles.section, styles.rewards)}
          style={{ backgroundImage: getResponsiveBg(rewards_section?.bg) }}
        >
          <h2
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.free_rewards
            )}
            className={styles.rewardsTitle}
          />
          <RewardsAndCalendar20 />
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
              "linear-gradient(90deg, #4B4B4B 0%, #FFFFFF 50%, #636363 100%)",
          }}
        />
        <div
          id={"bundle"}
          className={classNames(styles.section, styles.bundle)}
          style={{ backgroundImage: getResponsiveBg(bundle_section?.bg) }}
        >
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
        <div
          className={styles.sectionDivider}
          style={{
            background:
              "linear-gradient(90deg, #672E64 0%, #F7B9F3 50%, #672E64 100%)",
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

export default SeasonOfDefiance;
