import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { ImageVideoThumb } from "@UI/Marketing/ImageThumb";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { BnetStackNebulaTuneInPage } from "../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../Platform/ContentStack/ContentStackClient";
import styles from "./NebualTuneIn.module.scss";

const NebulaTuneIn: React.FC = () => {
  const { mobile } = useDataStore(Responsive);
  const [data, setData] = useState<null | BnetStackNebulaTuneInPage>();

  // if webmaster system for page is disabled, redirect to WQ product page
  const enabled = ConfigUtils.SystemStatus("DestinyShowcase");
  const redirectPage = ConfigUtils.GetParameter(
    "DestinyShowcase",
    "RedirectPage",
    "/"
  );

  if (!enabled) {
    return <Redirect to={redirectPage} />;
  }

  useEffect(() => {
    ContentStackClient()
      .ContentType("nebula_tune_in_page")
      .Entry("blta83a3dc51d18764e")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .fetch()
      .then((res) => {
        setData(res);
      });
  }, []);

  // check if stream is live
  const streamStartTime = ConfigUtils.GetParameter(
    "DestinyShowcase",
    "StreamStartTime",
    ""
  );
  const streamStartDateTime = DateTime.fromISO(streamStartTime);
  const now = DateTime.now();

  const isLive = now >= streamStartDateTime;

  const {
    title,
    hero_bg,
    logo,
    hero_vid,
    stream_times,
    tricorn,
    event_begins_text,
    tune_in_blurb,
  } = data ?? {};

  if (!data) {
    return <SpinnerContainer loading={true} />;
  }

  return (
    <div className={styles.raidRace}>
      <BungieHelmet title={title}>
        <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
      </BungieHelmet>

      <div
        className={styles.contentOuter}
        style={{
          backgroundImage: responsiveBgImageFromStackFile(
            undefined,
            hero_bg?.mobile_bg,
            mobile
          ),
        }}
      >
        {hero_vid && !mobile && (
          <video
            className={styles.heroVid}
            poster={hero_bg?.desktop_bg?.url}
            loop
            autoPlay
            muted
            playsInline
          >
            <source src={hero_vid?.url} type={"video/mp4"} />
          </video>
        )}

        <div className={styles.contentInner}>
          <img src={logo?.url} className={styles.heroLogo} />

          <p className={styles.eventText}>
            <SafelySetInnerHTML html={event_begins_text} />
          </p>

          {isLive && <ShowcaseContent data={data} />}
          {!isLive && <TuneInContent data={data} />}

          <div className={styles.lowerContent}>
            <img src={tricorn?.url} className={styles.tricorn} />
            <div className={styles.textContent}>
              <p className={styles.blurb}>
                <SafelySetInnerHTML html={tune_in_blurb} />
              </p>
              <div className={styles.times}>
                {stream_times?.map((t, i) => (
                  <div className={styles.timeBlock} key={i}>
                    <p className={styles.time}>{t?.time?.title}</p>
                    <p className={styles.description}>
                      <SafelySetInnerHTML html={t?.time?.description} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type TuneInContentProps = {
  data?: BnetStackNebulaTuneInPage;
};

const TuneInContent: React.FC<TuneInContentProps> = (props) => {
  const { tune_in_thumbnail, stream_platforms, links_title } = props.data ?? {};

  return (
    <div className={styles.tuneIn}>
      <StreamingPlatforms platforms={stream_platforms} heading={links_title} />
      <ImageVideoThumb
        image={tune_in_thumbnail?.bg?.url}
        classes={{ imageContainer: styles.trailerThumb, image: styles.bg }}
        youtubeUrl={tune_in_thumbnail?.youtube_url}
      >
        <div className={styles.thumbContent}>{tune_in_thumbnail?.text}</div>
      </ImageVideoThumb>
      <MarketingOptInButton />
    </div>
  );
};

type ShowcaseContentProps = {
  data?: BnetStackNebulaTuneInPage;
};

const ShowcaseContent: React.FC<ShowcaseContentProps> = (props) => {
  const { stream_platforms, links_title, loc_streams, loc_streams_heading } =
    props.data ?? {};

  return (
    <div className={styles.showcase}>
      <StreamingPlatforms
        platforms={stream_platforms}
        heading={links_title}
        withCaptions
      />
      <p className={styles.locStreamsHeading}>{loc_streams_heading}</p>
      <div className={styles.locStreams}>
        {loc_streams?.map(({ loc_stream }, i) => (
          <>
            <a href={loc_stream?.url} key={i}>
              {loc_stream?.stream_locale}
            </a>
            {i !== loc_streams.length - 1 && <div className={styles.divider} />}
          </>
        ))}
      </div>
    </div>
  );
};

const StreamingPlatforms: React.FC<{
  platforms: BnetStackNebulaTuneInPage["stream_platforms"];
  heading: BnetStackNebulaTuneInPage["links_title"];
  withCaptions?: boolean;
}> = ({ platforms, heading, withCaptions }) => {
  return (
    <div className={styles.streamPlatforms}>
      <p className={styles.heading}>{heading}</p>
      <div className={styles.divider} />
      <div className={styles.streams}>
        {platforms?.map((p, i) => (
          <div key={i} className={styles.stream}>
            <a href={p?.platform?.url}>
              <img src={p?.platform?.logo?.url} className={styles.img} />
            </a>
            <p className={styles.blurb}>
              <SafelySetInnerHTML html={p?.platform?.locales} />
            </p>
            {withCaptions && (
              <div className={styles.streamCaption}>
                <SafelySetInnerHTML html={p?.platform?.locales} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NebulaTuneIn;
