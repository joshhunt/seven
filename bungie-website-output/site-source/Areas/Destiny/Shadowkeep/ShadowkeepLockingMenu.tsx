// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./ShadowkeepLockingMenu.module.scss";
import { Localizer } from "@Global/Localization/Localizer";
import classNames from "classnames";
import { Anchor } from "@UI/Navigation/Anchor";
import { MainNavAffix } from "@UI/Navigation/MainNavAffix";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { RouteHelper } from "@Routes/RouteHelper";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { BuyButton } from "@UI/UIKit/Controls/Button/BuyButton";
import { BrowserUtils } from "@Utilities/BrowserUtils";

// Required props
interface IShadowkeepLockingMenuProps {
  /** Runs when fixed changes */
  onChange: (fixed: boolean) => void;
  /** The anchors from which we're creating the menu */
  idToElementsMapping: { [key: string]: HTMLDivElement };
  /** Locks under this element */
  relockUnder: React.RefObject<HTMLDivElement>;
}

// Default props - these will have values set in ShadowkeepLockingMenu.defaultProps
interface DefaultProps {}

type Props = IShadowkeepLockingMenuProps & DefaultProps;

interface IShadowkeepLockingMenuState {
  menuOpen: boolean;
  currentId: string;
}

/**
 * ShadowkeepLockingMenu - Replace this description
 *  *
 * @param {IShadowkeepLockingMenuProps} props
 * @returns
 */
export class ShadowkeepLockingMenu extends React.Component<
  Props,
  IShadowkeepLockingMenuState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentId: Object.keys(this.props.idToElementsMapping)[0],
      menuOpen: false,
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
    const top = el.getBoundingClientRect().top + window.scrollY;

    BrowserUtils.animatedScrollTo(top, 1000);

    this.setState({
      menuOpen: false,
    });
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
          url={`#${id}`}
          onClick={this.onClickLink}
        >
          {Localizer.Shadowkeep[`Submenu_${id}`]}
        </Anchor>
      );
    });

    const wrapperClasses = classNames(styles.wrapper, {
      [styles.open]: this.state.menuOpen,
    });

    const icon = this.state.menuOpen
      ? "keyboard_arrow_up"
      : "keyboard_arrow_down";

    return (
      <MainNavAffix
        from={this.props.relockUnder}
        hideNavOnLock={true}
        onChange={this.props.onChange}
      >
        <div className={wrapperClasses}>
          <div className={styles.hamburger} onClick={this.toggleMenu}>
            <Icon iconType={"material"} iconName={icon} />
          </div>
          <div className={styles.menuItems}>{menuItems}</div>
          <Button
            url={"#buy"}
            buttonType={"gold"}
            style={{ marginLeft: "2rem" }}
            size={BasicSize.Small}
            caps={true}
            onClick={this.onClickLink}
          >
            {Localizer.Shadowkeep.PreOrder}
          </Button>
        </div>
      </MainNavAffix>
    );
  }
}
