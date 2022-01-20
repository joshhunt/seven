// This is all one page and doesn't use reusable content so separating it into different files is not recommended in this case.
// tslint:disable: max-file-line-count

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { withGlobalState } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { FirehoseNewsAndMedia } from "@UI/Content/FirehoseNewsAndMedia";
import { Img } from "@Helpers";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { MarketingSubNav } from "@UI/Marketing/MarketingSubNav";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React from "react";
import styles from "./Forsaken.module.scss";

interface IForsakenPageState {
  menuLocked: boolean;
  forsakenIsShowing: boolean;
}

class ForsakenPageInternal extends React.Component<{}, IForsakenPageState> {
  private readonly heroRef: React.RefObject<HTMLDivElement> = React.createRef();

  private readonly forsakenLogo = `/7/ca/destiny/products/forsaken/d2-fpk-logo_en.svg`;

  private readonly idToElementsMapping: { [key: string]: HTMLDivElement } = {};

  constructor(props: {}) {
    super(props);

    this.state = {
      menuLocked: false,
      forsakenIsShowing: true,
    };
  }

  private readonly showForsaken = () => {
    this.setState({ forsakenIsShowing: true });
  };

  private readonly showUpgradeEdition = () => {
    this.setState({ forsakenIsShowing: false });
  };

  private onClickStoreItem(skuTag: string) {
    window.location.href = `/7${
      RouteHelper.DestinyBuyDetail({ productFamilyTag: skuTag }).url
    }`;
  }

