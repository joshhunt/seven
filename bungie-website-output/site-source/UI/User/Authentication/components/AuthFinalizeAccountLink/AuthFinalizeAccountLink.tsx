import React, { FC, useState } from "react";
import { Typography, Button, TextField } from "plxp-web-ui/components/base";
import * as Globals from "@Enum";
import { Localizer } from "@bungie/localization";
import AuthUserIdentityCard from "@UI/User/Authentication/components/AuthUserIdentityCard";
import { Box } from "@mui/material";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { CREDENTIAL_CONTENT_MAP } from "../../constants/PlatformLabels";
import styles from "./AuthFinalizeAccountLink.module.scss";

interface AuthFinalizeAccountSelectProps {}

/* NOTE: All logic is pretty much placeholder */

const AuthFinalizeAccountSelect: FC<AuthFinalizeAccountSelectProps> = ({}) => {
  const [finalizeFormField, setFinalizeFormField] = useState(null);
  const handleFormChange = (value: string) => {
    setFinalizeFormField(value);
  };

  const {
    GoBack,
    FinalizeLink,
    ConfirmAndFinalizeLinking,
    TypeFinalizeLinkToContinue,
    OnceLinkedAccounts,
  } = Localizer.webauth;

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
        {FinalizeLink}
      </Typography>
      <Typography
        variant={"body1"}
        align={"center"}
        sx={{ marginBottom: "2.5rem" }}
      >
        {Localizer.Format(ConfirmAndFinalizeLinking, {
          LinkPlatform:
            CREDENTIAL_CONTENT_MAP[second_acc_data?.credentialType]
              ?.platformName,
        })}
      </Typography>
      <AuthUserIdentityCard
        accountData={second_acc_data}
        selectionOptions={{
          style: "card",
          isSelected: false,
        }}
      />
      <AuthUserIdentityCard
        accountData={initial_acc_data}
        selectionOptions={{
          style: "card",
          isSelected: true,
        }}
      />
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
          dangerouslySetInnerHTML={sanitizeHTML(OnceLinkedAccounts)}
        />
      </Box>
      <Typography variant={"body2"} sx={{ margin: "1.5rem 0 0.25rem 0" }}>
        {TypeFinalizeLinkToContinue}
      </Typography>
      <TextField
        accessibilityID={FinalizeLink}
        inputProps={{
          placeholder: FinalizeLink,
          onChange: (e) => handleFormChange(e?.target?.value),
        }}
      />
      <div className={styles.buttonContainer}>
        <Button variant={"contained"} color={"secondary"}>
          {GoBack}
        </Button>
        <Button
          variant={"contained"}
          disabled={finalizeFormField !== FinalizeLink}
        >
          {FinalizeLink}
        </Button>
      </div>
    </>
  );
};

export default AuthFinalizeAccountSelect;
