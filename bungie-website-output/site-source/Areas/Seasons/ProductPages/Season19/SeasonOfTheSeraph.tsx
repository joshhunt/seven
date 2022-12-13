// Created by v-ahipp, 2022
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
import {
  BnetStackS18ProductPage,
  BnetStackPmpSectionHeader,
} from "../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../Platform/ContentStack/ContentStackClient";
import styles from "./SeasonOfTheSeraph.module.scss";
import { S19SeasonPassSectionHeader } from "@Areas/Seasons/ProductPages/Season19/Components/SeasonPassSectionHeader/S19SeasonPassSectionHeader";
import { S19Hero } from "@Areas/Seasons/ProductPages/Season19/Components/Hero/S19Hero";
import { S19StorySectionHeader } from "@Areas/Seasons/ProductPages/Season19/Components/StorySectionHeader/S19StorySectionHeader";
import { S19SeasonPassBlock } from "@Areas/Seasons/ProductPages/Season19/Components/SeasonPassBlock/S19SeasonPassBlock";
import RewardsAndCalendar19 from "@Areas/Seasons/ProductPages/Season19/Components/SeasonPassRewards/S19SeasonPassRewards";
import S19FestivalRewards from "@Areas/Seasons/ProductPages/Season19/Components/FestivalRewards/S19FestivalRewards";

interface SeasonOfTheSeraphProps {}

