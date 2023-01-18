import React, { useCallback, useEffect, useRef, useState } from "react";
import { BnetStackFile } from "../../../../../Generated/contentstack-types";
import styles from "./BuyFlowEditionList.module.scss";
import DestinySkuConfigDataStore, {
  IDestinySkuStore,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { Localizer } from "@bungie/localization";
import classNames from "classnames";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";
import { SiPlaystation } from "@react-icons/all-files/si/SiPlaystation";
import { FaSteam } from "@react-icons/all-files/fa/FaSteam";
import { FaXbox } from "@react-icons/all-files/fa/FaXbox";
import { FaMicrosoft } from "@react-icons/all-files/fa/FaMicrosoft";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import BuyFlowRegionOptionsModal from "@Areas/Destiny/Buy/ABTests/Components/BuyFlowRegionOptionsModal";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface BuyFlowEditionListProps extends RouteComponentProps {
  title: string;
  thumbnail?: BnetStackFile;
  border?: BnetStackFile;
  stores: IDestinySkuStore[];
  skuTag: string;
}

const Icons: Record<IDestinySkuStore["key"], React.ElementType> = {
  Playstation: SiPlaystation,
  Xbox: FaXbox,
  Steam: FaSteam,
  MicrosoftPC: FaMicrosoft,
  Epic: SiEpicgames,
};

const iconClasses: Record<IDestinySkuStore["key"], string> = {
  BungieStore: styles.bungieStore,
};

const getStoreName = (key: string): string => {
  switch (key) {
    case "StoreXbox":
      return Localizer.SkuDestinations.StoreXboxShort;
    default:
      return Localizer.SkuDestinations[key] || key;
  }
};

const BuyFlowEditionList = (props: BuyFlowEditionListProps) => {
  const { title, thumbnail, border, stores = [], skuTag } = props;
  const skuConfig = useDataStore(DestinySkuConfigDataStore);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{title}</div>

      <div className={styles.thumbnailWrap}>
        <img className={styles.border} src={border?.url} alt="" />
        <img
          className={styles.thumbnail}
          src={thumbnail?.url}
          alt={title}
          loading={"lazy"}
        />
      </div>

      <div className={styles.stores}>
        {stores.map((store) => {
          const { key, stringKey, validRegions } = store;
          const Icon = Icons[key];

          const url = DestinySkuUtils.getStoreUrlForSku(
            skuTag,
            key,
            skuConfig,
            DestinySkuUtils.REGION_GLOBAL_KEY
          );

          return (
            <li key={key}>
              {validRegions.length > 1 ? (
                <>
                  <button
                    className={styles.store}
                    onClick={() => {
                      BuyFlowRegionOptionsModal.show({
                        store,
                        skuTag,
                        regions: validRegions,
                      });
                    }}
                  >
                    {Icon ? (
                      <Icon className={styles.icon} />
                    ) : (
                      <div
                        className={classNames([styles.icon, iconClasses[key]])}
                      />
                    )}
                    {getStoreName(stringKey)}
                  </button>
                </>
              ) : (
                <a
                  href={url}
                  className={styles.store}
                  onClick={() => {
                    DestinySkuUtils.triggerConversion(
                      skuTag,
                      key,
                      DestinySkuUtils.REGION_GLOBAL_KEY,
                      props
                    );
                  }}
                >
                  {Icon ? (
                    <Icon className={styles.icon} />
                  ) : (
                    <div
                      className={classNames([styles.icon, iconClasses[key]])}
                    />
                  )}
                  {getStoreName(stringKey)}
                </a>
              )}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(BuyFlowEditionList);
