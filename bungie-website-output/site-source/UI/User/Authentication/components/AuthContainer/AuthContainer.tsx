import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { useAppDispatch } from "@Global/Redux/store";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ThemeProvider } from "@mui/material";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { useAuthFlow } from "@UI/User/hooks/useAuthFlow";
import classNames from "classnames";
import { ThemeProps } from "plxp-web-ui/themes";
import { themes } from "plxp-web-ui/themes/theme";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { BnetStackMultiFranchiseAuthFlow } from "../../../../../Generated/contentstack-types";
import { ContentStackClient } from "../../../../../Platform/ContentStack/ContentStackClient";
import AuthRightRailWrapper from "../AuthRightRailWrapper";
import { useLocation } from "react-router-dom";
import {
  FlowMode,
  AuthResponseStateEnum,
  AuthError,
} from "../../../types/authTypes";
import handleAuthError from "../../../scripts/AuthenticationErrorHandler";
import styles from "./AuthContainer.module.scss";

interface AuthContainerProps {
  theme?: ThemeProps["themeVariant"];
  children?: ReactNode;
}

/* Multi-Franchise Auth */

/* This is the wrapping container for the Multi-Franchise Auth flow.
 *  Image themes are based of the game param in the url (?game=[game-title])
 *  Images are sourced from Contentstack -
 *  Contentstack provides a THEME KEY (predefined in model, not manually entered by user) + Images
 *  */

interface IPMapProps {
  [key: string]: ThemeProps["themeVariant"];
}

const AuthContainer: FC<AuthContainerProps> = ({ theme, children }) => {
  /* Flow */
  const {
    canGoBack,
    navigateBack,
    navigateToStep,
    currentStep,
    nextSteps,
    nextEnabled,
    reset,
    component,
  } = useAuthFlow();
  const location = useLocation();
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<AuthError | null>(null);
  const [flowMode, setFlowMode] = useState<FlowMode>(FlowMode.SignIn);

  /* Theming */
  const defaultTheme = "bungie-core"; // For MUI theme provider
  const defaultDisplay = "bungie"; // For UI items sourced from Contentstack

  /* Get, Set Params */
  const params = new URLSearchParams(document.location.search);
  const game = params.get("game")?.toLowerCase();
  const IP_MAP = ["destiny", "marathon"]; // Good for now, longterm - thinking MANY IP, we probably want this driven by a const elsewhere

  /* Make sure param is a Bungie IP */
  const getThemeSanitizedParam = (param: string): string => {
    if (IP_MAP?.includes(param)) {
      return IP_MAP?.find((ip) => ip?.toLowerCase() === param);
    }

    return defaultDisplay;
  };

  const [param, setParam] = useState<string>(getThemeSanitizedParam(game));

  /* Contentstack */
  const [data, setData] = useState<BnetStackMultiFranchiseAuthFlow>(null);
  const { mobile, medium } = useDataStore(Responsive);
  const bgData = data?.background_assets?.background_items;
  const hasBgData = bgData?.length > 0;
  const getSetBackgroundImageUrl = () => {
    if (hasBgData) {
      if (mobile) {
        return bgData?.find((img) => img?.theme_key?.toLowerCase() === param)
          ?.mobile_image?.url;
      }

      if (medium) {
        return bgData?.find((img) => img?.theme_key?.toLowerCase() === param)
          ?.tablet_image?.url;
      }

      return bgData?.find((img) => img?.theme_key.toLowerCase() === param)
        ?.desktop_image?.url;
    }
  };
  const backgroundImage = hasBgData
    ? {
        backgroundImage: `url(${getSetBackgroundImageUrl()})`,
      }
    : {};

  /* Strings */
  const { GoBack } = Localizer.Webauth;

  useEffect(() => {
    ContentStackClient()
      .ContentType("multi_franchise_auth_flow")
      .Entry("blte6eb234009b6d7e8")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("bru");
    if (returnUrl) {
      sessionStorage.setItem("auth_return_url", returnUrl);
    }

    const errorParam = params.get("error");
    if (errorParam) {
      const errorState = handleAuthError({ state: errorParam });
      setError(errorState);
    }
  }, [location]);

  if (error) {
    return (
      <div className={styles.error}>
        <h2 className={styles.errorTitle}>Error</h2>
        <p className={styles.errorMessage}>{error.message}</p>
        {error.state === AuthResponseStateEnum.SystemDisabled && (
          <p>
            The authentication system is currently disabled. Please try again
            later.
          </p>
        )}
        <button onClick={() => setError(null)} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ThemeProvider theme={themes[defaultTheme]}>
      <BungieHelmet
        title={flowMode === FlowMode.SignIn ? "Sign In" : "Link Account"}
      >
        <body
          className={classNames(
            SpecialBodyClasses(
              BodyClasses.NoSpacer |
                BodyClasses.HideMainNav |
                BodyClasses.HideMainFooter
            )
          )}
        />
      </BungieHelmet>
      <div className={styles.wrapper} style={{ ...backgroundImage }}>
        <button
          aria-label={GoBack}
          onClick={navigateBack}
          className={styles.buttonContainer}
        >
          <div className={styles.iconContainer}>
            <ArrowBackIosNewIcon
              sx={{
                color: "white",
                margin: "0 auto",
              }}
            />
          </div>
          <img src="/7/ca/bungie/icons/logos/bungienet/bungie_logo_footer.png" />
        </button>

        {children && (
          <div className={styles.childWrapper}>
            <AuthRightRailWrapper>{children}</AuthRightRailWrapper>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default AuthContainer;
