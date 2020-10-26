import React from "react";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./PCMigrationModal.module.scss";
import { Localizer } from "@Global/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import {
  IPCMigrationStageBaseState,
  PCMigrationStageBase,
  IPCMigrationStageBaseProps,
  IPCMigrationStageGated,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import { Platform } from "@Platform";
import { PCMigrationWarning } from "./PCMigrationWarning";

interface IPCMigrationVerifyingState extends IPCMigrationStageBaseState {
  showVerifyingMessage: boolean;
}

export class PCMigrationVerifying extends PCMigrationStageBase<
  IPCMigrationStageBaseProps,
  IPCMigrationVerifyingState
> {
  constructor(props) {
    super(props);

    this.state = {
      showVerifyingMessage: false,
    };

    this.resendEmailVerification = this.resendEmailVerification.bind(this);
  }

  public render() {
    const emailVerificationHelpUrl = `https://www.bungie.net/${Localizer.CurrentCultureName}/Support/Troubleshoot?oid=13784`;

    const usersEmail = this.props.globalState.loggedInUser.email;

    const changeEmailSettingsLink = RouteHelper.Settings({
      membershipId: this.props.globalState.loggedInUser.user.membershipId,
      membershipType: 254,
      category: "Notifications",
    });

    const headerLabel = Localizer.Pcmigration.verifiedemailrequired;
    const body = Localizer.Format(
      Localizer.Pcmigration.ifyoucantfindtheverification,
      { emailVerificationHelpUrl: emailVerificationHelpUrl }
    );
    const headerDesc = Localizer.Pcmigration.averifiedemailaddress;
    const verificationEmail = Localizer.Pcmigration.emailaddressonaccount;

    const changeEmailLink = Localizer.Pcmigration.changeemailaddress;
    const resendVerificationEmail =
      Localizer.Pcmigration.resendverificationemail;

    const resentEmailHeader = Localizer.Pcmigration.ResendingVerification;
    const resentEmailBody = Localizer.Pcmigration.AVerificationEmailHas;

    const exitButtonLabel = Localizer.Pcmigration.illdothislater;

    return (
      <div className={styles.wizardContainer}>
        <PCMigrationWizardHeader
          type="email"
          className={styles.wizardHeader}
          header={headerLabel}
          description={headerDesc}
          globalState={this.props.globalState}
        />
        <div className={styles.wizardBody}>
          {this.state.showVerifyingMessage && (
            <div className={styles.warningContainer}>
              <PCMigrationWarning
                warningHeaderLabel={resentEmailHeader}
                warningDescriptionLabel={resentEmailBody}
              />
            </div>
          )}
          <h4 className="section-header">{verificationEmail}</h4>
          <div className={styles.emailContainer}>
            <div className={styles.emailAddress}>{usersEmail}</div>
            <div className={styles.changeEmailAddress}>
              <Anchor url={changeEmailSettingsLink}>{changeEmailLink}</Anchor>
            </div>
          </div>
          <div className={styles.emailInfo}>
            <p>{Localizer.Messages.UserEmailVerificationSent}</p>
            <p dangerouslySetInnerHTML={{ __html: body }} />
          </div>
          <div className={styles.buttonContainer}>
            <Button onClick={this.closeModal} buttonType={"white"}>
              {exitButtonLabel}
            </Button>
            <Button onClick={this.resendEmailVerification} buttonType={"gold"}>
              {resendVerificationEmail}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  private resendEmailVerification() {
    this.setState({
      showVerifyingMessage: true,
    });

    if (!this.props.bypass) {
      Platform.UserService.RevalidateEmail();
    } else {
      this.props.updateStage("emailverified");
    }
  }
}
