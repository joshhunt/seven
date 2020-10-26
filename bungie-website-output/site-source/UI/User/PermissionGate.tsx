// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { AclEnum } from "@Enum";

interface IPermissionGateProps
  extends React.HTMLProps<HTMLDivElement>,
    GlobalStateComponentProps<"loggedInUser"> {
  /* Permissions add to this array will be required to see the internal content **/
  permissions: AclEnum[];
}

interface IPermissionGateState {
  anyPermissionMissing: boolean;
}

/**
 * PermissionGate - Replace this description
 *  *
 * @param {IPermissionGateProps} props
 * @returns
 */
class PermissionGateInner extends React.Component<
  IPermissionGateProps,
  IPermissionGateState
> {
  constructor(props: IPermissionGateProps) {
    super(props);

    this.state = {
      anyPermissionMissing: false,
    };
  }

  public componentDidMount() {
    // Check if the user is missing any required permissions
    const anyPermissionMissing = this.props.permissions.some(
      (p) => this.props.globalState.loggedInUser.userAcls.indexOf(p) === -1
    );
    this.setState({
      anyPermissionMissing,
    });
  }

  public render() {
    return this.state.anyPermissionMissing ? null : (
      <div>{this.props.children || null}</div>
    );
  }
}

export const PermissionsGate = withGlobalState(PermissionGateInner, [
  "loggedInUser",
]);
