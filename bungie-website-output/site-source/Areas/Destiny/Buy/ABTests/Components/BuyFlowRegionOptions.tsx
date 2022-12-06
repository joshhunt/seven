import { Localizer } from "@bungie/localization";
import { Dropdown } from "@UIKit/Forms/Dropdown";
import DestinySkuStoreButton from "@UI/Destiny/SkuSelector/DestinySkuStoreButton";
import React from "react";
import DestinySkuConfigDataStore, {
  IDestinySkuStore,
  IDestinySkuValidRegion,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Spinner } from "@UIKit/Controls/Spinner";
import { Platform } from "@Platform";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import styles from "./BuyFlowRegionOptions.module.scss";

interface BuyFlowRegionOptionsProps {
  skuTag: string;
  store: IDestinySkuStore;
  regions: IDestinySkuValidRegion[];
}

const BuyFlowRegionOptions = (props: BuyFlowRegionOptionsProps) => {
  const { skuTag, store, regions } = props;
  const skuConfig = useDataStore(DestinySkuConfigDataStore);
  const [definition, setDefinition] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState("");

  React.useEffect(() => {
    Platform.ContentService.GetContentByTagAndType(
      `sku-${skuTag}`,
      "DestinySkuItem",
      Localizer.CurrentCultureName,
      false
    ).then((contentItem) => {
      const skuDefinition = DestinySkuUtils.skuDefinitionFromContent(
        contentItem
      );

      setDefinition(skuDefinition);
    });
  }, [skuTag]);

  const options = [
    {
      label: Localizer.Skudestinations.SelectYourRegion,
      value: "",
    },
    ...regions.map(({ key, stringKey }) => ({
      label: Localizer.SkuDestinations[stringKey],
      value: key,
    })),
  ];

  if (!skuConfig || !definition) {
    return <Spinner />;
  }

  const productIsOnSale = DestinySkuUtils.isProductOnSale(skuTag, skuConfig);

  return (
    <div className={styles.buyModalContent}>
      <div
        className={styles.modalHeader}
        style={{ backgroundImage: `url(${definition.modalHeaderImage})` }}
      >
        <img
          className={styles.tricorn2}
          src={"7/ca/destiny/logos/tricorn_2_icon.svg"}
          alt={""}
          role={"presentation"}
        />
        <div className={styles.modalTitle}>
          <div className={styles.title}>{definition.title}</div>
          <div className={styles.subtitle}>{definition.subtitle}</div>
          <div className={styles.edition}>{definition.edition}</div>
        </div>
      </div>
      <div className={styles.storeOptions}>
        <div className={styles.regionSelect}>
          <p>{Localizer.Buyflow.chooseyourregion}</p>
          <Dropdown
            className={styles.regionDropdown}
            options={options}
            selectedValue={selectedRegion}
            onChange={setSelectedRegion}
          />
        </div>

        <DestinySkuStoreButton
          store={store.key}
          sku={skuTag}
          region={selectedRegion}
          config={skuConfig}
          disabled={selectedRegion === ""}
        >
          {definition.buttonLabel}
        </DestinySkuStoreButton>

        {productIsOnSale && (
          <div className={styles.disclaimer}>
            {`*${Localizer.skuDestinations.BuyFlowDisclaimer}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyFlowRegionOptions;
