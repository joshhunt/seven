import { Respond } from "@Boot/Respond";
import { ResponsiveSize } from "@Boot/Responsive";
import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import {
  GlobalState,
  GlobalStateComponentProps,
  GlobalStateDataStore,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { RouteHelper } from "@Global/Routes/RouteHelper";
import { AccountSidebar } from "@UI/Navigation/AccountSidebar";
import { MenuItem } from "@UI/Navigation/MenuItem";
import { UserMenu } from "@UI/Navigation/UserMenu";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import * as H from "history";
import * as React from "react";
import { Anchor } from "./Anchor";
import styles from "./MainNavigation.module.scss";
import { NotificationSidebar } from "./NotificationSidebar";

declare var NavigationConfig: INavigationConfig;

export enum NavigationConfigRequirements {
  None = 0,
  OwnsDestiny2 = 1,
  NotOwnsDestiny2 = 2,
}

export enum NavigationConfigLegacy {
  Legacy = 0,
  Core = 1,
}

export interface INavigationLinkItem {
  Overrides: INavigationLinkItem[];
  Enabled: boolean;
  Id: string;
  StringKey: string;
  SecondaryStringKey: string;
  Url: string;
  External: boolean;
  IsDivider: boolean;
  Legacy: NavigationConfigLegacy;
  Requires?: NavigationConfigRequirements;
  IsButton: boolean;
}

export interface INavigationLinkOverride extends INavigationLinkItem {
  Environment:
    | "local"
    | "live"
    | "beta"
    | "dev"
    | "near"
    | "next"
    | "internal"
    | "bvt"
    | "seven";
}

export interface INavigationTopLink extends INavigationLinkOverride {
  NavLinks: INavigationLinkItem[];
}

export type IMenuParentItem = INavigationTopLink;

export type INavigationConfig = IMenuParentItem[];

interface IMainNavigationProps
  extends GlobalStateComponentProps<
    "loggedInUser" | "responsive" | "loggedInUserClans"
  > {
  currentPath: string;
  history: H.History;
}

interface IMainNavigationState {
  menuExpanded: boolean;
  accountSidebarOpen: boolean;
  notificationSidebarOpen: boolean;
  transparentMode: boolean;
  /**
   * Prevents flash of navigation while waiting for chunks to load
   */
  mountDelayFinished: boolean;
}

/**
 * Navigation that shows in the main layout
 *  *
 * @param {IMainNavigationProps} props
 * @returns
 */
class MainNavigationInternal extends React.Component<
  IMainNavigationProps,
  IMainNavigationState
> {
  private wrapperRef: HTMLHeadElement = null;
  private destroyHistory: DestroyCallback = null;

  constructor(props: IMainNavigationProps) {
    super(props);

    this.state = {
      menuExpanded: false,
      accountSidebarOpen: false,
      notificationSidebarOpen: false,
      transparentMode: true,
      mountDelayFinished: false,
    };
  }

  public componentDidMount() {
    document.addEventListener("scroll", this.onScroll);

    this.destroyHistory = this.props.history.listen(() => this.closeMenu());

    setTimeout(
      () =>
        this.setState({
          mountDelayFinished: true,
        }),
      500
    );
  }

  public componentWillUnmount() {
    document.removeEventListener("scroll", this.onScroll);

    this.destroyHistory();
  }

  public componentDidUpdate() {
    if (this.state.menuExpanded) {
      BrowserUtils.lockScroll(this.wrapperRef);
      document.addEventListener("click", this.onBodyClick);
    } else if (!this.state.menuExpanded) {
      BrowserUtils.unlockScroll(this.wrapperRef);
      document.removeEventListener("click", this.onBodyClick);
    }
  }

  private readonly onBodyClick = (e: MouseEvent) => {
    if (this.wrapperRef && this.wrapperRef.contains(e.target as Node)) {
      return;
    }

    this.state.menuExpanded &&
      this.setState({
        menuExpanded: false,
      });
  };

  private readonly onSignInClick = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();
    });

    this.toggleMenuExpanded();
  };

  private readonly onJoinClick = () => {
    BrowserUtils.openWindow(RouteHelper.Join().url, "loginui", () =>
      GlobalStateDataStore.actions.refreshUserAndRelatedData()
    );
  };

  public render() {
    const headerClasses = classNames(styles.mainNav, {
      [styles.solid]: !this.state.transparentMode,
      [styles.navOpen]: this.state.menuExpanded,
    });

    const links = this.getLinksToRender();
    const loggedInUser = this.props.globalState.loggedInUser;
    const responsive = this.props.globalState.responsive;
    const menuItems = links.map((link, i) => (
      <MenuItem
        link={link}
        key={i}
        responsive={responsive}
        onSelected={this.closeMenu}
      />
    ));

    let environment = "live";
    if (
      this.props.globalState &&
      this.props.globalState.coreSettings &&
      this.props.globalState.coreSettings.environment
    ) {
      environment = this.props.globalState.coreSettings.environment;
    }

    const buyButtonSize: BasicSize = this.props.globalState.responsive.medium
      ? BasicSize.Medium
      : BasicSize.Small;

    if (!this.state.mountDelayFinished) {
      return null;
    }

    return (
      <header
        id={`main-navigation`}
        className={headerClasses}
        ref={(ref) => (this.wrapperRef = ref)}
      >
        <div className={styles.headerContents}>
          <Respond at={ResponsiveSize.medium} responsive={responsive}>
            <Anchor id={styles.topLogo} url={RouteHelper.Home} />
          </Respond>

          <div className={styles.smallMenu} onClick={this.toggleMenuExpanded} />
          <div className={styles.mainNavigationLinks}>
            {
              // environment !== "live" && <span className={styles.environment}>{environment}</span>
            }

            <Anchor id={styles.logo} url={RouteHelper.Home} />
            <Respond at={ResponsiveSize.medium} responsive={responsive}>
              {!loggedInUser && (
                <LoggedOutUserButtons
                  globalState={this.props.globalState}
                  onSignInClick={this.onSignInClick}
                  onJoinClick={this.onJoinClick}
                />
              )}
            </Respond>

            {menuItems}

            <Button
              buttonType={"gold"}
              url={RouteHelper.DestinyBuy()}
              className={styles.buyButton}
              size={buyButtonSize}
            >
              {Localizer.Nav.BuyDestiny2}
            </Button>
          </div>

          <div className={styles.signIn}>
            <UserMenu
              globalState={this.props.globalState}
              onToggleUserMenu={this.toggleAccountSidebar}
              onToggleNotifications={this.toggleNotificationSidebar}
            />
          </div>

          <AccountSidebar
            globalState={this.props.globalState}
            open={this.state.accountSidebarOpen}
            onClickOutside={() => this.toggleAccountSidebar(false)}
          />

          <NotificationSidebar
            open={this.state.notificationSidebarOpen}
            onClickOutside={() => this.toggleNotificationSidebar(false)}
          />
        </div>
      </header>
    );
  }

  private readonly onScroll = () => {
    const scroll = window.scrollY;

    let newTransparentMode = this.state.transparentMode;
    if (scroll > 60 && this.state.transparentMode) {
      newTransparentMode = false;
    } else if (scroll < 60 && !this.state.transparentMode) {
      newTransparentMode = true;
    }

    if (newTransparentMode !== this.state.transparentMode) {
      this.setState({
        transparentMode: newTransparentMode,
      });
    }
  };

  private readonly toggleAccountSidebar = (override: boolean = undefined) => {
    this.setState({
      accountSidebarOpen:
        override !== undefined ? override : !this.state.accountSidebarOpen,
      notificationSidebarOpen: false,
      menuExpanded: false,
    });
  };

  private readonly toggleNotificationSidebar = (
    override: boolean = undefined
  ) => {
    this.setState({
      accountSidebarOpen: false,
      menuExpanded: false,
      notificationSidebarOpen:
        override !== undefined ? override : !this.state.notificationSidebarOpen,
    });
  };

  private getLinksToRender(): IMenuParentItem[] {
    const linksToShow: IMenuParentItem[] = [];
    const navConfig = NavigationConfig;

    if (navConfig) {
      navConfig.forEach((linkItem) => {
        const shouldShow = linkItem.Enabled;

        if (linkItem.Enabled && shouldShow) {
          linksToShow.push(linkItem);
        }
      });
    }

    return linksToShow;
  }

  private readonly toggleMenuExpanded = () => {
    this.setState({
      menuExpanded: !this.state.menuExpanded,
    });
  };

  private readonly closeMenu = () => {
    this.setState({
      accountSidebarOpen: false,
      menuExpanded: false,
    });
  };
}

const LoggedOutUserButtons = (props: {
  globalState: GlobalState<"loggedInUser" | "responsive" | "loggedInUserClans">;
  onSignInClick: () => void;
  onJoinClick: () => void;
}) => {
  return (
    <React.Fragment>
      <div className={styles.loggedOutButtons}>
        <Button
          className={styles.loButton}
          buttonType="gold"
          onClick={props.onJoinClick}
        >
          {Localizer.Nav.JoinUp}
        </Button>
        <Button
          className={styles.loButton}
          buttonType="white"
          onClick={props.onSignInClick}
        >
          {Localizer.Nav.SignIn}
        </Button>
      </div>
    </React.Fragment>
  );
};

export const MainNavigation = withGlobalState(MainNavigationInternal, [
  "loggedInUser",
  "responsive",
  "loggedInUserClans",
]);
