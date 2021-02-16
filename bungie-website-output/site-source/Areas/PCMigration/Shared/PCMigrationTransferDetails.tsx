import React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./PCMigrationModal.module.scss";
import { PCMigrationWarning } from "./PCMigrationWarning";
import {
  IPCMigrationStageBaseState,
  IPCMigrationTransferStageProps,
  PCMigrationTransferStageBase,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import { PCMigrationLicenses } from "./PCMigrationLicenses";
import { PCMigrationCharacters } from "./PCMigrationCharacters";
import { PCMigrationEververse } from "./PCMigrationEververse";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import classNames from "classnames";
import { Localizer } from "@Global/Localization/Localizer";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { BungieCredentialType, BungieMembershipType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";

export class PCMigrationTransferDetails extends PCMigrationTransferStageBase<
  IPCMigrationTransferStageProps,
  IPCMigrationStageBaseState
> {
  constructor(props: IPCMigrationTransferStageProps) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.continue = this.continue.bind(this);
  }

  public render() {
    const pcmigrationLoc = Localizer.Pcmigration;

    const loggedInUser = UserUtils.isAuthenticated(this.props.globalState)
      ? this.props.globalState.loggedInUser
      : null;

    const isSteamState =
      !PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        BungieCredentialType.BattleNetId
      ) &&
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        BungieCredentialType.SteamId
      );

    const headerLabel = isSteamState
      ? pcmigrationLoc.ExistingSteamAccountFound
      : Localizer.Pcmigration.reviewbattlenetaccount;
    const continueButtonLabel = Localizer.Pcmigration.continue;
    const exitButtonLabel = Localizer.Pcmigration.nevermind;

    const blizzardCredentialType = this.props.globalState.credentialTypes.find(
      (c) => c.credentialType === BungieCredentialType.BattleNetId
    );

    const blizzardDisplayName =
      typeof this.props.globalState.credentialTypes !== "undefined" &&
      typeof blizzardCredentialType !== "undefined" &&
      typeof blizzardCredentialType.credentialDisplayName !== "undefined" &&
      blizzardCredentialType.credentialDisplayName !== ""
        ? blizzardCredentialType.credentialDisplayName
        : Localizer.Pcmigration.errorloadingusername;

    const blizzardPlatformIcon = Img(
      "/destiny/icons/pcmigration/blizzardWhite.png"
    );
    const blizzardPlatformDescription =
      Localizer.Pcmigration.reviewtheaccountsummary;

    const steamDisplayName = loggedInUser
      ? loggedInUser.steamDisplayName
      : Localizer.Pcmigration.errorloadingusername;
    const steamPlatformIcon = Img("/bungie/icons/logos/steam/icon.png");
    const steamPlatformDescription = pcmigrationLoc.ConfirmThisIsTheSteam;

    const displayName = isSteamState
      ? PCMigrationUtilities.GetSteamProfileIdLink(
          steamDisplayName,
          this.props.globalState.credentialTypes
        )
      : blizzardDisplayName;
    const platformIcon = isSteamState
      ? steamPlatformIcon
      : blizzardPlatformIcon;
    const platformDescription = isSteamState
      ? steamPlatformDescription
      : blizzardPlatformDescription;

    const steamOverwriteTitle = pcmigrationLoc.WarningSteamAccountWill;
    const steamCharactersStomped = pcmigrationLoc.WarningByLinkingYourBattlenet;

    return (
      <div className={styles.wizardContainer}>
        <PCMigrationWizardHeader
          type="transfer"
          className={classNames(
            styles.wizardHeader,
            styles.transferDetailsHeader
          )}
          header={headerLabel}
          iconPath={platformIcon}
          description={platformDescription}
          globalState={this.props.globalState}
        />

        <div className={styles.wizardBody}>
          {isSteamState && (
            <PCMigrationWarning
              warningHeaderLabel={steamOverwriteTitle}
              warningDescriptionLabel={steamCharactersStomped}
              seriousWarning={true}
            />
          )}

          {!isSteamState && (
            <div
              className={classNames(styles.detailContainer, styles.blizzard)}
            >
              <OneLineItem
                itemTitle={displayName}
                size={BasicSize.Medium}
                icon={
                  <IconCoin
                    iconImageUrl={Img(
                      "destiny/icons/pcmigration/blizzarduser.png"
                    )}
                  />
                }
              />
            </div>
          )}

          {isSteamState && (
            <div className={classNames(styles.detailContainer, styles.steam)}>
              <OneLineItem
                itemTitle={displayName}
                size={BasicSize.Medium}
                icon={
                  <IconCoin
                    iconImageUrl={Img("bungie/icons/logos/steam/icon.png")}
                  />
                }
              />
            </div>
          )}

          {!isSteamState && (
            <React.Fragment>
              <PCMigrationCharacters
                characterDisplays={this.props.characterDisplays.filter(
                  (c) => c.platform === BungieMembershipType.TigerBlizzard
                )}
              />
              <PCMigrationLicenses
                versionsOwned={this.props.versionsOwnedBlizzard}
              />
              <PCMigrationEververse
                silverBalance={this.props.silverBalanceBlizzard}
                dust={this.props.dust}
              />
            </React.Fragment>
          )}
          {isSteamState && (
            <React.Fragment>
              <PCMigrationCharacters
                characterDisplays={this.props.characterDisplays.filter(
                  (c) => c.platform === BungieMembershipType.TigerSteam
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
          )}
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={this.closeModal} buttonType={"white"}>
            {exitButtonLabel}
          </Button>
          <Button onClick={this.continue} buttonType={"gold"}>
            {continueButtonLabel}
          </Button>
        </div>
      </div>
    );
  }

  private continue() {
    if (PCMigrationUtilities.IsLinked(this.props.globalState.credentialTypes)) {
      this.props.updateStage("transferagreement");
    } else {
      this.props.updateStage("linkaccount");
    }
  }
}