  public render() {
    const exoticBlurb = Localizer.Destiny.ForsakenExoticsBlurb;
    const raidsBlurb = Localizer.Destiny.ForsakenRaidsDetail;

    const buttonSkuTag = this.state.forsakenIsShowing
      ? DestinySkuTags.ForsakenDetail
      : DestinySkuTags.LegendaryEdition;

    return (
      <div className={styles.forsakenPage}>
        <BungieHelmet
          image={Img(
            "/destiny/products/forsaken/forsaken_hero_poster_hires_bg.jpg"
          )}
          title={Localizer.Destiny.NewLightForsakenTitle}
        >
          <body
            className={SpecialBodyClasses(
              BodyClasses.HideServiceAlert | BodyClasses.NoSpacer
            )}
          />
        </BungieHelmet>
        {
          // hero
        }
        <div className={styles.hero} ref={this.heroRef}>
          <div className={styles.heroGradient} />
          <div
            className={styles.heroLogo}
            style={{ backgroundImage: `url(${this.forsakenLogo})` }}
          />
        </div>
        {
          // subnav
        }
        <MarketingSubNav
          onChange={(menuLocked) => this.setState({ menuLocked })}
          ids={Object.keys(this.idToElementsMapping)}
          renderLabel={(id) => Localizer.Destiny[`Submenu_${id}`]}
          buttonProps={{
            children: Localizer.Destiny.BuyNow,
            url: `/7/${Localizer.CurrentCultureName}/Destiny/Buy/Forsaken`,
          }}
          accentColor={"gold"}
        />
        {
          //exotics
        }
        <ForsakenSection
          bgImage={"/7/ca/destiny/products/forsaken/exotics-bg.jpg"}
          mobileBgImage={
            "/7/ca/destiny/products/forsaken/exotics-bg_mobile.jpg"
          }
          smallTitle={Localizer.Destiny.Submenu_forsaken_exotics}
          title={Localizer.Destiny.ForsakenExoticsTitle}
          blurb={exoticBlurb}
          classes={{
            section: styles.exoticSection,
            sectionBg: styles.exoticBg,
          }}
          idToElementsMapping={this.idToElementsMapping}
          id={"forsaken_exotics"}
        >
          <ForsakenThumbnailGroup
            images={[
              {
                thumbnail: "fspk-screenshot-exotics_thumb1.jpg",
                screenshot: "fspk-screenshot-exotics_full1.jpg",
              },
              {
                thumbnail: "fspk-screenshot-exotics_thumb2.jpg",
                screenshot: "fspk-screenshot-exotics_full2.jpg",
              },
              {
                thumbnail: "fspk-screenshot-exotics_thumb3.jpg",
                screenshot: "fspk-screenshot-exotics_full3.jpg",
              },
            ]}
          />
        </ForsakenSection>

        {
          //ciphers
        }
        <ForsakenSection
          bgImage={"/7/ca/destiny/products/forsaken/ciphers-bg.jpg"}
          mobileBgImage={
            "/7/ca/destiny/products/forsaken/ciphers-bg_mobile.jpg"
          }
          smallTitle={Localizer.Destiny.ForsakenCiphers}
          title={Localizer.Destiny.ForsakenCiphersTitle}
          blurb={Localizer.Destiny.ForsakenCiphersDetail}
          classes={{
            section: styles.cipherSection,
            sectionBg: styles.cipherBg,
          }}
          idToElementsMapping={this.idToElementsMapping}
          id={"forsaken_ciphers"}
        >
          <p className={styles.ciphersDetail}>
            {Localizer.Destiny.ForsakenCiphersSubDetail}
          </p>
        </ForsakenSection>

        {
          //dungeon - shattered throne
        }
        <ForsakenSection
          bgImage={"/7/ca/destiny/products/forsaken/dungeon-bg.jpg"}
          mobileBgImage={
            "/7/ca/destiny/products/forsaken/dungeon-bg_mobile.jpg"
          }
          smallTitle={Localizer.Destiny.forsaken_yearTwo_dungeon}
          title={Localizer.Destiny.ForsakenDungeonTitle}
          blurb={Localizer.Destiny.ForsakenDungeonDetail}
          classes={{
            section: styles.dungeonSection,
            sectionBg: styles.dungeonBg,
          }}
          idToElementsMapping={this.idToElementsMapping}
          id={"forsaken_dungeon"}
        >
          <ForsakenThumbnailGroup
            images={[
              {
                thumbnail: "fspk-screenshot-dungeon_thumb1.jpg",
                screenshot: "fspk-screenshot-dungeon_full1.jpg",
              },
              {
                thumbnail: "fspk-screenshot-dungeon_thumb2.jpg",
                screenshot: "fspk-screenshot-dungeon_full2.jpg",
              },
              {
                thumbnail: "fspk-screenshot-dungeon_thumb3.jpg",
                screenshot: "fspk-screenshot-dungeon_full3.jpg",
              },
            ]}
          />
        </ForsakenSection>

        {
          //raids
        }
        <ForsakenSection
          bgImage={
            "/7/ca/destiny/products/forsaken/v2/desktop/raids_lastwish_bg.jpg"
          }
          mobileBgImage={
            "/7/ca/destiny/products/forsaken/v2/mobile/raids_lastwish_bg_mobile.jpg"
          }
          smallTitle={Localizer.Destiny.forsaken_yearTwo_raids}
          title={Localizer.Destiny.ForsakenLastWishTitle}
          blurb={raidsBlurb}
          classes={{ section: styles.raidSection, sectionBg: styles.raidBg }}
          idToElementsMapping={this.idToElementsMapping}
          id={"raid"}
        >
          <ForsakenThumbnailGroup
            images={[
              {
                thumbnail: "fspk-screenshot-raid_thumb1.jpg",
                screenshot: "fspk-screenshot-raid-full1.jpg",
              },
              {
                thumbnail: "fspk-screenshot-raid_thumb2.jpg",
                screenshot: "fspk-screenshot-raid-full2.jpg",
              },
              {
                thumbnail: "fspk-screenshot-raid_thumb3.jpg",
                screenshot: "fspk-screenshot-raid-full3.jpg",
              },
            ]}
          />
        </ForsakenSection>

        {
          //buy
        }
        {/*<div className={styles.buyForsaken} id={"buy"}>*/}
        {/*	<div className={styles.forsakenBuyTitle}>*/}
        {/*		{Localizer.Destiny.SelectEdition}*/}
        {/*	</div>*/}
        {/*	<div className={classNames(styles.tabs, this.state.forsakenIsShowing ? styles.std : styles.ue)}>*/}
        {/*		<div role={"button"} className={styles.standardTab} onClick={this.showForsaken}>{Localizer.Destiny.ForsakenTitle}</div>*/}
        {/*		<div role={"button"} className={styles.collectionTab} onClick={this.showUpgradeEdition}>{Localizer.Destiny.buyFlowLegendaryEditionTitle}</div>*/}
        {/*	</div>*/}
        {/*	<div className={styles.shadowkeepBuyContainer}>*/}
        {/*		<div className={styles.shadowkeepBuy}>*/}
        {/*			<div className={classNames(styles.cover, this.state.forsakenIsShowing ? styles.std : styles.ue)}*/}
        {/*				 style={{*/}
        {/*					 backgroundImage: this.state.forsakenIsShowing*/}
        {/*									  ? `url("7/ca/destiny/products/forsaken/forsakenpack_buy_cover_${Localizer.CurrentCultureName}.jpg")`*/}
        {/*									  : `url("7/ca/destiny/products/forsaken/legendaryed_buy_cover_${Localizer.CurrentCultureName}.jpg")`*/}
        {/*				 }}*/}
        {/*			/>*/}
        {/*		</div>*/}
        {/*		<div className={styles.shadowkeepBuyDescription}>*/}
        {/*			<h1 className={styles.editionTitle}>*/}
        {/*				<span className={styles.destinyTitle}>{Localizer.Shadowkeep.DestinyBuyTItleIntro}</span>*/}
        {/*				<span>*/}
        {/*					{*/}
        {/*						this.state.forsakenIsShowing*/}
        {/*						? Localizer.Destiny.ForsakenPackTitle*/}
        {/*						: Localizer.Destiny.buyFlowLegendaryEditionTitle*/}
        {/*					}*/}
        {/*				</span>*/}
        {/*			</h1>*/}
        {/*			{(!ConfigUtils.SystemStatus("LegendaryEditionEnabled") && !this.state.forsakenIsShowing) &&*/}
        {/*			<Button size={BasicSize.Medium} buttonType={"disabled"}>{Localizer.bungierewards.ComingSoon_NAME}</Button>*/}
        {/*			}*/}
        {/*			{((ConfigUtils.SystemStatus("LegendaryEditionEnabled") && !this.state.forsakenIsShowing) || this.state.forsakenIsShowing) &&*/}
        {/*			<Button*/}
        {/*				className={styles.preorderButton}*/}
        {/*				onClick={() => this.onClickStoreItem(buttonSkuTag)}*/}
        {/*				analyticsId={buttonSkuTag}*/}
        {/*			>*/}
        {/*				{Localizer.Destiny.ForsakenLearnMore}*/}
        {/*			</Button>*/}
        {/*			}*/}
        {/*		</div>*/}
        {/*	</div>*/}
        {/*</div>*/}

        <div className={styles.mediaSection}>
          <div className={styles.mediaContent}>
            <FirehoseNewsAndMedia
              tag={"forsaken-media"}
              useUpdatedComponent={true}
              selectedTab={"screenshots"}
              classes={{
                tabBtn: styles.mediaTabBtn,
                selectedTab: styles.selected,
                sectionTitle: styles.mediaTitle,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

interface IForsakenSection {
  bgImage: string;
  mobileBgImage: string;
  smallTitle: string;
  title: string;
  blurb: string;
  classes?: {
    section?: string;
    sectionBg?: string;
  };
  children: React.ReactNode;
  idToElementsMapping: { [key: string]: HTMLDivElement };
  id: string;
}

const ForsakenSection: React.FC<IForsakenSection> = (props) => {
  const responsive = useDataStore(Responsive);

  const bgImage = responsive.mobile ? props.mobileBgImage : props.bgImage;

  return (
    <div
      className={classNames(styles.forsakenSection, props.classes?.section)}
      id={props.id}
      ref={(el) => (props.idToElementsMapping[props.id] = el)}
    >
      <div
        className={classNames(styles.sectionBg, props.classes?.sectionBg)}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={styles.sectionContent}>
        <div className={styles.sectionText}>
          <h3 className={styles.smallTitle}>{props.smallTitle}</h3>
          <div className={styles.titleDivider} />
          <h2 className={styles.title}>{props.title}</h2>
          <p className={styles.blurb}>{props.blurb}</p>
        </div>
        {props.children}
      </div>
    </div>
  );
};

interface IForsakenThumbnailGroup {
  images: { thumbnail: string; screenshot: string }[];
}

const ForsakenThumbnailGroup: React.FC<IForsakenThumbnailGroup> = (props) => {
  const allScreenshots = props.images.map(
    (img) => `/7/ca/destiny/products/forsaken/${img.screenshot}`
  );

  return (
    <div className={styles.thumbnailGroup}>
      {props.images.map(({ thumbnail, screenshot }, i) => {
        return (
          <ClickableMediaThumbnail
            key={i}
            thumbnail={`/7/ca/destiny/products/forsaken/${thumbnail}`}
            singleOrAllScreenshots={allScreenshots}
            screenshotIndex={i}
            classes={{
              btnWrapper: styles.thumbnailBtn,
            }}
          />
        );
      })}
    </div>
  );
};

export default withGlobalState(ForsakenPageInternal, ["responsive"]);
