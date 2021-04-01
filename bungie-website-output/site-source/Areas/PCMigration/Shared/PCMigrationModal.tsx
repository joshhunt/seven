import {
  IPCMigrationUserData,
  PCMigrationUserDataStore,
} from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import React, { ReactElement } from "react";
import { PCMigrationLinkAccount } from "./PCMigrationLinkAccount";
import { PCMigrationTransferAgreement } from "./PCMigrationTransferAgreement";
import { PCMigrationNotVerified } from "./PCMigrationNotVerified";
import { PCMigrationVerifying } from "./PCMigrationVerifying";
import { PCMigrationUtilities } from "./PCMigrationUtilities";
import { PCMigrationVerified } from "./PCMigrationVerified";
import { PCMigrationTransferDetails } from "./PCMigrationTransferDetails";
import { PCMigrationSuccess } from "./PCMigrationSuccess";
import { EmailVerificationState } from "./PCMigrationModalStagePage";
import { DataStore } from "@Global/DataStore";
import * as Globals from "@Enum";
import { PCMigrationTransfer } from "./PCMigrationTransfer";
import {
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface IPCMigrationModalProperties {
  transferComplete: boolean;

  closeModal: (closeModal: boolean) => void;
}

interface IPCMigrationModalState {
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  stage: PCMigrationStage;
  user: IPCMigrationUserData;
}

export type PCMigrationStage =
  | "empty"
  | "noblizzard"
  | "emailnotverified"
  | "emailverifying"
  | "emailverified"
  | "linkaccount"
  | "transferagreement"
  | "transferdetails"
  | "success"
  | "transfer";

export class PCMigrationModal extends React.Component<
  IPCMigrationModalProperties,
  IPCMigrationModalState
> {
  private readonly bypassChecks: boolean = false;
  private readonly emailValidationEnabled: boolean = ConfigUtils.SystemStatus(
    "PCMigrationEmailValidation"
  );
  private readonly subs: DestroyCallback[] = [];

  constructor(props: IPCMigrationModalProperties) {
    super(props);

    this.state = {
      globalState: GlobalStateDataStore.state,
      stage: "empty",
      user: null,
    };

    this.updateStage = this.updateStage.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  public componentDidMount() {
    this.initialize();

    this.subs.push(
      PCMigrationUserDataStore.observe((userData) => {
        this.setState({
          user: userData,
        });
      }),
      GlobalStateDataStore.observe(
        (globalState) => {
          if (PCMigrationUtilities.IsLinked(globalState.credentialTypes)) {
            this.setState({
              stage: this.props.transferComplete
                ? "success"
                : "transferdetails",
              globalState,
            });

            PCMigrationUserDataStore.getDestinyAccount(globalState);
          }
        },
        ["loggedInUser", "credentialTypes"]
      )
    );
  }

  public initialize() {
    // don't do anything here - we don't need this page anymore
  }

  public render() {
    if (this.state.user !== null) {
      return this.stageFragment();
    }

    return null;
  }

  public updateStage(stage: PCMigrationStage) {
    this.setState({
      stage: stage,
    });
  }

  private determineUserStage() {
    let stage: PCMigrationStage = "empty";

    //check for linked state
    if (PCMigrationUtilities.IsLinked(this.state.globalState.credentialTypes)) {
      stage = this.props.transferComplete ? "success" : "transferdetails";

      //stage = this.props.transferComplete ? "success" : "transferagreement";
    } else {
      //check for email validation switch
      if (!this.emailValidationEnabled) {
        //skip email validation

        //a steam only user with no battlenet and does not have any steam characters needs to be able to link battlenet if they want
        stage =
          PCMigrationUtilities.HasCredentialType(
            this.state.globalState.credentialTypes,
            Globals.BungieCredentialType.SteamId
          ) &&
          !PCMigrationUtilities.HasCredentialType(
            this.state.globalState.credentialTypes,
            Globals.BungieCredentialType.BattleNetId
          ) &&
          typeof this.state.user.characterDisplays.find(
            (c) => c.platform === Globals.BungieMembershipType.TigerSteam
          ) === "undefined"
            ? "linkaccount"
            : "transferdetails";
      } else {
        stage = this.determineEmailVerificationStage();
      }
    }

    this.updateStage(stage);
  }

  private determineEmailVerificationStage(): PCMigrationStage {
    const verificationState = PCMigrationUtilities.GetEmailValidationStatus(
      this.state.globalState.loggedInUser.emailStatus
    );

    let stage: PCMigrationStage = "emailnotverified";

    switch (verificationState) {
      case EmailVerificationState.Verified:
        stage = "emailverified";
        break;
      case EmailVerificationState.Verifying:
        stage = "emailverifying";
    }

    return stage;
  }

  private stageFragment(): ReactElement {
    switch (this.state.stage) {
      case "emailnotverified":
        return (
          <PCMigrationNotVerified
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
          />
        );

      case "emailverifying":
        return (
          <PCMigrationVerifying
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
          />
        );

      case "emailverified":
        return (
          <PCMigrationVerified
            updateStage={this.updateStage}
            pcMigrationUser={this.state.user}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
          />
        );

      case "transferagreement":
        return (
          <PCMigrationTransferAgreement
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            hasSteamDestiny={this.state.user.hasDestinySteam}
            hasSteamDestinyCharacters={
              typeof this.state.user.characterDisplays.find(
                (c) => c.platform === Globals.BungieMembershipType.TigerSteam
              ) !== "undefined"
            }
            bypass={this.bypassChecks}
          />
        );

      case "transferdetails":
        return (
          <PCMigrationTransferDetails
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
            characterDisplays={this.state.user.characterDisplays}
            silverBalanceBlizzard={this.state.user.silverBalanceBlizzard}
            silverBalanceSteam={this.state.user.silverBalanceSteam}
            dust={this.state.user.dust}
            versionsOwnedBlizzard={this.state.user.versionsOwnedBlizzard}
            versionsOwnedSteam={this.state.user.versionsOwnedSteam}
          />
        );

      case "linkaccount":
        return (
          <PCMigrationLinkAccount
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            linkAccount={this.updateUser}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
          />
        );

      case "success":
        return (
          <PCMigrationSuccess
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
            pcMigrationUser={this.state.user}
            characterDisplays={this.state.user.characterDisplays}
            silverBalanceBlizzard={this.state.user.silverBalanceBlizzard}
            silverBalanceSteam={this.state.user.silverBalanceSteam}
            dust={this.state.user.dust}
            versionsOwnedBlizzard={this.state.user.versionsOwnedBlizzard}
            versionsOwnedSteam={this.state.user.versionsOwnedSteam}
          />
        );

      case "transfer":
        return (
          <PCMigrationTransfer
            updateStage={this.updateStage}
            globalState={this.state.globalState}
            closeModal={this.props.closeModal}
            bypass={this.bypassChecks}
            pcMigrationUser={this.state.user}
            characterDisplays={this.state.user.characterDisplays}
            silverBalanceBlizzard={this.state.user.silverBalanceBlizzard}
            silverBalanceSteam={this.state.user.silverBalanceSteam}
            dust={this.state.user.dust}
            versionsOwnedBlizzard={this.state.user.versionsOwnedBlizzard}
            versionsOwnedSteam={this.state.user.versionsOwnedSteam}
          />
        );

      default:
        return null;
    }
  }

  private async updateUser() {
    // update global user data
    await GlobalStateDataStore.refreshUserAndRelatedData(true);

    PCMigrationUserDataStore.getDestinyAccount(this.state.globalState);
  }
}
