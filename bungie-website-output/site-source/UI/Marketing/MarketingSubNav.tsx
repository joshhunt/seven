// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import { Anchor } from "@UI/Navigation/Anchor";
import { Button, ButtonProps } from "@UI/UIKit/Controls/Button/Button";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import * as React from "react";
import styles from "./MarketingSubNav.module.scss";

export type NavPrimaryColors =
  | "lightgray"
  | "taupe"
  | "ash"
  | "purple"
  | "darkgray"
  | "splicerBlue"
  | "queenPurple"
  | "darkBlue"
  | "plum"
  | "s18blue"
  | "s21"
  | "s22"
  | "s23";
export type NavAccentColors =
  | "gold"
  | "teal"
  | "s11green"
  | "hotPink"
  | "purple"
  | "s18blue"
  | "s21"
  | "s22";

export interface IMarketingSubNavProps {
  /** The anchors from which we're creating the menu */
  ids: string[];
  /** A function that describes how to get the Nav Labels from a given id */
  renderLabel?: (id: string, idIndex: number) => React.ReactNode;
  /** Props for the call to action button in the subnav, if not provided, there will be no button */
  buttonProps?: ButtonProps;
  /** Classname for menu items (not including the call to action button) */
  menuItemClassName?: string;
  primaryColor?: NavPrimaryColors;
  accentColor?: NavAccentColors;
  /** The banner size will max out at 1920px, centered */
  withGutter?: boolean;
}

interface DefaultProps {
  /** Runs when fixed changes */
  onChange: (fixed: boolean) => void;
}

type Props = IMarketingSubNavProps & DefaultProps;

interface IMarketingSubNavState {
  menuOpen: boolean;
  currentId: string;
  fixed: boolean;
}

/**
 * MarketingSubNav - Replace this description
 *  *
 * @param {IMarketingSubNavProps} props
 * @returns
 */
export class MarketingSubNav extends React.Component<
  Props,
  IMarketingSubNavState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentId: this.props.ids?.[0],
      menuOpen: false,
      fixed: false,
    };
  }

  public static defaultProps: DefaultProps = {
    onChange: () => {
      //
    },
  };

  public componentDidMount() {
    window.addEventListener("scroll", this.setCurrentId);

    setTimeout(() => {
      if (window.location.hash) {
        this.scrollToId(window.location.hash.substr(1));
      }
    }, 1000);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.setCurrentId);
  }

  private get idsToCenterpoints() {
    const result: Record<string, number> = {};

    this.props.ids.forEach((key) => {
      const el = document.getElementById(key);
      const rect = el?.getBoundingClientRect();
      const center = rect?.top ?? 0;
      result[key] = center;
    });

    return result;
  }

  private readonly toggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  private readonly setCurrentId = () => {
    const idealCenterpoint = 0;
    const centerpoints = this.idsToCenterpoints;
    const keys = Object.keys(centerpoints);

    let closestId = keys[0];
    let closestIdDelta = 99999;
    keys.forEach((key) => {
      const thisDelta = Math.abs(idealCenterpoint - centerpoints[key]);
      if (thisDelta < closestIdDelta) {
        closestId = key;
        closestIdDelta = thisDelta;
      }
    });

    if (closestId !== this.state.currentId) {
      this.setState({
        currentId: closestId,
      });
    }
  };

  private readonly onClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.href.split("#")[1];

    this.scrollToId(id);

    e.preventDefault();

    return false;
  };

  private scrollToId(id: string) {
    const el = document.getElementById(id);
    const top = el?.getBoundingClientRect().top + window.scrollY ?? 0;

    BrowserUtils.animatedScrollTo(top, 1000);

    this.setState({
      menuOpen: false,
    });
  }

  public render() {
    const {
      ids,
      buttonProps,
      primaryColor,
      accentColor,
      withGutter,
    } = this.props;

    const path = location.pathname;

    this.state.fixed &&
      document.querySelector("html").classList.add("solid-header");

    const menuItems = ids.map((id, index) => {
      const classes = classNames(
        styles.menuItem,
        {
          [styles.current]: this.state.currentId === id,
        },
        styles[accentColor]
      );

      return (
        <Anchor
          key={id}
          className={classes}
          url={`${path}#${id}`}
          onClick={this.onClickLink}
        >
          {this.props.renderLabel(id, index)}
        </Anchor>
      );
    });

    const wrapperClasses = classNames(
      styles.wrapper,
      styles[primaryColor],
      { [styles.open]: this.state.menuOpen },
      { [styles.menuFixed]: this.state.fixed },
      { [styles.withGutter]: withGutter }
    );

    const icon = this.state.menuOpen
      ? "keyboard_arrow_up"
      : "keyboard_arrow_down";

    return (
      <div className={styles.outerWrapper}>
        <div className={wrapperClasses}>
          <div className={styles.hamburger} onClick={this.toggleMenu}>
            <Icon iconType={"material"} iconName={icon} />
          </div>
          <div className={styles.menuItems}>{menuItems}</div>

          {buttonProps && <SubNavButton buttonProps={buttonProps} />}
        </div>

        <div
          className={classNames(styles.spacer, {
            [styles.menuFixed]: this.state.fixed,
          })}
        />
      </div>
    );
  }
}

interface SubNavButtonProps {
  buttonProps: ButtonProps;
}

const SubNavButton: React.FC<SubNavButtonProps> = (props) => {
  const {
    className: buttonPropsClassName,
    buttonType: buttonPropsType,
    children: buttonPropsLabel,
    ...buttonPropsRest
  } = props.buttonProps;

  const buttonClasses = classNames(styles.CTAButton, buttonPropsClassName);
  const buttonType = buttonPropsType || "gold";

  return (
    <Button
      className={buttonClasses}
      buttonType={buttonType}
      {...buttonPropsRest}
      size={BasicSize.Small}
    >
      {buttonPropsLabel}
    </Button>
  );
};
