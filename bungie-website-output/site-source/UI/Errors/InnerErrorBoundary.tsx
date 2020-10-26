import * as React from "react";
import {
  DetailedError,
  PlatformError,
  PageDoesNotExistError,
} from "./CustomErrors";
import { Platform } from "@Platform";
import * as Globals from "@Enum";
import { Logger } from "@Global/Logger";
import { ErrorDisplay } from "./ErrorDisplay";
import { Error404 } from "./Error404";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { DestroyCallback } from "@Global/DataStore";

interface IInnerErrorBoundaryProps extends RouteComponentProps {
  error?: Error;
}

interface IInnerErrorBoundaryState {
  error: Error;
}

/**
 * Displays basic error information
 *  *
 * @param {IInnerErrorBoundaryProps} props
 * @returns
 */
class InnerErrorBoundaryInternal extends React.Component<
  IInnerErrorBoundaryProps,
  IInnerErrorBoundaryState
> {
  private destroyListener: DestroyCallback;

  constructor(props: IInnerErrorBoundaryProps) {
    super(props);

    this.state = {
      error: props.error,
    };
  }

  public render() {
    return this.state.error ? this.renderErrorDisplay() : this.props.children;
  }

  public componentDidMount() {
    this.destroyListener = this.props.history.listen(() => {
      this.setState({
        error: null,
      });
    });
  }

  public componentWillUnmount() {
    this.destroyListener();
  }

  public componentDidCatch(error: Error) {
    try {
      let message = error.message;
      if (error instanceof DetailedError) {
        message = error.logMessage;
      }

      Platform.RendererService.ServerLog({
        Url: location.href,
        LogLevel: Globals.RendererLogLevel.Error,
        Message: message,
        Stack: error.stack,
        SpamReductionLevel: Globals.SpamReductionLevel.Default,
      })
        .then(() => Logger.log("Error logged to server: ", error))
        .catch((e) => null);
    } catch (e) {
      // ignore, we did what we could
    }

    this.setState({
      error,
    });
  }

  private renderErrorDisplay() {
    const isNotFound =
      this.state.error && this.state.error instanceof PageDoesNotExistError;
    if (isNotFound) {
      return <Error404 />;
    }

    return <ErrorDisplay error={this.state.error} />;
  }
}

export const InnerErrorBoundary = withRouter(InnerErrorBoundaryInternal);
