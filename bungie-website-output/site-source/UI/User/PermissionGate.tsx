// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { AclEnum } from "@Enum";

interface IPermissionGateProps
  extends React.HTMLProps<HTMLDivElement>,
    GlobalStateComponentProps<"loggedInUser"> {
  /** Permissions add to this array will be required to see the internal content **/
  permissions: AclEnum[];
  /** While this is true, the container will no longer use the Acls to determine access permissions for the children and will let anyone see it **/
  unlockOverride?: boolean;
}

interface IPermissionGateState {
  anyPermissionMissing: boolean;
  permissionChecked: boolean;
}

/**
 * PermissionGate - Checks a user's ACLs and provides access to this components children only if the ACL requirements are met
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
      anyPermissionMissing: true,
      permissionChecked: false,
    };
  }

  public componentDidMount() {
    if (
      UserUtils.isAuthenticated(this.props.globalState) &&
      !this.state.permissionChecked
    ) {
      // Check if the user is missing any required permissions
      this.checkPermissions();
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<IPermissionGateProps>,
    prevState: Readonly<IPermissionGateState>,
    snapshot?: any
  ) {
    if (
      UserUtils.isAuthenticated(this.props.globalState) &&
      !this.state.permissionChecked
    ) {
      // Check if the user is missing any required permissions
      this.checkPermissions();
    }
  }

  public render() {
    if (
      !UserUtils.isAuthenticated(this.props.globalState) ||
      !this.state.permissionChecked
    ) {
      return null;
    }

    return !this.state.anyPermissionMissing || this.props.unlockOverride ? (
      <div>{this.props.children || null}</div>
    ) : null;
  }

  private checkPermissions() {
    const anyPermissionMissing = this.props.permissions.some(
      (p) => this.props.globalState?.loggedInUser?.userAcls?.indexOf(p) === -1
    );

    this.setState({
      permissionChecked: true,
      anyPermissionMissing: anyPermissionMissing,
    });
  }
}

export const PermissionsGate = withGlobalState(PermissionGateInner, [
  "loggedInUser",
]);
