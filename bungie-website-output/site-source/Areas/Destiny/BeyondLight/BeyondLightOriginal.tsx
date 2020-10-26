// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLight.module.scss";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import classNames from "classnames";
import { BeyondLightNav } from "./BeyondLightNav";
import { Localizer } from "@Global/Localizer";
import { Img } from "@Helpers";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { BeyondLightProducts } from "./BeyondLightProducts";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";

// Required props
interface IBeyondLightPropsOriginal
  extends GlobalStateComponentProps<"responsive"> {}

// Default props - these will have values set in BeyondLight.defaultProps
interface DefaultProps {}

export type BeyondLightOriginalProps = IBeyondLightPropsOriginal & DefaultProps;

interface IBeyondLightState {
  transparentMode: boolean;
}

enum blockType {
  "centered",
  "sided",
}

/**
 * BeyondLight - Replace this description
 *  *
 * @param {IBeyondLightProps} props
 * @returns
 */
class BeyondLightOriginal extends React.Component<
  BeyondLightOriginalProps,
  IBeyondLightState
> {
  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};
  private readonly revealVideoId = ConfigUtils.GetParameter(
    SystemNames.BeyondLightRevealYoutube,
    Localizer.CurrentCultureName,
    ""
  );
  private readonly gameplayVideoId = ConfigUtils.GetParameter(
    SystemNames.BeyondLightGamePlayYoutube,
    Localizer.CurrentCultureName,
    ""
  );

  constructor(props: BeyondLightOriginalProps) {
    super(props);

    this.state = {
      transparentMode: true,
    };
  }

  public static defaultProps: DefaultProps = {};

  private isMedium(): boolean {
    // navigate to YouTube if the browser is in the 'medium' size or smaller
    return this.props.globalState.responsive.medium;
  }

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;

    const instant = <em>{beyondlightLoc.Instant}</em>;
    const preorderBonus = Localizer.FormatReact(
      beyondlightLoc.PreOrderNowToGetInstant,
      { instant: instant }
    );

    return (
      <React.Fragment>
        <BeyondLightNav idToElementsMapping={this.idToElementsMapping} />
        <div
          className={styles.beyondLightWrapper}
          id={"hero"}
          ref={(el) => (this.idToElementsMapping["hero"] = el)}
        >
          <div className={styles.hero}>
            <div className={styles.videoContainer}>
              <video
                playsInline={true}
                autoPlay={true}
                muted={true}
                loop={true}
                poster={
                  "/7/ca/destiny/products/beyondlight/bl_hero_video_FPO.jpg"
                }
              >
                <source
                  src={`/7/ca/destiny/products/beyondlight/d2_beyondlight_hero_video_h264.mp4`}
                  type="video/mp4"
                />
              </video>
            </div>
            <div className={styles.heroContent}>
              <h1
                className={styles.heroTitle}
                style={{
                  backgroundImage: `url(/7/ca/destiny/products/beyondlight/logo_${Localizer.CurrentCultureName}.png)`,
                }}
              >
                {beyondlightLoc.BeyondLight}
              </h1>
              <div className={styles.buttons}>
                {this.revealVideoId !== "" && (
                  <Button
                    buttonType={"white"}
                    onClick={() => this.showVideo(this.revealVideoId)}
                  >
                    {beyondlightLoc.WatchTheReveal}
                  </Button>
                )}

                <Button
                  buttonType={"blue"}
                  url={RouteHelper.DestinyBuyDetail({
                    productFamilyTag: "beyondlight",
                  })}
                >
                  {beyondlightLoc.PreOrder}
                </Button>
              </div>
              <div className={styles.subtitle}>
                <span>{beyondlightLoc.GoBeyondTheLight}</span>
                <span className={styles.releaseDate}>
                  {beyondlightLoc.September222020}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.preorderBonusWrapper}>
            <div className={styles.preorderBonus}>
              <div className={styles.preorderBonusContent}>
                <div className={styles.preorderBonusText}>
                  <p>{preorderBonus}</p>
                  <p>{beyondlightLoc.DigitalDeluxeOwnersAlso}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.gobeyond}
            id={"overview"}
            ref={(el) => (this.idToElementsMapping["overview"] = el)}
          >
            {this.contentBlock(
              beyondlightLoc.gobeyondTitle,
              beyondlightLoc.gobeyondDesc,
              blockType.centered
            )}
          </div>
          {this.gameplayVideoId !== "" && (
            <div className={styles.gameplayReveal}>
              <div className={styles.trailerContent}>
                <Button
                  className={styles.trailerButton}
                  onClick={() => this.showVideo(this.gameplayVideoId)}
                >
                  <div className={styles.trailerContainer}>
                    <video
                      playsInline={true}
                      autoPlay={true}
                      muted={true}
                      loop={true}
                      poster={
                        "/7/ca/destiny/products/beyondlight/bl_hero_video_FPO.jpg"
                      }
                    >
                      <source
                        src={`/7/ca/destiny/products/beyondlight/d2_beyondlight_gameplay_trailer_video_h264.mp4`}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                  <div className={styles.playButton} />
                  <p>{beyondlightLoc.BeyondLightGameplayTrailer}</p>
                </Button>
              </div>
            </div>
          )}

          <div
            id={"destination"}
            className={styles.europaAwaits}
            ref={(el) => (this.idToElementsMapping["destination"] = el)}
          >
            {this.contentBlock(
              beyondlightLoc.europaAwaitsTitle,
              beyondlightLoc.europaAwaitsDesc,
              blockType.centered
            )}
            <div className={styles.thumbnails}>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/beyondlight/europa_screenshot_1.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/products/beyondlight/europa_screenshot_1_thumbnail.jpg`
                  )}
                  alt=""
                  role="presentation"
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/beyondlight/europa_screenshot_2.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/products/beyondlight/europa_screenshot_2_thumbnail.jpg`
                  )}
                  alt=""
                  role="presentation"
                />
              </Button>
              <Button
                className={styles.thumbnail}
                onClick={() =>
                  this.showImage(
                    "destiny/products/beyondlight/europa_screenshot_3.jpg"
                  )
                }
              >
                <img
                  src={Img(
                    `destiny/products/beyondlight/europa_screenshot_3_thumbnail.jpg`
                  )}
                  alt=""
                  role="presentation"
                />
              </Button>
            </div>
          </div>
          <div
            id={"stasis"}
            className={styles.wieldTheDarkness}
            ref={(el) => (this.idToElementsMapping["stasis"] = el)}
          >
            {this.contentBlock(
              beyondlightLoc.wieldTheDarknessTitle,
              <React.Fragment>
                <strong>{beyondlightLoc.wieldTheDarknessDescStrong}</strong>
                {beyondlightLoc.wieldTheDarknessDesc}
              </React.Fragment>,
              blockType.sided
            )}
          </div>
          <div
            id={"gearrewards"}
            className={styles.gearsRewards}
            ref={(el) => (this.idToElementsMapping["gearrewards"] = el)}
          >
            {this.contentBlock(
              beyondlightLoc.gearsRewardsTitle,
              beyondlightLoc.gearsRewardsDesc,
              blockType.sided
            )}
          </div>
          <div
            id={"raid"}
            className={styles.deepStoneCrypt}
            ref={(el) => (this.idToElementsMapping["raid"] = el)}
          >
            {this.contentBlock(
              beyondlightLoc.deepStoneCryptTitle,
              beyondlightLoc.deepStoneCryptDesc,
              blockType.centered
            )}
          </div>
          <div
            id={"editions"}
            className={styles.preorder}
            ref={(el) => (this.idToElementsMapping["editions"] = el)}
          >
            {this.contentBlock(beyondlightLoc.Editions, "", blockType.centered)}
            <BeyondLightProducts globalState={this.props.globalState} />
          </div>
          <div className={styles.help}>
            <p>
              {beyondlightLoc.NeedAssistancePlayerSupport}
              <Anchor
                url={`/${Localizer.CurrentCultureName}/Help/Article/49007`}
              >
                {beyondlightLoc.BeyondLightGuide}
              </Anchor>
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }

  private contentBlock(
    title: React.ReactChild,
    desc: React.ReactChild,
    type: blockType
  ) {
    return (
      <div className={classNames(styles.contentBlock, styles[blockType[type]])}>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    );
  }

  private showImage(imageName: string) {
    Modal.open(
      <img
        src={Img(`/${imageName}`)}
        alt=""
        role="presentation"
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  }

  private showVideo(videoId: string) {
    if (this.isMedium()) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  }
}

export default withGlobalState(BeyondLightOriginal, ["responsive"]);
