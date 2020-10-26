// Created by larobinson, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import classNames from "classnames";
import { MainNavAffix } from "@UI/Navigation/MainNavAffix";
import styles from "./StickySubNav.module.scss";

interface IBasicDivProps extends React.DOMAttributes<HTMLDivElement> {
  children: React.ReactElement;
}

interface IStickySubNavProps extends IBasicDivProps {
  /** Runs when fixed changes */
  onFixedChange: (fixed: boolean) => void;
  /** Locks under this element */
  relockUnder: React.RefObject<HTMLDivElement>;
  backgroundColor?: string;
}

interface DefaultProps {}

type Props = IStickySubNavProps & DefaultProps;

interface IStickySubNavState {
  fixed: boolean;
}

/**
 * MarketingStickySubNav - Replace this description
 *  *
 * @param {IStickySubNavProps} props
 * @returns
 */
export class StickySubNav extends React.Component<
  IStickySubNavProps,
  IStickySubNavState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      fixed: false,
    };
  }

  private readonly onChange = (fixed: boolean) => {
    this.props.onFixedChange(fixed);

    this.setState({
      fixed,
    });
  };

  public render() {
    const { backgroundColor, children } = this.props;

    const wrapperClasses = classNames(styles.wrapper, {
      [styles.menuFixed]: this.state.fixed,
    });

    return (
      <React.Fragment>
        <MainNavAffix
          from={this.props.relockUnder}
          hideNavOnLock={true}
          onChange={this.onChange}
        >
          <div
            className={wrapperClasses}
            style={{ backgroundColor: backgroundColor }}
          >
            {children}
          </div>
        </MainNavAffix>

        <div
          className={classNames(styles.spacer, {
            [styles.menuFixed]: this.state.fixed,
          })}
        />
      </React.Fragment>
    );
  }
}
