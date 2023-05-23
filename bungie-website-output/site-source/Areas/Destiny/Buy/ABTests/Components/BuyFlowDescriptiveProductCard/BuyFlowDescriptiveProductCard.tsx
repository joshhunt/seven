// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { IDestinyProductFamilyDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import { Anchor } from "@UI/Navigation/Anchor";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React, { FC, ReactNode, useMemo, memo } from "react";

import styles from "./BuyFlowDescriptiveProductCard.module.scss";

interface Props {
  product: IDestinyProductFamilyDefinition;
  saleInformation?: string;
  isOnSale?: boolean;
}

interface AnchorWrapperProps extends React.DOMAttributes<HTMLElement> {
  href: string;
  children?: ReactNode;
}

const AnchorWrapper: FC<AnchorWrapperProps> = ({ href, children }) =>
  href ? (
    <Anchor
      url={RouteHelper.DestinyBuyDetail({
        productFamilyTag: href,
      })}
      className={styles.wrapper}
    >
      {children}
    </Anchor>
  ) : null;

interface Descriptions {
  [key: string]: string;
}

const BuyFlowDescriptiveProductCard: FC<Props> = ({
  saleInformation,
  isOnSale = true,
  product,
}) => {
  const BuyLoc = Localizer.Buyflow;
  const PAID_MEDIA_DESCRIPTIONS: Descriptions = {
    lightfall: BuyLoc.LightfallDescription,
    witchqueen: BuyLoc.WitchQueenDescription,
    beyondlight: BuyLoc.BeyondLightDescription,
    shadowkeep: BuyLoc.ShadowkeepDescription,
    armorycollection: BuyLoc.ArmoryCollectionDescription,
    legacycollection: BuyLoc.LegacyCollectionDescription,
    anniversary: BuyLoc.AnniversaryPackDescription,
    forsaken: BuyLoc.ForsakenDescription,
    silverbundle: BuyLoc.SeasonSilverBundle,
    ["silverbundle-triumphant"]: BuyLoc.TriumphantSilverBundle,
    ["silverbundle-atheon"]: BuyLoc.AtheonSilverBundle,
  };

  return (
    <AnchorWrapper
      href={product?.productFamilyTag}
      aria-label={sanitizeHTML(product.coverTitle)}
    >
      <div className={styles.imageContainer}>
        <div
          style={{
            backgroundImage: `url("${product.imagePath}")`,
          }}
          className={styles.productImage}
        />
        {isOnSale && !StringUtils.isNullOrWhiteSpace(saleInformation) && (
          <p className={styles.saleTag}>{saleInformation}</p>
        )}
      </div>

      <div className={styles.productHeaders}>
        <p className={styles.coverTitle}>{product.smallCoverTitle}</p>
        <p
          className={styles.title}
          dangerouslySetInnerHTML={sanitizeHTML(product.coverTitle)}
        />
      </div>

      <p className={styles.description}>
        {PAID_MEDIA_DESCRIPTIONS[product?.productFamilyTag]}
      </p>
      <p className={styles.tagline}>{product.tagline}</p>
    </AnchorWrapper>
  );
};

export default memo(BuyFlowDescriptiveProductCard);
