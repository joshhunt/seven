import VerifyEmailModal from "@Areas/User/AccountComponents/ParentalControls/components/KwsModals/VerifyEmailModal";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { FC, useState } from "react";
import {
  ConvertToPlatformError,
  ConvertToPlatformErrorSync,
} from "@ApiIntermediary";
import { Localizer } from "@bungie/localization";
import {
  AgeCategoriesEnum,
  ParentOrGuardianAssignmentStatusEnum,
  ResponseStatusEnum,
} from "@Enum";
import { Platform, PnP } from "@Platform";
import classNames from "classnames";
import { Avatar, Button } from "plxp-web-ui/components/base";
import { ButtonProps } from "@mui/material";
import {
  usePlayerContext,
  removePendingChildCookie,
} from "@Areas/User/AccountComponents/ParentalControls/lib";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { useHistory, useLocation } from "react-router-dom";
import KwsAcceptModal from "../../../KwsModals/KwsAcceptModal";
import KwsConfirmModal from "../../../KwsModals/KwsConfirmModal";
import styles from "./UserPanel.module.scss";
import { Dialog } from "plxp-web-ui/components/base";
import { Spinner } from "@UI/UIKit/Controls/Spinner";

interface UserPanelProps {
  assignedAccount?: PnP.GetPlayerContextResponse["playerContext"];
  asContainer?: boolean;
}

interface InternalButtonProps extends ButtonProps {
  label: string;
}

const parseLocale = (defaultLocale: string, locale?: string): string[] =>
  locale ? locale.split("-") : defaultLocale.split("-");

