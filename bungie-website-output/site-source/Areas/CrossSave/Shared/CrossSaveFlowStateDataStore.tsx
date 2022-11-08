import { ConvertToPlatformError } from "@ApiIntermediary";
import { DataStore } from "@bungie/datastore";
import {
  BungieMembershipType,
  DestinyGameVersions,
  GroupsForMemberFilter,
  GroupType,
} from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { CrossSave, GroupsV2, Platform, Renderer } from "@Platform";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SessionStorageUtils } from "@Utilities/StorageUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import { CrossSaveUtils } from "./CrossSaveUtils";

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
  includedMembershipTypes: BungieMembershipType[];
  primaryMembershipType: BungieMembershipType;
  loaded: boolean;
  isActive: boolean;
  userCanIncludeAccounts: boolean;
  acknowledged: boolean;
  mode: CrossSaveMode;
}

export const CrossSaveValidGameVersions: DestinyGameVersions[] = [
  DestinyGameVersions.Shadowkeep,
  DestinyGameVersions.Forsaken,
  DestinyGameVersions.BeyondLight,
  DestinyGameVersions.TheWitchQueen,
  DestinyGameVersions.Anniversary30th,
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
    primaryMembershipType: BungieMembershipType.None,
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

  public actions = this.createActions({
    /**
     * Reset the state to the initial state
     */
    reset: () => CrossSaveFlowStateDataStoreInternal.InitialState,
    /**
     * Reset the user choices to the initial state
     */
    resetSetup: () => ({
      includedMembershipTypes: [],
      primaryMembershipType: null,
    }),
    /**
     * Set whether the user has acknowledged the agreement
     * @param acknowledged
     */
    updateAcknowledged: (state, acknowledged: boolean) => {
      CrossSaveFlowStateDataStoreInternal.updateAckStorage(acknowledged);

      return {
        acknowledged,
      };
    },
    /**
     * Set the pairing status for a given membership ID
     * @param pairingStatus
     * @param membershipId
     */
    setPairingStatus: async (
      state,
      pairingStatus: CrossSave.CrossSavePairingStatus,
      membershipId: string
    ) => {
      try {
        const isActive = state.isActive;

        const stateIdentifier =
          state.stateIdentifier || Math.ceil(Math.random() * 1000000);

        const userClansPromise = !state.userClans
          ? Platform.GroupV2Service.GetGroupsForMember(
              BungieMembershipType.BungieNext,
              membershipId,
              GroupsForMemberFilter.All,
              GroupType.Clan
            )
          : undefined;

        const validationEndpoint = isActive
          ? Platform.CrosssaveService.GetCrossSaveUnpairValidationStatus(
              stateIdentifier
            )
          : Platform.CrosssaveService.GetCrossSavePairValidationStatus(
              stateIdentifier
            );

        const [crossSaveUserData, validation, userClans] = await Promise.all([
          Platform.RendererService.CrossSaveUserData(membershipId),
          validationEndpoint,
          userClansPromise,
        ]);

        const includedMembershipTypes = CrossSaveUtils.getPresetPairingDecision(
          pairingStatus,
          state.mode
        );
        const primaryMembershipType =
          pairingStatus.primaryMembershipType !== undefined
            ? pairingStatus.primaryMembershipType
            : null;

        return {
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
          userClans: state.userClans || userClans.results,
          acknowledged: state.acknowledged || isActive,
          loaded: true,
        };
      } catch (e) {
        ConvertToPlatformError(e).then(Modal.error);
      }
    },
    /**
     * Sets the primary membershipType for the user's Cross Save status
     * @param membershipType
     */
    updatePrimaryMembershipType: (
      state,
      membershipType: BungieMembershipType
    ) => ({
      primaryMembershipType: membershipType,
    }),
  });

  private static updateAckStorage(newAck: boolean) {
    if (newAck !== undefined) {
      SessionStorageUtils.setItem(
        CrossSaveFlowStateDataStoreInternal.ACK_KEY,
        JSON.stringify(newAck)
      );
    }
  }

  private static isActive(
    pairingStatus: CrossSave.CrossSavePairingStatus
  ): boolean {
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
    const involvedMembershipTypes: BungieMembershipType[] = [];
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
      involvedMembershipTypes.push(pairingStatus.primaryMembershipType);
    }

    const validMembershipTypes = Object.keys(
      validation.pairableMembershipTypes
    ).map(
      (mtString: EnumStrings<typeof BungieMembershipType>) =>
        BungieMembershipType[mtString]
    );

    return validMembershipTypes.some(
      (membershipType) => involvedMembershipTypes.indexOf(membershipType) === -1
    );
  }

  public async loadUserData() {
    const gs = GlobalStateDataStore.state;

    if (!UserUtils.isAuthenticated(gs)) {
      return Promise.resolve();
    }

    const membershipId = UserUtils.loggedInUserMembershipId(
      GlobalStateDataStore.state
    );

    return Platform.CrosssaveService.GetCrossSavePairingStatus()
      .then((pairingStatus) =>
        this.actions.setPairingStatus(pairingStatus, membershipId)
      )
      .catch(Modal.error);
  }

  public onAccountLinked = async (requiresReset: boolean) => {
    if (requiresReset) {
      await GlobalStateDataStore.refreshUserAndRelatedData(true);
    }

    this.actions.resetSetup();

    return this.loadUserData();
  };
}

export const CrossSaveFlowStateDataStore =
  CrossSaveFlowStateDataStoreInternal.Instance;
