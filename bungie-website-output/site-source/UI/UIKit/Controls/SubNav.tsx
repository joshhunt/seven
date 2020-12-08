import classNames from "classnames";
import * as React from "react";
import styles from "./SubNav.module.scss";
import { Dropdown, IDropdownOption } from "../Forms/Dropdown";
import { History } from "history";
import { Anchor } from "@UI/Navigation/Anchor";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Respond } from "@Boot/Respond";
import { ResponsiveSize, Responsive, IResponsiveState } from "@Boot/Responsive";
import { UrlUtils } from "@Utilities/UrlUtils";
import { DestroyCallback, DataStore } from "@Global/DataStore";

interface ISubNavProps extends React.HTMLProps<HTMLDivElement> {
  /** Requires the history object from the page's props (this.props.history). Required to redirect when using mobile dropdown. */
  history: History;
  /** If true, elements will render as spans instead of links */
  renderAsSpans?: boolean;
  /** Array of links to display in subnav */
  links: ISubNavLink[];
  /** If true, disables the dropdown in mobile mode */
  mobileDropdownDisabled?: boolean;
  /** Choose the breakpoint for it to switch to dropdown view */
  mobileDropdownBreakpoint?: ResponsiveSize;
  /** SubNav will show vertically and on the left side if larger than mobileDropdownBreakpoint */
  vertical?: boolean;
}

export interface ISubNavLink {
  to?: IMultiSiteLink;
  label: string;
  current?: boolean;
}

interface ISubNavState {
  responsive: IResponsiveState;
}

/**
 * Renders sub-navigation
 *  *
 * @param {ISubNavProps} props
 * @returns
 */
export class SubNav extends React.Component<ISubNavProps, ISubNavState> {
  constructor(props: ISubNavProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  private renderLink(link: ISubNavLink, index: number) {
    const classes = classNames(styles.subNavLink, {
      [styles.current]: link.current,
    });

    return (
      <Anchor key={index} className={classes} url={link.to}>
        {link.label}
      </Anchor>
    );
  }

  private renderSpan(link: ISubNavLink, index: number) {
    return (
      <span data-href={link.to} key={index}>
        {link.label}
      </span>
    );
  }

  public render() {
    const {
      renderAsSpans,
      links,
      mobileDropdownBreakpoint,
      mobileDropdownDisabled,
      vertical,
    } = this.props;

    const linksRendered = links.map((link, i) => {
      return renderAsSpans
        ? this.renderSpan(link, i)
        : this.renderLink(link, i);
    });

    const breakpoint = mobileDropdownBreakpoint || ResponsiveSize.medium;
    const classes = classNames(styles.subNav, {
      [styles.useMobileDropdown]: !mobileDropdownDisabled,
    });
    const linkClasses = classNames(styles.subNavItems, {
      [styles.vertical]: vertical,
    });

    return (
      <div className={classes}>
        <Respond at={breakpoint} hide={true} responsive={null}>
          <div className={styles.subNavWrapper}>
            <div className={linkClasses}>{linksRendered}</div>
          </div>
        </Respond>
        <Respond at={breakpoint} responsive={null}>
          {this.renderDropdown()}
        </Respond>
      </div>
    );
  }

  private renderDropdown() {
    const options: IDropdownOption[] = this.props.links.map((a) => {
      const resolvedUrl = UrlUtils.resolveUrlFromMultiLink(a.to);

      return {
        label: a.label,
        value: resolvedUrl,
      } as IDropdownOption;
    });

    let selectedValue = null;
    const current = this.props.links.find((a) => a.current);
    if (current) {
      const resolvedUrl = UrlUtils.resolveUrlFromMultiLink(current.to);
      selectedValue = resolvedUrl;
    }

    return (
      <Dropdown
        options={options}
        onChange={(value) => this.redirect(value)}
        selectedValue={selectedValue}
      />
    );
  }

  private redirect(value: string) {
    const matchingLink = this.props.links.find((a) => {
      const anchor = UrlUtils.getHrefAsLocation(a.to.url);
      const resolvedUrl = UrlUtils.resolveUrl(anchor, a.to.legacy, true);

      return resolvedUrl === value;
    });

    if (matchingLink.to.legacy) {
      location.href = matchingLink.to.url;
    } else {
      this.props.history.push(value);
    }
  }
}
