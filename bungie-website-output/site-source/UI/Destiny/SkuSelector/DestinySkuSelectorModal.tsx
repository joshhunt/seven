// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinySkuSelectorModal.module.scss";
import DestinySkuSelector from "./DestinySkuSelector";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { createCustomModal } from "@UI/UIKit/Controls/Modal/CreateCustomModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";

interface IDestinySkuSelectorModalProps {
  skuTag: string;
  modalRef: React.RefObject<Modal>;
}

interface IDestinySkuSelectorModalState {}

/**
 * DestinySkuSelectorModal - Replace this description
 *  *
 * @param {IDestinySkuSelectorModalProps} props
 * @returns
 */
class DestinySkuSelectorModal extends React.Component<
  IDestinySkuSelectorModalProps,
  IDestinySkuSelectorModalState
> {
  constructor(props: IDestinySkuSelectorModalProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <InnerErrorBoundary>
        <DestinySkuSelector skuTag={this.props.skuTag} />
      </InnerErrorBoundary>
    );
  }
}

export default createCustomModal<IDestinySkuSelectorModalProps>(
  DestinySkuSelectorModal,
  {
    contentClassName: styles.buyModal,
  }
);
