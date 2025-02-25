// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { CrossSaveActiveBadge } from "@Areas/CrossSave/Activate/Components/CrossSaveActiveBadge";
import {
  formatDateForAccountTable,
  ViewerPermissionContext,
} from "@Areas/User/Account";
import accountStyles from "@Areas/User/Account.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { EverversePurchaseModal } from "@Areas/User/AccountComponents/Internal/EverversePurchaseModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  BungieMembershipType,
  EververseChangeEventClassification,
  EververseVendorPurchaseEventClassification,
} from "@Enum";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform, Tokens } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import Table from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import styles from "./EververseHistory.module.scss";

export interface IEververseRecord {
  rowKey: number;
  order: string;
  date: string;
  bungieName: string;
  productName: string;
  productDesc: string;
  quantity: string;
  prices: Tokens.EververseVendorPaidCostPair[];
  status:
    | EververseVendorPurchaseEventClassification
    | EververseChangeEventClassification;
  membership: GroupsV2.GroupUserInfoCard;
}

interface EververseHistoryProps {}

export const EververseHistory: React.FC<EververseHistoryProps> = (props) => {
  const { Column } = Table;
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const [selectedMembership, setSelectedMembership] = useState<
    GroupsV2.GroupUserInfoCard
  >(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [emptyHistoryString, setEmptyHistoryString] = useState<string>(
    Localizer.Profile.ThisUserHasNotMadeAny
  );
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);
  const profileLoc = Localizer.profile;

  const applySeparator = (value: string | number) => {
    return LocalizerUtils.useThousandsSeparatorByLocale(
      value,
      Localizer.CurrentCultureName,
      globalStateData
    );
  };

  const loadHistory = (membership: MembershipPair) => {
    setLoading(true);

    // important: you have to pass a destiny specific membership in here
    Platform.TokensService.EververseVendorPurchaseHistory(
      membership.membershipId,
      membership.membershipType,
      0
    )
      .then((res) => {
        if (res?.results?.length > 0) {
          setHistory(
            res.results.map((x, i) => {
              const bungieNameObject = useQueryMid
                ? UserUtils.getBungieNameFromUserInfoCard(selectedMembership)
                : UserUtils.getBungieNameFromBnetGeneralUser(
                    globalStateData?.loggedInUser?.user
                  );

              return {
                rowKey: i,
                order: x.EventId,
                date: x.Timestamp,
                productName: x.PurchasedItemDisplayName,
                quantity: x.PurchasedItemQuantity.toString(),
                prices: x.PaidCosts,
                status: x.EventClassification,
                membership: selectedMembership,
                bungieName: `${bungieNameObject.bungieGlobalName}${bungieNameObject.bungieGlobalCodeWithHashtag}`,
                productDesc:
                  x.PurchasedItemDisplayDescription ??
                  profileLoc.UnknownItemDescription,
              } as IEververseRecord;
            })
          );
        } else {
          setHistory(null);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((err) => Modal.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    AccountDestinyMembershipDataStore.actions.loadUserData(
      {
        membershipId: useQueryMid
          ? membershipIdFromQuery
          : globalStateData?.loggedInUser?.user?.membershipId,
        membershipType: BungieMembershipType.BungieNext,
      },
      true,
      true
    );
  }, []);

  useEffect(() => {
    if (destinyMember.loaded && selectedMembership) {
      loadHistory({
        membershipType: selectedMembership?.membershipType,
        membershipId: selectedMembership?.membershipId,
      });
      const noDestinyAccount =
        !selectedMembership ||
        selectedMembership?.membershipType ===
          BungieMembershipType.BungieNext ||
        selectedMembership.membershipType === BungieMembershipType.All;

      if (noDestinyAccount) {
        setEmptyHistoryString(Localizer.Profile.GoPlayDestiny);
      }
    }
  }, [selectedMembership, destinyMember.loaded]);

  useEffect(() => {
    setSelectedMembership(destinyMember?.memberships?.[0]);
  }, [destinyMember?.memberships]);

  return (
    <>
      <GridCol cols={12}>
        <h3>{Localizer.account.EververseHistory}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        {destinyMember?.isCrossSaved && (
          <CrossSaveActiveBadge className={styles.crosssave} />
        )}
      </GridCol>
      <GridCol cols={12}>
        {destinyMember?.memberships?.map((mem, i) => {
          // For cross save - only show one platform as clickable
          // Show the others as disabled
          // Use cross save icon and also a string that says while cross save is active your silver is active on the primary account.
          return (
            <Button
              key={i}
              buttonType={
                EnumUtils.looseEquals(
                  mem.membershipType,
                  selectedMembership?.membershipType,
                  BungieMembershipType
                )
                  ? "white"
                  : "clear"
              }
              onClick={() => {
                setSelectedMembership(mem);
              }}
              className={styles.platform}
            >
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${mem.iconPath})`,
                }}
              />
              {LocalizerUtils.getPlatformNameFromMembershipType(
                mem.membershipType
              )}
            </Button>
          );
        })}
        <Table
          loading={loading}
          dataSource={history}
          className={styles.table}
          bordered={false}
          pagination={false}
          size={"small"}
          locale={{ emptyText: emptyHistoryString }}
          rowKey={(record) => record?.date}
          onRow={(data) => {
            return {
              onClick: (e) => {
                Modal.open(
                  <EverversePurchaseModal
                    {...data}
                    applySeparator={applySeparator}
                  />
                );
              },
            };
          }}
        >
          <Column
            title={<div className={styles.th}>{profileLoc.OrderNumber}</div>}
            dataIndex={"order"}
            key={"order"}
            fixed={"left"}
          />
          <Column
            title={<div className={styles.th}>{profileLoc.Date}</div>}
            dataIndex={"date"}
            key={"date"}
            fixed={"left"}
            render={(value, record, i) => {
              return <div key={i}>{formatDateForAccountTable(value)}</div>;
            }}
          />
          <Column
            title={<div className={styles.th}>{profileLoc.ProductName}</div>}
            dataIndex={"productName"}
            key={"productName"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.th}>
                {profileLoc.ProductPurchaseQuantity}
              </div>
            }
            dataIndex={"quantity"}
            key={"quantity"}
            fixed={"left"}
            render={(value, record: IEververseRecord) => {
              if (
                record?.status ===
                EververseVendorPurchaseEventClassification.Refund
              ) {
                return (
                  <>
                    <p>{applySeparator(value)}</p>
                    <b>{profileLoc.StatusRefund}</b>
                  </>
                );
              } else {
                return <p>{applySeparator(value)}</p>;
              }
            }}
          />
          <Column
            title={
              <div className={styles.th}>{profileLoc.InGameCurrencyPrice}</div>
            }
            dataIndex={"prices"}
            key={"prices"}
            fixed={"right"}
            render={(value, record: IEververseRecord) => {
              return (
                <div>
                  {record?.prices?.length > 1 && (
                    <p className={styles.prices}>
                      {profileLoc.MultiplePaidCostsLabel}
                    </p>
                  )}
                  <p className={styles.prices}>
                    {record.prices.map(
                      (pc: Tokens.EververseVendorPaidCostPair, i: number) => {
                        return record.status ===
                          EververseVendorPurchaseEventClassification.Refund ? (
                          <span key={i}>
                            <b key={i}>{`${applySeparator(pc?.Quantity)} ${
                              pc?.ItemDisplayName
                            }`}</b>
                          </span>
                        ) : (
                          <span key={i}>{`${applySeparator(pc?.Quantity)} ${
                            pc?.ItemDisplayName
                          }`}</span>
                        );
                      }
                    )}
                  </p>
                </div>
              );
            }}
          />
        </Table>
      </GridCol>
    </>
  );
};
