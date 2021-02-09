// Created by atseng, 2020
// Copyright Bungie, Inc.

import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import * as React from "react";
import styles from "./BeyondLightMainNav.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import classNames from "classnames";
import { Localizer } from "@Global/Localization/Localizer";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import LocaleSwitcher from "@UI/Navigation/LocaleSwitcher";
import * as H from "history";

export type BeyondLightPage =
  | "index"
  | "media"
  | "stasis"
  | "europa"
  | "gear"
  | "story";

// Required props
interface IBeyondLightMainNavProps {
  page: BeyondLightPage;
  history: H.History;
  phaseOne?: boolean;
  phaseTwo?: boolean;
  phaseThree?: boolean;
  phaseFour?: boolean;
}

// Default props - these will have values set in BeyondLightMainNav.defaultProps
interface DefaultProps {}

export type BeyondLightMainNavProps = IBeyondLightMainNavProps & DefaultProps;

interface IBeyondLightMainNavState {
  transparentMode: boolean;
  mobileOpen: boolean;
}

/**
 * BeyondLightMainNav - Replace this description
 *  *
 * @param {IBeyondLightMainNavProps} props
 * @returns
 */
export class BeyondLightMainNav extends React.Component<
  BeyondLightMainNavProps,
  IBeyondLightMainNavState
> {
  private wrapperRef: HTMLHeadElement = null;
  private destroyHistory: DestroyCallback = null;

  constructor(props: BeyondLightMainNavProps) {
    super(props);

    this.state = {
      transparentMode: true,
      mobileOpen: false,
    };
  }

  public componentDidMount() {
    document.addEventListener("scroll", this.onScroll);
    this.destroyHistory = () =>
      this.props.history.listen(() => this.closeMenu());
  }

  public componentWillUnmount() {
    document.removeEventListener("scroll", this.onScroll);
    this.destroyHistory();
  }

  public componentDidUpdate() {
    if (this.state.mobileOpen) {
      BrowserUtils.lockScroll(this.wrapperRef);
      document.addEventListener("click", this.onBodyClick);
    } else if (!this.state.mobileOpen) {
      BrowserUtils.unlockScroll();
      document.removeEventListener("click", this.onBodyClick);
    }
  }

  private readonly onBodyClick = (e: MouseEvent) => {
    this.state.mobileOpen &&
      this.setState({
        mobileOpen: false,
      });
  };

  public static defaultProps: DefaultProps = {};

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;
    const destiny2BeyondLightNav = beyondlightLoc.Destiny2BeyondLight;
    const mediaNav = beyondlightLoc.Media;
    const preorderNav = beyondlightLoc.PreOrder;
    const gameNav = beyondlightLoc.Game;

    const headerClasses = classNames(styles.topNav, {
      [styles.solid]: !this.state.transparentMode,
    });

    return (
      <div
        role="navigation"
        aria-label="Main"
        className={headerClasses}
        ref={(ref) => (this.wrapperRef = ref)}
      >
        <div className={styles.headerContents}>
          <div className={styles.topNavLeft}>
            <Anchor url={RouteHelper.Home}>
              <Icon
                iconType={"material"}
                iconName={"keyboard_arrow_left"}
                className={styles.mobileNavArrow}
              />
              <span>{beyondlightLoc.ReturnTo}</span>
              <span>{beyondlightLoc.BungieNet}</span>
            </Anchor>
          </div>
          <div className={styles.navWrapper}>
            <div className={styles.navTitle}>
              <Anchor
                url={RouteHelper.BeyondLight()}
                style={{
                  backgroundImage: `url(/7/ca/destiny/products/beyondlight/logo_${Localizer.CurrentCultureName}.png)`,
                }}
              >
                {destiny2BeyondLightNav}
              </Anchor>
            </div>
            <div
              className={classNames(styles.topNavRight, {
                [styles.open]: this.state.mobileOpen,
              })}
            >
              {!this.props.phaseOne && (
                <div className={styles.mobileToRightNav}>
                  <Anchor url={RouteHelper.BeyondLight()}>{gameNav}</Anchor>
                  <ul>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`overview`)}>
                        {Localizer.Beyondlight.Submenu_overview}
                      </Anchor>
                    </li>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`destination`)}>
                        {Localizer.Beyondlight.Submenu_destination}
                      </Anchor>
                    </li>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`stasis`)}>
                        {Localizer.Beyondlight.Submenu_Stasis}
                      </Anchor>
                    </li>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`gearrewards`)}>
                        {Localizer.Beyondlight.Submenu_GearRewards}
                      </Anchor>
                    </li>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`raid`)}>
                        {Localizer.Beyondlight.Submenu_Raid}
                      </Anchor>
                    </li>
                    <li>
                      <Anchor url={RouteHelper.BeyondLight(`editions`)}>
                        {Localizer.Beyondlight.Submenu_Editions}
                      </Anchor>
                    </li>
                  </ul>
                </div>
              )}
              <Anchor
                url={RouteHelper.BeyondLight()}
                className={this.props.page === "index" ? styles.on : styles.off}
              >
                {gameNav}
              </Anchor>
              {this.props.phaseOne && (
                <Anchor
                  url={RouteHelper.BeyondLightPhases("stasis")}
                  className={
                    this.props.page === "stasis" ? styles.on : styles.off
                  }
                >
                  {Localizer.Beyondlight.Submenu_Stasis}
                  {!this.props.phaseTwo && (
                    <span>{Localizer.Registration.new}</span>
                  )}
                </Anchor>
              )}
              {this.props.phaseTwo && (
                <Anchor
                  url={RouteHelper.BeyondLightPhases("europa")}
                  className={
                    this.props.page === "europa" ? styles.on : styles.off
                  }
                >
                  {Localizer.Beyondlight.Submenu_Europa}
                  {!this.props.phaseThree && (
                    <span>{Localizer.Registration.new}</span>
                  )}
                </Anchor>
              )}
              {this.props.phaseThree && (
                <Anchor
                  url={RouteHelper.BeyondLightPhases("gear")}
                  className={
                    this.props.page === "gear" ? styles.on : styles.off
                  }
                >
                  {Localizer.Beyondlight.Submenu_Gear}
                  {!this.props.phaseFour && (
                    <span>{Localizer.Registration.new}</span>
                  )}
                </Anchor>
              )}
              {this.props.phaseFour && (
                <Anchor
                  url={RouteHelper.BeyondLightPhases("story")}
                  className={
                    this.props.page === "story" ? styles.on : styles.off
                  }
                >
                  {Localizer.Beyondlight.Submenu_Story}
                </Anchor>
              )}
              <Anchor
                url={RouteHelper.BeyondLightMedia()}
                className={this.props.page === "media" ? styles.on : styles.off}
              >
                {mediaNav}
              </Anchor>
              <Button
                url={RouteHelper.DestinyBuyDetail({
                  productFamilyTag: "beyondlight",
                })}
                className={styles.preOrderNav}
                buttonType={"blue"}
                analyticsId={"BeyondLightNavBuyButton"}
              >
                {preorderNav}
              </Button>
            </div>
            <LocaleSwitcher
              classes={{
                options: styles.localeOptions,
                trigger: styles.trigger,
              }}
            />
            <div
              role="button"
              className={styles.smallMenu}
              onClick={() =>
                this.setState({
                  mobileOpen: !this.state.mobileOpen,
                })
              }
            />
          </div>
        </div>
      </div>
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

  private readonly closeMenu = () => {
    BrowserUtils.unlockScroll(this.wrapperRef);

    this.setState({
      mobileOpen: false,
    });
  };
}
