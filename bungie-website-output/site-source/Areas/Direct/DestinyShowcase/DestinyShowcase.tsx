// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Localizer } from "@Global/Localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { TwitchStreamFrame } from "@UI/Marketing/TwitchStreamFrame";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import styles from "./DestinyShowcase.module.scss";

const getIsStreamActive = () => {
  const streamStartDateString = ConfigUtils.GetParameter(
    SystemNames.DestinyShowcase,
    "StreamStartTime",
    ""
  );
  const streamStartDateTime = DateTime.fromISO(streamStartDateString);
  const now = DateTime.now();

  return now >= streamStartDateTime;
};

const DestinyShowcase: React.FC = (props) => {
  const isStreamLive = getIsStreamActive();
  const showcaseLoc = Localizer.Showcase;

  useEffect(() => {
    // if page has been disabled via webmaster, redirect to expansion product page
    checkPageIsEnabled();
  }, []);

  /**
   * redirects user to nova product page if page's system is disabled in webmaster
   */
  const checkPageIsEnabled = () => {
    const isPageEnabled = ConfigUtils.SystemStatus(SystemNames.DestinyShowcase);
    if (!isPageEnabled) {
      // get page to redirect to with the homepage as the default
      const redirectPage = ConfigUtils.GetParameter(
        SystemNames.DestinyShowcase,
        "RedirectPageOnShowcaseDisabled",
        "/"
      );

      // can't use RouteHelper here because nova product page will not exist when this page goes live
      window.location.replace(redirectPage);
    }
  };

  const heroLogoImg = showcaseImgPath(
    `logos/witch_queen_tune_in_logo_${LocalizerUtils.currentCultureName}.png`
  );

  return (
    <div className={styles.showcaseContent}>
      <ShowcaseHelmet />
      <div className={styles.showcaseHero}>
        <img
          className={styles.titleImg}
          src={heroLogoImg}
          alt={showcaseLoc.DestinyShowcase}
        />
      </div>

      {isStreamLive && <ShowcaseStream />}

      {!isStreamLive && (
        <div className={styles.preStreamInfo}>
          <p className={styles.date}>{showcaseLoc.StreamStartDate}</p>
        </div>
      )}

      <div className={styles.showcaseMainContent}>
        <p
          className={styles.mainBlurb}
          dangerouslySetInnerHTML={{ __html: showcaseLoc.MainBlurb }}
        />

        {!isStreamLive && (
          <>
            <MarketingOptInButton className={styles.emailUpdatesBtn} />
            <TwitchButton />
          </>
        )}
      </div>
      <div className={styles.showTimes}>
        <StreamTimeBlock
          time={showcaseLoc.PreShowTime}
          subtitle={showcaseLoc.PreShowSubtitle}
        />
        <StreamTimeBlock
          time={showcaseLoc.ShowTime}
          subtitle={showcaseLoc.ShowSubtitle}
        />
      </div>
    </div>
  );
};

interface IStreamTimeBlock {
  time: string;
  subtitle?: string;
}

const StreamTimeBlock: React.FC<IStreamTimeBlock> = (props) => {
  return (
    <div className={styles.streamTime}>
      <p className={styles.time}>{props.time}</p>
      <p className={styles.subtitle}>{props.subtitle}</p>
    </div>
  );
};

const ShowcaseStream: React.FC = (props) => {
  const streamRef = useRef<null | HTMLDivElement>(null);

  const scrollToStream = () =>
    streamRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <>
      <div className={styles.scrollActionBtnWrapper}>
        <p className={styles.scrollActionBtn} onClick={scrollToStream}>
          {Localizer.Showcase.SurviveTheTruth}
        </p>
        <DestinyArrows classes={{ root: styles.arrows }} />
      </div>
      <div className={styles.twitchFrame} ref={streamRef}>
        <div className={styles.aspectRatioController} />
        <TwitchStreamFrame streamChannel={"bungie"} />
      </div>
      <TwitchButton className={styles.live} />
    </>
  );
};

const TwitchButton: React.FC<{ className?: string }> = ({ className }) => {
  const twitchBungieChannelUrl = ConfigUtils.GetParameter(
    SystemNames.EmbeddedTwitchStreams,
    "WatchOnTwitchLinkDestination",
    "https://www.twitch.tv/Bungie"
  );

  return (
    <div className={classNames(styles.twitchBtnWrapper, className)}>
      <a className={styles.twitchBtn} href={twitchBungieChannelUrl}>
        <p>{Localizer.Season14.WatchOnTwitch}</p>
        <img
          className={styles.twitchLogo}
          src={"/7/ca/bungie/icons/logos/twitch/twitch_logo.png"}
        />
      </a>
    </div>
  );
};

const ShowcaseHelmet: React.FC = (props) => {
  const { day, month, year } = DateTime.fromISO("2021-08-24");
  const titleDateString = Localizer.Format(Localizer.Time.CompactMonthDayYear, {
    day: day,
    month: month,
    year: year,
  });

  const title = `${Localizer.Showcase.DestinyShowcase?.toUpperCase()} ${titleDateString}`;

  return (
    <BungieHelmet
      title={title}
      image={showcaseImgPath("destiny_showcase_tune_in_metadata.jpg")}
    >
      <body
        className={classNames(
          SpecialBodyClasses(BodyClasses.NoSpacer),
          styles.destinyShowcase
        )}
      />
    </BungieHelmet>
  );
};

const showcaseImgPath = (img: string) => {
  return `/7/ca/destiny/bgs/showcase/${img}`;
};

export default DestinyShowcase;
