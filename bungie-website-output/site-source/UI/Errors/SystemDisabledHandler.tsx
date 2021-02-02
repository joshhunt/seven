// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import classNames from "classnames";
import * as React from "react";
import { ValidSystemNames, SystemNames } from "@Global/SystemNames";
import { Localizer } from "@Global/Localization/Localizer";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import styles from "./SystemDisabledHandler.module.scss";

interface ISystemDisabledHandlerProps extends React.HTMLProps<HTMLDivElement> {
  systems: ValidSystemNames[];
  customString?: string;
  className?: string;
}

interface ISystemDisabledHandlerState {
  anySystemDisabled: boolean;
}

/**
 * SystemDisabledHandler - Replace this description
 *  *
 * @param {ISystemDisabledHandlerProps} props
 * @returns
 */
export class SystemDisabledHandler extends React.Component<
  ISystemDisabledHandlerProps,
  ISystemDisabledHandlerState
> {
  constructor(props: ISystemDisabledHandlerProps) {
    super(props);

    this.state = {
      anySystemDisabled: false,
    };
  }

  public componentDidMount() {
    // Of the systems passed down through props, see if any are disabled
    const anySystemDisabled = this.props.systems.some(
      (sys) => !ConfigUtils.SystemStatus(SystemNames[sys])
    );
    this.setState({
      anySystemDisabled,
    });
  }

  public render() {
    return this.state.anySystemDisabled ? (
      <div className={classNames(styles.disabledWrapper, this.props.className)}>
        <div>
          {this.props.customString?.length
            ? this.props.customString
            : Localizer.Errors.DefaultSystemOffline}
        </div>
      </div>
    ) : (
      <div className={this.props.className}>{this.props.children || null}</div>
    );
  }
}
