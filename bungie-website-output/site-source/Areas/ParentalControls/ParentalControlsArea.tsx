import React, { FC, useEffect } from "react";
import { Button, Typography } from "plxp-web-ui/components/base";
import { HeadsetMic, Chat, CreditCard } from "@mui/icons-material";
import styles from "./ParentalControlsArea.module.scss";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import classNames from "classnames";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { UserUtils } from "@Utilities/UserUtils";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Redirect, useHistory } from "react-router-dom";
import { RouteHelper } from "@Routes/RouteHelper";
import { Localizer } from "@bungie/localization";

interface LandingPageProps {}

const ParentalControlsArea: FC<LandingPageProps> = () => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const isLoggedIn = UserUtils.isAuthenticated(globalState);
  const history = useHistory();

  const handleSignInClick = () => {
    const signInModal = Modal.signIn(() => {
      signInModal.current.close();
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      history.push(RouteHelper.ParentalControls().url);
    }
  }, [isLoggedIn]);

  const {
    SignIn,
    VirtualCurrencyValue,
    TextChatValue,
    VoiceChatValue,
    ManageAccess,
    PleaseSignInToAcceptInvite,
    ParentalControls,
    AccessParentalControls,
  } = Localizer.parentalcontrols;

  return (
    <>
      <BungieHelmet
        title={ParentalControls}
        description={AccessParentalControls}
        image={"7/ca/bungie/bgs/bungie_home_og.jpg"}
      >
        <body className={classNames(styles.primaryBg)} />
      </BungieHelmet>
      <div className={styles.container}>
        <Typography
          variant={"h3"}
          component={"h1"}
          align={"center"}
          sx={{ marginBottom: "1rem" }}
        >
          {ParentalControls}
        </Typography>
        <Typography
          variant={"body1"}
          align={"center"}
          sx={{ marginBottom: "3rem" }}
        >
          {PleaseSignInToAcceptInvite}
        </Typography>
        <Button
          sx={{ marginBottom: "3rem" }}
          variant={"contained"}
          size={"large"}
          onClick={() => handleSignInClick()}
        >
          {SignIn}
        </Button>
        <Typography
          variant={"h6"}
          align={"center"}
          sx={{ marginBottom: "1.5rem" }}
        >
          {ManageAccess}
        </Typography>

        <div className={styles.valuePropCards}>
          <div className={styles.card}>
            <HeadsetMic />
            <Typography variant={"body1"}>{VoiceChatValue}</Typography>
          </div>
          <div className={styles.card}>
            <Chat />
            <Typography variant={"body1"}>{TextChatValue}</Typography>
          </div>
          <div className={styles.card}>
            <CreditCard />
            <Typography variant={"body1"}>{VirtualCurrencyValue}</Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentalControlsArea;
