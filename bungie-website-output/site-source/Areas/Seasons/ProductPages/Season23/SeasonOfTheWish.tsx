import FeaturedImage from "@Areas/Seasons/ProductPages/Season23/Components/FeaturedImage/FeaturedImage";
import React, {
  RefObject,
  useCallback,
  useEffect,
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
import { SplitSection } from "@Areas/Seasons/ProductPages/Season23/Components/SplitSection/SplitSection";
import { BnetStackS18ProductPage } from "../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import { S23Hero } from "./Components/Hero/S23Hero";
import S23SeasonPassRewards from "@Areas/Seasons/ProductPages/Season23/Components/SeasonPassRewards/S23SeasonPassRewards";
import { MediaObject } from "@Areas/Seasons/ProductPages/Season23/Components/MediaObject/MediaObject";
import { DawningSection } from "./Sections";

import styles from "./SeasonOfTheWish.module.scss";

interface SeasonOfTheWishProps {}

/* All pmp component overrides can be specified globally here since they all reference the same stylesheet */
const pmpComponentOverrides: PartialPmpReferenceMap = {
  pmp_section_header: (ref) => (
    <PmpSectionHeader
      data={ref?.data}
      classes={{
        secondaryHeading: styles.sectionEyebrow,
        heading: styles.largeHeading,
        blurb: styles.baseCopy,
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
        blurb: styles.baseCopy,
        heading: styles.baseCopy,
      }}
    />
  ),
  pmp_media_carousel: (ref) => <PmpMediaCarousel data={ref?.data} />,
  pmp_media: (ref) => <PmpMedia data={ref?.data} />,
  pmp_rewards_list: (ref) => <PmpRewardsList data={ref?.data} />,
  pmp_stacked_info_thumb_blocks: (ref) => (
    <PmpStackedInfoThumbBlocks
      data={ref?.data}
      classes={{
        blurb: styles.baseCopy,
        heading: styles.baseCopy,
      }}
    />
  ),
};

const SeasonOfTheWish = (props: SeasonOfTheWishProps) => {
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
    "bundle_section.content",
    "cta_section.content",
    "cta_section.content.buttons",
    "media_section.content",
    "learn_more_section.content",
  ];

  useEffect(() => {
    ContentStackClient()
      .ContentType("s23_product_page")
      .Entry("blt7fe58838424c322c")
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
      const img = mobile ? image?.mobile_bg : image?.desktop_bg;

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
  } = data ?? {};

  const openBuyModal = () => {
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.SilverBundle });
  };

  const showEvent = hero?.scroll_button?.label?.length > 0;

  return (
    <div className={styles.fontStyle}>
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
        <S23Hero
          data={hero}
          scrollToEvent={scrollToEventSection}
          showCTA={false}
          openBuyModal={openBuyModal}
          showEventButton={showEvent}
        />

        {/* SUB NAV */}
        <PmpNavigationBar
          data={sub_nav?.[0]}
          accentColor={"gold"}
          primaryColor={"s23"}
          buttonProps={{
            children: sub_nav_btn_text,
            onClick: openBuyModal,
            buttonType: "gold",
          }}
        />

        {/* STORY */}
        {story_section?.content?.length > 0 ? (
          <div
            id={"story"}
            className={classNames(styles.story)}
            style={{ backgroundImage: getResponsiveBg(story_section?.bg) }}
          >
            <S23ProceduralContent
              content={story_section?.content}
              pmpComponents={{
                ...pmpComponentOverrides,
                pmp_section_header: (ref) => (
                  <PmpSectionHeader
                    data={ref?.data}
                    classes={{
                      root: styles.storyRoot,
                      secondaryHeading: classNames(
                        styles.sectionEyebrow,
                        styles.storyAccent,
                        styles.storyEyebrow
                      ),
                      heading: classNames(
                        styles.largeHeading,
                        styles.storyHeading,
                        styles.storyPositioning
                      ),
                      blurb: classNames(
                        styles.baseCopy,
                        styles.storyPositioning,
                        styles.storyBlurb
                      ),
                      textWrapper: styles.storyPositioning,
                      headingsFlexWrapper: styles.storyPositioning,
                    }}
                  />
                ),
              }}
            />
          </div>
        ) : null}

        {/* ACTIVITIES */}
        {activities_section?.content?.length > 0 ? (
          <div
            id={"activity"}
            className={classNames(styles.activities)}
            style={{ backgroundImage: getResponsiveBg(activities_section?.bg) }}
          >
            <div
              className={styles.activitySecOne}
              style={{
                backgroundImage: getResponsiveBg(activities_section?.bg),
              }}
            >
              <PmpSectionHeader
                data={activities_section?.content?.[0]}
                classes={{
                  secondaryHeading: classNames(
                    styles.sectionEyebrow,
                    styles.activityAccent
                  ),
                  heading: classNames(styles.largeHeading),
                  blurb: classNames(styles.baseCopy),
                  textWrapper: styles.activitySectionHeaderTextWrapper,
                }}
              />
              <PmpInfoThumbnailGroup
                data={activities_section?.content?.[1]}
                classes={{
                  blurb: classNames(styles.baseCopy),
                  heading: classNames(styles.baseCopy),
                  thumbnail: styles.aspectRatio_16_9,
                  root: styles.activityThumbsRoot,
                  thumbBlockWrapper: styles.activityThumbWrapper,
                  thumbBg: styles.activitiesThumbBg,
                }}
              />
            </div>
            <PmpSectionHeader
              data={activities_section?.content?.[2]}
              classes={{
                root: styles.activitySectionTwo,
                secondaryHeading: styles.sectionEyebrow,
                heading: styles.largeHeading,
                blurb: styles.baseCopy,
              }}
            />
            <MediaObject
              data={activities_section?.content?.[3]}
              title={activities_section?.content?.[3]?.title}
              featuredImage={activities_section?.featured_image}
              id={"exotic"}
              classes={{
                textWrapper: styles.columnsFeatText,
                featuredImageWrapper: styles.columnsFeatImg,
                featuredImage: styles.featuredImg,
                secondaryHeading: styles.sectionEyebrow,
                heading: styles.largeHeading,
                blurb: styles.baseCopy,
              }}
            />
            {activities_section?.content?.[4] ? (
              <PmpCallout
                data={activities_section?.content?.[4]}
                classes={{
                  heading: styles.activitiesCalloutHeader,
                  blurb: classNames(
                    styles.baseCopy,
                    styles.activitiesCalloutBlurb
                  ),
                  asideImg: styles.activitiesCalloutImg,
                  root: styles.activitiesCalloutRoot,
                  upperContent: styles.activitiesCalloutUpper,
                  textWrapper: styles.activitiesCalloutTextWrapper,
                }}
              />
            ) : null}
          </div>
        ) : null}

        {/* Dawning */}
        {showEvent && (
          <div id={"dawning"} ref={eventRef} className={styles.dawningSection}>
            <div
              className={styles.sectionDivider}
              style={{ background: "#8D5BB0" }}
            />
            <DawningSection data={free_for_all_section} showEvent={showEvent} />
          </div>
        )}

        {/* GEAR */}
        {gear_section?.content?.length > 0 ? (
          <div
            id={"gear"}
            className={classNames(styles.sectionWhite, styles.gear)}
            style={{ backgroundImage: getResponsiveBg(gear_section?.bg) }}
          >
            <S23ProceduralContent
              content={gear_section?.content}
              pmpComponents={{
                ...pmpComponentOverrides,
                pmp_section_header: (ref) => (
                  <PmpSectionHeader
                    data={ref?.data}
                    classes={{
                      root: styles.gearSectionHeader,
                      secondaryHeading: styles.sectionEyebrow,
                      heading: classNames(styles.largeHeading),
                      blurb: classNames(styles.baseCopy),
                      smallTitle: styles.waypointsCopy,
                    }}
                  />
                ),
                pmp_media_carousel: (ref) => (
                  <PmpMediaCarousel
                    data={ref?.data}
                    classes={{
                      root: styles.gearSectionMediaCarousel,
                      slideBlurb: styles.gearSectionMediaCarouselBlurb,
                      slideDivider: styles.gearAccent,
                    }}
                  />
                ),
              }}
            />
          </div>
        ) : null}

        {/* Free For All */}
        <div
          id={"free-for-all"}
          className={classNames(styles.freeForAll)}
          style={{ backgroundImage: getResponsiveBg(free_for_all_section?.bg) }}
        >
          {free_for_all_section?.content?.find(
            (tag: any) => tag?.title === "S23 - PL7"
          )?.title ? (
            <PmpSectionHeader
              data={free_for_all_section?.content?.find(
                (tag: any) => tag?.title === "S23 - PL7"
              )}
              classes={{
                root: styles.freeForAllSection,
                secondaryHeading: classNames(
                  styles.sectionEyebrow,
                  styles.freeforAllWrapper
                ),
                heading: styles.freeforAllHeader,
                blurb: classNames(
                  styles.baseCopy,
                  styles.activitySectionFlexWrapper
                ),
                textWrapper: styles.freeforAllWrapper,
                headingsFlexWrapper: styles.activitySectionFlexWrapper,
              }}
            />
          ) : null}
          {free_for_all_section?.content?.find(
            (tag: any) => tag?.title === "S23 - PL7 - 1"
          )?.title ? (
            <PmpInfoThumbnailGroup
              data={free_for_all_section?.content?.find(
                (tag: any) => tag?.title === "S23 - PL7 - 1"
              )}
              classes={{
                root: styles.freeForAllGrid,
                blurb: styles.baseCopy,
                heading: styles.baseCopy,
                thumbnail: styles.aspectRatio_1_1,
                thumbBg: styles.seasonPassThumbBg,
                thumbBlockWrapper: styles.thumbBlockWrapper,
              }}
            />
          ) : null}
          {free_for_all_section?.content?.find(
            (tag: any) => tag?.title === "S23 - PL8"
          )?.title ? (
            <SplitSection
              data={free_for_all_section?.content?.find(
                (tag: any) => tag?.title === "S23 - PL8"
              )}
              backgroundColor={"#FFFFFF"}
              classes={{
                secondaryHeading: classNames(
                  styles.sectionEyebrow,
                  styles.fireTeamAccent
                ),
                heading: styles.largeHeading,
                blurb: classNames(styles.baseCopy, styles.anchorSplit),
              }}
            />
          ) : null}
        </div>

        {/* SEASON PASS */}
        <div
          className={styles.sectionDivider}
          style={{ background: "#89ADC6" }}
        />
        <div
          id={"season-pass"}
          className={classNames(styles.seasonPass)}
          style={{ backgroundImage: getResponsiveBg(season_pass_section?.bg) }}
        >
          <S23ProceduralContent
            content={season_pass_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.seasonPassSectionHeader,
                    secondaryHeading: styles.sectionEyebrow,
                    heading: classNames(styles.largeHeading, styles.bold),
                    blurb: classNames(styles.baseCopy, styles.silverBlurb),
                    smallTitle: styles.waypointsCopy,
                  }}
                />
              ),
              pmp_info_thumbnail_group: (ref) => (
                <PmpInfoThumbnailGroup
                  data={ref?.data}
                  classes={{
                    blurb: styles.baseCopy,
                    heading: styles.baseCopy,
                    thumbnail: styles.aspectRatio_1_1,
                    thumbBg: styles.seasonPassThumbBg,
                    thumbBlockWrapper: styles.thumbBlockWrapper,
                  }}
                />
              ),
            }}
          />
        </div>

        {/* REWARDS */}
        <div
          className={styles.sectionDivider}
          style={{ background: "#15120E" }}
        />
        <div
          id={"rewards"}
          className={classNames(styles.rewards)}
          style={{ backgroundImage: getResponsiveBg(rewards_section?.bg) }}
        >
          <h2
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.free_rewards
            )}
            className={styles.rewardsTitle}
          />
          <S23SeasonPassRewards />
          <h3
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.season_pass_rewards
            )}
            className={styles.rewardsTitle}
          />
          <S23ProceduralContent
            content={rewards_section?.content}
            pmpComponents={pmpComponentOverrides}
          />
        </div>

        {/* BUNDLE */}
        <div
          className={styles.sectionDivider}
          style={{ opacity: "0.35", background: "#B69570" }}
        />
        <div
          id={"bundle"}
          className={classNames(styles.bundle)}
          style={{ backgroundImage: getResponsiveBg(bundle_section?.bg) }}
        >
          <S23ProceduralContent
            content={bundle_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.silverRoot,
                    textWrapper: styles.silverTextWrapper,
                    secondaryHeading: styles.sectionEyebrow,
                    heading: classNames(styles.largeHeading, styles.bold),
                    blurb: classNames(styles.baseCopy, styles.silverBlurb),
                    smallTitle: styles.waypointsCopy,
                  }}
                />
              ),
            }}
          />
          <div className={styles.buyButtonWrapper}>
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

        <PmpCallToAction data={cta_section?.content?.[0]} />

        {/* MEDIA */}
        <div id={"media"} className={styles.anchor} />
        <div className={classNames(styles.media)}>
          <S23ProceduralContent
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
        <div className={classNames(styles.learnMore)}>
          <S23ProceduralContent
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

interface S23ProceduralContentProps {
  pmpComponents?: PartialPmpReferenceMap;
  content: TPmpComponentData[];
}

/* Renders group of content using useReferenceMap */
const S23ProceduralContent = (props: S23ProceduralContentProps) => {
  const { pmpComponents, content } = props;

  const { ReferenceMappedList } = useReferenceMap(
    extendDefaultComponents(pmpComponents),
    (content as WithContentTypeUids<typeof content>) ?? []
  );

  return <ReferenceMappedList />;
};

export default SeasonOfTheWish;
