// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinySkuSelector.module.scss";
import { IDestinyProductDefinition } from "./DestinyProductDefinitions";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "./DestinySkuConfigDataStore";
import { Localizer } from "@Global/Localizer";
import { DestinySkuSelectorOptions } from "./DestinySkuSelectorOptions";
import { DestroyCallback } from "@Global/DataStore";
import { Platform } from "@Platform";
import { DestinySkuUtils } from "./DestinySkuUtils";
import { Spinner } from "@UI/UIKit/Controls/Spinner";

interface IDestinySkuSelectorProps {
  skuTag: string;
}

interface IDestinySkuSelectorState {
  skuConfig: IDestinySkuConfig;
  definition: IDestinyProductDefinition;
}

/**
 * DestinySkuSelector - Replace this description
 *  *
 * @param {IDestinySkuSelectorProps} props
 * @returns
 */
export default class DestinySkuSelector extends React.Component<
  IDestinySkuSelectorProps,
  IDestinySkuSelectorState
> {
  private destroyConfigMonitor: DestroyCallback;

  constructor(props: IDestinySkuSelectorProps) {
    super(props);

    this.state = {
      skuConfig: null,
      definition: null,
    };
  }

  public componentDidMount() {
    this.loadSkuConfig();
    this.loadSkuContent();
  }

  private loadSkuConfig() {
    this.destroyConfigMonitor = DestinySkuConfigDataStore.observe((skuConfig) =>
      this.setState({
        skuConfig,
      })
    );
  }

  private loadSkuContent() {
    const skuTag = this.props.skuTag;

    Platform.ContentService.GetContentByTagAndType(
      `sku-${skuTag}`,
      "DestinySkuItem",
      Localizer.CurrentCultureName,
      false
    ).then((contentItem) => {
      const definition = DestinySkuUtils.skuDefinitionFromContent(contentItem);

      this.setState({
        definition,
      });
    });
  }

  public render() {
    const { skuConfig, definition: def } = this.state;

    if (!skuConfig || !def) {
      return <Spinner />;
    }

    const productIsOnSale = DestinySkuUtils.isProductOnSale(
      this.props.skuTag,
      skuConfig
    );
    const showDisclaimer =
      def.disclaimer !== null && def.disclaimer !== "" && productIsOnSale;

    return (
      <div className={styles.buyModalContent}>
        <div
          className={styles.modalHeader}
          style={{ backgroundImage: `url(${def.modalHeaderImage})` }}
        >
          <img
            className={styles.tricorn2}
            src={"7/ca/destiny/logos/tricorn_2_icon.svg"}
          />
          <div className={styles.modalTitle}>
            <div className={styles.title}>{def.title}</div>
            <div className={styles.subtitle}>{def.subtitle}</div>
            <div className={styles.edition}>{def.edition}</div>
          </div>
        </div>
        <div className={styles.storeOptions}>
          <DestinySkuSelectorOptions
            definition={def}
            skuConfig={skuConfig}
            className={styles.selectorOptions}
          />
          {showDisclaimer && (
            <div className={styles.disclaimer}>{`*${def.disclaimer}`}</div>
          )}
        </div>
      </div>
    );
  }
}
