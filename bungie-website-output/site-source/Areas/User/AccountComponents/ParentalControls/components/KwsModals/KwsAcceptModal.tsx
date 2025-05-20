import React, { FC, ReactNode, useState, useEffect } from "react";
import { Dialog, Button } from "plxp-web-ui/components/base";
import { ContentStackClient } from "../../../../../../Platform/ContentStack/ContentStackClient";
import { Box } from "@mui/material";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import MailIcon from "@mui/icons-material/Mail";
import styles from "./ModalStyles.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";

interface DialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

interface ActionsProps {
  declineButton: {
    label: string;
    onClick: () => void;
  };
  acceptButton: {
    label: string;
    onClick: () => void;
  };
}

const DialogActions: FC<ActionsProps> = ({ declineButton, acceptButton }) => (
  <Box
    sx={{
      display: "flex",
      gap: "1rem",
    }}
  >
    <Button
      onClick={() => declineButton?.onClick()}
      variant={"outlined"}
      color={"secondary"}
    >
      {declineButton.label}
    </Button>
    <Button onClick={() => acceptButton?.onClick()} variant={"contained"}>
      {acceptButton.label}
    </Button>
  </Box>
);

/* TODO: Update Web UI lib for Dialog presentation */

const KwsAcceptModal: FC<DialogProps> = ({ open, onAccept, onDecline }) => {
  const [data, setData] = useState(null);
  const ParentalControlsLoc = Localizer.parentalcontrols;
  const cancelLabel = ParentalControlsLoc.Cancel;
  const { mobile } = useDataStore(Responsive);

  useEffect(() => {
    ContentStackClient()
      .ContentType("kws_agreement_modal")
      .Entry("blt6596d3e6ef7d824f")
      .language(BungieNetLocaleMap(Localizer.CurrentCultureName))
      .toJSON()
      .fetch()
      .then(setData);
  }, []);

  return (
    <Dialog
      dialogWrapperProps={{
        open: open,
        onClose: onDecline,
        scroll: mobile ? "body" : "paper",
      }}
      dialogTitleArea={{
        icon: mobile ? null : <MailIcon />,
        dialogTitleNode: data?.heading,
      }}
      dialogContentArea={{
        dialogContentNode: (
          <p
            className={styles.copy}
            id="dialog-description"
            dangerouslySetInnerHTML={sanitizeHTML(data?.copy)}
          />
        ),
      }}
      dialogActionsArea={{
        dialogActionsProps: {
          sx: {
            div: {
              flexDirection: mobile ? "column" : "row",
              width: mobile ? "100%" : "auto",
            },
          },
        },
        dialogActionsNode:
          (
            <DialogActions
              acceptButton={{
                label: data?.confirm_button_label,
                onClick: onAccept,
              }}
              declineButton={{
                label: cancelLabel,
                onClick: onDecline,
              }}
            />
          ) ?? null,
      }}
    />
  );
};

export default KwsAcceptModal;
