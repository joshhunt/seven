import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { __ } from "@Utilities/LocalLocWorkaround";
import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import styles from "./RaidRace.module.scss";

/**
 * Wrapper for Worlds First
 * @constructor
 */
const WorldsFirst: React.FC = () => {
  // if webmaster system for page is disabled, redirect to season 14 product page
  const enabled = ConfigUtils.SystemStatus("DirectWorldsFirst");
  if (!enabled) {
    return <Redirect to={RouteHelper.SeasonOfTheSplicer().url} />;
  }

  // get date and time race starts
  const liveTimeString = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    "WorldsFirstReleaseDateTime",
    ""
  );
  const liveTime = moment(liveTimeString);
  const now = moment();
  // check if race is live
  const isLive = now.isAfter(liveTime);

  const title = `${Localizer.Season14.WatchTheRace} // ${Localizer.Season14.RaidRaceLaunchDate}`;
  const titleImg = `/7/ca/destiny/bgs/raidrace/vog_logo_${Localizer.CurrentCultureName}.svg`;
  const destinyLogo =
    Localizer.CurrentCultureName === "ko"
      ? "/7/ca/destiny/bgs/raidrace/destiny_guardians_logo.svg"
      : "/7/ca/destiny/bgs/raidrace/destiny_2_logo.svg";
  const twitchBtnUrl = "https://www.twitch.tv/directory/game/Destiny%202";

  return (
    <div className={classNames(styles.wrapper, { [styles.isLive]: isLive })}>
      <BungieHelmet
        title={title}
        image={Img("/destiny/bgs/raidrace/vog_venus_skull_metadata_16x9.jpg")}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.raidRace
          )}
        />
      </BungieHelmet>
      <div>
        <div className={classNames(styles.hero, { [styles.isLive]: isLive })}>
          <div className={styles.heroBg} />
          <div className={styles.heroTitleContent}>
            <div
              className={styles.destinyLogo}
              style={{ backgroundImage: `url(${destinyLogo})` }}
            />
            <div
              className={styles.title}
              style={{ backgroundImage: `url(${titleImg})` }}
            />
            <h2>{Localizer.Season14.RaidRaceTitle}</h2>
          </div>
        </div>

        {isLive && <LiveRaidReveal />}

        {!isLive && <PreReveal />}

        <div className={styles.streamBtn}>
          <a href={twitchBtnUrl}>{Localizer.Season14.WatchOnTwitch}</a>
          <span>
            <a href={twitchBtnUrl}>
              <img src={"/7/ca/destiny/bgs/raidrace/twitch_logo.png"} />
            </a>
          </span>
        </div>

        <div className={styles.lowerContentWrapper}>
          <div className={styles.raidIconFlexWrapper}>
            <div className={styles.raidIcon} />
          </div>
          <div className={styles.contentFlexWrapper}>
            <p
              className={styles.mainBlurb}
              dangerouslySetInnerHTML={sanitizeHTML(
                Localizer.Season14.RaidRaceBlurb
              )}
            />
            <p className={styles.freeForAll}>
              {Localizer.Season14.RaidRaceFreeForAll}
            </p>
            <div className={styles.startTimes}>
              <div className={styles.startTime}>
                <h2>{Localizer.Season14.RaidRaceWatchPartyTime}</h2>
                <p>{Localizer.Season14.RaidRaceWatchPartyText}</p>
              </div>
              <div className={styles.startTime}>
                <h2>{Localizer.Season14.RaidRaceRaceBeginsTime}</h2>
                <p>{Localizer.Season14.RaidRaceRaceBeginsText}</p>
              </div>
            </div>

            {isLive && <BundleUpsell />}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Shown if the time for the Raid is still in the future
 * @constructor
 */
const PreReveal = () => {
  return (
    <div className={styles.preReleaseContent}>
      <p className={styles.dateText}>
        {Localizer.Season14.RaidRaceBeginsDateText}
      </p>
      <p className={styles.date}>{Localizer.Season14.RaidRaceStartDate}</p>
      <MarketingOptInButton />
    </div>
  );
};

/**
 * Shown if the time for the Raid is in the past
 * @constructor
 */
const LiveRaidReveal = () => {
  const twitchChannelName = useRef("professorbroman");
  const arrowsRef = useRef<null | HTMLDivElement>(null);

  const scrollToStream = () => {
    arrowsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.liveRevealWrapper}>
      <div ref={arrowsRef}>
        <a className={styles.watchRaceText} onClick={scrollToStream}>
          {Localizer.Beyondlight.WatchTheRaceToWorldFirst}
        </a>
        <DestinyArrows classes={{ root: styles.arrows }} />
      </div>
      <div className={styles.streamFrameWrapper}>
        <div className={styles.aspectRatioWrapper}>
          <TwitchFrame username={twitchChannelName.current} />
        </div>
      </div>
    </div>
  );
};

/**
 * Upsell shown at bottom of page if raid is live
 * @constructor
 */
const BundleUpsell = () => {
  const logo = `url("/7/ca/destiny/bgs/raidrace/vog_bundle_logo_${Localizer.CurrentCultureName}.svg")`;
  const btnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.DirectWorldsFirst,
    "WorldsFirstUpsellBtnAnalyticsId",
    ""
  );

  return (
    <div className={styles.upsell}>
      <div className={styles.aspectRatioWrapper} />
      <div className={styles.bundleFlexWrapper}>
        <div className={styles.contentWrapper}>
          <div
            className={styles.bundleLogo}
            style={{ backgroundImage: logo }}
          />
          <Button
            className={styles.bundleBtn}
            url={"/SilverBundle-Atheon"}
            analyticsId={btnAnalyticsId}
            buttonType={"clear"}
          >
            {Localizer.Season14.RaidRaceUpsellBtnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

class TwitchFrame extends React.Component<{ username: string }> {
  public shouldComponentUpdate(
    nextProps: Readonly<{ username: string }>,
    nextState: Readonly<{}>,
    nextContext: any
  ): boolean {
    return nextProps.username !== this.props.username;
  }

  public render() {
    const { username } = this.props;

    return (
      <>
        <iframe
          title={username}
          src={`https://player.twitch.tv/?channel=${username}&parent=${location.hostname}&muted=true&autoplay=true`}
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
        />
      </>
    );
  }
}

export default WorldsFirst;
