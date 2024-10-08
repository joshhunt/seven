// Created by atseng, 2023
// Copyright Bungie, Inc.

import { Featured } from "@Areas/Home/Featured";
import { Hero } from "@Areas/Home/Hero";
import { Recent } from "@Areas/Home/Recent";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import * as Globals from "@Enum";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UIKit/Controls/Button/Button";
import { useCSWebpImages } from "@Utilities/CSUtils";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { BnetStackHomePage } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./Home.module.scss";

interface HomeProps {}

const Home: React.FC<HomeProps> = (props) => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [homePageData, setHomePageData] = useState<BnetStackHomePage>();
  const navLoc = Localizer.Nav;

  const responseCacheObject: Record<string, BnetStackHomePage> = {};
  const mounted = React.useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return;
    }

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
        })
        .finally(() => {
          mounted.current = true;
        });
    }
  }, [locale, responseCacheObject]);

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

  const location = useHistory().location;

  if (!homePageData) {
    return null;
  }

  const DESTINY_TITLE = navLoc.DestinyHomeSeoTitle;
  const DESTINY_DESC = navLoc.DestinyHomeSeoDesc;

  const sanitizedTitle =
    !DESTINY_TITLE || DESTINY_TITLE.startsWith("##")
      ? "Destiny 2"
      : DESTINY_TITLE;
  const sanitizedDesc =
    !DESTINY_DESC || DESTINY_DESC.startsWith("##")
      ? "Join your fellow Guardians in the definitive sci-fi action MMO FPS, featuring a massive galaxy continually growing with new Seasons, Events, and Expansions, offering fresh challenges to experience and an arsenal of weapons and gear to collect."
      : DESTINY_DESC;

  if (DESTINY_TITLE.startsWith("##") || DESTINY_DESC.startsWith("##")) {
    Platform.RendererService.ServerLog({
      Url: window.location.href,
      LogLevel: Globals.RendererLogLevel.Error,
      Message: "Bungie Strings Not Loaded",
      Stack: new Error()?.stack,
      SpamReductionLevel: Globals.SpamReductionLevel.Default,
    })
      .then(() =>
        Logger.log("Error logged to server: ", "Bungie Strings Not Loaded")
      )
      .catch((e) => null);
  }

  return (
    <>
      <BungieHelmet
        title={sanitizedTitle}
        description={sanitizedDesc}
        image={hero_image?.url || BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        {DESTINY_DESC && (
          <meta property={"description"} content={sanitizedDesc} />
        )}
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
            button_one: {
              label: button_one_label,
              link: button_one_link,
            },
            button_two: {
              label: button_two_label,
              link: button_two_link,
            },
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
