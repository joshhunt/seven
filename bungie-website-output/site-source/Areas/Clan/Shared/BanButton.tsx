// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { CodesDataStore } from "@Areas/Codes/CodesDataStore";
import { CodesPlatformSelector } from "@Areas/Codes/History/CodesPlatformSelector";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, IgnoreLength, OfferRedeemMode } from "@Enum";
import { GroupsV2, Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";

interface BanButtonProps {
  clanId: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  refreshList: () => void;
}

export const BanButton: React.FC<BanButtonProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const banUser = () => {
    Platform.GroupV2Service.BanMember(
      { comment: "", length: IgnoreLength.Forever },
      props.clanId,
      props.membershipType,
      props.membershipId
    )
      .then(() => {
        props.refreshList();
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => Modal.error(e));
  };

  const showBanModalConfirm = () => {
    ConfirmationModal.show({
      type: "none",
      children: clansLoc.areyousure,
      confirmButtonProps: {
        onClick: () => {
          banUser();

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
      onClick={() => showBanModalConfirm()}
    >
      {clansLoc.Ban}
    </Button>
  );
};
