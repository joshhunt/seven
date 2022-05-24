// Created by larobinson, 2021
// Copyright Bungie, Inc.

import {
  formatDateForAccountTable,
  ViewerPermissionContext,
} from "@Areas/User/Account";
import accountStyles from "@Areas/User/Account.module.scss";
import { EverversePurchaseModal } from "@Areas/User/AccountComponents/Internal/EverversePurchaseModal";
import { PermissionsGate } from "@UI/User/PermissionGate";
import ConfirmationModal from "@UIKit/Controls/Modal/ConfirmationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { DateTime } from "luxon";
import styles from "./EververseHistory.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  AclEnum,
  BungieMembershipType,
  EververseChangeEventClassification,
  EververseVendorPurchaseEventClassification,
} from "@Enum";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform, Tokens } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import Table from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";

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
  platform: BungieMembershipType;
}

interface EververseHistoryProps {}

export const EververseHistory: React.FC<EververseHistoryProps> = (props) => {
  const { Column } = Table;

  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const [selectedPlatform, setSelectedPlatform] = useState<
    BungieMembershipType
  >(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);
  const mId = useQueryMid
    ? membershipIdFromQuery
    : globalStateData?.loggedInUser?.user?.membershipId;

  const showNoDestinyAccount = () => {
    ConfirmationModal.show({
      children: (
        <div>
          <h3 className={styles.errorTitle}>
            {Localizer.Profile.Error.toUpperCase()}
          </h3>
          <div className={styles.errorContent}>
            {Localizer.Profile.ThisUserDoesNotHaveADestiny}
          </div>
        </div>
      ),
      type: "warning",
      cancelButtonProps: {
        disable: true,
      },
      confirmButtonProps: {
        labelOverride: Localizer.Coderedemption.ErrorAcknowledge,
      },
    });
  };

  useEffect(() => {
    AccountDestinyMembershipDataStore.actions.loadUserData({
      membershipType: BungieMembershipType.BungieNext,
      membershipId: mId,
    });
  }, [UserUtils.isAuthenticated(globalStateData)]);

  useEffect(() => {
    if (destinyMember.loaded) {
      if (destinyMember?.membershipData?.destinyMemberships?.length === 0) {
        showNoDestinyAccount();
      } else {
        const matchingMembership =
          destinyMember?.memberships?.find((m) =>
            EnumUtils.looseEquals(
              m.membershipType,
              selectedPlatform,
              BungieMembershipType
            )
          ) ?? destinyMember?.memberships?.[0];

        if (!matchingMembership) {
          showNoDestinyAccount();
        } else {
          setSelectedPlatform(matchingMembership?.membershipType);
          loadHistory({
            membershipType: matchingMembership?.membershipType,
            membershipId: matchingMembership?.membershipId,
          });
        }
      }
    }
  }, [destinyMember?.loaded]);

  const loadHistory = async (membership: MembershipPair) => {
    let response = null;
    setLoading(true);

    try {
      // important: you have to pass a destiny specific membership in here
      response = await Platform.TokensService.EververseVendorPurchaseHistory(
        membership.membershipId,
        membership.membershipType,
        0
      );

      if (response?.results) {
        setHistory(
          response.results.map((x, i) => {
            const bungieNameObject = useQueryMid
              ? UserUtils.getBungieNameFromUserInfoCard(
                  destinyMember?.selectedMembership
                )
              : UserUtils.getBungieNameFromBnetGeneralUser(
                  globalStateData?.loggedInUser?.user
                );

            return {
              rowKey: i,
              order: x.EventId,
              date: x.Timestamp,
              productName:
                x.PaidCosts?.[0]?.ItemDisplayName ??
                Localizer.Profile.UnknownItemName,
              quantity: x.PurchasedItemQuantity.toString(),
              prices: x.PaidCosts,
              status: x.EventClassification,
              platform: selectedPlatform,
              bungieName: `${bungieNameObject.bungieGlobalName}${bungieNameObject.bungieGlobalCodeWithHashtag}`,
              productDesc:
                x?.PaidCosts?.[0]?.ItemDisplayDescription ??
                Localizer.Profile.UnknownItemDescription,
            } as IEververseRecord;
          })
        );
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <PermissionsGate
      permissions={[AclEnum.BNextPrivateUserDataReader]}
      unlockOverride={isSelf}
    >
      <GridCol cols={12}>
        <h3>{Localizer.account.EververseHistory}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
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
                  selectedPlatform,
                  BungieMembershipType
                )
                  ? "white"
                  : "clear"
              }
              onClick={() => {
                if (
                  !EnumUtils.looseEquals(
                    mem.membershipType,
                    selectedPlatform,
                    BungieMembershipType
                  )
                ) {
                  loadHistory({
                    membershipType: mem.membershipType,
                    membershipId: mem.membershipId,
                  });
                  setSelectedPlatform(mem.membershipType);
                }
              }}
              className={styles.platform}
            >
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${mem.iconPath})` }}
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
          locale={{ emptyText: Localizer.Profile.ThisUserHasNotMadeAny }}
          rowKey={(record) => record?.date}
          onRow={(data) => {
            return {
              onClick: (e) => {
                Modal.open(<EverversePurchaseModal {...data} />);
              },
            };
          }}
        >
          <Column
            title={
              <div className={styles.th}>{Localizer.Profile.OrderNumber}</div>
            }
            dataIndex={"order"}
            key={"order"}
            fixed={"left"}
          />
          <Column
            title={<div className={styles.th}>{Localizer.Profile.Date}</div>}
            dataIndex={"date"}
            key={"date"}
            fixed={"left"}
            render={(value, record, i) => {
              return <div key={i}>{formatDateForAccountTable(value)}</div>;
            }}
          />
          <Column
            title={
              <div className={styles.th}>{Localizer.Profile.ProductName}</div>
            }
            dataIndex={"productName"}
            key={"productName"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.th}>
                {Localizer.Profile.ProductPurchaseQuantity}
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
                    <p>{value}</p>
                    <b>{Localizer.Profile.StatusRefund}</b>
                  </>
                );
              } else {
                return <p>{value}</p>;
              }
            }}
          />
          <Column
            title={
              <div className={styles.th}>
                {Localizer.Profile.InGameCurrencyPrice}
              </div>
            }
            dataIndex={"prices"}
            key={"prices"}
            fixed={"right"}
            render={(value, record: IEververseRecord) => {
              return (
                <div>
                  {record?.prices?.length > 1 && (
                    <p className={styles.prices}>
                      {Localizer.Profile.MultiplePaidCostsLabel}
                    </p>
                  )}
                  <p className={styles.prices}>
                    {record.prices.map(
                      (pc: Tokens.EververseVendorPaidCostPair, i: number) => {
                        return record.status ===
                          EververseVendorPurchaseEventClassification.Refund ? (
                          <span key={i}>
                            <b
                              key={i}
                            >{`${pc?.Quantity} ${pc?.ItemDisplayName}`}</b>
                          </span>
                        ) : (
                          <span
                            key={i}
                          >{`${pc?.Quantity} ${pc?.ItemDisplayName}`}</span>
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
    </PermissionsGate>
  );
};
