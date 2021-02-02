import { IResponsiveState } from "@Boot/Responsive";
import { BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@Global/Localization/Localizer";
import {
  IMenuParentItem,
  INavigationLinkItem,
  INavigationTopLink,
  NavigationConfigLegacy,
} from "@UI/Navigation/MainNavigation";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import * as React from "react";
import { Anchor } from "./Anchor";
import { ClanMenuItem } from "./ClanMenuItem";
import styles from "./MenuItem.module.scss";

interface IMenuItemProps {
  /** Additional HTML classes */
  className?: string;
  /** The link info to render */
  link: IMenuParentItem;
  /** If true, will behave as a login/logout link */
  isAuthTrigger?: boolean;
  /** Global State */
  responsive?: IResponsiveState;
  onSelected?: () => void;
}

interface ILinkProps {
  isOpen: boolean;
  responsive?: IResponsiveState;
  link: INavigationLinkItem | INavigationTopLink;
  className?: string;
  isAuthTrigger?: boolean;
  onExpandToggle: (e: React.TouchEvent<HTMLSpanElement>) => boolean;
  onChildSelected: (e: React.MouseEvent<HTMLSpanElement>) => boolean;
}

interface IMainParentProps {
  responsive?: IResponsiveState;
  className?: string;
  isAuthTrigger?: boolean;
  onExpandToggle: (e: React.TouchEvent<HTMLSpanElement>) => boolean;
  onChildSelected: (e: React.MouseEvent<HTMLSpanElement>) => boolean;
  navBucketOpen: boolean;
  isTouched: boolean;
  toggleIfAuth: () => void;
  children?: React.ReactNode;
}

interface INavBucketProps extends IMainParentProps {
  link: INavigationLinkItem | INavigationTopLink;
}

interface IMenuItemState {
  navBucketOpen: boolean;
  isTouched: boolean;
}

export class MenuItem extends React.Component<IMenuItemProps, IMenuItemState> {
  constructor(props: IMenuItemProps) {
    super(props);

    this.state = {
      navBucketOpen: false,
      isTouched: false,
    };
  }

  public render() {
    const { className, isAuthTrigger, children, link, responsive } = this.props;

    if (this.state.isTouched) {
      if (this.props.onSelected) {
        this.props.onSelected();
      }
    }

    return (
      <MenuItemNavBucket
        className={className}
        responsive={responsive}
        isAuthTrigger={isAuthTrigger}
        isTouched={this.state.isTouched}
        toggleIfAuth={this.toggleIfAuthOrMobile}
        link={link}
        navBucketOpen={this.state.navBucketOpen}
        onExpandToggle={this.onExpandToggle}
        onChildSelected={this.onChildSelected}
      >
        {children}
      </MenuItemNavBucket>
    );
  }

  private readonly toggleIfAuthOrMobile = () => {
    if (this.props.responsive.medium) {
      this.setState({
        navBucketOpen: !this.state.navBucketOpen,
        isTouched: !this.state.isTouched && this.props.isAuthTrigger,
      });
    }
  };

  private readonly onExpandToggle = (e: React.TouchEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      navBucketOpen: !this.state.navBucketOpen,
    });

    return false;
  };

  private readonly onChildSelected = (e: React.MouseEvent<HTMLSpanElement>) => {
    this.props.onSelected();

    return false;
  };
}

const MenuItemNavBucket = (props: INavBucketProps) => {
  const {
    link,
    className,
    isAuthTrigger,
    onExpandToggle,
    onChildSelected,
    navBucketOpen,
    isTouched,
    children,
    responsive,
  } = props;

  const isOpen = navBucketOpen || (isTouched && responsive.medium);

  const realChildren =
    "NavLinks" in link && link.NavLinks
      ? link.NavLinks.map((linkItem, i) => (
          <MenuLink
            key={i}
            className={classNames(className, linkItem.StringKey)}
            isAuthTrigger={isAuthTrigger}
            responsive={responsive}
            isOpen={isOpen}
            link={linkItem}
            onExpandToggle={onExpandToggle}
            onChildSelected={onChildSelected}
          />
        ))
      : children;

  const classes = classNames(
    styles.navBucket,
    {
      [styles.open]: isOpen,
      [styles.isButton]: link.IsButton,
      [styles.isAuthTrigger]: isAuthTrigger,
    },
    className
  );

  return (
    <div className={classes} data-id={link.Id}>
      <MenuLink
        className={className}
        isAuthTrigger={isAuthTrigger}
        link={link}
        responsive={responsive}
        isOpen={isOpen}
        onExpandToggle={onExpandToggle}
        onChildSelected={onChildSelected}
      />
      {realChildren && (
        <div className={styles.navBucketItems}>{realChildren}</div>
      )}
    </div>
  );
};

