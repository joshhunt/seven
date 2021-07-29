// Created by jlauer, 2019
// Copyright Bungie, Inc.

import * as Globals from "@Enum";
import { Img } from "@Helpers";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { AuthTrigger } from "@UI/Navigation/AuthTrigger";
import * as React from "react";
import { Localizer } from "@Global/Localization/Localizer";
import { SquareButton } from "@UI/UIKit/Controls/Button/SquareButton";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Dropdown, IDropdownOption } from "@UI/UIKit/Forms/Dropdown";
import DestinySkuStoreButton from "./DestinySkuStoreButton";
import {
  IDestinySkuStore,
  IDestinySkuValidRegion,
  IDestinySkuConfig,
  IDestinySkuSale,
} from "./DestinySkuConfigDataStore";
import { DetailedError } from "@CustomErrors";
import { IDestinyProductDefinition } from "./DestinyProductDefinitions";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./DestinySkuSelectorOptions.module.scss";
import classNames from "classnames";
import { DestinySkuUtils } from "./DestinySkuUtils";
import moment from "moment/moment";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { SystemNames } from "@Global/SystemNames";
import { StringUtils } from "@Utilities/StringUtils";

// Required props
interface IDestinySkuSelectorOptionsProps extends RouteComponentProps {
  definition: IDestinyProductDefinition;
  skuConfig: IDestinySkuConfig;
  className?: string;
}

// Default props - these will have values set in DestinySkuSelectorOptions.defaultProps
interface DefaultProps {}

type Props = IDestinySkuSelectorOptionsProps & DefaultProps;

interface IDestinySkuSelectorOptionsState {
  selectedStore: IDestinySkuStore;
  selectedRegion: string;
}

/**
 * DestinySkuSelectorOptions - Replace this description
 *  *
 * @param {IDestinySkuSelectorOptionsProps} props
 * @returns
 */
