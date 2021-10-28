// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { ActionSuccessModal } from "@Areas/User/AccountComponents/Internal/ActionSuccessModal";
import styles from "@Areas/User/Profile.module.scss";
import { BlockAndReportModal } from "@Areas/User/ProfileComponents/BlockAndReportModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { PlatformError } from "@CustomErrors";
import { IgnoredItemType, ModeratorRequestedPunishment } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Contracts, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { IBungieName } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { ReactElement, useEffect, useState } from "react";

interface BlockButtonProps {
  bungieGlobalNameObject: IBungieName;
  membershipId: string;
}

export const BlockButton: React.FC<BlockButtonProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const profileLoc = Localizer.Profile;
  const [isBlocked, setIsBlocked] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const getBlockedStatus = () => {
    Platform.IgnoreService.ManageIgnoresForUser(
      globalState.loggedInUser.user.membershipId
    )
      .then((result) => {
        if (result.find((user) => user.membershipId === props.membershipId)) {
          setIsBlocked(true);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  useEffect(() => {
    if (
      globalState.loggedInUser?.user &&
      globalState.loggedInUser?.user?.membershipId !== props.membershipId
    ) {
      getBlockedStatus();
    }
  }, [globalState, props.membershipId]);

  if (
    !globalState.loggedInUser ||
    globalState.loggedInUser?.user?.membershipId === props.membershipId
  ) {
    return null;
  }

  return (
    <>
      <Button
        buttonType={isBlocked ? "disabled" : "white"}
        className={classNames(styles.button, styles.btnBlock)}
        onClick={() => setOpenModal(true)}
      >
        {isBlocked ? profileLoc.Blocked : profileLoc.Block}
      </Button>
      <BlockAndReportModal
        membershipId={props.membershipId}
        bungieGlobalNameObject={props.bungieGlobalNameObject}
        openModal={openModal}
        onSuccess={() => {
          setIsBlocked(true);
          setOpenModal(false);
        }}
        onClose={() => setOpenModal(false)}
        onError={null}
      />
    </>
  );
};
