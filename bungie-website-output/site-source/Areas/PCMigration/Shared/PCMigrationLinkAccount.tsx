import { Icon } from "@UI/UIKit/Controls/Icon";
import React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./PCMigrationModal.module.scss";
import {
  PCMigrationStageBase,
  IPCMigrationStageBaseProps,
  IPCMigrationStageGated,
} from "./PCMigrationModalStagePage";
import { PCMigrationWizardHeader } from "./PCMigrationWizardHeader";
import { PCMigrationPlatformContainer } from "./PCMigrationPlatformContainer";
import { Localizer } from "@Global/Localization/Localizer";
import classNames from "classnames";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import * as Globals from "@Enum";
import { BrowserUtils } from "@Utilities/BrowserUtils";

interface IPCMigrationLinkAccountProps extends IPCMigrationStageBaseProps {
  linkAccount: () => void;
}

interface IPCMigrationLinkAccountState extends IPCMigrationStageGated {
  isLoading: boolean;
  displayWarning: boolean;
}

export class PCMigrationLinkAccount extends PCMigrationStageBase<
  IPCMigrationLinkAccountProps,
  IPCMigrationLinkAccountState
> {
  constructor(props: IPCMigrationLinkAccountProps) {
    super(props);

    this.state = {
      canContinue: false,
      isLoading: false,
      displayWarning: false,
    };

    this.handleLink = this.handleLink.bind(this);
    this.handleLinkWindowClose = this.handleLinkWindowClose.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.continue = this.continue.bind(this);
    this.confirmContinue = this.confirmContinue.bind(this);
  }

  public componentDidUpdate() {
    if (PCMigrationUtilities.IsLinked(this.props.globalState.credentialTypes)) {
      this.continue();
    }
  }

  public render() {
    const pcmigrationLoc = Localizer.Pcmigration;
    const isLinked = PCMigrationUtilities.IsLinked(
      this.props.globalState.credentialTypes
    );
    const isSteamState =
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.SteamId
      ) &&
      !PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.BattleNetId
      );

    const linkSteamHeaderLabel = isSteamState
      ? pcmigrationLoc.LinkBattlenet
      : Localizer.Pcmigration.scheduletransferlabel;
    const linkSteamHeaderDescription = isSteamState
      ? pcmigrationLoc.LinkYourBattlenetAccount
      : Localizer.Pcmigration.linkyoursteamaccountto;
    const linkSteamContainerButtonLabel = !isLinked
      ? isSteamState
        ? pcmigrationLoc.LinkBattlenet
        : Localizer.Pcmigration.scheduletransferlabel
      : isSteamState
      ? pcmigrationLoc.BattlenetLinked
      : Localizer.Pcmigration.steamlinked;
    const linkSteamContainerButtonType = !isLinked ? "gold" : "disabled";

    return (
      <div className={styles.wizardContainer}>
        <React.Fragment>
          <PCMigrationWizardHeader
            type="playlist_add"
            className={classNames(styles.wizardHeader, styles.linkHeader)}
            header={linkSteamHeaderLabel}
            description={linkSteamHeaderDescription}
            globalState={this.props.globalState}
          />

          <div className={classNames(styles.wizardBody, styles.linkAccount)}>
            <PCMigrationPlatformContainer
              uniqueClassName={styles.blizzardContainer}
              platform={"blizzard"}
              globalState={this.props.globalState}
              onClick={null}
            />
            <Icon
              iconName="keyboard_arrow_down"
              iconType="material"
              className={classNames(styles.transferArrow, styles.animate)}
            />
            <PCMigrationPlatformContainer
              uniqueClassName={styles.steamContainer}
              platform={"steam"}
              globalState={this.props.globalState}
              onClick={this.handleLink}
            />
            <div className={styles.buttonContainer}>
              <Button
                buttonType={linkSteamContainerButtonType}
                onClick={this.handleLink}
                loading={this.state.isLoading}
              >
                {linkSteamContainerButtonLabel}
              </Button>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }

  private handleLink() {
    this.confirmContinue();
  }

  private confirmContinue() {
    // link steam here and then activate the
    //log in with steam
    // /en/User/Link/SteamId?flowStart=1&force=0
    this.openAccountLinkWindow();
  }

  private readonly openAccountLinkWindow = () => {
    this.setState({
      isLoading: true,
    });

    const linkingBattlenet =
      PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.SteamId
      ) &&
      !PCMigrationUtilities.HasCredentialType(
        this.props.globalState.credentialTypes,
        Globals.BungieCredentialType.BattleNetId
      );

    let url = `/${Localizer.CurrentCultureName}/User/Link/SteamId?flowStart=1&force=0`;

    if (linkingBattlenet) {
      // link blizzard
      url = `/${Localizer.CurrentCultureName}/User/Link/BattleNetId?flowStart=1&force=0`;
    }

    BrowserUtils.openWindow(url, "linkui", () => {
      this.handleLinkWindowClose();
    });
  };

  private handleLinkWindowClose() {
    this.props.linkAccount();

    this.setState({
      isLoading: false,
    });
  }

  private continue() {
    this.props.updateStage("transferdetails");
  }
}
