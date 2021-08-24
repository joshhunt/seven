// Created by larobinson, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./DestinyBuyCoverCard.module.scss";
import { IDestinyProductFamilyDefinition } from "@UI/Destiny/SkuSelector/DestinyProductDefinitions";
import { Localizer } from "@bungie/localization";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";

interface IDestinyBuyCoverCardProps extends React.DOMAttributes<HTMLElement> {
  productFamily: IDestinyProductFamilyDefinition;
  children?: React.ReactNode;
}

/**
 * DestinyBuyCoverCard - clickable card on buy page that leads to detail view of sku
 *  *
 * @param {IDestinyBuyCoverCardProps} props
 * @returns
 */
export const DestinyBuyCoverCard = (props: IDestinyBuyCoverCardProps) => {
  return props.productFamily.productFamilyTag ? (
    <Anchor
      className={styles.card}
      style={{ backgroundImage: `url("${props.productFamily.imagePath}")` }}
      url={RouteHelper.DestinyBuyDetail({
        productFamilyTag: props.productFamily.productFamilyTag,
      })}
    >
      {props.children}
      <div className={styles.tagline}>{props.productFamily.tagline}</div>
    </Anchor>
  ) : null;
};
