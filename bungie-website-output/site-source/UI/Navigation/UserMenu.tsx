import { DataStore } from "@bungie/datastore";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { BungieCredentialType } from "@Enum";
import {
  GlobalState,
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { NotificationCounts } from "@Global/EventMux/NotificationCount/InternalNotificationViewModel";
import { NotificationCountManager } from "@Global/EventMux/NotificationCount/NotificationCountManager";
import { RouteHelper } from "@Global/Routes/RouteHelper";
import { SystemNames } from "@Global/SystemNames";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import { BungieFriendsNavIcon } from "@UI/Navigation/BungieFriendsNavIcon";
import {
  INavigationTopLink,
  NavigationConfigLegacy,
} from "@UI/Navigation/MainNavigation";
import { MenuItem } from "@UI/Navigation/MenuItem";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Icon } from "@UIKit/Controls/Icon";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Anchor } from "./Anchor";
import LocaleSwitcher from "./LocaleSwitcher";
import styles from "./UserMenu.module.scss";

interface ISignInOutProps
  extends GlobalStateComponentProps<"loggedInUser" | "loggedInUserClans"> {
  /** Triggered when avatar is clicked */
  onToggleUserMenu: () => void;
  /** Triggered when bell is clicked */
  onToggleNotifications: () => void;
}

interface ISignInOutState {
  counts: NotificationCounts;
}

/**
 * Renders the top navigation signed in or out state
 *  *
 * @param {ISignInOutProps} props
 * @returns
 */
class UserMenuInternal extends React.Component<
  ISignInOutProps,
  ISignInOutState
> {
  private readonly unsubs: DestroyCallback[] = [];

  constructor(props: ISignInOutProps) {
    super(props);

    this.state = {
      counts: null,
    };
  }

  private get totalCounts() {
    if (!this.state.counts) {
      return 0;
    }

    return this.state.counts.notifications + this.state.counts.messages;
  }

  public componentDidMount(): void {
    this.unsubs.push(
      NotificationCountManager.viewModel.observe(this.onNotification)
    );
  }

  public componentWillUnmount(): void {
    DataStore.destroyAll(...this.unsubs);
  }

  public render() {
    const globalState = this.props.globalState;
    const isAuthed = UserUtils.isAuthenticated(globalState);

    const loggedInUser = globalState.loggedInUser;
    let title = "",
      background = "";

    if (loggedInUser && loggedInUser?.user) {
      title = UserUtils.getBungieNameFromBnetGeneralUser(loggedInUser?.user)
        ?.bungieGlobalName;
      background = loggedInUser?.user.profilePicturePath;
    }

    const notificationsIconName =
      this.totalCounts > 0 ? "notifications" : "notifications_none";
    const notificationTriggerClasses = classNames(
      styles.trigger,
      styles.notificationsTrigger,
      {
        [styles.hasNotifications]: this.totalCounts > 0,
      }
    );

    return (
      <div className={styles.userAuth}>
        {!isAuthed && <SignInTriggersWithRouter globalState={globalState} />}

        <Anchor
          url={RouteHelper.Search()}
          className={classNames(styles.trigger, styles.searchTrigger)}
        >
          <Icon iconName={"search"} iconType={"material"} />
        </Anchor>

        {isAuthed && (
          <div
            className={classNames(styles.trigger, styles.userMenuTrigger)}
            onClick={this.props.onToggleUserMenu}
          >
            <div
              className={styles.userAvatar}
              title={title}
              style={{ backgroundImage: `url(${background})` }}
            />
          </div>
        )}

        <LocaleSwitcher classes={{ trigger: styles.trigger }} />

        <BungieFriendsNavIcon />

        {isAuthed && (
          <a
            href={RouteHelper.Messages()}
            className={notificationTriggerClasses}
            onClick={(e) => this.onToggleNotifications(e)}
          >
            <Icon iconName={notificationsIconName} iconType={"material"} />

            {this.totalCounts > 0 && (
              <span className={styles.countPip}>{this.totalCounts}</span>
            )}
          </a>
        )}
      </div>
    );
  }

  private readonly onNotification = (counts: NotificationCounts) => {
    this.setState({
      counts,
    });
  };

  private onToggleNotifications(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    this.props.onToggleNotifications();

    return false;
  }
}

export const UserMenu = withGlobalState(
  UserMenuInternal,
  ["loggedInUser", "loggedInUserClans"],
  false
);

interface ISignInTriggersProps extends RouteComponentProps {
  globalState: GlobalState<"loggedInUser" | "loggedInUserClans">;
}

class SignInTriggers extends React.Component<ISignInTriggersProps> {
  public render() {
    const { globalState, history } = this.props;

    const auth = globalState.coreSettings.systems.Authentication;

    const linkProps: INavigationTopLink = {
      Enabled: true,
      External: false,
      Id: "sign-in",
      Legacy: NavigationConfigLegacy.Legacy,
      StringKey: "myaccount",
      SecondaryStringKey: null,
      Url: null,
      NavLinks: null,
      Environment: "live",
      IsDivider: false,
      Overrides: [],
      IsButton: false,
    };

    return (
      <MenuItem className={styles.signIn} link={linkProps} isAuthTrigger={true}>
        {!auth?.enabled && (
          <div className={styles.authDisabled}>
            {Localizer.Nav.SystemDisabledShort}
          </div>
        )}

        <div className={styles.registrationNavHeader}>
          {Localizer.Nav.SignIn}
        </div>

        {ConfigUtils.SystemStatus(SystemNames.PSNAuth) && (
          <AuthTrigger
            key={BungieCredentialType.Psnid}
            credential={BungieCredentialType.Psnid}
          >
            {Localizer.Registration.networksigninoptionplaystation}
          </AuthTrigger>
        )}

        {ConfigUtils.SystemStatus(SystemNames.SteamIdAuth) && (
          <AuthTrigger
            key={BungieCredentialType.SteamId}
            credential={BungieCredentialType.SteamId}
          >
            {Localizer.Registration.networksigninoptionsteam}
          </AuthTrigger>
        )}

        {ConfigUtils.SystemStatus(SystemNames.XuidAuth) && (
          <AuthTrigger
            key={BungieCredentialType.Xuid}
            credential={BungieCredentialType.Xuid}
          >
            {Localizer.Registration.networksigninoptionxbox}
          </AuthTrigger>
        )}

        {ConfigUtils.SystemStatus(SystemNames.EpicIdAuth) && (
          <AuthTrigger
            key={BungieCredentialType.EgsId}
            credential={BungieCredentialType.EgsId}
          >
            {Localizer.Registration.networksigninoptionegsid}
          </AuthTrigger>
        )}

        {ConfigUtils.SystemStatus(SystemNames.Twitch) && (
          <AuthTrigger
            key={BungieCredentialType.TwitchId}
            credential={BungieCredentialType.TwitchId}
          >
            {Localizer.Registration.networksigninoptiontwitch}
          </AuthTrigger>
        )}

        {
          <div className={styles.registrationNavFooter}>
            {
              <Button
                onClick={() => {
                  const signInModal = Modal.signIn(() => {
                    signInModal.current.close();
                  });
                }}
                buttonType={"gold"}
                style={{ width: "100%" }}
                size={BasicSize.Small}
              >
                {Localizer.Nav.JoinUp.toUpperCase()}
              </Button>
            }
          </div>
        }
      </MenuItem>
    );
  }
}

const SignInTriggersWithRouter = withRouter(SignInTriggers);
