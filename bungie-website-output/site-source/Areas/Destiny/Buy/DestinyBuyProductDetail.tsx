import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import * as React from "react";
import { Platform, Content } from "@Platform";
import { Localizer } from "@Global/Localizer";
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
import { DestinyBuyDetailItem } from "./Shared/DestinyBuyDetailItem";
import { DestroyCallback, DataStore } from "@Global/DataStore";
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
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Anchor } from "@UI/Navigation/Anchor";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";

export interface IDestinyBuyProductDetailProps
  extends GlobalStateComponentProps<"responsive"> {
  /** The Tag of the Product Family to display. Must specify. */
  productFamilyTag: string;
}

interface IDestinyBuyProductDetailState {
  destinyProductFamily: IDestinyProductFamilyDefinition;
  skuItems: IDestinyProductDefinition[];
  skuConfig: IDestinySkuConfig;
  selectedSkuIndex: number;
  loading: boolean;
  noContentItem: boolean;
  menuLocked: boolean;
  showStickyNav: boolean;
  strangerEdition: IDestinyProductDefinition;
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
      skuConfig: DestinySkuConfigDataStore.state,
      loading: true,
      noContentItem: false,
      menuLocked: false,
      selectedSkuIndex: DestinyBuyDataStore.state.selectedSkuIndex,
      showStickyNav: false,
      strangerEdition: null,
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

    window.addEventListener("scroll", this.onScroll);
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
    window.removeEventListener("scroll", this.onScroll);
    DestinyBuyDataStore.update({ selectedSkuIndex: 0 });
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

          /* Here we are gettings the query param containing the SKU */
          const params = new URLSearchParams(location.search);
          const skuFromQuery = params.get("productSku");

          /* This is where we are taking the SKU, comparing it and finding the index to update the Buy Data Store with 
					  -- defaulting to 0 in case of oddities */
          if (skuFromQuery && skuItems && this.state.destinyProductFamily) {
            const {
              allSkus,
            } = DestinySkuUtils.getSkuItemsForProductFamilySkuTagLists(
              this.state.destinyProductFamily,
              skuItems
            );

            const indexOfQueryParamSku =
              allSkus?.findIndex((sku) => sku.skuTag === skuFromQuery) ?? 0;
            DestinyBuyDataStore.update({
              selectedSkuIndex: indexOfQueryParamSku,
            });
          }
        }
      })
      .finally(() =>
        this.setState({
          loading: false,
        })
      );
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
        strangerEdition,
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
        allSkus,
        comparisonSkus,
        collectorsEdition,
      } = DestinySkuUtils.getSkuItemsForProductFamilySkuTagLists(
        destinyProductFamily,
        skuItems
      );

      /* When the page loads, if there is no selected sku set, we want to make sure a valid sku is selected, so we update the datastore with the first element in the edition selector */
      const selectedSkuName =
        allSkus[0] &&
        skuItems[0] &&
        skuItems.find((sku) => sku.skuTag === allSkus[selectedSkuIndex].skuTag)
          ?.edition;

      const icon = "keyboard_arrow_up";

      return (
        <SystemDisabledHandler systems={["BuyFlow"]}>
          <SpinnerContainer loading={destinyProductFamily === null}>
            <div>
              <BungieHelmet
                title={destinyProductFamily.pageTitle}
                image={destinyProductFamily.heroBackground}
              >
                <body
                  className={classNames(
                    SpecialBodyClasses(BodyClasses.NoSpacer),
                    SpecialBodyClasses(BodyClasses.HideServiceAlert)
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
                    backgroundImage: `url(${
                      mobileSize
                        ? destinyProductFamily.heroBackgroundMobile
                        : destinyProductFamily.heroBackground
                    })`,
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
                      skus={allSkus}
                      title={destinyProductFamily.coverTitle}
                      subtitle={Localizer.Destiny.Destiny2}
                      buttonLabel={
                        destinyProductFamily.expansionSelectorButtonLabel
                      }
                      disclaimer={
                        destinyProductFamily.expansionSelectorDisclaimer
                      }
                      collectorsEdition={collectorsEdition}
                      strangerEdition={strangerEdition}
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
                      {allSkus.length > 1 && (
                        <div
                          className={styles.toTopClickable}
                          onClick={this.scrollToTop}
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
                      <Button
                        className={styles.CTAButton}
                        buttonType={"gold"}
                        size={BasicSize.Medium}
                        onClick={() =>
                          DestinySkuUtils.showStoreModal(
                            allSkus[selectedSkuIndex].skuTag
                          )
                        }
                      >
                        {destinyProductFamily.expansionSelectorButtonLabel}
                      </Button>
                    </div>
                  </div>
                </StickySubNav>
              )}

              <div className={styles.banner}>
                <div className={styles.contentFrame}>
                  {destinyProductFamily.bannerText && (
                    <div
                      className={styles.bannerText}
                      dangerouslySetInnerHTML={{
                        __html: destinyProductFamily.bannerText,
                      }}
                    />
                  )}
                  <div className={styles.platforms}>
                    <p className={styles.platformText}>
                      {Localizer.Buyflow.AvailableOn}
                    </p>
                    <div className={styles.xbox} />
                    <div className={styles.playstation} />
                    <div className={styles.steam} />
                    <div className={styles.stadia} />
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
                      dangerouslySetInnerHTML={{
                        __html: destinyProductFamily.preorderText,
                      }}
                    />
                  </GridCol>
                )}

                <GridCol cols={12}>
                  <DestinyBuyDetailItem
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
                              orientation={"vertical"}
                              skuItem={a}
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
                        orientation={"textblock-media"}
                        skuItem={collectorsEdition}
                        collectorsEdition={true}
                      />
                    </GridCol>
                  </>
                )}

                {strangerEdition &&
                  this.state.destinyProductFamily.productFamilyTag ===
                    "beyondlight" && (
                    <>
                      <div className={styles.borderTop}>
                        <div className={styles.sectionTitle}>
                          {strangerEdition.edition}
                        </div>
                      </div>
                      <GridCol
                        cols={12}
                        className={styles.collectorsEditionSection}
                      >
                        <DestinyBuyDetailItem
                          orientation={"textblock-media"}
                          skuItem={strangerEdition}
                          strangerEdition={true}
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
