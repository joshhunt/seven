// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { useDataStore } from "@bungie/datastore/DataStore";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import {
  ClickableMediaThumbnail,
  ClickableMediaThumbnailProps,
} from "@UI/Marketing/ClickableMediaThumbnail";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
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
  classes?: {
    tabBtn?: string;
    selectedTab?: string;
    sectionTitle?: string;
  };
}

interface IDestinyNewsAndMediaState {
  selectedMediaTab: MediaTab;
  supportsWebp: boolean;
  responsive: IResponsiveState;
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
  private readonly destroys: DestroyCallback[] = [];

  constructor(props: IDestinyNewsAndMediaUpdatedProps) {
    super(props);

    this.state = {
      selectedMediaTab: props.defaultTab || "videos",
      supportsWebp: false,
      responsive: Responsive.state,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
  }

  private showImage(imgIndex: number) {
    ImagePaginationModal.show({
      images: this.props.screenshots?.map((s) => s.detail) ?? [],
      imgIndex: imgIndex,
    });
  }

  private showMedia(media: IDestinyNewsMediaUpdated) {
    if (media.isVideo) {
      this.showVideo(media.detail);
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
                  <SectionTitle
                    className={this.props.classes?.sectionTitle}
                    isSmall={this.props.titleIsSmall || false}
                  >
                    {Localizer.Destiny.Media}
                  </SectionTitle>
                  {this.props.smallSeasonText && (
                    <div className={classNames(styles.smallSectionHeading)}>
                      <p>{this.props.smallSeasonText}</p>
                      <p>{Localizer.Destiny.Media}</p>
                    </div>
                  )}
                </div>
                <div className={classNames(styles.tabs, styles.media)}>
                  {this.props.screenshots && (
                    <a
                      className={classNames(
                        styles.mediaTab3,
                        this.props.classes?.tabBtn,
                        {
                          [this.props.classes?.selectedTab ?? styles.selected]:
                            selectedMediaTab === "screenshots",
                        }
                      )}
                      onClick={() => this.selectMediaTab("screenshots")}
                    >
                      {Localizer.Shadowkeep.MediaTab3}
                    </a>
                  )}
                  {this.props.videos && (
                    <a
                      className={classNames(
                        styles.mediaTab2,
                        this.props.classes?.tabBtn,
                        {
                          [this.props.classes?.selectedTab ?? styles.selected]:
                            selectedMediaTab === "videos",
                        }
                      )}
                      onClick={() => this.selectMediaTab("videos")}
                    >
                      {Localizer.Destiny.Trailers}
                    </a>
                  )}
                  {this.props.lore && (
                    <a
                      className={classNames(
                        styles.mediaTab1,
                        this.props.classes?.tabBtn,
                        {
                          [this.props.classes?.selectedTab ?? styles.selected]:
                            selectedMediaTab === "lore",
                        }
                      )}
                      onClick={() => this.selectMediaTab("lore")}
                    >
                      {Localizer.Shadowkeep.MediaTab1}
                    </a>
                  )}
                  {this.props.wallpapers && (
                    <a
                      className={classNames(
                        styles.mediaTab4,
                        this.props.classes?.tabBtn,
                        {
                          [this.props.classes?.selectedTab ?? styles.selected]:
                            selectedMediaTab === "wallpapers",
                        }
                      )}
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
                    this.props.videos.map((a, i) => {
                      // get position of thumbnail in flexbox row
                      const isFourthInRow = (i + 1) % 4 === 0;
                      const isSecondInRow = (i + 1) % 2 === 0;
                      // check if thumbnail is at end of current row in flexbox
                      const isEndOfRowThumbnail =
                        (this.state.responsive.mobile && isSecondInRow) ||
                        (!this.state.responsive.mobile && isFourthInRow);

                      return (
                        <div
                          key={i}
                          className={classNames(styles.videoContainer, {
                            [styles.rowEndThumbnail]: isEndOfRowThumbnail,
                          })}
                        >
                          <MediaButton
                            videoId={a.detail}
                            thumbnail={a.thumbnail}
                            index={i}
                          />
                        </div>
                      );
                    })}
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
                        singleOrAllScreenshots={this.props.screenshots?.map(
                          (s) => s.detail
                        )}
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
  className?: string;
}

const SectionTitle = (props: ISectionTitleProps) => {
  const { children, isSmall, className, ...rest } = props;

  return (
    <div
      className={classNames(
        styles.sectionTitle,
        { [styles.small]: isSmall },
        className
      )}
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

interface IMediaButtonProps extends ClickableMediaThumbnailProps {
  isFourAcross?: boolean;
  index: number;
  children?: React.ReactNode;
}

const MediaButton = (props: IMediaButtonProps) => {
  const { isFourAcross, index, children, classes, ...rest } = props;

  const responsive = useDataStore(Responsive);

  const isFourthInRow = (props.index + 1) % 4 === 0;
  const isSecondInRow = (props.index + 1) % 2 === 0;
  const isEndOfRowThumbnail =
    (responsive.mobile && isSecondInRow) ||
    (!responsive.mobile && isFourthInRow);

  const buttonClasses = classNames(
    styles.thumbnail,
    props.isFourAcross ? styles.four : "",
    { [styles.rowEndThumbnail]: isEndOfRowThumbnail }
  );

  return (
    <ClickableMediaThumbnail
      classes={{ btnWrapper: buttonClasses }}
      screenshotIndex={index}
      {...rest}
    >
      {props.children}
    </ClickableMediaThumbnail>
  );
};
