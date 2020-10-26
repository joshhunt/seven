// Created by atseng, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightNav.module.scss";
import { Anchor } from "@UI/Navigation/Anchor";
import { RouteHelper } from "@Routes/RouteHelper";
import classNames from "classnames";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { Localizer } from "@Global/Localizer";

// Required props
interface IBeyondLightNavProps {
  idToElementsMapping: { [key: string]: HTMLDivElement };
}

// Default props - these will have values set in BeyondLightNav.defaultProps
interface DefaultProps {}

export type BeyondLightNavProps = IBeyondLightNavProps & DefaultProps;

interface IBeyondLightNavState {
  currentId: string;
}

/**
 * BeyondLightNav - Replace this description
 *  *
 * @param {IBeyondLightNavProps} props
 * @returns
 */
export class BeyondLightNav extends React.Component<
  BeyondLightNavProps,
  IBeyondLightNavState
> {
  constructor(props: BeyondLightNavProps) {
    super(props);

    this.state = {
      currentId: Object.keys(this.props.idToElementsMapping)[0],
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    window.addEventListener("scroll", this.setCurrentId);

    setTimeout(() => {
      if (location.hash) {
        this.scrollToId(location.hash.substr(1));
      }
    }, 1000);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.setCurrentId);
  }

  private get idsToCenterpoints() {
    const result = {};

    Object.keys(this.props.idToElementsMapping).forEach((key) => {
      const el = this.props.idToElementsMapping[key];
      const rect = el.getBoundingClientRect();
      const center = rect.top;
      result[key] = center;
    });

    return result;
  }

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
    const top = el.getBoundingClientRect().top + window.scrollY;

    BrowserUtils.animatedScrollTo(top, 1000);
  }

  public render() {
    const { idToElementsMapping } = this.props;

    const menuItems = Object.keys(idToElementsMapping).map((id) => {
      const classes = classNames(styles.menuItem, {
        [styles.current]: this.state.currentId === id,
      });

      return (
        <Anchor
          key={id}
          className={classes}
          url={RouteHelper.BeyondLight(id)}
          onClick={this.onClickLink}
        >
          {Localizer.Beyondlight[`Submenu_${id}`]}
        </Anchor>
      );
    });

    return (
      <div role="navigation" aria-label="Secondary" className={styles.sideNav}>
        <div className={styles.sideNavContent}>{menuItems}</div>
      </div>
    );
  }
}