/* All pmp component overrides can be specified globally here since they all reference the same stylesheet */
const pmpComponentOverrides: PartialPmpReferenceMap = {
  pmp_section_header: (ref) => (
    <PmpSectionHeader
      data={ref?.data}
      classes={{
        blurb: styles.sectionHeaderBlurb,
      }}
    />
  ),
  pmp_callout: (ref) => <PmpCallout data={ref?.data} classes={{}} />,
  pmp_icon_action_cards: (ref) => (
    <PmpIconActionCards data={ref?.data} classes={{}} />
  ),
  pmp_info_thumbnail_group: (ref) => (
    <PmpInfoThumbnailGroup data={ref?.data} classes={{}} />
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

const SeasonOfTheSeraph = (props: SeasonOfTheSeraphProps) => {
  const [data, setData] = useState<null | any>(null);
  const responsive = useDataStore(Responsive);

  const eventRef = useRef<HTMLDivElement | null>(null);

  // To be reconnected
  // const contentReferences: (`${keyof BnetStackS18ProductPage}.content` | keyof BnetStackS18ProductPage | string)[] = [
  const contentReferences = [
    "sub_nav",
    "story_section.content",
    "gear_section.content",
    "season_pass_section.content",
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
      .ContentType("s19_product_page")
      .Entry("bltd880dc71d63aced3")
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
    story_section,
    gear_section,
    season_pass_section,
    rewards_section,
    event_section,
    bundle_section,
    cta_section,
    media_section,
    learn_more_section,
  } = data ?? {};

  const openBuyModal = () => {
    DestinySkuSelectorModal.show({ skuTag: DestinySkuTags.SilverBundle });
  };

  return (
    <div className={styles.seasonOfSeraph}>
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
        <S19Hero data={hero} scrollToEvent={scrollToEventSection} />

        {/* SUB NAV */}
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

        {/* STORY */}
        <div
          className={classNames(styles.section, styles.story)}
          style={{
            backgroundImage: [
              getResponsiveBg(story_section?.top_bg),
              getResponsiveBg(story_section?.bottom_bg),
            ]
              .filter(Boolean)
              .join(", "),
          }}
        >
          <div id={"story"} className={styles.anchor} />
          {!responsive.mobile ? (
            <S19StorySectionHeader
              data={story_section?.section_header}
              classes={{
                root: styles.storySectionHeader,
              }}
            />
          ) : (
            <PmpSectionHeader
              data={story_section?.section_header as BnetStackPmpSectionHeader}
              classes={{}}
            />
          )}

          <PmpCallout
            data={story_section?.content?.[1]}
            classes={{
              root: styles.storyCalloutRoot,
              heading: styles.storyCalloutHeading,
              upperContent: styles.storyCalloutUpperContent,
              thumbsWrapper: styles.storyCalloutThumbsWrapper,
              thumbnailWrapper: styles.storyCalloutThumbnail,
            }}
          />
        </div>

        {/* ACTIVITIES */}
        <div id={"activities"} className={styles.anchor} />

        <PmpSectionHeader
          data={story_section?.content?.[2]}
          classes={{
            root: styles.storyExoticSectionHeader,
            textWrapper: styles.storyExoticSectionHeaderTextWrapper,
          }}
        />
        <PmpSectionHeader
          data={story_section?.content?.[3]}
          classes={{
            root: styles.storyRevisionZeroSectionHeader,
          }}
        />

        {/* EVENT: THE DAWNING */}
        {event_section?.display_section ? (
          <div
            className={styles.event}
            style={{
              backgroundImage: [
                getResponsiveBg(event_section?.top_bg),
                getResponsiveBg(event_section?.bottom_bg),
              ]
                .filter(Boolean)
                .join(", "),
            }}
          >
            <div ref={eventRef} id={"the-dawning"} className={styles.anchor} />
            <S19ProceduralContent
              content={event_section?.content}
              pmpComponents={{
                ...pmpComponentOverrides,
                pmp_section_header: (ref) => (
                  <PmpSectionHeader
                    data={ref?.data}
                    classes={{
                      root: styles.eventSectionHeader,
                      heading: styles.eventSectionHeaderHeading,
                      btnWrapper: styles.eventSectionBtnWrapper,
                    }}
                  />
                ),
                pmp_callout: (ref) => (
                  <PmpCallout
                    data={{
                      ...ref?.data,
                      blurb: `${ref?.data?.blurb} <img class="${styles.eventCalloutImg}" src="${event_section?.pmp_callout_image?.url}" alt="" />`,
                    }}
                    classes={{
                      root: styles.eventCallout,
                      upperContent: styles.eventCalloutUpperContent,
                      heading: styles.eventCalloutHeading,
                      textWrapper: styles.eventCalloutTextWrapper,
                      asideImg: styles.eventCalloutAsideImg,
                    }}
                  />
                ),
                pmp_info_thumbnail_group: (ref) => (
                  <PmpInfoThumbnailGroup
                    data={ref?.data}
                    classes={{
                      root: styles.eventInfoRoot,
                    }}
                  />
                ),
              }}
            />

            <S19FestivalRewards data={event_section?.bungie_rewards} />
          </div>
        ) : null}

        {/* GEAR */}
        <div id={"gear"} className={styles.anchor} />
        <div className={classNames(styles.section, styles.gear)}>
          <S19ProceduralContent
            content={gear_section?.content}
            pmpComponents={{
              ...pmpComponentOverrides,
              pmp_media_carousel: (ref) => (
                <PmpMediaCarousel
                  data={ref?.data}
                  classes={{
                    root: styles.gearMediaCarousel,
                    slideBlurb: styles.gearMediaCarouselSlideBlurb,
                  }}
                />
              ),
              pmp_section_header: (ref) => (
                <PmpSectionHeader
                  data={ref?.data}
                  classes={{
                    root: styles.gearSectionHeader,
                    heading: styles.gearSectionHeaderHeading,
                    smallTitle: styles.gearSectionHeaderSmallTitle,
                  }}
                />
              ),
            }}
          />
        </div>

        <div
          className={classNames(styles.section, styles.seasonPass)}
          style={{ backgroundImage: getResponsiveBg(season_pass_section?.bg) }}
        >
          {/* MOMENTS OF TRIUMPH */}
          <div id={"mot"} className={styles.anchor} />
          <S19SeasonPassSectionHeader
            data={season_pass_section?.section_header}
            classes={{
              root: styles.seasonPassMOTHeader,
            }}
          />

          {season_pass_section?.blocks?.map(
            (block: any, blockIndex: number) => {
              return (
                <S19SeasonPassBlock
                  key={block.heading}
                  data={block}
                  classes={{
                    root: styles.seasonPassBlock,
                  }}
                  reverseLayout={blockIndex % 2 === 0}
                />
              );
            }
          )}

          {/* SEASON PASS */}
          <div id={"season-pass"} className={styles.anchor} />
          <div className={styles.seasonPassInner}>
            <S19ProceduralContent
              content={season_pass_section?.content}
              pmpComponents={pmpComponentOverrides}
            />
          </div>
        </div>

        {/* REWARDS */}
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
          <RewardsAndCalendar19 />
          <h3
            dangerouslySetInnerHTML={sanitizeHTML(
              rewards_section?.season_pass_rewards
            )}
            className={styles.rewardsTitle}
          />
          <S19ProceduralContent
            content={rewards_section?.content}
            pmpComponents={pmpComponentOverrides}
          />
        </div>

        {/* BUNDLE */}
        <div
          id={"bundle"}
          className={classNames(styles.section, styles.bundle)}
          style={{ backgroundImage: getResponsiveBg(bundle_section?.bg) }}
        >
          <S19ProceduralContent
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
          <S19ProceduralContent
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
          <S19ProceduralContent
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

interface S19ProceduralContentProps {
  pmpComponents?: PartialPmpReferenceMap;
  content: TPmpComponentData[];
}

/* Renders group of content using useReferenceMap */
const S19ProceduralContent = (props: S19ProceduralContentProps) => {
  const { pmpComponents, content } = props;

  const { ReferenceMappedList } = useReferenceMap(
    extendDefaultComponents(pmpComponents),
    (content as WithContentTypeUids<typeof content>) ?? []
  );

  return <ReferenceMappedList />;
};

export default SeasonOfTheSeraph;
