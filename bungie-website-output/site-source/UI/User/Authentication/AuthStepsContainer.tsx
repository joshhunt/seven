import React, { FC, ReactNode, useState, MouseEvent } from "react";
import useFlowStateAuthStep from "@UI/User/hooks/useFlowStateAuthStep";
import { Menu, MenuItem, Button } from "plxp-web-ui/components/base";
import { Box } from "@mui/material";
import {
  AuthContainer,
  AuthPlatformSelect,
  AuthLinkOrCreateAccount,
  AuthPrivacyAndTerms,
  AuthAgeGate,
  AuthLinkAccountPlatformSelect,
  AuthMarathonFound,
  AuthFinalizeAccountLink,
} from "@UI/User/Authentication/components";

interface AuthStepsContainerProps {}
interface AuthStepsMapProps {
  [key: string]: ReactNode;
}

const AuthStepsContainer: FC<AuthStepsContainerProps> = () => {
  const [currentStep, setCurrentStep] = useState("marathonFound");
  const AUTH_STEPS_MAP: AuthStepsMapProps = {
    platformSelect: <AuthPlatformSelect />,
    firstAccountCheck: <AuthLinkOrCreateAccount />,
    adultProfileCreate: <AuthPrivacyAndTerms />,
    childProfileCreate: <AuthPrivacyAndTerms isChild />,
    authAgeGate: <AuthAgeGate />,
    linkProfile: <AuthLinkAccountPlatformSelect />,
    marathonFound: <AuthMarathonFound />,
    finalizeLink: <AuthFinalizeAccountLink />,
  };

  /*  ▼ DELETE THIS ▼  */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const options = [
    { value: "platformSelect", label: "Platform Select" },
    { value: "firstAccountCheck", label: "Link or Create" },
    { value: "adultProfileCreate", label: "Adult Profile Create" },
    { value: "childProfileCreate", label: "Child Profile Create" },
    { value: "authAgeGate", label: "Age Gate" },
    { value: "linkProfile", label: "Link Existing Profile" },
    { value: "marathonFound", label: "Marathon Found" },
    { value: "finalizeLink", label: "Finalize Link" },
  ];

  /*  ▲ DELETE THIS ▲  */

  useFlowStateAuthStep();

  return (
    <>
      <AuthContainer>{AUTH_STEPS_MAP[currentStep]}</AuthContainer>
      {/*  ▼  DELETE THIS WHEN THE FLOW IS IMPLEMENTED  ▼  */}
      <Box
        sx={{
          position: "absolute",
          right: "1.25rem",
          top: "1rem",
        }}
      >
        <Button variant="contained" id="button-example" onClick={handleClick}>
          {options?.find((itm) => itm?.value === currentStep)?.label}
        </Button>
        <Menu
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          sx={{ "& .MuiPaper-root": { backgroundColor: "#000" } }}
        >
          {options.map((step) => (
            <MenuItem
              onClick={() => setCurrentStep(step.value)}
              sx={{ backgroundColor: "#000" }}
            >
              {step.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      {/*  ▲ DELETE THIS WHEN THE FLOW IS IMPLEMENTED ▲  */}
    </>
  );
};
export default AuthStepsContainer;
