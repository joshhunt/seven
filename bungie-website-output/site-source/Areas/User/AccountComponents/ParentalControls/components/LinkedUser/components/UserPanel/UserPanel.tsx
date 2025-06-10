import React, { FC, useState, useEffect } from "react";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization";
import {
  ParentOrGuardianAssignmentStatusEnum,
  ResponseStatusEnum,
} from "@Enum";
import { Platform, PnP } from "@Platform";
import classNames from "classnames";
import { Avatar, Button } from "plxp-web-ui/components/base";
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
  currentUserType?: number;
}

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "outlined" | "contained";
  color?: "error";
  sx?: string | object;
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
    setKwsOpen(false);

    const setChildAsPending = () => {
      Platform.PnpService.SetParentOrGuardianAsPendingForChild(
        pendingChildId,
        playerContext?.membershipId
      )
        .then((r) => {
          if (r !== ResponseStatusEnum.Success) {
            Modal.error({
              name: ResponseStatusEnum[r],
              message: Localizer.errors.UnhandledError,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          clearParams();
          removePendingChildCookie();
          refreshPlayerContext();
        });
    };

    /* Try to refresh them in the event that emailVerified has changed since their last attempt.*/
    /* If they are not verified they must verify first */
    if (!playerContext.isEmailVerified) {
      refreshPlayerContext();
      setConfirmOpen(true);
    } else {
      /* On accept, send KWS email - then set them as "pending", remove cookie - then refresh playerContext */
      await Platform.PnpService.SendVerificationEmail(
        playerContext?.membershipId,
        pendingChildId
      )
        .then((r) => {
          if (r !== ResponseStatusEnum.Success) {
            Modal.error({
              name: ResponseStatusEnum[r],
              message: Localizer.errors.UnhandledError,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setChildAsPending();
        });
    }
  };

  const panelUserLabel =
    assignedAccount?.parentOrGuardianAssignmentStatus === 0
      ? requestsToJoin
      : assignedAccount.displayName;

  const unlinkParent = async () => {
    await Platform.PnpService.UnassignParentOrGuardianFromChild(
      assignedAccount?.membershipId
    )
      .then((r) => r)
      .catch(ConvertToPlatformError)
      .catch((e) => {
        console.log(e);
        Modal.error(e);
      })
      .finally(() => {
        refreshPlayerContext();
      });
  };

  type ButtonStateMap = {
    [K in ParentOrGuardianAssignmentStatusEnum]: ButtonProps;
  };
  const BUTTON_STATES: ButtonStateMap = {
    [ParentOrGuardianAssignmentStatusEnum.None]: {
      // Shows for Cookie child
      onClick: () => setKwsOpen(true),
      label: "Pending" as string,
      disabled: false as boolean,
      variant: "contained",
    },
    [ParentOrGuardianAssignmentStatusEnum.Pending]: {
      // Shows for pending child
      onClick: () => setKwsOpen(true),
      label: "Pending" as string,
      disabled: true as boolean,
      variant: "contained",
      sx: { pointerEvents: "none" },
    },
    [ParentOrGuardianAssignmentStatusEnum.Assigned]: {
      // Shows for assigned child
      label: ParentalControlsLoc.UnlinkLabel,
      onClick: () => unlinkParent(),
      disabled: false as boolean,
      variant: "outlined",
      color: "error",
    },
    [ParentOrGuardianAssignmentStatusEnum.Unassigned]: {
      // Shouldn't show
      label: ParentalControlsLoc.AcceptLabel as string,
      onClick: () => setKwsOpen(true),
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
        [styles.backgroundBase]:
          assignedAccount?.parentOrGuardianAssignmentStatus !==
          ParentOrGuardianAssignmentStatusEnum.Unassigned,
        [styles.backgroundAccept]:
          assignedAccount?.parentOrGuardianAssignmentStatus ===
          ParentOrGuardianAssignmentStatusEnum.Unassigned,
      })}
    >
      <div className={styles.userContainer}>
        <Avatar src={assignedAccount?.profilePicturePath} />
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
          setConfirmOpen(false);
          refreshPlayerContext();
        }}
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
