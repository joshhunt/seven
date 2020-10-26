// Created by atseng, 2020
// Copyright Bungie, Inc.

import { DestinyBuyDetailItem } from "@Areas/Destiny/Buy/Shared/DestinyBuyDetailItem";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import * as React from "react";
import styles from "./BeyondLightProducts.module.scss";
import {
  IDestinyProductFamilyDefinition,
  IDestinyProductDefinition,
} from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestroyCallback } from "@Global/DataStore";
import { Localizer } from "@Global/Localizer";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { Platform, Content } from "@Platform";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import classNames from "classnames";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { RouteHelper, IMultiSiteLink } from "@Routes/RouteHelper";
import {
  GlobalStateComponentProps,
  GlobalState,
} from "@Global/DataStore/GlobalStateDataStore";

export type beyondLightEdition =
  | "beyondlightdeluxe"
  | "beyondlightstandardseason"
  | "beyondlightstandard"
  | "beyondlightcollectors";

// Required props
interface IBeyondLightProductsProps {
  globalState: GlobalState<"responsive">;
}

// Default props - these will have values set in BeyondLightProducts.defaultProps
interface DefaultProps {}

export type BeyondLightProductsProps = IBeyondLightProductsProps & DefaultProps;

interface IBeyondLightProductsState {
  title: string;
  productFamilies: IDestinyProductFamilyDefinition[];
  skuItems: IDestinyProductDefinition[];
  skuConfig: IDestinySkuConfig;
  loading: boolean;
  editionShowing: beyondLightEdition;
  strangerEdition: IDestinyProductDefinition;
}

/**
 * BeyondLightProducts - Replace this description
 *  *
 * @param {IBeyondLightProductsProps} props
 * @returns
 */
export class BeyondLightProducts extends React.Component<
  BeyondLightProductsProps,
  IBeyondLightProductsState
