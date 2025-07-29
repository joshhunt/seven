import React, { useMemo } from "react";
import { CreateTitleInput } from "@Areas/FireteamFinder/Components/Create/CreateTitleInput";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import { FireteamCreationTime } from "@Areas/FireteamFinder/Components/Shared/FireteamCreationTime";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import classNames from "classnames";
import { DestinyFireteamFinderLobbyState } from "@Enum";
import styles from "./TitleAndTags.module.scss";

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

const TitleAndTags: React.FC<FireteamListingCardProps> = (props) => {
  const fireteamsLoc = Localizer.Fireteams;
  const fireteamDefinition = useMemo(
    () =>
      FireteamUtils.getBnetFireteamDefinitionFromListing(
        props?.fireteam,
        props?.definitions?.DestinyFireteamFinderOptionDefinition,
        props?.definitions?.DestinyFireteamFinderActivityGraphDefinition
      ),
    [props.fireteam]
  );

  const { titleStringHashes, tagHashes, scheduled } = fireteamDefinition ?? {};

  const titleStrings = titleStringHashes?.map(
    (tsh) =>
      props?.definitions.DestinyFireteamFinderLabelDefinition.get(tsh)
        ?.displayProperties?.name
  );
  const tags = tagHashes?.map(
    (tsh) =>
      props?.definitions.DestinyFireteamFinderLabelDefinition.get(tsh)
        ?.displayProperties?.name
  );

  const lobbyState = props.fireteam.lobbyState;
  const isActive =
    lobbyState === DestinyFireteamFinderLobbyState?.Active ||
    props.lobbyStateOverride === DestinyFireteamFinderLobbyState?.Active;

  return (
    <div className={styles.tags}>
      <CreateTitleInput
        openTitleBuilderOnClick={false}
        titleStrings={titleStrings}
        placeholder={fireteamsLoc.defaultTitle}
        removeOnClick={false}
        className={styles.title}
        relevantActivitySetLabelHashes={[]}
      />
      <div
        className={classNames({
          [styles.tagContainer]: tags?.length > 0 || isActive,
          [styles.noDate]: !scheduled,
        })}
      >
        {tags?.length > 0 &&
          tags.map((tag) => (
            <div key={tag} className={styles.tag}>
              {tag}
            </div>
          ))}
        {isActive ? (
          <div className={classNames(styles.activeDuration)}>
            <FireteamCreationTime
              dateCreated={props.fireteam.createdDateTime}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default withDestinyDefinitions(TitleAndTags, {
  types: [
    "DestinyFireteamFinderOptionDefinition",
    "DestinyFireteamFinderLabelDefinition",
    "DestinyFireteamFinderConstantsDefinition",
    "DestinyFireteamFinderActivityGraphDefinition",
    "DestinyActivityGraphDefinition",
  ],
});
