import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useHistory } from "react-router";
import styles from "./FireteamListingCard.module.scss";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import { TitleAndTags, CardHeader, DateAndTimeFooter } from "./Components";

interface FireteamListingCardProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  fireteam: FireteamFinder.DestinyFireteamFinderListing;
  lobbyStateOverride?: DestinyFireteamFinderLobbyState;
  linkToDetails?: boolean;
  showHover?: boolean;
  largeActivityName?: boolean;
  className?: string;
}

const FireteamListingCard: React.FC<FireteamListingCardProps> = (props) => {
  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const history = useHistory();

  const lobbyState = props.fireteam.lobbyState;
  //  Sometimes even when we request active lobbies specifically, we get back "unknown" (0) as the lobby state, but they do get sorted correctly in the UI so if it is under active we will assume it is active
  const isActive =
    lobbyState === DestinyFireteamFinderLobbyState?.Active ||
    props.lobbyStateOverride === DestinyFireteamFinderLobbyState?.Active;
  const detailLink = RouteDefs.Areas.FireteamFinder.getAction(
    "Detail"
  ).resolve({ lobbyId: fireteamDefinition?.lobbyId }).url;

  return (
    <div
      className={classNames(props.className, styles.card, styles.section, {
        [styles.showHover]: props.showHover,
      })}
      onClick={() => history.push(detailLink, { from: window.location.href })}
    >
      <CardHeader {...props} />
      <TitleAndTags {...props} />
      {isActive ? null : <DateAndTimeFooter {...props} />}
    </div>
  );
};

export default withDestinyDefinitions(FireteamListingCard, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
