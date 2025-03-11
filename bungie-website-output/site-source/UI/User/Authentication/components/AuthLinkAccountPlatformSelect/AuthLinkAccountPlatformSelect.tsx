import React, { FC } from "react";
import { Typography, Link, Button } from "plxp-web-ui/components/base";
import * as Globals from "@Enum";
import { Localizer } from "@bungie/localization";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import PlatformButton from "../AuthPlatformButton";
import { AuthUserLogoBlock } from "@UI/User/Authentication/components";
import { CREDENTIAL_CONTENT_MAP } from "../../constants/PlatformLabels";
import styles from "./AuthLinkAccountPlatformSelect.module.scss";
import { goBack } from "@Global/Redux/slices/authenticationSlice";
import { useDispatch } from "react-redux";

interface AuthLinkAccountPlatformSelectProps {}

const AuthLinkAccountPlatformSelect: FC<AuthLinkAccountPlatformSelectProps> = () => {
  const dispatch = useDispatch();
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "coresettings",
  ]);

  const { coreSettings } = globalState;
  const psnSystem = coreSettings.systems.PSNAuth;
  const xuidSystem = coreSettings.systems.XuidAuth;
  const steamSystem = coreSettings.systems.SteamIdAuth;
  const egsSystem = coreSettings.systems.EpicIdAuth;
  const twitchSystem = coreSettings.systems.Twitch;

  /* Strings */
  const AuthLoc = Localizer.webauth;
  const { WhichPlatformAccount, LinkedAccYouAreSignedInWith, GoBack } = AuthLoc;

  const SignedInWithLabel = Localizer.Format(LinkedAccYouAreSignedInWith, {
    platformName:
      CREDENTIAL_CONTENT_MAP?.[Globals.BungieCredentialType.Psnid].platformName,
    displayName: "Chicken",
  });

  const handleBack = () => {
    dispatch(goBack());
  };

  return (
    <>
      <AuthUserLogoBlock
        displayName={"ClarifiedButter"}
        credentialType={Globals.BungieCredentialType.Psnid}
      />
      <Typography variant={"body1"} sx={{ marginBottom: "1rem" }}>
        {WhichPlatformAccount}
      </Typography>
      <Typography variant={"body1"} sx={{ marginBottom: "1.75rem" }}>
        {SignedInWithLabel}
      </Typography>
      <div className={styles.buttonWrapper}>
        {psnSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.Psnid} />
        )}
        {steamSystem?.enabled && (
          <PlatformButton
            credentialType={Globals.BungieCredentialType.SteamId}
          />
        )}
        {xuidSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.Xuid} />
        )}
        {egsSystem?.enabled && (
          <PlatformButton credentialType={Globals.BungieCredentialType.EgsId} />
        )}
        {twitchSystem?.enabled && (
          <PlatformButton
            credentialType={Globals.BungieCredentialType.TwitchId}
          />
        )}
        <Link onClick={() => handleBack()}>{GoBack}</Link>
      </div>
    </>
  );
};

export default AuthLinkAccountPlatformSelect;
