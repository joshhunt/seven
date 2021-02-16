import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { Localizer } from "@Global/Localization/Localizer";
import { Img } from "@Helpers";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import styles from "./RaidRace.module.scss";

type TwitchUsers = { [key: string]: any }[];

const fetchDisallowList = async () => {
  let usernames: string[] = [];

  try {
    const sc = await Platform.ContentService.GetContentByTagAndType(
      "raid-race-filter-list",
      "StringCollection",
      Localizer.CurrentCultureName,
      false
    );

    const data = LocalizerUtils.stringCollectionToObject(sc);

    usernames = Object.keys(data).map((k) => k.toLowerCase());
  } catch (e) {
    // ignore
  }

  return usernames;
};

// Polling function
const fetchUsers = async () => {
  let top9FilteredUsers: TwitchUsers = [];

  try {
    const disallowList = await fetchDisallowList();

    const twitchResponse = await fetch(
      `https://api.twitch.tv/kraken/streams/?game=Destiny%202`,
      {
        headers: {
          "Client-ID": "g21b57iy7y50u7jjs9n7duw7nk6khn",
          Accept: "application/vnd.twitchtv.v5+json",
        },
      }
    );

    const data = await twitchResponse.json();
    const users = data?.streams as any[];

    const filtered = users.filter(
      (u) => !disallowList.includes(u.channel.name.toLowerCase())
    );

    // Limit to 9 users
    top9FilteredUsers = filtered.slice(0, 9);
  } catch (e) {
    Modal.error(new Error("Failed to fetch streamers"));
  }

  return top9FilteredUsers;
};

/**
 * Wrapper for Worlds First
 * @constructor
 */
const WorldsFirst: React.FC = () => {
  const enabled = ConfigUtils.SystemStatus("DirectWorldsFirst");
  if (!enabled) {
    return <Redirect to={RouteHelper.BeyondLight().url} />;
  }

  const liveTimeString = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    "WorldsFirstReleaseDateTime",
    ""
  );
  const liveTime = moment(liveTimeString);
  const now = moment();

  const isLive = now.isAfter(liveTime);

  const title = `${Localizer.Beyondlight.WatchTheRace} // ${Localizer.Beyondlight.RaidRaceLaunchDate}`;

  return (
    <div className={styles.wrapper}>
      <BungieHelmet
        title={title}
        image={Img("/destiny/bgs/raidrace/raid_race_bg_desktop.jpg")}
      >
        <body
          className={classNames(
            SpecialBodyClasses(BodyClasses.NoSpacer),
            styles.raidRace
          )}
        />
      </BungieHelmet>
      <div>
        <div className={styles.hero}>
          <div className={styles.heroTop}>
            <Anchor url={RouteHelper.BeyondLight()}>
              <img
                src={Img("/destiny/bgs/raidrace/beyond_light_horizontal.png")}
              />
            </Anchor>

            <div className={styles.heroTitle}>
              <h4>{Localizer.Beyondlight.AllNewRaid}</h4>
              <h1>{Localizer.Beyondlight.deepStoneCryptTitle}</h1>
            </div>
          </div>
        </div>

        {isLive && <LiveRaidReveal />}

        {!isLive && <PreReveal />}
      </div>
    </div>
  );
};

/**
 * Shown if the time for the Raid is still in the future
 * @constructor
 */
