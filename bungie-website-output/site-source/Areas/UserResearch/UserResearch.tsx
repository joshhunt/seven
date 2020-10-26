// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./UserResearch.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";
import { Platform, Contract } from "@Platform";
import { OptInFlags, EmailValidationStatus } from "@Enum";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import { Localizer } from "@Global/Localizer";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";

// Required props
interface IUserResearchProps
  extends GlobalStateComponentProps<"loggedInUser"> {}

// Default props - these will have values set in PlayTest.defaultProps
interface DefaultProps {}

type Props = IUserResearchProps & DefaultProps;

interface IUserResearchState {
  optedIn: boolean;
  optInChecked: boolean;
  clickedOptIn: boolean;
  emailVerfied: boolean;
  user: Contract.UserDetail;
  clickedTravel: boolean;
  canTravel: boolean;
  canTravelChecked: boolean;
}

/**
 * PlayTest - A page that describes how one can opt in to User Research Play Tests
 *  *
 * @param {IUserResearchProps} props
 * @returns
 */
class UserResearch extends React.Component<Props, IUserResearchState> {
  private readonly checkboxTravelRef: React.RefObject<Checkbox>;

  constructor(props: Props) {
    super(props);

    this.state = {
      optedIn: false,
      user: null,
      optInChecked: false,
      clickedOptIn: false,
      emailVerfied: false,
      clickedTravel: false,
      canTravel: false,
      canTravelChecked: false,
    };

    this.checkboxTravelRef = React.createRef();
  }

  public static defaultProps: DefaultProps = {};

  public async componentDidMount() {
    if (UserUtils.isAuthenticated(this.props.globalState)) {
      await this.loadUser();
    }
  }

  public async componentDidUpdate(
    prevProps: IUserResearchProps,
    prevState: IUserResearchState
  ) {
    if (
      prevProps.globalState.loggedInUser !== this.props.globalState.loggedInUser
    ) {
      await this.loadUser();
    }

    if (
      (this.state.clickedOptIn && prevState.optedIn !== this.state.optedIn) ||
      (this.state.clickedTravel && prevState.canTravel !== this.state.canTravel)
    ) {
      this.updateUserSettings();
    }
  }

  public render() {
    const title = Localizer.Userresearch.SignUpForUserResearch;

    const desc = Localizer.Userresearch.WeWantFeedbackFromEveryone;

    const viewPrivacy = Localizer.Userresearch.ViewPrivacyStatement;
    const desc1 = Localizer.Userresearch.ThankYouForYourInterest;
    const desc3 = Localizer.Userresearch.PleaseNoteThatParticipating;
    const desc4 = Localizer.Userresearch.IfYouOptInYouMayBeAsked;

    const customDisabledMessage = Localizer.Userresearch.CurrentlyDisabledCheck;

    const signUpForPlaytests = Localizer.Userresearch.SignUpForUserResearch;

    const signInNow = Localizer.Userresearch.SignInNowToOptIn;

    return (
      <React.Fragment>
        <BungieHelmet
          title={title}
          image={"/7/ca/bungie/icons/logos/logo-UR-light.png"}
          description={desc}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div className={styles.headerBungie}>
          <Grid isTextContainer={true}>
            <GridCol cols={12}>
              <h2>{signUpForPlaytests}</h2>
            </GridCol>
          </Grid>
        </div>
        <Grid isTextContainer={true}>
          <GridCol cols={12}>
            <SystemDisabledHandler
              systems={["PlayTestsSetting"]}
              customString={customDisabledMessage}
            >
              <div className={styles.playTestContainer}>
                <div>
                  <p className="linkPrivacy">
                    <Anchor
                      url={RouteHelper.LegalPrivacyPolicy()}
                      target="_blank"
                    >
                      {viewPrivacy}
                    </Anchor>
                  </p>
                  <div>
                    <p>{desc1}</p>
                    <p>{desc3}</p>
                    <p>{desc4}</p>
                  </div>
                </div>
                <RequiresAuth customLabel={signInNow}>
                  {UserUtils.isAuthenticated(this.props.globalState) &&
                    this.state.user !== null && (
                      <React.Fragment>
                        {this.renderBasedOnEmailVerification()}
                      </React.Fragment>
                    )}
                </RequiresAuth>
              </div>
            </SystemDisabledHandler>
          </GridCol>
        </Grid>
      </React.Fragment>
    );
  }

