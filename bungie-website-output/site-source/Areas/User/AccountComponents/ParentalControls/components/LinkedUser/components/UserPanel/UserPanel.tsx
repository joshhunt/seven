import VerifyEmailModal from "@Areas/User/AccountComponents/ParentalControls/components/KwsModals/VerifyEmailModal";
import { EnumUtils } from "@Utilities/EnumUtils";
import React, { FC, useState } from "react";
import { ConvertToPlatformError } from "@ApiIntermediary";
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

interface UserPanelProps {
  asContainer?: boolean;
  assignedAccount?: PnP.GetPlayerContextResponse["playerContext"];
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
  const [openValidateEmail, setOpenValidateEmail] = useState(false);

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

  const setChildAsPending = () => {
    Platform.PnpService.SetParentOrGuardianAsPendingForChild(
      pendingChildId,
      playerContext?.membershipId
    )
      .then((r) => {
        if (r !== ResponseStatusEnum.Success) {
          Modal.error({
            name: ResponseStatusEnum[r],
            message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[r]}`,
          });
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        clearParams();
        removePendingChildCookie();
        refreshPlayerContext();
      });
  };

  /* Controls what happens when a user clicks "Accept" in the KWS Acceptance Modal*/
  const onKWSAccept = async () => {
    setKwsOpen(false);

    /* On accept, send KWS email - then set them as "pending", remove cookie - then refresh playerContext */
    await Platform.PnpService.SendVerificationEmail(
      playerContext?.membershipId,
      pendingChildId
    )
      .then((r) => {
        if (r !== ResponseStatusEnum.Success) {
          Modal.error({
            name: ResponseStatusEnum[r],
            message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[r]}`,
          });
        } else {
          /* Open confirmation modal */
          setConfirmOpen(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
    await Platform.PnpService.UnassignParentOrGuardianFromChild(
      assignedAccount?.membershipId
    )
      .then((r) => {
        if (r !== ResponseStatusEnum.Success) {
          Modal.error({
            name: ResponseStatusEnum[r],
            message: `${Localizer.errors.UnhandledError} Error: ${ResponseStatusEnum[r]}`,
          });
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => {
        Modal.error(e);
      })
      .finally(() => {
        refreshPlayerContext();
      });
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
      onClick: () => unlinkParent(),
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

  return asContainer ? (
    <div
      className={classNames(styles.container, {
        [styles.backgroundBase]: !hasNoAssignment,
        [styles.backgroundAccept]: hasNoAssignment,
      })}
    >
      <div className={styles.userContainer}>
        <Avatar src={userAvatar} />
        <p lang={currentLang} className={styles.userLabel}>
          {panelUserLabel}
        </p>
      </div>
      <PanelButton />
      <KwsAcceptModal
        open={openKws}
        onAccept={() => onKWSAccept()}
        onDecline={() => setKwsOpen(false)}
      />
      <KwsConfirmModal
        open={openConfirm}
        onAccept={() => {
          /* Close modal and set child as pending */
          setConfirmOpen(false);
          setChildAsPending();
        }}
      />
      <VerifyEmailModal
        open={openValidateEmail}
        onDismiss={() => setOpenValidateEmail(false)}
      />
    </div>
  ) : (
    <div className={styles.userContainer}>
      <Avatar src={assignedAccount?.profilePicturePath} />
      <p className={styles.userLabel}>{assignedAccount.displayName}</p>
    </div>
  );
};

export default UserPanel;
