import React, { ChangeEvent, ReactElement } from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./PCMigrationModal.module.scss";
import {
  PCMigrationStageBase,
  IPCMigrationStageBaseProps,
  IPCMigrationStageGated,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import { PCMigrationWarning } from "./PCMigrationWarning";
import { Localizer } from "@Global/Localizer";
import { InfoBlock } from "@UI/Content/InfoBlock";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { Platform, User } from "@Platform";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import {
  PCMigrationAlreadyMigratedError,
  AlreadyTransferredErrorType,
} from "./PCMigrationAlreadyMigratedError";
import { PlatformErrorCodes, BungieCredentialType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface IPCMigrationTransferAgreementProps
  extends IPCMigrationStageBaseProps {
  hasSteamDestiny: boolean;
  hasSteamDestinyCharacters: boolean;
}

interface IPCMigrationTransferAgreenmentState extends IPCMigrationStageGated {
  isLoading: boolean;
  isTransferring: boolean;
  transferComplete: boolean;
  displayWarning: boolean;
  steamDisplayWarningOverride: boolean;
  charactersTransferring: boolean;
  silverTransferrring: boolean;
  seasonPassTransferring: boolean;
  entitlementsTransferring: boolean;
  showEntitlementsTransferring: boolean;
}

export class PCMigrationTransferAgreement extends PCMigrationStageBase<
  IPCMigrationTransferAgreementProps,
  IPCMigrationTransferAgreenmentState
> {
  private readonly pcmigrationLoc = Localizer.Pcmigration;
  private readonly refToInput: React.RefObject<HTMLInputElement>;
  private readonly refToContent: React.RefObject<HTMLDivElement>;

  private readonly refToInfoBlock: React.RefObject<InfoBlock>;
  private readonly agreeText = Localizer.Pcmigration.IAgree;

  constructor(props) {
    super(props);

    this.state = {
      canContinue: false,
      isLoading: false,
      isTransferring: false,
      transferComplete: false,
      displayWarning: false,
      steamDisplayWarningOverride: false,
      charactersTransferring: false,
      silverTransferrring: false,
      seasonPassTransferring: false,
      entitlementsTransferring: false,
      showEntitlementsTransferring: ConfigUtils.SystemStatus(
        "PCMigrationEntitlements"
      ),
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.beginTransfer = this.beginTransfer.bind(this);
    this.getPCMigrationTransferState = this.getPCMigrationTransferState.bind(
      this
    );
    this.confirmContinue = this.confirmContinue.bind(this);
    this.handleTransferStateButton = this.handleTransferStateButton.bind(this);

    this.refToInput = React.createRef<HTMLInputElement>();
    this.refToContent = React.createRef<HTMLDivElement>();
    this.refToInfoBlock = React.createRef<InfoBlock>();
  }

  public componentDidMount() {
    this.getPCMigrationTransferState();

    if (this.props.hasSteamDestiny && this.props.hasSteamDestinyCharacters) {
      this.setState({ displayWarning: true });
    }
  }

  public componentDidUpdate() {
    if (
      !this.state.steamDisplayWarningOverride &&
      !this.state.displayWarning &&
      this.props.hasSteamDestiny &&
      this.props.hasSteamDestinyCharacters
    ) {
      this.setState({ displayWarning: true });
    }
  }

  public render() {
    const linkSteamHeaderLabel = this.pcmigrationLoc.transferagreement;

    return (
      <div className={styles.wizardContainer}>
        {this.state.displayWarning ? (
          this.showSteamLostWarning()
        ) : this.state.isTransferring && !this.state.transferComplete ? (
          this.showTransferNotComplete()
        ) : (
          <PCMigrationWizardHeader
            type="notes"
            className={styles.wizardHeader}
            header={linkSteamHeaderLabel}
            globalState={this.props.globalState}
          />
        )}
        {!this.state.transferComplete &&
          !this.state.isTransferring &&
          !this.state.displayWarning &&
          this.showSteamAgreementContent()}
      </div>
    );
  }

  private showSteamLostWarning(): ReactElement {
    const steamOverwriteHeader = this.pcmigrationLoc.warningsteamprogresswill;
    const steamOverwriteDesc = this.pcmigrationLoc.continuingwillresultin;

    const confirmContinue = this.pcmigrationLoc.Continue;

    return (
      <div className={styles.confirmLinkContainer}>
        <Icon iconName="warning" iconType="material" />
        <h2 className="section-header">{steamOverwriteHeader}</h2>
        <p>{steamOverwriteDesc}</p>
        <Button buttonType={"gold"} onClick={this.confirmContinue}>
          {confirmContinue}
        </Button>
      </div>
    );
  }

  private showSteamAlreadyMigratedError(
    errorType: AlreadyTransferredErrorType,
    isComplete: boolean,
    response: User.BlizzardToSteamMigrationStatusResponse
  ): ReactElement {
    //showing the error so close the main modal
    this.props.closeModal(true);

    return (
      <PCMigrationAlreadyMigratedError
        errorType={errorType}
        isComplete={isComplete}
        statusResponse={response}
        globalState={this.props.globalState}
        fromHomePage={false}
      />
    );
  }

  private showTransferNotComplete(): ReactElement {
    const errorHeader = this.pcmigrationLoc.TransferringStatus;
    const transferDesc = this.pcmigrationLoc.CheckBackLaterTransfer;
    const transferErrorSupportLink = `https://www.bungie.net/en/Forums/Topics?pNumber=0&tg=Help`;
    const supportMessage = Localizer.Format(
      Localizer.Pcmigration.transferErrorSupport,
      { transferErrorSupportUrl: transferErrorSupportLink }
    );
    const retryButton = this.pcmigrationLoc.RetryTransfer;

    return (
      <div className={styles.confirmLinkContainer}>
        <Icon iconName="warning" iconType="material" />
        <h2 className="section-header">{errorHeader}</h2>
        <p>{transferDesc}</p>
        <p dangerouslySetInnerHTML={{ __html: supportMessage }} />
        {this.showTransferrringInProgress()}
        <Button buttonType={"gold"} onClick={this.beginTransfer}>
          {retryButton}
        </Button>
      </div>
    );
  }

  private showTransferrringInProgress() {
    const charactersTransferring = this.state.charactersTransferring
      ? Localizer.Pcmigration.CharactersAreTransferring
      : Localizer.Pcmigration.CharactersHaveTransferred;
    const entitlementsTransferring = this.state.entitlementsTransferring
      ? Localizer.Pcmigration.EntitlementsAreTransferring
      : Localizer.Pcmigration.EntitlementsHaveTransferred;
    const silverTransferring = this.state.silverTransferrring
      ? Localizer.Pcmigration.SilverIsTransferring
      : Localizer.Pcmigration.SilverHasTransferred;
    const seasonPassTransferring = this.state.seasonPassTransferring
      ? Localizer.Pcmigration.SeasonPassIsTransferring
      : Localizer.Pcmigration.SeasonPassHasTransferred;

    const stillTransferringDescription = ``;

    return (
      <div className={styles.transferStatus}>
        {this.state.charactersTransferring && (
          <PCMigrationWarning
            className={styles.overwriteWarning}
            warningHeaderLabel={charactersTransferring}
            warningDescriptionLabel={stillTransferringDescription}
            error={this.state.silverTransferrring}
          />
        )}
        {this.state.silverTransferrring && (
          <PCMigrationWarning
            className={styles.overwriteWarning}
            warningHeaderLabel={silverTransferring}
            warningDescriptionLabel={stillTransferringDescription}
            error={this.state.silverTransferrring}
          />
        )}

        {this.state.seasonPassTransferring && (
          <PCMigrationWarning
            className={styles.overwriteWarning}
            warningHeaderLabel={seasonPassTransferring}
            warningDescriptionLabel={stillTransferringDescription}
            error={this.state.seasonPassTransferring}
          />
        )}

        {this.state.showEntitlementsTransferring &&
          this.state.entitlementsTransferring && (
            <PCMigrationWarning
              className={styles.overwriteWarning}
              warningHeaderLabel={entitlementsTransferring}
              warningDescriptionLabel={stillTransferringDescription}
              error={this.state.entitlementsTransferring}
            />
          )}
      </div>
    );
  }

  private showSteamAgreementContent(): ReactElement {
    const continueButtonLabel = this.pcmigrationLoc.Transfer;
    const exitButtonLabel = this.pcmigrationLoc.nevermind;

    const buttonType =
      this.props.bypass || this.state.canContinue ? "gold" : "disabled";

    const placeholder = this.agreeText;

    return (
      <React.Fragment>
        <div className={styles.wizardBody} ref={this.refToContent}>
          <div className={styles.agreementContainer}>
            <InfoBlock
              tagAndType={{
                tag: "pcmigration-agreement",
                type: "InformationBlock",
              }}
              ref={this.refToInfoBlock}
            />
            <div className={styles.agreeContainer}>
              <div className={styles.agreeInputContainer}>
                <p>{Localizer.Pcmigration.typeIagree}</p>
                <input
                  className={styles.agreeInput}
                  type="text"
                  name=""
                  id="agree"
                  ref={this.refToInput}
                  placeholder={placeholder}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={this.closeModal} buttonType={"white"}>
            {exitButtonLabel}
          </Button>
          <Button
            onClick={this.beginTransfer}
            buttonType={buttonType}
            loading={this.state.isLoading}
          >
            {continueButtonLabel}
          </Button>
        </div>
      </React.Fragment>
    );
  }

  private handleTransferStateButton() {
    if (!this.state.transferComplete) {
      this.beginTransfer();
    } else {
      this.continue();
    }
  }

  private confirmContinue() {
    this.setState({
      displayWarning: false,
      steamDisplayWarningOverride: true,
    });
  }

  private handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (
      this.refToInput.current.value === this.agreeText &&
      !this.state.canContinue
    ) {
      this.setState({
        canContinue: true,
      });
    }
  }

  private beginTransfer() {
    Platform.UserService.InitiateBlizzardToSteamDestinyMigration()
      .then((response: User.BlizzardToSteamMigrationStatusResponse) => {
        if (
          response.MigrationTransferStatus ===
          PlatformErrorCodes.PCMigrationAccountsAlreadyUsed
        ) {
          this.getStatusForBothAccountsPostError();
        } else {
          this.setPostInitiationState(response);

          if (this.state.transferComplete) {
            this.continue();
          } else {
            this.setState({
              isTransferring: true,
            });
          }
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        if (e.errorCode === PlatformErrorCodes.PCMigrationAccountsAlreadyUsed) {
          this.getStatusForBothAccountsPostError();
        } else {
          //there was an error and transferring stopped
          this.setState({
            isTransferring: true,
          });

          //show an error message - not the default error modal
          Modal.error(e);
        }
      });
  }

  private getStatusForBothAccountsPostError() {
    this.setState({
      isTransferring: false,
    });

    this.getStatusForErrorHandling("Steam");
    this.getStatusForErrorHandling("Blizzard");
  }

  private getStatusForErrorHandling(platform: AlreadyTransferredErrorType) {
    const cred =
      platform === "Blizzard"
        ? BungieCredentialType.BattleNetId
        : BungieCredentialType.SteamId;

    Platform.UserService.GetBlizzardToSteamDestinyMigrationStatus(cred)
      .then((response: User.BlizzardToSteamMigrationStatusResponse) => {
        if (
          response.MigrationStarted &&
          !response.CallerIsLinkedToSourceAndDestinationCredential
        ) {
          Modal.open(
            this.showSteamAlreadyMigratedError(
              platform,
              response.MigrationComplete,
              response
            )
          );
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  }

  private getPCMigrationTransferState() {
    if (
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        BungieCredentialType.BattleNetId
      )
    ) {
      Platform.UserService.GetBlizzardToSteamDestinyMigrationStatus(
        BungieCredentialType.BattleNetId
      ).then((response: User.BlizzardToSteamMigrationStatusResponse) => {
        if (PCMigrationUtilities.MigrationIsComplete(response)) {
          this.continue();
        } else {
          this.setPostInitiationState(response);
        }
      });
    }
  }

  private setPostInitiationState(
    response: User.BlizzardToSteamMigrationStatusResponse
  ) {
    this.setState({
      transferComplete: PCMigrationUtilities.MigrationIsComplete(response),
      isTransferring:
        response.MigrationStarted &&
        !PCMigrationUtilities.MigrationIsComplete(response),
      charactersTransferring:
        typeof response.CharacterMigratedDate === "undefined" ||
        (typeof response.CharacterMigratedDate !== "undefined" &&
          response.CharacterMigratedDate === ""),
      silverTransferrring:
        typeof response.SilverMigratedDate === "undefined" ||
        (typeof response.SilverMigratedDate !== "undefined" &&
          response.SilverMigratedDate === ""),
      seasonPassTransferring:
        typeof response.SeasonPassMigratedDate === "undefined" ||
        (typeof response.SeasonPassMigratedDate !== "undefined" &&
          response.SeasonPassMigratedDate === ""),
      entitlementsTransferring:
        typeof response.EntitlementMigratedDate === "undefined" ||
        (typeof response.EntitlementMigratedDate !== "undefined" &&
          response.EntitlementMigratedDate === ""),
    });
  }

  private continue() {
    this.props.updateStage("success");
  }
}
