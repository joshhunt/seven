// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { AccountLinkSection } from "@Areas/User/AccountComponents/Internal/AccountLinking/AccountLinkSection";
import { AuthorizedApplications } from "@Areas/User/AccountComponents/Internal/AuthorizedApplications";
import { CrossSaveBannerAccountLinking } from "@Areas/User/AccountComponents/Internal/CrossSaveBannerAccountLinking";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { BungieMembershipType } from "@Enum";
import { Platform } from "@Platform";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { IconCoin } from "@UIKit/Companion/Coins/IconCoin";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UI/UIKit/UIKitUtils";
import React, { useContext, useEffect } from "react";
import { ViewerPermissionContext } from "../Account";
import accountStyles from "../Account.module.scss";
import styles from "./AccountLinking.module.scss";
import { ConfigUtils } from "@Utilities/ConfigUtils";

interface AccountLinkingProps {}

export const AccountLinking: React.FC<AccountLinkingProps> = (props) => {
  const destinyMembershipData = useDataStore(AccountDestinyMembershipDataStore);
  const { membershipIdFromQuery, loggedInUserId, isSelf, isAdmin } = useContext(
    ViewerPermissionContext
  );
  const membershipId =
    membershipIdFromQuery && isAdmin ? membershipIdFromQuery : loggedInUserId;

  const disableAllCompanionSessions = () => {
    Platform.UserService.CloseAllCompanionSessions()
      .then((data) => {
        data && Modal.open(Localizer.Userpages.disablecompanionsessionssuccess);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  useEffect(() => {
    AccountDestinyMembershipDataStore.actions.loadUserData({
      membershipId,
      membershipType: BungieMembershipType.BungieNext,
    });
  }, []);

  if (!isSelf && !(isAdmin && membershipIdFromQuery)) {
    return null;
  }

  return (
    <div>
      <SystemDisabledHandler systems={["Destiny2"]}>
        <GridCol cols={12}>
          <CrossSaveBannerAccountLinking
            isCrossSaved={destinyMembershipData?.isCrossSaved}
          />
        </GridCol>
        {!ConfigUtils.SystemStatus("FeatureAccountLinkingUpdate") ? (
          <>
            <GridCol cols={12}>
              <h3>{Localizer.account.accountLinking}</h3>
            </GridCol>
            <GridDivider cols={12} className={accountStyles.mainDivider} />
            <GridCol cols={2} medium={12} className={styles.sectionTitle}>
              {Localizer.Accountlinking.LinkedPlatforms}
            </GridCol>
            <AccountLinkSection />
          </>
        ) : (
          <>
            <GridCol cols={12}>
              <h3>{Localizer.Accountlinking.GamePlatforms}</h3>
            </GridCol>
            <GridDivider cols={12} className={accountStyles.sectionDivider} />
            <GridCol cols={12}>
              <p
                className={accountStyles.sectionSubheader}
                dangerouslySetInnerHTML={sanitizeHTML(
                  Localizer.Accountlinking.GamePlatformsCannotUnlink
                )}
              />
            </GridCol>
            <AccountLinkSection type={"gamePlatform"} />
            <GridCol cols={12}>
              <h3>{Localizer.Accountlinking.SocialPlatforms}</h3>
            </GridCol>
            <GridDivider cols={12} className={accountStyles.sectionDivider} />
            <GridCol cols={12}>
              <p className={accountStyles.sectionSubheader}>
                {Localizer.Accountlinking.SocialNetworksAndPlatforms}
              </p>
            </GridCol>
            <AccountLinkSection type={"socialPlatform"} />
          </>
        )}
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
              <Button
                buttonType={"red"}
                size={BasicSize.Small}
                onClick={disableAllCompanionSessions}
              >
                {Localizer.Accountlinking.DisableAllMobileCompanion}
              </Button>
            </div>
          </div>
        </GridCol>
        <AuthorizedApplications membershipId={membershipId} />
      </SystemDisabledHandler>
    </div>
  );
};
