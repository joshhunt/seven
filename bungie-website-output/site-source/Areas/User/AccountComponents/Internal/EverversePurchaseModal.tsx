// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { formatDateForAccountTable } from "@Areas/User/Account";
import { IEververseRecord } from "@Areas/User/AccountComponents/EververseHistory";
import { Localizer } from "@bungie/localization/Localizer";
import { Button } from "@UIKit/Controls/Button/Button";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import styles from "../EververseHistory.module.scss";
import {
  BungieMembershipType,
  EververseVendorPurchaseEventClassification,
} from "@Enum";
import { RouteHelper } from "@Routes/RouteHelper";
import React from "react";

interface EverversePurchaseModalProps {
  applySeparator: (value: string | number) => string;
}

export const EverversePurchaseModal: React.FC<
  IEververseRecord & EverversePurchaseModalProps
> = (
  {
    applySeparator,
    order,
    date,
    bungieName,
    productName,
    productDesc,
    quantity,
    prices,
    status,
    membership,
  },
  platformIcon
) => {
  let platformLink = "";

  if (membership) {
    switch (membership?.membershipType) {
      case BungieMembershipType.TigerPsn:
        platformLink = Localizer.Profile.supportplaystation;
        break;
      case BungieMembershipType.TigerStadia:
        platformLink = Localizer.Profile.supportstadia;
        break;
      case BungieMembershipType.TigerXbox:
        platformLink = Localizer.Profile.supportmicrosoft;
        break;
      case BungieMembershipType.TigerSteam:
        platformLink = Localizer.Profile.supportSteam;
        break;
      //Needs to be updated once we have the support link for EGS
      case BungieMembershipType.TigerEgs:
        platformLink = Localizer.Profile.supportEgs;
        break;
      default:
        throw new Error(Localizer.UserPages.RAF_NoDestinyAccount);
    }
  }

  return (
    <div className={styles.modal}>
      <h2>
        {Localizer.Format(Localizer.Profile.DetailsForOrderOrdernumber, {
          orderNumber: order,
        })}
      </h2>
      <div className={styles.date}>{formatDateForAccountTable(date)}</div>
      <div className={styles.name}>
        {" "}
        <div
          className={styles.icon}
          style={{ backgroundImage: `url(${membership?.iconPath})` }}
        />
        {bungieName}
      </div>
      <div>
        <div className={styles.title}>{Localizer.Profile.ProductName}</div>
        <div className={styles.detail}>{productName}</div>
      </div>
      <div>
        <div className={styles.title}>
          {Localizer.Profile.ProductDescription}
        </div>
        <div className={styles.detail}>{productDesc}</div>
      </div>
      <div>
        <div className={styles.title}>
          {Localizer.Profile.ProductPurchaseQuantity}
        </div>
        <div className={styles.detail}>{applySeparator(quantity)}</div>
      </div>
      <div>
        <div className={styles.title}>
          {Localizer.Profile.InGameCurrencyUnitPrice}
        </div>
        <div className={styles.detail}>
          {Array.from(prices.values(), (val) => val).map(
            (value) =>
              `${applySeparator(value?.Quantity)} ${value?.ItemDisplayName}`
          )}
        </div>
      </div>
      <div>
        <div className={styles.title}>{Localizer.Profile.Status}</div>
        <div className={styles.detail}>
          {EververseVendorPurchaseEventClassification[status]}
        </div>
      </div>
      <div className={styles.disclaimer}>
        {Localizer.Profile.PurchaseDisclaimer}
      </div>
      <div className={styles.buttons}>
        <Button buttonType={"blue"} url={platformLink}>
          {LocalizerUtils.getPlatformNameFromMembershipType(
            membership?.membershipType
          )}
        </Button>
        <Button buttonType={"blue"} url={RouteHelper.HelpArticle(13639)}>
          {Localizer.Profile.PurchaseFaq}
        </Button>
      </div>
    </div>
  );
};
