import React, { FC, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { Button, Link, Typography } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { BrowserUtils } from "@Utilities/BrowserUtils";
import * as Globals from "@Enum";
import { AuthUserLogoBlock } from "../";
import { CREDENTIAL_CONTENT_MAP } from "../../constants/PlatformLabels";
import styles from "./AuthLinkOrCreateAccount.module.scss";

interface AuthLinkOrCreateAccountProps {}

const AuthLinkOrCreateAccount: FC<AuthLinkOrCreateAccountProps> = ({}) => {
  const history = useHistory();
  const handleCreateAccount = () => {
    /* This is placeholder */
    /* The action of clicking "Create Account" should bring users to a
     * view where they can input their birthday and region */
    const link = `/en/User/CountryBirthday`;

    BrowserUtils.openWindow(link, "loginui", () => {
      GlobalStateDataStore.refreshUserAndRelatedData();
    });
  };
  const handleExistingAccount = () => {
    /* This is placeholder */
    /* The action of clicking "Link Existing" should bring users to a
     * view where they can select a platform with an existing BNET ID
     * to link their current signed in account with */
    const link = `/en/User/SelectOldAccount`;

    BrowserUtils.openWindow(link, "loginui", () => {
      GlobalStateDataStore.refreshUserAndRelatedData();
    });
  };
  const handleCancelSignIn = () => {
    /* This is placeholder */
    /* The action of clicking "Cancel" should bring users to the page they clicked "sign in"
     * from and log them out */
    window.location.href = `/en/User/SignOut?bru=${"/"}`;
  };

  const {
    IsThisYourFirstAccount,
    UserSignedInWith,
    LinkExistingProfileButton,
    CreateNewProfileButton,
    NotYouSignOut,
  } = Localizer.webauth;

  const userSignInWith = Localizer.Format(UserSignedInWith, {
    platformName:
      CREDENTIAL_CONTENT_MAP?.[Globals.BungieCredentialType.Psnid].platformName,
    displayName: "Chicken",
  });

  return (
    <>
      <AuthUserLogoBlock
        displayName={"Chicken"}
        credentialType={Globals.BungieCredentialType.Psnid}
      />
      <div className={styles.linkOrCreateCopyContainer}>
        <Typography variant={"body1"} sx={{ fontWeight: 700 }}>
          {IsThisYourFirstAccount}
        </Typography>
        <Typography variant={"body1"}>{userSignInWith}</Typography>
      </div>
      <div className={styles.linkOrCreateButtonContainer}>
        <Button
          onClick={() => handleExistingAccount()}
          variant={"contained"}
          size={"large"}
          sx={{ textTransform: "capitalize" }}
        >
          {LinkExistingProfileButton}
        </Button>
        <Button
          onClick={() => handleCreateAccount()}
          variant={"contained"}
          color={"secondary"}
          size={"large"}
          sx={{ textTransform: "capitalize" }}
        >
          {CreateNewProfileButton}
        </Button>
        <Link onClick={() => handleCancelSignIn()}>{NotYouSignOut}</Link>
      </div>
    </>
  );
};

export default AuthLinkOrCreateAccount;
