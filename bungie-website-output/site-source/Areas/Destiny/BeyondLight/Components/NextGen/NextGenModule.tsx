// Created by atseng, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/Destiny/BeyondLight/Components/NextGen/NextGenModule.module.scss";
import { DestinyBuyDetailItem } from "@Areas/Destiny/Buy/Shared/DestinyBuyDetailItem";
import { Localizer } from "@Global/Localization/Localizer";
import { GridCol } from "@UIKit/Layout/Grid/Grid";
import { IMarketingMediaAsset } from "@Utilities/ContentUtils";
import classNames from "classnames";
import React from "react";

interface NextGenModuleProps {
  className?: string;
}

export const NextGenModule: React.FC<NextGenModuleProps> = (props) => {
  const beyondlightLoc = Localizer.Beyondlight;

  return (
    <section
      className={classNames(
        styles.nextGenSection,
        styles.textWithScreenShots,
        props.className?.length ? props.className : null
      )}
      style={{ backgroundColor: "#0b1218" }}
      id={"nextGen"}
    >
      <div className={classNames(styles.contentWrapper, styles.worldSection)}>
        <div>
          <h2 className={styles.title}>{beyondlightLoc.NextGenOfDestiny}</h2>
          <p className={styles.copy}>
            {beyondlightLoc.ComingForAllDestiny2Players}
          </p>
        </div>

        <div className={styles.flexContentWrapper}>
          <div className={styles.flexContainer}>
            <div className={styles.flexItem}>
              <div
                className={classNames(styles.nextGenImage, styles.fps)}
                style={{
                  backgroundImage:
                    Localizer.CurrentCultureName === "fr"
                      ? `url("/7/ca/destiny/products/beyondlight/next_gen_4k_fr.png")`
                      : Localizer.CurrentCultureName === "ru"
                      ? `url("/7/ca/destiny/products/beyondlight/next_gen_4k_ru.png")`
                      : `url("/7/ca/destiny/products/beyondlight/next_gen_4k.png")`,
                }}
              />
              <p>{beyondlightLoc.FromTheIcyBrillianceOf}</p>
            </div>
            <div className={styles.flexItem}>
              <div className={classNames(styles.nextGenImage, styles.fov)} />
              <p>{beyondlightLoc.NowYouCanControlHowYou}</p>
            </div>
            <div className={styles.flexItem}>
              <div
                className={classNames(styles.nextGenImage, styles.pvp)}
                style={{
                  backgroundImage:
                    Localizer.CurrentCultureName === "fr"
                      ? `url("/7/ca/destiny/products/beyondlight/next_gen_pvp_120_fr.png")`
                      : Localizer.CurrentCultureName === "ru"
                      ? `url("/7/ca/destiny/products/beyondlight/next_gen_pvp_120_ru.png")`
                      : `url("/7/ca/destiny/products/beyondlight/next_gen_pvp_120.png")`,
                }}
              />
              <p>{beyondlightLoc.GuardiansAreForgedBySpeed}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const NextGenBuyFlowModule: React.FC<NextGenModuleProps> = (props) => {
  const createMarketingMediaAsset = (
    image: string,
    text: string
  ): IMarketingMediaAsset => {
    return {
      contentItemTitle: "",
      videoId: "",
      loopingVideoThumbnail: "",
      videoThumbnail: "",
      videoMp4: "",
      videoTitle: "",
      largeImage: "",
      title: "",
      subtitle: "",
      hyperlink: "",
      fontColor: "black",
      textBlock: text,
      buttonLink: "",
      buttonSku: "",
      buttonLabel: "",
      imageThumbnail: image,
    };
  };

  return (
    <>
      <GridCol cols={4} mobile={12} className={styles.nextGenBuyBlock}>
        <DestinyBuyDetailItem
          orientation={"vertical"}
          item={createMarketingMediaAsset(
            Localizer.CurrentCultureName === "fr"
              ? `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_1_fr.jpg`
              : Localizer.CurrentCultureName === "ru"
              ? `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_1_ru.jpg`
              : `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_1.jpg`,
            Localizer.BeyondLight.FromTheIcyBrillianceOf
          )}
        />
      </GridCol>
      <GridCol cols={4} mobile={12} className={styles.nextGenBuyBlock}>
        <DestinyBuyDetailItem
          orientation={"vertical"}
          item={createMarketingMediaAsset(
            `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_2.jpg`,
            Localizer.BeyondLight.NowYouCanControlHowYou
          )}
        />
      </GridCol>
      <GridCol cols={4} mobile={12} className={styles.nextGenBuyBlock}>
        <DestinyBuyDetailItem
          orientation={"vertical"}
          item={createMarketingMediaAsset(
            Localizer.CurrentCultureName === "fr"
              ? `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_3_fr.jpg`
              : Localizer.CurrentCultureName === "ru"
              ? `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_3_ru.jpg`
              : `/7/ca/destiny/products/beyondlight/buy_nextgen_thumb_3.jpg`,
            Localizer.BeyondLight.GuardiansAreForgedBySpeed
          )}
        />
      </GridCol>
    </>
  );
};
