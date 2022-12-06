// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Featured } from "@Areas/Home/Featured";
import { Hero } from "@Areas/Home/Hero";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { useCSWebpImages } from "@Utilities/CSUtils";
import React, { useEffect, useMemo, useState } from "react";
import { BnetStackHomePage } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { Recent } from "./Recent";
import styles from "./Home.module.scss";

const Home = () => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [homePageData, setHomePageData] = useState<BnetStackHomePage>();
  const [supportsWebP, setSupportsWebP] = useState(true);

  const responseCacheObject: Record<string, BnetStackHomePage> = {};

  useEffect(() => {
    if (responseCacheObject[locale]) {
      setHomePageData(responseCacheObject[locale]);
    } else {
      ContentStackClient()
        .ContentType("home_page")
        .Entry("blt801edf5507a32bf5")
        .language(locale)
        .includeReference("featured.news_article.reference")
        .toJSON()
        .fetch()
        .then((result) => {
          responseCacheObject[locale] = result;
          setHomePageData(result);
        });
    }

    BrowserUtils.supportsWebp().then((supportsWebp) =>
      setSupportsWebP(supportsWebp)
    );
  }, [locale]);

  const {
    featured,
    title,
    button_one_label,
    button_one_link,
    button_two_label,
    button_two_link,
    hero_image,
    mobile_hero_image,
    hero_video,
    subtitle,
    title_as_image,
  } = homePageData ?? {};

  const images = useCSWebpImages(
    useMemo(
      () => ({
        heroBg: hero_image?.url,
        mobileBg: mobile_hero_image?.url,
        titleImg: title_as_image?.url,
      }),
      [hero_image, mobile_hero_image, title_as_image]
    )
  );

  if (!homePageData) {
    return null;
  }

  return (
    <>
      <BungieHelmet
        title={""}
        image={hero_image?.url || BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div>
        <Hero
          heroData={{
            hero_image: images?.heroBg,
            mobile_hero_image: images?.mobileBg,
            hero_video,
            title,
            title_as_image: images?.titleImg,
            subtitle,
            button_one: { label: button_one_label, link: button_one_link },
            button_two: { label: button_two_label, link: button_two_link },
          }}
        />
        <Featured featured={featured} />
        <Recent />
        <div className={styles.buttonContainer}>
          <Button buttonType={"white"} url={RouteHelper.News()}>
            {Localizer.news.morenews}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
