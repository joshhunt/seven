// Created by larobinson, 2022
// Copyright Bungie, Inc.

import { formatDateForAccountTable } from "@Areas/User/Account";
import { ISilverRecord } from "@Areas/User/AccountComponents/SilverBalanceHistory";
import { Localizer } from "@bungie/localization/Localizer";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
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
  membership,
  bungieName,
}) => {
  let membershipLink = "";

  if (membership) {
    switch (membership?.membershipType) {
      case BungieMembershipType.TigerPsn:
        membershipLink = Localizer.Profile.supportplaystation;
        break;
      case BungieMembershipType.TigerStadia:
        membershipLink = Localizer.Profile.supportstadia;
        break;
      case BungieMembershipType.TigerXbox:
        membershipLink = Localizer.Profile.supportmicrosoft;
        break;
      case BungieMembershipType.TigerSteam:
        membershipLink = Localizer.Profile.supportSteam;
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
          style={{ backgroundImage: `url(${membership?.iconPath})` }}
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
        <Button buttonType={"blue"} url={membershipLink}>
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
