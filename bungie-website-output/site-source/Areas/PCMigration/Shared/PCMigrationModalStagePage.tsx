import { IPCMigrationCharacterDisplay } from "@Areas/PCMigration/Shared/PCMigrationUserDataStore";
import React from "react";
import {
  GlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { PCMigrationStage } from "./PCMigrationModal";
import * as Globals from "@Enum";

export enum EmailVerificationState {
  None,
  NotVerified,
  Verified,
  Verifying,
}

export interface IPCMigrationStageBaseProps extends GlobalStateComponentProps {
  updateStage(newStage: PCMigrationStage);
  closeModal(closeModal: boolean);
  globalState: GlobalState<"loggedInUser" | "credentialTypes">;
  bypass: boolean;
}

export interface IPCMigrationStageBaseState {}

export interface IPCMigrationStageGated extends IPCMigrationStageBaseState {
  canContinue: boolean;
}

export interface IPCMigrationEntitlementDisplay {
  membershipType: Globals.BungieMembershipType;
  ownedVersion: Globals.DestinyGameVersions;
  title: string;
  iconPath: string;
}

export interface IPCMigrationTransferStageProps
  extends IPCMigrationStageBaseProps {
  characterDisplays: IPCMigrationCharacterDisplay[];
  silverBalanceBlizzard: number;
  silverBalanceSteam: number;
  dust: number;
  versionsOwnedBlizzard: Globals.DestinyGameVersions;
  versionsOwnedSteam: Globals.DestinyGameVersions;
}

export class PCMigrationStageBase<
  P extends IPCMigrationStageBaseProps,
  S extends IPCMigrationStageBaseState
> extends React.Component<P, S> {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  protected closeModal() {
    this.props.closeModal(true);
  }
}

export class PCMigrationTransferStageBase<
  P extends IPCMigrationTransferStageProps,
  S extends IPCMigrationStageBaseState
> extends PCMigrationStageBase<P, S> {
  constructor(props) {
    super(props);
  }
}
