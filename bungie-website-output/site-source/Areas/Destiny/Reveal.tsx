// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./Reveal.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { CalendarUtils, ICalendarOptions } from "@Utilities/CalendarUtils";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { RouteDefs } from "@Routes/RouteDefs";
import { OptInFlags, EmailValidationStatus } from "@Enum";
import { Contract, Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@Global/Localization/Localizer";
import { Toast } from "@UI/UIKit/Controls/Toast/Toast";
import {
  withGlobalState,
  GlobalStateComponentProps,
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import moment from "moment";
import { Anchor } from "@UI/Navigation/Anchor";
import { GridCol, Grid } from "@UI/UIKit/Layout/Grid/Grid";
import classNames from "classnames";

// Required props
interface IRevealProps extends GlobalStateComponentProps<"loggedInUser"> {}

// Default props - these will have values set in Reveal.defaultProps
interface DefaultProps {}

type Props = IRevealProps & DefaultProps;

interface IRevealState {
  postReveal: boolean;
  openCalendarModal: boolean;
  reminderLoading: boolean;
  settingsUpdating: boolean;
}

/**
 * Reveal - Replace this description
 *  *
 * @param {IRevealProps} props
 * @returns
 */
class Reveal extends React.Component<Props, IRevealState> {
  private readonly startTime = `20200609T160000000Z`;
  private readonly revealTime = `2020-06-09T15:45:00.000Z`;
  private readonly url = `https://www.bungie.net/7${
    RouteDefs.Areas.Destiny.getAction("Reveal").resolve().url
  }`;
  private readonly calendarTitle =
    Localizer.Destinyreveal.SeeTheNextStepInTheDestiny;
  private readonly calendarSummary =
    Localizer.Destinyreveal.SeeTheNextStepInTheDestiny;
  private readonly calendarOptions: ICalendarOptions = {
    url: this.url,
    start: this.startTime,
    summary: `${this.calendarSummary}`,
    title: this.calendarTitle,
    location: this.url,
  };

  private readonly aggrgateEmailSetting =
    OptInFlags.Newsletter |
    OptInFlags.Marketing |
    OptInFlags.Social |
    OptInFlags.UserResearch;

  constructor(props: Props) {
    super(props);

    this.state = {
      postReveal: false,
      openCalendarModal: false,
      reminderLoading: false,
      settingsUpdating: false,
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidUpdate() {
    this.checkDateTime();
  }

  public render() {
    const metaImage = "/7/ca/destiny/icons/tricorn.png";

    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Destinyreveal.Destiny2Reveal}
          image={metaImage}
          description={Localizer.Destinyreveal.TuneInToSeeTheNextStep}
        >
          <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
        </BungieHelmet>
        <div
          className={classNames(styles.container, {
            [styles.postRevealContainer]: this.state.postReveal,
          })}
        >
          <div className={styles.bgs} />
          {!this.state.postReveal && this.preRevealView()}
          {this.state.postReveal && this.postRevealView()}
        </div>
      </React.Fragment>
    );
  }

  private preRevealView() {
    const tuneindesc = Localizer.Destinyreveal.TuneInToSeeTheNextStep;
    const date = Localizer.Destinyreveal.June2020;
    const time = Localizer.Destinyreveal.AmPdt;
    const reminderButton = Localizer.Destinyreveal.DownloadCalendarReminder;
    const reminderSetButton = Localizer.Destinyreveal.ReminderSet;
    const signUpEmail = Localizer.Destinyreveal.SignUpForEmailUpdates;
    const signedUpEmail = Localizer.Destinyreveal.AlreadySignedUpForEmail;

    const addGoogle = Localizer.Destinyreveal.AddToGoogleCalendar;
    const addSystem = Localizer.Destinyreveal.AddToSystemCalendar;

    const isLoggedIn = UserUtils.isAuthenticated(this.props.globalState);

    const userAlreadySignedUpUpdates =
      isLoggedIn &&
      this.props.globalState.loggedInUser.emailStatus ===
        EmailValidationStatus.VALID &&
      (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
        this.aggrgateEmailSetting) !==
        0;

    const signUpEmailButton = userAlreadySignedUpUpdates
      ? signedUpEmail
      : signUpEmail;

    const showEmailSettingsButton =
      !isLoggedIn ||
      (isLoggedIn &&
        this.props.globalState.loggedInUser.emailStatus ===
          EmailValidationStatus.VALID &&
        (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
          this.aggrgateEmailSetting) ===
          0);

    return (
      <div className={styles.containerContent}>
        <p className={styles.tuneinDesc}>{tuneindesc}</p>
        <div className={styles.timeBox}>
          <div className={styles.date}>{date}</div>
          <div className={styles.time}>{time}</div>
        </div>
        <Button
          buttonType={showEmailSettingsButton ? "gold" : "disabled"}
          onClick={() => this.handleEmailButton()}
          loading={this.state.settingsUpdating}
        >
          {signUpEmailButton}
        </Button>
        <a
          className={styles.calendarLink}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.toggleCalendarModal();
          }}
        >
          {reminderButton}
        </a>
        <Modal open={this.state.openCalendarModal}>
          <Button onClick={() => this.addGoogleCalendarEvent()}>
            {addGoogle}
          </Button>
          <Button
            className={styles.systemCalendarButton}
            onClick={() => this.addSystemCalendarEvent()}
          >
            {addSystem}
          </Button>
        </Modal>
      </div>
    );
  }

  private postRevealView() {
    const destinyLogo = Localizer.Destinyreveal.Destiny2;
    const destinyNextStep = Localizer.Destinyreveal.SeeTheNextStepInTheDestiny;

    const watchon = Localizer.Destinyreveal.WatchOn;
    const twitch = Localizer.Destinyreveal.Twitch;
    const mixer = Localizer.Destinyreveal.Mixer;
    const youtube = Localizer.Destinyreveal.Youtube;

    return (
      <Grid>
        <GridCol cols={12}>
          <div className={styles.postReveal}>
            <div className={styles.postRevealHeader}>
              <h2 className={styles.destinyLogo}>{destinyLogo}</h2>
              <p className={styles.nextStep}>{destinyNextStep}</p>
            </div>
            <div className={styles.streamContainer}>
              <iframe
                src="https://player.twitch.tv/?channel=bungie&parent=bungie.net"
                height="100%"
                width="100%"
                scrolling="no"
                allowFullScreen={true}
              />
            </div>
            <div className={styles.revealStreamFooter}>
              <span>{watchon}</span>
              <Anchor url={"https://www.twitch.tv/bungie"}>{twitch}</Anchor>
              <Anchor url={"https://mixer.com/Bungie"}>{mixer}</Anchor>
              <Anchor url={"https://www.youtube.com/user/Bungie"}>
                {youtube}
              </Anchor>
            </div>
          </div>
        </GridCol>
      </Grid>
    );
  }

  private toggleCalendarModal() {
    this.setState({
      openCalendarModal: !this.state.openCalendarModal,
    });
  }

  private addGoogleCalendarEvent() {
    this.addToCalendar(CalendarUtils.AddGoogleEvent);
  }

  private addSystemCalendarEvent() {
    this.addToCalendar(CalendarUtils.AddToSystemCalendar);
  }

  private addToCalendar(calendarTypeFunction: Function) {
    this.setState({
      reminderLoading: true,
    });

    calendarTypeFunction(this.calendarOptions);

    this.toggleCalendarModal();

    this.setState({
      reminderLoading: false,
    });
  }

  private handleEmailButton() {
    if (!this.props.globalState.loggedInUser) {
      const loginModal = Modal.signIn(
        (temporaryGlobalState: GlobalState<"loggedInUser">) => {
          loginModal.current.close();

          if (
            temporaryGlobalState.loggedInUser?.emailStatus ===
              EmailValidationStatus.VALID &&
            (parseInt(this.props.globalState.loggedInUser.emailUsage, 10) &
              this.aggrgateEmailSetting) ===
              0
          ) {
            this.updateEmailSettings();
          }
        }
      );
    } else {
      this.updateEmailSettings();
    }
  }

  private updateEmailSettings() {
    this.setState({
      settingsUpdating: true,
    });

    const addedOptIns = this.aggrgateEmailSetting.toString();

    const input: Contract.UserEditRequest = {
      membershipId: this.props.globalState.loggedInUser.user.membershipId,
      addedOptIns: addedOptIns,
      removedOptIns: null,
      displayName: null,
      uniqueName: null,
      about: null,
      locale: null,
      emailAddress: null,
      statusText: null,
    };

    Platform.UserService.UpdateUser(input)
      .then(() => {
        this.setState({
          settingsUpdating: false,
        });

        GlobalStateDataStore.actions.refreshUserAndRelatedData(true);

        Toast.show(Localizer.Userresearch.SettingsHaveChanged, {
          position: "br",
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }

  private checkDateTime() {
    const revealDateTime = moment(this.revealTime);

    if (!this.state.postReveal && moment().isAfter(revealDateTime)) {
      this.setState({
        postReveal: true,
      });
    }
  }
}

export default withGlobalState(Reveal, ["loggedInUser"]);
