// Created by larobinson, 2021
// Copyright Bungie, Inc.

import {
  formatDateForAccountTable,
  ViewerPermissionContext,
} from "@Areas/User/Account";
import accountStyles from "@Areas/User/Account.module.scss";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { SilverChangeModal } from "@Areas/User/AccountComponents/Internal/SilverChangeModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  AclEnum,
  BungieMembershipType,
  EververseChangeEventClassification,
} from "@Enum";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Logger } from "@Global/Logger";
import { Img } from "@Helpers";
import { Platform, Tokens } from "@Platform";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import Table from "antd/lib/table";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import styles from "./EververseHistory.module.scss";

export interface ISilverRecord {
  rowKey: number;
  order: string;
  date: string;
  status: EververseChangeEventClassification;
  name: string;
  previousQuantity: number;
  change: number;
  newQuantity: number;
  platform: BungieMembershipType;
  bungieName: string;
  productDescription: string;
}

interface SilverBalanceHistoryProps {}

export const SilverBalanceHistory: React.FC<SilverBalanceHistoryProps> = (
  props
) => {
  const { Column } = Table;
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [silverBalance, setSilverBalance] = useState<
    Tokens.EververseSilverBalanceResponse
  >();
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);
  const mId = useQueryMid
    ? membershipIdFromQuery
    : globalStateData?.loggedInUser?.user?.membershipId;
  const [history, setHistory] = useState<ISilverRecord[]>(null);
  // Maintaining state of membership data in component instead of through datastore because the new membership info has to be ready so quickly
  const [membershipPair, setMembershipPair] = useState<MembershipPair>({
    membershipId: mId,
    membershipType: BungieMembershipType.BungieNext,
  });
  const [cashout, setCashout] = useState(null);

  const getLinkToSilver = (mType: BungieMembershipType) => {
    switch (mType) {
      case BungieMembershipType.TigerPsn:
        return Localizer.Profile.PlaystationSilver;
      case BungieMembershipType.TigerSteam:
        return Localizer.Profile.SteamSilver;
      case BungieMembershipType.TigerXbox:
        return Localizer.Profile.MicrosoftSilver;
      case BungieMembershipType.TigerStadia:
        return Localizer.Profile.StadiaSilver;
      default:
        return "";
    }
  };

  const getSilverBalance = async () => {
    try {
      const silver = await Platform.TokensService.EververseSilverBalance(
        membershipPair?.membershipId,
        membershipPair?.membershipType
      );
      setSilverBalance(silver);
    } catch (e) {
      Modal.open(e.message);
    }
  };

  const getEververseCashout = async () => {
    try {
      const platformCashout = await Platform.TokensService.EververseCashoutInfo(
        destinyMember?.selectedMembership?.membershipId,
        destinyMember?.selectedMembership?.membershipType
      );
      setCashout(platformCashout);
    } catch (e) {
      Modal.open(e.message);
    }
  };

  const loadHistory = async (aggregate = false) => {
    let response = null;
    setLoading(true);

    try {
      await getSilverBalance();
      response = await Platform.TokensService.EververseChangePurchaseHistory(
        membershipPair?.membershipId,
        membershipPair?.membershipType,
        currentPage
      );

      if (response) {
        setHasMore(response?.hasMore);
        const bungieNameObject = useQueryMid
          ? UserUtils.getBungieNameFromUserInfoCard(
              destinyMember?.selectedMembership
            )
          : UserUtils.getBungieNameFromBnetGeneralUser(
              globalStateData?.loggedInUser?.user
            );

        const resultsData: ISilverRecord[] = response?.results.map(
          (x: Tokens.EververseChangeEvent, i) => {
            return {
              rowKey: i,
              order: x.EventId,
              date: x.Timestamp,
              status: x.EventClassification,
              name: x.ItemDisplayName ?? Localizer.Profile.UnknownItemName,
              previousQuantity: x.PreviousQuantity,
              change: x.NewQuantity - x.PreviousQuantity,
              newQuantity: x.NewQuantity,
              platform: destinyMember?.selectedMembership?.membershipType,
              bungieName: `${bungieNameObject.bungieGlobalName}${bungieNameObject.bungieGlobalCodeWithHashtag}`,
              productDescription:
                x.ItemDisplayDescription ??
                Localizer.Profile.UnknownItemDescription,
            };
          }
        );

        aggregate
          ? setHistory(history.concat(resultsData))
          : setHistory(resultsData);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    getEververseCashout();
  }, []);

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalStateData)) {
      if (
        destinyMember.loaded &&
        membershipPair?.membershipType &&
        membershipPair?.membershipType !== BungieMembershipType.BungieNext
      ) {
        loadHistory();
      } else {
        AccountDestinyMembershipDataStore?.actions
          .loadUserData({
            membershipType: BungieMembershipType.BungieNext,
            membershipId: mId,
          })
          .async.then(() => {
            setMembershipPair({
              membershipType: destinyMember?.memberships?.[0]?.membershipType,
              membershipId: destinyMember?.memberships?.[0]?.membershipId,
            });
          });
      }
    }
  }, [
    destinyMember.loaded,
    membershipPair,
    UserUtils.isAuthenticated(globalStateData),
  ]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
    loadHistory(true);
  };

  return (
    <PermissionsGate
      permissions={[AclEnum.BNextPrivateUserDataReader]}
      unlockOverride={isSelf}
    >
      <GridCol cols={12}>
        <h3>{Localizer.account.SilverBalanceHistory}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12} className={styles.platformSilver}>
        <div>
          {destinyMember?.memberships?.map((mem, i) => {
            return (
              <Button
                key={i}
                buttonType={
                  EnumUtils.looseEquals(
                    mem.membershipType,
                    membershipPair?.membershipType,
                    BungieMembershipType
                  )
                    ? "white"
                    : "clear"
                }
                onClick={() => {
                  setCurrentPage(0);
                  AccountDestinyMembershipDataStore.actions
                    .loadUserData({
                      membershipType: mem.membershipType,
                      membershipId: mem.membershipId,
                    })
                    .async.then(() => {
                      setMembershipPair({
                        membershipType: mem.membershipType,
                        membershipId: mem.membershipId,
                      });
                    });
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
        </div>
        {/* Cross saved accounts will only show the balance of silver that is accessible through the account that is marked primary */}
        <div className={styles.silverBuy}>
          <div className={styles.currentQuantity}>
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${Img(
                  "/destiny/icons/pcmigration/silver.png"
                )})`,
              }}
            />
            <div>{silverBalance?.SilverBalance}</div>
          </div>
          <Button
            size={BasicSize.Small}
            buttonType={"gold"}
            url={getLinkToSilver(membershipPair?.membershipType)}
          >
            {Localizer.Profile.BuySilver}
          </Button>
        </div>
        {cashout && (
          <div className={styles.cashoutRequests}>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>
                {Localizer.Profile.BungieGrantedSilver}
              </span>
              <span className={styles.value}>
                {cashout.BungieGrantedSilver}
              </span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>
                {Localizer.Profile.PlatformGrantedSilver}
              </span>
              <span className={styles.value}>
                {cashout.PlatformGrantedSilver}
              </span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>
                {Localizer.Profile.SilverSpent}
              </span>
              <span className={styles.value}>{cashout.TotalSilverSpent}</span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>{Localizer.Profile.Cashout}</span>
              <span className={styles.value}>{cashout.CashoutQuantity}</span>
            </div>
          </div>
        )}
      </GridCol>
      <GridCol cols={12}>
        <Table
          loading={loading}
          dataSource={history}
          bordered={false}
          className={styles.table}
          pagination={false}
          size={"small"}
          locale={{ emptyText: Localizer.Profile.ThisUserHasNotMadeAny }}
          onRow={(data) => {
            return {
              onClick: (e) => {
                Modal.open(<SilverChangeModal {...data} />);
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
              <div className={styles.th}>{Localizer.Profile.ChangeType}</div>
            }
            dataIndex={"status"}
            key={"status"}
            fixed={"left"}
            render={(value, record, index) => (
              <div>
                {
                  Localizer.Profile[
                    "ChangeType" +
                      EnumUtils.getStringValue(
                        value,
                        EververseChangeEventClassification
                      )
                  ]
                }
              </div>
            )}
          />
          <Column
            title={
              <div className={styles.th}>{Localizer.Profile.ProductName}</div>
            }
            dataIndex={"name"}
            key={"name"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.th}>
                {Localizer.Profile.PreviousQuantity}
              </div>
            }
            dataIndex={"previousQuantity"}
            key={"previousQuantity"}
            fixed={"left"}
          />
          <Column
            title={<div className={styles.th}>{Localizer.Profile.Change}</div>}
            dataIndex={"change"}
            key={"change"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.th}>{Localizer.Profile.NewQuantity}</div>
            }
            dataIndex={"newQuantity"}
            key={"newQuantity"}
            fixed={"left"}
          />
        </Table>

        {hasMore && (
          <Button onClick={loadMore}>{Localizer.Profile.LoadMore}</Button>
        )}
      </GridCol>
    </PermissionsGate>
  );
};
