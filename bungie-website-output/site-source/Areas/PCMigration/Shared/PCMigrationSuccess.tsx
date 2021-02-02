import { IPCMigrationUserData } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./PCMigrationModal.module.scss";
import {
  IPCMigrationStageBaseState,
  PCMigrationTransferStageBase,
  IPCMigrationTransferStageProps,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import classNames from "classnames";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { PCMigrationCharacters } from "./PCMigrationCharacters";
import { PCMigrationLicenses } from "./PCMigrationLicenses";
import { PCMigrationEververse } from "./PCMigrationEververse";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import * as Globals from "@Enum";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { Anchor } from "@UI/Navigation/Anchor";
import { Img } from "@Helpers";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";

interface IPCMigrationSuccessProperties extends IPCMigrationTransferStageProps {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  pcMigrationUser: IPCMigrationUserData;
}

export class PCMigrationSuccess extends PCMigrationTransferStageBase<
  IPCMigrationSuccessProperties,
  IPCMigrationStageBaseState
> {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  public render() {
    if (typeof this.props.globalState.loggedInUser === "undefined") {
      return null;
    }

    const pcmigrationLoc = Localizer.Pcmigration;

    const loggedInUser = UserUtils.isAuthenticated(this.props.globalState)
      ? this.props.globalState.loggedInUser
      : null;

    const headerLabel = pcmigrationLoc.Success;

    const steamDisplayName =
      loggedInUser !== null ? loggedInUser.steamDisplayName : "";
    const blizzardPlatformIcon = Img(
      "/destiny/icons/pcmigration/blizzardWhite.png"
    );
    const steamPlatformIcon = Img("/bungie/icons/logos/steam/icon.png");
    const blizzardPlatformDescription =
      pcmigrationLoc.YouAreNowReadyToPlayDestiny;

    const displayName = steamDisplayName;
    const platformIcon = blizzardPlatformIcon;
    const platformDescription = blizzardPlatformDescription;

    const queryObj = UrlUtils.QueryToObject();
    const isCrossSavePrompt =
      queryObj.crossSavePrompt && queryObj.crossSavePrompt === "true";
    const sourceAccount = Localizer.Pcmigration.SourceAccount;
    const destinationAccount = Localizer.Pcmigration.DestinationAccount;

    return (
      <div className={styles.wizardContainer}>
        <PCMigrationWizardHeader
          type="success"
          className={classNames(
            styles.wizardHeader,
            styles.transferDetailsHeader
          )}
          header={headerLabel}
          iconPath={platformIcon}
          iconPath2={steamPlatformIcon}
          description={platformDescription}
          globalState={this.props.globalState}
        />
        <div className={classNames(styles.wizardBody, styles.successBody)}>
          <div className={classNames(styles.detailContainer, styles.blizzard)}>
            <strong>{sourceAccount}</strong>
            <OneLineItem
              itemTitle={
                typeof this.props.globalState.credentialTypes.find(
                  (c) =>
                    c.credentialType ===
                    Globals.BungieCredentialType.BattleNetId
                ) !== "undefined"
                  ? this.props.globalState.credentialTypes.find(
                      (c) =>
                        c.credentialType ===
                        Globals.BungieCredentialType.BattleNetId
                    ).credentialDisplayName
                  : loggedInUser.blizzardDisplayName
              }
              size={BasicSize.Medium}
              icon={<IconCoin iconImageUrl={blizzardPlatformIcon} />}
            />
          </div>

          <div className={classNames(styles.detailContainer, styles.blizzard)}>
            <strong>{destinationAccount}</strong>
            <OneLineItem
              itemTitle={this.getSteamProfileIdLink(displayName)}
              size={BasicSize.Medium}
              icon={<IconCoin iconImageUrl={steamPlatformIcon} />}
            />
          </div>

          <React.Fragment>
            <PCMigrationCharacters
              characterDisplays={this.props.characterDisplays.filter(
                (c) => c.platform === Globals.BungieMembershipType.TigerSteam
              )}
            />
            <PCMigrationLicenses
              versionsOwned={this.props.versionsOwnedSteam}
            />
            <PCMigrationEververse
              silverBalance={this.props.silverBalanceSteam}
              dust={this.props.dust}
            />
          </React.Fragment>
        </div>
        <div className={styles.buttonContainer}>
          {!isCrossSavePrompt && (
            <Button onClick={this.closeModal} buttonType={"gold"}>
              {Localizer.Pcmigration.imdone}
            </Button>
          )}
          {isCrossSavePrompt && (
            <Button
              onClick={this.closeModal}
              url={RouteHelper.CrossSaveActivate()}
              buttonType={"gold"}
            >
              {Localizer.Pcmigration.ReturnToCrossSave}
            </Button>
          )}
        </div>
      </div>
    );
  }

  private getSteamProfileIdLink(displayName: string): React.ReactNode {
    let displayNameDisplay = <React.Fragment>{displayName}</React.Fragment>;

    if (
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.SteamId
      )
    ) {
      displayNameDisplay = PCMigrationUtilities.GetSteamProfileIdLink(
        displayName,
        this.props.globalState.credentialTypes
      );
    }

    return displayNameDisplay;
  }
}
