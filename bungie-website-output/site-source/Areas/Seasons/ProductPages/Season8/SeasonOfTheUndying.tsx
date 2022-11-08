// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import { Respond } from "@Boot/Respond";
import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import { ResponsiveSize } from "@bungie/responsive";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { SeasonCarousel } from "@UI/Destiny/SeasonCarousel";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { MarketingBoxContainer } from "@UI/Marketing/MarketingBoxContainer";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { MarketingContentBlock } from "@UI/UIKit/Layout/MarketingContentBlock";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BrowserUtils, IScrollViewportData } from "@Utilities/BrowserUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import * as React from "react";
import { SeasonsDefinitions } from "../../SeasonsDefinitions";
import styles from "./SeasonOfTheUndying.module.scss";

interface ISeasonOfTheUndyingProps
  extends GlobalStateComponentProps<"responsive" | "loggedInUser"> {}

interface ISeasonOfTheUndyingState {
  supportsWebp: boolean;
  menuLocked: boolean;
  responsive: IResponsiveState;
  rewardPage: number;
  artifactParallaxScroll: IScrollViewportData;
}

/**
 * Seasons' Index Page
 *  *
 * @param {ISeasonOfTheUndyingProps} props
 * @returns
 */
class SeasonOfTheUndyingInternal extends React.Component<
  ISeasonOfTheUndyingProps,
  ISeasonOfTheUndyingState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();
  private readonly artifactParallaxRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  constructor(props: ISeasonOfTheUndyingProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
      supportsWebp: false,
      menuLocked: false,
      rewardPage: 0,
      artifactParallaxScroll: {
        isVisible: false,
        percent: 0,
      },
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );

    window.addEventListener("scroll", this.onScroll);

    BrowserUtils.supportsWebp().then((supportsWebp) =>
      this.setState({ supportsWebp })
    );
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);

    DataStore.destroyAll(...this.destroys);
  }

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });
  };

  private readonly onScroll = () => {
    if (this.props.globalState.responsive.mobile) {
      return;
    }
    const artifactPosition = this.artifactParallaxRef.current.getBoundingClientRect();
    const artifactParallaxScrollData = BrowserUtils.viewportElementScrollData(
      artifactPosition
    );

    this.setState({
      artifactParallaxScroll: artifactParallaxScrollData,
    });
  };

  private readonly ext = (original: string) =>
    this.state.supportsWebp ? "webp" : original;

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

  private showImage(imageName: string) {
    Modal.open(
      <img
        src={Img(`destiny/bgs/${imageName}`)}
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

  public render() {
    const seasonsEnabled = ConfigUtils.SystemStatus("CoreAreaSeasons");
    const faq = ConfigUtils.GetParameter("CoreAreaSeasons", "D2SeasonsFAQ", 0);
    const asd = this.state.artifactParallaxScroll;
    const seasonUndyingVideoId = ConfigUtils.GetParameter(
      SystemNames.SeasonUndyingVideo,
      Localizer.CurrentCultureName,
      ""
    );

    const vexOffensiveBoxes = (
      <MarketingBoxContainer
        boxes={[
          {
            title: Localizer.Seasons.VexOffensiveBox1Title,
            content: Localizer.Seasons.VexOffensiveContentBox1,
          },
          {
            title: Localizer.Seasons.VexOffensiveBox2Title,
            content: Localizer.Seasons.VexOffensiveContentBox2,
          },
          {
            title: Localizer.Seasons.VexOffensiveBox3Title,
            content: Localizer.Seasons.VexOffensiveContentBox3,
          },
        ]}
        borderColor="#628078"
        backgroundColor="#28302E"
        titleColor="rgb(245, 245, 245)"
        textColor="rgb(245, 245, 245)"
      />
    );

    const rankRowKeys = [...Array(10).keys()];
    const rankRows = rankRowKeys.map((i) => {
      const rank = i + 1;

      return (
        <div
          key={rank}
          className={classNames(styles.rankRow, styles[`rankRow${rank}`])}
        />
      );
    });

    const mobileRankRowKeys = [...Array(20).keys()];
    const mobileRankRows = mobileRankRowKeys.map((i) => {
      const rank = i + 1;

      return (
        <div
          key={rank}
          className={classNames(
            styles.mobileRankRow,
            styles[`mobileRankRow${rank}`]
          )}
        />
      );
    });

    return (
      <React.Fragment>
        <BungieHelmet
          title={SeasonsDefinitions.seasonOfTheUndying.title}
          image={SeasonsDefinitions.seasonOfTheUndying.image}
        >
          <body className={SpecialBodyClasses(BodyClasses.HideServiceAlert)} />
        </BungieHelmet>
        <div className={styles.hero} ref={this.heroRef}>
          <button
            className={styles.playButton}
            onClick={() => this.showVideo(seasonUndyingVideoId)}
          >
            <div className={styles.playCircle}>
              <div className={styles.playIcon} />
            </div>
          </button>
          <div
            className={styles.heroLogo}
            style={{
              backgroundImage: `url("7/ca/destiny/bgs/seasons/hero_logo_${Localizer.CurrentCultureName}.png")`,
            }}
          />

          <div className={styles.date}>
            {Localizer.Seasons.UndyingDateRange}
          </div>
        </div>

        <MarketingSubNav
          onChange={this.onMenuLock}
          ids={Object.keys(this.idToElementsMapping)}
          renderLabel={(id) => Localizer.Destiny[`Submenu_${id}`]}
          buttonProps={
            this.state.responsive.mobile && {
              children: Localizer.Seasons.MenuCTALabel,
              url: RouteHelper.DestinyBuy(),
              buttonType: "teal",
            }
          }
          primaryColor={"ash"}
          accentColor={"teal"}
        />

        <div
          id={"story"}
          ref={(el) => (this.idToElementsMapping["story"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Seasons.StoryAndActivitiesSmallTitle}
            sectionTitle={Localizer.Seasons.StoryAndActivitiesSectionTitle2}
            blurb={Localizer.Seasons.VexInvasionBlurb}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/vex_invasions_bg.jpg"
                  )})`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/mobile/vex_invasions_mobile_bg.jpg"
                  )})`,
                }}
              />
            }
            bgColor={"#14171A"}
            margin={"41rem auto 2rem"}
          />

          <MarketingContentBlock
            smallTitle={Localizer.Seasons.StoryAndActivitiesSmallTitle}
            sectionTitle={Localizer.Seasons.StoryAndActivitiesSectionTitle3}
            callout={<SeasonPassMarker shortString={false} />}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/vex_offensive_bg.jpg"
                  )})`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/mobile/vex_offensive_mobile_bg.jpg"
                  )})`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"#0F1311"}
            margin={"33rem auto 2rem"}
          >
            {vexOffensiveBoxes}
          </MarketingContentBlock>
        </div>

        <div
          id={"artifact"}
          ref={(el) => (this.idToElementsMapping["artifact"] = el)}
        >
          <MarketingContentBlock
            smallTitle={Localizer.Seasons.ArtifactSmallTitle}
            sectionTitle={Localizer.Seasons.ArtifactSectionTitle}
            callout={
              <div style={{ fontStyle: "italic", lineHeight: "2rem" }}>
                {Localizer.Seasons.ArtifactItalicCallout}
              </div>
            }
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                className={styles.artifactParallax}
                ref={this.artifactParallaxRef}
              >
                <Respond
                  at={ResponsiveSize.mobile}
                  hide={true}
                  responsive={this.props.globalState.responsive}
                >
                  <div className={styles.artifactBg} />
                  <div
                    className={styles.mods}
                    style={{ transform: `translateY(${asd.percent * 50}px)` }}
                  />
                  <div
                    className={styles.eye}
                    style={{ transform: `translateY(${asd.percent * 170}px)` }}
                  />
                </Respond>
              </div>
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/mobile/artifact_mobile_bg.jpg"
                  )})`,
                  backgroundSize: "cover",
                }}
              />
            }
            bgColor={"#141A24"}
            margin={"40rem auto 2rem"}
            blurb={Localizer.Seasons.ArtifactBlurb}
          />
        </div>

        <div id={"gear"} ref={(el) => (this.idToElementsMapping["gear"] = el)}>
          <MarketingContentBlock
            smallTitle={Localizer.Seasons.GearSmallTitle}
            sectionTitle={Localizer.Seasons.GearSectionTitle}
            alignment={this.state.responsive.mobile ? "left" : "center"}
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "/destiny/bgs/seasons/undying_desktop_bg.jpg"
                  )})`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/mobile/undying_mobile_bg.jpg"
                  )})`,
                  backgroundSize: "contain",
                }}
              />
            }
            bgColor={"rgb(10, 26, 31)"}
            margin={"37rem auto 2rem"}
          >
            <div className={styles.greenRewardsBox}>
              <h3>{Localizer.Seasons.RewardsBoxTitle}</h3>
              <p>{Localizer.Seasons.RewardsBoxText}</p>
            </div>
            <div className={classNames(styles.gear, styles.itemContainer)}>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("/shadowkeep/season_1.jpg")}
                >
                  <img
                    src={Img(
                      `destiny/bgs/shadowkeep/season_thumbnail_1.${this.ext(
                        "jpg"
                      )}`
                    )}
                    className={styles.mediaBg}
                  />
                </Button>
                <p className={styles.itemName}>
                  {Localizer.Seasons.ArtifactItalicCallout}
                </p>
              </div>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("/seasons/gear_2.jpg")}
                >
                  <img
                    src={Img("destiny/bgs/seasons/gear_thumbnail_2.jpg")}
                    className={styles.mediaBg}
                  />
                </Button>
                <SeasonPassMarker
                  className={styles.itemName}
                  shortString={true}
                />
              </div>
              <div className={styles.flexContainer}>
                <Button
                  className={styles.thumbnail}
                  onClick={() => this.showImage("shadowkeep/season_3.jpg")}
                >
                  <img
                    src={Img(
                      `destiny/bgs/shadowkeep/season_thumbnail_3.${this.ext(
                        "jpg"
                      )}`
                    )}
                    className={styles.mediaBg}
                  />
                </Button>
                <SeasonPassMarker
                  className={styles.itemName}
                  shortString={true}
                />
              </div>
            </div>
          </MarketingContentBlock>
        </div>

        <div
          id={"rewards"}
          ref={(el) => (this.idToElementsMapping["rewards"] = el)}
        >
          <MarketingContentBlock
            smallTitle={null}
            sectionTitle={Localizer.Seasons.SeasonDetailSectionTitle1}
            alignment={"centerTop"}
            bgs={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/rewards_bg.jpg"
                  )})`,
                }}
              />
            }
            mobileBg={
              <div
                style={{
                  backgroundImage: `url(${Img(
                    "destiny/bgs/seasons/mobile/buy_mobile_bg.jpg"
                  )})`,
                  backgroundSize: "cover",
                }}
              />
            }
            margin={"14rem auto 0"}
            bgColor={"rgb(3,12,11)"}
          >
            <div className={styles.carouselContainer}>
              <SeasonCarousel
                showProgress={false}
                topLabel={
                  <p className={styles.carouselText}>
                    {Localizer.Seasons.FreeSeasonalRewards}
                  </p>
                }
                bottomLabel={
                  <p className={styles.carouselText}>
                    {Localizer.Seasons.SeasonPassRewards}
                  </p>
                }
              >
                {this.state.responsive.mobile ? mobileRankRows : rankRows}
              </SeasonCarousel>
            </div>

            <h1 className={styles.rewardsTitle}>
              {Localizer.Seasons.RewardsHeader}
            </h1>
            <div className={styles.rewardsContainer}>
              <div className={styles.rewardsLists}>
                <div className={styles.passRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage: `url(${Img(
                        "/destiny/bgs/seasons/vex_corner.png"
                      )})`,
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasons.SeasonPassRewardTitle}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={sanitizeHTML(
                      Localizer.Seasons.SeasonPassRewardList
                    )}
                  />
                </div>
                <div className={styles.freeRewardsList}>
                  <div
                    className={styles.cornerIcon}
                    style={{
                      backgroundImage: `url(${Img(
                        "/destiny/bgs/seasons/d2_corner.png"
                      )})`,
                    }}
                  />
                  <h2 className={styles.rewardsSmallTitle}>
                    {Localizer.Seasons.ArtifactItalicCallout}
                  </h2>
                  <ul
                    dangerouslySetInnerHTML={sanitizeHTML(
                      Localizer.Seasons.AllPlayersRewardList
                    )}
                  />
                </div>
              </div>
            </div>

            <div className={styles.buttonSection}>
              <BuyButton
                className={styles.buyButton}
                buttonType={"teal"}
                url={RouteHelper.DestinyBuy()}
                sheen={0}
              >
                {Localizer.Seasons.MenuCTALabel}
              </BuyButton>
            </div>
          </MarketingContentBlock>
        </div>

        <div id={"FAQ"} ref={(el) => (this.idToElementsMapping["FAQ"] = el)}>
          <Grid isTextContainer={true}>
            <GridCol cols={12} className={styles.FAQ}>
              <div className={styles.largeHeader}>
                {Localizer.Seasons.FAQTitle}
              </div>
              {seasonsEnabled && (
                <InnerErrorBoundary>
                  <InfoBlock articleId={Number(faq)} ignoreStyles={true} />
                </InnerErrorBoundary>
              )}
              <div
                className={styles.calendar}
                style={{
                  backgroundImage: `url("7/ca/destiny/bgs/seasons/Destiny_Calendar_${Localizer.CurrentCultureName}.png")`,
                }}
                onClick={() => {
                  this.showImage(
                    `/seasons/Destiny_Calendar_${Localizer.CurrentCultureName}.png`
                  );
                }}
              />
              <div className={styles.buttonSection}>
                <Button
                  className={styles.seasonsButtonMore}
                  url={RouteHelper.NewsArticle({ articleUrl: "48105" })}
                  buttonType="teal"
                >
                  {Localizer.Seasons.SeasonsButtonMore}
                </Button>
              </div>
            </GridCol>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

interface ISeasonPassMarkerProps {
  className?: string;
  shortString: boolean;
}

const SeasonPassMarker = (props: ISeasonPassMarkerProps) => {
  return (
    <div className={classNames(styles.seasonPassMarker, props.className)}>
      <i
        className={
          props.shortString ? styles.vexHeadIconSmall : styles.vexHeadIcon
        }
      />
      {props.shortString
        ? Localizer.Seasons.ShortSeasonPassMarker
        : Localizer.Seasons.SeasonPassMarker}
    </div>
  );
};

export default withGlobalState(SeasonOfTheUndyingInternal, [
  "responsive",
  "loggedInUser",
]);
