// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "./DestinyCollectibleDetailItemModal.module.scss";
import { BungieMembershipType } from "@Enum";
import {
  createCustomModal,
  CustomModalProps,
} from "@UIKit/Controls/Modal/CreateCustomModal";
import { SpinnerContainer } from "@UIKit/Controls/Spinner";
import React from "react";
import DestinyCollectibleDetailItemContent from "./DestinyCollectibleDetailItemContent";

interface DestinyCollectibleDetailModalProps extends CustomModalProps {
  itemHash: number;
  membershipId?: string;
  membershipType?: BungieMembershipType;
}

interface DestinyCollectibleDetailModalState {
  loading: boolean;
}

class DestinyCollectibleDetailModal extends React.Component<
  DestinyCollectibleDetailModalProps,
  DestinyCollectibleDetailModalState
> {
  constructor(props: DestinyCollectibleDetailModalProps) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  public componentDidMount() {
    this.setState({ loading: false });
  }

  public render() {
    return (
      <SpinnerContainer loading={this.state.loading}>
        <DestinyCollectibleDetailItemContent
          itemHash={this.props.itemHash}
          membershipId={this.props.membershipId}
          membershipType={this.props.membershipType}
        />
      </SpinnerContainer>
    );
  }
}

export default createCustomModal<DestinyCollectibleDetailModalProps>(
  DestinyCollectibleDetailModal,
  {
    className: styles.collectibleDetailModal,
    contentClassName: styles.detailModal,
  },
  (props) => {
    return true;
  }
);
