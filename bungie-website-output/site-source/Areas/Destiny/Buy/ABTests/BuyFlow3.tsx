// Created by a-ahipp, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BnetStackFile } from "../../../../Generated/contentstack-types";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { DestinySkuUtils } from "@UI/Destiny/SkuSelector/DestinySkuUtils";
import styles from "./BuyFlow3.module.scss";
import { Localizer } from "@bungie/localization";
import { Button } from "@UIKit/Controls/Button/Button";
import { Platform } from "@Platform";
import classNames from "classnames";
import { Icon } from "@UIKit/Controls/Icon";

interface BuyFlowProps {
  data: any;
}

const BuyFlow3 = (props: BuyFlowProps) => {
  const { data } = props;
  const {
    slides,
    logo,
    title,
    annual_pass,
    standard,
    bottom_bg,
    bg_color,
    choose_edition,
    divider,
    small_logo,
    learn_more,
  } = data ?? {};

  const responsive = useDataStore(Responsive);

  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0);
  const [annualPassDefinition, setAnnualPassDefinition] = React.useState(null);
  const [standardDefinition, setStandardDefinition] = React.useState(null);

  React.useEffect(() => {
    Platform.ContentService.GetContentByTagAndType(
      `sku-${annual_pass?.sku}`,
      "DestinySkuItem",
      Localizer.CurrentCultureName,
      false
    ).then((contentItem) => {
      const skuDefinition = DestinySkuUtils.skuDefinitionFromContent(
        contentItem
      );

      setAnnualPassDefinition(skuDefinition);
    });

    Platform.ContentService.GetContentByTagAndType(
      `sku-${standard?.sku}`,
      "DestinySkuItem",
      Localizer.CurrentCultureName,
      false
    ).then((contentItem) => {
      const skuDefinition = DestinySkuUtils.skuDefinitionFromContent(
        contentItem
      );

      setStandardDefinition(skuDefinition);
    });
  }, [annual_pass?.sku, standard?.sku]);

  const getResponsiveBg = useCallback(
    (background: { mobile_bg?: BnetStackFile; desktop_bg?: BnetStackFile }) => {
      const img = responsive.mobile
        ? background?.mobile_bg
        : background?.desktop_bg;

      return img?.url ? `url(${img?.url})` : undefined;
    },
    [responsive]
  );

  const heroSlide = slides?.[Math.abs(currentHeroIndex % slides.length)];
  const heroImage = responsive.mobile
    ? heroSlide?.mobile_bg
    : heroSlide?.desktop_bg;

  return (
    <div
      className={styles.wrap}
      style={{
        backgroundImage: getResponsiveBg(bottom_bg),
        backgroundColor: bg_color,
      }}
    >
      <img
        key={heroImage?.url}
        className={styles.bg}
        src={heroImage?.url}
        alt=""
      />
      <div className={styles.inner}>
        <div className={styles.content}>
          <img
            src={logo?.url}
            className={styles.logo}
            loading={"lazy"}
            alt={logo?.title}
          />
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={sanitizeHTML(title)}
          />

          <div className={styles.choose}>{choose_edition}</div>

          <div className={styles.editions}>
            <div>
              <img
                className={styles.thumbnail}
                src={annual_pass?.thumbnail?.url}
                alt=""
              />
              <h3 className={styles.subtitle}>{annual_pass.title}</h3>
              <Button
                buttonType={"none"}
                className={styles.annualButton}
                onClick={() => DestinySkuUtils.showStoreModal(annual_pass.sku)}
                analyticsId={annual_pass.sku}
              >
                {annualPassDefinition?.buttonLabel}
              </Button>
            </div>
            <div>
              <img
                className={styles.thumbnail}
                src={standard?.thumbnail?.url}
                alt=""
              />
              <h3 className={styles.subtitle}>{standard.title}</h3>
              <Button
                buttonType={"none"}
                className={styles.standardButton}
                onClick={() => DestinySkuUtils.showStoreModal(standard.sku)}
                analyticsId={standard.sku}
              >
                {standardDefinition?.buttonLabel}
              </Button>
            </div>
          </div>

          <img className={styles.divider} src={divider?.url} alt="" />

          <div>
            <img className={styles.smallLogo} src={small_logo?.url} alt="" />
            {learn_more ? (
              <Button buttonType={"gold"} url={learn_more?.url}>
                {learn_more?.title}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <button
        className={classNames([styles.arrow, styles.arrowLeft])}
        onClick={() => setCurrentHeroIndex(currentHeroIndex - 1)}
      >
        <Icon
          className={styles.arrowIcon}
          iconName={"arrow_left"}
          iconType={"material"}
        />
      </button>
      <button
        className={classNames([styles.arrow, styles.arrowRight])}
        onClick={() => setCurrentHeroIndex(currentHeroIndex + 1)}
      >
        <Icon
          className={styles.arrowIcon}
          iconName={"arrow_right"}
          iconType={"material"}
        />
      </button>
    </div>
  );
};

export default BuyFlow3;
