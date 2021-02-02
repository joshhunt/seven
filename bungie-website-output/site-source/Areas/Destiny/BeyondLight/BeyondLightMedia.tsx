// Created by atseng, 2020
// Copyright Bungie, Inc.

import {
  BeyondLightPhaseFourDataStore,
  BeyondLightPhaseFourDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseFourDataStore";
import {
  BeyondLightPhaseThreeDataStore,
  BeyondLightPhaseThreeDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseThreeDataStore";
import {
  BeyondLightPhaseTwoDataStore,
  BeyondLightPhaseTwoDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightPhaseTwoDataStore";
import {
  BeyondLightUpdateDataStore,
  BeyondLightUpdateDataStorePayload,
} from "@Areas/Destiny/BeyondLight/DataStores/BeyondLightUpdateDataStore";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import { Spinner } from "@UIKit/Controls/Spinner";
import * as React from "react";
import styles from "./BeyondLightMedia.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { DestinyNewsAndMedia } from "../Shared/DestinyNewsAndMedia";
import { Img } from "@Helpers";
import { Localizer } from "@Global/Localization/Localizer";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";

// Required props
interface IBeyondLightMediaProps {}

// Default props - these will have values set in BeyondLightMedia.defaultProps
interface DefaultProps {}

export type BeyondLightMediaProps = IBeyondLightMediaProps & DefaultProps;

interface IBeyondLightMediaState {
  BeyondLightUpdateData: BeyondLightUpdateDataStorePayload;
  BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStorePayload;
  BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStorePayload;
  BeyondLightPhaseFourData: BeyondLightPhaseFourDataStorePayload;
}

/**
 * Media - Replace this description
 *  *
 * @param {IMediaProps} props
 * @returns
 */
export default class BeyondLightMedia extends React.Component<
  IBeyondLightMediaProps,
  IBeyondLightMediaState
> {
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
  private readonly revealStreamVideoId = ConfigUtils.GetParameter(
    SystemNames.BeyondLightRevealStreamYoutube,
    Localizer.CurrentCultureName,
    ""
  );
  private readonly vidocVideoId = ConfigUtils.GetParameter(
    SystemNames.BeyondLightVidocYoutube,
    Localizer.CurrentCultureName,
    ""
  );

  constructor(props: IBeyondLightMediaProps) {
    super(props);

    this.state = {
      BeyondLightUpdateData: BeyondLightUpdateDataStore.state,
      BeyondLightPhaseTwoData: BeyondLightPhaseTwoDataStore.state,
      BeyondLightPhaseThreeData: BeyondLightPhaseThreeDataStore.state,
      BeyondLightPhaseFourData: BeyondLightPhaseFourDataStore.state,
    };
  }

  public static defaultProps: DefaultProps = {};

  private readonly destroys: DestroyCallback[] = [];

  public componentDidMount() {
    this.destroys.push(
      BeyondLightUpdateDataStore.observe((BeyondLightUpdateData) =>
        this.setState({ BeyondLightUpdateData })
      ),
      BeyondLightPhaseTwoDataStore.observe((BeyondLightPhaseTwoData) =>
        this.setState({ BeyondLightPhaseTwoData })
      ),
      BeyondLightPhaseThreeDataStore.observe((BeyondLightPhaseThreeData) =>
        this.setState({ BeyondLightPhaseThreeData })
      ),
      BeyondLightPhaseFourDataStore.observe((BeyondLightPhaseFourData) =>
        this.setState({ BeyondLightPhaseFourData })
      )
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d());
  }

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;
    const { homepage, phaseOne } = this.state.BeyondLightUpdateData;

    const { phaseTwo } = this.state.BeyondLightPhaseTwoData;

    const { phaseThree } = this.state.BeyondLightPhaseThreeData;

    const { phaseFour } = this.state.BeyondLightPhaseFourData;

    if (!this.state.BeyondLightUpdateData.loaded) {
      return <Spinner />;
    }

    return (
      <React.Fragment>
        <BungieHelmet
          title={beyondlightLoc.BeyondLight}
          description={beyondlightLoc.gobeyondDesc}
          image={
            "/7/ca/destiny/products/beyondlight/bungie_net_metadata_beyondlight_1920x1080.jpg"
          }
        >
          <body
            className={SpecialBodyClasses(
              BodyClasses.HideServiceAlert |
                BodyClasses.NoSpacer |
                BodyClasses.HideMainNav
            )}
          />
        </BungieHelmet>
        <div className={styles.mediaContainer}>
          <DestinyNewsAndMedia
            showNews={false}
            showAll={true}
            videos={[
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_1_thumbnail.jpg"
                ),
                detail: this.revealVideoId,
                title: beyondlightLoc.BeyondLightTeaserTrailer,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_2_thumbnail.jpg"
                ),
                detail: this.gameplayVideoId,
                title: beyondlightLoc.BeyondLightGameplayTrailer,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_3_thumbnail.jpg"
                ),
                detail: this.revealStreamVideoId,
                title: Localizer.Beyondlight.BeyondLightReveal,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_stasis_thumbnail.jpg"
                ),
                detail: phaseOne.heroTrailerButtonYoutubeLink,
                title: Localizer.Beyondlight.Submenu_Stasis,
              },
              {
                isVideo: true,
                thumbnail: phaseTwo.trailerThumbnail,
                detail: phaseTwo.heroTrailerButtonVideoId,
                title: Localizer.Beyondlight.Submenu_Europa,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_gear_thumbnail.jpg"
                ),
                detail: phaseThree.heroVideo,
                title: Localizer.Beyondlight.Submenu_Gear,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_story_thumbnail.jpg"
                ),
                detail: phaseFour.heroTrailerButtonVideoId,
                title: Localizer.Beyondlight.Submenu_Story,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_vidoc_thumbnail.jpg"
                ),
                detail: this.vidocVideoId,
                title: Localizer.Beyondlight.viDocForgedStorm,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_trailer_launch_thumbnail.jpg"
                ),
                detail: homepage.releaseTrailer,
                title: Localizer.Beyondlight.releaseTrailer,
              },
              {
                isVideo: true,
                thumbnail: Img(
                  "destiny/products/beyondlight/story_trailer_thumbnail.jpg"
                ),
                detail: phaseFour.sectionOneVideoId,
                title: Localizer.Beyondlight.storyRecap,
              },
            ]}
            wallpapers={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_1_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_1.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_2_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_2.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_3_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_3.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_4_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_4.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_5_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_5.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_6_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_6.png"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_wallpaper_7_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_wallpaper_7.png"
                ),
              },
            ]}
            screenshots={[
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_screenshot_3_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_screenshot_3.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_screenshot_4_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_screenshot_4.jpg"
                ),
              },
              {
                isVideo: false,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_screenshot_5_thumbnail.jpg"
                ),
                detail: Img(
                  "destiny/products/beyondlight/media_screenshot_5.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img(homepage.sectionFiveScreenshot1),
                thumbnail: Img(homepage.sectionFiveScreenshot1Thumb),
              },
              {
                isVideo: false,
                detail: Img(homepage.sectionFiveScreenshot2),
                thumbnail: Img(homepage.sectionFiveScreenshot2Thumb),
              },
              {
                isVideo: false,
                detail: Img(homepage.sectionFiveScreenshot3),
                thumbnail: Img(homepage.sectionFiveScreenshot3Thumb),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_stasis_1.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_stasis_1_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_stasis_2.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_stasis_2_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_stasis_3.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_stasis_3_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_stasis_4.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_stasis_4_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: phaseTwo.sectionTwoItemOneImage,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_europa_1_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: phaseTwo.sectionTwoItemTwoImage,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_europa_2_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: phaseTwo.sectionTwoItemThreeImage,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_europa_3_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: phaseTwo.sectionTwoItemFourImage,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_europa_4_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: phaseTwo.sectionTwoItemFiveImage,
                thumbnail: Img(
                  "destiny/products/beyondlight/media_europa_5_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_1.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_1_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_2.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_2_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_3.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_3_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_4.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_4_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_5.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_5_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_6.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_6_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_7.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_7_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_8.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_8_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_9.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_9_thumbnail.jpg"
                ),
              },
              {
                isVideo: false,
                detail: Img("destiny/products/beyondlight/media_gear_10.jpg"),
                thumbnail: Img(
                  "destiny/products/beyondlight/media_gear_10_thumbnail.jpg"
                ),
              },
            ]}
          />
        </div>
      </React.Fragment>
    );
  }
}
