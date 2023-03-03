import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import {
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router";
import { BnetStackDisciplesRaidRacePage } from "../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./RaidRace.module.scss";

const redirectToNebula = () => {
  return <Redirect to={RouteHelper.Lightfall().url} />;
};

/**
 * Wrapper for Worlds First
 * @constructor
 */
const WorldsFirst: React.FC = () => {
  const { mobile } = useDataStore(Responsive);
  const [data, setData] = useState<BnetStackDisciplesRaidRacePage>();

  // if webmaster system for page is disabled, redirect to nebula product page
  const enabled = ConfigUtils.SystemStatus("DirectWorldsFirst");
  if (!enabled) {
    return redirectToNebula();
  }

  useEffect(() => {
    ContentStackClient()
      .ContentType("lightfall_raid_race_page")
      .Entry("blt8f7a03325dc50b85")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .fetch()
      .then((res) => {
        setData(res);
      })
      .catch(redirectToNebula);
  }, []);

  // check if stream is live
  const streamStartTime = ConfigUtils.GetParameter(
    "WorldsFirstStream",
    "WorldsFirstReleaseDateTime",
    ""
  );
  const streamStartDateTime = DateTime.fromISO(streamStartTime);
  const now = DateTime.now();

  const isStreamDisabled = !ConfigUtils.SystemStatus(
    SystemNames.WorldsFirstStream
  );

  // render stream as long as webmaster system is NOT disabled and time is after stream start time
  const isLive = !isStreamDisabled && now >= streamStartDateTime;

  const {
    title,
    meta_img,
    destiny_logo,
    main_blurb,
    page_bg,
    page_subtitle,
    page_title,
    race_time_blocks,
    raid_logo,
    twitch_caption,
    twitch_logo,
    wq_logo,
    twitch_btn_url,
    pre_reveal,
  } = data ?? {};

  if (!data) {
    return <SpinnerContainer loading={true} />;
  }

  return (
    <div className={styles.raidRace}>
      <BungieHelmet title={title} image={meta_img?.url}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <div
        className={styles.contentWrapper}
        style={{
          backgroundImage: responsiveBgImageFromStackFile(
            page_bg?.desktop,
            page_bg?.mobile,
            mobile
          ),
        }}
      >
        <div className={styles.hero}>
          <img className={styles.destinyLogo} src={destiny_logo?.url} />
          <h1 className={styles.title}>
            <span
              className={styles.titleRootFx}
              dangerouslySetInnerHTML={sanitizeHTML(page_title)}
            />
            <span
              className={styles.titleInnerFx}
              dangerouslySetInnerHTML={sanitizeHTML(page_title)}
            />
          </h1>
          <h2 className={styles.subtitle}>{page_subtitle}</h2>
        </div>

        {isLive && <LiveRaidReveal data={data} />}

        {!isLive && <PreReveal data={data} />}

        {!isLive && (
          <a className={styles.streamBtn} href={twitch_btn_url}>
            {twitch_caption}
            <span>
              <img src={twitch_logo?.url} />
            </span>
          </a>
        )}

        {isLive && (
          <div className={styles.streamBtnWrapper}>
            <a className={styles.liveStreamBtn} href={twitch_btn_url}>
              <img className={styles.liveStreamLogo} src={twitch_logo?.url} />
            </a>
          </div>
        )}

        {!isLive && (
          <>
            <ClickableMediaThumbnail
              thumbnail={pre_reveal?.trailer_btn.thumbnail?.url}
              videoId={pre_reveal?.trailer_btn.trailer_id}
              classes={{
                btnWrapper: styles.trailerBtn,
                playIcon: styles.trailerPlayIcon,
                btnBg: styles.btnBg,
              }}
              showShadowBehindPlayIcon
            >
              <div className={styles.btnContent}>
                {pre_reveal?.trailer_btn.btn_text}
              </div>
            </ClickableMediaThumbnail>

            <div className={styles.optInBtnWrapper}>
              <MarketingOptInButton className={styles.optInButton} />
            </div>
          </>
        )}

        <div className={styles.lowerContentWrapper}>
          <div
            className={classNames(styles.raidIconFlexWrapper, {
              [styles.hideTiny]: !isLive,
            })}
          >
            <div
              className={classNames(styles.raidIcon)}
              style={{ backgroundImage: bgImageFromStackFile(raid_logo) }}
            />
          </div>
          <div className={styles.contentFlexWrapper}>
            <p
              className={styles.mainBlurb}
              dangerouslySetInnerHTML={sanitizeHTML(main_blurb)}
            />
            <div className={styles.startTimes}>
              {race_time_blocks?.map((b, i) => {
                return (
                  <div className={styles.startTime} key={i}>
                    <h2>{race_time_blocks?.[i]?.time}</h2>
                    <p>{race_time_blocks?.[i]?.subtitle}</p>
                  </div>
                );
              })}
            </div>
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
const PreReveal = ({ data }: { data: BnetStackDisciplesRaidRacePage }) => {
  return (
    <div className={styles.preReleaseContent}>
      <p
        className={styles.dateText}
        dangerouslySetInnerHTML={sanitizeHTML(
          data?.pre_reveal?.race_begins_blurb
        )}
      />
    </div>
  );
};

/**
 * Shown if the time for the Raid is in the past
 * @constructor
 */
const LiveRaidReveal = ({ data }: { data: BnetStackDisciplesRaidRacePage }) => {
  const twitchChannelName = useRef("professorbroman");
  const arrowsRef = useRef<null | HTMLDivElement>(null);

  const scrollToStream = () => {
    arrowsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.liveRevealWrapper}>
      <div ref={arrowsRef}>
        <div className={styles.watchRaceBtnWrapper}>
          <a className={styles.watchRaceText} onClick={scrollToStream}>
            {data?.watch_race_heading}
          </a>
        </div>
        <DestinyArrows classes={{ root: styles.arrows }} />
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
