// Created by larobinson, 2020
// Copyright Bungie, Inc.

import React from "react";
import DestinyBuyCarouselHero from "@Areas/Destiny/Buy/Shared/DestinyBuyCarouselHero";
import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { Localizer } from "@bungie/localization";
import { IResponsiveState } from "@bungie/responsive/Responsive";
import { Content, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import {
  IDestinyProductDefinition,
  IDestinyProductFamilyDefinition,
} from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
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
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import { DestinyBuyCoverCard } from "./Shared/DestinyBuyCoverCard";
import { BorderedTitle } from "./Components";

import styles from "./DestinyBuyIndex.module.scss";

interface IDestinyBuyIndexProps {}

interface IDestinyBuyIndexState {
  title: string;
  productFamilies: IDestinyProductFamilyDefinition[];
  skuItems: IDestinyProductDefinition[];
  skuConfig: IDestinySkuConfig;
  loading: boolean;
  carouselItems: IMarketingMediaAsset[];
  isCarouselPaused: boolean;
  freeToPlayPopoutImg: string;
  responsive: IResponsiveState;
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
  private readonly destroys: DestroyCallback[] = [];

  constructor(props: IDestinyBuyIndexProps) {
    super(props);

    this.state = {
      title: "",
      productFamilies: [],
      skuItems: [],
      skuConfig: DestinySkuConfigDataStore.state,
      loading: true,
      carouselItems: null,
      isCarouselPaused: false,
      freeToPlayPopoutImg: "",
      responsive: Responsive.state,
    };
  }

  public componentDidMount() {
    this.destroys.push(
      DestinySkuConfigDataStore.observe((skuConfig) =>
        this.setState({ skuConfig }, this.onSkuConfigLoaded)
      ),
      Responsive.observe((responsive) => this.setState({ responsive }))
    );
  }

  public componentWillUnmount() {
    this.destroys.forEach((d) => d && d());
  }

  public render() {
    if (this.state.productFamilies.length === 0) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }
    const { productFamilies, skuConfig, carouselItems } = this.state;

    const getStartedCategoryName = "category1";
    const expansionsCategoryName = "category2";
    const bundlesCategoryName = "category3";

    const getStartedProducts = productFamilies?.filter(
      (product: any) => product.landingPageCategory === getStartedCategoryName
    );
    const expansionProducts = productFamilies?.filter(
      (product: any) => product.landingPageCategory === expansionsCategoryName
    );
    const bundleProducts = productFamilies?.filter(
      (product: any) => product.landingPageCategory === bundlesCategoryName
    );

    //url is ?version=Promo
    const params = new URLSearchParams(location.search);
    const promoView = params.get("version");
    const isBannerTest = promoView === "banner";

    if (promoView === "Promo") {
      return (
        <Grid
          className={styles.contentFrame}
          noPadding={true}
          strictMode={true}
        >
          <PaidContent
            expansionProducts={expansionProducts}
            bundleProducts={bundleProducts}
            skuConfig={skuConfig}
          />
        </Grid>
      );
    }

    const metaImage = "/7/ca/destiny/bgs/season14/buy_landing_cover_f2p.jpg";

    return (
      <SystemDisabledHandler systems={["BuyFlow"]}>
        <BungieHelmet image={metaImage} title={this.state.title}>
          <body
            className={classNames(
              SpecialBodyClasses(
                BodyClasses.HideServiceAlert | BodyClasses.NoSpacer
              ),
              styles.buyIndex
            )}
          />
        </BungieHelmet>

        {carouselItems ? (
          <DestinyBuyCarouselHero
            isPaused={this.state.isCarouselPaused}
            setIsPaused={this.setIsCarouselPaused}
          >
            {carouselItems?.map((slide: any, i: number) => {
              const bgImage = this.state.responsive.mobile
                ? slide.imageThumbnail
                : slide.largeImage;

              return (
                <div
                  key={i}
                  className={styles.slide}
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div
                    className={classNames(styles.contentFrame, styles.contents)}
                  >
                    <div className={styles.titleDivider} />
                    <div className={styles.carouselTitle}>{slide?.title}</div>
                    <div
                      className={styles.carouselBlurb}
                      dangerouslySetInnerHTML={sanitizeHTML(slide?.textBlock)}
                    />
                    <Button
                      buttonType={"gold"}
                      size={BasicSize.Small}
                      url={slide?.buttonLink}
                      className={styles.button}
                      analyticsId={`carousel-pre-order-500`}
                      onMouseEnter={() => this.setIsCarouselPaused(true)}
                    >
                      {slide?.buttonLabel}
                    </Button>
                  </div>
                </div>
              );
            })}
          </DestinyBuyCarouselHero>
        ) : (
          <div className={styles.spacer} />
        )}
        <div
          className={classNames(styles.container, {
            [styles.spacingBottom]: isBannerTest,
          })}
        >
          <Grid
            className={classNames(styles.contentFrame, {
              [styles.orderOne]: !isBannerTest,
              [styles.orderTwo]: isBannerTest,
            })}
            noPadding={true}
            strictMode={true}
          >
            <BorderedTitle
              sectionTitle={Localizer.Buyflow.GetStarted}
              classes={{ wrapper: styles.borderSpacing }}
            />

            <div className={styles.banner}>
              {getStartedProducts.map((productFamily: any, i: number) => {
                const isFreeToPlayItem =
                  productFamily.productFamilyTag === "playforfree";
                const bgImage =
                  this.state.responsive.mobile && productFamily.mobileCoverImage
                    ? productFamily.mobileCoverImage
                    : productFamily.imagePath;
                const coverTitle =
                  productFamily.coverTitleHtml || productFamily.coverTitle;

                return (
                  <Anchor
                    className={classNames(
                      classNames(styles.bannerItem, {
                        [styles.freeToPlay]: isFreeToPlayItem,
                      })
                    )}
                    key={i}
                    style={{ backgroundImage: `url(${bgImage})` }}
                    url={RouteHelper.DestinyBuyDetail({
                      productFamilyTag: productFamily.productFamilyTag,
                    })}
                  >
                    <ProductFamilyTitles
                      titlesClassName={styles.getStartedTitles}
                      title={coverTitle}
                      subtitle={productFamily.smallCoverTitle}
                    />

                    {isFreeToPlayItem && (
                      <img
                        src={this.state.freeToPlayPopoutImg}
                        className={styles.popoutImg}
                      />
                    )}
                  </Anchor>
                );
              })}
            </div>
          </Grid>
          <Grid
            className={classNames(styles.contentFrame, {
              [styles.orderTwo]: !isBannerTest,
              [styles.orderOne]: isBannerTest,
            })}
            noPadding={true}
            strictMode={true}
          >
            <PaidContent
              expansionProducts={expansionProducts}
              bundleProducts={bundleProducts}
              skuConfig={skuConfig}
            />
          </Grid>
        </div>
      </SystemDisabledHandler>
    );
  }

  private readonly onSkuConfigLoaded = () => {
    if (this.state.skuConfig.loaded) {
      const skuSection = this.state.skuConfig.sections.find(
        (a: any) => a.key === "DestinySkus"
      );
      const familySection = this.state.skuConfig.sections.find(
        (a: any) => a.key === "DestinyProductFamilies"
      );

      /* Load the Firehose content item for the specified tags */
      this.loadProductFamilyContent(familySection.firehoseContentSetTag);
      this.loadSkuContent(skuSection.firehoseContentSetTag);
      this.carouselContent();
      this.loadFreeToPlayPopoutImage("free-to-play-popout-image");
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

  private loadFreeToPlayPopoutImage(staticAssetTag: string) {
    Platform.ContentService.GetContentByTagAndType(
      staticAssetTag,
      "StaticAsset",
      Localizer.CurrentCultureName,
      false
    ).then((response) => {
      const { Path: path } = response.properties;
      if (path) {
        this.setState({ freeToPlayPopoutImg: path });
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
            .filter((a: any) => a.cType === "DestinySkuItem")
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

  private readonly setIsCarouselPaused = (status: boolean) => {
    this.setState({ isCarouselPaused: status });
  };

  private carouselContent() {
    Platform.ContentService.GetContentByTagAndType(
      "buyflowlandingcarousel",
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    ).then((data) => {
      if (data) {
        this.setState({
          carouselItems: data.properties.ContentItems.map((ci: any) =>
            ContentUtils.marketingMediaAssetFromContent(ci)
          ),
        });
      }
    });
  }
}

interface IPaidContent {
  expansionProducts: IDestinyProductFamilyDefinition[];
  bundleProducts: IDestinyProductFamilyDefinition[];
  skuConfig: IDestinySkuConfig;
}

const PaidContent = ({
  expansionProducts,
  bundleProducts,
  skuConfig,
}: IPaidContent) => {
  const params = new URLSearchParams(location.search);
  const promoView = params.get("version");
  const isBannerPromo = promoView === "banner";

  return (
    <>
      <BorderedTitle
        sectionTitle={Localizer.Buyflow.Releases}
        classes={{ wrapper: styles.borderSpacing }}
      />

      <div className={styles.coverCards}>
        {expansionProducts.map((productFamily, i) => {
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

      <BorderedTitle
        sectionTitle={Localizer.Buyflow.Bundles}
        classes={{ wrapper: styles.bundlesTop }}
      />

      <div
        className={classNames(styles.coverCards, {
          [styles.bundleCards]: !isBannerPromo,
        })}
      >
        {bundleProducts.map((productFamily, i) => {
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
    </>
  );
};

interface IProductFamilyTitlesProps {
  title: string;
  subtitle: string;
  saleDetails?: string;
  onSale?: boolean;
  titlesClassName?: string;
}

const ProductFamilyTitles = (props: IProductFamilyTitlesProps) => {
  const { title, subtitle, saleDetails, onSale, titlesClassName } = props;

  return (
    <div className={styles.saleTagCont}>
      {onSale && !StringUtils.isNullOrWhiteSpace(saleDetails) && (
        <p className={styles.discountString}>{saleDetails}</p>
      )}
      <div
        className={classNames(styles.titles, {
          [titlesClassName]: titlesClassName,
        })}
      >
        <div className={styles.subtitle}>{subtitle}</div>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={sanitizeHTML(title)}
        />
      </div>
    </div>
  );
};
