// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { formatDateForAccountTable } from "@Areas/User/Account";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { IEververseRecord } from "@Areas/User/AccountComponents/EververseHistory";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { Button } from "@UIKit/Controls/Button/Button";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { DateTime } from "luxon";
import styles from "../EververseHistory.module.scss";
import {
  BungieMembershipType,
  EververseVendorPurchaseEventClassification,
} from "@Enum";
import { RouteHelper } from "@Routes/RouteHelper";
import React from "react";

export const EverversePurchaseModal: React.FC<IEververseRecord> = (
  {
    order,
    date,
    bungieName,
    productName,
    productDesc,
    quantity,
    prices,
    status,
    platform,
  },
  platformIcon
) => {
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const matchingMembership =
    destinyMember?.memberships?.find((m) =>
      EnumUtils.looseEquals(m.membershipType, platform, BungieMembershipType)
    ) ?? destinyMember?.memberships?.[0];

  let platformLink = "";

  if (platform) {
    switch (platform) {
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
          style={{ backgroundImage: `url(${matchingMembership?.iconPath})` }}
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
        <div className={styles.detail}>{quantity}</div>
      </div>
      <div>
        <div className={styles.title}>
          {Localizer.Profile.InGameCurrencyUnitPrice}
        </div>
        <div className={styles.detail}>
          {Array.from(prices.values(), (val) => val).map(
            (value) => `${value?.Quantity} ${value?.ItemDisplayName}`
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
          {LocalizerUtils.getPlatformNameFromMembershipType(platform)}
        </Button>
        <Button buttonType={"blue"} url={RouteHelper.HelpArticle(13639)}>
          {Localizer.Profile.PurchaseFaq}
        </Button>
      </div>
    </div>
  );
};
