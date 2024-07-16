// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { GoogleTagManagerLoader } from "@Boot/GoogleTagManagerLoader";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
// @ts-ignore
import inEU from "@segment/in-eu";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { CookieConsentValidity, UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
// @ts-ignore
import * as h from "history";
import * as React from "react";
import styles from "./CookieConsent.module.scss";

interface ICookieConsentProps {
  history: h.History;
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
      if (!UserUtils.CookieConsentIsCurrent()) {
        this.hide();
        this.destroyHistory();
      }
    });

    setTimeout(() => this.setState({ on: true }), 100);
  }

  public componentWillUnmount() {
    this.destroyHistory();
  }

  private readonly hide = () => {
    this.setState({
      on: false,
    });
  };

  private acceptCookies() {
    UserUtils.SetConsentCookie();
    this.setState({ consentValidity: CookieConsentValidity.Current });
    this.hide();
  }

  public render() {
    if (
      UserUtils.CookieConsentIsEnabled() &&
      UserUtils.CookieConsentIsCurrent()
    ) {
      return <GoogleTagManagerLoader />;
    }

    const expired =
      UserUtils.CookieConsentValidity() === CookieConsentValidity.Expired;

    const baseString = expired
      ? Localizer.Messages.CookieConsentUpdateMessage
      : Localizer.Messages.CookieConsentMessage;

    const consentText = (
      <>
        {Localizer.FormatReact(baseString, {
          cookiePolicyLink: (
            <Anchor url={RouteHelper.LegalPage({ pageName: "cookiepolicy" })}>
              {Localizer.Messages.CookieConsentCookiePolicyLink}
            </Anchor>
          ),
          privacyPolicyLink: (
            <Anchor url={RouteHelper.LegalPage({ pageName: "privacypolicy" })}>
              {Localizer.Messages.CookieConsentPrivacyPolicyLink}
            </Anchor>
          ),
        })}
      </>
    );

    const classes = classNames(styles.cookieConsent, {
      [styles.on]: this.state.on,
    });

    return (
      <div className={classes}>
        <div className={styles.content}>
          <span>{consentText}</span>
          <Button
            buttonType={"gold"}
            className={styles.accept_button}
            onClick={this.acceptCookies}
          >
            {Localizer.Messages.UserAcceptTitle}
          </Button>
        </div>
      </div>
    );
  }
}
