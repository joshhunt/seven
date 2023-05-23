import React, { useMemo } from "react";
import styles from "./S21PlatformsBar.module.scss";
import { PmpButton } from "@UI/Marketing/FragmentComponents/PmpButton";
import classNames from "classnames";
import { ButtonTypes } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { BnetStackFile } from "../../../../../../Generated/contentstack-types";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import DestinySkuConfigDataStore from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import BuyFlowRegionOptionsModal from "@Areas/Destiny/Buy/ABTests/Components/BuyFlowRegionOptionsModal";
import { Localizer } from "@bungie/localization";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Icon } from "@UIKit/Controls/Icon";
import { sortUsingFilterArray } from "@Helpers";
import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";

interface S20PlatformsBarProps extends RouteComponentProps {
  data?: {
    available_on?: string;
    note?: string;
    platform?: {
      string_key: string;
      label: string;
      image: BnetStackFile;
      width: number;
      height: number;
    }[];
    button?: {
      uid: string;
      label?: string;
      function: "Link" | "Store Modal" | "Buy Page";
      url?: string;
      skuTag?: string;
      productFamilyTag?: string;
      button_type?: ButtonTypes;
      size?: keyof typeof BasicSize;
    }[];
  };
}

const S20PlatformsBar: React.FC<S20PlatformsBarProps> = ({
  data,
  ...props
}) => {
  const { available_on, platform: platforms = [], note } = data ?? {};

  const skuConfig = useDataStore(DestinySkuConfigDataStore);
  const storesForProduct = DestinySkuUtils.getStoresForProduct(
    "silverbundle",
    skuConfig
  );
  // Sort stores into specific order
  const stores = sortUsingFilterArray(storesForProduct, [
    ({ key }) => key === "Playstation",
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>{available_on}</div>
        <DestinyArrows
          classes={{
            root: styles.arrows,
            base: styles.arrowsBase,
            animatedArrow: styles.animatedArrow,
          }}
        />
      </div>

      <ul className={styles.platforms}>
        {stores.map((store) => {
          const { key, stringKey, validRegions } = store;

          const url = DestinySkuUtils.getStoreUrlForSku(
            "silverbundle",
            key,
            skuConfig,
            DestinySkuUtils.REGION_GLOBAL_KEY
          );
          const platform = platforms.find(
            ({ string_key: platformStringKey }) =>
              platformStringKey === stringKey
          );

          const { image, width = 60, height = 45, label } = platform ?? {};

          if (!image) {
            return null;
          }

          return (
            <li key={key}>
              {validRegions.length > 1 ? (
                <>
                  <button
                    className={styles.store}
                    onClick={() => {
                      BuyFlowRegionOptionsModal.show({
                        store,
                        skuTag: "silverbundle",
                        regions: validRegions,
                      });
                    }}
                  >
                    <span className={styles.storeIcon}>
                      <img
                        className={styles.storeImage}
                        src={image.url}
                        width={width}
                        height={height}
                        alt=""
                      />
                    </span>
                    <span>{label}</span>
                  </button>
                </>
              ) : (
                <a
                  href={url}
                  className={styles.store}
                  onClick={() => {
                    DestinySkuUtils.triggerConversion(
                      "silverbundle",
                      key,
                      DestinySkuUtils.REGION_GLOBAL_KEY,
                      props
                    );
                  }}
                >
                  <span className={styles.storeIcon}>
                    <img
                      className={styles.storeImage}
                      src={image.url}
                      width={width}
                      height={height}
                      alt=""
                    />
                  </span>
                  <span>{label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>{note}</p>
    </div>
  );
};

export default withRouter(S20PlatformsBar);
