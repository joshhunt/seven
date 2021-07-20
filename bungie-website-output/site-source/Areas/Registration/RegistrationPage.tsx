// Created by atseng, 2020
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { BungieCredentialType } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
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

  public componentDidMount() {
    if (!UserUtils.isAuthenticated(this.props.globalState)) {
      const alternateContentVersionEnabled = ConfigUtils.SystemStatus(
        "RegistrationUpsellContentVersion2"
      );

      const contentTag = alternateContentVersionEnabled
        ? "RegistrationVersion2"
        : "Registration";

      const queryString = UrlUtils.QueryToObject(window.location.search);

      const platformType = queryString["platform"];

      const bungieCredential = UserUtils.getCredentialTypeFromPlatformString(
        platformType
      );

      if (platformType?.length > 0) {
        this.setState({ platform: bungieCredential });
      }

      //load the content set
      Platform.ContentService.GetContentByTagAndType(
        contentTag,
        "ContentSet",
        Localizer.CurrentCultureName,
        true
      )
        .then((response) =>
          this.setState({
            contentRenderable: response,
          })
        )
        .catch(ConvertToPlatformError)
        .catch((e: PlatformError) => {
          Modal.error(e);
        });
    }
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

    if (isSignedIn) {
      if (benefitsEnabled) {
        return <Redirect to={RouteHelper.RegistrationBenefits().url} />;
      } else {
        location.href = RouteHelper.Home.url;
      }

      return null;
    }

    const metaTitle = Localizer.Registrationbenefits.JoinUp;
    const metaImage = `/7/ca/bungie/bgs/header_registration.png`;
    const metaSubtitle = Localizer.Registrationbenefits.JoinMissionsOfGuardians;

    const joinUp = Localizer.Registrationbenefits.JoinUp;
    const joinUpDesc = Localizer.Registrationbenefits.JoinMissionsOfGuardians;
    const btnJoin = Localizer.Registrationbenefits.JoinBungie;

    const pageLoaded = this.state.contentRenderable !== null;

    if (!pageLoaded) {
      return <SpinnerContainer loading={true} />;
    }

    //contentset contains everything -> contentset for each section
    const content = this.state.contentRenderable.properties;

    const pageHasContent = content["ContentItems"]?.length > 0;

    return (
      <React.Fragment>
        <BungieHelmet
          title={metaTitle}
          image={metaImage}
          description={metaSubtitle}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.header}>
          <h2>{joinUp}</h2>
          <p>{joinUpDesc}</p>
          <JoinUpButton
            targetCredential={this.state.platform}
            buttonType={"gold"}
            size={BasicSize.Large}
            analyticsId={"RegistrationPageJoinButton"}
          >
            {btnJoin}
          </JoinUpButton>
        </div>
        <Grid className={styles.bodyContent}>
          <GridCol cols={12}>
            {pageHasContent &&
              content["ContentItems"].map((contentItem: any) => (
                <RegistrationContentItem
                  contentItem={contentItem}
                  key={`${contentItem.contentId}-${Date.UTC}`}
                />
              ))}
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withGlobalState(RegistrationPage, ["loggedInUser"]);
