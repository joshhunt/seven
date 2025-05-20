import React, { FC, ReactNode } from "react";
import { Button, Dialog } from "plxp-web-ui/components/base";
import { Localizer } from "@bungie/localization";
import MailIcon from "@mui/icons-material/Mail";

interface DialogProps {
  open: boolean;
  onAccept: () => void;
}

interface ActionsProps {
  acceptButton: {
    label: string;
    onClick: () => void;
  };
}

const DialogActions: FC<ActionsProps> = ({ acceptButton }) => (
  <div>
    <Button onClick={() => acceptButton?.onClick()} variant={"contained"}>
      {acceptButton.label}
    </Button>
  </div>
);

const KwsConfirm: FC<DialogProps> = ({ open, onAccept }) => {
  const ParentalControlsLoc = Localizer.parentalcontrols;
  const heading = ParentalControlsLoc.KwsConfirmationModalHeading;
  const subheading = ParentalControlsLoc.KwsConfirmationModalSubheading;
  const buttonLabel = ParentalControlsLoc.KwsConfirmationModalButtonLabel;

  return (
    <Dialog
      dialogWrapperProps={{ open: open }}
      dialogTitleArea={{ dialogTitleNode: heading }}
      dialogContentTextArea={{
        dialogContentTextNode: subheading,
        dialogContentTextProps: { sx: { color: "#fff" } },
      }}
      dialogActionsArea={{
        dialogActionsNode:
          (
            <DialogActions
              acceptButton={{ label: buttonLabel, onClick: onAccept }}
            />
          ) ?? null,
      }}
    />
  );
};

export default KwsConfirm;
