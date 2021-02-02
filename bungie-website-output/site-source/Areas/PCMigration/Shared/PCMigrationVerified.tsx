import { ConvertToPlatformError } from "@ApiIntermediary";
import { IPCMigrationUserData } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import { PlatformError } from "@CustomErrors";
import * as Globals from "@Enum";
import { Localizer } from "@Global/Localization/Localizer";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import React from "react";
import styles from "./PCMigrationModal.module.scss";
import {
  IPCMigrationStageBaseProps,
  IPCMigrationStageGated,
  PCMigrationStageBase,
} from "./PCMigrationModalStagePage";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";

interface IPCMigrationVerifiedProps extends IPCMigrationStageBaseProps {
  pcMigrationUser: IPCMigrationUserData;
}

export class PCMigrationVerified extends PCMigrationStageBase<
  IPCMigrationVerifiedProps,
  IPCMigrationStageGated
> {
  private readonly checkboxRefPromo: React.RefObject<Checkbox>;
  private readonly checkboxRefSystem: React.RefObject<Checkbox>;

  private readonly promoEmailUsageFlag = 45;
  private readonly systemEmailUsageFlag = 18;

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.continue = this.continue.bind(this);

    this.handleToggleSystem = this.handleToggleSystem.bind(this);
    this.updateUserSettings = this.updateUserSettings.bind(this);

    this.checkboxRefPromo = React.createRef();
    this.checkboxRefSystem = React.createRef();
  }

  public componentWillMount() {
    this.setState({
      canContinue:
        (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
          this.systemEmailUsageFlag) ===
        this.systemEmailUsageFlag,
    });
  }

  public render() {
    const h2 = Localizer.Pcmigration.beforewegetstarted;
    const body = Localizer.Pcmigration.WeWillKeepYouInformed;
    const fake = Localizer.Pcmigration.weneedyourpermissionto;

    const usersEmail = this.props.globalState.loggedInUser.email;

    const changeEmailSettingsLink = RouteHelper.Settings({
      membershipId: this.props.globalState.loggedInUser.user.membershipId,
      membershipType: 254,
      category: "Notifications",
    });

    const changeEmailLink = Localizer.Pcmigration.changeemailaddress;

    const promoIsChecked =
      (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
        this.promoEmailUsageFlag) ===
      this.promoEmailUsageFlag;
    const systemIsChecked =
      (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
        this.systemEmailUsageFlag) ===
      this.systemEmailUsageFlag;

    const continueButton = Localizer.Pcmigration.continue;
    const exitButtonLabel = Localizer.Pcmigration.illdothislater;
    const customerServiceLabel = Localizer.Pcmigration.emailaddressonaccount;

    const specialRequiredLabel = `${
      Localizer.Pcmigration.iagreetorecievecustomer
    } ${
      !this.state.canContinue
        ? `<span>${Localizer.Pcmigration.youmustagreetothistocontinue.toString()}</span>`
        : ""
    }`;

    const checkboxPropertiesAgreeSystem = {
      name: `agree-system-notifications`,
      label: specialRequiredLabel,
      checked: systemIsChecked,
    };

    const checkboxPropertiesAgreePromo = {
      name: `agree-promos-email`,
      label: Localizer.Pcmigration.iagreetorecievenewsupdates,
      checked: promoIsChecked,
    };

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
          <h4 className="section-header">{customerServiceLabel}</h4>
          <div className={styles.emailContainer}>
            <div className={styles.emailAddress}>{usersEmail}</div>
            <div className={styles.changeEmailAddress}>
              <Anchor url={changeEmailSettingsLink}>{changeEmailLink}</Anchor>
            </div>
          </div>
          <div className={styles.checkboxContainer}>
            <Checkbox
              name={checkboxPropertiesAgreeSystem.name}
              label={checkboxPropertiesAgreeSystem.label}
              checked={checkboxPropertiesAgreeSystem.checked}
              ref={this.checkboxRefSystem}
              onClick={this.handleToggleSystem}
            />
            {!promoIsChecked && (
              <Checkbox
                name={checkboxPropertiesAgreePromo.name}
                label={checkboxPropertiesAgreePromo.label}
                checked={checkboxPropertiesAgreePromo.checked}
                ref={this.checkboxRefPromo}
              />
            )}
          </div>
          <div className={styles.buttonContainer}>
            <Button onClick={this.closeModal} buttonType={"white"}>
              {exitButtonLabel}
            </Button>
            <Button onClick={this.updateUserSettings} buttonType={buttonType}>
              {continueButton}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  private continue() {
    if (
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.SteamId
      ) &&
      !PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.BattleNetId
      ) &&
      typeof this.props.pcMigrationUser.characterDisplays.find(
        (c) => c.platform === Globals.BungieMembershipType.TigerSteam
      ) === "undefined"
    ) {
      this.props.updateStage("linkaccount");
    } else {
      this.props.updateStage("transferdetails");
    }
  }

  private updateUserSettings() {
    let updatedValue = 0;

    // determine what the checkboxes are
    const emailUsage = this.props.globalState.loggedInUser.emailUsage;

    // system needs to be checked to continue; can never be unchecked at this point
    const systemIsChecked = this.checkboxRefSystem.current.state.checked;
    if (
      (parseInt(emailUsage, 10) & this.systemEmailUsageFlag) !==
        this.systemEmailUsageFlag &&
      systemIsChecked
    ) {
      //was not subscribed to promos
      updatedValue |= this.systemEmailUsageFlag;
    }

    // promos will not be available if user is currently opted in;
    if (this.checkboxRefPromo && this.checkboxRefPromo.current) {
      const promoIsChecked = this.checkboxRefPromo.current.state.checked;
      if (
        (parseInt(emailUsage, 10) & this.promoEmailUsageFlag) !==
          this.promoEmailUsageFlag &&
        promoIsChecked
      ) {
        //was not subscribed to promos
        updatedValue |= this.promoEmailUsageFlag;
      }
    }

    const generalUser = this.props.globalState.loggedInUser.user;

    const input: Contract.UserEditRequest = {
      locale: null,
      membershipId: generalUser.membershipId,
      statusText: null,
      about: null,
      displayName: null,
      uniqueName: null,
      emailAddress: null,
      addedSubscriptions: null,
      addedOptIns: updatedValue.toString(),

      removedOptIns: null,
      removedSubscriptions: null,
      showGroupMessaging: null,
      adultMode: null,
      pmToastsEnabled: null,
    };

    Platform.UserService.UpdateUser(input)
      .then(this.continue)
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  }

  private handleToggleSystem() {
    // this toggle is for clicking on the outside container, not the actual checkbox, so when you click it, it will be the current pre toggled checkbox state
    this.setState({
      canContinue: !this.checkboxRefSystem.current.state.checked,
    });
  }
}
