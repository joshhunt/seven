// Created by atseng, 2019
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization";
import { EmailValidationStatus, OptInFlags } from "@Enum";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import { Checkbox } from "@UI/UIKit/Forms/Checkbox";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import styles from "./UserResearch.module.scss";

// Required props
interface IUserResearchProps
  extends GlobalStateComponentProps<"loggedInUser"> {}

interface IUserResearchState {
  optedInUR: boolean;
  user: Contract.UserDetail;
  emailVerified: boolean;
  canTravel: boolean;
}

/**
 * PlayTest - A page that describes how one can opt in to User Research Play Tests
 *  *
 * @param {IUserResearchProps} props
 * @returns
 */
class UserResearch extends React.Component<
  IUserResearchProps,
  IUserResearchState
> {
  constructor(props: IUserResearchProps) {
    super(props);

    this.state = {
      optedInUR: false,
      user: null,
      emailVerified: false,
      canTravel: false,
    };
  }

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
      prevProps.globalState.loggedInUser !==
        this.props.globalState.loggedInUser &&
      UserUtils.isAuthenticated(this.props.globalState)
    ) {
      await this.loadUser();
    }

    if (
      prevState.optedInUR !== this.state.optedInUR ||
      prevState.canTravel !== this.state.canTravel
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
                      url={RouteHelper.LegalPage({
                        pageName: "privacypolicy",
                      })}
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

    const usersEmail = this.props.globalState.loggedInUser?.email;

    const changeEmailSettingsLink = RouteHelper.Settings({
      membershipId: this.props.globalState.loggedInUser?.user?.membershipId,
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

    const emailSettingsLink = RouteHelper.EmailAndSms();

    return (
      <>
        <div className={styles.settingsSection}>
          <div className={styles.emailContainer}>
            <p>
              <span>{emailsWillBeSent}</span>
              <Anchor url={changeEmailSettingsLink}>{changeEmailLink}</Anchor>
            </p>

            {!this.state.emailVerified && !this.state.optedInUR && (
              <p>
                <Anchor url={emailSettingsLink}>{emailNotVerified}</Anchor>
              </p>
            )}

            {!this.state.emailVerified && this.state.optedInUR && (
              <p>
                <Anchor url={emailSettingsLink}>{emailNotVerifiedBut}</Anchor>
              </p>
            )}
          </div>
          <Checkbox
            checked={this.state.optedInUR}
            onChecked={(checked) => this.setState({ optedInUR: checked })}
            label={optInLabel}
          />

          {this.state.optedInUR && (
            <div className={styles.travelContainer}>
              <Checkbox
                onChecked={(checked) => this.setState({ canTravel: checked })}
                checked={this.state.canTravel}
                label={canTravelLabel}
                disabled={!this.state.emailVerified && !this.state.optedInUR}
              />
            </div>
          )}
        </div>
      </>
    );
  }

  private updateUserSettings() {
    const originalEmailPreferences = this.props.globalState?.loggedInUser
      ?.emailUsage;
    const originalOptedIn =
      (parseInt(originalEmailPreferences, 10) & OptInFlags.PlayTests) !== 0;
    const originalCanTravel =
      (parseInt(originalEmailPreferences, 10) & OptInFlags.PlayTestsLocal) !==
      0;
    const optInChanged = originalOptedIn !== this.state.optedInUR;
    const travelChanged = originalCanTravel !== this.state.canTravel;

    // if can travel is true, opting into travel must also be true

    const addedOptIns =
      (this.state.optedInUR && optInChanged
        ? OptInFlags.PlayTests
        : OptInFlags.None) |
      (this.state.canTravel && travelChanged
        ? OptInFlags.PlayTestsLocal
        : OptInFlags.None);

    const removeOptIns =
      (!this.state.optedInUR && optInChanged
        ? OptInFlags.PlayTests
        : OptInFlags.None) |
      (!this.state.canTravel && travelChanged
        ? OptInFlags.PlayTestsLocal
        : OptInFlags.None);

    const input: Contract.UserEditRequest = {
      membershipId: this.state.user.user.membershipId,
      addedOptIns: addedOptIns.toString(),
      removedOptIns: removeOptIns.toString(),
      displayName: null,
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
      (parseInt(user?.emailUsage, 10) & OptInFlags.PlayTests) !== 0;

    const canTravel =
      (parseInt(user?.emailUsage, 10) & OptInFlags.PlayTestsLocal) !== 0;

    this.setState({
      user: user,
      optedInUR: optedIn,
      canTravel: canTravel,
      emailVerified: user.emailStatus === EmailValidationStatus.VALID,
    });
  }
}

export default withGlobalState(UserResearch, ["loggedInUser"]);