const PreReveal = () => {
  const locVideoId = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    `trailer_${Localizer.CurrentCultureName}`,
    ""
  );
  const enVideoId = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    `trailer_en`,
    ""
  );
  const videoId = locVideoId || enVideoId;
  const trailerEnabled = !StringUtils.isNullOrWhiteSpace(videoId);

  const onTrailerButtonClick = () => YoutubeModal.show({ videoId });

  const twitch = "Twitch";

  return (
    <Grid>
      <GridCol cols={12}>
        <div className={styles.revealDetails}>
          <div>{Localizer.Beyondlight.WatchTheRace}</div>
          <div className={styles.date}>
            {Localizer.Beyondlight.RaidRaceLaunchDate}
          </div>
        </div>
        <div className={styles.revealButtons}>
          {trailerEnabled && (
            <Button
              buttonType={"gold"}
              onClick={onTrailerButtonClick}
              className={styles.trailerButton}
            >
              {Localizer.Beyondlight.RaidRaceTrailerButtonLabel}
            </Button>
          )}
          <MarketingOptInButton />
        </div>
        <Anchor
          url={"https://www.twitch.tv/directory/game/Destiny%202"}
          className={styles.watchOnTwitch}
        >
          {Localizer.FormatReact(Localizer.Beyondlight.RaidRaceWatchTwitch, {
            twitchLogo: (
              <img
                src={Img("destiny/bgs/raidrace/twitch_logo.png")}
                alt={twitch}
              />
            ),
          })}
        </Anchor>
        <Anchor
          url={RouteHelper.DestinyBuyDetail({
            productFamilyTag: "BeyondLight",
          })}
        >
          <div className={styles.upsellContainer}>
            <div className={styles.upsell}>
              <div className={styles.textContent}>
                <div
                  className={styles.upsellTitle}
                  style={{
                    backgroundImage: `url("/7/ca/destiny/products/beyondlight/logo_${Localizer.CurrentCultureName}.png")`,
                  }}
                >
                  {Localizer.Beyondlight.BeyondLight}
                </div>
                <div className={styles.availableNow}>
                  {Localizer.Beyondlight.RaidRaceAvailableNow}
                </div>
              </div>
            </div>
          </div>
        </Anchor>
      </GridCol>
    </Grid>
  );
};

/**
 * Replace the items from the 1st array with new items in the 2nd array
 * @param existingOrderedUsers
 * @param newUsers
 */
const updateStreamerArray = (
  existingOrderedUsers: any[],
  newUsers: any[]
): TwitchUsers => {
  if (newUsers && !existingOrderedUsers) {
    return newUsers;
  }

  const novelUsers = newUsers.filter((u) => !existingOrderedUsers?.includes(u));
  const reduced = existingOrderedUsers?.reduce((acc, item, i) => {
    acc[i] = newUsers.includes(item) ? item : novelUsers.shift();

    return acc;
  }, []);

  return reduced;
};

/**
 * Shown if the time for the Raid is in the past
 * @constructor
 */
let interval = 0;
const LiveRaidReveal = () => {
  const [users, setUsers] = useState<TwitchUsers>(null);

  const intervalSeconds = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    "TwitchRefreshIntervalSeconds",
    60
  );

  const doUserFetch = () => {
    fetchUsers().then((rawUsers) => {
      const top9 = rawUsers.slice(0, 9);

      const sortedUsers = updateStreamerArray(users, top9);

      setUsers(sortedUsers);
    });
  };

  useEffect(() => {
    doUserFetch();

    clearInterval(interval);
    // Fetch every minute
    interval = setInterval(doUserFetch, intervalSeconds * 1000);
  }, []);

  if (users === null) {
    return <SpinnerContainer loading={true} />;
  }

  return (
    <Grid>
      <GridCol cols={12}>
        <div className={styles.scrollHeader}>
          {Localizer.Beyondlight.WatchTheRaceToWorldFirst}
          <DestinyArrows
            classes={{
              root: styles.arrows,
            }}
          />
        </div>
      </GridCol>
      {users?.map((user, i) => (
        <GridCol
          key={i}
          cols={4}
          large={6}
          mobile={12}
          className={styles.frame}
        >
          <TwitchFrame username={user.channel.name} />
        </GridCol>
      ))}
    </Grid>
  );
};

class TwitchFrame extends React.Component<{ username: string }> {
  public shouldComponentUpdate(
    nextProps: Readonly<{ username: string }>,
    nextState: Readonly<{}>,
    nextContext: any
  ): boolean {
    return nextProps.username !== this.props.username;
  }

  public render() {
    const { username } = this.props;

    return (
      <>
        <iframe
          title={username}
          src={`https://player.twitch.tv/?channel=${username}&parent=${location.hostname}&muted=true&autoplay=true`}
          frameBorder="0"
          scrolling="no"
          allowFullScreen={true}
        />

        <div className={styles.buttonWrapper}>
          <Button
            buttonType={"text"}
            size={BasicSize.Small}
            url={`https://twitch.tv/${username}`}
          >
            {username}&nbsp; <Icon iconName={"external-link"} iconType={"fa"} />
          </Button>
        </div>
      </>
    );
  }
}

export default WorldsFirst;
