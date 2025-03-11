import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Checkbox,
  Button,
} from "plxp-web-ui/components/base";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import * as Globals from "@Enum";
import { AuthUserLogoBlock } from "@UI/User/Authentication/components";
import { Localizer } from "@bungie/localization";

import styles from "./AuthPrivacyAndTerms.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";

interface AuthPrivacyAndTermsProps {
  isChild?: boolean;
}

interface EmailState {
  value: string;
  error: boolean;
  errorType: "errorNoValue" | "errorInvalidFormat" | null;
  errorMessages: {
    errorNoValue: string;
    errorInvalidFormat: string;
  };
}

interface FormState {
  optIn: boolean;
  acceptedTerms: boolean;
  email: EmailState;
}

const AuthPrivacyAndTerms: FC<AuthPrivacyAndTermsProps> = ({ isChild }) => {
  /* Strings */
  const {
    PleaseEnterAValidEmail,
    EmailRequired,
    ExampleEmail,
    EmailAddressLabel,
    AlmostThereEnterEmail,
    BungieRewardsOptInLabel,
    BungieRewardsOptInConsent,
    BungieRewardsCommunicationsOptIn,
    IAgreeToTheAHrefPrivacylink,
    CreateButtonLabel,
    Cancel,
  } = Localizer.webauth;

  const AgreeToPrivacy = Localizer.Format(IAgreeToTheAHrefPrivacylink, {
    privacyLink: RouteHelper.LegalPage({
      pageName: "privacypolicy",
    }).url,
    termLink: RouteHelper.LegalPage({
      pageName: "terms",
    }).url,
  });

  /* Form State */
  const [formState, setFormState] = useState<FormState>({
    optIn: false,
    acceptedTerms: false,
    email: {
      value: "",
      error: null,
      errorType: null,
      errorMessages: {
        errorNoValue: EmailRequired,
        errorInvalidFormat: PleaseEnterAValidEmail,
      },
    },
  });

  /*Validate email - this is looking for formatting*/
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validateEmail = (value: string) => {
    let error = false;
    let errorType: "errorNoValue" | "errorInvalidFormat" | null = null;

    if (!value) {
      error = true;
      errorType = "errorNoValue";
    } else if (!emailRegex.test(value)) {
      error = true;
      errorType = "errorInvalidFormat";
    }

    setFormState((prevState) => ({
      ...prevState,
      email: {
        ...prevState.email,
        value,
        error,
        errorType,
      },
    }));
  };

  /* Update the state and validate email on form element change */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    if (name === "email") {
      validateEmail(value);
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: fieldValue,
      }));
    }
  };

  /* Button should only be clickable when terms are accepted and a valid email is entered */
  const isButtonDisabled = !(
    formState.acceptedTerms &&
    !formState.email.error &&
    emailRegex.test(formState.email.value)
  );

  /* Placeholder code starts here*/

  const handleCreateAccount = () => {
    console.log("create form state", formState);
  };
  const handleCancelSignIn = () => {
    /* The action of clicking "Cancel" should bring users to the page they clicked "sign in"
     * from and log them out */
    window.location.href = `/en/User/SignOut?bru=${"/"}`;
  };

  /* Placeholder code ends */

  return (
    <>
      {/* Placeholder props */}
      <AuthUserLogoBlock
        displayName={"ClarifiedButter"}
        credentialType={Globals.BungieCredentialType.Psnid}
      />
      <Typography
        variant={"body1"}
        sx={{
          marginBottom: "1.75rem",
        }}
      >
        {AlmostThereEnterEmail}
      </Typography>
      <TextField
        inputProps={{
          required: true,
          id: "outlined-required",
          placeholder: ExampleEmail,
          type: "email",
          error: formState?.email?.errorType?.length > 0,
          name: "email",
          onChange: (e) => handleChange(e),
          className: styles.overrides,
          sx: {
            marginBottom: "1.25rem",
            "& .MuiInputBase-root, & .MuiInputBase-input": {
              width: "100%",
            },
          },
        }}
        accessibilityID={ExampleEmail}
        labelArea={{ labelString: EmailAddressLabel }}
        helperText={
          formState?.email?.errorType?.length > 0
            ? formState?.email.errorMessages[formState?.email?.errorType]
            : null
        }
      />
      {!isChild ? (
        <Accordion
          sx={(theme) => ({
            borderRadius: theme.borderRadius.card.medium,
            backgroundColor: theme.palette.background.paper3,
            marginBottom: "1.75rem",
          })}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={(theme) => ({
                  color: theme.palette.common.white,
                })}
              />
            }
          >
            <Typography>{BungieRewardsOptInLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant={"body2"}>
              {BungieRewardsOptInConsent}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ) : null}

      {!isChild ? (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              name={"optIn"}
              onChange={(e) => handleChange(e)}
            />
          }
          label={
            <Typography variant={"caption"}>
              {BungieRewardsCommunicationsOptIn}
            </Typography>
          }
        />
      ) : null}
      <FormControlLabel
        control={
          <Checkbox
            required
            size="small"
            name={"acceptedTerms"}
            onChange={(e) => handleChange(e)}
          />
        }
        label={
          <Typography
            variant={"caption"}
            dangerouslySetInnerHTML={sanitizeHTML(AgreeToPrivacy)}
          />
        }
        sx={{ marginBottom: "1.5rem" }}
      />

      <Button
        variant={"contained"}
        disabled={isButtonDisabled}
        onClick={() => handleCreateAccount()}
        sx={{ marginBottom: "1.25rem" }}
        type={"submit"}
      >
        {CreateButtonLabel}
      </Button>
      <Button
        variant={"contained"}
        color={"secondary"}
        onClick={() => handleCancelSignIn()}
      >
        {Cancel}
      </Button>
    </>
  );
};

export default AuthPrivacyAndTerms;
