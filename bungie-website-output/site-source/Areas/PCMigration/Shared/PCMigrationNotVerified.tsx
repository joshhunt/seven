import { Platform } from "@Platform";
import React from "react";
import styles from "./PCMigrationModal.module.scss";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { ErrorDisplay } from "@UI/Errors/ErrorDisplay";
import { PlatformError } from "@CustomErrors";
import { ConvertToPlatformError } from "@ApiIntermediary";
import {
  PCMigrationStageBase,
  IPCMigrationStageBaseProps,
  IPCMigrationStageBaseState,
  IPCMigrationStageGated,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import { Localizer } from "@Global/Localization/Localizer";

interface IPCMigrationNotVerifiedState extends IPCMigrationStageGated {
  isSendingRequest: boolean;
}

export class PCMigrationNotVerified extends PCMigrationStageBase<
  IPCMigrationStageBaseProps,
  IPCMigrationNotVerifiedState
> {
  private readonly checkboxRef: React.RefObject<Checkbox>;

  constructor(props) {
    super(props);

    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);

    this.state = {
      canContinue: true,
      isSendingRequest: false,
    };

    this.checkboxRef = React.createRef();
    this.handleToggle = this.handleToggle.bind(this);
  }

  public render() {
    const h2 = Localizer.Pcmigration.beforewegetstarted;
    const fake = `Curabitur tempus est efficitur, gravida enim eu, sagittis eros. Integer nec urna eu ex commodo congue quis vitae velit. Curabitur nibh odio, accumsan a consequat at`;

    const body = Localizer.Pcmigration.weneedtoverfiyyouremail;
    const specialRequiredLabel = `${
      Localizer.Pcmigration.iagreetorecievecustomer
    } ${
      !this.state.canContinue
        ? `<span>${Localizer.Pcmigration.youmustagreetothistocontinue.toString()}</span>`
        : ""
    }`;

    const placeholder = this.props.globalState.loggedInUser
      ? this.props.globalState.loggedInUser.email
      : `Enter Email Address`;

    const checkboxPropertiesAgreeSystem = {
      name: `agree-system-notifications`,
      label: specialRequiredLabel,
      checked: true,
    };

    const checkboxPropertiesAgreePromo = {
      name: `agree-promos-email`,
      label: Localizer.Pcmigration.iagreetorecievenewsupdates,
      checked: false,
    };

    const exitButtonLabel = Localizer.Pcmigration.illdothislater;

    const sendVerificationEmailLabel =
      Localizer.Pcmigration.sendverificationemail;

    const buttonType = this.state.canContinue ? "gold" : "disabled";

    return (
      <div className={styles.wizardContainer}>
        <PCMigrationWizardHeader
          type="email"
          className={styles.wizardHeader}
          header={h2}
          description={fake}
          globalState={this.props.globalState}
        />
        <div className={styles.wizardBody}>
          <p dangerouslySetInnerHTML={{ __html: body }} />
          <input placeholder={placeholder} />
          <Checkbox
            name={checkboxPropertiesAgreeSystem.name}
            label={checkboxPropertiesAgreeSystem.label}
            checked={checkboxPropertiesAgreeSystem.checked}
            ref={this.checkboxRef}
            onClick={this.handleToggle}
          />
          <Checkbox
            name={checkboxPropertiesAgreePromo.name}
            label={checkboxPropertiesAgreePromo.label}
            checked={checkboxPropertiesAgreePromo.checked}
          />

          <div className={styles.buttonContainer}>
            <Button onClick={this.closeModal} buttonType={"white"}>
              {exitButtonLabel}
            </Button>
            <Button
              onClick={this.sendVerificationEmail}
              buttonType={buttonType}
            >
              {sendVerificationEmailLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  private sendVerificationEmail() {
    if (!this.props.bypass) {
      this.setState({
        isSendingRequest: true,
      });

      Platform.UserService.RevalidateEmail()
        .then(this.emailVerificationSent)
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }

    this.props.updateStage("emailverifying");
  }

  private handleToggle() {
    // this toggle is for clicking on the outside container, not the actual checkbox, so when you click it, it will be the current pre toggled checkbox state

    this.setState({ canContinue: !this.checkboxRef.current.state.checked });
  }

  private emailVerificationSent() {
    // send this back to the parent
    this.props.updateStage("emailverifying");
  }
}
