// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CrossSaveSilverBalance.module.scss";
import { Definitions } from "@Platform";
import * as Globals from "@Enum";
import { CrossSaveUtils } from "@Areas/CrossSave/Shared/CrossSaveUtils";
import { DestinyConstants } from "@Utilities/DestinyConstants";
import { Localizer } from "@bungie/localization";
import { ICrossSaveFlowState } from "@Areas/CrossSave/Shared/CrossSaveFlowStateDataStore";
import { EnumKey } from "@Helpers";

interface ICrossSaveSilverBalanceProps {
  membershipType: Globals.BungieMembershipType;
  flowState: ICrossSaveFlowState;
  crossSaveActive?: boolean;
}

interface ICrossSaveSilverBalanceState {}

/**
 * CrossSaveSilverBalance - Replace this description
 *  *
 * @param {ICrossSaveSilverBalanceProps} props
 * @returns
 */
export class CrossSaveSilverBalance extends React.Component<
  ICrossSaveSilverBalanceProps,
  ICrossSaveSilverBalanceState
> {
  constructor(props: ICrossSaveSilverBalanceProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { membershipType, flowState, crossSaveActive } = this.props;

    const definitions = flowState.definitions;
    const membershipTypeForSilver = crossSaveActive
      ? flowState.primaryMembershipType
      : membershipType;
    const flowStateForMembership = CrossSaveUtils.getFlowStateInfoForMembership(
      flowState,
      membershipTypeForSilver
    );
    const userInfo = flowStateForMembership.userInfo;

    let silverQuantity = 0;
    let silverDef: Definitions.DestinyInventoryItemDefinition;
    if (userInfo && userInfo.platformSilver) {
      const key = EnumKey(membershipType, Globals.BungieMembershipType);
      const silver = userInfo.platformSilver.platformSilver[key];
      if (silver) {
        silverQuantity = silver.quantity;
      }
    }

    if (definitions) {
      silverDef = definitions.items[DestinyConstants.CurrencySilverHash];
    }

    if (!silverDef) {
      return null;
    }

    return (
      <div className={styles.silver}>
        <div className={styles.label}>{Localizer.Crosssave.SilverBalance}</div>
        <div className={styles.value}>
          <span
            className={styles.silverIcon}
            style={{
              backgroundImage: `url(${silverDef.displayProperties.icon})`,
            }}
          />
          {silverQuantity}
        </div>
      </div>
    );
  }
}
