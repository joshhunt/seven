import { Responsive } from "@Boot/Responsive";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import { DestinyProductFamilies } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { UrlUtils } from "@Utilities/UrlUtils";
import * as React from "react";
import { Platform, Content } from "@Platform";
import { Localizer } from "@bungie/localization";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import styles from "./DestinyBuyProductDetail.module.scss";
import classNames from "classnames";
import { SpecialBodyClasses, BodyClasses } from "@UI/HelmetUtils";
import DestinySkuConfigDataStore, {
  IDestinySkuConfig,
} from "@UI/Destiny/SkuSelector/DestinySkuConfigDataStore";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import {
  IDestinyProductFamilyDefinition,
  IDestinyProductDefinition,
} from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import {
  DestinyBuyDetailItem,
  PotentialSkuButton,
} from "./Shared/DestinyBuyDetailItem";
import { DataStore } from "@bungie/datastore";
import { useParams, Redirect } from "react-router";
import { RouteHelper } from "@Routes/RouteHelper";
import { ContentUtils } from "@Utilities/ContentUtils";
import { DestinyBuyEditionSelector } from "./DestinyBuyEditionSelector";
import { Grid, GridCol } from "@UI/UIKit/Layout/Grid/Grid";
import { ParallaxContainer } from "@UI/UIKit/Layout/ParallaxContainer";
import { StickySubNav } from "@UI/Navigation/StickySubNav";
import { DestinyBuyDataStore } from "./Shared/DestinyBuyDataStore";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { SiEpicgames } from "@react-icons/all-files/si/SiEpicgames";

export interface IDestinyBuyProductDetailProps
  extends GlobalStateComponentProps<"responsive"> {
  /** The Tag of the Product Family to display. Must specify. */
  productFamilyTag: string;
}

interface IDestinyBuyProductDetailState {
  destinyProductFamily: IDestinyProductFamilyDefinition;
  skuItems: IDestinyProductDefinition[];
  editionSelectorSkus: IDestinyProductDefinition[];
  skuConfig: IDestinySkuConfig;
  selectedSkuIndex: number;
  loading: boolean;
  noContentItem: boolean;
  menuLocked: boolean;
  showStickyNav: boolean;
  collectorsEdition: IDestinyProductDefinition;
}

/**
 * Renders a content item either by ID or tag and type
 *  *
 * @param {IContentItemProps} props
 * @returns
 */
class DestinyBuyProductDetailInternal extends React.Component<
  IDestinyBuyProductDetailProps,
  IDestinyBuyProductDetailState
