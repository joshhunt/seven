import { DestinyNewsAndMedia } from "@Areas/Destiny/Shared/DestinyNewsAndMedia";
import { DestinyNewsCallout } from "@Areas/Destiny/Shared/DestinyNewsCallout";
import { Respond } from "@Boot/Respond";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { ResponsiveSize } from "@bungie/responsive";
import { NotFoundError } from "@CustomErrors";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Content, Platform } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { BuyButton, BuyButtonProps } from "@UI/UIKit/Controls/Button/BuyButton";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./EventPage.module.scss";

interface IContentItemProps extends GlobalStateComponentProps<"responsive"> {
  /** The Tag of the EventPage to display. Must specify. */
  eventTag: string;
}

interface IContentItemState {
  contentRenderable: Content.ContentItemPublicContract;
  heroScroll: IScrollViewportData;
  finishedFetching: boolean;
}

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IContentItemProps} props
 * @returns
 */
class EventPageInternal extends React.Component<
  IContentItemProps,
  IContentItemState
> {
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IContentItemProps) {
    super(props);

    this.state = {
      contentRenderable: null,
      heroScroll: {
        isVisible: false,
        percent: 0.47,
      },
      finishedFetching: false,
    };
  }

  public componentDidMount() {
    Platform.ContentService.GetContentByTagAndType(
      this.props.eventTag,
      "EventPage",
      Localizer.CurrentCultureName,
      true
    )
      .then((response) =>
        this.setState({
          contentRenderable: response,
        })
      )
      .finally(() => this.setState({ finishedFetching: true }));

    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  public render() {
    if (this.state.contentRenderable) {
      const content = this.state.contentRenderable.properties;
      const mobileSize = this.props.globalState.responsive.mobile;

      const heroBackground = mobileSize
        ? content.HeroBackgroundMobile
        : content.HeroBackgrounds?.length === 1
        ? content.HeroBackgrounds[0].Image
        : "";

      const heroBackgroundVideo = content.HeroBackgroundVideo;
      const CTABackground = mobileSize
        ? content.CTABackgroundMobile
        : content.CTABackgroundDesktop;
      const scrollPercent = this.state.heroScroll.percent;
      const useParallax = content.HeroBackgrounds.length > 1 && !mobileSize;
      const bannerBorderString = content.BannerBorderColor
        ? `4px solid ${content.BannerBorderColor}`
        : "";
      const heroButtonColor = content?.HeroButtonColor?.toLowerCase();

      const heroContent = (
        // See it wasn't supposed to have background videos, so when it does, we actually want the video
        // to take up the whole hero section and the center content to be absolutely positioned on top of it.
        <div
          className={classNames(styles.heroContent, {
            [styles.makeAbsolute]: heroBackgroundVideo,
          })}
          style={{ zIndex: 30 }}
        >
          {content.HeroVideoId && (
            <button
              className={styles.playButton}
              onClick={() => this.showVideo(content.HeroVideoId)}
            >
              <div className={styles.playCircle}>
                <div className={styles.playIcon} />
              </div>
            </button>
          )}
          <div
            className={styles.heroLogo}
            style={
              content.HeroLogo && {
                backgroundImage: `url(${content.HeroLogo})`,
              }
            }
          />

          {content.HeroSubtitle && (
            <div className={classNames(styles.date)}>
              {content.HeroSubtitle}
            </div>
          )}

          {content.HeroButtonLink && (
            <PotentialSkuButton
              className={styles.heroButton}
              size={BasicSize.Medium}
              buttonType={heroButtonColor}
              url={content.HeroButtonLink}
              sku={content.HeroButtonSku}
              sheen={0.2}
            >
              {content.HeroButtonLabel}
            </PotentialSkuButton>
          )}
        </div>
      );

      return (
        <SpinnerContainer loading={this.state.contentRenderable === null}>
          <div className={styles.body}>
            <BungieHelmet
              title={content.PageTitle}
              image={heroBackground || content.HeroBackgroundMobile}
            >
              <body
                className={SpecialBodyClasses(
                  BodyClasses.HideServiceAlert | BodyClasses.NoSpacer
                )}
              />
            </BungieHelmet>
            {!useParallax && (
              <div
                className={styles.hero}
                style={{ backgroundImage: `url(${heroBackground})` }}
                ref={this.heroRef}
              >
                {heroBackgroundVideo && (
                  <div className={styles.heroBackgroundVideo}>
                    <Respond
                      at={ResponsiveSize.mobile}
                      hide={true}
                      responsive={this.props.globalState.responsive}
                    >
                      <video autoPlay={true} muted={true} loop={true}>
                        <source src={heroBackgroundVideo} type="video/mp4" />
                      </video>
                    </Respond>
                  </div>
                )}
                {heroContent}
              </div>
            )}

            {useParallax && (
              <div
                className={classNames(styles.hero, styles.parallaxContainer)}
                ref={this.heroRef}
              >
                {heroContent}

                {content.HeroBackgrounds.map((bg: any, i: number) => {
                  return (
                    <ParallaxLayer
                      key={i}
                      layer={i}
                      backgroundImage={bg.Image}
                      scrollPercent={scrollPercent}
                      parallaxClasses={classNames(
                        styles.parallaxLayer,
                        styles[`parallaxLayer${i + 1}`]
                      )}
                    />
                  );
                })}
              </div>
            )}
            <div
              style={{
                backgroundColor: content.AccentColor,
                zIndex: 100,
                borderTop: bannerBorderString,
                backgroundImage: content.BannerBackground
                  ? content.BannerBackground
                  : "",
              }}
              className={styles.banner}
            >
              <p>{content.BannerText}</p>
            </div>

            <div>
              {content.ContentBlocks
                ? content.ContentBlocks.map((mcb: any, i: number) => {
                    const props = mcb.properties;

                    // pull the properties out of each media box
                    const threeMediaBoxes:
                      | any[]
                      | undefined = props.ThreeMediaBoxes?.map(
                      (box: any) => box.properties
                    );

                    // The mobile backgrounds need to be contain if we're at Tiny size,
                    // or if we're at mobile and the three boxes are present
                    const isThreeBoxMobile =
                      (threeMediaBoxes?.length ?? 0) > 0 &&
                      this.props.globalState.responsive.mobile;
                    const mobileBgIsContain =
                      isThreeBoxMobile ||
                      this.props.globalState.responsive.tiny;
                    const mobileBgSize = mobileBgIsContain
                      ? "contain"
                      : "cover";

                    const bgs = props.BackgroundVideoMp4 ? (
                      <Respond
                        at={ResponsiveSize.mobile}
                        hide={true}
                        responsive={this.props.globalState.responsive}
                      >
                        <video autoPlay={true} muted={true} loop={true}>
                          <source
                            src={props.BackgroundVideoMp4}
                            type="video/mp4"
                          />
                        </video>
                      </Respond>
                    ) : (
                      <div
                        style={{
                          backgroundImage: `url(${props.BackgroundDesktop})`,
                        }}
                      />
                    );
                    const hasSmallTitle =
                      props.SmallTitle && props.SmallTitle !== "";

                    return (
                      <MarketingContentBlock
                        key={i}
                        smallTitle={
                          hasSmallTitle && (
                            <div
                              dangerouslySetInnerHTML={sanitizeHTML(
                                props.SmallTitle
                              )}
                            />
                          )
                        }
                        sectionTitle={props.SectionTitle}
                        blurb={
                          <span
                            dangerouslySetInnerHTML={sanitizeHTML(props.Blurb)}
                          />
                        }
                        alignment={
                          this.props.globalState.responsive.mobile
                            ? "left"
                            : props.Alignment
                        }
                        bgs={bgs}
                        mobileBg={
                          <div
                            style={{
                              backgroundImage: `url(${props.BackgroundMobile})`,
                              backgroundSize: mobileBgSize,
                            }}
                          />
                        }
                        bgColor={props.BackgroundColor}
                        margin={this.makeMargin(props.Alignment)}
                        threeMediaBoxes={threeMediaBoxes || null}
                      />
                    );
                  })
                : null}
            </div>

            <div
              className={styles.CTA}
              style={
                CTABackground && { backgroundImage: `url(${CTABackground})` }
              }
            >
              {content.CTALogo && (
                <div
                  className={styles.CTALogo}
                  style={
                    content.CTALogo && {
                      backgroundImage: `url(${content.CTALogo})`,
                    }
                  }
                />
              )}
              {content.CTATitle && (
                <div className={styles.CTATitle}>{content.CTATitle}</div>
              )}
              <PotentialSkuButton
                className={styles.buyButton}
                buttonType={"gold"}
                url={content.CTAButtonURL}
                sku={content.CTAButtonSku}
                sheen={0.2}
              >
                {content.CTAButtonLabel}
              </PotentialSkuButton>
            </div>

            <DestinyNewsAndMedia
              sectionTitleNews={content.SectionNewsTitle}
              showNews={content.News}
              defaultTab={"screenshots"}
              news={
                content.News ? (
                  <div>
                    {content.News.map((n: any, i: number) => {
                      return (
                        <DestinyNewsCallout
                          key={i}
                          bgPath={n.BackgroundImage}
                          newsCalloutTitle={n.Title}
                          newsCalloutLink={n.Link}
                        />
                      );
                    })}
                  </div>
                ) : null
              }
              videos={
                content.Videos
                  ? content.Videos.map((v: any) => {
                      return {
                        isVideo: true,
                        thumbnail: v.Thumbnail,
                        detail: v.VideoId,
                      };
                    })
                  : null
              }
              wallpapers={
                content.Wallpapers
                  ? content.Wallpapers.map((w: any) => {
                      return {
                        isVideo: false,
                        thumbnail: w.Thumbnail,
                        detail: w.LargeImage,
                      };
                    })
                  : null
              }
              screenshots={
                content.Screenshots
                  ? content.Screenshots.map((s: any) => {
                      return {
                        isVideo: false,
                        thumbnail: s.Thumbnail,
                        detail: s.LargeImage,
                      };
                    })
                  : null
              }
            />
          </div>
        </SpinnerContainer>
      );
    } else {
      if (this.state.finishedFetching) {
        throw new NotFoundError();
      }

      return null;
    }
  }

  private readonly onScroll = () => {
    if (this.heroRef.current) {
      if (this.props.globalState.responsive.mobile) {
        return;
      }

      const heroPosition = this.heroRef.current.getBoundingClientRect();
      const heroScrollData = BrowserUtils.viewportElementScrollData(
        heroPosition
      );

      this.setState({
        heroScroll: heroScrollData,
      });
    }
  };

  private isMedium(): boolean {
    // navigate to YouTube if the browser is in the 'medium' size or smaller
    return this.props.globalState.responsive.medium;
  }

  private showVideo(videoId: string) {
    if (this.isMedium()) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  }

  private makeMargin(alignment: "left" | "right" | "center") {
    switch (alignment) {
      case "left":
        return this.props.globalState.responsive.mobile
          ? "27rem auto 0px"
          : "19rem auto 19rem 10%";
      case "right":
        return this.props.globalState.responsive.mobile
          ? "27rem auto 0px"
          : "19rem 10% 19rem auto";
      case "center":
        return this.props.globalState.responsive.mobile
          ? "27rem auto 0px"
          : "37rem auto 3rem";
    }
  }
}

