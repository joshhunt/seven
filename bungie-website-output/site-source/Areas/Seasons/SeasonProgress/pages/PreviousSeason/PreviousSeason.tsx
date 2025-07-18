// Created by atseng, 2019
// Copyright Bungie, Inc.

import { SeasonsDefinitions } from "@Areas/Seasons/SeasonProgress/constants/SeasonsDefinitions";
import SeasonsUtilityPage from "@Areas/Seasons/SeasonsUtilityPage";
import * as React from "react";
import styles from "../../../SeasonsUtilityPage.module.scss";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";

// Required props
interface IPreviousSeasonProps extends GlobalStateComponentProps<any> {}

// Default props - these will have values set in PreviousSeason.defaultProps
interface DefaultProps {}

type Props = IPreviousSeasonProps & DefaultProps;

interface IPreviousSeasonState {}

/**
 * PreviousSeason - Page for the most recent Previous Season
 *  *
 * @param {IPreviousSeasonProps} props
 * @returns
 */
class PreviousSeason extends React.Component<Props, IPreviousSeasonState> {
  constructor(props: Props) {
    super(props);
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const previousSeasonHash =
      this.props.globalState.coreSettings.destiny2CoreSettings.pastSeasonHashes[
        this.props.globalState.coreSettings.destiny2CoreSettings
          .pastSeasonHashes.length - 1
      ] || 3612906877;

    const placeholder = "";

    const metaTitle = SeasonsDefinitions.previousSeason.title;
    const metaDesc = "";
    const metaImage = SeasonsDefinitions.previousSeason.image;

    return (
      <React.Fragment>
        <BungieHelmet
          title={metaTitle}
          description={placeholder}
          image={metaImage}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.wrapper}>
          <div
            className={styles.background}
            style={{
              backgroundImage: `url(${SeasonsDefinitions.previousSeason.progressPageImage})`,
            }}
          />
          <SeasonsUtilityPage seasonHash={previousSeasonHash} />
        </div>
      </React.Fragment>
    );
  }
}

export default withGlobalState(PreviousSeason, []);
