// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import styles from "./DestinySkuStoreButton.module.scss";
import { RouteHelper } from "@Routes/RouteHelper";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { DestinySkuUtils } from "./DestinySkuUtils";
import { IDestinySkuConfig } from "./DestinySkuConfigDataStore";

interface IDestinySkuStoreButtonProps extends RouteComponentProps {
  region: string;
  store: string;
  sku: string;
  config: IDestinySkuConfig;
  disabled: boolean;
}

interface IDestinySkuStoreButtonState {}

/**
 * DestinySkuStoreButton - A button to trigger the behavior of navigating to a store
 *  *
 * @param {IDestinySkuStoreButtonProps} props
 * @returns
 */
class DestinySkuStoreButton extends React.Component<
  IDestinySkuStoreButtonProps,
  IDestinySkuStoreButtonState
> {
  constructor(props: IDestinySkuStoreButtonProps) {
    super(props);

    this.state = {};
  }

  private readonly onClick = () => {
    const { region, store, sku } = this.props;

    DestinySkuUtils.triggerConversion(sku, store, region, this.props);
  };

  public render() {
    const { region, store, sku } = this.props;

    const url = RouteHelper.Sku(sku, store, region).url;

    return (
      <Button
        buttonType="gold"
        sameTab={false}
        className={styles.storeButton}
        url={url}
        legacy={true}
        disabled={this.props.disabled}
        onClick={this.onClick}
        analyticsId={`${store}|${region}|${sku}`}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default withRouter(DestinySkuStoreButton);
