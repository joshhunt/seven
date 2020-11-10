// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./MainNavAffix.module.scss";
import { Affix, IAffixProps } from "@UI/UIKit/Controls/Affix";
import classNames from "classnames";

// Required props (extend IAffixProps but don't allow 'to')
interface IMainNavAffixProps
  extends Pick<
    IAffixProps,
    Exclude<keyof IAffixProps, "to" | "id" | "className">
  > {}

// Default props - these will have values set in MainNavAffix.defaultProps
interface DefaultProps {
  /** Runs when fixed changes */
  onChange: (fixed: boolean) => void;
  /** If true, the main nav will hide upon locking */
  hideNavOnLock: boolean;
}

type Props = IMainNavAffixProps & DefaultProps;

interface IMainNavAffixState {
  scrollingUp: boolean;
  navHidden: boolean;
}

/**
 * MainNavAffix - Fix something under the main navigation
 *  *
 * @param {IMainNavAffixProps} props
 * @returns
 */
export class MainNavAffix extends React.Component<Props, IMainNavAffixState> {
  private mainNav: HTMLElement;
  constructor(props: Props) {
    super(props);

    this.state = {
      navHidden: false,
      scrollingUp: false,
    };
  }

  public static defaultProps: DefaultProps = {
    onChange: () => null,
    hideNavOnLock: false,
  };

  public componentDidUpdate() {
    document.documentElement.classList.toggle(
      "nav-hidden",
      this.props.hideNavOnLock &&
        this.state.navHidden &&
        !this.state.scrollingUp
    );
  }

  private readonly toggleMainNav = (hide: boolean) => {
    if (this.props.hideNavOnLock) {
      this.setState({
        navHidden: hide,
      });
    }

    this.props.onChange(hide);
  };

  private readonly onScroll = (scrollDirection: "up" | "down") => {
    this.setState({
      scrollingUp: scrollDirection === "up",
    });
  };

  public render() {
    const { children, onChange, ...rest } = this.props;

    const fixedAttributes = {
      "data-nonav": String(
        this.props.hideNavOnLock &&
          this.state.navHidden &&
          !this.state.scrollingUp
      ),
    };

    this.mainNav = document.getElementById("main-navigation");

    return (
      <Affix
        className={styles.mainNavAffix}
        to={this.mainNav}
        from={this.props.from}
        fixedAttributes={fixedAttributes}
        onChange={this.toggleMainNav}
        onScroll={this.onScroll}
        throttleMs={250}
        {...rest}
      >
        {this.props.children}
      </Affix>
    );
  }
}
