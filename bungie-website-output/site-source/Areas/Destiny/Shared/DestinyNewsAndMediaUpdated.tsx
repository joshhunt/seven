// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./DestinyNewsAndMediaUpdated.module.scss";

export type MediaTab = "lore" | "videos" | "screenshots" | "wallpapers";

export interface IDestinyNewsMediaUpdated {
  isVideo: boolean;
  thumbnail: string;
  /** If isVideo, assume detail is a youtubeId. Otherwise, assume it is a large image. */
  detail: string;
  isLore?: boolean;
  lorePath?: string;
  title?: string;
}

interface IDestinyNewsAndMediaUpdatedProps
  extends GlobalStateComponentProps<"responsive"> {
  defaultTab?: MediaTab;
  showNews?: boolean;
  news?: React.ReactNode;
  lore?: IDestinyNewsMediaUpdated[];
  videos?: IDestinyNewsMediaUpdated[];
  screenshots: IDestinyNewsMediaUpdated[];
  wallpapers: IDestinyNewsMediaUpdated[];
  titleIsSmall?: boolean;
  sectionTitleNews?: string;
  showAll?: boolean;
  smallSeasonText: string;
}

interface IDestinyNewsAndMediaState {
  selectedMediaTab: MediaTab;
  supportsWebp: boolean;
}

/**
 *
 * DestinyNewsAndMediaUpdated - The updated news and media section used on destiny product pages
 *  *
 * @param {IDestinyNewsAndMediaUpdatedProps} props
 * @returns
 */
class DestinyNewsAndMediaUpdatedInternal extends React.Component<
  IDestinyNewsAndMediaUpdatedProps,
  IDestinyNewsAndMediaState
