// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { DestinyArrows } from "@Areas/Destiny/Shared/DestinyArrows";
import { WQHeroQuery } from "@Areas/Destiny/WitchQueen/sections/WQHero/__generated__/WQHeroQuery.graphql";
import { WQImgUrlFromQueryProp } from "@Areas/Destiny/WitchQueen/WitchQueen";
import { Responsive } from "@Boot/Responsive";
import { BungieNetLocaleMap } from "@bungie/contentstack/RelayEnvironmentFactory/presets/BungieNet/BungieNetLocaleMap";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { SystemNames } from "@Global/SystemNames";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import styles from "./WQHero.module.scss";

interface WQHeroProps {
  setHasLoaded: Dispatch<SetStateAction<boolean>>;
}

const WQHero: React.FC<WQHeroProps> = (props) => {
  const responsive = useDataStore(Responsive);

  const locale = BungieNetLocaleMap(Localizer.CurrentCultureName);
  const data = useLazyLoadQuery<WQHeroQuery>(
    graphql`
      query WQHeroQuery($locale: String!) {
        nova_product_page(uid: "blt6927482d223d0222", locale: $locale) {
          hero {
            hero_bg_desktopConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_bg_mobileConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_trailer_btn_bgConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_logo_imgConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_pre_order_btn_bgConnection {
              edges {
                node {
                  url
                }
              }
            }
            hero_pre_order_btn_text
            hero_trailer_btn_text
            hero_trailer_id
            hero_date_text
            hero_bg_desktop_videoConnection {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    `,
    { locale }
  );

  useEffect(() => {
    props.setHasLoaded(!!data);
  }, [data]);

  const {
    hero_bg_desktopConnection,
    hero_bg_mobileConnection,
    hero_trailer_btn_bgConnection,
    hero_logo_imgConnection,
    hero_pre_order_btn_bgConnection,
    hero_pre_order_btn_text,
    hero_trailer_btn_text,
    hero_date_text,
    hero_trailer_id,
    hero_bg_desktop_videoConnection,
  } = data?.nova_product_page?.hero ?? {};

  const heroBgImage =
    hero_bg_mobileConnection &&
    responsive.mobile &&
    `url(${WQImgUrlFromQueryProp(hero_bg_mobileConnection)})`;
  const heroVideo = WQImgUrlFromQueryProp(hero_bg_desktop_videoConnection);

  return (
    <div className={styles.hero} style={{ backgroundImage: heroBgImage }}>
      {heroVideo && !responsive.mobile && (
        <video
          className={styles.heroVideo}
          poster={WQImgUrlFromQueryProp(hero_bg_desktopConnection)}
          autoPlay={true}
          loop={true}
          playsInline={true}
          muted={true}
        >
          <source src={heroVideo} type={"video/mp4"} />
        </video>
      )}
      <img
        src={WQImgUrlFromQueryProp(hero_logo_imgConnection)}
        className={styles.titleImg}
      />
      <div className={styles.flexBtns}>
        <WatchTrailerBtn
          trailerId={hero_trailer_id}
          bgImage={WQImgUrlFromQueryProp(hero_trailer_btn_bgConnection)}
          btnText={hero_trailer_btn_text}
        />
        <PreOrderBtn
          bgImage={WQImgUrlFromQueryProp(hero_pre_order_btn_bgConnection)}
          btnText={hero_pre_order_btn_text}
        />
      </div>
      <p className={styles.heroDate}>{hero_date_text}</p>
    </div>
  );
};

interface IWQHeroBtn {
  bgImage: string;
  btnText: string;
}

interface IWatchTrailerBtn extends IWQHeroBtn {
  trailerId: string;
}

const WatchTrailerBtn: React.FC<IWatchTrailerBtn> = (props) => {
  const bgImage = props.bgImage ? `url(${props.bgImage})` : undefined;
  const btnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.WitchQueen,
    "HeroTrailerAnalyticsId",
    ""
  );

  const showVideo = () => YoutubeModal.show({ videoId: props.trailerId });

  return (
    <div
      className={classNames(styles.trailerBtn, styles.heroBtn)}
      onClick={showVideo}
      data-analytics-id={btnAnalyticsId}
    >
      <div
        className={classNames(styles.trailerBtnBg, styles.heroBtnBg)}
        style={{ backgroundImage: bgImage }}
      />
      <div className={styles.heroBtnContent}>
        <Icon
          className={styles.playIcon}
          iconType={"material"}
          iconName={"play_arrow"}
        />
        <p className={styles.btnText}>{props.btnText}</p>
      </div>
    </div>
  );
};

const PreOrderBtn: React.FC<IWQHeroBtn> = (props) => {
  const bgImage = props.bgImage ? `url(${props.bgImage})` : undefined;
  const btnAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.WitchQueen,
    "HeroPreOrderAnalyticsId",
    ""
  );

  return (
    <Anchor
      url={"/WitchQueenBuyNow"}
      className={classNames(styles.heroBtn, styles.preOrderBtn)}
      data-analytics-id={btnAnalyticsId}
    >
      <div
        className={classNames(styles.preOrderBtnBg, styles.heroBtnBg)}
        style={{ backgroundImage: bgImage }}
      />
      <div className={styles.heroBtnContent}>
        <div className={styles.arrowsTextWrapper}>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.left) }}
          />
          <p className={styles.btnText}>{props.btnText}</p>
          <DestinyArrows
            classes={{ root: classNames(styles.arrows, styles.right) }}
          />
        </div>
      </div>
    </Anchor>
  );
};

export default WQHero;
