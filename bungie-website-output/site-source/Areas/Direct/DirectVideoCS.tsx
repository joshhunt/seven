import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization/Localizer";
import { NotFoundError } from "@CustomErrors";
import { RendererLogLevel } from "@Enum";
import { Logger } from "@Global/Logger";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import YouTube from "react-youtube";
import { BnetStackDirectVideoLandingPage } from "../../Generated/contentstack-types";
import { ContentStackClient } from "../../Platform/ContentStack/ContentStackClient";
import styles from "./DirectVideo.module.scss";

interface DirectVideoRouteParams {
  title: string;
}

type onOff = 1 | 0;

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IContentItemProps} props
 * @returns
 */
const DirectVideoCS: React.FC = () => {
  const [data, setData] = useState<BnetStackDirectVideoLandingPage>(null);
  const [loaded, setLoaded] = useState(true);
  const params = useParams<DirectVideoRouteParams>();
  const videoPageUrl = `/${params.title}`;

  useEffect(() => {
    setLoaded(false);

    ContentStackClient()
      .ContentType("direct_video_landing_page")
      .Query()
      .where("url", videoPageUrl)
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .find()
      .then((res): void => {
        const matchingEntry = res[0][0];
        // Assume there's only one match because otherwise we have a URL collision
        if (!matchingEntry) {
          throw new NotFoundError();
        }

        setData(matchingEntry);
      })
      .catch((error: Error) => {
        Logger.logToServer(error, RendererLogLevel.Error);
      })
      .finally(() => setLoaded(true));
  }, []);

  const {
    title,
    subtitle,
    date_text,
    autoplay,
    description,
    thumbnail_links,
    video_thumbnail,
    youtube_video_id,
  } = data ?? {};

  if (!data) {
    return null;
  }

  const opts: any = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: autoplay ? 1 : (0 as onOff),
    },
  };

  const thumbOne = thumbnail_links[0]?.link_one;
  const thumbTwo = thumbnail_links[0]?.link_two;

  return (
    <>
      <BungieHelmet title={title} image={video_thumbnail.filename}>
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.HideServiceAlert),
            SpecialBodyClasses(BodyClasses.NoSpacer)
          )}
        />
      </BungieHelmet>
      <SpinnerContainer loading={!loaded}>
        <div className={styles.container}>
          <Grid isTextContainer={true}>
            <GridCol cols={12}>
              <div className={styles.videoSection}>
                {/* Title */}
                <div className={styles.header}>
                  <div className={styles.underline} />
                  <h1 className={styles.pageTitle}>{title}</h1>
                  <p className={styles.pageSubtitle}>{subtitle}</p>
                  <div className={styles.date}>{date_text}</div>
                </div>

                {/* Video */}
                <YouTube
                  className={styles.youtubeWrapper}
                  videoId={youtube_video_id}
                  opts={opts}
                />

                {/* Description */}
                {description && (
                  <div className={styles.description}>{description}</div>
                )}
              </div>

              {/* Links */}
              {(thumbOne || thumbTwo) && (
                <div className={styles.thumbnails}>
                  {thumbOne && (
                    <a
                      href={thumbOne.link.href}
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(24,28,37,0) 0%, #181c25 100%),url(${thumbOne.thumbnail?.url})`,
                      }}
                    >
                      <h3 className={styles.title}>{thumbOne?.title}</h3>
                      <p className={styles.subtitle}>{thumbOne?.subtitle}</p>
                    </a>
                  )}
                  {thumbTwo && (
                    <a
                      href={thumbTwo.link.href}
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(24,28,37,0) 0%, #181c25 100%),url(${thumbTwo.thumbnail?.url})`,
                      }}
                    >
                      <h3 className={styles.title}>{thumbTwo?.title}</h3>
                      <p className={styles.subtitle}>{thumbTwo?.subtitle}</p>
                    </a>
                  )}
                </div>
              )}
            </GridCol>
          </Grid>
        </div>
      </SpinnerContainer>
    </>
  );
};

export default DirectVideoCS;
