import { ConvertToPlatformError } from "@ApiIntermediary";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Platform } from "@Platform";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { FC, useState } from "react";
import { Snackbar, Box } from "@mui/material";
import { Alert, Button, Dialog } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization";
import MailIcon from "@mui/icons-material/Mail";

interface DialogProps {
  open: boolean;
  onDismiss: () => void;
}

interface ActionsProps {
  dismissButton: {
    onClick: () => void;
  };
}

const DialogActions: FC<ActionsProps> = ({ dismissButton }) => {
  const [openSnack, setOpenSnack] = useState(false);
  const handleResendEmail = () =>
    Platform.UserService.RevalidateEmail()
      .then((data) => {
        if (data) {
          dismissButton?.onClick();
          setOpenSnack(true);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        dismissButton?.onClick();
        Modal.error(e);
      });
  const { ResendVerificationEmail, Dismiss } = Localizer.parentalcontrols;

  return (
    <Box sx={{ display: "flex", gap: "0.5rem", flexFlow: "wrap" }}>
      <Button
        onClick={() => dismissButton?.onClick()}
        color={"secondary"}
        variant={"outlined"}
      >
        {Dismiss}
      </Button>
      <Button onClick={() => handleResendEmail()} variant={"contained"}>
        {ResendVerificationEmail}
      </Button>
      <Snackbar
        open={openSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={() => setOpenSnack(false)}
      >
        <div>
          <Alert
            onClose={() => setOpenSnack(false)}
            severity={"success"}
            variant="filled"
            sx={{ width: "100%", minWidth: "200px" }}
          >
            <p>{Localizer.Userresearch.SettingsHaveChanged}</p>
          </Alert>
        </div>
      </Snackbar>
    </Box>
  );
};

const VerifyEmailModal: FC<DialogProps> = ({ open, onDismiss }) => {
  const ParentalControlsLoc = Localizer.parentalcontrols;
  const heading = ParentalControlsLoc.PleaseVerifyYourEmail;
  const subheading = ParentalControlsLoc.BeforeAcceptingAUserInto;
  const { mobile } = useDataStore(Responsive);

  return (
    <Dialog
      dialogWrapperProps={{ open: open }}
      dialogTitleArea={{
        icon: mobile ? null : <MailIcon />,
        dialogTitleNode: heading,
      }}
      dialogContentTextArea={{
        dialogContentTextNode: subheading,
        dialogContentTextProps: { sx: { color: "#fff" } },
      }}
      dialogActionsArea={{
        dialogActionsNode:
          <DialogActions dismissButton={{ onClick: onDismiss }} /> ?? null,
      }}
    />
  );
};

export default VerifyEmailModal;
