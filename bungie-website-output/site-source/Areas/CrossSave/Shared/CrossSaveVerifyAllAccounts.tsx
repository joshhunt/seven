// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { BungieMembershipType } from "@Enum";
import { SystemNames } from "@Global/SystemNames";
import { RouteDefs } from "@Routes/RouteDefs";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import * as React from "react";
import { CrossSaveAccountLinkItem } from "../Activate/Components/CrossSaveAccountLinkItem";
import { ICrossSaveFlowState } from "./CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "./CrossSaveUtils";
import { Contract } from "@Platform";
import styles from "./CrossSaveVerifyAllAccounts.module.scss";

interface ICrossSaveVerifyAllAccountsProps {
  loggedInUser: Contract.UserDetail;
  flowState: ICrossSaveFlowState;
  isDeactivateFlow: boolean;
  onAccountLinked?: (shouldReset: boolean) => Promise<any>;
}

interface ICrossSaveVerifyAllAccountsState {}

/**
 * CrossSaveVerifyAllAccounts - Replace this description
 *  *
 * @param {ICrossSaveVerifyAllAccountsProps} props
 * @returns
 */
export class CrossSaveVerifyAllAccounts extends React.Component<
  ICrossSaveVerifyAllAccountsProps,
  ICrossSaveVerifyAllAccountsState
> {
  constructor(props: ICrossSaveVerifyAllAccountsProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { flowState, loggedInUser, isDeactivateFlow } = this.props;

    if (!flowState.validation || !loggedInUser) {
      return null;
    }

    const includedMembershipTypes = flowState.includedMembershipTypes || [];

    let linkedAccounts = includedMembershipTypes;

    // Stadia is valid for deactivate but not for create/link
    if (!isDeactivateFlow) {
      linkedAccounts = includedMembershipTypes.filter(
        (mt) =>
          !EnumUtils.looseEquals(
            BungieMembershipType[mt],
            BungieMembershipType.TigerStadia,
            BungieMembershipType
          )
      );
    }

    const stadiaIsPrimary = EnumUtils.looseEquals(
      BungieMembershipType.TigerStadia,
      BungieMembershipType[flowState?.primaryMembershipType],
      BungieMembershipType
    );
    const stadiaAuthIsDisabled = !ConfigUtils.SystemStatus(
      SystemNames.StadiaIdAuth
    );

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    ).sort((mt) => (linkedAccounts.includes(mt) ? -1 : 0));

    const accountsRendered = pairableMembershipTypes.map((membershipType) => (
      <CrossSaveAccountLinkItem
        key={membershipType}
        className={styles.accountLinkItem}
        stateIdentifier={this.props.flowState.stateIdentifier}
        membershipType={membershipType}
        flowState={flowState}
        onAccountLinked={this.props.onAccountLinked}
        linkedCredentialTypes={loggedInUser?.crossSaveCredentialTypes}
      />
    ));

    return (
      <div className={styles.linkableAccounts}>
        {/* Stadia is treated differently */}
        {stadiaAuthIsDisabled && stadiaIsPrimary && isDeactivateFlow && (
          <CrossSaveAccountLinkItem
            key={BungieMembershipType.TigerStadia}
            className={styles.accountLinkItem}
            stateIdentifier={this.props.flowState.stateIdentifier}
            membershipType={BungieMembershipType.TigerStadia}
            flowState={flowState}
            onAccountLinked={this.props.onAccountLinked}
            linkedCredentialTypes={loggedInUser?.crossSaveCredentialTypes}
            isDeactivateFlow={true}
          />
        )}
        {accountsRendered}
      </div>
    );
  }
}
