// Created by atseng, 2021
// Copyright Bungie, Inc.

import { DetailedError } from "@CustomErrors";
import * as Globals from "@Enum";
import styles from "./ProfileErrorBoundary.module.scss";
import { Logger } from "@Global/Logger";
import { Platform } from "@Platform";
import React, { ReactElement } from "react";
import { BiError } from "@react-icons/all-files/bi/BiError";

interface ProfileErrorBoundaryProps {
  message?: string | ReactElement;
  children?: React.ReactNode;
}

interface ProfileErrorBoundaryState {
  message: string | ReactElement;
  error: Error;
}

export class ProfileErrorBoundary extends React.Component<
  ProfileErrorBoundaryProps,
  ProfileErrorBoundaryState
> {
  constructor(props: ProfileErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
      message: this.props.message ?? "",
    };
  }

  public componentDidCatch(error: Error) {
    try {
      let message = error.message;
      if (error instanceof DetailedError) {
        message = error.logMessage;
      }

      if (this.state.message === "") {
        //show the Error's message if no default message
        this.setState({
          message: message,
        });
      }

      Platform.RendererService.ServerLog({
        Url: window.location.href,
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

  public render() {
    return this.state.error ? this.renderErrorDisplay() : this.props.children;
  }

  private renderErrorDisplay() {
    return (
      <div className={styles.errorBlock}>
        <BiError />
        {this.state.message}
      </div>
    );
  }
}
