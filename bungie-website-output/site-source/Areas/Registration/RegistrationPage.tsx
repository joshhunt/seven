// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { BungieCredentialType } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { JoinUpButton } from "@UI/User/JoinUpButton";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { AuthChangeStatus, UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Redirect } from "react-router-dom";
import styles from "./RegistrationPage.module.scss";
import { RegistrationContentItem } from "./Shared/RegistrationContentItem";

// Required props
interface IRegistrationPageProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps {}

// Default props - these will have values set in RegistrationPage.defaultProps
interface DefaultProps {}

type Props = IRegistrationPageProps & DefaultProps;

interface IRegistrationPageState {
  contentRenderable: Content.ContentItemPublicContract;
  platform: BungieCredentialType | null;
}

/**
 * RegistrationPage - Replace this description
 *  *
 * @param {IRegistrationPageProps} props
 * @returns
 */
class RegistrationPage extends React.Component<Props, IRegistrationPageState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contentRenderable: null,
      platform: null,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      UserUtils.getAuthChangeStatus(this.props, prevProps) ===
      AuthChangeStatus.UserLoggedIn
    ) {
      ConfigUtils.updateSettings();
    }
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const benefitsEnabled = ConfigUtils.SystemStatus(
      "RegistrationBenefitsEnabled"
    );

    const isSignedIn = UserUtils.isAuthenticated(this.props.globalState);
    if (!isSignedIn) {
      return <Redirect to={RouteHelper.SignIn().url} />;
    }

    if (isSignedIn) {
      if (benefitsEnabled) {
        return <Redirect to={RouteHelper.RegistrationBenefits().url} />;
      } else {
        location.href = RouteHelper.Home.url;
      }

      return null;
    }

    const pageLoaded = this.state.contentRenderable !== null;

    if (!pageLoaded) {
      return <SpinnerContainer loading={true} />;
    }

    //contentset contains everything -> contentset for each section
    const content = this.state.contentRenderable.properties;

    return null;
  }
}

export default withGlobalState(RegistrationPage, ["loggedInUser"]);
