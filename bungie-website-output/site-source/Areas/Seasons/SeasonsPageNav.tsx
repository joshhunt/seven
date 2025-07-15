// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonsPageNav.module.scss";
import { World, Components } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";
import {
  withDestinyDefinitions,
  D2DatabaseComponentProps,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { BungieMembershipType } from "@Enum";

// Required props
interface ISeasonsPageNavProps
  extends GlobalStateComponentProps<"loggedInUser">,
    D2DatabaseComponentProps<
      | "DestinyInventoryItemLiteDefinition"
      | "DestinySeasonDefinition"
      | "DestinySeasonPassDefinition"
      | "DestinyProgressionDefinition"
    > {
  seasonHash: number;
  platformProgression?: Components.DictionaryComponentResponseInt64DestinyCharacterProgressionComponent;
  characterProgressions?: { [key: number]: World.DestinyProgression };
  characterId?: string;
  membershipType?: BungieMembershipType;
}

// Default props - these will have values set in SeasonsPageNav.defaultProps
interface DefaultProps {}

type Props = ISeasonsPageNavProps & DefaultProps;

interface ISeasonsPageNavState {
  isCurrentSeason: boolean;
  unclaimedRewards: number;
}

/**
 * SeasonsPageNav - Replace this description
 *  *
 * @param {ISeasonsPageNavProps} props
 * @returns
 */
class SeasonsPageNav extends React.Component<Props, ISeasonsPageNavState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      unclaimedRewards: 0,
      isCurrentSeason: false,
    };
  }

  public componentDidMount() {}

  public static defaultProps: DefaultProps = {};

  public render() {
    const { isCurrentSeason } = this.state;

    return (
      <div className={styles.seasonsPageTabs}>
        <Anchor url={RouteHelper.SeasonProgress()}>
          <span className={styles.linkText}>
            {Localizer.Seasons.ViewCurrentSeason}
          </span>
        </Anchor>
      </div>
    );
  }
}

export default withGlobalState(
  withDestinyDefinitions(SeasonsPageNav, {
    types: [
      "DestinyInventoryItemLiteDefinition",
      "DestinySeasonDefinition",
      "DestinySeasonPassDefinition",
      "DestinyProgressionDefinition",
    ],
  }),
  ["loggedInUser"]
);
