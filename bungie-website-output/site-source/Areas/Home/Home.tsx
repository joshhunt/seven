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

  const Query = () => {
    return ContentStackClient()
      .ContentType("home_page")
      .Query()
      .language(locale)
      .includeReference([
        "homepage_hero",
        "homepage_featured.featured_block",
        "homepage_featured.featured_block.callout",
        "homepage_featured.featured_block.news_article",
      ])
      .toJSON();
  };

  useEffect(() => {
    Query()
      .find()
      .then((result) => {
        const data: BnetStackHomePage = result[0][0];

        setHomePageData(data);
      });
  }, []);

  const hero = homePageData?.homepage_hero;

  if (!homePageData || !hero) {
    return null;
  }

  return (
    <>
      <BungieHelmet
        title={Localizer.News.News}
        image={BungieHelmet.DefaultBoringMetaImage}
      >
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>
      <div>
        <Hero heroData={homePageData?.homepage_hero[0]} />
        <Featured featured={homePageData?.homepage_featured?.featured_block} />
        <Recent />
      </div>
    </>
  );
};
