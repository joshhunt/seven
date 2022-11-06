// Created by a-bphillips, 2022
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
import React, { useEffect, useRef, useState } from "react";
import { BnetStackNebulaProductPage } from "../../../Generated/contentstack-types";
import { Responsive } from "@Boot/Responsive";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import {
  responsiveBgImage,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import styles from "./Lightfall.module.scss";

const contentReferences: string[] = [
  "our_end_section.top_header.thumbnails",
  "our_end_section.bottom_header.thumbnails",
  "outrun_section.info_blocks",
  "media",
];

const Lightfall: React.FC = () => {
  const [data, setData] = useState<BnetStackNebulaProductPage | null>(null);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const topContent = useRef<HTMLDivElement | null>(null);
  const bottomContent = useRef<HTMLDivElement | null>(null);

  const { mobile } = useDataStore(Responsive);

  useEffect(() => {
    ContentStackClient()
      .ContentType("nebula_product_page")
      .Entry("blt1687fccada8d316b")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(contentReferences)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const {
    strand_section,
    our_end_section,
    outrun_section,
    editions_section,
    media,
    bottom_image,
    hero,
    bottom_img_mobile,
    guardian_toasts,
    ce,
    sticky_nav_skus,
    sticky_buy_nav,
    img_swap_test,
    meta,
  } = data ?? {};

  return (
    <div
      className={styles.lightfallContent}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          bottom_image,
          bottom_img_mobile,
          mobile
        ),
      }}
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

      <div className={styles.topContent} ref={topContent}>
        {/* HERO */}
        <div ref={heroRef}>
          <LightfallHero data={hero} TestCData={img_swap_test} />
        </div>

        <LightfallStickyNav
          heroRef={heroRef}
          skus={sticky_nav_skus?.map((s) => {
            return { label: s.lf_sku.label, sku: s.lf_sku.sku_tag };
          })}
          logo={sticky_buy_nav?.lf_logo?.desktop_bg?.url}
          buyBtnText={sticky_buy_nav?.buy_btn_text}
          dropdownTitle={sticky_buy_nav?.dropdown_title}
          dateText={sticky_buy_nav?.date_text}
        />

        {/* OUR END SECTION */}
        <OurEndSection data={our_end_section} TestCData={img_swap_test} />

        {/* STRAND HEADER CONTENT */}
        <div
          className={classNames(styles.section, styles.strandHeader)}
          style={{
            backgroundImage: responsiveBgImage(
              strand_section?.bg?.desktop_bg?.url,
              strand_section?.bg?.mobile_bg?.url,
              mobile
            ),
          }}
        >
          <div className={styles.sectionContent}>
            <LightfallSectionHeader
              heading={strand_section?.heading}
              blurb={strand_section?.blurb}
              largeHeading={strand_section?.large_heading}
              textBg={strand_section?.text_bg?.url}
              classes={{ largeHeading: styles.strandLargeHeading }}
            />
          </div>
        </div>
      </div>

      <AnimatedStrandGuardians
        data={strand_section?.guardians_graphic}
        toasts={guardian_toasts}
        aboveContent={topContent}
        belowContent={bottomContent}
      />

      <div className={styles.bottomContent} ref={bottomContent}>
        {/* OUTRUN THE END SECTION */}
        <OutrunTheEndSection
          data={outrun_section}
          ctaBtnText={ce?.buy_btn_text}
        />

        {/* EDITIONS SELECTOR */}
        <LightfallEditionsSection data={editions_section} />

        {/* CE */}
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
            <LightfallSectionHeader
              heading={ce?.heading}
              blurb={ce?.blurb}
              alignment={"center"}
            />
            <Button url={ce?.buy_btn_url} className={styles.buyBtn}>
              {ce?.buy_btn_text}
            </Button>
          </div>
        </div>

        {/* MEDIA */}
        <PmpMedia
          data={media?.[0]}
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
