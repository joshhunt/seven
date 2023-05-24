// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";

interface KickButtonProps {
  clanId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  refreshList: () => void;
}

export const KickButton: React.FC<KickButtonProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const kickMember = () => {
    Platform.GroupV2Service.KickMember(
      props.clanId,
      props.membershipType,
      props.membershipId
    )
      .then(() => {
        //refresh the memberslist
        props.refreshList();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  const showKickModalConfirm = () => {
    ConfirmationModal.show({
      type: "none",
      children: clansLoc.areyousure,
      confirmButtonProps: {
        onClick: () => {
          kickMember();

          return true;
        },
        labelOverride: null,
      },
    });
  };

  return (
    <Button
      buttonType={"clear"}
      size={BasicSize.Small}
      onClick={() => showKickModalConfirm()}
    >
      {clansLoc.Kick}
    </Button>
  );
};
