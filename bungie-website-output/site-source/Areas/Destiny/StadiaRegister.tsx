import * as React from "react";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@bungie/localization";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { ParallaxContainer } from "@UI/UIKit/Layout/ParallaxContainer";
import styles from "Areas/Destiny/PcRegister.module.scss";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import {
  GlobalStateComponentProps,
  GlobalStateDataStore,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { RouteComponentProps } from "react-router";
import { EmailVerificationState } from "@Areas/PCMigration/Shared/PCMigrationModalStagePage";
import { PCMigrationUtilities } from "@Areas/PCMigration/Shared/PCMigrationUtilities";
import { RouteHelper } from "@Routes/RouteHelper";
import classNames from "classnames";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { PlatformError } from "@CustomErrors";
import { Img } from "@Helpers";
import { BungieCredentialType } from "@Enum";
import { UserUtils } from "@Utilities/UserUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
interface IStadiaRegisterProps
  extends GlobalStateComponentProps<"loggedInUser" | "credentialTypes">,
    RouteComponentProps {}

interface IStadiaRegisterState {
  loggedInHere: boolean;
  justSentEmail: boolean;
}

/**
 * PcRegister - Replace this description
 *  *
 * @param {IStadiaRegisterProps} props
 * @returns
 */
class StadiaRegister extends React.Component<
  IStadiaRegisterProps,
  IStadiaRegisterState
> {
  constructor(props: IStadiaRegisterProps) {
    super(props);

    this.state = {
      loggedInHere: false,
      justSentEmail: false,
    };

    this.openAccountLinkWindow = this.openAccountLinkWindow.bind(this);
    this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
  }

  public render() {
    const { globalState } = this.props;

    const headerImage = Img("/bungie/icons/logos/bungienet/logo.png");
    const headerLabel = Localizer.Pcregister.headerlabel;

    const subTitleLabel = Localizer.Pcregister.subtitlelabel;
    const metaImage = "/bungie/icons/logos/bungienet/logo.png";

    const authenticated =
      UserUtils.isAuthenticated(globalState) && globalState.loggedInUser;
    const emailVerified =
      this.userEmailState === EmailVerificationState.Verified;
    const hasStadia = PCMigrationUtilities.HasCredentialType(
      globalState.credentialTypes,
      BungieCredentialType.StadiaId
    );

    const showBungieRewards = hasStadia && authenticated && emailVerified;
    const showEmailVerifyResend =
      hasStadia && authenticated && !emailVerified && !this.state.justSentEmail;
    const showEmailVerifySent =
      hasStadia && authenticated && !emailVerified && this.state.justSentEmail;

    const createBungieAccountDes = Localizer.Pcregister.createBungieAccountDes;
    const createBungieAccount = Localizer.Pcregister.createBungieAccount;

    const linkBungieAccountDes = Localizer.Pcregister.linkBungieAccountDes;
    const linkBungieAccount = Localizer.Pcregister.linkBungieAccount;

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Pcregister.SocialTitle}
          image={metaImage}
          description={Localizer.Pcregister.SocialTitle}
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
          <img src={headerImage} />
          <h2>{headerLabel}</h2>
          <p>{subTitleLabel}</p>

          {!authenticated && (
            <div className={styles.buttonContainer}>
              <AuthTrigger
                key={BungieCredentialType.StadiaId}
                credential={BungieCredentialType.StadiaId}
              >
                <Button buttonType={"gold"}>
                  {Localizer.Pcregister.SignUpStadia}
                </Button>
              </AuthTrigger>
            </div>
          )}

          {authenticated && (
            <div className={styles.warningContainer}>
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
                //stadia users that need to validate thier email.  An email has already been sent but can resend it again.
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

              {authenticated && !hasStadia && (
                //user does not have stadia lined, allow them to link
                <React.Fragment>
                  <h5 className={"section-header"}>
                    {Localizer.Pcregister.linkStadiaeamHeader}
                  </h5>
                  <p>
                    {Localizer.Format(
                      Localizer.Pcregister.linkStadiaDescription,
                      {
                        bungieAccount: UserUtils.getBungieNameFromBnetGeneralUser(
                          this.props?.globalState?.loggedInUser?.user
                        )?.bungieGlobalName,
                      }
                    )}
                  </p>

                  <Button
                    onClick={this.openAccountLinkWindow}
                    buttonType={"gold"}
                  >
                    {Localizer.Pcregister.linkStadiaBtn}
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

  private openStadiaSignInModal() {
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
    const url = `/${Localizer.CurrentCultureName}/User/Link/StadiaId?flowStart=1&force=0`;

    BrowserUtils.openWindow(url, "linkui", () =>
      GlobalStateDataStore.refreshUserAndRelatedData()
    );
  };
}

export default withGlobalState(StadiaRegister, [
  "loggedInUser",
  "credentialTypes",
]);
