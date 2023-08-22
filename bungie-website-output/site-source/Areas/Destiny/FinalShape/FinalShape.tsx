import { CollectorsEditionSection } from "@Areas/Destiny/FinalShape/Sections/CollectorsEditionSection/CollectorsEditionSection";
import EditionsStickyNav from "@Areas/Destiny/FinalShape/Sections/Components/EditionsStickyNav/EditionsStickyNav";
import { EpisodesSection } from "@Areas/Destiny/FinalShape/Sections/EpisodesSection/EpisodesSection";
import { StorySection } from "@Areas/Destiny/FinalShape/Sections/StorySection/StorySection";
import { SupersSection } from "@Areas/Destiny/FinalShape/Sections/SupersSection/SupersSection";
import { WeaponsSection } from "@Areas/Destiny/FinalShape/Sections/WeaponsSection/WeaponsSection";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivitiesSection } from "@Areas/Destiny/FinalShape/Sections/ActivitiesSection/ActivitiesSection";
import { Hero } from "@Areas/Destiny/FinalShape/Sections/Components/Hero/Hero";
import { EditionsSection } from "@Areas/Destiny/FinalShape/Sections/EditionsSection/EditionsSection";
import { DestinationSection } from "@Areas/Destiny/FinalShape/Sections/DestinationSection/DestinationSection";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { PmpMedia } from "@UI/Marketing/Fragments/PmpMedia";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import classNames from "classnames";
import { Responsive } from "@Boot/Responsive";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./FinalShape.module.scss";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { ScrollToAnchorTags } from "@UI/Navigation/ScrollToAnchorTags";

const contentReferences: string[] = [
  "weapon_section.content",
  "weapon_section.copy",
  "weapon_section.copy.button",
  "supers_section.content",
  "story_section.content",
  "episodes_section",
  "activities_section.content",
  "destination_section.content",
  "editions_section",
  "media.content",
  "ce.buy_button",
  "hero",
  "hero.buy_button",
  "hero.trailer_button",
];

const FinalShape: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const topContent = useRef<HTMLDivElement | null>(null);
  const bottomContent = useRef<HTMLDivElement | null>(null);

  const { mobile } = useDataStore(Responsive);

  useEffect(() => {
    ContentStackClient()
      .ContentType("the_final_shape_product_page")
      .Entry("blt50819e85cab942b1")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(contentReferences)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    meta,
    hero,
    sticky_nav_skus,
    sticky_buy_nav,
    activities_section,
    destination_section,
    story_section,
    supers_section,
    weapon_section,
    editions_section,
    ce,
    media,
    desktop_bg_bottom,
    mobile_bg_bottom,
    episodes_section,
  } = data ?? {};

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        bg: mobile ? mobile_bg_bottom?.url : desktop_bg_bottom?.url,
      }),
      [mobile_bg_bottom, desktop_bg_bottom, mobile]
    )
  );

  const activitiesBg = activities_section?.bg;
  const editionsBg = editions_section?.bg;

  const activitiesBackgroundImage = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile
          ? activitiesBg?.mobile_bg?.url
          : activitiesBg?.desktop_bg?.url,
      }),
      [data, mobile]
    )
  );

  const editionBackgroundImage = useCSWebpImages(
    useMemo(
      () => ({
        background: mobile
          ? editionsBg?.mobile_bg?.url
          : editionsBg?.desktop_bg?.url,
      }),
      [data, mobile]
    )
  );

  return (
    <div className={styles.finalShapeContent}>
      <BungieHelmet
        title={meta?.title}
        image={meta?.meta_img?.url}
        description={meta?.desc}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.wrapper
          )}
        />
      </BungieHelmet>

      <ScrollToAnchorTags animate={true} />

      <div ref={topContent}>
        {/* HERO */}
        <div ref={heroRef}>
          <Hero {...hero} />
        </div>

        <EditionsStickyNav
          heroRef={heroRef}
          skus={sticky_nav_skus?.map((s: any) => {
            return {
              label: s.tfs_sku.label,
              sku: s.tfs_sku.sku_tag,
            };
          })}
          logo={sticky_buy_nav?.logo?.desktop_bg?.url}
          buyBtnText={sticky_buy_nav?.buy_btn_text}
          dropdownTitle={sticky_buy_nav?.dropdown_title}
          dateText={sticky_buy_nav?.date_text}
        />
      </div>

      <div ref={bottomContent} className={styles.bottomContent}>
        {/* Story */}
        <StorySection data={story_section} />

        {/* Destination */}
        <DestinationSection data={destination_section} />

        {/* Supers */}
        <SupersSection data={supers_section} />

        <div
          className={styles.activitiesWrapper}
          style={{
            backgroundImage: `url(${activitiesBackgroundImage.background})`,
          }}
        >
          {/* Activities */}
          <ActivitiesSection data={activities_section} />

          {/* Exotic */}
          <WeaponsSection data={weapon_section} />
        </div>

        {/* Episodes */}
        <EpisodesSection data={episodes_section} />

        <div
          className={styles.editionsWrapper}
          style={{
            backgroundImage: `url(${editionBackgroundImage.background})`,
          }}
        >
          {/* Editions */}
          <EditionsSection data={editions_section} />

          {/* CE */}
          <CollectorsEditionSection data={ce} />
        </div>

        {/* MEDIA */}
        {Array.isArray(media?.content) && media?.content?.length > 0 && (
          <div id={"media"} className={styles.anchor}>
            <PmpMedia
              data={media?.content?.[0]}
              classes={{
                tab: styles.mediaTab,
                selectedTab: styles.selected,
              }}
            />
          </div>
        )}
      </div>
      {imgs?.bg && <img src={imgs?.bg} className={styles.bumperImage} />}
    </div>
  );
};

export default FinalShape;
