// Created by atseng, 2022
// Copyright Bungie, Inc.

import * as Globals from "@Enum";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@bungie/localization";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import {
  CalloutSection,
  Navigation,
  SlimFooter,
  ClipPathWrapper,
} from "./Components";
import {
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  TwitchIcon,
  FacebookIcon,
} from "./Components/SocialIcons";

import styles from "./Home.module.scss";

const Home = () => {
  const navLoc = Localizer.Nav;
  const communityLoc = Localizer.Community;
  const [isTopOfPage, setIsTopOfPage] = useState(true);

  /* Detect if user has scrolled from top */
  useEffect(() => {
    const getSetScrollPos = () => {
      if (window?.scrollY > 0) {
        setIsTopOfPage(false);
      } else {
        setIsTopOfPage(true);
      }
    };
    const onScroll = () => window?.requestAnimationFrame(getSetScrollPos);

    window.addEventListener("scroll", onScroll);

    return () => window?.removeEventListener("scroll", onScroll);
  }, [isTopOfPage]);

  /* Composing data here to keep modification central to one file*/
  const SECTION_DATA = [
    {
      backgroundImage: "7/ca/destiny/bgs/c3BsYXNo/c3DsYXNo_01.jpg",
      logoImage: {
        alt: navLoc.Destiny,
        img: "7/ca/destiny/logos/logo_destiny2.png",
      },
      buttonData: [
        {
          href: RouteHelper.DestinyHome(),
          label: Localizer.Buyflow.LearnMoreLinkLabel,
          buttonColor: "blue" as "blue",
        },
      ],
      esrbLogo: {
        img: communityLoc.DestinyTwoRating,
        alt: communityLoc.ratedtforteen,
        href: communityLoc.ratingurl,
        note: [
          communityLoc.RatingTBlood,
          communityLoc.RatingTLanguage,
          communityLoc.RatingTViolence,
        ],
      },
    },
    {
      backgroundImage: "7/ca/destiny/bgs/c3BsYXNo/c3DsYXNo_02.jpg",
      logoImage: {
        alt: navLoc.Marathon,
        img: "7/ca/destiny/bgs/c3BsYXNo/c3DsYXNo_02_L.svg",
      },
      buttonData: [
        {
          href:
            "https://www.marathonthegame.com?CID=bungie_net:web:bnet:bnet_home:bnet_home:bng:2024_05",
          label: Localizer.Buyflow.LearnMoreLinkLabel,
          buttonColor: "green" as "green",
        },
      ],
      esrbLogo: {
        img: communityLoc.RatingPendingLogo,
        alt: communityLoc.RatingPending,
        href: communityLoc.RatingGuide,
      },
      classes: {
        logoClass: styles.specialLogo,
      },
    },
    {
      backgroundImage: "7/ca/destiny/bgs/c3BsYXNo/c3DsYXNo_03.jpg",
      sectionTitle: navLoc.Careers,
      logoImage: {
        alt: "",
        img: "7/ca/destiny/bgs/c3BsYXNo/c3DsYXNo_p.png",
      },
      buttonData: [
        {
          href: RouteHelper.Careers("jobs"),
          label: communityLoc.ExploreJobs,
          buttonColor: "blue" as "blue",
        },
        {
          href: RouteHelper.Careers(),
          label: communityLoc.AboutBungie,
          buttonColor: "grey" as "grey",
        },
      ],
      classes: {
        logoClass: styles.careersLogo,
        buttonContainer: styles.careersButtons,
      },
    },
  ];

  const FOOTER_DATA = {
    /* The Instagram and Facebook Font Awesome icons are old - needs to be updated; Using SVGs for now */
    /* Bungie social accounts are not regionalized */
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
      Url: location.href,
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
            SpecialBodyClasses(BodyClasses.NoSpacer | BodyClasses.HideMainNav),
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
        <Navigation isTopOfPage={isTopOfPage} />
        {SECTION_DATA.map((section, index) => (
          <ClipPathWrapper
            clipPathOff={index === 0}
            backgroundImage={section.backgroundImage}
            key={section?.logoImage?.img}
          >
            <CalloutSection {...section} />
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
