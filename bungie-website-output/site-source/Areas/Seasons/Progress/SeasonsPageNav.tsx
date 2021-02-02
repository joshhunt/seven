// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./SeasonsPageNav.module.scss";
import { World, Components } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@Global/Localization/Localizer";
import { Anchor } from "@UI/Navigation/Anchor";
import {
  withDestinyDefinitions,
  D2DatabaseComponentProps,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { DestinyDefinitions } from "@Definitions";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Icon } from "@UI/UIKit/Controls/Icon";
import classNames from "classnames";
import SeasonProgressUtils from "./SeasonProgressUtils";
import { BungieMembershipType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { UrlUtils } from "@Utilities/UrlUtils";

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
      isCurrentSeason:
        this.props.globalState.coreSettings.destiny2CoreSettings
          .currentSeasonHash === this.props.seasonHash,
    };
  }

  public componentDidMount() {
    const { destiny2CoreSettings } = this.props.globalState.coreSettings;
    const { definitions, platformProgression } = this.props;
    this.setState({
      unclaimedRewards: SeasonProgressUtils.getUnclaimedRewardsForPlatform(
        destiny2CoreSettings.pastSeasonHashes[
          destiny2CoreSettings.pastSeasonHashes.length - 1
        ],
        definitions,
        platformProgression
      ),
    });
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const { unclaimedRewards, isCurrentSeason } = this.state;

    const prevlink = (
      <div
        className={classNames(styles.previousSeasonAnchor, {
          [styles.showUnclaimed]: unclaimedRewards > 0,
        })}
      >
        <span className={styles.linkText}>
          {Localizer.Seasons.PreviousSeasonLink}
        </span>
        {unclaimedRewards > 0 && (
          <span className={styles.unclaimed}>
            <Icon iconType={"bungle"} iconName={"socialteamengram"} />{" "}
            {unclaimedRewards}
          </span>
        )}
      </div>
    );

    return (
      <div className={styles.seasonsPageTabs}>
        {UserUtils.isAuthenticated(this.props.globalState) && (
          <Anchor
            className={!isCurrentSeason ? styles.active : ``}
            url={RouteHelper.PreviousSeason()}
          >
            {prevlink}
          </Anchor>
        )}
        <Anchor
          className={isCurrentSeason ? styles.active : ``}
          url={RouteHelper.SeasonProgress()}
        >
          <span className={styles.linkText}>
            {Localizer.Seasons.CurrentSeasonLink}
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
