import React, { FC, useState } from "react";
import { Localizer } from "@bungie/localization";
import { Button, Avatar } from "plxp-web-ui/components/base";
import classNames from "classnames";
import styles from "./UserPanel.module.scss";
import KwsAcceptModal from "../../../KwsModals/KwsAcceptModal";
import KwsConfirmModal from "../../../KwsModals/KwsConfirmModal";
import { ParentalControls, Platform } from "@Platform";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UIKit/Controls/Modal/Modal";

interface UserPanelProps {
  asContainer?: boolean;
  assignedAccount?: any;
  currentUserType?: any;
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

const UserPanel: FC<UserPanelProps> = ({
  assignedAccount,
  currentUserType,
  asContainer,
}) => {
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
  const url = new URL(window.location.href);
  const requestingChildId = url.searchParams.get("playerId");
  const adultWithUnacceptedInvite =
    requestingChildId?.length > 0 && currentUserType === 3;
  const [openKws, setKwsOpen] = useState(false);
  const [hasAcceptedRequest, setHasAcceptedRequest] = useState(false);
  const [openConfirm, setConfirmOpen] = useState(false);

  /* Controls what happens when a user clicks "Accept" in the KWS Acceptance Modal*/
  const onKWSAccept = () => {
    /*		Platform.UserService.LinkParentalControlGuardian(requestingChildId)
			.then(r => {
				setHasAcceptedRequest(true);
				return r;
			})
			.catch(ConvertToPlatformError)
			.catch(e => {
				console.log(e);
				Modal.error(e);
			});*/
    setKwsOpen(false);
    /*
     * Once API call is complete:
     * show confirm modal if the parent is NOT already verified
     * Send an email regarding KWS
     * */
    if (!assignedAccount.isEmailVerified) {
      setConfirmOpen(true);
    }
  };

  const panelUserLabel = adultWithUnacceptedInvite
    ? requestsToJoin
    : assignedAccount.displayName;

  /* Update button states to use enums */
  const keys = [0, 1, 2, 3] as const;
  type Key = typeof keys[number];

  const BUTTON_STATES: Record<Key, ButtonProps> = {
    /* None = 0 */
    0: {
      label: ParentalControlsLoc.AcceptLabel,
      onClick: () => setKwsOpen(true),
      disabled: false,
      variant: "outlined",
    },
    /* Pending = 1 */
    1: {
      label: "Pending",
      disabled: true,
      variant: "outlined",
      sx: { pointerEvents: "none" },
    },
    /* Assigned = 2 */
    2: {
      label: ParentalControlsLoc.UnlinkLabel,
      onClick: () => {
        Platform.UserService.UnlinkParentalControlGuardian()
          .then((r) => r)
          .catch(ConvertToPlatformError)
          .catch((e) => {
            console.log(e);
            Modal.error(e);
          });
      },
      disabled: false,
      variant: "outlined",
      color: "error",
    },
    /* Unassigned = 3 */
    3: {
      label: ParentalControlsLoc.AcceptLabel,
      onClick: () => setKwsOpen(true),
      disabled: false,
      variant: "contained",
    },
  };

  return asContainer ? (
    <div
      className={classNames(styles.container, {
        [styles.backgroundBase]: !adultWithUnacceptedInvite,
        [styles.backgroundAccept]: adultWithUnacceptedInvite,
      })}
    >
      <div className={styles.userContainer}>
        <Avatar />
        <p lang={currentLang} className={styles.userLabel}>
          {panelUserLabel}
        </p>
      </div>
      <Button
        // @ts-ignore
        {...BUTTON_STATES[assignedAccount.parentOrGuardianAssignmentStatus]}
      >
        {
          // @ts-ignore
          BUTTON_STATES[assignedAccount.parentOrGuardianAssignmentStatus]?.label
        }
      </Button>
      <KwsAcceptModal
        open={openKws}
        onAccept={() => onKWSAccept()}
        onDecline={() => setKwsOpen(false)}
      />
      <KwsConfirmModal
        open={openConfirm}
        onAccept={() => {
          setConfirmOpen(false);
        }}
      />
    </div>
  ) : (
    <div className={styles.userContainer}>
      <Avatar />
      <p className={styles.userLabel}>{assignedAccount.displayName}</p>
    </div>
  );
};

export default UserPanel;