const UserPanel: FC<UserPanelProps> = ({ assignedAccount, asContainer }) => {
  const ParentalControlsLoc = Localizer.parentalcontrols;
  const requestsToJoin = Localizer.Format(
    ParentalControlsLoc.RequestsToJoinFamily,
    {
      userid: assignedAccount.displayName,
    }
  );
  const parsedLocale = parseLocale(Localizer.CurrentCultureName);
  const currentLang = parsedLocale[0] ?? "en";

  /* Accept */
  const [openKws, setKwsOpen] = useState(false);
  const [openConfirm, setConfirmOpen] = useState(false);
  const [kwsLoading, setKwsLoading] = useState(false);
  const [openValidateEmail, setOpenValidateEmail] = useState(false);
  const [unlinkConfirmationOpen, setUnlinkConfirmationOpen] = useState(false);

  const {
    playerContext,
    pendingChildId,
    refreshPlayerContext,
  } = usePlayerContext();

  const history = useHistory();
  const location = useLocation();

  const clearParams = () => {
    history.replace(location.pathname);
  };

  /* Controls what happens when a user clicks "Accept" in the KWS Acceptance Modal*/
  const onKWSAccept = async () => {
    /* On accept, send KWS email - then set them as "pending", remove cookie - then refresh playerContext */
    try {
      setKwsLoading(true);
      const emailResponse = await Platform.PnpService.SendVerificationEmail(
        playerContext?.membershipId,
        pendingChildId
      );
      if (emailResponse !== ResponseStatusEnum.Success) {
        Modal.error({
          name: ResponseStatusEnum[emailResponse],
          message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[emailResponse]}`,
        });
        return;
      }
      const setPendingResponse = await Platform.PnpService.SetParentOrGuardianAsPendingForChild(
        pendingChildId,
        playerContext?.membershipId
      );
      if (setPendingResponse !== ResponseStatusEnum.Success) {
        Modal.error({
          name: ResponseStatusEnum[setPendingResponse],
          message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[setPendingResponse]}`,
        });
        return;
      }
      setConfirmOpen(true);
    } catch (e) {
      const platformResponse = ConvertToPlatformErrorSync(e);
      Modal.error(platformResponse);
    } finally {
      setKwsLoading(false);
      setKwsOpen(false);
      clearParams();
      removePendingChildCookie();
      refreshPlayerContext();
    }
  };

  const isChild = EnumUtils.looseEquals(
    playerContext?.ageCategory,
    AgeCategoriesEnum.Child,
    AgeCategoriesEnum
  );
  const displayName = isChild
    ? playerContext?.parentOrGuardianDisplayName
    : assignedAccount?.displayName;
  const userAvatar = isChild
    ? playerContext?.parentOrGuardianProfilePicturePath
    : assignedAccount?.profilePicturePath;
  const hasNoAssignment = EnumUtils.looseEquals(
    assignedAccount?.parentOrGuardianAssignmentStatus,
    ParentOrGuardianAssignmentStatusEnum.None,
    ParentOrGuardianAssignmentStatusEnum
  );

  const panelUserLabel = hasNoAssignment ? requestsToJoin : displayName;

  const unlinkParent = async () => {
    try {
      const r = await Platform.PnpService.UnassignParentOrGuardianFromChild(
        assignedAccount?.membershipId
      );
      if (r !== ResponseStatusEnum.Success) {
        Modal.error({
          name: ResponseStatusEnum[r],
          message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[r]}`,
        });
      }
    } catch (e) {
      Modal.error(ConvertToPlatformErrorSync(e));
    } finally {
      refreshPlayerContext();
    }
  };

  const handleClick = () => {
    if (playerContext?.isEmailVerified) {
      setKwsOpen(true);
    } else {
      setOpenValidateEmail(true);
    }
  };

  type ButtonStateMap = {
    [K in ParentOrGuardianAssignmentStatusEnum]: InternalButtonProps;
  };
  const BUTTON_STATES: ButtonStateMap = {
    [ParentOrGuardianAssignmentStatusEnum.None]: {
      // Shows for Cookie child
      onClick: () => handleClick(),
      label: ParentalControlsLoc.AcceptLabel,
      disabled: false as boolean,
      variant: "contained",
    },
    [ParentOrGuardianAssignmentStatusEnum.Pending]: {
      // Shows for pending child
      onClick: () => handleClick(),
      label: ParentalControlsLoc.PendingLabel,
      disabled: true as boolean,
      variant: "contained",
      sx: { pointerEvents: "none" },
    },
    [ParentOrGuardianAssignmentStatusEnum.Assigned]: {
      // Shows for assigned child
      onClick: (e) => {
        e.stopPropagation();
        setUnlinkConfirmationOpen(true);
      },
      label: ParentalControlsLoc.UnlinkLabel,
      disabled: false as boolean,
      variant: "outlined",
      color: "error",
    },
    [ParentOrGuardianAssignmentStatusEnum.Unassigned]: {
      // Shouldn't show
      onClick: () => handleClick(),
      label: ParentalControlsLoc.AcceptLabel,
      disabled: true as boolean,
      variant: "contained",
    },
  };

  const PanelButton = () => (
    <Button
      {...BUTTON_STATES[assignedAccount.parentOrGuardianAssignmentStatus]}
    >
      {BUTTON_STATES[assignedAccount.parentOrGuardianAssignmentStatus]?.label}
    </Button>
  );

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.container]: asContainer,
        [styles.backgroundBase]: !hasNoAssignment && asContainer,
        [styles.backgroundAccept]: hasNoAssignment,
      })}
    >
      <div className={styles.userContainer}>
        <Avatar src={userAvatar} />
        <p lang={currentLang} className={styles.userLabel}>
          {panelUserLabel}
        </p>
      </div>
      <Dialog
        dialogWrapperProps={{
          open: unlinkConfirmationOpen,
          onClose: (_reason) => setUnlinkConfirmationOpen(false),
        }}
        dialogTitleArea={{
          dialogTitleNode: Localizer.format(
            ParentalControlsLoc.ParentUnlinkConfirmationHeading,
            {
              user: displayName,
            }
          ),
        }}
        dialogActionsArea={{
          dialogActionsNode: (
            <div className={styles.buttonContainer}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setUnlinkConfirmationOpen(false);
                }}
                variant={"outlined"}
              >
                {ParentalControlsLoc.Cancel}
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  unlinkParent();
                  setUnlinkConfirmationOpen(false);
                }}
                variant={"contained"}
              >
                {ParentalControlsLoc.ParentUnlinkConfirmationButton}
              </Button>
            </div>
          ),
        }}
      />
      <PanelButton />
      <KwsAcceptModal
        isLoading={kwsLoading}
        open={openKws}
        onAccept={() => onKWSAccept()}
        onDecline={() => setKwsOpen(false)}
      />
      <KwsConfirmModal
        open={openConfirm}
        onAccept={() => {
          /* Close modal and set child as pending */
          setConfirmOpen(false);
        }}
      />
      <VerifyEmailModal
        open={openValidateEmail}
        onDismiss={() => setOpenValidateEmail(false)}
      />
    </div>
  );
};

export default UserPanel;
