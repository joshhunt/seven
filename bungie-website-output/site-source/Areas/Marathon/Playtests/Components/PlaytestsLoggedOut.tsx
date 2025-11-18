import * as React from "react";
import { BungieCredentialType } from "@Enum";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import styles from "./PlaytestsLoggedOut.module.scss";
import sharedStyles from "./PlaytestSharedStyles.module.scss";
import { Img } from "@Helpers";

export const PlaytestsLoggedOut: React.FC = () => {
  const handlePlatformClick = (
    e: React.MouseEvent,
    platform: BungieCredentialType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const credentialString = BungieCredentialType[platform];
    const signInUrl = `/en/User/SignIn/${credentialString}/?flowStart=1`;

    BrowserUtils.openWindow(signInUrl, "loginui", () => {
      GlobalStateDataStore.refreshUserAndRelatedData(true);
    });
  };

  return (
    <div className={sharedStyles.container}>
      <img
        className={sharedStyles.img}
        src={Img("/marathon/icons/marathon.svg")}
        alt="Marathon December Community Playtest"
      />
      <h1 className={sharedStyles.title}>
        Marathon December Community Playtest
      </h1>
      <span className={sharedStyles.subtitle}>
        We’re testing the latest changes to Marathon from December 12 - 16.{" "}
        <br />
        If you’d like to be considered for participation, please sign in with
        your game platform account below.
      </span>

      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={(e) => handlePlatformClick(e, BungieCredentialType.Psnid)}
          aria-label="PlayStation"
        >
          <img
            className={styles.platformImage}
            src={Img("bungie/icons/logos/playstation/ps_square.png")}
            alt="Sign in with PlayStation"
          />
          <span className={styles.buttonText}>PlayStation</span>
        </button>

        <button
          className={styles.button}
          onClick={(e) => handlePlatformClick(e, BungieCredentialType.Xuid)}
          aria-label="Xbox"
        >
          <img
            className={styles.platformImage}
            src={Img("bungie/icons/logos/xbox/xbox_square.png")}
            alt="Sign in with Xbox"
          />
          <span className={styles.buttonText}>Xbox</span>
        </button>

        <button
          className={styles.button}
          onClick={(e) => handlePlatformClick(e, BungieCredentialType.SteamId)}
          aria-label="Steam"
        >
          <img
            className={styles.platformImage}
            src={Img("bungie/icons/logos/steam/steam_square.png")}
            alt="Sign in with Steam"
          />
          <span className={styles.buttonText}>Steam</span>
        </button>
      </div>
    </div>
  );
};
