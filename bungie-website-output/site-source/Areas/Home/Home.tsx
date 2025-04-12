// Created by atseng, 2022
// Copyright Bungie, Inc.

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import * as Globals from "@Enum";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";
import { UrlUtils } from "@Utilities/UrlUtils";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@bungie/localization";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import {
  BnetStackFile,
  BnetStackLink,
} from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import { CalloutSection, SlimFooter, ClipPathWrapper } from "./Components";
import {
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  TwitchIcon,
  FacebookIcon,
} from "./Components/SocialIcons";

import styles from "./Home.module.scss";

const contentReferences: string[] = ["sections"];

interface SectionProps {
  section_title: string;
  primary_section_image?: BnetStackFile;
  logo_image?: BnetStackFile;
  game_rating_information?: {
    game_rating_image?: BnetStackFile;
    game_rating_tags?: string;
    game_rating_url?: string;
  };
  buttons?: {
    button_theme: "destiny-core" | "bungie-core";
    primary_button: BnetStackLink;
    secondary_button: BnetStackLink;
  };
  background_images?: {
    desktop_image: BnetStackFile;
    mobile_image: BnetStackFile;
  };
}

interface SectionsProps {
  sections: { section: SectionProps }[];
}

const Home = () => {
  const [{ sections }, setData] = useState<SectionsProps>({ sections: [] });
  const { mobile } = useDataStore(Responsive);

  const setBgImage = (backgroundImages: {
    desktop_image: BnetStackFile;
    mobile_image: BnetStackFile;
  }): string => {
    if (backgroundImages?.desktop_image || backgroundImages?.mobile_image) {
      const bgImage = UrlUtils.addQueryParam(
        mobile
          ? backgroundImages?.mobile_image?.url ??
              backgroundImages?.desktop_image?.url
          : backgroundImages?.desktop_image?.url,
        "format",
        "webp"
      );

      return bgImage;
    }

    return null;
  };

  useEffect(() => {
    ContentStackClient()
      .ContentType("landing_page")
      .Entry("blt25066f013983835b")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .includeReference(contentReferences)
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  const navLoc = Localizer.Nav;
  const communityLoc = Localizer.Community;

  const FOOTER_DATA = {
    socialLinks: [
      {
        href: "https://twitter.com/bungie",
        alt: communityLoc.BungieTwitter,
        node: <TwitterIcon title={communityLoc.BungieTwitter} />,
      },
      {
        href: "https://www.youtube.com/user/Bungie",
        alt: communityLoc.BungieYoutube,
        node: <YouTubeIcon title={communityLoc.BungieYoutube} />,
      },
      {
        href: "https://www.instagram.com/bungie/",
        alt: communityLoc.BungieInstagram,
        node: <InstagramIcon title={communityLoc.BungieInstagram} />,
      },
      {
        href: "https://www.facebook.com/Bungie",
        alt: communityLoc.BungieFacebook,
        node: <FacebookIcon title={communityLoc.BungieFacebook} />,
      },
      {
        href: "https://www.twitch.tv/bungie",
        alt: communityLoc.BungieTwitch,
        node: <TwitchIcon title={communityLoc.BungieTwitch} />,
      },
      {
        href: "https://www.linkedin.com/company/bungie",
        alt: communityLoc.BungieLinkedIn,
        node: <LinkedInIcon title={communityLoc.BungieLinkedIn} />,
      },
    ],
    links: [
      {
        href: RouteHelper.DestinyHome(),
        label: navLoc.NavTopGameCollapse,
      },
      {
        href:
          "https://www.marathonthegame.com?CID=bungie_net:web:bnet_home:bnet_footer:marathon:bng:2024_05",
        label: navLoc.Marathon,
      },
      {
        href: RouteHelper.Careers(),
        label: navLoc.Careers,
      },
      {
        href: RouteHelper.BungieStore(),
        label: navLoc.Store,
      },
      {
        href: RouteHelper.Foundation(),
        label: navLoc.Foundation,
      },
      {
        href: RouteHelper.LegalPage({ pageName: "sla" }),
        label: navLoc.Legal,
      },
      {
        href: RouteHelper.LegalPage({ pageName: "terms" }),
        label: navLoc.Terms,
      },
      {
        href: RouteHelper.PressKits(),
        label: navLoc.Press,
      },
    ],
    siteLogo: {
      img: "/7/ca/bungie/icons/logos/bungienet/bungie_logo_basic.svg",
      href: RouteHelper.Home,
      alt: navLoc.Bungie,
    },
  };

  const BUNGIE_TITLE = navLoc.BungieHomeSeoTitle;
  const BUNGIE_DESC = navLoc.BungieHomeSeoDesc;

  const sanitizedTitle =
    !BUNGIE_TITLE || BUNGIE_TITLE.startsWith("##")
      ? "Bungie.net | Creators of Destiny 2 & Marathon"
      : BUNGIE_TITLE;
  const sanitizedDesc =
    !BUNGIE_DESC || BUNGIE_DESC.startsWith("##")
      ? "Bungie is the studio behind Halo, Destiny, and Marathon. The studio's core mission is to build worlds that inspire friendship."
      : BUNGIE_DESC;

  if (BUNGIE_TITLE.startsWith("##") || BUNGIE_DESC.startsWith("##")) {
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
        image={"7/ca/bungie/bgs/bungie_home_og.jpg"}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.specialWrapper
          )}
        />
        {sanitizedDesc && (
          <meta property={"description"} content={sanitizedDesc} />
        )}
        <link rel="stylesheet" href="https://use.typekit.net/php2xww.css" />
      </BungieHelmet>
      <h1 className={styles.srOnly}>{navLoc.Bungie}</h1>
      <div className={styles.homeWrapper}>
        {sections?.length > 0 &&
          sections.map(({ section }, index: number) => (
            <ClipPathWrapper
              clipPathOff={index === 0}
              backgroundImage={setBgImage(section?.background_images)}
              key={section?.logo_image?.url}
            >
              <CalloutSection
                sectionTitle={section.section_title}
                logoImage={section?.logo_image?.url}
                primaryImage={section?.primary_section_image?.url}
                buttonData={section?.buttons}
                gameRatingData={section?.game_rating_information}
              />
            </ClipPathWrapper>
          ))}
        <ClipPathWrapper
          backgroundColor={"#000000"}
          classes={{ wrapper: styles.footer }}
        >
          <SlimFooter {...FOOTER_DATA} />
        </ClipPathWrapper>
      </div>
    </>
  );
};

export default Home;
