import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import * as Globals from "@Enum";
import { BungieCredentialType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  goToStep,
  setAuthState,
  setError,
} from "@Global/Redux/slices/authenticationSlice";
import { FaPlaystation } from "@react-icons/all-files/fa/FaPlaystation";
import { FaSteam } from "@react-icons/all-files/fa/FaSteam";
import { FaTwitch } from "@react-icons/all-files/fa/FaTwitch";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";
import handleAuthError from "@UI/User/scripts/AuthenticationErrorHandler";
import { FlowMode, AuthStep } from "@UI/User/types/authTypes";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { ActionIcon, Button } from "plxp-web-ui/components/base";
import React, { FC, ReactNode } from "react";
import { useDispatch } from "react-redux";
import styles from "./AuthPlatformButton.module.scss";

interface PlatformButtonProps {
  display?: "button" | "icon";
  credentialType: BungieCredentialType;
  children?: ReactNode;
}

interface CredentialMapProps {
  [key: string]: {
    logoString?: string;
    logo?: ReactNode;
    label: string;
  };
}

const AuthPlatformButton: FC<PlatformButtonProps> = ({
  display,
  credentialType,
  children,
  ...rest
}) => {
  const dispatch = useDispatch();
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const handleAuthComplete = async () => {
    try {
      await GlobalStateDataStore.refreshUserAndRelatedData();

      // If they are now logged in
      if (UserUtils.isAuthenticated(globalState)) {
        //Is the step "COMPLETE"?

        const originalUrl = sessionStorage.getItem("auth_return_url");
        if (originalUrl) {
          sessionStorage.removeItem("auth_return_url");
          window.location.href = originalUrl;
        }
      }
    } catch (err) {
      const errorState = handleAuthError(err);
      dispatch(setError(errorState));
    }
  };

  const handlePlatformSelect = (credentialType: BungieCredentialType) => {
    try {
      const credentialTypeString = EnumUtils.getStringValue(
        credentialType,
        BungieCredentialType
      );
      const link = `/en/User/SignIn/${credentialTypeString}/?flowStart=1`;

      BrowserUtils.openWindow(link, "loginui", () => {
        handleAuthComplete();
      });
    } catch (err) {
      const errorState = handleAuthError(err);
      dispatch(setError(errorState));
    }
  };

  const RegistrationLoc = Localizer.Registration;

  const CRED_CONTENT_MAP: CredentialMapProps = {
    [Globals.BungieCredentialType.Psnid]: {
      logo: <FaPlaystation />,
      label: RegistrationLoc.networksigninoptionplaystation,
    },
    [Globals.BungieCredentialType.Xuid]: {
      logo: <FaXbox />,
      label: RegistrationLoc.networksigninoptionxbox,
    },
    [Globals.BungieCredentialType.SteamId]: {
      logo: <FaSteam />,
      label: RegistrationLoc.networksigninoptionsteam,
    },
    [Globals.BungieCredentialType.TwitchId]: {
      logo: <FaTwitch />,
      label: RegistrationLoc.networksigninoptiontwitch,
    },
    [Globals.BungieCredentialType.EgsId]: {
      logo: <SiEpicgames />,
      label: RegistrationLoc.networksigninoptionegs,
    },
  };

  return display !== "icon" ? (
    <>
      <Button
        variant={"contained"}
        className={styles.authTriggerButton}
        onClick={() => handlePlatformSelect(credentialType)}
        size={"large"}
        {...rest}
      >
        {CRED_CONTENT_MAP[credentialType].logo}
        {CRED_CONTENT_MAP[credentialType].label}
        {children ? children : null}
      </Button>
    </>
  ) : (
    <ActionIcon
      linkProps={{
        className: styles.authTriggerIcon,
        onClick: () => handlePlatformSelect(credentialType),
        "aria-label": CRED_CONTENT_MAP[credentialType].label,
      }}
      icon={CRED_CONTENT_MAP[credentialType].logo}
    />
  );
};

export default AuthPlatformButton;
