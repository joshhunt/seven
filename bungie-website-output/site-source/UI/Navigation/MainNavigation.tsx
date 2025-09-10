import { Respond } from "@Boot/Respond";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ResponsiveSize } from "@bungie/responsive";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Global/Routes/RouteHelper";
import { AccountSidebar } from "@UI/Navigation/AccountSidebar";
import { MenuItem } from "@UI/Navigation/MenuItem";
import { UserMenu } from "@UI/Navigation/UserMenu";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import classNames from "classnames";
import React, {
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
// @ts-ignore
import * as h from "history";
import { useHistory } from "react-router";
import { Anchor } from "./Anchor";
import styles from "./MainNavigation.module.scss";
import { NotificationSidebar } from "./NotificationSidebar";

declare var NavigationConfig: INavigationConfig;

// Cached navigation config to avoid recreating on every component mount
const getNavigationConfig = (() => {
  let cachedConfig: INavigationConfig | null = null;
  let cachedEnabledLinks: IMenuParentItem[] | null = null;

  return (): {
    navConfig: INavigationConfig;
    enabledLinks: IMenuParentItem[];
  } => {
    // Return cached result if available
    if (cachedConfig !== null && cachedEnabledLinks !== null) {
      return { navConfig: cachedConfig, enabledLinks: cachedEnabledLinks };
    }

    // Initialize cache if NavigationConfig is available
    if (
      typeof NavigationConfig !== "undefined" &&
      NavigationConfig.length > 0
    ) {
      cachedConfig = NavigationConfig;
      cachedEnabledLinks = NavigationConfig.filter(
        (linkItem) => linkItem.Enabled
      );
    } else {
      cachedConfig = [];
      cachedEnabledLinks = [];
    }

    return { navConfig: cachedConfig, enabledLinks: cachedEnabledLinks };
  };
})();

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

interface IMainNavigationProps {
  currentPath: string;
  history: h.History;
}

/**
 * Navigation that shows in the main layout
 *  *
 * @param {IMainNavigationProps} props
 * @returns
 */
export const MainNavigation: React.FC<PropsWithChildren<
  IMainNavigationProps
>> = (props) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
  const [mountDelayFinished, setMountDelayFinished] = useState(true);
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
    "loggedInUserClans",
  ]);
  const history = useHistory();
  const navWrapperRef = useRef(null);
  const { navConfig, enabledLinks } = getNavigationConfig();
  const isLoaded = navConfig.length > 0;

  if (
    document.getElementById("main-content")?.getBoundingClientRect()?.top < 0
  ) {
    document.getElementsByTagName("body")[0]?.classList?.add("solid-main-nav");
  }

  useEffect(() => {
    history.listen(() => {
      setMenuExpanded(false);
      setAccountSidebarOpen(false);
      setNotificationSidebarOpen(false);
    });
    setTimeout(() => setMountDelayFinished(true), 200);

    return () => {
      document.removeEventListener("click", onBodyClick);
    };
  }, []);

  useEffect(() => {
    setMenuExpanded(false);
    setNotificationSidebarOpen(false);
    setAccountSidebarOpen(accountSidebarOpen);
  }, [accountSidebarOpen]);

  useEffect(() => {
    setMenuExpanded(menuExpanded);
    setNotificationSidebarOpen(false);
    setAccountSidebarOpen(false);
  }, [menuExpanded]);

  useEffect(() => {
    setMenuExpanded(false);
    setNotificationSidebarOpen(notificationSidebarOpen);
    setAccountSidebarOpen(false);
  }, [notificationSidebarOpen]);

  useEffect(() => {
    if (menuExpanded) {
      BrowserUtils.lockScroll(navWrapperRef.current);
      document.addEventListener("click", onBodyClick);
    } else {
      BrowserUtils.unlockScroll(navWrapperRef.current);
      document.removeEventListener("click", onBodyClick);
    }
  }, [menuExpanded]);

  const onBodyClick = (e: MouseEvent) => {
    if (
      !document.getElementsByTagName("header")[0]?.contains(e.target as Node) &&
      menuExpanded
    ) {
      setMenuExpanded(false);
    }
  };

  const onSignInClick = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();
    });

    setMenuExpanded(!menuExpanded);
  };

  const onJoinClick = () => {
    BrowserUtils.openWindow(RouteHelper.Join().url, "loginui");
  };

  const headerClasses = classNames(styles.mainNav, {
    [styles.navOpen]: menuExpanded,
  });

  const LoggedOutUserButtons = () => {
    return (
      <React.Fragment>
        <div className={styles.loggedOutButtons}>
          <Button
            className={styles.loButton}
            buttonType="gold"
            onClick={onJoinClick}
          >
            {Localizer.Nav.JoinUp}
          </Button>
          <Button
            className={styles.loButton}
            buttonType="white"
            onClick={onSignInClick}
          >
            {Localizer.Nav.SignIn}
          </Button>
        </div>
      </React.Fragment>
    );
  };

  const loggedInUser = globalState.loggedInUser;
  const responsive = globalState.responsive;
  const MenuItems = () => {
    return (
      <>
        {enabledLinks.map((link: any, i: number) => (
          <MenuItem
            link={link}
            key={i}
            responsive={responsive}
            onSelected={() => {
              setMenuExpanded(false);
              setAccountSidebarOpen(false);
              setNotificationSidebarOpen(false);
            }}
          />
        ))}
      </>
    );
  };

  if (!mountDelayFinished || !isLoaded) {
    return null;
  }

  return (
    <header
      id={`main-navigation`}
      className={headerClasses}
      ref={navWrapperRef}
    >
      <div className={styles.headerContents}>
        <Respond at={ResponsiveSize.medium} responsive={responsive}>
          <Anchor
            id={styles.topLogo}
            url={RouteHelper.Home}
            style={{
              backgroundImage: 'url("/img/theme/bungienet/bnetlogo.png")',
            }}
          />
        </Respond>

        <div
          className={styles.smallMenu}
          style={{ backgroundImage: 'url("/img/theme/bungienet/menu.png")' }}
          onClick={(e) => {
            e.preventDefault();
            setMenuExpanded(!menuExpanded);
          }}
        />

        <div className={styles.mainNavigationLinks}>
          <Anchor
            id={styles.logo}
            url={RouteHelper.Home}
            style={{
              backgroundImage: 'url("/img/theme/bungienet/bnetlogo.png")',
            }}
          />
          <Respond at={ResponsiveSize.medium} responsive={responsive}>
            {!loggedInUser && <LoggedOutUserButtons />}
          </Respond>
          <MenuItems />
        </div>

        <div className={styles.signIn}>
          <UserMenu
            globalState={globalState}
            onToggleUserMenu={() => setAccountSidebarOpen(!accountSidebarOpen)}
            onToggleNotifications={() =>
              setNotificationSidebarOpen(!notificationSidebarOpen)
            }
          />
        </div>

        <Suspense fallback={<div />}>
          <AccountSidebar
            globalState={globalState}
            open={accountSidebarOpen}
            onClickOutside={() => setAccountSidebarOpen(false)}
          />
        </Suspense>

        <Suspense fallback={<div />}>
          <NotificationSidebar
            open={notificationSidebarOpen}
            onClickOutside={() => setNotificationSidebarOpen(false)}
          />
        </Suspense>
      </div>
    </header>
  );
};
