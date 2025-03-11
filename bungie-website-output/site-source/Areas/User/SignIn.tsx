// Created by atseng, 2020
// Copyright Bungie, Inc.

import {
  GlobalState,
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { User } from "@Platform";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { Auth } from "@UI/User/Auth";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import * as React from "react";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import AuthStepsContainer from "@UI/User/Authentication/AuthStepsContainer";

// Required props
interface ISignInProps extends GlobalStateComponentProps<"loggedInUser"> {
  customLabel: string;
  referrer?: string;
}

// Default props - these will have values set in SignIn.defaultProps
interface DefaultProps {}

export type SignInProps = ISignInProps & DefaultProps;

interface ISignInState {
  referrer: string;
  isRedirecting: boolean;
}

/**
 * SignIn - Sign In page
 *  *
 * @param {ISignInProps} props
 * @returns
 */
class SignIn extends React.Component<SignInProps, ISignInState> {
  constructor(props: SignInProps) {
    super(props);

    this.state = {
      referrer: props.referrer ?? "/",
      isRedirecting: false,
    };
  }

  public componentDidMount() {
    if (UserUtils.isAuthenticated(this.props.globalState)) {
      this.redirect(this.props.globalState.loggedInUser?.user);
    }

    const params = new URLSearchParams(window.location.search);
    const referrerFromQuery = params.get("bru");

    if (referrerFromQuery) {
      this.setState({ referrer: referrerFromQuery || "/" });
    }
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    if (this.state.isRedirecting) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }

    const query = new URLSearchParams(window.location.search);

    //loc key for custom string
    const titleKey = query.has("title") ? query.get("title") : "";

    const customLabel =
      titleKey !== ""
        ? Localizer.Registration[titleKey]
        : this.props.customLabel?.length > 0
        ? this.props.customLabel
        : Localizer.Registration.SelectYourPlatform;

    /* TODO: This is placeholder to allow us the opportunity to test these changes (only ON for int, near, and local). */
    /* NOTE:
			This should probably be replaced by another component that captures the
			larger auth flow and renders the appropriate views at the appropriate time when we are further along?
			*/
    return ConfigUtils.SystemStatus("FeatureMultiFranchiseAuthUpdate") ? (
      <AuthStepsContainer />
    ) : (
      <Auth
        onSignIn={(tempGlobalState) =>
          this.redirect(tempGlobalState.loggedInUser?.user)
        }
        customLabel={customLabel}
        referrer={this.state.referrer}
        mode="standalone"
      />
    );
  }

  private redirect(user: User.GeneralUser): void {
    this.setState({
      isRedirecting: true,
    });

    let url = this.state.referrer;

    if (
      user.firstAccess?.length > 0 &&
      DateTime.now().diff(DateTime.fromISO(user.firstAccess)).minutes < 10
    ) {
      //new account created - critera is less than 10 min ago
      //ex. firstAccess: 2020-06-30T15:42:25.457Z
      //redirect to registration page

      url = "/Registration";
    }

    /**
     * Rather than doing a typical redirect usingwindow.location.href here,
     * we will do a replaceState and a reload, thus effectively redirecting
     * but without adding to the history
     */
    const href = UrlUtils.getHrefAsLocation(url);
    UrlUtils.redirectWithoutHistory(href.pathname);
  }
}

export default withGlobalState(SignIn, ["loggedInUser"]);
