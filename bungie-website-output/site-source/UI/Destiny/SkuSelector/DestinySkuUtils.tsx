import {
  IDestinyProductDefinition,
  IDestinyProductFamilyDefinition,
} from "./DestinyProductDefinitions";
import { Content, Platform } from "@Platform";
import {
  IDestinySkuConfig,
  IDestinySkuProduct,
  IDestinySkuProductStoreRegion,
  IDestinySkuValidRegion,
} from "./DestinySkuConfigDataStore";
import { DetailedError } from "@CustomErrors";
import { RouteComponentProps } from "react-router";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import DestinySkuSelectorModal from "./DestinySkuSelectorModal";
import { UserUtils } from "@Utilities/UserUtils";
import { UrlUtils } from "@Utilities/UrlUtils";

export class DestinySkuUtils {
  public static REGION_GLOBAL_KEY = "GLOBAL";

  public static readonly showStoreModal = (skuTag: string) => {
    return DestinySkuSelectorModal.show({
      skuTag,
    });
  };

  private static getAllProducts(skuConfig: IDestinySkuConfig) {
    const productGroupProducts = skuConfig.productGroups.map((a) => [
      ...a.products,
    ]);
    const allProducts: IDestinySkuProduct[] = [].concat.apply(
      [],
      productGroupProducts
    );

    return allProducts;
  }

  public static skuDefinitionFromContent(
    contentItem: Content.ContentItemPublicContract
  ): IDestinyProductDefinition {
    const sku = contentItem.tags
      .find((a) => a.toLowerCase().startsWith("sku-"))
      .toLowerCase()
      .replace("sku-", "");

    return {
      title: contentItem.properties["ProductTitle"],
      subtitle: contentItem.properties["ProductSubtitle"],
      edition: contentItem.properties["ProductEdition"],
      buttonLabel: contentItem.properties["ButtonLabel"],
      blurb: contentItem.properties["Blurb"],
      bigblurb: contentItem.properties["BigBlurb"],
      featured: JSON.parse(contentItem.properties["Featured"] || "false"),
      imagePath: contentItem.properties["Image"],
      price: contentItem.properties["Price"],
      discountText: contentItem.properties["DiscountLabel"],
      disclaimer: contentItem.properties["Disclaimer"],
      finalPrice: contentItem.properties["BungieStoreDiscountFinalPrice"],
      relatedPage: contentItem.properties["LearnMoreUrl"],
      modalHeaderImage: contentItem.properties["ModalHeaderImage"],
      skuTag: sku,
      soldOutButtonLabel: contentItem.properties["soldOutButtonLabel"],
      buyButtonDisabled: JSON.parse(
        contentItem.properties["buyButtonDisabled"] || "true"
      ),
    };
  }

