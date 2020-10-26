// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./VaultingGlobalAlertsBar.module.scss";
import { Localizer } from "@Global/Localizer";
import { GlobalBar } from "./GlobalBar";
import { LocalStorageUtils } from "@Utilities/StorageUtils";

// Required props
interface IVaultingGlobalAlertsBarProps {}

// Default props - these will have values set in VaultingGlobalAlertsBar.defaultProps
interface DefaultProps {}

export type VaultingGlobalAlertsBarProps = IVaultingGlobalAlertsBarProps &
  DefaultProps;

interface IVaultingGlobalAlertsBarState {
  showToUser: boolean;
}

/**
 * VaultingGlobalAlertsBar - Replace this description
 *  *
 * @param {IVaultingGlobalAlertsBarProps} props
 * @returns
 */
export class VaultingGlobalAlertsBar extends React.Component<
  VaultingGlobalAlertsBarProps,
  IVaultingGlobalAlertsBarState
> {
  private readonly localStorageKey: string = "show-vaulting-alert";

  constructor(props: VaultingGlobalAlertsBarProps) {
    super(props);

    this.state = {
      showToUser: true,
    };
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const message = Localizer.Helptext.OnSept22DestinyContent;

    return (
      <React.Fragment>
        {this.state.showToUser && (
          <GlobalBar
            barClassNames={styles.vaulting}
            showCheckIcon={false}
            showWarningIcon={true}
            message={message}
            url={"/Vault2020"}
            removeable={true}
            localStorageKey={this.localStorageKey}
          />
        )}
      </React.Fragment>
    );
  }
}
