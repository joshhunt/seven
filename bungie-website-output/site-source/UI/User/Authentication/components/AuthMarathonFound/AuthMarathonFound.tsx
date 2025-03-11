import React, { FC, useState } from "react";
import * as Globals from "@Enum";
import { Box } from "@mui/material";
import { Typography, Button } from "plxp-web-ui/components/base";
import AuthUserIdentityCard from "@UI/User/Authentication/components/AuthUserIdentityCard";
import { goBack } from "@Global/Redux/slices/authenticationSlice";
import { Localizer } from "@bungie/localization";
import { useDispatch } from "react-redux";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { CREDENTIAL_CONTENT_MAP } from "@UI/User/Authentication/constants/PlatformLabels";
import styles from "./AuthMarathonFound.module.scss";

interface AuthMarathonFoundProps {}

/* NOTE: All logic is pretty much placeholder */

const AuthMarathonFound: FC<AuthMarathonFoundProps> = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const alertMessage = `Use my current progress and <span>delete {alternatePlatform} progress</span>. This choice is final and cannot be reverted`;
  const dispatch = useDispatch();

  const {
    GoBack,
    MarathonFound,
    OnlyGameDataFromOneMarathon,
    ConfirmSelection,
    PlaytimeHoursPlayed,
    KeepMyPlatformnameProgress,
    KeepMyCurrentProgress,
    UseMyPlatformnameMarathon,
    UseMySelectedplatform,
  } = Localizer.webauth;

  const handleBack = () => {
    dispatch(goBack());
  };

  /* The BungieNet Profile */
  const initial_acc_data = {
    displayName: "ClarifiedButter",
    credentialType: "bnet_profile",
    avatarUrl: "7/ca/destiny/icons/pcmigration/annualpass.png",
    gameTime: "700",
    id: "119288282",
  };

  /* The platform account they logged in with */
  const second_acc_data = {
    displayName: "GheeGheeGhee",
    credentialType: Globals.BungieCredentialType.SteamId,
    gameTime: "50",
    id: "47573682",
  };

  return (
    <>
      <Typography
        variant={"h5"}
        align={"center"}
        sx={{ marginBottom: "0.25rem" }}
      >
        {MarathonFound}
      </Typography>
      <Typography
        variant={"body1"}
        align={"center"}
        sx={{ marginBottom: "2.5rem" }}
      >
        {OnlyGameDataFromOneMarathon}
      </Typography>
      <AuthUserIdentityCard
        label={KeepMyCurrentProgress}
        accountData={initial_acc_data}
        caption={Localizer.Format(PlaytimeHoursPlayed, {
          PlayTime: initial_acc_data?.gameTime,
        })}
        selectionOptions={{
          style: "button",
          isSelected: selectedAccount?.id === initial_acc_data?.id,
          setSelectedAccount: () => setSelectedAccount(initial_acc_data),
        }}
      />
      <AuthUserIdentityCard
        label={
          selectedAccount?.id !== second_acc_data?.id
            ? Localizer.Format(UseMyPlatformnameMarathon, {
                platformName:
                  CREDENTIAL_CONTENT_MAP[second_acc_data?.credentialType]
                    ?.platformName,
              })
            : Localizer.Format(KeepMyPlatformnameProgress, {
                platformName:
                  CREDENTIAL_CONTENT_MAP[second_acc_data?.credentialType]
                    ?.platformName,
              })
        }
        accountData={second_acc_data}
        caption={Localizer.Format(PlaytimeHoursPlayed, {
          PlayTime: second_acc_data?.gameTime,
        })}
        selectionOptions={{
          style: "button",
          isSelected: selectedAccount?.id === second_acc_data?.id,
          setSelectedAccount: () => setSelectedAccount(second_acc_data),
        }}
      />
      {selectedAccount?.id ? (
        <Box
          sx={(theme) => ({
            borderRadius: "0.5rem",
            border: "1px solid #32404E",
            backgroundColor: theme.palette.background.paper3,
            padding: "1rem",
            textAlign: "center",
          })}
        >
          <Typography
            variant={"caption"}
            sx={(theme) => ({
              ["span"]: {
                color: theme.palette.error.main,
                fontWeight: 700,
              },
            })}
            dangerouslySetInnerHTML={sanitizeHTML(
              Localizer.Format(UseMySelectedplatform, {
                selectedPlatform:
                  CREDENTIAL_CONTENT_MAP[selectedAccount?.credentialType]
                    ?.platformName,
                alternatePlatform:
                  CREDENTIAL_CONTENT_MAP[
                    (selectedAccount?.id === initial_acc_data?.id
                      ? second_acc_data
                      : initial_acc_data
                    )?.credentialType
                  ]?.platformName,
              })
            )}
          />
        </Box>
      ) : null}
      <div className={styles.buttonContainer}>
        <Button
          variant={"contained"}
          color={"secondary"}
          onClick={() => handleBack()}
        >
          {GoBack}
        </Button>
        <Button disabled={!Boolean(selectedAccount)} variant={"contained"}>
          {ConfirmSelection}
        </Button>
      </div>
    </>
  );
};

export default AuthMarathonFound;