  public static productFamilyDefinitionFromContent(
    contentItem: Content.ContentItemPublicContract
  ): IDestinyProductFamilyDefinition {
    return {
      /* Listen, I know this first one is a bad idea, but it is technically very safe. Since which product family data to use
			 is pulled from the firehose by adding the final part of the url to "product-family-" to create the tag, here we just pull
			 that final part of the url FROM that tag */
      productFamilyTag: contentItem?.tags[0]?.substring(15),
      pageTitle: contentItem.properties["PageTitle"],
      smallCoverTitle: contentItem.properties["SmallCoverTitle"],
      coverTitle: contentItem.properties["CoverTitle"],
      coverTopText: contentItem.properties["CoverTopText"],
      tagline: contentItem.properties["Tagline"],
      imagePath: contentItem.properties["Image"],
      skuList: contentItem.properties["SkuList"],
      editionSelectorSkus: contentItem.properties["EditionSelectorSkus"],
      heroLogo: contentItem.properties["HeroLogo"],
      heroBackgroundMobile: contentItem.properties["HeroBackgroundMobile"],
      herobackgroundVideo: contentItem.properties["HeroBackgroundVideo"],
      heroBackground: contentItem.properties["HeroBackground"],
      expansionSelectorButtonLabel:
        contentItem.properties["ExpansionSelectorButtonLabel"],
      expansionSelectorDisclaimer:
        contentItem.properties["ExpansionSelectorDisclaimer"],
      bannerText: contentItem.properties["BannerText"],
      preorderBanner: contentItem.properties["PreorderBanner"],
      preorderText: contentItem.properties["PreorderText"],
      mediaDetailSection: contentItem.properties["MediaDetailSection"],
      detailSectionTitle: contentItem.properties["DetailSectionTitle"],
      detailSection: contentItem.properties["DetailSection"],
      comparisonSectionTitle: contentItem.properties["ComparisonSectionTitle"],
      comparisonSection: contentItem.properties["ComparisonSection"],
      collectorsEditionSectionTitle:
        contentItem.properties["CollectorsEditionSectionTitle"],
      collectorsEditionSkuTag:
        contentItem.properties["CollectorsEditionSkuTag"],
      saleInformation: contentItem.properties["saleInformation"],
      landingPageCategory: contentItem.properties["LandingPageCategory"],
      mobileCoverImage: contentItem.properties["MobileCoverImage"],
      coverTitleHtml: contentItem.properties["CoverTitleHtml"],
    };
  }

  public static productExists(skuTag: string, skuConfig: IDestinySkuConfig) {
    if (!skuConfig.loaded) {
      return false;
    }

    const allProducts = DestinySkuUtils.getAllProducts(skuConfig);
    const product = allProducts.find((p) => p.key === skuTag);

    return product !== undefined;
  }

  public static getProduct(skuTag: string, skuConfig: IDestinySkuConfig) {
    if (!skuConfig.loaded) {
      return null;
    }

    const allProducts = DestinySkuUtils.getAllProducts(skuConfig);
    const product = allProducts.find((p) => p.key === skuTag);
    if (!product) {
      throw new DetailedError(
        "Product Invalid",
        `Product with key ${skuTag} does not exist in configuration.`
      );
    }

    return product;
  }

  public static getStoresForProduct(
    skuTag: string,
    skuConfig: IDestinySkuConfig
  ) {
    const product = DestinySkuUtils.getProduct(skuTag, skuConfig);
    if (!product) {
      return [];
    }

    return product.stores.map((ps) =>
      skuConfig.stores.find((s) => s.key === ps.key)
    );
  }

  public static getRegionsForProduct(
    skuTag: string,
    storeKey: string,
    skuConfig: IDestinySkuConfig
  ) {
    const product = DestinySkuUtils.getProduct(skuTag, skuConfig);
    if (!product) {
      return [];
    }

    const store = product.stores.find((s) => s.key === storeKey);
    if (!store) {
      throw new DetailedError(
        "Store Invalid",
        `Store with key ${storeKey} does not exist in configuration.`
      );
    }

    return store.regions;
  }

  public static isProductOnSale(skuTag: string, skuConfig: IDestinySkuConfig) {
    const product = DestinySkuUtils.getProduct(skuTag, skuConfig);
    if (!product) {
      return false;
    }

    return product.stores.find((ps) => ps?.activeSale) !== undefined;
  }

  public static isBeyondLightOnSale(skuConfig: IDestinySkuConfig) {
    if (skuConfig === null) {
      return false;
    }

    if (skuConfig.productGroups === null) {
      return false;
    }

    const beyondLightProductGroupArray = skuConfig.productGroups.filter(
      (gp) => gp.key === "BeyondLight"
    );

    if (beyondLightProductGroupArray?.length <= 0) {
      return false;
    }

    const beyondLightProductGroup = beyondLightProductGroupArray[0];

    return beyondLightProductGroup?.products?.some((p) =>
      this.isProductOnSale(p.key, skuConfig)
    );
  }