class DestinySkuSelectorOptionsInternal extends React.Component<
  Props,
  IDestinySkuSelectorOptionsState
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedStore: null,
      selectedRegion: "",
    };
  }

  public static defaultProps: DefaultProps = {};

  private getRegionOptionsForStore(
    store: IDestinySkuStore
  ): IDropdownOption<IDestinySkuValidRegion>[] {
    const { definition: def, skuConfig } = this.props;

    const storeDef = skuConfig.stores.find((s) => s.key === store.key);
    if (!storeDef) {
      throw new DetailedError(
        "Store Invalid",
        `Store of name ${store.key} does not exist in configuration.`
      );
    }

    const regions = DestinySkuUtils.getRegionsForProduct(
      def.skuTag,
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
    selectedStore: IDestinySkuStore
  ) => {
    const buttonUrl = (e.currentTarget as HTMLAnchorElement).href;
    if (buttonUrl) {
      DestinySkuUtils.triggerConversion(
        this.props.definition.skuTag,
        selectedStore.key,
        DestinySkuUtils.REGION_GLOBAL_KEY,
        this.props
      );
    } else {
      this.setState({
        selectedStore,
      });
    }
  };

  private readonly getSaleDateString = (activeSale: IDestinySkuSale) => {
    const ed = moment(
      moment(activeSale.endDate).local(true),
      "YYYY-MM-DD HH:mm"
    );
    const saleDescription = Localizer.Buyflow.GenericSaleDescription;
    const endDateTime = Localizer.Format(Localizer.Time.HourMinuteAmpm, {
      hour12: ed.format("hh"),
      minute: ed.format("mm"),
      ampm: ed.format("A"),
    });
    const endDateString = Localizer.Format(Localizer.Time.CompactMonthDayYear, {
      month: ed.format("MM"),
      day: ed.format("DD"),
      year: ed.format("YYYY"),
    });
    const activeSaleString = Localizer.Format(Localizer.Buyflow.SaleEndsOn, {
      saleDescription: saleDescription,
      endDate: endDateString,
    });

    return activeSaleString;
  };

  private readonly onDropdownChanged = (value: string) => {
    this.setState({
      selectedRegion: value,
    });
  };

  public render() {
    const { definition: def, className } = this.props;

    const stores = DestinySkuUtils.getStoresForProduct(
      def.skuTag,
      this.props.skuConfig
    );

    const subtitle = Localizer.Format(Localizer.Buyflow.ChooseAPlatformToOpen, {
      productName: def.title,
    });
    const regexString = ConfigUtils.GetParameter(
      SystemNames.BuyFlow,
      "DisabledPSNSkus",
      ""
    );
    const disabledPSNSkusRegex = new RegExp(regexString, "gi");
    const isPlaystation = (store: IDestinySkuStore) =>
      store.stringKey === "StorePlaystation";
    const isDisabled = (skuTag: string) => disabledPSNSkusRegex.test(skuTag);
    const outerClasses = classNames(styles.options, className);

    const productFamilyTag = def.subtitle.replace(/\s/g, "");

    return (
      <div className={outerClasses}>
        {!this.state.selectedStore ? (
          <>
            <div className={styles.modalSubtitle}>{subtitle}</div>
            <div className={styles.modalButtons}>
              {stores.map((store) => {
                const disabled = isDisabled(def.skuTag);
                const ps = isPlaystation(store);

                if (!disabled || !ps) {
                  const url = DestinySkuUtils.tryGetGlobalRegionUrl(
                    def.skuTag,
                    store.key,
                    this.props.skuConfig
                  );

                  const activeSale =
                    DestinySkuUtils.getSaleForProductAndStore(
                      def.skuTag,
                      store.key,
                      this.props.skuConfig
                    ) || null;
                  let activeSaleEndDate = "";

                  if (activeSale) {
                    activeSaleEndDate = this.getSaleDateString(activeSale);

                    if (def.disclaimer) {
                      activeSaleEndDate += "*";
                    }
                  }

                  const storeKeyForIcon =
                    store.key === "StadiaFree"
                      ? "stadia"
                      : store.key.toLowerCase();

                  let storeKeyForTitle = store.key;
                  switch (store.key) {
                    case "StadiaFree":
                      storeKeyForTitle = "Stadia";
                      break;
                    case "BungieStore":
                      storeKeyForTitle = "Bungie Store";
                      break;
                    case "Playstation":
                      storeKeyForTitle = "PlayStation";
                      break;
                  }

                  return (
                    <div
                      key={store.key}
                      className={classNames(styles.buttonWrapper, {
                        [styles.activeSale]: activeSale,
                      })}
                    >
                      <SquareButton
                        buttonStyles={styles.platformTriggerButton}
                        url={url}
                        sameTab={false}
                        onClick={(e) => this.onStoreSelected(e, store)}
                        analyticsId={`${store}|${def.skuTag}`}
                      >
                        {activeSale && (
                          <div className={styles.saleTag}>
                            {Localizer.Sales[def.skuTag] ??
                              Localizer.Sales[productFamilyTag]}
                          </div>
                        )}

                        <img
                          className={styles.icon}
                          src={`${Img(
                            `bungie/icons/logos/${storeKeyForIcon}/${storeKeyForIcon}_icon_small.png`
                          )}`}
                          alt={store.key}
                        />
                        {storeKeyForTitle}
                      </SquareButton>

                      <div className={styles.saleInfo}>
                        <p className={styles.endDate}>
                          {activeSaleEndDate}&nbsp;
                        </p>
                      </div>
                    </div>
                  );
                }
              })}
              {isDisabled(def.skuTag) && (
                <>
                  <div className={styles.endDate}>{def.disclaimer}</div>
                  <Button disabled={true} className={styles.selectedStore}>
                    {stores.find((s) => isPlaystation(s)).key}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
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
            {this.state.selectedRegion !== "" && (
              <div>
                <DestinySkuStoreButton
                  store={this.state.selectedStore.key}
                  sku={def.skuTag}
                  region={this.state.selectedRegion}
                  config={this.props.skuConfig}
                  disabled={this.state.selectedRegion === ""}
                >
                  {def.buttonLabel}
                </DestinySkuStoreButton>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export const DestinySkuSelectorOptions = withRouter(
  DestinySkuSelectorOptionsInternal
);
