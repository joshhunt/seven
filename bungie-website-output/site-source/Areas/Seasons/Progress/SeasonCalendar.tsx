// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonCalendar.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Platform } from "@Platform";
import { Localizer } from "@bungie/localization";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { SeasonsDefinitions, SeasonsArray } from "../SeasonsDefinitions";

// Required props
interface ISeasonCalendarProps
  extends GlobalStateComponentProps<any>,
    D2DatabaseComponentProps<"DestinySeasonDefinition"> {
  seasonHash?: number;
  seasonNumber?: number;
}

// Default props - these will have values set in SeasonCalendar.defaultProps
interface DefaultProps {}

type Props = ISeasonCalendarProps & DefaultProps;

interface ISeasonCalendarState {
  calendarImage: string;
  calendarBgImage: string;
}

/**
 * SeasonCalendar - Replace this description
 *  *
 * @param {ISeasonCalendarProps} props
 * @returns
 */
class SeasonCalendar extends React.Component<Props, ISeasonCalendarState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      calendarImage: "",
      calendarBgImage: "",
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    this.getCalendarImages();
  }

  public render() {
    const { calendarImage, calendarBgImage } = this.state;

    return (
      <React.Fragment>
        {this.state.calendarImage && (
          <div
            className={styles.calendarContainer}
            style={{ backgroundImage: `url(${calendarBgImage})` }}
          >
            <h2>{Localizer.Seasons.Calendar}</h2>
            <div
              className={styles.calendar}
              style={{ backgroundImage: `url(${calendarImage})` }}
              onClick={() => {
                Modal.open(
                  <img
                    src={this.state.calendarImage}
                    className={styles.largeImage}
                  />,
                  {
                    isFrameless: true,
                  }
                );
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  }

  private getCalendarImages() {
    let seasonNumber =
      typeof this.props.seasonNumber !== "undefined"
        ? this.props.seasonNumber
        : 0;
    const seasonHash =
      typeof this.props.seasonHash !== "undefined"
        ? this.props.seasonHash
        : this.props.globalState.coreSettings.destiny2CoreSettings
            .currentSeasonHash;

    if (seasonNumber === 0) {
      // grab the definition from coresettings using the seasonHash
      const seasonDef = this.props.definitions.DestinySeasonDefinition.get(
        seasonHash
      );
      seasonNumber = seasonDef.seasonNumber;
    }
    const seasonOnPage = SeasonsArray.find(
      (season) => season.seasonNumber === seasonNumber
    );
    this.setState({ calendarBgImage: seasonOnPage.calendarBackgroundImage });

    // this way of getting the calendar is obselete but to reduce work for loc, will leave this platform call up while season of dawn is previous season
    if (seasonNumber === 9) {
      Platform.ContentService.GetContentByTagAndType(
        `season${seasonNumber}calendar`,
        "StaticAsset",
        Localizer.CurrentCultureName,
        true
      ).then((response) =>
        this.setState({
          calendarImage: response.properties.Path,
        })
      );
    } else {
      Platform.ContentService.GetContentById(
        seasonOnPage.calendarContentItem,
        Localizer.CurrentCultureName,
        false
      ).then((response) =>
        this.setState({
          calendarImage: response.properties.LargeImage,
        })
      );
    }
  }
}

export default withGlobalState(
  withDestinyDefinitions(SeasonCalendar, {
    types: ["DestinySeasonDefinition"],
  }),
  ["responsive"]
);