> {
  private readonly subs: DestroyCallback[] = [];
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IDestinyBuyProductDetailProps) {
    super(props);

    this.state = {
      destinyProductFamily: null,
      skuItems: [],
      editionSelectorSkus: [],
      skuConfig: DestinySkuConfigDataStore.state,
      loading: true,
      noContentItem: false,
      menuLocked: false,
      selectedSkuIndex: DestinyBuyDataStore.state.selectedSkuIndex || 0,
      showStickyNav: false,
      collectorsEdition: null,
    };
  }

  public componentDidMount() {
    this.subs.push(
      DestinySkuConfigDataStore.observe((skuConfig) =>
        this.setState(
          {
            skuConfig,
          },
          this.onSkuConfigLoaded
        )
      )
    );

    this.subs.push(
      DestinyBuyDataStore.observe(
        (data) => {
          data && this.setState({ selectedSkuIndex: data.selectedSkuIndex });
        },
        null,
        true
      )
    );

    Platform.ContentService.GetContentByTagAndType(
      this.props.productFamilyTag,
      "DestinyProductFamily",
      Localizer.CurrentCultureName,
      true
    )
      .then((response) => {
        const destinyProductFamily = DestinySkuUtils.productFamilyDefinitionFromContent(
          response
        );

        this.setState({
          destinyProductFamily,
        });
      })
      .catch(() =>
        this.setState({
          noContentItem: true,
        })
      );

    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);

    window.removeEventListener("scroll", this.onScroll);

    DestinyBuyDataStore.actions.setSelectedSkuIndex(0);
  }

  private readonly onSkuConfigLoaded = () => {
    if (this.state.skuConfig.loaded) {
      const section = this.state.skuConfig.sections.find(
        (a) => a.key === "DestinySkus"
      );

      // Load the Firehose content item for the specified tag
      this.loadSkuContent(section.firehoseContentSetTag);
    }
  };

  private loadSkuContent(firehoseContentSetTag: string) {
    Platform.ContentService.GetContentByTagAndType(
      firehoseContentSetTag,
      "ContentSet",
      Localizer.CurrentCultureName,
      false
    )
      .then((contentSet) => {
        const allItems: Content.ContentItemPublicContract[] =
          contentSet.properties["ContentItems"];
        if (allItems) {
          const skuItems = allItems
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
            skuItems,
          });

          /* Here we are getting the query param containing the SKU */
          const params = new URLSearchParams(location.search);
          const skuFromQuery = params.get("productSku");
          const openModal = params.get("open");

          /* This is where we are taking the SKU, comparing it and finding the index to update the Buy Data Store with 
					  -- defaulting to 0 in case of oddities */
          if (skuFromQuery && skuItems && this.state.destinyProductFamily) {
            const {
              editionSelectorSkus,
            } = DestinySkuUtils.getSkuItemsForProductFamilySkuTagLists(
              this.state.destinyProductFamily,
              skuItems
            );

            const indexOfQueryParamSku =
              editionSelectorSkus?.findIndex(
                (sku) => sku.skuTag === skuFromQuery
              ) ?? 0;

            DestinyBuyDataStore.actions.setSelectedSkuIndex(
              indexOfQueryParamSku
            );

            if (openModal === "1") {
              DestinySkuUtils.showStoreModal(
                editionSelectorSkus[indexOfQueryParamSku].skuTag
              );
            }
          }
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  private readonly onMenuLock = (fixed: boolean) => {
    this.setState({
      menuLocked: fixed,
    });

    return fixed;
  };

  private readonly onScroll = () => {
    let isVisible = true;
    const el = document.getElementById("hero");
    if (el) {
      const rect = el.getBoundingClientRect();
      const elemBottom = rect.bottom;

      isVisible = elemBottom >= 0 && elemBottom <= window.innerHeight;
    }

    this.setState({ showStickyNav: !isVisible });
  };

  private readonly scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  public render() {
    if (this.state.noContentItem) {
      return <Redirect to={RouteHelper.DestinyBuy().url} />;
    }

    if (this.state.skuItems.length === 0) {
      return (
        <SpinnerContainer loading={true} mode={SpinnerDisplayMode.fullPage} />
      );
    }

    if (this.state.destinyProductFamily) {
      const {
        destinyProductFamily,
        skuItems,
        selectedSkuIndex,
        showStickyNav,
      } = this.state;
      const mobileSize = this.props.globalState.responsive.mobile;

      /* Convert content items stored in the Product Family firehose item into the types each component is expecting */
      const mediaDetailItem =
        destinyProductFamily.mediaDetailSection[0] &&
        ContentUtils.marketingMediaAssetFromContent(
          destinyProductFamily.mediaDetailSection[0]
        );
      const detailItems =
        destinyProductFamily.detailSection &&
        destinyProductFamily.detailSection.map((di) =>
          ContentUtils.marketingMediaAssetFromContent(di)
        );

      const {
        editionSelectorSkus,
        comparisonSkus,
        collectorsEdition,
      } = DestinySkuUtils.getSkuItemsForProductFamilySkuTagLists(
        destinyProductFamily,
        skuItems
      );

      /* When the page loads, if there is no selected sku set, we want to make sure a valid sku is selected, so we update the datastore with the first element in the edition selector */
      const selectedSkuName =
        editionSelectorSkus[0] &&
        skuItems[0] &&
        skuItems.find(
          (sku) => sku.skuTag === editionSelectorSkus[selectedSkuIndex].skuTag
        )?.edition;

      // gradient needs to be slightly darker on mobile to make logo stand out more
      const bgGradientColor = `rgba(17,36,59, ${mobileSize ? "0.32" : "0.15"})`;
      const backgroundGradient =
        destinyProductFamily.productFamilyTag ===
        DestinyProductFamilies.BeyondLight
          ? `linear-gradient(${bgGradientColor}, ${bgGradientColor}),`
          : "";
      const backgroundImage = mobileSize
        ? destinyProductFamily.heroBackgroundMobile
        : destinyProductFamily.heroBackground;
      const collectorsIsSelected =
        editionSelectorSkus[selectedSkuIndex] === collectorsEdition;

      const icon = "keyboard_arrow_up";

      const includeButtons = UrlUtils.QueryToObject()?.t_nov9_btns === "true";

      return (
        <SystemDisabledHandler systems={["BuyFlow"]}>
          <SpinnerContainer loading={!destinyProductFamily}>
            <div>
              <BungieHelmet
                title={destinyProductFamily.pageTitle}
                image={destinyProductFamily.heroBackground}
              >
                <body
                  className={classNames(
                    SpecialBodyClasses(BodyClasses.NoSpacer),
                    SpecialBodyClasses(BodyClasses.HideServiceAlert),
                    styles.buyDetail
                  )}
                />
              </BungieHelmet>
              <Anchor
                className={classNames(styles.backButton, {
                  [styles.hide]: showStickyNav,
                })}
                url={RouteHelper.DestinyBuy()}
              >
                <Icon
                  iconType={"material"}
                  iconName={"arrow_back_ios"}
                  className={styles.backIcon}
                />
                <p> {Localizer.crosssave.back} </p>
              </Anchor>
              <div ref={this.heroRef} id={"hero"}>
                <ParallaxContainer
                  parallaxSpeed={2}
                  isFadeEnabled={false}
                  fadeOutSpeed={700}
                  backgroundOffset={0}
                  className={styles.hero}
                  style={{
                    backgroundImage: `${backgroundGradient} url(${backgroundImage})`,
                    paddingTop: mobileSize
                      ? `calc(549px + (74px * ${editionSelectorSkus.length}))`
                      : "unset",
                  }}
                >
                  <div className={styles.heroContent}>
                    <div
                      className={styles.heroLogo}
                      style={{
                        backgroundImage: `url(${destinyProductFamily.heroLogo})`,
                      }}
                    />
                    <DestinyBuyEditionSelector
                      skus={editionSelectorSkus}
                      title={destinyProductFamily.coverTitle}
                      subtitle={destinyProductFamily.smallCoverTitle}
                      buttonLabel={
                        destinyProductFamily.expansionSelectorButtonLabel
                      }
                      disclaimer={
                        destinyProductFamily.expansionSelectorDisclaimer
                      }
                      collectorsEdition={collectorsEdition}
                      productFamily={destinyProductFamily.productFamilyTag}
                    />
                  </div>
                </ParallaxContainer>
              </div>

              {showStickyNav && (
                <StickySubNav
                  onFixedChange={this.onMenuLock}
                  relockUnder={this.heroRef}
                  backgroundColor={"rgb(18, 23, 28)"}
                >
                  <div className={styles.stickyNavContent}>
                    <div
                      className={styles.heroLogo}
                      style={{
                        backgroundImage: `url(${destinyProductFamily.heroLogo})`,
                      }}
                    />
                    <div className={styles.rightNavContent}>
                      {editionSelectorSkus.length > 1 && (
                        <div
                          className={styles.toTopClickable}
                          onClick={this.scrollToTop}
                          role={"button"}
                        >
                          <div className={styles.scrollToTop}>
                            <Icon iconType={"material"} iconName={icon} />
                          </div>
                          <div className={styles.editionBox}>
                            <div className={styles.identifier}>
                              {Localizer.BuyFlow.Edition}
                            </div>
                            <div className={styles.selectedSku}>
                              {selectedSkuName}
                            </div>
                          </div>
                        </div>
                      )}
                      <PotentialSkuButton
                        className={styles.CTAButton}
                        url={
                          collectorsIsSelected
                            ? collectorsEdition.relatedPage
                            : null
                        }
                        sku={
                          !collectorsIsSelected
                            ? editionSelectorSkus[selectedSkuIndex].skuTag
                            : null
                        }
                        buttonType={"gold"}
                        size={BasicSize.Medium}
                      >
                        {destinyProductFamily.expansionSelectorButtonLabel}
                      </PotentialSkuButton>
                    </div>
                  </div>
                </StickySubNav>
              )}

              <div className={styles.banner}>
                <div className={styles.contentFrame}>
                  {destinyProductFamily.bannerText && (
                    <div
                      className={styles.bannerText}
                      dangerouslySetInnerHTML={sanitizeHTML(
                        destinyProductFamily.bannerText
                      )}
                    />
                  )}
                  {mobileSize && (
                    <p className={styles.platformText}>
                      {Localizer.Buyflow.AvailableOn}
                    </p>
                  )}
                  <div className={styles.platforms}>
                    {!mobileSize && (
                      <p className={styles.platformText}>
                        {Localizer.Buyflow.AvailableOn}
                      </p>
                    )}
                    <div className={styles.xboxSeriesX} />
                    <div className={styles.xboxOne} />
                    <div className={styles.windows} />
                    <div className={styles.playstation} />
                    <div className={styles.steam} />
                    <div className={styles.stadia} />
                    <SiEpicgames className={styles.epic} />
                  </div>
                </div>
              </div>

              <Grid
                className={styles.contentFrame}
                noPadding={true}
                strictMode={true}
              >
                {destinyProductFamily.preorderBanner && (
                  <GridCol
                    cols={12}
                    className={styles.preorderBanner}
                    style={{
                      backgroundImage: `url(${destinyProductFamily.preorderBanner})`,
                    }}
                  >
                    <div
                      className={styles.preorderText}
                      dangerouslySetInnerHTML={sanitizeHTML(
                        destinyProductFamily.preorderText
                      )}
                    />
                  </GridCol>
                )}

                <GridCol cols={12}>
                  <DestinyBuyDetailItem
                    imagesForPagination={
                      mediaDetailItem?.largeImage ||
                      mediaDetailItem?.imageThumbnail ||
                      mediaDetailItem?.videoThumbnail
                    }
                    orientation={"textblock-media"}
                    item={mediaDetailItem}
                  />
                </GridCol>

                <div className={styles.borderTop}>
                  <div className={styles.sectionTitle}>
                    {destinyProductFamily.detailSectionTitle}
                  </div>
                </div>

                {detailItems.map((mma, i) => {
                  return (
                    mma && (
                      <GridCol
                        cols={detailItems.length === 4 ? 3 : 4}
                        mobile={12}
                        key={i}
                      >
                        <DestinyBuyDetailItem
                          imagesForPagination={detailItems?.map(
                            (item) => item.largeImage || item.imageThumbnail
                          )}
                          imgIndexInPagination={i}
                          orientation={"vertical"}
                          item={mma}
                          key={i}
                        />
                      </GridCol>
                    )
                  );
                })}

                {comparisonSkus.length > 0 && (
                  <>
                    <div className={styles.borderTop}>
                      <div className={styles.sectionTitle}>
                        {destinyProductFamily.comparisonSectionTitle}
                      </div>
                    </div>
                    {comparisonSkus.map(
                      (a, i) =>
                        a && (
                          <GridCol
                            cols={detailItems.length === 4 ? 3 : 4}
                            mobile={12}
                            key={i}
                          >
                            <DestinyBuyDetailItem
                              imagesForPagination={comparisonSkus.map(
                                (sku) => sku.imagePath
                              )}
                              imgIndexInPagination={i}
                              orientation={"vertical"}
                              skuItem={a}
                              showSkuBtn={includeButtons}
                            />
                          </GridCol>
                        )
                    )}
                  </>
                )}

                {collectorsEdition && (
                  <>
                    <div className={styles.borderTop}>
                      <div className={styles.sectionTitle}>
                        {destinyProductFamily.collectorsEditionSectionTitle}
                      </div>
                    </div>
                    <GridCol
                      cols={12}
                      className={styles.collectorsEditionSection}
                    >
                      <DestinyBuyDetailItem
                        imagesForPagination={collectorsEdition.imagePath}
                        orientation={"textblock-media"}
                        skuItem={collectorsEdition}
                        collectorsEdition={true}
                      />
                    </GridCol>
                  </>
                )}
              </Grid>
            </div>
          </SpinnerContainer>
        </SystemDisabledHandler>
      );
    } else {
      return null;
    }
  }
}

export const DestinyBuyProductDetail = withGlobalState(
  DestinyBuyProductDetailInternal,
  ["responsive"]
);

export interface IBuyDetailRouterParams {
  productFamilyTag?: string;
}

const DestinyBuyProductRouter: React.FC = () => {
  const params = useParams<IBuyDetailRouterParams>();

  return (
    <DestinyBuyProductDetail
      productFamilyTag={`product-family-${params.productFamilyTag}`}
    />
  );
};

export default DestinyBuyProductRouter;
