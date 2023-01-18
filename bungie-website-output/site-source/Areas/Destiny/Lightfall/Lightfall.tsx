// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { AnimatedStrandGuardians } from "@Areas/Destiny/Lightfall/components/AnimatedStrandGuardians/AnimatedStrandGuardians";
import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import LightfallStickyNav from "@Areas/Destiny/Lightfall/components/LightfallStickyNav/LightfallStickyNav";
import { LightfallEditionsSection } from "@Areas/Destiny/Lightfall/sections/LightfallEditionsSection/LightfallEditionsSection";
import { LightfallHero } from "@Areas/Destiny/Lightfall/sections/LightfallHero/LightfallHero";
import { OurEndSection } from "@Areas/Destiny/Lightfall/sections/OurEndSection/OurEndSection";
import { OutrunTheEndSection } from "@Areas/Destiny/Lightfall/sections/OutrunTheEndSection/OutrunTheEndSection";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { PmpMedia } from "@UI/Marketing/Fragments/PmpMedia";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BnetStackNebulaProductPage } from "../../../Generated/contentstack-types";
import { Responsive } from "@Boot/Responsive";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import {
  responsiveBgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import styles from "./Lightfall.module.scss";
import { CampaignSection } from "@Areas/Destiny/Lightfall/sections/CampaignSection/CampaignSection";
import { LightfallGuardiansSection } from "@Areas/Destiny/Lightfall/sections/LightfallGuardiansSection/LightfallGuardiansSection";
import { LightfallNeonSection } from "@Areas/Destiny/Lightfall/sections/LightfallNeonSection/LightfallNeonSection";
import { LightfallQuicksilverSection } from "@Areas/Destiny/Lightfall/sections/LightfallQuicksilverSection/LightfallQuicksilverSection";
import { LightfallGearSection } from "@Areas/Destiny/Lightfall/sections/LightfallGearSection/LightfallGearSection";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import { ScrollToAnchorTags } from "@UI/Navigation/ScrollToAnchorTags";
import { LightfallStrandSection } from "@Areas/Destiny/Lightfall/sections/LightfallStrandSection/LightfallStrandSection";

const contentReferences: string[] = [
  "hero.buy_btn",
  "hero.trailer_btn",
  "our_end_section",
  "campaign_section.content",
  "strand_section.button",
  "neon_section.button",
  "neon_section.content",
  "quicksilver_section.button",
  "gear_section.button",
  "gear_section.content",
  "outrun_section.content",
  "editions_section",
  "media.content",
  "ce.buy_button",
];

const Lightfall: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [
    nebulaData,
    setNebulaData,
  ] = useState<BnetStackNebulaProductPage | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const topContent = useRef<HTMLDivElement | null>(null);
  const bottomContent = useRef<HTMLDivElement | null>(null);

  const { mobile } = useDataStore(Responsive);

  useEffect(() => {
    ContentStackClient()
      .ContentType("lightfall_product_page")
      .Entry("bltf3c80cd20d786d54")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(contentReferences)
      .toJSON()
      .fetch()
      .then(setData);

    ContentStackClient()
      .ContentType("nebula_product_page")
      .Entry("blt1687fccada8d316b")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference([])
      .toJSON()
      .fetch()
      .then(setNebulaData);
  }, []);

  const {
    meta,
    hero,
    sticky_nav_skus,
    sticky_buy_nav,
    our_end_section,
    campaign_section,
    strand_section,
    guardian_toasts,
    neon_section,
    quicksilver_section,
    gear_section,
    outrun_section,
    editions_section,
    ce,
    media,
    desktop_bg_bottom,
    mobile_bg_bottom,
  } = data ?? {};

  const {
    strand_section: oldStrandSection,
    guardian_toasts: oldGuardianToasts,
  } = nebulaData ?? {};

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        bg: mobile ? mobile_bg_bottom?.url : desktop_bg_bottom?.url,
      }),
      [mobile_bg_bottom, desktop_bg_bottom, mobile]
    )
  );

  return (
    <div
      className={styles.lightfallContent}
      style={{ backgroundImage: `url(${imgs?.bg})` }}
    >
      <BungieHelmet
        title={meta?.title}
        image={meta?.meta_img?.url}
        description={meta?.desc}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.lightfall
          )}
        />
      </BungieHelmet>

      <ScrollToAnchorTags animate={true} />

      <div className={styles.topContent} ref={topContent}>
        {/* HERO */}
        <div ref={heroRef}>
          <LightfallHero data={hero} />
        </div>

        <LightfallStickyNav
          heroRef={heroRef}
          skus={sticky_nav_skus?.map((s: any) => {
            return { label: s.lf_sku.label, sku: s.lf_sku.sku_tag };
          })}
          logo={sticky_buy_nav?.lf_logo?.desktop_bg?.url}
          buyBtnText={sticky_buy_nav?.buy_btn_text}
          dropdownTitle={sticky_buy_nav?.dropdown_title}
          dateText={sticky_buy_nav?.date_text}
        />

        {/* OUR END SECTION */}
        <div id={"our-end"} className={styles.anchor} />
        <OurEndSection data={our_end_section} />

        {/* CAMPAIGN SECTION */}
        <div id={"campaign"} className={styles.anchor} />
        <CampaignSection data={campaign_section} />

        {/* STRAND SECTION */}
        <div id={"strand"} className={styles.anchor} />
        <LightfallStrandSection data={strand_section} />
      </div>

      {strand_section?.legacy_strand_section ? (
        <AnimatedStrandGuardians
          data={oldStrandSection?.guardians_graphic}
          toasts={oldGuardianToasts}
          aboveContent={topContent}
          belowContent={bottomContent}
        />
      ) : (
        <LightfallGuardiansSection data={{ guardians: guardian_toasts }} />
      )}

      <div className={styles.bottomContent} ref={bottomContent}>
        {/* NEON SECTION */}
        <div id={"neon"} />
        <LightfallNeonSection data={neon_section} />

        {/* QUICKSILVER SECTION */}
        <div id={"quicksilver"} />
        <LightfallQuicksilverSection data={quicksilver_section} />

        {/* GEAR SECTION */}
        <div id={"gear"} />
        <LightfallGearSection data={gear_section} />

        <OutrunTheEndSection data={outrun_section} />

        {/* EDITIONS SELECTOR */}
        <div id={"editions"} className={styles.anchor} />
        <LightfallEditionsSection data={editions_section} />

        {/* CE */}
        <div id={"collectors-edition"} />
        <div
          className={classNames(styles.section, styles.ce)}
          style={{
            backgroundImage: responsiveBgImage(
              ce?.bg.desktop_bg?.url,
              ce?.bg?.mobile_bg?.url,
              mobile
            ),
          }}
        >
          <div className={styles.sectionContent}>
            <LightfallSectionHeader heading={ce?.heading} blurb={ce?.blurb} />
            {ce?.buy_button.map((b: any) => (
              <PmpButton key={b.uid} className={styles.buyBtn} {...b}>
                {b.label}
              </PmpButton>
            ))}
          </div>
        </div>

        {/* MEDIA */}
        <div id={"media"} className={styles.anchor} />
        <PmpMedia
          data={media?.content?.[0]}
          classes={{
            tab: styles.mediaTab,
            selectedTab: styles.selected,
            root: styles.media,
          }}
        />
      </div>
    </div>
  );
};

export default Lightfall;
