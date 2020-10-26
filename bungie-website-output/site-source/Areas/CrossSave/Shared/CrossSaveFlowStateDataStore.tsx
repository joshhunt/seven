import { DataStore } from "@Global/DataStore";
import React from "react";
import * as Globals from "@Enum";
import { Renderer, Platform, CrossSave, GroupsV2 } from "@Platform";
import { CrossSaveUtils } from "./CrossSaveUtils";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SessionStorageUtils } from "@Utilities/StorageUtils";
import { UserUtils } from "@Utilities/UserUtils";

export enum CrossSaveMode {
  U,
  NS,
}

export interface ICrossSaveFlowState extends Renderer.CrossSaveUserData {
  stateIdentifier: number;
  // Flow data
  definitions: Renderer.DefinitionSetCrossSaveUserData;
  pairingStatus: CrossSave.CrossSavePairingStatus;
  validation: CrossSave.CrossSaveValidationResponse;
  userClans: GroupsV2.GroupMembership[];

  // Flow state
  includedMembershipTypes: Globals.BungieMembershipType[];
  primaryMembershipType: Globals.BungieMembershipType;
  loaded: boolean;
  isActive: boolean;
  userCanIncludeAccounts: boolean;
  acknowledged: boolean;
  mode: CrossSaveMode;
}

export const CrossSaveValidGameVersions: Globals.DestinyGameVersions[] = [
  Globals.DestinyGameVersions.Shadowkeep,
  Globals.DestinyGameVersions.Forsaken,
];

class CrossSaveFlowStateDataStoreInternal extends DataStore<
  ICrossSaveFlowState
> {
  private static readonly ACK_KEY = "CrossSaveAcknowledged";

  private static get ackStorage() {
    const stringVal =
      SessionStorageUtils.getItem(
        CrossSaveFlowStateDataStoreInternal.ACK_KEY
      ) || "false";
    const parsed = JSON.parse(stringVal);

    return Boolean(parsed);
  }

  public static readonly InitialState: ICrossSaveFlowState = {
    stateIdentifier: undefined,
    pairingStatus: null,
    profileResponses: null,
    validation: null,
    definitions: null,
    userClans: GlobalStateDataStore.state.loggedInUserClans
      ? GlobalStateDataStore.state.loggedInUserClans.results
      : [],
    includedMembershipTypes: [],
    primaryMembershipType: Globals.BungieMembershipType.None,
    loaded: false,
    isActive: false,
    userCanIncludeAccounts: false,
    linkedDestinyProfiles: null,
    acknowledged: CrossSaveFlowStateDataStoreInternal.ackStorage,
    mode: CrossSaveMode.U,
    entitlements: null,
  };

  public static Instance = new CrossSaveFlowStateDataStoreInternal(
    CrossSaveFlowStateDataStoreInternal.InitialState
  );

  private updateAckStorage(newAck: boolean) {
    if (newAck !== undefined) {
      SessionStorageUtils.setItem(
        CrossSaveFlowStateDataStoreInternal.ACK_KEY,
        JSON.stringify(newAck)
      );
    }
  }

  public update(data: Partial<ICrossSaveFlowState>) {
    const result = super.update(data);

    this.updateAckStorage(this._internalState.acknowledged);

    return result;
  }

  private isActive(pairingStatus: CrossSave.CrossSavePairingStatus): boolean {
    return (
      pairingStatus &&
      pairingStatus.overriddenProfiles &&
      pairingStatus.overriddenProfiles.length > 0
    );
  }

  private userCanIncludeAccounts(
    pairingStatus: CrossSave.CrossSavePairingStatus,
    validation: CrossSave.CrossSaveValidationResponse
  ) {
    const involvedMembershipTypes = [];
    if (
      pairingStatus &&
      pairingStatus.primaryMembershipId &&
      pairingStatus.overriddenProfiles
    ) {
      involvedMembershipTypes.push(
        ...pairingStatus.overriddenProfiles.map(
          (a) => a.membershipTypeOverridden
        )
      );
      involvedMembershipTypes.push(pairingStatus.primaryMembershipId);
    }

    const validMembershipTypes = Object.keys(
      validation.pairableMembershipTypes
    ).map((mtString) => Globals.BungieMembershipType[mtString]);

    return validMembershipTypes.some(
      (membershipType) => involvedMembershipTypes.indexOf(membershipType) === -1
    );
  }

  public loadUserData() {
    const gs = GlobalStateDataStore.state;

    if (!UserUtils.isAuthenticated(gs)) {
      return Promise.resolve();
    }

    const membershipId = UserUtils.loggedInUserMembershipId(
      GlobalStateDataStore.state
    );

    const userClansPromise = !this._internalState.userClans
      ? Platform.GroupV2Service.GetGroupsForMember(
          Globals.BungieMembershipType.BungieNext,
          membershipId,
          Globals.GroupsForMemberFilter.All,
          Globals.GroupType.Clan
        )
      : undefined;

    return Promise.resolve(
      Platform.CrosssaveService.GetCrossSavePairingStatus()
    ).then((pairingStatus) => {
      const isActive = this.isActive(pairingStatus);

      const stateIdentifier =
        this.state.stateIdentifier || Math.ceil(Math.random() * 1000000);

      const validationEndpoint = isActive
        ? Platform.CrosssaveService.GetCrossSaveUnpairValidationStatus(
            stateIdentifier
          )
        : Platform.CrosssaveService.GetCrossSavePairValidationStatus(
            stateIdentifier
          );

      Promise.all([
        Platform.RendererService.CrossSaveUserData(membershipId),
        validationEndpoint,
        userClansPromise,
      ])
        .then((data) => {
          const crossSaveUserData = data[0];
          const validation = data[1];
          const userClans = data[2];

          const includedMembershipTypes = CrossSaveUtils.getPresetPairingDecision(
            pairingStatus,
            this._internalState.mode
          );
          const primaryMembershipType =
            pairingStatus.primaryMembershipType !== undefined
              ? pairingStatus.primaryMembershipType
              : null;

          this.update({
            stateIdentifier,
            ...crossSaveUserData.data,
            definitions: crossSaveUserData.definitions,
            pairingStatus,
            isActive,
            userCanIncludeAccounts: this.userCanIncludeAccounts(
              pairingStatus,
              validation
            ),
            includedMembershipTypes,
            primaryMembershipType,
            validation,
            userClans: this._internalState.userClans || userClans.results,
            acknowledged: this.state.acknowledged || isActive,
            loaded: true,
          });
        })
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    });
  }
  public onAccountLinked = (requiresReset: boolean) => {
    if (requiresReset) {
      GlobalStateDataStore.refreshUserData(true);
    }

    this.resetSetup();

    return this.loadUserData();
  };

  public resetSetup() {
    this.update({
      includedMembershipTypes: [],
      primaryMembershipType: null,
      //stateIdentifier: undefined
    });
  }

  public reset() {
    this.update(CrossSaveFlowStateDataStoreInternal.InitialState);
  }
}

export const CrossSaveFlowStateContext = React.createContext<
  ICrossSaveFlowState
>(null);

export const CrossSaveFlowStateDataStore =
  CrossSaveFlowStateDataStoreInternal.Instance;
