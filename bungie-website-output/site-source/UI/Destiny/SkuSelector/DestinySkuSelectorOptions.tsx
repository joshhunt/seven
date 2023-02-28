// Created by jlauer, 2019
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { DetailedError } from "@CustomErrors";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import classNames from "classnames";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IDestinyProductDefinition } from "./DestinyProductDefinitions";
import {
  IDestinySkuConfig,
  IDestinySkuStore,
  IDestinySkuValidRegion,
} from "./DestinySkuConfigDataStore";
import styles from "./DestinySkuSelectorOptions.module.scss";
import DestinySkuStoreButton from "./DestinySkuStoreButton";
import { DestinySkuUtils } from "./DestinySkuUtils";
import { StoreButtonsForSku } from "./StoreButtonsForSku";
import { sortUsingFilterArray } from "@Helpers";

// Required props
interface IDestinySkuSelectorOptionsProps extends RouteComponentProps {
  definition: IDestinyProductDefinition;
  skuConfig: IDestinySkuConfig;
  utmParams?: string;
  className?: string;
}

interface IDestinySkuSelectorOptionsState {
  selectedStore: IDestinySkuStore;
  selectedRegion: string | null;
}

/**
 * DestinySkuSelectorOptions - Replace this description
 *  *
 * @param {IDestinySkuSelectorOptionsProps} props
 * @returns
 */
class DestinySkuSelectorOptionsInternal extends React.Component<
  IDestinySkuSelectorOptionsProps,
  IDestinySkuSelectorOptionsState
> {
  constructor(props: IDestinySkuSelectorOptionsProps) {
    super(props);

    this.state = {
      selectedStore: null,
      selectedRegion: null,
    };
  }

  public render() {
    const { definition, className, utmParams } = this.props;

    const storesForProduct = DestinySkuUtils.getStoresForProduct(
      definition.skuTag,
      this.props.skuConfig
    );
    // Sort stores into specific order
    const stores = sortUsingFilterArray(storesForProduct, [
      ({ key }) => key === "Playstation",
    ]);

    const subtitle = Localizer.Format(Localizer.Buyflow.ChooseAPlatformToOpen, {
      productName: definition.title,
    });
    const outerClasses = classNames(styles.options, className);
    const productFamilyTag = definition.subtitle.replace(/\s/g, "");
    const selectedStoreHasSingleRegion =
      (this.state.selectedStore?.validRegions?.length ?? 0) <= 1;

    return (
      <div className={outerClasses}>
        {(!this.state.selectedStore || selectedStoreHasSingleRegion) && (
          <StoreButtonsForSku
            subtitle={subtitle}
            stores={stores}
            skuDefinition={definition}
            productFamily={productFamilyTag}
            skuConfig={this.props.skuConfig}
            onStoreSelected={this.onStoreSelected}
            utmParams={utmParams}
          />
        )}
        {this.state.selectedStore && !selectedStoreHasSingleRegion && (
          <>
            <Button disabled={true} className={styles.selectedStore}>
              {this.state.selectedStore.key}
            </Button>
            <span
              className={styles.changeStore}
              onClick={() => {
                this.setState({ selectedStore: null });
              }}
              role={"button"}
            >
              {Localizer.Buyflow.change}
            </span>
            <div className={styles.regionSelect}>
              <p>{Localizer.Buyflow.chooseyourregion}</p>
              <Dropdown
                className={styles.regionDropdown}
                options={this.getRegionOptionsForStore(
                  this.state.selectedStore
                )}
                onChange={this.onDropdownChanged}
              />
            </div>
            {this.state.selectedRegion && (
              <DestinySkuStoreButton
                store={this.state.selectedStore.key}
                sku={definition.skuTag}
                region={this.state.selectedRegion}
                config={this.props.skuConfig}
                disabled={this.state.selectedRegion === ""}
              >
                {definition.buttonLabel}
              </DestinySkuStoreButton>
            )}
          </>
        )}
      </div>
    );
  }

  private getRegionOptionsForStore(
    store: IDestinySkuStore
  ): IDropdownOption<IDestinySkuValidRegion>[] {
    const { definition, skuConfig } = this.props;

    const storeDef = skuConfig.stores.find((s) => s.key === store.key);
    if (!storeDef) {
      throw new DetailedError(
        "Store Invalid",
        `Store of name ${store.key} does not exist in configuration.`
      );
    }

    const regions = DestinySkuUtils.getRegionsForProduct(
      definition.skuTag,
      store.key,
      skuConfig
    );

    const options = regions.map((r) => {
      const validRegion = storeDef.validRegions.find((a) => a.key === r.key);
      if (!storeDef) {
        throw new DetailedError(
          "Region Invalid",
          `Region of name ${r.key} does not exist in configuration.`
        );
      }

      return {
        label: Localizer.SkuDestinations[validRegion.stringKey],
        value: r.key,
        metadata: validRegion,
      } as IDropdownOption<IDestinySkuValidRegion>;
    });

    options.unshift({
      label: Localizer.Skudestinations.SelectYourRegion,
      value: "",
      metadata: null,
    });

    return options;
  }

  private readonly onStoreSelected = (
    e: React.MouseEvent<HTMLElement>,
    selectedStore: IDestinySkuStore,
    isPlaystation: boolean
  ) => {
    if (!selectedStore) {
      DestinySkuUtils.triggerConversion(
        this.props.definition.skuTag,
        selectedStore.key,
        DestinySkuUtils.REGION_GLOBAL_KEY,
        this.props
      );
      this.setState({
        selectedRegion: null,
      });
    } else {
      this.setState({
        selectedStore,
      });
    }
  };

  private readonly onDropdownChanged = (value: string) => {
    this.setState({
      selectedRegion: value,
    });
  };
}

export const DestinySkuSelectorOptions = withRouter(
  DestinySkuSelectorOptionsInternal
);
