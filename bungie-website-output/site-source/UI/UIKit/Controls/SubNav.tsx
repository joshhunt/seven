import { Respond } from "@Boot/Respond";
import { Responsive } from "@Boot/Responsive";
import { DataStore } from "@bungie/datastore";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { ResponsiveSize } from "@bungie/responsive";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import * as React from "react";
// @ts-ignore
import * as h from "history";
import { Dropdown, IDropdownOption } from "../Forms/Dropdown";
import styles from "./SubNav.module.scss";
import defaultStyles from "./SubNavDefaults.module.scss";

interface ISubNavProps extends React.HTMLProps<HTMLDivElement> {
  /** Requires the history object from the page's props (this.props.history). Required to redirect when using mobile dropdown. */
  history: h.History;
  /** If true, elements will render as spans instead of links */
  renderAsSpans?: boolean;
  /** Array of links to display in subnav */
  links: ISubNavLink[];
  /** Choose the breakpoint for it to switch to dropdown view */
  mobileDropdownBreakpoint?: ResponsiveSize | "none";
  /** SubNav will show vertically and on the left side if larger than mobileDropdownBreakpoint */
  vertical?: boolean;
  /** If classes are not passed in, there is default styling that underlines links on hover */
  classes?: ISubNavClasses;
}

export interface ISubNavClasses {
  span?: string;
  clickableLink?: string;
  current?: string;
}

export interface ISubNavLink {
  to?: IMultiSiteLink;
  label: string;
  current?: boolean;
  render?: (label: string) => React.ReactNode;
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
  private readonly destroys: DestroyCallback[] = [];

  constructor(props: ISubNavProps) {
    super(props);

    this.state = {
      responsive: Responsive.state,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
  }

  public render() {
    const {
      renderAsSpans,
      links,
      mobileDropdownBreakpoint,
      vertical,
    } = this.props;

    const breakpoint = mobileDropdownBreakpoint || ResponsiveSize.medium;
    const linkClasses = classNames({ [styles.vertical]: vertical });

    const LinkList = () => {
      return (
        <div className={linkClasses}>
          {links.map((link, index) => (
            <SubNavLink
              key={index}
              link={link}
              classes={this.props.classes}
              isSpan={renderAsSpans}
            />
          ))}
        </div>
      );
    };

    return (
      <div className={classNames(styles.subNav, this.props.className)}>
        {breakpoint === "none" ? (
          <LinkList />
        ) : (
          <>
            <Respond at={breakpoint} hide={true} responsive={null}>
              <LinkList />
            </Respond>
            <Respond at={breakpoint} responsive={null}>
              {this.renderDropdown()}
            </Respond>
          </>
        )}
      </div>
    );
  }

  private renderDropdown() {
    const options: IDropdownOption[] = this.props.links.map((a) => {
      const resolvedUrl = UrlUtils.resolveUrlFromMultiLink(a.to);

      const isLabel = !a.to;
      const label = isLabel ? `[--- ${a.label} ---]` : a.label;

      return {
        label,
        mobileLabel: label,
        value: resolvedUrl,
        disabled: isLabel,
      } as IDropdownOption;
    });

    let selectedValue = null;
    const current = this.props.links.find((a) => a.current);
    if (current) {
      selectedValue = UrlUtils.resolveUrlFromMultiLink(current.to);
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
      if (a?.to?.url) {
        const anchor = UrlUtils.getHrefAsLocation(a.to.url);
        const resolvedUrl = UrlUtils.resolveUrl(anchor, a.to.legacy, true);

        return resolvedUrl === value;
      }
    });

    if (matchingLink.to.legacy) {
      location.href = matchingLink.to.url;
    } else {
      this.props.history.push(value);
    }
  }
}

interface SubNavLinkProps {
  link: ISubNavLink;
  classes?: ISubNavClasses;
  isSpan: boolean;
}

export const SubNavLink: React.FC<SubNavLinkProps> = ({
  link,
  classes,
  isSpan,
}) => {
  const linkClasses: ISubNavClasses = {
    span: classes?.span ?? defaultStyles.span,
    clickableLink: classes?.clickableLink ?? defaultStyles.clickableLink,
    current: classes?.current ?? defaultStyles.current,
  };

  const clickableLinkClass = link.to
    ? linkClasses?.clickableLink
    : linkClasses?.span;

  const renderedLabel = link.render ? link.render(link.label) : link.label;

  return isSpan ? (
    <span data-href={link.to} className={classNames(linkClasses?.span)}>
      {link.label}
    </span>
  ) : (
    <Anchor
      className={classNames(clickableLinkClass, {
        [linkClasses?.current]: link.current,
      })}
      url={link.to ?? ""}
    >
      {renderedLabel}
    </Anchor>
  );
};
