// Created by ststew, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@Global/Localization/Localizer";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ParallaxContainer } from "@UI/UIKit/Layout/ParallaxContainer";
import styles from "Areas/Destiny/PcRegister.module.scss";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import classNames from "classnames";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import {
  withGlobalState,
  GlobalStateComponentProps,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { PCMigrationUtilities } from "@Areas/PCMigration/Shared/PCMigrationUtilities";
import { RouteHelper } from "@Routes/RouteHelper";
import { RouteComponentProps } from "react-router";
import { EmailVerificationState } from "@Areas/PCMigration/Shared/PCMigrationModalStagePage";
import { Platform, Contract } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { UserUtils } from "@Utilities/UserUtils";
import { Img } from "@Helpers";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { BungieCredentialType } from "@Enum";

interface IPcRegisterProps
  extends GlobalStateComponentProps<"loggedInUser" | "credentialTypes">,
    RouteComponentProps {}

interface IPcRegisterState {
  loggedInHere: boolean;
  justSentEmail: boolean;
}

/**
 * PcRegister - Replace this description
 *  *
 * @param {IPcRegisterProps} props
 * @returns
 */
class PcRegister extends React.Component<IPcRegisterProps, IPcRegisterState> {
  constructor(props: IPcRegisterProps) {
    super(props);

    this.state = {
      loggedInHere: false,
      justSentEmail: false,
    };

    this.openSteamSignInModal = this.openSteamSignInModal.bind(this);
    this.openAccountLinkWindow = this.openAccountLinkWindow.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
  }

  public render() {
    const { globalState } = this.props;

    const headerLabel = Localizer.Pcregister.headerlabel;

    const subTitleLabel = Localizer.Pcregister.subtitlelabel;
    const metaImage = "/bungie/icons/logos/bungienet/logo.png";

    const authenticated =
      UserUtils.isAuthenticated(globalState) && globalState.loggedInUser;
    const emailVerified =
      this.userEmailState === EmailVerificationState.Verified;
    const hasSteam = PCMigrationUtilities.HasCredentialType(
      globalState.credentialTypes,
      BungieCredentialType.SteamId
    );
    const hasBattleNet = PCMigrationUtilities.HasCredentialType(
      globalState.credentialTypes,
      BungieCredentialType.BattleNetId
    );

    const showBungieRewards = hasSteam && authenticated && emailVerified;
    const showEmailVerifyResend =
      hasSteam && authenticated && !emailVerified && !this.state.justSentEmail;
    const showEmailVerifySent =
      hasSteam && authenticated && !emailVerified && this.state.justSentEmail;

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Pcregister.SocialTitle}
          image={metaImage}
          description={Localizer.Pcregister.SocialSubtitle}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <ParallaxContainer
          className={styles.header}
          parallaxSpeed={2.5}
          isFadeEnabled={true}
          fadeOutSpeed={1000}
          backgroundOffset={0}
        >
          <h1>{headerLabel}</h1>
          <p>{subTitleLabel}</p>

          {!authenticated && (
            <div className={styles.buttonContainer}>
              <AuthTrigger
                key={BungieCredentialType.SteamId}
                credential={BungieCredentialType.SteamId}
              >
                <Button buttonType={"gold"}>
                  {Localizer.Pcregister.SignUpSteam}
                </Button>
              </AuthTrigger>
            </div>
          )}

          {authenticated && (
            <div className={styles.warningContainer}>
              {hasBattleNet && !hasSteam && (
                <React.Fragment>
                  <h5 className={"section-header"}>
                    {Localizer.Pcregister.PcMoveheader}
                  </h5>
                  <p>{Localizer.Pcregister.PcMoveSubtitle}</p>
                  <Button buttonType={"gold"} url={RouteHelper.PCMigration()}>
                    {Localizer.Pcregister.PcMoveheader}
                  </Button>
                  <AuthTrigger isSignOut={true}>
                    <Button buttonType={"white"}>
                      {Localizer.Pcregister.signout}
                    </Button>
                  </AuthTrigger>
                </React.Fragment>
              )}

              {showBungieRewards && (
                //if everything is somehow good show a link to bungie rewards
                <React.Fragment>
                  <h5 className={"section-header"}>
                    {Localizer.Pcregister.BungieRewards}
                  </h5>
                  <p>{Localizer.Pcregister.BungieRewardsDescription}</p>
                  <Button url={RouteHelper.Rewards()} buttonType={"gold"}>
                    {Localizer.Pcregister.BungieRewards}
                  </Button>
                </React.Fragment>
              )}

              {showEmailVerifySent && (
                //shown to users if they created a brand new account
                <React.Fragment>
                  <h5 className={"section-header"}>
                    {Localizer.Pcregister.emailVerification}
                  </h5>
                  <p>
                    {Localizer.Format(
                      Localizer.Pcregister.EmailVerificationSent,
                      {
                        emailAddress: this.props.globalState.loggedInUser.email,
                      }
                    )}
                  </p>
                  <a
                    href={
                      RouteHelper.Settings({ category: "Notifications" }).url
                    }
                  >
                    {Localizer.Pcregister.emailSettings}
                  </a>
                </React.Fragment>
              )}

              {showEmailVerifyResend && (
                //steam users that need to validate thier email.  An email has already been sent but can resend it again.
                <React.Fragment>
                  <h5 className={"section-header"}>
                    {Localizer.Pcregister.emailrequired}
                  </h5>
                  <p>
                    {Localizer.Format(
                      Localizer.Pcregister.verificationwassent,
                      {
                        emailAddress: this.props.globalState.loggedInUser.email,
                      }
                    )}
                  </p>
                  <a
                    className={styles.resendMailLink}
                    onClick={this.sendVerificationEmail}
                  >
                    {Localizer.pcregister.resendemail}
                  </a>
                  <a
                    href={
                      RouteHelper.Settings({ category: "Notifications" }).url
                    }
                  >
                    {Localizer.Pcregister.emailSettings}
                  </a>
                </React.Fragment>
              )}

              {authenticated &&
                //user does not have battlenet linked nor steam, allow them to link
                !hasBattleNet &&
                !hasSteam && (
                  <React.Fragment>
                    <h5 className={"section-header"}>
                      {Localizer.Pcregister.linkSteamHeader}
                    </h5>
                    <p>
                      {Localizer.Format(
                        Localizer.Pcregister.linkSteamDescription,
                        {
                          bungieAccount: this.props.globalState.loggedInUser
                            .user.displayName,
                        }
                      )}
                    </p>

                    <Button
                      onClick={this.openAccountLinkWindow}
                      buttonType={"gold"}
                    >
                      {Localizer.Pcregister.linkSteamBtn}
                    </Button>

                    <AuthTrigger isSignOut={true}>
                      <Button buttonType={"white"}>
                        {Localizer.Pcregister.signout}
                      </Button>
                    </AuthTrigger>
                  </React.Fragment>
                )}
            </div>
          )}
        </ParallaxContainer>

        <div className={styles.setupTopText}>
          <h3 className={classNames(styles.setupTitle, styles.title)}>
            {Localizer.PcRegister.BungieRewards}
          </h3>
          <p className={classNames(styles.setupDesc, styles.subtitle)}>
            {Localizer.PcRegister.BungieRewardsSectionDescription}
          </p>
        </div>

        <Grid className={styles.textAndImage} isTextContainer={true}>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={classNames(styles.textByImage, styles.textOne)}
          >
            <h3 className={styles.title}>
              {Localizer.Pcregister.StepOneTitle}
            </h3>
            <p className={styles.subtitle}>
              {Localizer.Pcregister.StepOneSubtitle}
            </p>
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={styles.imageOne}
          >
            <img src="/7/ca/bungie/bgs/pcregister/engram.jpg" />
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={styles.imageTwo}
          >
            <img src="/7/ca/bungie/bgs/pcregister/bungierewards.jpg" />
          </GridCol>
          <GridCol
            cols={6}
            pico={12}
            tiny={12}
            mobile={12}
            medium={12}
            className={classNames(styles.textByImage, styles.textTwo)}
          >
            <h3 className={styles.title}>
              {Localizer.Pcregister.StepTwoTitle}
            </h3>
            <p className={styles.subtitle}>
              {Localizer.Pcregister.StepTwoSubtitle}
            </p>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }

  private openSteamSignInModal() {
    // Determine if the user logged in on this page
    Modal.signIn((tempGlobalState) =>
      this.setState({
        loggedInHere: UserUtils.isAuthenticated(tempGlobalState),
      })
    );
  }

  public get userEmailState() {
    let emailStatus = EmailVerificationState.None;

    if (this.props.globalState && this.props.globalState.loggedInUser) {
      emailStatus = PCMigrationUtilities.GetEmailValidationStatus(
        this.props.globalState.loggedInUser.emailStatus
      );
    }

    return emailStatus;
  }

  private sendVerificationEmail() {
    Platform.UserService.RevalidateEmail()
      .then(() => {
        // Need to tell the difference between old email sent and new email sent
        this.setState({
          justSentEmail: true,
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  }

  private readonly openAccountLinkWindow = () => {
    const url = `/${Localizer.CurrentCultureName}/User/Link/SteamId?flowStart=1&force=0`;

    BrowserUtils.openWindow(url, "linkui", () =>
      GlobalStateDataStore.refreshUserAndRelatedData()
    );
  };
}

export default withGlobalState(PcRegister, ["loggedInUser", "credentialTypes"]);
