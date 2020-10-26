import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Error404 } from "@UI/Errors/Error404";
import { SwitchProps } from "react-router";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";

interface ISwitchWithErrorsProps extends SwitchProps {}

interface ISwitchWithErrorsState {}

/**
 * Rather than using <Switch>, we want one that automatically handles 404 states, etc.
 *  *
 * @param {ISwitchWithErrorsProps} props
 * @returns
 */
export class SwitchWithErrors extends React.Component<
  ISwitchWithErrorsProps,
  ISwitchWithErrorsState
> {
  constructor(props: ISwitchWithErrorsProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { ...rest } = this.props;

    return (
      <Switch {...rest}>
        {this.props.children}
        <Route component={Error404} />
      </Switch>
    );
  }
}
