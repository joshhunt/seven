import { MarketingOptInButton } from "@UI/User/MarketingOptInButton";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { __ } from "@Utilities/LocalLocWorkaround";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styles from "./WorldsFirst.module.scss";

// *********************************
// $todo THIS SHOULD COME FROM FIREHOSE
// *********************************
const fetchDisallowList = () => {
  if (!ConfigUtils.EnvironmentIsLocal) {
    Modal.error(
      new Error(
        "Nobody converted the disallow list to be configurable in Firehose, so it's still hardcoded. Whenever someone does that, they can remove this error as well."
      )
    );
  }

  return new Promise<string[]>((resolve, reject) => {
    resolve(["purechill"]);
  });
};

// Polling function
const fetchUsers = async () => {
  let top9FilteredUsers: string[] = [];

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
    const usernames = data?.streams?.map((s) => s.channel.name);
    const filtered = usernames.filter((u) => !disallowList.includes(u));

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
  const liveTimeString = ConfigUtils.GetParameter(
    "DirectWorldsFirst",
    "WorldsFirstReleaseDateTime",
    ""
  );
  const liveTime = moment(liveTimeString);
  const now = moment();

  const isLive = now.isAfter(liveTime);

  return (
    <div className={styles.wrapper}>
      <Grid>
        <GridCol cols={12}>
          <h1 className={styles.sectionHeader}>{__("Raid World's First")}</h1>
        </GridCol>
      </Grid>
      {isLive ? <LiveRaidReveal /> : <PreReveal />}
    </div>
  );
};

/**
 * Shown if the time for the Raid is still in the future
 * @constructor
 */
const PreReveal = () => {
  return (
    <Grid>
      <GridCol cols={12}>
        <MarketingOptInButton />
      </GridCol>
    </Grid>
  );
};

/**
 * Shown if the time for the Raid is in the past
 * @constructor
 */
const LiveRaidReveal = () => {
  const [users, setUsers] = useState<string[]>(null);

  const doUserFetch = () => {
    fetchUsers().then(setUsers);
  };

  useEffect(() => {
    doUserFetch();

    // Fetch every minute
    setInterval(doUserFetch, 10 * 1000);
  }, []);

  if (users === null) {
    return <SpinnerContainer loading={true} />;
  }

  const limitedTo9 = users?.slice(0, 9);

  return (
    <Grid>
      {limitedTo9.map((username) => (
        <GridCol
          cols={4}
          large={6}
          mobile={12}
          key={username}
          className={styles.frame}
        >
          <iframe
            src={`https://player.twitch.tv/?channel=${username}&parent=${location.hostname}`}
            frameBorder="0"
            scrolling="false"
            allowFullScreen={true}
          />
          <div className={styles.buttonWrapper}>
            <Button
              buttonType={"text"}
              size={BasicSize.Small}
              url={`https://twitch.tv/${username}`}
            >
              {__(`${username} on Twitch`)}&nbsp;{" "}
              <Icon iconName={"external-link"} iconType={"fa"} />
            </Button>
          </div>
        </GridCol>
      ))}
    </Grid>
  );
};

export default WorldsFirst;
