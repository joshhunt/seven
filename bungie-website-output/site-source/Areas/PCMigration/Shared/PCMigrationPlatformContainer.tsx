import React, { CSSProperties } from "react";
import styles from "./PCMigrationPlatformContainer.module.scss";
import classNames from "classnames";
import { Localizer } from "@Global/Localization/Localizer";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { BungieCredentialType } from "@Enum";
import { Img } from "@Helpers";

export type PCPlatform = "blizzard" | "steam";

interface IPCMigrationPlatformProps {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  uniqueClassName: string;
  platform: PCPlatform;
  onClick();
}

export class PCMigrationPlatformContainer extends React.Component<
  IPCMigrationPlatformProps
> {
  private readonly steamLogoPath = Img("destiny/logos/steam-logo-white.png");
  private readonly blizzardLogoPath =
    "/img/theme/bungienet/icons/BattlenetLogo.png";
  private readonly locPCMigration = Localizer.Pcmigration;

  constructor(props) {
    super(props);
  }

  public render() {
    if (typeof this.props.globalState.loggedInUser === "undefined") {
      return null;
    }

    const isSteam = this.props.platform === "steam";
    const isSteamLinked = PCMigrationUtilities.HasCredentialType(
      this.props.globalState.credentialTypes,
      BungieCredentialType.SteamId
    );
    const isBlizzardLinked = PCMigrationUtilities.HasCredentialType(
      this.props.globalState.credentialTypes,
      BungieCredentialType.BattleNetId
    );

    // displayNames
    const steamDisplayName = isSteamLinked
      ? typeof this.props.globalState.loggedInUser.steamDisplayName !==
          "undefined" &&
        this.props.globalState.loggedInUser.steamDisplayName !== ""
        ? this.props.globalState.loggedInUser.steamDisplayName
        : typeof this.props.globalState.loggedInUser.user.steamDisplayName !==
            "undefined" &&
          this.props.globalState.loggedInUser.user.steamDisplayName !== ""
        ? this.props.globalState.loggedInUser.user.steamDisplayName
        : Localizer.Pcmigration.steamaccount
      : Localizer.Pcmigration.steamaccount;

    const blizzardCredentialType = this.props.globalState.credentialTypes.find(
      (c) => c.credentialType === BungieCredentialType.BattleNetId
    );

    const blizzardDisplayName =
      typeof this.props.globalState.credentialTypes !== "undefined" &&
      typeof blizzardCredentialType !== "undefined" &&
      typeof blizzardCredentialType.credentialDisplayName !== "undefined" &&
      blizzardCredentialType.credentialDisplayName !== ""
        ? blizzardCredentialType.credentialDisplayName
        : Localizer.Pcmigration.BattlenetAccount;

    //descriptions
    let steamDesc = Localizer.Pcmigration.yourdestinyaccountwill; //Your Destiny Account will be moved to this Steam User on September 17th.
    let blizzardDesc = Localizer.Pcmigration.youmaycontinueplaying; //You may continue playing Destiny 2 on Battlenet until September 17th.

    if (isSteamLinked && !isBlizzardLinked) {
      steamDesc = Localizer.Pcmigration.ThisIsTheSteamAccount;
      blizzardDesc = Localizer.Pcmigration.thisisthebattlenetaccount; //This Battlenet Account will transfer to Steam.
    }

    if (!isSteamLinked && isBlizzardLinked) {
      steamDesc = this.locPCMigration.thisisthesteamaccount; //Link the Steam Account you intend to play Destiny 2 with.
      blizzardDesc = Localizer.Pcmigration.thisisthebattlenetaccount; //This Battlenet Account will transfer to Steam.
    }

    const platformOpacity = isSteam ? 1 : 0.6;

    const backgroundStyle: CSSProperties = {
      opacity: platformOpacity,
      cursor: isSteam ? "pointer" : "default",
    };

    const displayName = isSteam ? steamDisplayName : blizzardDisplayName;

    const platformIcon = isSteam ? this.steamLogoPath : this.blizzardLogoPath;

    const platformDescription = isSteam ? steamDesc : blizzardDesc;

    return (
      <div
        className={classNames(
          styles.wizardBody,
          styles[this.props.platform],
          styles[this.props.uniqueClassName]
        )}
        style={backgroundStyle}
        onClick={this.props.onClick}
      >
        <img className={styles.platformIcon} src={platformIcon} />
        <h2 className={styles.platformName}>{displayName}</h2>
        <p>{platformDescription}</p>
      </div>
    );
  }
}
