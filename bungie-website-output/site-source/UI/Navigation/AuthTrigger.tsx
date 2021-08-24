import { Localizer } from "@bungie/localization";
import { BungieCredentialType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import * as React from "react";
import styles from "./MenuItem.module.scss";

interface ISignInTriggerProps extends React.HTMLProps<HTMLDivElement> {
  /** If this is a sign-in trigger, you must specify the type of trigger */
  credential?: BungieCredentialType;

  /** If true, will trigger sign out */
  isSignOut?: boolean;

  onClick?: () => void;

  /** Triggered when we refresh the user state */
  onAuthWindowClosed?: () => void;
}

interface ISignInTriggerState {}

/**
 * Renders a link that can be used to sign in with a platform
 *  *
 * @param {ISignInTriggerProps} props
 * @returns
 */
export class AuthTrigger extends React.Component<
  ISignInTriggerProps,
  ISignInTriggerState
> {
  constructor(props: ISignInTriggerProps) {
    super(props);

    if (!this.props.isSignOut && this.props.credential === undefined) {
      throw new Error(
        "Must specify credential if this isn't a sign out trigger"
      );
    }

    this.state = {};
  }

  public render() {
    const {
      credential,
      isSignOut,
      onClick,
      onAuthWindowClosed,
      ...rest
    } = this.props;

    let link = "";

    if (this.props.credential) {
      const credentialString = BungieCredentialType[this.props.credential];
      link = `/en/User/SignIn/${credentialString}/?flowStart=1`;
    }

    if (this.props.isSignOut) {
      const redirect = encodeURIComponent(
        `/${Localizer.CurrentCultureName}/User/CloseJsWindow`
      );
      link = `/en/User/SignOut?bru=${redirect}&autoClose=true`;
    }

    return (
      <div
        className={styles.menuItem}
        onClick={() => this.onClick(link)}
        {...rest}
      >
        {this.props.children}
      </div>
    );
  }

  private onClick(href: string) {
    this.triggerSignInWindow(href);
    this.props.onClick && this.props.onClick();
  }

  private triggerSignInWindow(href: string) {
    BrowserUtils.openWindow(href, "loginui", () => {
      this.props.onAuthWindowClosed && this.props.onAuthWindowClosed();

      GlobalStateDataStore.refreshUserAndRelatedData();
    });
  }
}