> {
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  constructor(props: IDestinyNewsAndMediaUpdatedProps) {
    super(props);

    this.state = {
      selectedMediaTab: props.defaultTab || "videos",
      supportsWebp: false,
    };
  }

  public componentDidMount() {
    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );
  }

  private showImage(imageName: string) {
    Modal.open(<img src={imageName} className={styles.largeImage} />, {
      isFrameless: true,
    });
  }

  private showMedia(media: IDestinyNewsMediaUpdated) {
    if (media.isVideo) {
      this.showVideo(media.detail);
    } else {
      this.showImage(media.detail);
    }
  }

  private readonly openInNewTab = (imageName: string) => {
    window.open(imageName, "_blank'");
  };

  private readonly ext = (original: string) =>
    this.state.supportsWebp ? "webp" : original;

  private showVideo(videoId: string) {
    YoutubeModal.show({ videoId });
  }

  private goToLink(linkPath: string) {
    window.location.href = linkPath;
  }

  private selectMediaTab(tab: MediaTab) {
    this.setState({
      selectedMediaTab: tab,
    });
  }

  public render() {
    const { selectedMediaTab } = this.state;

    const { sectionTitleNews } = this.props;

    return (
      <React.Fragment>
        {/*{this.props.showNews &&*/}
        {/*<div id={"newsmedia"} ref={el => this.idToElementsMapping["newsmedia"] = el}>*/}
        {/*	<Section className={styles.sectionLatestNews}>*/}
        {/*		<TextContainer>*/}
        {/*			<SectionTitle>{sectionTitleNews}</SectionTitle>*/}
        {/*		</TextContainer>*/}
        {/*		<div className={styles.newsContainer}>*/}
        {/*			{this.props.news}*/}
        {/*		</div>*/}
        {/*	</Section>*/}
        {/*</div>*/}
        {/*}*/}

        {(this.props.videos ||
          this.props.lore ||
          this.props.screenshots ||
          this.props.wallpapers) && (
          <Section className={styles.sectionMedia}>
            {!this.props.showAll && (
              <TextContainer>
                <div className={styles.sectionTitlesWrapper}>
                  <SectionTitle isSmall={this.props.titleIsSmall || false}>
                    {Localizer.Destiny.Media}
                  </SectionTitle>
                  <div className={classNames(styles.smallSectionHeading)}>
                    <p>{this.props.smallSeasonText}</p>
                    <p>{Localizer.Destiny.Media}</p>
                  </div>
                </div>
                <div className={classNames(styles.tabs, styles.media)}>
                  {this.props.screenshots && (
                    <a
                      className={classNames(styles.mediaTab3, {
                        [styles.selected]: selectedMediaTab === "screenshots",
                      })}
                      onClick={() => this.selectMediaTab("screenshots")}
                    >
                      {Localizer.Shadowkeep.MediaTab3}
                    </a>
                  )}
                  {this.props.videos && (
                    <a
                      className={classNames(styles.mediaTab2, {
                        [styles.selected]: selectedMediaTab === "videos",
                      })}
                      onClick={() => this.selectMediaTab("videos")}
                    >
                      {Localizer.Destiny.Trailers}
                    </a>
                  )}
                  {this.props.lore && (
                    <a
                      className={classNames(styles.mediaTab1, {
                        [styles.selected]: selectedMediaTab === "lore",
                      })}
                      onClick={() => this.selectMediaTab("lore")}
                    >
                      {Localizer.Shadowkeep.MediaTab1}
                    </a>
                  )}
                  {this.props.wallpapers && (
                    <a
                      className={classNames(styles.mediaTab4, {
                        [styles.selected]: selectedMediaTab === "wallpapers",
                      })}
                      onClick={() => this.selectMediaTab("wallpapers")}
                    >
                      {Localizer.Destiny.Wallpapers}
                    </a>
                  )}
                </div>
              </TextContainer>
            )}
            {(selectedMediaTab === "videos" || this.props.showAll) && (
              <>
                {this.props.showAll && <h2>{Localizer.Beyondlight.videos}</h2>}
                <div className={classNames(styles.mediaContainer, styles.four)}>
                  {this.props.videos &&
                    this.props.videos.map((a, i) => (
                      <div key={i} className={styles.videoContainer}>
                        <MediaButton
                          isVideo={a.isVideo}
                          onClick={() => this.showMedia(a)}
                          thumbnail={a.thumbnail}
                          index={i}
                        />
                        <div className={styles.videoTitle}>{a.title}</div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {(selectedMediaTab === "lore" || this.props.showAll) && (
              <>
                {this.props.showAll && <h2>{Localizer.Beyondlight.lore}</h2>}
                <div className={classNames(styles.mediaContainer, styles.four)}>
                  {this.props.lore &&
                    this.props.lore.map((a, i) => (
                      <MediaButton
                        key={i}
                        isVideo={a.isVideo}
                        onClick={() => this.goToLink(a.lorePath)}
                        thumbnail={a.thumbnail}
                        index={i}
                      >
                        <p className={styles.loreTitle}>{a.title}</p>
                      </MediaButton>
                    ))}
                </div>
              </>
            )}
            {(selectedMediaTab === "screenshots" || this.props.showAll) && (
              <>
                {this.props.showAll && (
                  <h2>{Localizer.Beyondlight.screenshots}</h2>
                )}
                <div className={classNames(styles.mediaContainer, styles.four)}>
                  {this.props.screenshots &&
                    this.props.screenshots.map((a, i) => (
                      <MediaButton
                        key={i}
                        isVideo={a.isVideo}
                        onClick={() => this.showMedia(a)}
                        thumbnail={a.thumbnail}
                        index={i}
                      />
                    ))}
                </div>
              </>
            )}
            {(selectedMediaTab === "wallpapers" || this.props.showAll) && (
              <>
                {this.props.showAll && (
                  <h2>{Localizer.Beyondlight.Wallpapers4k}</h2>
                )}
                <div className={classNames(styles.mediaContainer, styles.four)}>
                  {this.props.wallpapers &&
                    this.props.wallpapers.map((a, i) => (
                      <MediaButton
                        key={i}
                        isVideo={a.isVideo}
                        onClick={() => this.openInNewTab(a.detail)}
                        thumbnail={a.thumbnail}
                        index={i}
                      />
                    ))}
                </div>
              </>
            )}
          </Section>
        )}
      </React.Fragment>
    );
  }
}

export const DestinyNewsAndMediaUpdated = withGlobalState(
  DestinyNewsAndMediaUpdatedInternal,
  ["responsive"]
);

interface IBasicDivProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

interface ISectionTitleProps extends IBasicDivProps {
  isSmall?: boolean;
}

const SectionTitle = (props: ISectionTitleProps) => {
  const { children, isSmall, ...rest } = props;

  return (
    <div
      className={classNames(styles.sectionTitle, { [styles.small]: isSmall })}
      {...rest}
    >
      {children}
    </div>
  );
};
const SmallTitle = (props: IBasicDivProps) => {
  return <div className={styles.smallTitle}>{props.children}</div>;
};

enum SectionAlignment {
  none,
  center,
  left,
}

interface ISectionProps extends IBasicDivProps {
  alignment?: SectionAlignment;
  bgs?: React.ReactNode;
}

const Section = (props: ISectionProps) => {
  const { alignment, bgs, children, className, ...rest } = props;

  const alignmentReal =
    alignment === undefined ? SectionAlignment.center : alignment;

  const sectionClasses = classNames(
    className,
    styles.section,
    styles[SectionAlignment[alignmentReal]]
  );

  return (
    <div className={sectionClasses} {...rest}>
      <div className={styles.bg}>{bgs}</div>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};
const TextContainer = (props: IBasicDivProps) => {
  return <div className={styles.sectionTextContent}>{props.children}</div>;
};

interface IMediaButtonProps {
  onClick: any;
  thumbnail: string;
  isVideo: boolean;
  isFourAcross?: boolean;
  index: number;
  children?: React.ReactNode;
}

const MediaButton = (props: IMediaButtonProps) => {
  const isFourthInRow = (props.index + 1) % 4 === 0;
  const isSecondInRow = (props.index + 1) % 2 === 0;
  const isEndOfRowThumbnail =
    (Responsive.state.mobile && isSecondInRow) ||
    (!Responsive.state.mobile && isFourthInRow);

  const buttonClasses = classNames(
    styles.thumbnail,
    props.isFourAcross ? styles.four : "",
    { [styles.rowEndThumbnail]: isEndOfRowThumbnail }
  );

  return (
    <div onClick={props.onClick} className={buttonClasses}>
      <img
        src={props.thumbnail}
        className={classNames(
          styles.mediaBg,
          props.isFourAcross ? styles.four : ""
        )}
      />
      {props.isVideo && <div className={styles.playButton} />}
      {props.children}
    </div>
  );
};
