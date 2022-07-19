// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Featured } from "@Areas/Home/Featured";
import { Hero } from "@Areas/Home/Hero";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import React, { useEffect, useState } from "react";
import { BnetStackHomePage } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { Recent } from "./Recent";

interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const [homePageData, setHomePageData] = useState<BnetStackHomePage>();

  useEffect(() => {
    ContentStackClient()
      .ContentType("home_page")
      .Entry("blt801edf5507a32bf5")
      .language(locale)
      .includeReference("featured.news_article.reference")
      .toJSON()
      .fetch()
      .then((result) => {
        setHomePageData(result);
      });
  }, []);

  const {
    featured,
    title,
    button_one_label,
    button_one_link,
    button_two_label,
    button_two_link,
    hero_image,
    hero_video,
    subtitle,
    title_as_image,
  } = homePageData ?? {};

  if (!homePageData) {
    return null;
  }

  return (
    <>
      <BungieHelmet
        title={Localizer.News.News}
        image={hero_image.url || BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div>
        <Hero
          heroData={{
            hero_image,
            hero_video,
            title,
            title_as_image,
            subtitle,
            button_one: { label: button_one_label, link: button_one_link },
            button_two: { label: button_two_label, link: button_two_link },
          }}
        />
        <Featured featured={featured} />
        <Recent />
      </div>
    </>
  );
};
