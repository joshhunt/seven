// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { formatDateForAccountTable } from "@Areas/User/Account";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { ISilverRecord } from "@Areas/User/AccountComponents/SilverBalanceHistory";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import styles from "../EververseHistory.module.scss";
import { BungieMembershipType } from "@Enum";
import { RouteHelper } from "@Routes/RouteHelper";
import React from "react";

export const SilverChangeModal: React.FC<ISilverRecord> = ({
  productDescription,
  order,
  date,
  change,
  name,
  newQuantity,
  previousQuantity,
  rowKey,
  children,
  platform,
  bungieName,
}) => {
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
        Modal.open(Localizer.UserPages.RAF_NoDestinyAccount);
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
        <div className={styles.detail}>{name}</div>
      </div>
      <div>
        <div className={styles.title}>
          {Localizer.Profile.ProductDescription}
        </div>
        <div className={styles.detail}>{productDescription}</div>
      </div>
      <div>
        <div className={styles.title}>{Localizer.Profile.CurrencyChange}</div>
        <div className={styles.detail}>{change}</div>
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
