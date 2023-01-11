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
import { SilverChangeModal } from "@Areas/User/AccountComponents/Internal/SilverChangeModal";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import {
  BungieMembershipType,
  EververseChangeEventClassification,
} from "@Enum";
import { MembershipPair } from "@Global/DataStore/DestinyMembershipDataStore";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Img } from "@Helpers";
import { GroupsV2, Platform, Tokens } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { EnumUtils } from "@Utilities/EnumUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import { UserUtils } from "@Utilities/UserUtils";
import Table from "antd/lib/table";
import React, { useContext, useEffect, useState } from "react";
import styles from "./EververseHistory.module.scss";

export interface ISilverRecord {
  rowKey: number;
  order: string;
  date: string;
  status: EververseChangeEventClassification;
  name: string;
  previousQuantity: string;
  change: string;
  newQuantity: string;
  membership: GroupsV2.GroupUserInfoCard;
  bungieName: string;
  productDescription: string;
}

export const SilverBalanceHistory = () => {
  const { Column } = Table;
  const destinyMember = useDataStore(AccountDestinyMembershipDataStore);
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [silverBalance, setSilverBalance] = useState<
    Tokens.EververseSilverBalanceResponse
  >();
  const [selectedMembership, setSelectedMembership] = useState<
    GroupsV2.GroupUserInfoCard
  >(null);
  const { membershipIdFromQuery, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const useQueryMid = membershipIdFromQuery && (isSelf || isAdmin);
  const [history, setHistory] = useState<ISilverRecord[]>(null);
  const [cashout, setCashout] = useState(null);
  const [emptyHistoryString, setEmptyHistoryString] = useState<string>(
    Localizer.Profile.ThisUserHasNotMadeAny
  );
  const profileLoc = Localizer.profile;

  const applySeparator = (value: string | number) => {
    return LocalizerUtils.useThousandsSeparatorByLocale(
      value,
      Localizer.CurrentCultureName,
      globalStateData
    );
  };

  const getLinkToSilver = (mType: BungieMembershipType) => {
    switch (mType) {
      case BungieMembershipType.TigerPsn:
        return profileLoc.PlaystationSilver;
      case BungieMembershipType.TigerSteam:
        return profileLoc.SteamSilver;
      case BungieMembershipType.TigerXbox:
        return profileLoc.MicrosoftSilver;
      case BungieMembershipType.TigerStadia:
        return profileLoc.StadiaSilver;
      //Needs to be updated once we have the silver link for EGS
      case BungieMembershipType.TigerEgs:
        return profileLoc.EgsSilver;
      default:
        return "";
    }
  };

  const getSilverBalance = (membership: MembershipPair) => {
    Platform.TokensService.EververseSilverBalance(
      membership?.membershipId,
      membership?.membershipType
    )
      .then((silver) => {
        if (silver) {
          setSilverBalance(silver);
          // This next request never succeeds, I believe it was only needed for Battle.net
          // getEververseCashout({
          // 	membershipType: membership?.membershipType,
          // 	membershipId: membership?.membershipId
          // })
        }
      })
      .catch
      // If this fails, we already show the default "undefined" state for silver. We catch other errors that would come from this elsewhere.
      ();
  };

  const loadHistory = (membership: MembershipPair, aggregate = false) => {
    setLoading(true);

    Platform.TokensService.EververseChangePurchaseHistory(
      membership.membershipId,
      membership.membershipType,
      currentPage
    )
      .then((response) => {
        if (response?.results?.length > 0) {
          setHasMore(response?.hasMore);
          const bungieNameObject = useQueryMid
            ? UserUtils.getBungieNameFromUserInfoCard(selectedMembership)
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
                name: x.ItemDisplayName ?? profileLoc.UnknownItemName,
                previousQuantity: applySeparator(x.PreviousQuantity),
                change: applySeparator(x.NewQuantity - x.PreviousQuantity),
                newQuantity: applySeparator(x.NewQuantity),
                membership: selectedMembership,
                bungieName: `${bungieNameObject.bungieGlobalName}${bungieNameObject.bungieGlobalCodeWithHashtag}`,
                productDescription:
                  x.ItemDisplayDescription ?? profileLoc.UnknownItemDescription,
              };
            }
          );

          aggregate
            ? setHistory(history.concat(resultsData))
            : setHistory(resultsData);

          getSilverBalance({
            membershipType: membership?.membershipType,
            membershipId: membership?.membershipId,
          });
        } else {
          setHistory(null);
          setSilverBalance(null);
        }
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e))
      .finally(() => setLoading(false));
  };

  // const getEververseCashout = async (membership: MembershipPair) => {
  // 	Platform.TokensService.EververseCashoutInfo(membership?.membershipId, membership?.membershipType)
  // 		.then((platformCashout => setCashout(platformCashout)))
  // 		.catch(ConvertToPlatformError)
  // 		.catch(e => Modal.error(e));
  // }

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
    loadHistory(
      {
        membershipType: selectedMembership?.membershipType,
        membershipId: selectedMembership?.membershipId,
      },
      true
    );
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
        setHistory([]);
      }
    }
  }, [selectedMembership, destinyMember.loaded]);

  useEffect(() => {
    setSelectedMembership(destinyMember?.memberships?.[0]);
  }, [destinyMember?.memberships]);

  return (
    <>
      <GridCol cols={12}>
        <h3>{Localizer.account.SilverBalanceHistory}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        {destinyMember?.isCrossSaved && (
          <CrossSaveActiveBadge className={styles.crosssave} />
        )}
      </GridCol>
      <GridCol cols={12} className={styles.platformSilver}>
        <div>
          {destinyMember?.memberships?.map((mem, i) => {
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
                  setCurrentPage(0);
                  setSelectedMembership(mem);
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
            <div>
              {applySeparator(silverBalance?.SilverBalance) ||
                profileLoc.Unavailable}
            </div>
          </div>
          {selectedMembership &&
            selectedMembership?.membershipType !==
              BungieMembershipType.TigerStadia && (
              <Button
                size={BasicSize.Small}
                buttonType={"gold"}
                url={getLinkToSilver(selectedMembership?.membershipType)}
              >
                {profileLoc.BuySilver}
              </Button>
            )}
        </div>
        {cashout && (
          <div className={styles.cashoutRequests}>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>
                {profileLoc.BungieGrantedSilver}
              </span>
              <span className={styles.value}>
                {applySeparator(cashout.BungieGrantedSilver)}
              </span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>
                {profileLoc.PlatformGrantedSilver}
              </span>
              <span className={styles.value}>
                {applySeparator(cashout.PlatformGrantedSilver)}
              </span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>{profileLoc.SilverSpent}</span>
              <span className={styles.value}>
                {applySeparator(cashout.TotalSilverSpent)}
              </span>
            </div>
            <div className={styles.cashoutItem}>
              <span className={styles.title}>{profileLoc.Cashout}</span>
              <span className={styles.value}>
                {applySeparator(cashout.CashoutQuantity)}
              </span>
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
          locale={{ emptyText: emptyHistoryString }}
          onRow={(data) => {
            return {
              onClick: (e) => {
                Modal.open(
                  <SilverChangeModal
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
            title={<div className={styles.th}>{profileLoc.ChangeType}</div>}
            dataIndex={"status"}
            key={"status"}
            fixed={"left"}
            render={(value, record, index) => (
              <div>
                {
                  profileLoc[
                    "ChangeType" +
                      EnumUtils.getStringValue(
                        applySeparator(value),
                        EververseChangeEventClassification
                      )
                  ]
                }
              </div>
            )}
          />
          <Column
            title={<div className={styles.th}>{profileLoc.ProductName}</div>}
            dataIndex={"name"}
            key={"name"}
            fixed={"left"}
          />
          <Column
            title={
              <div className={styles.th}>{profileLoc.PreviousQuantity}</div>
            }
            dataIndex={"previousQuantity"}
            key={"previousQuantity"}
            fixed={"left"}
          />
          <Column
            title={<div className={styles.th}>{profileLoc.Change}</div>}
            dataIndex={"change"}
            key={"change"}
            fixed={"left"}
          />
          <Column
            title={<div className={styles.th}>{profileLoc.NewQuantity}</div>}
            dataIndex={"newQuantity"}
            key={"newQuantity"}
            fixed={"left"}
          />
        </Table>

        {hasMore && <Button onClick={loadMore}>{profileLoc.LoadMore}</Button>}
      </GridCol>
    </>
  );
};
