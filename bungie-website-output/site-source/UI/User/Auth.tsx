import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import * as Globals from "@Enum";
import {
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { Img } from "@Helpers";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { RefObject, useEffect, useState } from "react";
import styles from "./RequiresAuth.module.scss";

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
  /**
   * If you want to do something when the modal is closed
   */
  onClose?: () => void;
  /*
   * Passes the model ref to allow some control of the modal within a child
   * */
  modalRef?: React.RefObject<Modal>;
}

type Props = IAuthProps & Partial<DefaultProps>;

export const ShowAuthModal = (
  authProps: Props = {},
  existingModalRef?: RefObject<Modal>
) => {
  const modalRef = existingModalRef ?? React.createRef<Modal>();

  Modal.open(
    <AuthInternal {...authProps} modalRef={modalRef} />,
    {
      isFrameless: true,
      preventUserClose: authProps.preventModalClose,
      className: styles.authModal,
      onClose: () => authProps.onClose?.(),
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

/** TODO: 10/17/24 - After period stability:
 *	 Remove original AuthInternal
 *   Rename this to AuthInternal in a deprecation pass of the original AuthInternal class
 *   Remove the Feature Flag FeatUseFunctionalAuthInternal
 * */
const AuthInternal: React.FC<Props> = (props: Props) => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);

  const { coreSettings } = globalState;
  const showLearnMoreEnabled = ConfigUtils.SystemStatus("SignInLearnMore");
  const userIsAuthed = UserUtils.isAuthenticated(globalState);

  const redirectUser = () => {
    window.location.href = props.referrer;
  };

  if (!userIsAuthed && !coreSettings) {
    return <SpinnerContainer loading={true} />;
  } else {
    if (userIsAuthed) {
      /*
       * This triggers after the user has signed in.
       * Execute the 'onSignIn', close the modal (if it exists)
       *  */
      props.onSignIn(globalState);
      props?.modalRef?.current?.close();
    }
  }

  const psnSystem = coreSettings.systems.PSNAuth;
  const xuidSystem = coreSettings.systems.XuidAuth;
  const battleNetSystem = coreSettings.systems.Blizzard;
  const stadiaSystem = coreSettings.systems.StadiaIdAuth;
  const steamSystem = coreSettings.systems.SteamIdAuth;
  const egsSystem = coreSettings.systems.EpicIdAuth;
  const twitchSystem = coreSettings.systems.Twitch;

  const label = props.customLabel ?? Localizer.Registration.SelectYourPlatform;

  return (
    <SystemDisabledHandler systems={["Authentication"]}>
      <div
        className={classNames(styles.requiresAuth, {
          [styles.modal]: props.mode === "modal",
        })}
        id={"auth-two"}
      >
        {props.referrer?.length > 0 && (
          <Button onClick={() => redirectUser()} className={styles.backButton}>
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
            {psnSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.Psnid}
                credential={Globals.BungieCredentialType.Psnid}
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
            {steamSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.SteamId}
                credential={Globals.BungieCredentialType.SteamId}
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
            {xuidSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.Xuid}
                credential={Globals.BungieCredentialType.Xuid}
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
            {battleNetSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.BattleNetId}
                credential={Globals.BungieCredentialType.BattleNetId}
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
            {stadiaSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.StadiaId}
                credential={Globals.BungieCredentialType.StadiaId}
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
                  {stadiaSystem && (
                    <div className={styles.twoLine}>
                      <span>{Localizer.Registration.stadiaauthleaving}</span>
                    </div>
                  )}
                </Button>
              </AuthTrigger>
            )}
            {egsSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.EgsId}
                credential={Globals.BungieCredentialType.EgsId}
              >
                <Button className={styles.authTriggerButton}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${Img(
                        `/bungie/icons/logos/egs/icon.png`
                      )})`,
                      backgroundSize: `auto 2.5rem`,
                    }}
                  />
                  {Localizer.Registration.networksigninoptionegs}
                </Button>
              </AuthTrigger>
            )}
            {twitchSystem?.enabled && (
              <AuthTrigger
                key={Globals.BungieCredentialType.TwitchId}
                credential={Globals.BungieCredentialType.TwitchId}
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
          {showLearnMoreEnabled && (
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
};

export const Auth = AuthWrapper;