  public static getSaleForProductAndStore(
    skuTag: string,
    storeKey: string,
    skuConfig: IDestinySkuConfig
  ) {
    const product = DestinySkuUtils.getProduct(skuTag, skuConfig);
    if (!product) {
      return null;
    }

    const store = product.stores.find((ps) => ps.key === storeKey);

    return store.activeSale;
  }

  /**
   * Returns the URL for a store. If not global, return null.
   * @param sku The sku in question
   * @param store The store in question
   * @param config The sku config
   * @param query? optional passing through of query params as string
   * @param regionKey? non-global regions
   */
  public static getStoreUrlForSku(
    sku: string,
    store: string,
    config: IDestinySkuConfig,
    regionKey: string,
    query?: string
  ): string {
    let url = null;
    const region = DestinySkuUtils.getRegionsForProduct(
      sku,
      store,
      config
    ).find((r) => r.key === regionKey);

    if (region) {
      const urlTemplate =
        region?.templateOverride ??
        config.stores.find((el) => el.key === store).urlTemplate;
      const finalUri = region?.sku
        ? urlTemplate.replace("{sku}", region?.sku)
        : null;
      url = query ? `${finalUri}/?${query}` : finalUri;
    }

    return url;
  }

  public static readonly triggerConversion = (
    sku: string,
    store: string,
    region: string,
    rcp: RouteComponentProps
  ) => {
    const q = window.location.search;
    const qObj = UrlUtils.QueryToObject(q);

    const newObj = {
      ...qObj,
      cvt: true,
      sku,
      store,
      region,
    };

    const newQuery = UrlUtils.ObjectToQuery(newObj);

    // Trigger the conversion URL
    rcp.history.replace({
      pathname: rcp.location.pathname,
      search: newQuery,
    });

    // Go back to the non-conversion URL to avoid accidentally tracking conversions when they aren't real
    rcp.history.replace({
      pathname: rcp.location.pathname,
      search: q,
    });

    if (
      UserUtils.isAuthenticated(GlobalStateDataStore.state) &&
      UserUtils.CookieConsentIsEnabled() &&
      UserUtils.CookieConsentIsCurrent()
    ) {
      Platform.ActivityService.LogProductBuyButtonActivity(sku, store, region);
    }
  };

  public static getSkuItemsForProductFamilySkuTagLists(
    productFamily: IDestinyProductFamilyDefinition,
    skuItems: IDestinyProductDefinition[]
  ) {
    if (!productFamily || !skuItems) {
      return null;
    }

    const cachedSkuMapping: {
      [key: string]: IDestinyProductDefinition;
    } = {};

    const tryCache = (skuTag: string) => {
      if (cachedSkuMapping[skuTag]) {
        return cachedSkuMapping[skuTag];
      } else {
        const sku = skuItems.find((si) => si.skuTag === skuTag);
        cachedSkuMapping[skuTag] = sku;

        return sku;
      }
    };

    /* Get skus for the edition selector */
    const editionSelectorSkus: IDestinyProductDefinition[] = Array.isArray(
      productFamily.editionSelectorSkus
    )
      ? productFamily.editionSelectorSkus
          .map((x) => x.SkuTag)
          .map((st) => tryCache(st))
      : [];

    /* Create an array that only includes the skus we want to compare on this page in the order the product family has them */
    const comparisonSkus: IDestinyProductDefinition[] = Array.isArray(
      productFamily.comparisonSection
    )
      ? productFamily.comparisonSection
          .map((x) => x.SkuTag)
          .map((st) => tryCache(st))
      : [];

    /* See if this product family has a collector's edition to show */
    const collectorsEdition: IDestinyProductDefinition = skuItems.find(
      (sku) => sku.skuTag === productFamily.collectorsEditionSkuTag
    );

    return {
      editionSelectorSkus,
      comparisonSkus,
      collectorsEdition,
    };
  }
}
