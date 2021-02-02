import {
  GlobalStateDataStore,
  GlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import * as Globals from "@Enum";
import { Localizer } from "@Global/Localization/Localizer";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./RequiresAuth.module.scss";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { Contract, Models } from "@Platform";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Img } from "@Helpers";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import React, { useState, useEffect, RefObject } from "react";
import classNames from "classnames";

export type AuthTemporaryGlobalState = GlobalState<
  "loggedInUser" | "credentialTypes"
>;

interface IAuthProps {
  /** Show this label instead of the default "Select your Platform" */
  customLabel?: string;
  /** The path to redirect upon login */
  referrer?: string;
  // No children required for this one
  children?: undefined;
}

interface IAuthState {
  loggedInUser: Contract.UserDetail;
  coreSettings: Models.CoreSettingsConfiguration;
  showLearnMoreEnabled: boolean;
}

interface DefaultProps {
  /** If you want to do something with global state on sign in, we'll pass it here. This global state will not keep updating! */
  onSignIn?: (temporaryGlobalState: AuthTemporaryGlobalState) => void;
  /** The mode to display in */
  mode: "inline" | "modal" | "standalone";
  /** If true AND if mode == "modal", we will automatically open a modal. You may want to set this to false if you are creating your own modal. */
  autoOpenModal: boolean;
  /**
   * If true, the user will be able to close the auth modal
   */
  preventModalClose: boolean;
}

type Props = IAuthProps & Partial<DefaultProps>;

export const ShowAuthModal = (
  authProps: Props = {},
  existingModalRef?: RefObject<Modal>
) => {
  const modalRef = existingModalRef ?? React.createRef<Modal>();

  Modal.open(
    <AuthInternal {...authProps} />,
    {
      isFrameless: true,
      preventUserClose: authProps.preventModalClose,
      className: styles.authModal,
    },
    modalRef
  );

  return modalRef;
};

/**
 * Will wrap the AuthInternal component in various ways depending on the mode
 * @param props
 */
const AuthWrapper: React.FC<Props> = (props) => {
  // If true, the Auth component will render here. Otherwise, it will be in a modal.
  const [shouldRender, setShouldRender] = useState(true);

  // The ref to the modal that will open
  const modalRef = React.createRef<Modal>();

  useEffect(() => {
    if (props.mode === "modal") {
      const { onSignIn: ogOnSignIn, ...rest } = props;

      // Preserve any existing onSignIn functionality but also close the modal
      const onSignIn = (temporaryGlobalState: AuthTemporaryGlobalState) => {
        ogOnSignIn?.(temporaryGlobalState);
        modalRef?.current?.close();
      };

      // Sometimes we may want to render the modal version, but not actually auto-open the modal
      if (props.autoOpenModal) {
        setShouldRender(false);

        ShowAuthModal({ ...rest, onSignIn }, modalRef);
      } else {
        setShouldRender(true);
      }
    }
  }, [props.mode]); // We are going to run this anytime the mode changes

  return shouldRender ? <AuthInternal {...props} /> : null;
};

AuthWrapper.defaultProps = {
  mode: "modal",
  autoOpenModal: true,
  preventModalClose: true,
};

/**
 * This component should be used when the user needs to log in
 *  *
 * @param {IAuthProps} props
 * @returns
 */
class AuthInternal extends React.Component<Props, IAuthState> {
  private destroyGlobalStateListener: DestroyCallback;
  private signInAttemptedFlag = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      loggedInUser: GlobalStateDataStore.state.loggedInUser,
      coreSettings: GlobalStateDataStore.state.coreSettings,
      showLearnMoreEnabled: ConfigUtils.SystemStatus("SignInLearnMore"),
    };
  }

  public static defaultProps: DefaultProps = {
    onSignIn: () => {
      // nothing
    },
    mode: "modal",
    autoOpenModal: true,
    preventModalClose: true,
  };

  public componentDidMount() {
    this.destroyGlobalStateListener = GlobalStateDataStore.observe(
      (data) => {
        // If we get a global state update, check to see if we signed in between them
        if (
          this.signInAttemptedFlag &&
          !this.state.loggedInUser &&
          data.loggedInUser
        ) {
          // Give all the other subscribers
          this.props.onSignIn && this.props.onSignIn(data);
        }

        this.setState({
          loggedInUser: data.loggedInUser,
          coreSettings: data.coreSettings,
        });

        this.signInAttemptedFlag = false;
      },
      ["loggedInUser", "credentialTypes"]
    );
  }

  public componentWillUnmount() {
    this.destroyGlobalStateListener && this.destroyGlobalStateListener();
  }

  private readonly onAuthWindowClosed = () => {
    this.signInAttemptedFlag = true;
  };

  public render() {
    const authed = this.state.loggedInUser !== undefined;

    if (!authed && !this.state.coreSettings) {
      return <SpinnerContainer loading={true} />;
    } else if (authed) {
      return null;
    }

    const coreSettings = this.state.coreSettings;
    const psnSystem = coreSettings.systems.PSNAuth;
    const xuidSystem = coreSettings.systems.XuidAuth;
    const battleNetSystem = coreSettings.systems.Blizzard;
    const stadiaSystem = coreSettings.systems.StadiaIdAuth;
    const steamSystem = coreSettings.systems.SteamIdAuth;
    const twitchSystem = coreSettings.systems.Twitch;

    const label =
      this.props.customLabel ?? Localizer.Registration.SelectYourPlatform;

    return (
      <SystemDisabledHandler systems={["Authentication"]}>
        <div
          className={classNames(styles.requiresAuth, styles[this.props.mode])}
        >
          {this.props.referrer?.length > 0 && (
            <Button
              onClick={() => this.redirect()}
              className={styles.backButton}
            >
              <Icon iconType={"material"} iconName={"keyboard_arrow_left"} />
              {Localizer.Registration.Back}
            </Button>
          )}
          <div className={styles.signInHeader}>
            <h2>{Localizer.Registration.SignIn}</h2>
          </div>
          <div className={styles.signInBody}>
            {label && <div className={styles.label}>{label}</div>}
            <div className={styles.buttonWrapper}>
              {xuidSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.Xuid}
                  credential={Globals.BungieCredentialType.Xuid}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/xbox/icon.png`
                        )})`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptionxbox}
                  </Button>
                </AuthTrigger>
              )}
              {psnSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.Psnid}
                  credential={Globals.BungieCredentialType.Psnid}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/playstation/icon.png`
                        )})`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptionplaystation}
                  </Button>
                </AuthTrigger>
              )}
              {battleNetSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.BattleNetId}
                  credential={Globals.BungieCredentialType.BattleNetId}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/blizzard/icon.png`
                        )})`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptionblizzard}
                  </Button>
                </AuthTrigger>
              )}
              {steamSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.SteamId}
                  credential={Globals.BungieCredentialType.SteamId}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/steam/icon.png`
                        )})`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptionsteam}
                  </Button>
                </AuthTrigger>
              )}
              {stadiaSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.StadiaId}
                  credential={Globals.BungieCredentialType.StadiaId}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/stadia/icon.png`
                        )})`,
                        backgroundSize: `auto 2.5rem`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptionstadia}
                  </Button>
                </AuthTrigger>
              )}
              {twitchSystem?.enabled && (
                <AuthTrigger
                  key={Globals.BungieCredentialType.TwitchId}
                  credential={Globals.BungieCredentialType.TwitchId}
                  onAuthWindowClosed={this.onAuthWindowClosed}
                >
                  <Button className={styles.authTriggerButton}>
                    <div
                      className={styles.icon}
                      style={{
                        backgroundImage: `url(${Img(
                          `/bungie/icons/logos/twitch/icon.png`
                        )})`,
                      }}
                    />
                    {Localizer.Registration.networksigninoptiontwitch}
                  </Button>
                </AuthTrigger>
              )}
            </div>
            {this.state.showLearnMoreEnabled && (
              <div className={styles.learnMore}>
                <p>{Localizer.Registration.DonTHaveABungieNetAccount}</p>
                <ul>
                  <li>
                    <Icon iconType={"bungle"} iconName={"socialteamengram"} />
                    {Localizer.Registration.FreePowerfulRewards}
                  </li>
                  <li>
                    <span className={styles.crossSaveIcon} />
                    {Localizer.Registration.CrossSave}
                  </li>
                  <li>
                    <Icon iconType={"bungle"} iconName={"socialteamclan"} />
                    {Localizer.Registration.Clans}
                  </li>
                  <li>
                    <span className={styles.gearIcon} />
                    {Localizer.Registration.ManageGear}
                  </li>
                </ul>
                <p>
                  <Button
                    analyticsId={"signin-page-learnmore"}
                    url={`/registration`}
                    buttonType={"text"}
                  >
                    {Localizer.Registration.LearnMore}{" "}
                    <Icon
                      iconType={"material"}
                      iconName={"keyboard_arrow_right"}
                    />
                  </Button>
                </p>
              </div>
            )}
          </div>
        </div>
      </SystemDisabledHandler>
    );
  }

  private redirect() {
    window.location.href = this.props.referrer;
  }
}

export const Auth = AuthWrapper;
