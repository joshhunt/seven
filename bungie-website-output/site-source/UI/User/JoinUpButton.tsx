// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { BungieCredentialType } from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import {
  Button,
  DefaultButtonProps,
  IButtonProps,
} from "@UIKit/Controls/Button/Button";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { ReactNode } from "react";
import { useHistory } from "react-router";

// disabled access to some properties on Button while maintaining default button props behaviour
type StrippedDownButtonProps = Omit<
  IButtonProps,
  "url" | "legacy" | "sameTab" | "children"
> &
  Partial<DefaultButtonProps>;

interface JoinUpButtonProps extends StrippedDownButtonProps {
  loggedInDisplay?: "hidden" | "disabled" | "active";
  targetCredential?: BungieCredentialType | null;
  children?: ReactNode;
}

export const JoinUpButton: React.FC<JoinUpButtonProps> = (props) => {
  const history = useHistory();

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const {
    onClick,
    children,
    targetCredential,
    disabled,
    loggedInDisplay,
    ...rest
  } = props;

  const triggerSignInBehaviour = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e);

    // if valid target credential was provided, open sign in page for that credential type
    if (targetCredential) {
      const bungieCredentialString = EnumUtils.getStringValue(
        targetCredential,
        BungieCredentialType
      );
      const href = `${Localizer.CurrentCultureName}/User/SignIn/${bungieCredentialString}/?flowStart=1`;

      BrowserUtils.openWindow(href, "loginui", () => {
        window.location.reload();
      });
    } else {
      UserUtils.SignIn(history, location.pathname);
    }
  };

  const btnText =
    props.children ?? Localizer.Bungierewards.MarketingPageAccountBtnText;

  const isUserAuthenticated = UserUtils.isAuthenticated(globalState);

  if (isUserAuthenticated && loggedInDisplay === "hidden") {
    return null;
  }

  const isDisabled = isUserAuthenticated && loggedInDisplay === "disabled";

  return (
    <Button {...rest} onClick={triggerSignInBehaviour} disabled={isDisabled}>
      {btnText}
    </Button>
  );
};
