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
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { TwoLineItem } from "@UI/UIKit/Companion/TwoLineItem";
import { SeasonsDefinitions } from "./SeasonsDefinitions";
import { Localizer } from "@Global/Localization/Localizer";

// Required props
interface ISeasonsProgressProps extends GlobalStateComponentProps<any> {}

// Default props - these will have values set in SeasonsProgress.defaultProps
interface DefaultProps {}

type Props = ISeasonsProgressProps & DefaultProps;

interface ISeasonsProgressState {}

/**
 * SeasonsProgress - Progress page for Seasons
 *  *
 * @param {ISeasonsProgressProps} props
 * @returns
 */
class SeasonsProgress extends React.Component<Props, ISeasonsProgressState> {
  constructor(props: Props) {
    super(props);
  }

  public static defaultProps: DefaultProps = {};

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
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default withGlobalState(SeasonsProgress, []);
