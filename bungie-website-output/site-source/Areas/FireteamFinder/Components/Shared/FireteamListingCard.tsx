// Created by larobinson, 2023
// Copyright Bungie, Inc.

import { CreateTitleInput } from "@Areas/FireteamFinder/Components/Create/CreateTitleInput";
import { Detail } from "@Areas/FireteamFinder/Detail";
import { FireteamUtils } from "@Areas/FireteamFinder/Scripts/FireteamUtils";
import { Localizer } from "@bungie/localization/Localizer";
import {
  D2DatabaseComponentProps,
  withDestinyDefinitions,
} from "@Database/DestinyDefinitions/WithDestinyDefinitions";
import { FireteamFinder } from "@Platform";
import { FaMicrophone } from "@react-icons/all-files/fa/FaMicrophone";
import { FaMicrophoneSlash } from "@react-icons/all-files/fa/FaMicrophoneSlash";
import { FaRegCalendar } from "@react-icons/all-files/fa/FaRegCalendar";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import { IoPersonSharp } from "@react-icons/all-files/io5/IoPersonSharp";
import { RouteDefs } from "@Routes/RouteDefs";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { useHistory } from "react-router";
import styles from "./FireteamListingCard.module.scss";

interface FireteamListingCardProps
  extends D2DatabaseComponentProps<
    | "DestinyFireteamFinderActivityGraphDefinition"
    | "DestinyFireteamFinderLabelDefinition"
    | "DestinyFireteamFinderOptionDefinition"
  > {
  fireteam: FireteamFinder.DestinyFireteamFinderListing;
  linkToDetails?: boolean;
  onlineStatus?: number;
  largeActivityName?: boolean;
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

  const {
    id,
    lobbyId,
    owner,
    titleStringHashes,
    tagHashes,
    activity,
    players,
    clanId,
    scheduled,
    scheduledDateAndTime,
    applicationRequired,
    allowOfflinePlayers,
    platform,
    hasMic,
    isPublic,
    locale,
  } = fireteamDefinition ?? {};

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
  const history = useHistory();

  const dateFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const luxonDate = DateTime.fromISO(scheduledDateAndTime ?? "", {
    zone: "utc",
  });
  const dateString = luxonDate.toLocal().toLocaleString(dateFormat);

  const OnlineStatus = () => {
    return !scheduled ? (
      <div className={classNames(styles.inGame, styles.onlineStatus)}>
        {Localizer.fireteams.ingame}
      </div>
    ) : (
      <div className={styles.onlineStatus}>
        {scheduled && Localizer.fireteams.Scheduled}
      </div>
    );
  };

  const detailLink = RouteDefs.Areas.FireteamFinder.getAction(
    "Detail"
  ).resolve({ lobbyId: fireteamDefinition?.lobbyId }).url;

  const PlayerCount: React.FC = () => {
    return (
      <div className={classNames(styles.section, styles.players)}>
        <IoPersonSharp />
        <div>
          {players?.maxPlayerCount -
            fireteamDefinition?.players?.availableSlots}
        </div>
        <span>{"/"}</span>
        <div>{players?.maxPlayerCount}</div>
      </div>
    );
  };

  const CardHeader: React.FC = () => {
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
          <HiLockClosed />
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
          <OnlineStatus />
          {hasMic ? (
            <FaMicrophone className={styles.micIcon} />
          ) : (
            <FaMicrophoneSlash className={styles.micIcon} />
          )}
          <PlayerCount />
        </div>
      </div>
    );
  };

  const TitleAndTags: React.FC = () => {
    return (
      <div className={styles.tags}>
        <CreateTitleInput
          openTitleBuilderOnClick={false}
          titleStrings={titleStrings}
          placeholder={""}
          removeOnClick={false}
          className={styles.title}
          relevantActivitySetLabelHashes={[]}
        />
        {titleStrings?.length === 0 && (
          <div className={styles.defaultTitle}>
            {Localizer.fireteams.defaultTitle}
          </div>
        )}
        <div
          className={classNames(styles.tags, { [styles.noDate]: !scheduled })}
        >
          {tags.map((tag) => (
            <div key={tag} className={styles.tag}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DateAndTime: React.FC = () => {
    return (
      <div className={classNames(styles.dateAndTime, styles.section)}>
        <FaRegCalendar />
        <div className={styles.date}>{dateString}</div>
      </div>
    );
  };

  return (
    <div
      className={classNames(styles.card, styles.section)}
      onClick={() => UrlUtils.PushRedirect(detailLink, { history: history })}
    >
      <CardHeader />
      <TitleAndTags />
      {scheduled && <DateAndTime />}
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
