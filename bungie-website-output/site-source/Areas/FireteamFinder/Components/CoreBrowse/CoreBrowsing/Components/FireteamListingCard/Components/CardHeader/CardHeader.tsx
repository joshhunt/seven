import React, { useMemo } from "react";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { FaMicrophone } from "@react-icons/all-files/fa/FaMicrophone";
import { FaMicrophoneSlash } from "@react-icons/all-files/fa/FaMicrophoneSlash";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import classNames from "classnames";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import PlayerCount from "../PlayerCount/PlayerCount";
import styles from "./CardHeader.module.scss";

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
}

const CardHeader: React.FC<FireteamListingCardProps> = (props) => {
  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const { activity, applicationRequired, hasMic } = fireteamDefinition ?? {};

  const isMicRequired = hasMic?.value === "1";
  const isApplicationRequired = applicationRequired?.value === "1";

  return (
    <div
      className={classNames(styles.cardHeader, styles.section)}
      style={{
        background: `linear-gradient(0deg, rgba(88, 88, 88, 0.80) 0%, rgba(88, 88, 88, 0.80) 100%), ${activity?.headerColor}`,
      }}
    >
      <div
        className={classNames(styles.activity, {
          [styles.largeActivityName]: props.largeActivityName,
        })}
      >
        {isApplicationRequired ? <HiLockClosed /> : null}
        <div
          className={classNames(styles.activityTitle, {
            [styles.largeActivityName]: props.largeActivityName,
          })}
        >
          {activity?.title}
        </div>
        {activity?.playerElectedDifficulty !== "" && (
          <div
            className={styles.playerElectedDifficulty}
          >{`(${activity?.playerElectedDifficulty})`}</div>
        )}
      </div>
      <div className={styles.section}>
        {isMicRequired ? (
          <FaMicrophone
            className={classNames(styles.baseIconPlacement, styles.micIcon)}
          />
        ) : (
          <FaMicrophoneSlash
            className={classNames(
              styles.baseIconPlacement,
              styles.micIconNotRequired
            )}
          />
        )}
        <PlayerCount {...props} />
      </div>
    </div>
  );
};

export default withDestinyDefinitions(CardHeader, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
