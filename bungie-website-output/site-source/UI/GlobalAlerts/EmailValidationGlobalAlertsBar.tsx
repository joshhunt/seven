// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./EmailValidationGlobalAlertsBar.module.scss";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteHelper } from "@Routes/RouteHelper";
import { PCMigrationUtilities } from "@Areas/PCMigration/Shared/PCMigrationUtilities";
import { EmailVerificationState } from "@Areas/PCMigration/Shared/PCMigrationModalStagePage";
import { GlobalBar } from "./GlobalBar";
import { Localizer } from "@Global/Localization/Localizer";

// Required props
interface IEmailValidationGlobalAlertsBarProps
  extends GlobalStateComponentProps<"loggedInUser"> {}

// Default props - these will have values set in EmailValidationGlobalAlertsBar.defaultProps
interface DefaultProps {}

type Props = IEmailValidationGlobalAlertsBarProps & DefaultProps;

interface IEmailValidationGlobalAlertsBarState {
  showToUser: boolean;
}

/**
 * EmailValidationGlobalAlertsBar - shown to users that have not validated thier emails yet
 *  *
 * @param {IEmailValidationGlobalAlertsBarProps} props
 * @returns
 */
export class EmailValidationGlobalAlertsBar extends React.Component<
  Props,
  IEmailValidationGlobalAlertsBarState
> {
  private readonly localStorageKey = "show-email-validation-alert";

  constructor(props: Props) {
    super(props);

    this.state = {
      showToUser: false,
    };
  }

  public componentDidMount() {
    const isNotVerified =
      this.getEmailValidationState() === EmailVerificationState.NotVerified ||
      this.getEmailValidationState() === EmailVerificationState.Verifying;

    this.setState({
      showToUser: isNotVerified,
    });

    document.documentElement.classList.toggle(
      "global-bar-shown",
      isNotVerified
    );
  }

  private get isLoaded() {
    return this.props.globalState && this.props.globalState.loggedInUser;
  }

  public componentDidUpdate() {
    const isNotVerified =
      this.getEmailValidationState() === EmailVerificationState.NotVerified ||
      this.getEmailValidationState() === EmailVerificationState.Verifying;

    // update the bar state if the user logs in
    if (!this.state.showToUser && this.isLoaded && isNotVerified) {
      this.setState({ showToUser: true });
    }

    //user logs out
    if (this.state.showToUser && this.isLoaded) {
      this.setState({ showToUser: false });
    }
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const message = Localizer.Emails.VerifyYourEmail;

    return (
      <React.Fragment>
        {this.state.showToUser && this.isLoaded && (
          <GlobalBar
            barClassNames={styles.emailValidation}
            showCheckIcon={false}
            showWarningIcon={false}
            message={message}
            url={RouteHelper.ProfileSettings(
              this.props.globalState.loggedInUser.user.membershipId,
              "Notifications"
            )}
            removeable={true}
            localStorageKey={this.localStorageKey}
          />
        )}
      </React.Fragment>
    );
  }

  private getEmailValidationState(): EmailVerificationState {
    if (!this.isLoaded) {
      return EmailVerificationState.None;
    }

    return PCMigrationUtilities.GetEmailValidationStatus(
      this.props.globalState.loggedInUser.emailStatus
    );
  }
}

export default withGlobalState(EmailValidationGlobalAlertsBar, [
  "loggedInUser",
]);
