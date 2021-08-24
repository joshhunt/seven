// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkSection } from "@Areas/User/AccountComponents/Internal/AccountLinkSection";
import { AuthorizedApplications } from "@Areas/User/AccountComponents/Internal/AuthorizedApplications";
import { CrossSaveBannerAccountLinking } from "@Areas/User/AccountComponents/Internal/CrossSaveBannerAccountLinking";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { AclEnum, BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import styles from "./AccountLinking.module.scss";

interface AccountLinkingProps {}

export const AccountLinking: React.FC<AccountLinkingProps> = (props) => {
  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);
  const [membershipId, setMembershipId] = useState(
    UrlUtils.QueryToObject().membershipId
  );
  const loggedInUserMembershipId = UserUtils.loggedInUserMembershipId(
    globalStateData
  );

  const loggedInUserIsOnPageUser = (mid: string) => {
    if (!loggedInUserMembershipId) {
      return;
    }
    if (!mid || mid === "") {
      return true;
    }

    return !!(
      mid === loggedInUserMembershipId ||
      destinyMembershipData?.membershipData?.destinyMemberships.find(
        (m) => m.membershipId === loggedInUserMembershipId
      )
    );
  };

  const disableAllCompanionSessions = () => {
    Platform.UserService.CloseAllCompanionSessions()
      .then((data) => {
        data && Modal.open(Localizer.Userpages.disablecompanionsessionssuccess);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  useEffect(() => {
    setMembershipId(UrlUtils.QueryToObject().membershipId);
    AccountDestinyMembershipDataStore.actions.loadUserData({
      membershipId,
      membershipType: BungieMembershipType.BungieNext,
    });
  }, []);

  const isSelf = loggedInUserIsOnPageUser(membershipId);
  const isAdmin = globalStateData?.loggedInUser?.userAcls.includes(
    AclEnum.BNextPrivateUserDataReader
  );

  return isSelf || (isAdmin && membershipId) ? (
    <GridCol cols={12} className={styles.container}>
      <SystemDisabledHandler systems={["Destiny2"]}>
        <CrossSaveBannerAccountLinking
          isCrossSaved={destinyMembershipData?.isCrossSaved}
        />
        <GridCol cols={12}>
          <h3>{Localizer.account.accountLinking}</h3>
        </GridCol>
        <GridDivider cols={12} />
        <GridCol cols={2} medium={12} className={styles.sectionTitle}>
          {Localizer.Accountlinking.LinkedPlatforms}
        </GridCol>
        <AccountLinkSection />
        <GridDivider cols={12} />
        <GridCol cols={2} medium={12} className={styles.sectionTitle}>
          {Localizer.Accountlinking.MobileCompanion}
        </GridCol>
        <GridCol cols={7} medium={12} className={styles.margin}>
          <div className={styles.mobileItem}>
            <IconCoin
              icon={{
                iconName: "phone_iphone",
                iconType: "material",
                style: { fontSize: "3rem" },
              }}
            />
            <div>
              <div>{Localizer.AccountLinking.DisableMobileSession}</div>
              <div
                className={styles.mobileLabel}
                dangerouslySetInnerHTML={sanitizeHTML(
                  Localizer.AccountLinking.DidYouLoseYourPhone
                )}
              />
            </div>
          </div>
          <Button buttonType={"red"} onClick={disableAllCompanionSessions}>
            {Localizer.Accountlinking.DisableAllMobileCompanion}
          </Button>
        </GridCol>
        <AuthorizedApplications membershipId={membershipId} />
      </SystemDisabledHandler>
    </GridCol>
  ) : null;
};
