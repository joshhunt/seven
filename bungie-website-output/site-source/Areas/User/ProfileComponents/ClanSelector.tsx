// Created by atseng, 2021
// Copyright Bungie, Inc.

import { GroupsV2 } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { useEffect, useState } from "react";
import { BungieMembershipType } from "@Enum";

interface ClanSelectorProps {
  clans: GroupsV2.GroupMembership[];
  showModal: boolean;
  sendInvite: () => void;
  onClose: () => void;
}

export const ClanSelector: React.FC<ClanSelectorProps> = (props) => {
  const [modalIsOpen, toggleModalVisibility] = useState(props.showModal);

  const onClose = () => {
    toggleModalVisibility(false);
    props.onClose();
  };

  useEffect(() => {
    toggleModalVisibility(props.showModal);

    if (!props.showModal) {
      props.onClose();
    }
  }, [props.showModal]);

  if (props.clans.length === 0) {
    return null;
  }

  return (
    <Modal open={modalIsOpen} onClose={onClose}>
      <div>
        {props.clans.map((value, index) => (
          <Button key={index} buttonType={"white"} onClick={props.sendInvite}>
            {value.group.name}
          </Button>
        ))}
      </div>
    </Modal>
  );
};