> {
  private destroyConfigMonitor: DestroyCallback;
  private readonly collectorsEditionSku = "beyondlightcollectors";

  private isMedium(): boolean {
    // navigate to YouTube if the browser is in the 'medium' size or smaller
    return this.props.globalState.responsive.medium;
  }

  constructor(props: BeyondLightProductsProps) {
    super(props);

    this.state = {
      title: "",
      productFamilies: [],
      skuItems: [],
      skuConfig: DestinySkuConfigDataStore.state,
      loading: true,
      editionShowing: "beyondlightdeluxe",
      strangerEdition: null,
    };
  }

  public static defaultProps: DefaultProps = {};

  public componentDidMount() {
    Platform.ContentService.GetContentByTagAndType(
      "sku-beyondlightstranger",
      "DestinySkuItem",
      Localizer.CurrentCultureName,
      false
    ).then((data) => {
      this.setState({
        strangerEdition: DestinySkuUtils.skuDefinitionFromContent(data),
      });
    });

    this.destroyConfigMonitor = DestinySkuConfigDataStore.observe((skuConfig) =>
      this.setState(
        {
          skuConfig,
        },
        this.onSkuConfigLoaded
      )
    );
  }

  public componentWillUnmount() {
    this.destroyConfigMonitor && this.destroyConfigMonitor();
  }

  private readonly onSkuConfigLoaded = () => {
    if (this.state.skuConfig.loaded) {
      const skuSection = this.state.skuConfig.sections.find(
        (a) => a.key === "DestinySkus"
      );
      const familySection = this.state.skuConfig.sections.find(
        (a) => a.key === "DestinyProductFamilies"
      );

      // Load the Firehose content item for the specified tags
      this.loadProductFamilyContent(familySection.firehoseContentSetTag);
      this.loadSkuContent(skuSection.firehoseContentSetTag);
    }
  };

  private loadProductFamilyContent(firehoseContentSetTag: string) {
    Platform.ContentService.GetContentByTagAndType(
      firehoseContentSetTag,
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    ).then((contentSet) => {
      const allItems: Content.ContentItemPublicContract[] =
        contentSet.properties["ContentItems"];
      const productFamilies = allItems.map((contentItem) =>
        DestinySkuUtils.productFamilyDefinitionFromContent(contentItem)
      );

      if (productFamilies) {
        this.setState({
          productFamilies,
        });
      }
    });
  }

  private loadSkuContent(firehoseContentSetTag: string) {
    Platform.ContentService.GetContentByTagAndType(
      firehoseContentSetTag,
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    )
      .then((contentSet) => {
        const title = contentSet.properties["Title"];
        const allItems: Content.ContentItemPublicContract[] =
          contentSet.properties["ContentItems"];
        if (allItems) {
          const skuItems: IDestinyProductDefinition[] = allItems
            .filter((a) => a.cType === "DestinySkuItem")
            .map((contentItem) =>
              DestinySkuUtils.skuDefinitionFromContent(contentItem)
            );
          //skip the product exists check
          //.filter(skuItem => DestinySkuUtils.productExists(skuItem.skuTag, this.state.skuConfig));

          this.setState({
            title,
            skuItems,
          });
        }
      })
      .finally(() =>
        this.setState({
          loading: false,
        })
      );
  }

  private switchEdition(edition: beyondLightEdition) {
    if (this.state.editionShowing !== edition) {
      this.setState({
        editionShowing: edition,
      });
    }
  }

  public render() {
    const beyondlightLoc = Localizer.Beyondlight;

    if (this.state.productFamilies.length === 0) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }
    const { productFamilies, skuItems, strangerEdition } = this.state;

    const beyondLight = productFamilies[1];
    const beyondLightSkus = skuItems.filter((value) =>
      beyondLight.skuList.find((v) => value.skuTag === v.SkuTag)
    );

    return (
      <div className={styles.content}>
        {!this.isMedium() && (
          <div className={styles.buttons}>
            <Button
              buttonType={"white"}
              className={
                this.state.editionShowing === "beyondlightdeluxe"
                  ? styles.on
                  : ""
              }
              onClick={() => this.switchEdition("beyondlightdeluxe")}
            >
              {beyondlightLoc.Deluxe}
            </Button>
            <Button
              className={
                this.state.editionShowing === "beyondlightstandardseason"
                  ? styles.on
                  : ""
              }
              onClick={() => this.switchEdition("beyondlightstandardseason")}
            >
              {beyondlightLoc.Season}
            </Button>
            <Button
              className={
                this.state.editionShowing === "beyondlightstandard"
                  ? styles.on
                  : ""
              }
              onClick={() => this.switchEdition("beyondlightstandard")}
            >
              {beyondlightLoc.Standard}
            </Button>
          </div>
        )}
        {beyondLightSkus
          .reverse()
          .map((value, index) => this.renderEdition(value, index))}

        {this.renderCollectorsEdition(
          skuItems.find((value) => value.skuTag === this.collectorsEditionSku)
        )}

        {strangerEdition && this.renderCollectorsEdition(strangerEdition)}
      </div>
    );
  }

  private renderEdition(productDef: IDestinyProductDefinition, index: number) {
    const buyFlowRoute = RouteHelper.DestinyBuyDetail(
      { productFamilyTag: "beyondlight" },
      {
        productSku: this.isMedium()
          ? productDef.skuTag
          : this.state.editionShowing.toString(),
      }
    );

    if (productDef.skuTag === this.collectorsEditionSku) {
      return null;
    }

    return (
      <div
        className={classNames(styles.edition, {
          [styles.showing]:
            this.state.editionShowing.toString() === productDef.skuTag &&
            !this.isMedium(),
        })}
        key={index}
      >
        {this.isMedium() && (
          <EditionTitleSection
            title={productDef.title}
            subtitle={productDef.subtitle}
            edition={productDef.edition}
            buttonRoute={buyFlowRoute}
            buttonText={Localizer.Beyondlight.PreOrder}
          />
        )}
        <div className={styles.imageContainer}>
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(${this.imagePath(productDef.imagePath)})`,
            }}
          />
        </div>
        <div className={styles.textContent}>
          {!this.isMedium() && (
            <EditionTitleSection
              title={productDef.title}
              subtitle={productDef.subtitle}
              edition={productDef.edition}
              buttonRoute={buyFlowRoute}
              buttonText={Localizer.Beyondlight.PreOrder}
            />
          )}
          <div
            className={styles.blurb}
            dangerouslySetInnerHTML={{ __html: productDef.blurb }}
          />
        </div>
      </div>
    );
  }

  private renderCollectorsEdition(productDef: IDestinyProductDefinition) {
    if (productDef) {
      const buttonType =
        productDef.skuTag === this.collectorsEditionSku ? "disabled" : "blue";

      return (
        <div className={styles.collectorsEdition}>
          {this.isMedium() && (
            <h5>
              <span>
                {productDef.title}: {productDef.subtitle}
              </span>
              <span>{productDef.edition}</span>
            </h5>
          )}
          {this.isMedium() && (
            <div className={styles.imageContainer}>
              <div
                className={styles.img}
                style={{
                  backgroundImage: `url(${this.imagePath(
                    productDef.imagePath
                  )})`,
                }}
              />
            </div>
          )}
          <div className={styles.textContent}>
            {!this.isMedium() && <h5>{productDef.edition}</h5>}
            <div
              className={styles.smallBlurb}
              dangerouslySetInnerHTML={{ __html: productDef.blurb }}
            />
            <Button buttonType={buttonType} url={productDef.relatedPage}>
              {productDef.buttonLabel}
            </Button>
          </div>
          {!this.isMedium() && (
            <div className={styles.imageContainer}>
              <div
                className={styles.img}
                style={{
                  backgroundImage: `url(${this.imagePath(
                    productDef.imagePath
                  )})`,
                }}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  }

  private imagePath(path: string) {
    return path;
  }
}

interface IBeyondLightEditionTitleSection {
  title: string;
  subtitle: string;
  edition: string;
  buttonRoute: IMultiSiteLink;
  buttonText: string;
}

const EditionTitleSection = (props: IBeyondLightEditionTitleSection) => {
  const { title, subtitle, edition, buttonRoute, buttonText } = props;

  return (
    <>
      <h5>
        <span>
          {title}: {subtitle}
        </span>
        <span>{edition}</span>
      </h5>
      <Button
        url={buttonRoute}
        className={styles.buyFlowButton}
        buttonType={"blue"}
      >
        {buttonText}
      </Button>
    </>
  );
};
