import React, { useMemo } from "react";
import styles from "./S20PlatformsBar.module.scss";
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

interface S20PlatformsBarProps extends RouteComponentProps {
  data?: {
    available_on?: string;
    platform?: {
      string_key: string;
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
  const { available_on, platform: platforms = [], button = [] } = data ?? {};
  const [menuOpen, setMenuOpen] = React.useState(false);

  const skuConfig = useDataStore(DestinySkuConfigDataStore);
  const storesForProduct = DestinySkuUtils.getStoresForProduct(
    "silverbundle",
    skuConfig
  );
  // Sort stores into specific order
  const stores = sortUsingFilterArray(storesForProduct, [
    ({ key }) => key === "Playstation",
  ]);

  const icon = menuOpen ? "keyboard_arrow_up" : "keyboard_arrow_down";

  return (
    <div className={classNames([styles.root, menuOpen && styles.menuOpen])}>
      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        <Icon iconType={"material"} iconName={icon} />
      </div>

      <div className={styles.platforms}>
        <div className={styles.title}>{available_on}</div>

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

          const { image, width, height } = platform ?? {};

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
                      setMenuOpen(false);
                      BuyFlowRegionOptionsModal.show({
                        store,
                        skuTag: "silverbundle",
                        regions: validRegions,
                      });
                    }}
                  >
                    {image ? (
                      <img
                        className={styles.storeImage}
                        src={image.url}
                        width={width}
                        height={height}
                        alt=""
                      />
                    ) : null}
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
                  {image ? (
                    <img
                      className={styles.storeImage}
                      src={image.url}
                      width={width}
                      height={height}
                      alt=""
                    />
                  ) : null}
                </a>
              )}
            </li>
          );
        })}
      </div>

      {button.map(({ uid, button_type, size, ...buttonProps }) => {
        return (
          <PmpButton
            key={uid}
            className={styles.button}
            button_type={button_type ?? "gold"}
            size={size ?? "Small"}
            {...buttonProps}
          >
            {buttonProps.label}
          </PmpButton>
        );
      })}
    </div>
  );
};

export default withRouter(S20PlatformsBar);
