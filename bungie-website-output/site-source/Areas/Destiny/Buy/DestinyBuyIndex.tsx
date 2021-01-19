// Created by larobinson, 2020
// Copyright Bungie, Inc.

import { DestroyCallback } from "@Global/Broadcaster/Broadcaster";
import { Localizer } from "@Global/Localizer";
import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { IDestinyProductDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import * as React from "react";
import { IDestinyProductFamilyDefinition } from "../../../UI/Destiny/SkuSelector/DestinyProductDefinitions";
import styles from "./DestinyBuyIndex.module.scss";
import { DestinyBuyCoverCard } from "./Shared/DestinyBuyCoverCard";

interface IDestinyBuyIndexProps {}

interface IDestinyBuyIndexState {
  title: string;
  productFamilies: IDestinyProductFamilyDefinition[];
  skuItems: IDestinyProductDefinition[];
  skuConfig: IDestinySkuConfig;
  loading: boolean;
  carouselItem: IMarketingMediaAsset;
}

/**
 * The Destiny Buy flow page
 *  *
 * @param {IDestinyBuyIndexProps} props
 * @returns
 */
export default class DestinyBuyInternal extends React.Component<
  IDestinyBuyIndexProps,
  IDestinyBuyIndexState
> {
  private destroyConfigMonitor: DestroyCallback;

  constructor(props: IDestinyBuyIndexProps) {
    super(props);

    this.state = {
      title: "",
      productFamilies: [],
      skuItems: [],
      skuConfig: DestinySkuConfigDataStore.state,
      loading: true,
      carouselItem: null,
    };
  }

  public componentDidMount() {
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
      this.carouselContent();
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
            )
            .filter((skuItem) =>
              DestinySkuUtils.productExists(
                skuItem.skuTag,
                this.state.skuConfig
              )
            );

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

  private carouselContent() {
    Platform.ContentService.GetContentByTagAndType(
      "buyflowlandingheader",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    ).then((data) => {
      if (data) {
        this.setState({
          carouselItem: ContentUtils.marketingMediaAssetFromContent(data),
        });
      }
    });
  }

  public render() {
    if (this.state.productFamilies.length === 0) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }
    const { productFamilies, skuConfig, carouselItem, skuItems } = this.state;

    const GetStartedItem1ProductFamily = ConfigUtils.GetParameter(
      "BuyFlowGetStartedContent",
      "Item1",
      ""
    );
    const GetStartedItem2ProductFamily = ConfigUtils.GetParameter(
      "BuyFlowGetStartedContent",
      "Item2",
      ""
    );

    const item1 = productFamilies?.find(
      (v) => v.productFamilyTag === GetStartedItem1ProductFamily
    );
    const item2 = productFamilies?.find(
      (v) => v.productFamilyTag === GetStartedItem2ProductFamily
    );

    const otherProducts = productFamilies?.filter(
      (product) =>
        product.productFamilyTag !== GetStartedItem1ProductFamily &&
        product.productFamilyTag !== GetStartedItem2ProductFamily
    );
    const metaImage = productFamilies.length > 0 ? item1?.imagePath : null;

    return (
      <SystemDisabledHandler systems={["BuyFlow"]}>
        <BungieHelmet image={metaImage} title={this.state.title}>
          <body
            className={SpecialBodyClasses(
              BodyClasses.HideServiceAlert | BodyClasses.NoSpacer
            )}
          />
        </BungieHelmet>

        {carouselItem ? (
          <div
            className={styles.carousel}
            style={{ backgroundImage: `url(${carouselItem.largeImage})` }}
          >
            <div className={classNames(styles.contentFrame, styles.contents)}>
              <div className={styles.carouselTitle}>{carouselItem.title}</div>
              <div
                className={styles.carouselBlurb}
                dangerouslySetInnerHTML={{ __html: carouselItem.textBlock }}
              />
              <Button
                buttonType={"gold"}
                size={BasicSize.Small}
                url={carouselItem.buttonLink}
                className={styles.button}
                analyticsId={`carousel-pre-order-500`}
              >
                {carouselItem.buttonLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.spacer} />
        )}

        <Grid
          className={styles.contentFrame}
          noPadding={true}
          strictMode={true}
        >
          <div className={styles.borderTop}>
            <div className={styles.sectionTitle}>
              {Localizer.Buyflow.GetStarted}
            </div>
          </div>

          <div className={styles.banner}>
            {item1 && (
              <Anchor
                className={classNames(styles.bannerItem, {
                  [styles.twoItems]: item1 && item2,
                })}
                style={{
                  backgroundImage: `url(${item1.imagePath})`,
                }}
                url={RouteHelper.DestinyBuyDetail({
                  productFamilyTag: item1.productFamilyTag,
                })}
              >
                <div className={styles.floatOverGradient}>
                  <ProductFamilyTitles
                    subtitle={item1.smallCoverTitle}
                    title={item1.coverTitle}
                  />
                </div>
              </Anchor>
            )}
            {item2 && (
              <Anchor
                className={classNames(styles.bannerItem, {
                  [styles.twoItems]: item1 && item2,
                })}
                style={{
                  backgroundImage: `url(${item2.imagePath})`,
                }}
                url={RouteHelper.DestinyBuyDetail({
                  productFamilyTag: item2.productFamilyTag,
                })}
              >
                <div className={styles.floatOverGradient}>
                  <ProductFamilyTitles
                    subtitle={item2.smallCoverTitle}
                    title={item2.coverTitle}
                  />
                </div>
              </Anchor>
            )}
          </div>

          <div className={styles.borderTop}>
            <div className={styles.sectionTitle}>
              {Localizer.Buyflow.Expansions}
            </div>
          </div>

          <div className={styles.coverCards}>
            {otherProducts.map((productFamily, i) => {
              const productIsOnSale =
                skuConfig &&
                productFamily?.skuList.some((st) =>
                  DestinySkuUtils.isProductOnSale(st.SkuTag, skuConfig)
                );
              const saleInformation =
                Localizer.Sales[productFamily.productFamilyTag];

              return (
                <GridCol cols={3} mobile={6} key={i}>
                  <DestinyBuyCoverCard productFamily={productFamily}>
                    <ProductFamilyTitles
                      onSale={productIsOnSale}
                      subtitle={productFamily.smallCoverTitle}
                      title={productFamily.coverTitle}
                      saleDetails={saleInformation}
                    />
                  </DestinyBuyCoverCard>
                </GridCol>
              );
            })}
          </div>
        </Grid>
      </SystemDisabledHandler>
    );
  }
}

interface IProductFamilyTitlesProps {
  title: string;
  subtitle: string;
  saleDetails?: string;
  onSale?: boolean;
}

const ProductFamilyTitles = (props: IProductFamilyTitlesProps) => {
  const { title, subtitle, saleDetails, onSale } = props;

  return (
    <div className={styles.titles}>
      {onSale && !StringUtils.isNullOrWhiteSpace(saleDetails) && (
        <p className={styles.discountString}>{saleDetails}</p>
      )}
      <div className={styles.subtitle}>{subtitle}</div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};
