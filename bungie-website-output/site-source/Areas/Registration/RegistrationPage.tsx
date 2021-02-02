// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./RegistrationPage.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localization/Localizer";
import { Spinner, SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Redirect } from "react-router-dom";
import { UserUtils, AuthChangeStatus } from "@Utilities/UserUtils";
import { RouteHelper } from "@Routes/RouteHelper";
import { UrlUtils } from "@Utilities/UrlUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { BungieCredentialType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { RouteComponentProps } from "react-router";
import { RegistrationContentItem } from "./Shared/RegistrationContentItem";

export enum PlatformType {
  none,
  psn,
  xbox,
  steam,
  stadia,
  blizzard,
  twitch,
}

interface PlatformTypeToCredential {
  platformType: PlatformType;
  credential: BungieCredentialType;
}

const PlatformTypeToCredentialType: PlatformTypeToCredential[] = [
  {
    platformType: PlatformType.none,
    credential: BungieCredentialType.None,
  },
  {
    platformType: PlatformType.xbox,
    credential: BungieCredentialType.Xuid,
  },
  {
    platformType: PlatformType.blizzard,
    credential: BungieCredentialType.BattleNetId,
  },
  {
    platformType: PlatformType.psn,
    credential: BungieCredentialType.Psnid,
  },
  {
    platformType: PlatformType.stadia,
    credential: BungieCredentialType.StadiaId,
  },
  {
    platformType: PlatformType.steam,
    credential: BungieCredentialType.SteamId,
  },
  {
    platformType: PlatformType.twitch,
    credential: BungieCredentialType.TwitchId,
  },
];

// Required props
interface IRegistrationPageProps
  extends GlobalStateComponentProps<"loggedInUser">,
    RouteComponentProps {}

// Default props - these will have values set in RegistrationPage.defaultProps
interface DefaultProps {}

type Props = IRegistrationPageProps & DefaultProps;

interface IRegistrationPageState {
  contentRenderable: Content.ContentItemPublicContract;
  platform: PlatformType;
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
      platform: PlatformType.none,
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

      if (
        queryString["platform"]?.length &&
        typeof PlatformType[queryString["platform"]] !== "undefined"
      ) {
        this.setState({ platform: PlatformType[queryString["platform"]] });
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

  public componentDidUpdate(prevProps) {
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
          <Button
            buttonType={"gold"}
            size={BasicSize.Large}
            onClick={() => this.openTheJoinModal()}
            analyticsId={"RegistrationPageJoinButton"}
          >
            {btnJoin}
          </Button>
        </div>
        <Grid className={styles.bodyContent}>
          <GridCol cols={12}>
            {pageHasContent &&
              content["ContentItems"].map((contentItem) => (
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

  private openSpecificPlatformSignIn(platform: PlatformType) {
    const credential = PlatformTypeToCredentialType.find(
      (p) => p.platformType === platform
    )?.credential;

    if (typeof credential !== "undefined") {
      const href = `${Localizer.CurrentCultureName}/User/SignIn/${BungieCredentialType[credential]}/?flowStart=1`;

      BrowserUtils.openWindow(href, "loginui", () => {
        window.location.reload();
      });
    } else {
      const signInModal = Modal.signIn(() => {
        signInModal.current.close();
      });
    }
  }

  private openTheJoinModal() {
    if (this.state.platform !== PlatformType.none) {
      this.openSpecificPlatformSignIn(this.state.platform);
    } else {
      UserUtils.SignIn(this.props.history, location.pathname);
    }
  }
}

export default withGlobalState(RegistrationPage, ["loggedInUser"]);
