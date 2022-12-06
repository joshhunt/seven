// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { InnerErrorBoundary } from "@UI/Errors/InnerErrorBoundary";
import { createCustomModal } from "@UI/UIKit/Controls/Modal/CreateCustomModal";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import {
  IDestinySkuStore,
  IDestinySkuValidRegion,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import BuyFlowRegionOptions from "@Areas/Destiny/Buy/ABTests/Components/BuyFlowRegionOptions";
import styles from "./BuyFlowRegionOptionsModal.module.scss";

interface IDestinySkuSelectorModalProps {
  skuTag: string;
  store: IDestinySkuStore;
  regions: IDestinySkuValidRegion[];
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
        <BuyFlowRegionOptions
          skuTag={this.props.skuTag}
          store={this.props.store}
          regions={this.props.regions}
        />
      </InnerErrorBoundary>
    );
  }
}

export default createCustomModal<IDestinySkuSelectorModalProps>(
  DestinySkuSelectorModal,
  {
    contentClassName: styles.modal,
  }
);
