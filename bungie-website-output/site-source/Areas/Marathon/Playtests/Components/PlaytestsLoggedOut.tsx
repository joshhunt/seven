import * as React from "react";
import { BungieCredentialType } from "@Enum";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import styles from "./PlaytestsLoggedOut.module.scss";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Marathon Playtests</h1>
      <p className={styles.subtitle}>
        Sign in using a supported platform to continue.
      </p>

      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={(e) => handlePlatformClick(e, BungieCredentialType.Psnid)}
          aria-label="PlayStation"
        >
          <img
            className={styles.platformImage}
            src="/7/assets/platforms/presskit/playstation-signin.png"
            alt="Sign in with PlayStation"
            onError={(ev) => {
              (ev.currentTarget as HTMLImageElement).style.display = "none";
            }}
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
            src="/7/assets/platforms/presskit/xbox-signin.png"
            alt="Sign in with Xbox"
            onError={(ev) => {
              (ev.currentTarget as HTMLImageElement).style.display = "none";
            }}
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
            src="/7/assets/platforms/presskit/steam-signin.png"
            alt="Sign in with Steam"
            onError={(ev) => {
              (ev.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span className={styles.buttonText}>Steam</span>
        </button>
      </div>
    </div>
  );
};