const MenuLink = (props: ILinkProps) => {
  const {
    link,
    isAuthTrigger,
    className,
    isOpen,
    onExpandToggle,
    responsive,
  } = props;

  if (link.IsDivider) {
    return <hr />;
  }

  const urlString = String(link.Url);
  const label = Localizer.Nav[link.StringKey];
  const secondaryLabel = link.SecondaryStringKey
    ? Localizer.Nav[link.SecondaryStringKey]
    : null;
  const url = urlString.replace("{locale}", LocalizerUtils.currentCultureName);

  if (link.Url === null) {
    return <span className={styles.menuItem}>{label}</span>;
  }

  let onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    return props.onChildSelected(e);
  };

  if (isAuthTrigger) {
    onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      BrowserUtils.openWindow(url, "loginui", () =>
        GlobalStateDataStore.actions.refreshUserAndRelatedData()
      );
      props.onChildSelected(e);

      return false;
    };
  }

  if (UserUtils.isAuthenticated(GlobalStateDataStore.state)) {
    if (
      link.StringKey === "TopNavClan" &&
      GlobalStateDataStore.state.loggedInUserClans &&
      GlobalStateDataStore.state.loggedInUserClans.results.length > 1
    ) {
      const loggedInClans =
        GlobalStateDataStore.state.loggedInUserClans.results;
      let clansByActiveCrossSaveFirst = [];
      clansByActiveCrossSaveFirst = clansByActiveCrossSaveFirst.concat(
        loggedInClans.filter(
          (r) =>
            r.member.destinyUserInfo.crossSaveOverride ===
            r.member.destinyUserInfo.membershipType
        )
      );
      clansByActiveCrossSaveFirst = clansByActiveCrossSaveFirst.concat(
        loggedInClans.filter(
          (r) =>
            r.member.destinyUserInfo.crossSaveOverride !==
            r.member.destinyUserInfo.membershipType
        )
      );

      return (
        <React.Fragment>
          {clansByActiveCrossSaveFirst.map((clan, i) => {
            const isCrossSaved =
              clan.member.destinyUserInfo.crossSaveOverride !==
              BungieMembershipType.None;
            let isInactiveClanForCrossSave = false;

            if (isCrossSaved) {
              isInactiveClanForCrossSave =
                GlobalStateDataStore.state.loggedInUserClans
                  .areAllMembershipsInactive[clan.group.groupId];
            }

            return (
              <ClanMenuItem
                key={i}
                clan={clan}
                isCrossSaved={isCrossSaved}
                isInactiveCrossSaved={isInactiveClanForCrossSave}
              />
            );
          })}
        </React.Fragment>
      );
    }
  }

  const classes = classNames(styles.menuItem, className);

  let expandIcon = null;
  if (
    "NavLinks" in link &&
    link.NavLinks &&
    link.NavLinks.length > 0 &&
    responsive.medium
  ) {
    const iconName =
      isOpen && responsive.medium ? "expand_less" : "expand_more";

    expandIcon = (
      <Icon
        className={styles.expandIcon}
        iconType="material"
        iconName={iconName}
        onTouchEnd={onExpandToggle}
      />
    );
  }

  const isLegacy = link.Legacy === NavigationConfigLegacy.Legacy;

  return (
    <Anchor className={classes} url={url} onClick={onClick} legacy={isLegacy}>
      <div className={styles.linkLabel}>
        {secondaryLabel && (
          <div className={styles.secondaryLabel}>{secondaryLabel}</div>
        )}
        <div>{label}</div>
      </div>
      {expandIcon}
    </Anchor>
  );
};
