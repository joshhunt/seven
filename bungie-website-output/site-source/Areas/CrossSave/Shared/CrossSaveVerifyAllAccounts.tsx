// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { CrossSaveAccountLinkItem } from "../Activate/Components/CrossSaveAccountLinkItem";
import { ICrossSaveFlowState } from "./CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "./CrossSaveUtils";
import { Contract } from "@Platform";
import { PlatformError } from "@CustomErrors";
import styles from "./CrossSaveVerifyAllAccounts.module.scss";

interface ICrossSaveVerifyAllAccountsProps {
  loggedInUser: Contract.UserDetail;
  flowState: ICrossSaveFlowState;
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
    const { flowState, loggedInUser } = this.props;

    if (!flowState.validation || !loggedInUser) {
      return null;
    }

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );

    const accountsRendered = pairableMembershipTypes.map((membershipType) => (
      <CrossSaveAccountLinkItem
        key={membershipType}
        className={styles.accountLinkItem}
        stateIdentifier={this.props.flowState.stateIdentifier}
        membershipType={membershipType}
        flowState={flowState}
        onAccountLinked={this.props.onAccountLinked}
        linkedCredentialTypes={loggedInUser.crossSaveCredentialTypes}
      />
    ));

    return <div className={styles.linkableAccounts}>{accountsRendered}</div>;
  }
}
