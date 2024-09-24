// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonsUtilityPages.module.scss";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import SeasonsUtilityPage from "./SeasonsUtilityPage";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { SeasonsDefinitions } from "./SeasonsDefinitions";

// Required props
interface ISeasonsProgressProps extends GlobalStateComponentProps<any> {}

/**
 * SeasonsProgress - Progress page for Seasons
 *  *
 * @param {ISeasonsProgressProps} props
 * @returns
 */
class SeasonsProgress extends React.Component<ISeasonsProgressProps, any> {
  public componentDidMount() {
    Toast.show(
      <TwoLineItem
        itemTitle={SeasonsDefinitions.currentSeason.title}
        itemSubtitle={SeasonsDefinitions.currentSeason.toastSubtitle}
        icon={
          <img
            src={SeasonsDefinitions.currentSeason.smallIcon}
            style={{ width: "3rem", height: "3rem" }}
          />
        }
      />,
      {
        position: "b",
        classes: {
          toast: styles.toast,
        },
        url: SeasonsDefinitions.currentSeason.productPageLink,
        type: "none",
      }
    );
  }

  public render() {
    const seasonHash = this.props.globalState.coreSettings.destiny2CoreSettings
      .currentSeasonHash;

    const metaTitle = SeasonsDefinitions.currentSeason.title;
    const metaDesc = SeasonsDefinitions.currentSeason.title;
    const metaImage = SeasonsDefinitions.currentSeason.image;

    return (
      <>
        <BungieHelmet
          title={metaTitle}
          description={metaDesc}
          image={metaImage}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.wrapper}>
          <div
            className={styles.background}
            style={{
              backgroundImage: `url(${SeasonsDefinitions.currentSeason.progressPageImage})`,
            }}
          />
          <SeasonsUtilityPage seasonHash={seasonHash} />
        </div>
      </>
    );
  }
}

export default withGlobalState(SeasonsProgress, []);
