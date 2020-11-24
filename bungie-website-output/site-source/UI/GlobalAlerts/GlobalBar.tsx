// Created by atseng, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./GlobalBar.module.scss";
import classNames from "classnames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { RouteHelper, IMultiSiteLink } from "@Routes/RouteHelper";
import { LocalStorageUtils } from "@Utilities/StorageUtils";

// Required props
interface IGlobalBarProps {
  barClassNames: string;
  message: string;
  url: string | IMultiSiteLink;
  removeable: boolean;
  showWarningIcon: boolean;
  showCheckIcon: boolean;
  localStorageKey?: string;
}

// Default props - these will have values set in GlobalBar.defaultProps
interface DefaultProps {}

type Props = IGlobalBarProps & DefaultProps;

interface IGlobalBarState {
  localStorageAllowShow: boolean;
}

/**
 * GlobalBar - a generic global bar that is shown at the top of all react pages
 *  *
 * @param {IGlobalBarProps} props
 * @returns
 */
export class GlobalBar extends React.Component<Props, IGlobalBarState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      localStorageAllowShow: true,
    };

    this.removeBar = this.removeBar.bind(this);
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    if (
      typeof this.props.localStorageKey !== "undefined" &&
      this.props.localStorageKey !== ""
    ) {
      this.getLocalStorageAlertVisibility();
    }
  }

  public render() {
    const close = "close";
    const checkCircle = "check_circle";

    return (
      <React.Fragment>
        {this.state.localStorageAllowShow && (
          <Anchor
            className={classNames(
              styles.globalAlertsBar,
              this.props.barClassNames
            )}
            url={this.props.url}
          >
            <Grid className={styles.pcMigrationBar}>
              <GridCol cols={12}>
                {this.props.showWarningIcon && (
                  <i className="fa fa-warning" aria-hidden="true" />
                )}
                {this.props.showCheckIcon && (
                  <i className="material-icons checkCircle">{checkCircle}</i>
                )}
                <span className={styles.content}>{this.props.message}</span>
                {this.props.removeable && (
                  <i
                    className="material-icons btnClose"
                    onClick={this.removeBar}
                  >
                    {close}
                  </i>
                )}
              </GridCol>
            </Grid>
          </Anchor>
        )}
      </React.Fragment>
    );
  }

  private removeBar(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.stopPropagation();

    e.preventDefault();

    this.updateLocalStorageAlertVisibility(false);
  }

  private getLocalStorageAlertVisibility() {
    if (
      typeof LocalStorageUtils.getItem(this.props.localStorageKey) ===
        "undefined" ||
      LocalStorageUtils.getItem(this.props.localStorageKey) === null
    ) {
      LocalStorageUtils.setItem(this.props.localStorageKey, "true");
    }

    this.setState({
      localStorageAllowShow:
        LocalStorageUtils.getItem(this.props.localStorageKey) === "false"
          ? false
          : true,
    });
  }

  private updateLocalStorageAlertVisibility(newValue: boolean) {
    this.setState({
      localStorageAllowShow: newValue,
    });

    LocalStorageUtils.setItem(this.props.localStorageKey, newValue.toString());
  }
}
