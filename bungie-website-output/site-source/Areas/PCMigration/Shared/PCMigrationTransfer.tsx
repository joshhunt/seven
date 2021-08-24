import { IPCMigrationUserData } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import {
  IPCMigrationTransferStageProps,
  PCMigrationTransferStageBase,
  IPCMigrationStageBaseState,
} from "./PCMigrationModalStagePage";
import { Localizer } from "@bungie/localization";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import React from "react";
import classNames from "classnames";
import styles from "./PCMigrationModal.module.scss";
import { OneLineItem } from "@UI/UIKit/Companion/OneLineItem";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { IconCoin } from "@UI/UIKit/Companion/Coins/IconCoin";
import { PCMigrationCharacters } from "./PCMigrationCharacters";
import { PCMigrationLicenses } from "./PCMigrationLicenses";
import { PCMigrationEververse } from "./PCMigrationEververse";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { PCMigrationWarning } from "./PCMigrationWarning";
import { GlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { BungieMembershipType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";
import { UrlUtils } from "@Utilities/UrlUtils";

interface IPCMigrationTransferProperties
  extends IPCMigrationTransferStageProps {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  pcMigrationUser: IPCMigrationUserData;
}

interface IPCMigrationTransferState extends IPCMigrationStageBaseState {
  isTransferring: boolean;
  transferringComplete: boolean;
}

export class PCMigrationTransfer extends PCMigrationTransferStageBase<
  IPCMigrationTransferProperties,
  IPCMigrationTransferState
> {
  constructor(props: IPCMigrationTransferProperties) {
    super(props);

    this.state = {
      isTransferring: false,
      transferringComplete: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.startTransfer = this.startTransfer.bind(this);
  }

  public render() {
    if (typeof this.props.globalState.loggedInUser === "undefined") {
      return null;
    }

    const hasSteamCharacters =
      typeof this.props.characterDisplays.find(
        (c) => c.platform === BungieMembershipType.TigerSteam
      ) !== "undefined"
        ? true
        : false;
    const hasBattlenetCharacters =
      typeof this.props.characterDisplays.find(
        (c) => c.platform === BungieMembershipType.TigerBlizzard
      ) !== "undefined"
        ? true
        : false;

    const pcmigrationLoc = Localizer.Pcmigration;

    const loggedInUser = UserUtils.isAuthenticated(this.props.globalState)
      ? this.props.globalState.loggedInUser
      : null;

    const steamDisplayName =
      loggedInUser !== null ? loggedInUser.steamDisplayName : "";
    const blizzardPlatformIcon = Img(
      "/destiny/icons/pcmigration/blizzardWhite.png"
    );
    const blizzardPlatformDescription =
      pcmigrationLoc.YouAreNowReadyToPlayDestiny;

    const queryObj = UrlUtils.QueryToObject();

    // new stuff below
    const headerLabel = pcmigrationLoc.TransferAccount;
    const headerDesc = Localizer.Format(
      pcmigrationLoc.YourAccountBelowIsReady,
      { displayName: steamDisplayName }
    );
    const steamOverwriteTitle = pcmigrationLoc.WarningSteamAccountWill;
    const steamCharactersStomped = pcmigrationLoc.WarningByLinkingYourBattlenet;
    const continueButtonLabel = pcmigrationLoc.TransferAccount;
    const exitButtonLabel = Localizer.Pcmigration.nevermind;
    const transferringDesc = pcmigrationLoc.TransferringInProgress;

    const steamAccount = pcmigrationLoc.SteamCharactersWillBe;
    const blizzardCharactersTransferTitle =
      pcmigrationLoc.BlizzardCharactersWill;
    const mergedLicensesTitle = pcmigrationLoc.MergedLicenses;
    const mergedLicensesDesc = pcmigrationLoc.LicensesYouPurchasedOn;
    const mergedEververseTitle = pcmigrationLoc.MergedEververse;
    const mergedEververseDesc = pcmigrationLoc.SilverYouHavePurchased;

    return (
      <div className={styles.wizardContainer}>
        <PCMigrationWizardHeader
          type="link"
          className={classNames(
            styles.wizardHeader,
            styles.transferDetailsHeader
          )}
          header={headerLabel}
          description={headerDesc}
          globalState={this.props.globalState}
        />
        <div className={classNames(styles.wizardBody)}>
          {hasSteamCharacters && (
            <React.Fragment>
              <PCMigrationWarning
                warningHeaderLabel={steamOverwriteTitle}
                warningDescriptionLabel={steamCharactersStomped}
                seriousWarning={true}
              />

              <div className={styles.detailContainer}>
                <h4
                  className={classNames(
                    "section-header",
                    styles.steamCharactersTitle
                  )}
                >
                  {steamAccount}
                </h4>
                {this.props.characterDisplays
                  .filter((c) => c.platform === BungieMembershipType.TigerSteam)
                  .map((character, index) => {
                    return (
                      <OneLineItem
                        key={index}
                        itemTitle={character.title}
                        size={BasicSize.Small}
                        flair={character.level}
                        icon={<IconCoin iconImageUrl={character.iconPath} />}
                      />
                    );
                  })}

                {hasBattlenetCharacters && (
                  <React.Fragment>
                    <h4 className={"section-header"}>
                      {blizzardCharactersTransferTitle}
                    </h4>
                    {this.props.characterDisplays
                      .filter(
                        (c) => c.platform === BungieMembershipType.TigerBlizzard
                      )
                      .map((c) => (character: any, index: any) => (
                        <OneLineItem
                          key={index}
                          itemTitle={character.title}
                          size={BasicSize.Small}
                          flair={character.level}
                          icon={<IconCoin iconImageUrl={character.iconPath} />}
                        />
                      ))}
                  </React.Fragment>
                )}
              </div>
              <div className={styles.detailContainer}>
                <h4 className={"section-header"}>{mergedLicensesTitle}</h4>
                <p>{mergedLicensesDesc}</p>
                <PCMigrationLicenses
                  versionsOwned={this.props.versionsOwnedSteam}
                />
                <PCMigrationLicenses
                  versionsOwned={this.props.versionsOwnedBlizzard}
                />
              </div>
              <div className={styles.detailContainer}>
                <h4 className={"section-header"}>{mergedEververseTitle}</h4>
                <p>{mergedEververseDesc}</p>
                <PCMigrationEververse
                  silverBalance={this.props.silverBalanceSteam}
                  dust={this.props.dust}
                />
                <PCMigrationEververse
                  silverBalance={this.props.silverBalanceBlizzard}
                  dust={this.props.dust}
                />
              </div>
            </React.Fragment>
          )}
          {!hasSteamCharacters && (
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

          {this.state.isTransferring && (
            <div className={styles.detailContainer}>
              <h4 className={"section-header"}>{transferringDesc}</h4>
            </div>
          )}
        </div>

        {!this.state.transferringComplete && (
          <div className={styles.buttonContainer}>
            <Button onClick={this.closeModal} buttonType={"white"}>
              {exitButtonLabel}
            </Button>
            <Button
              onClick={this.startTransfer}
              buttonType={this.state.isTransferring ? "disabled" : "gold"}
            >
              {continueButtonLabel}
            </Button>
          </div>
        )}
      </div>
    );
  }

  private startTransfer() {
    this.setState({
      isTransferring: true,
    });

    //Platform.UserService.InitiateBlizzardToSteamDestinyMigration()
    //	.then((response: User.BlizzardToSteamMigrationStatusResponse) =>
    //	{
    //		if (response.MigrationComplete)
    //		{
    //			this.setState({
    //				transferringComplete: true
    //			});
    //		}
    //	})
    //	.catch(ConvertToPlatformError)
    //	.catch((e: PlatformError) =>
    //	{
    //		//there was an error and transferring stopped
    //		this.setState({
    //			isTransferring: true
    //		});

    //		//show an error message - not the default error modal
    //		Modal.error(e);
    //	});
  }
}