interface IParallaxLayerProps {
  scrollPercent: number;
  layer: number;
  backgroundImage: string;
  parallaxClasses?: string;
}

const ParallaxLayer = (props: IParallaxLayerProps) => {
  let rate;
  let transform;
  let initialOffset;
  let zIndex = 1;

  const _getInitialOffset = (speed: number) => {
    return props.scrollPercent <= 0.47
      ? speed * 0.47
      : props.scrollPercent * speed;
  };

  if (props.layer === 0) {
    rate = -100;
    initialOffset = _getInitialOffset(rate);
    transform = `translateY(${props.scrollPercent * rate - initialOffset}px)`;
  } else if (props.layer === 1) {
    rate = -200;
    initialOffset = _getInitialOffset(rate);
    transform = `translateY(${props.scrollPercent * rate - initialOffset}px)`;
    zIndex = 8;
  } else {
    rate = 120;
    transform = `translateY(${props.scrollPercent * rate}px)`;
    zIndex = 10;
  }

  return (
    <img
      className={props.parallaxClasses ?? ""}
      src={props.backgroundImage}
      style={{
        transform: transform,
        zIndex: zIndex,
      }}
    />
  );
};

interface IPotentialSkuButtonProps extends BuyButtonProps {
  sku: string;
}

const PotentialSkuButton: React.FC<IPotentialSkuButtonProps> = (props) => {
  const skuConfig = useDataStore(DestinySkuConfigDataStore);

  const {
    sku,
    url,
    onClick,
    children,
    ...rest // Pass through the rest of the props as normal
  } = props;

  // These might change
  let fixedOnClick = onClick;
  let fixedUrl = url;

  if (sku) {
    // If we have a valid sku, replace the URL with the SKU selector modal
    const skuIsValid = DestinySkuUtils.productExists(sku, skuConfig);
    if (skuIsValid) {
      fixedUrl = undefined;
      fixedOnClick = () => {
        DestinySkuSelectorModal.show({
          skuTag: sku,
        });
      };
    }
  } else if (!url) {
    // If we don't have a URL or a valid SKU, just make the button do nothing
    fixedUrl = "#";
  }

  return (
    <BuyButton {...rest} url={fixedUrl} onClick={fixedOnClick}>
      {children}
    </BuyButton>
  );
};

export const EventPage = withGlobalState(EventPageInternal, ["responsive"]);
