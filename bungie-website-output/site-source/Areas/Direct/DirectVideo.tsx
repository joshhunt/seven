import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import * as React from "react";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import styles from "./DirectVideo.module.scss";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import YouTube, { Options } from "react-youtube";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";
import moment from "moment";
import classNames from "classnames";
import { DestinyNewsCallout } from "@Areas/Destiny/Shared/DestinyNewsCallout";

interface IDirectVideoRouterParams {
  videoContentId: string;
}

interface IDirectVideoProps
  extends RouteComponentProps<IDirectVideoRouterParams> {}

interface IDirectVideoState {
  contentRenderable: Content.ContentItemPublicContract;
}

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IContentItemProps} props
 * @returns
 */
class DirectVideoInternal extends React.Component<
  IDirectVideoProps,
  IDirectVideoState
> {
  constructor(props: IDirectVideoProps) {
    super(props);

    this.state = {
      contentRenderable: null,
    };
  }

  public componentDidMount() {
    Platform.ContentService.GetContentById(
      this.props.match.params.videoContentId,
      Localizer.CurrentCultureName,
      false
    ).then((response) =>
      this.setState({
        contentRenderable: response,
      })
    );
  }

  private goToLink(linkPath: string) {
    window.location.href = linkPath;
  }

  public render() {
    if (this.state.contentRenderable) {
      const content = this.state.contentRenderable.properties;
      const title = content.Title;
      const subtitle = content.Subtitle;
      const date = moment(content.PublicationDate, "MM.DD.YYYY");
      const dateString = Localizer.Format(Localizer.Time.MonthAbbrDayYear, {
        monthabbr: date.format("MMM"),
        day: date.format("D"),
        year: date.format("YYYY"),
      });
      const videoId = content.VideoId;
      const videoThumbnail = content.VideoThumbnail;
      const autoplay = content.AutoPlay === "true" ? 1 : 0;
      const description = (
        <div dangerouslySetInnerHTML={{ __html: content.Description }} />
      );
      const thumbnailOne = content.LinkThumbnailOne;
      const thumbnailOneTitle = content.LinkThumbnailOneTitle;
      const thumbnailOneSubtitle = content.LinkThumbnailOneSubtitle;
      const thumbnailOneLink = content.LinkThumbnailOneLink;
      const thumbnailTwo = content.LinkThumbnailTwo;
      const thumbnailTwoTitle = content.LinkThumbnailTwoTitle;
      const thumbnailTwoSubtitle = content.LinkThumbnailTwoSubtitle;
      const thumbnailTwoLink = content.LinkThumbnailTwoLink;

      const opts: Options = {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay,
        },
      };

      return (
        <>
          <BungieHelmet title={title} image={videoThumbnail}>
            <body
              className={classNames(
                SpecialBodyClasses(BodyClasses.HideServiceAlert),
                SpecialBodyClasses(BodyClasses.NoSpacer)
              )}
            />
          </BungieHelmet>
          <SpinnerContainer loading={this.state.contentRenderable === null}>
            <div className={styles.container}>
              <Grid isTextContainer={true}>
                <GridCol cols={12}>
                  <div className={styles.videoSection}>
                    {/* Title */}
                    <div className={styles.header}>
                      <div className={styles.underline} />
                      <h1 className={styles.pageTitle}>{title}</h1>
                      <p className={styles.pageSubtitle}>{subtitle}</p>
                      <div className={styles.date}>{dateString}</div>
                    </div>

                    {/* Video */}
                    <YouTube
                      containerClassName={styles.youtubeWrapper}
                      videoId={videoId}
                      opts={opts}
                    />

                    {/* Description */}
                    {description && (
                      <div className={styles.description}>{description}</div>
                    )}
                  </div>

                  {/* Links */}
                  {(thumbnailOne || thumbnailTwo) && (
                    <div className={styles.thumbnails}>
                      {thumbnailOne && (
                        <a
                          href={thumbnailOneLink}
                          style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(24,28,37,0) 0%, #181c25 100%),url(${thumbnailOne})`,
                          }}
                        >
                          <h3 className={styles.title}>{thumbnailOneTitle}</h3>
                          <p className={styles.subtitle}>
                            {thumbnailOneSubtitle}
                          </p>
                        </a>
                      )}
                      {thumbnailTwo && (
                        <a
                          href={thumbnailTwoLink}
                          style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(24,28,37,0) 0%, #181c25 100%),url(${thumbnailTwo})`,
                          }}
                        >
                          <h3 className={styles.title}>{thumbnailTwoTitle}</h3>
                          <p className={styles.subtitle}>
                            {thumbnailTwoSubtitle}
                          </p>
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
    } else {
      return null;
    }
  }
}

const DirectVideo = withRouter(DirectVideoInternal);

export default DirectVideo;
