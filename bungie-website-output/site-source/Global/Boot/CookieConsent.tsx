// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Localizer } from "@Global/Localizer";
import { RouteHelper } from "@Routes/RouteHelper";
import styles from "./CookieConsent.module.scss";
import { DestroyCallback } from "@Global/DataStore";
import * as H from "history";
import classNames from "classnames";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import inEU from "@segment/in-eu";
import { UserUtils, CookieConsentValidity } from "@Utilities/UserUtils";

interface ICookieConsentProps {
  history: H.History;
}

interface ICookieConsentState {
  consentValidity: CookieConsentValidity;
  on: boolean;
}

/**
 * CookieConsent - Displays the cookie consent UI if it needs to be shown
 *  *
 * @param {ICookieConsentProps} props
 * @returns
 */
export class CookieConsent extends React.Component<
  ICookieConsentProps,
  ICookieConsentState
> {
  private destroyHistory: DestroyCallback;
  private autoSetCookieFlag = false;

  constructor(props: ICookieConsentProps) {
    super(props);

    this.state = {
      consentValidity: UserUtils.CookieConsentValidity(),
      on: false,
    };

    this.acceptCookies = this.acceptCookies.bind(this);
  }

  public componentDidMount() {
    this.destroyHistory = this.props.history.listen(() => {
      if (this.state.consentValidity === CookieConsentValidity.Current) {
        this.hide();
        this.destroyHistory();
      }
    });

    setTimeout(() => this.setState({ on: true }), 100);
  }

  public shouldComponentUpdate(
    nextProps: ICookieConsentProps,
    nextState: ICookieConsentState
  ) {
    if (nextState.consentValidity !== CookieConsentValidity.Current) {
      this.autoSetCookie();
    }

    return true;
  }

  public componentWillUnmount() {
    this.destroyHistory();
  }

  private readonly hide = () => {
    this.setState({
      consentValidity: CookieConsentValidity.Current,
    });
  };

  private acceptCookies() {
    UserUtils.SetConsentCookie();

    this.setState({
      consentValidity: CookieConsentValidity.Current,
    });
  }

  private autoSetCookie() {
    if (this.autoSetCookieFlag) {
      return;
    }

    if (!this.checkIsInEU()) {
      this.autoSetCookieFlag = true;

      setTimeout(() => UserUtils.SetConsentCookie(), 2000);
    }
  }

  private checkIsInEU() {
    const isInEu = inEU();

    return isInEu;
  }

  public render() {
    if (this.state.consentValidity === CookieConsentValidity.Current) {
      return null;
    }

    const expired =
      this.state.consentValidity === CookieConsentValidity.Expired;

    let baseString = expired
      ? Localizer.Messages.CookieConsentUpdateMessage
      : Localizer.Messages.CookieConsentMessage;

    if (!this.checkIsInEU()) {
      baseString = expired
        ? Localizer.Messages.CookieConsentUpdateMessagePassive
        : Localizer.Messages.CookieConsentMessagePassive;
    }

    const consentText = Localizer.FormatReact(baseString, {
      cookiePolicyLink: (
        <Anchor url={RouteHelper.LegalCookiePolicy()}>
          {Localizer.Messages.CookieConsentCookiePolicyLink}
        </Anchor>
      ),
      privacyPolicyLink: (
        <Anchor url={RouteHelper.LegalPrivacyPolicy()}>
          {Localizer.Messages.CookieConsentPrivacyPolicyLink}
        </Anchor>
      ),
    });

    const classes = classNames(styles.cookieConsent, {
      [styles.on]: this.state.on,
    });

    const isInEu = this.checkIsInEU();

    return (
      <div className={classes}>
        <div className={styles.content}>
          <span>{consentText}</span>
          {isInEu && (
            <Button
              buttonType={"gold"}
              className={styles.accept_button}
              onClick={this.acceptCookies}
            >
              {Localizer.Messages.UserAcceptTitle}
            </Button>
          )}
          {!isInEu && (
            <div className={styles.closeMe} onClick={this.hide}>
              <Icon iconType="material" iconName="close" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
