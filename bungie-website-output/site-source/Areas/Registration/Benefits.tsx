// Created by atseng, 2020
// Copyright Bungie, Inc.

import { EmailVerified } from "@UI/User/EmailVerified";
import * as React from "react";
import styles from "./Benefits.module.scss";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { EmailValidationStatus } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { Redirect } from "react-router";
import { Platform, Content, Contract } from "@Platform";
import { Localizer } from "@bungie/localization";
import { Spinner, SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { RewardsBanner } from "./Banners/RewardsBanner";
import { SettingsBanners } from "./Banners/SettingsBanners";
import { LocalStorageUtils } from "@Utilities/StorageUtils";
import { PlatformError } from "@CustomErrors";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { RegistrationContentItem } from "./Shared/RegistrationContentItem";

// Required props
interface IBenefitsProps extends GlobalStateComponentProps<"loggedInUser"> {}

// Default props - these will have values set in Benefits.defaultProps
interface DefaultProps {}

type Props = IBenefitsProps & DefaultProps;

interface IBenefitsState {
  contentRenderable: Content.ContentItemPublicContract;
  showProfileCallout: boolean;
}

/**
 * Benefits - Registration Benefits page
 *  *
 * @param {IBenefitsProps} props
 * @returns
 */
class Benefits extends React.Component<Props, IBenefitsState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contentRenderable: null,
      showProfileCallout:
        LocalStorageUtils.getItem("showProfileCallout") !== "false",
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    let contentSetTag = "Registration-Benefits";

    if (ConfigUtils.SystemStatus("RegistrationBenefitsContentVersion2")) {
      contentSetTag = "Registration-Benefits-test";
    }

    //load the content set
    Platform.ContentService.GetContentByTagAndType(
      contentSetTag,
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

  public render() {
    const benefitsEnabled = ConfigUtils.SystemStatus(
      "RegistrationBenefitsEnabled"
    );
    if (!benefitsEnabled) {
      location.href = "/";

      return null;
    }

    const isSignedIn = UserUtils.isAuthenticated(this.props.globalState);

    if (!isSignedIn) {
      return <Redirect to={RouteHelper.Registration().url} />;
    }

    if (this.state.contentRenderable === null) {
      return <SpinnerContainer loading={true} />;
    }

    const metaTitle = Localizer.Registrationbenefits.RegistrationBenefits;
    const metaImage = "/7/ca/bungie/bgs/header_benefits.png";
    const metaSubtitle =
      Localizer.Registrationbenefits.WelcomeToBungieTakeAMinute;

    const avatarPath = this.props.globalState.loggedInUser.user
      .profilePicturePath;
    const displayName = UserUtils.getBungieNameFromBnetGeneralUser(
      this.props?.globalState?.loggedInUser?.user
    )?.bungieGlobalName;

    const headerDesc =
      Localizer.Registrationbenefits.WelcomeToBungieTakeAMinute;
    const accountSettings = Localizer.Registrationbenefits.AccountSettings;

    const verifyYourEmail = Localizer.Registrationbenefits.VerifyYourEmail;
    const resendEmail = Localizer.Registrationbenefits.ResendEmail;
    const emailSettings = Localizer.Registrationbenefits.EmailSettings;
    const emailVerified =
      (this.props.globalState.loggedInUser.emailStatus &
        EmailValidationStatus.VALID) ===
      EmailValidationStatus.VALID;
    const content = this.state.contentRenderable.properties;

    const pageHasContent = content["ContentItems"]?.length > 0;

    const yourProfile = Localizer.Registrationbenefits.YourProfileLivesHere;
    const yourProfileDesc =
      Localizer.Registrationbenefits.RedeemCodesManageSettings;
    const gotItButton = Localizer.Registrationbenefits.IGotIt;

    return (
      <React.Fragment>
        <BungieHelmet
          title={metaTitle}
          image={metaImage}
          description={metaSubtitle}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        {this.state.showProfileCallout && (
          <div className={styles.profileCallout}>
            <strong>{yourProfile}</strong>
            <p>{yourProfileDesc}</p>
            <Button
              buttonType={"gold"}
              onClick={() => this.hideProfileCallout()}
            >
              {gotItButton}
            </Button>
          </div>
        )}
        <div className={styles.header}>
          <img className={styles.avatar} src={avatarPath} />
          <div className={styles.displayName}>{displayName}</div>
          <Anchor
            url={RouteHelper.NewSettings("index")}
            className={styles.linkToSettings}
          >
            {accountSettings}
          </Anchor>
          <p>{headerDesc}</p>
        </div>

        <Grid className={styles.bodyContent}>
          {!emailVerified && (
            <div className={styles.containerVerifyEmail}>
              <Grid>
                <GridCol cols={12}>
                  <div className={styles.verifyEmail}>
                    <Icon iconName={"exclamation-triangle"} iconType={"fa"} />
                    <div className={styles.text}>
                      <strong>{verifyYourEmail}</strong>
                      <p>
                        {Localizer.Format(
                          Localizer.Registrationbenefits
                            .AVerifiedEmailIsRequired,
                          { email: this.props.globalState.loggedInUser.email }
                        )}
                      </p>
                    </div>
                    <div className={styles.buttons}>
                      <Button
                        buttonType={"gold"}
                        url={RouteHelper.ResendEmailVerification(
                          this.props.globalState.loggedInUser.user.membershipId
                        )}
                      >
                        {resendEmail}
                      </Button>
                      <Button
                        buttonType={"white"}
                        url={RouteHelper.Settings({
                          category: "Notifications",
                        })}
                      >
                        {emailSettings}
                      </Button>
                    </div>
                  </div>
                </GridCol>
              </Grid>
            </div>
          )}
          <GridCol cols={12}>
            <EmailVerified className={styles.emailVerified} />
            <SettingsBanners
              emailUsage={parseInt(
                this.props.globalState.loggedInUser.emailUsage,
                10
              )}
              emailVerified={emailVerified}
              membershipId={
                this.props.globalState.loggedInUser.user.membershipId
              }
            />
            <RewardsBanner
              emailVerified={emailVerified}
              membershipId={
                this.props.globalState.loggedInUser.user.membershipId
              }
            />

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

  private hideProfileCallout() {
    LocalStorageUtils.setItem("showProfileCallout", "false");

    this.setState({
      showProfileCallout: false,
    });
  }
}

export default withGlobalState(Benefits, ["loggedInUser"]);