  private renderBasedOnEmailVerification() {
    const optInLabel = Localizer.Userresearch.OptInForUserResearch;

    const canTravelLabel =
      Localizer.Userresearch.ICanProvideMyOwnTransportation;

    const usersEmail = this.props.globalState.loggedInUser.email;

    const changeEmailSettingsLink = RouteHelper.Settings({
      membershipId: this.props.globalState.loggedInUser.user.membershipId,
      membershipType: 254,
      category: "Notifications",
    });

    const changeEmailLink = Localizer.Pcmigration.changeemailaddress;

    const emailsWillBeSent = Localizer.Format(
      Localizer.Userresearch.EmailsWillBeSentToUsersemail,
      { usersEmail: usersEmail }
    );

    const emailNotVerified = Localizer.Userresearch.EmailIsNotVerifiedOnce;
    const emailNotVerifiedBut = Localizer.Userresearch.YouHaveOptedInButYour;

    const emailSettingsLink = RouteHelper.ProfileSettings(
      this.props.globalState.loggedInUser.user.membershipId,
      "Notifications"
    );

    return (
      <React.Fragment>
        <div className={styles.settingsSection}>
          <div className={styles.emailContainer}>
            <p className={styles.emailAddress}>
              <span>{emailsWillBeSent}</span>{" "}
              <Anchor url={changeEmailSettingsLink}>{changeEmailLink}</Anchor>
            </p>

            {!this.state.emailVerfied && !this.state.optedIn && (
              <p>
                <Anchor url={emailSettingsLink}>{emailNotVerified}</Anchor>
              </p>
            )}

            {!this.state.emailVerfied && this.state.optedIn && (
              <p>
                <Anchor url={emailSettingsLink}>{emailNotVerifiedBut}</Anchor>
              </p>
            )}
          </div>
          <Checkbox
            onClick={this.handleToggleOptIn}
            onChange={this.checkOptedInStatus}
            checked={this.state.optInChecked}
            label={optInLabel}
          />

          {this.state.optedIn && (
            <div className={styles.travelContainer}>
              <Checkbox
                onClick={this.handleToggleTravel}
                onChange={this.checkTravelStatus}
                checked={this.state.canTravelChecked}
                label={canTravelLabel}
                disabled={!this.state.emailVerfied && !this.state.optedIn}
                ref={this.checkboxTravelRef}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }

  private readonly checkOptedInStatus = () => {
    return this.state.optedIn;
  };

  private readonly checkTravelStatus = () => {
    return this.state.canTravel;
  };

  private readonly handleToggleOptIn = () => {
    const newOptIn = !this.state.optedIn;

    this.setState({
      clickedOptIn: true,
      optedIn: newOptIn,
    });
  };

  private readonly handleToggleTravel = () => {
    const newTravel = !this.state.canTravel;

    this.setState({
      clickedTravel: true,
      canTravel: newTravel,
    });
  };

  private updateUserSettings() {
    //reset the clicked state
    this.setState({
      clickedOptIn: false,
      clickedTravel: false,
    });

    const addedOptIns =
      this.state.optedIn || this.state.canTravel
        ? (
            (this.state.optedIn ? OptInFlags.PlayTests : OptInFlags.None) |
            (this.state.canTravel ? OptInFlags.PlayTestsLocal : OptInFlags.None)
          ).toString()
        : null;

    const removeOptIns =
      !this.state.optedIn || !this.state.canTravel
        ? (
            (!this.state.optedIn ? OptInFlags.PlayTests : OptInFlags.None) |
            (!this.state.canTravel
              ? OptInFlags.PlayTestsLocal
              : OptInFlags.None)
          ).toString()
        : null;

    const input: Contract.UserEditRequest = {
      membershipId: this.state.user.user.membershipId,
      addedOptIns: addedOptIns,
      removedOptIns: removeOptIns,
      displayName: null,
      uniqueName: null,
      about: null,
      locale: null,
      emailAddress: null,
      statusText: null,
    };

    Platform.UserService.UpdateUser(input)
      .then(() => {
        Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
          position: "br",
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }

  private async loadUser() {
    const user = await Platform.UserService.GetCurrentUser();

    const optedIn =
      (parseInt(user.emailUsage, 10) & OptInFlags.PlayTests) !== 0;

    const canTravel =
      (parseInt(user.emailUsage, 10) & OptInFlags.PlayTestsLocal) !== 0;

    this.setState({
      user: user,
      optedIn: optedIn,
      optInChecked: optedIn,
      canTravel: canTravel,
      canTravelChecked: canTravel,
      emailVerfied: user.emailStatus === EmailValidationStatus.VALID,
    });
  }
}

export default withGlobalState(UserResearch, ["loggedInUser"]);
