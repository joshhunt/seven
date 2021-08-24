// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonHeader.module.scss";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { Localizer } from "@bungie/localization";
import { SeasonsArray } from "../SeasonsDefinitions";
import moment from "moment";

// Required props
interface ISeasonHeaderProps
  extends D2DatabaseComponentProps<
    | "DestinyInventoryItemLiteDefinition"
    | "DestinySeasonDefinition"
    | "DestinySeasonPassDefinition"
    | "DestinyProgressionDefinition"
  > {}

// Default props - these will have values set in SeasonHeader.defaultProps
interface DefaultProps {
  seasonHash: number;
}

type Props = ISeasonHeaderProps & DefaultProps;

interface ISeasonHeaderState {}

/**
 * SeasonHeader - Replace this description
 *  *
 * @param {ISeasonHeaderProps} props
 * @returns
 */
class SeasonHeader extends React.Component<Props, ISeasonHeaderState> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { definitions, seasonHash } = this.props;

    const seasonDetailsButton = Localizer.Seasons.SeasonDetails;

    const seasonDef = definitions.DestinySeasonDefinition.get(seasonHash);

    const seasonOnPage = SeasonsArray.find(
      (season) => season.seasonNumber === seasonDef.seasonNumber
    );

    const timeDisplay = moment(
      seasonDef.endDate,
      undefined,
      Localizer.CurrentCultureName
    ).locale(Localizer.CurrentCultureName);

    const diff = moment(seasonDef.endDate).diff(moment.now());

    const remaining =
      diff > 0
        ? Localizer.Format(Localizer.Seasons.TimeRemaining, {
            time: timeDisplay.fromNow(true),
          })
        : Localizer.Seasons.SeasonComplete;

    return (
      <div className={styles.seasonHeader}>
        <h2>{seasonOnPage.title}</h2>
        <p>{remaining}</p>
      </div>
    );
  }
}

export default withDestinyDefinitions(SeasonHeader, {
  types: [
    "DestinyInventoryItemLiteDefinition",
    "DestinySeasonDefinition",
    "DestinySeasonPassDefinition",
    "DestinyProgressionDefinition",
  ],
});
