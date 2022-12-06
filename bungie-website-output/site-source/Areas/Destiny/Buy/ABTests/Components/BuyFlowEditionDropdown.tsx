import React from "react";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import styles from "./BuyFlowEditionDropdown.module.scss";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import DestinySkuConfigDataStore, {
  IDestinySkuStore,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { Localizer } from "@bungie/localization";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import classNames from "classnames";
import BuyFlowRegionOptionsModal from "@Areas/Destiny/Buy/ABTests/Components/BuyFlowRegionOptionsModal";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface BuyFlowEditionListProps extends RouteComponentProps {
  placeholder: string;
  stores: IDestinySkuStore[];
  skuTag: string;
  className?: string;
  currentOptionClassName?: string;
  optionItemClassName?: string;
}

const getStoreName = (key: string): string => {
  switch (key) {
    case "StoreXbox":
      return Localizer.SkuDestinations.StoreXboxShort;
    default:
      return Localizer.SkuDestinations[key] || key;
  }
};

const BuyFlowEditionDropdown = (props: BuyFlowEditionListProps) => {
  const {
    placeholder,
    stores = [],
    skuTag,
    className,
    currentOptionClassName,
    optionItemClassName,
  } = props;

  const skuConfig = useDataStore(DestinySkuConfigDataStore);

  const storeOptions = [
    {
      label: placeholder,
      value: "",
    },
    ...stores.map(({ key, stringKey }) => ({
      label: getStoreName(stringKey),
      value: key,
    })),
  ];

  return (
    <Dropdown
      className={classNames([styles.dropdown, className])}
      isOpenClassName={styles.isOpen}
      currentOptionClassName={classNames([
        styles.currentOption,
        currentOptionClassName,
      ])}
      optionsClassName={styles.options}
      childrenClassName={styles.children}
      optionItemClassName={classNames([styles.optionItem, optionItemClassName])}
      options={storeOptions}
      onChange={(key) => {
        const store = stores.find(({ key: k }) => k === key);
        const { validRegions } = store;

        if (validRegions.length > 1) {
          BuyFlowRegionOptionsModal.show({
            store,
            skuTag,
            regions: validRegions,
          });
        } else {
          const url = DestinySkuUtils.getStoreUrlForSku(
            skuTag,
            key,
            skuConfig,
            DestinySkuUtils.REGION_GLOBAL_KEY
          );

          DestinySkuUtils.triggerConversion(
            skuTag,
            key,
            DestinySkuUtils.REGION_GLOBAL_KEY,
            props
          );

          window.location.href = url;
        }
      }}
    />
  );
};

export default withRouter(BuyFlowEditionDropdown);
