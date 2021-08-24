// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { AccountLinking } from "@Areas/User/AccountComponents/AccountLinking";
import { AppHistory } from "@Areas/User/AccountComponents/AppHistory";
import { BlockedUsers } from "@Areas/User/AccountComponents/BlockedUsers";
import { BungieFriends } from "@Areas/User/AccountComponents/BungieFriends";
import { CrossSave } from "@Areas/User/AccountComponents/CrossSave";
import { AccountDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/AccountDestinyMembershipDataStore";
import { EmailAndSms } from "@Areas/User/AccountComponents/EmailAndSms";
import { IdentitySettings } from "@Areas/User/AccountComponents/IdentitySettings";
import { ImportMutedUsersBanner } from "@Areas/User/AccountComponents/Internal/BungieFriends/ImportMutedUsersBanner";
import { LanguageAndRegion } from "@Areas/User/AccountComponents/LanguageAndRegion";
import { Notifications } from "@Areas/User/AccountComponents/Notifications";
import { Privacy } from "@Areas/User/AccountComponents/Privacy";
import { SilverBalanceHistory } from "@Areas/User/AccountComponents/SilverBalanceHistory";
import { Responsive, ResponsiveContext } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Localizer } from "@bungie/localization";
import { AclEnum, BungieMembershipType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteDefs } from "@Routes/RouteDefs";
import { RouteHelper } from "@Routes/RouteHelper";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import TabSystem, { TabData } from "@UIKit/Layout/TabSystem";
import { StringCompareOptions, StringUtils } from "@Utilities/StringUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Redirect } from "react-router-dom";
import styles from "./Account.module.scss";

export const ViewerPermissionContext = React.createContext<
  ViewerPermissionData
>({
  membershipIdFromQuery: null,
  loggedInUserId: null,
  isSelf: false,
  isAdmin: false,
});

interface ViewerPermissionData {
  membershipIdFromQuery: string;
  loggedInUserId: string;
  isSelf: boolean;
  isAdmin: boolean;
}

/**
 * Account - Tab system and content for User Account Center
 *  *
 * @param {IdentitySettingsProps} props
 * @returns
 */
const Account: React.FC = () => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedinuser",
    "responsive",
  ]);
  const destinyMembership = useDataStore(AccountDestinyMembershipDataStore);
  const responsive = useDataStore(Responsive);

  const area = RouteDefs.AreaGroups.User.areas.Account;
  const [showBlockBanner, setShowBlockBanner] = useState(false);
  const { mobile } = responsive;
  const membershipId = UrlUtils.QueryToObject().membershipId;
  const loggedInUserMembershipId =
    globalState?.loggedInUser?.user?.membershipId;

  const loggedInUserIsOnPageUser = (mid: string) => {
    if (!loggedInUserMembershipId) {
      return;
    }

    if (!mid || mid === "") {
      return true;
    }

    return !!(
      mid === loggedInUserMembershipId ||
      destinyMembership?.memberships?.find(
        (m) => m.membershipId === loggedInUserMembershipId
      )
    );
  };

  useEffect(() => {
    if (membershipId && membershipId !== "") {
      AccountDestinyMembershipDataStore.actions.loadUserData(
        {
          membershipId,
          membershipType: BungieMembershipType.BungieNext,
        },
        true
      );
    } else {
      AccountDestinyMembershipDataStore.actions.loadUserData();
    }
  }, []);

  useEffect(() => {
    Platform.IgnoreService.GlobalIgnoreImportsAvailable().then(
      (ignoresAvailable) => setShowBlockBanner(ignoresAvailable > 0)
    );
  }, []);

  const actions = {
    Account: area.getAction("index"),
    IdentitySettings: area.getAction("IdentitySettings"),
    BungieFriends: area.getAction("BungieFriends"),
    EmailSms: area.getAction("EmailSms"),
    Notifications: area.getAction("Notifications"),
    AccountLinking: area.getAction("AccountLinking"),
    Privacy: area.getAction("Privacy"),
    LanguageRegion: area.getAction("LanguageRegion"),
    BlockedUsers: area.getAction("BlockedUsers"),
    CrossSave: area.getAction("CrossSave"),
    EververseHistory: area.getAction("EververseHistory"),
    AppHistory: area.getAction("AppHistory"),
  } as const;

  const identitySettingsPath = actions.IdentitySettings.resolve();
  const accountIndexPath = actions.Account.resolve();
  const history = useHistory();

  const tabsOnly = StringUtils.equals(
    accountIndexPath.url,
    history.location.pathname,
    StringCompareOptions.IgnoreCase
  );

  const renderAsExternalLink = (label: string) => (
    <span>
      {label}
      <Icon
        iconType={"fa"}
        iconName={"external-link"}
        className={styles.linkIcon}
      />
    </span>
  );

  const accountTabDetails: TabData[] = [
    {
      tabLabel: Localizer.account.account,
      contentComponent: null,
      tabTo: null,
      pathName: null,
    },
    {
      tabLabel: Localizer.account.bungietitle,
      contentComponent: null,
      tabTo: null,
      pathName: null,
    },
    {
      tabLabel: Localizer.account.identitySettings,
      contentComponent: <IdentitySettings />,
      tabTo: identitySettingsPath,
      pathName: actions.IdentitySettings.path,
    },
    {
      tabLabel: Localizer.account.bungieFriends,
      contentComponent: <BungieFriends />,
      tabTo: actions.BungieFriends.resolve(),
      pathName: actions.BungieFriends.path,
    },
    {
      tabLabel: Localizer.Userpages.EmailAndSmsLabel,
      contentComponent: <EmailAndSms />,
      tabTo: actions.EmailSms.resolve(),
      pathName: actions.EmailSms.path,
    },
    {
      tabLabel: Localizer.Privacy.Notifications,
      tabRender: renderAsExternalLink,
      contentComponent: <Notifications />,
      tabTo: RouteHelper.Settings({ category: "notifications" }), //RouteDefs.AreaGroups.User.areas.Account.getAction("Notifications").resolve(),
      pathName: null, //RouteDefs.AreaGroups.User.areas.Account.getAction("Notifications").path
    },
    {
      tabLabel: Localizer.account.accountLinking,
      contentComponent: <AccountLinking />,
      tabTo: actions.AccountLinking.resolve(),
      pathName: actions.AccountLinking.path,
    },
    {
      tabLabel: Localizer.account.privacy,
      contentComponent: <Privacy />,
      tabTo: actions.Privacy.resolve(),
      pathName: actions.Privacy.path,
    },
    {
      tabLabel: Localizer.account.languageRegion,
      contentComponent: <LanguageAndRegion />,
      tabTo: actions.LanguageRegion.resolve(),
      pathName: actions.LanguageRegion.path,
    },
    {
      tabLabel: Localizer.account.blockedUsers,
      contentComponent: <BlockedUsers />,
      tabTo: actions.BlockedUsers.resolve(),
      pathName: actions.BlockedUsers.path,
    },
    {
      tabLabel: Localizer.account.destinytitle,
      contentComponent: null,
      tabTo: null,
      pathName: null,
    },
    {
      tabLabel: Localizer.account.crosssave,
      tabRender: renderAsExternalLink,
      contentComponent: <CrossSave />,
      tabTo: RouteHelper.CrossSave(),
      pathName: RouteHelper.CrossSave().url,
    },
    {
      tabLabel: Localizer.account.SilverBalanceHistory,
      tabRender: renderAsExternalLink,
      contentComponent: <SilverBalanceHistory />,
      tabTo: RouteHelper.PurchaseHistory({ type: 0 }),
      pathName: null,
    },
    {
      tabLabel: Localizer.account.AppHistory,
      tabRender: renderAsExternalLink,
      contentComponent: <AppHistory />,
      tabTo: RouteHelper.ApplicationHistory(),
      pathName: actions.AppHistory.path,
    },
  ];

  return (
    <RequiresAuth
      onSignIn={() =>
        AccountDestinyMembershipDataStore.actions.loadUserData(
          { membershipId, membershipType: BungieMembershipType.BungieNext },
          true
        )
      }
    >
      <PermissionsGate
        permissions={[AclEnum.BNextPrivateUserDataReader]}
        unlockOverride={loggedInUserIsOnPageUser(membershipId)}
      >
        <ViewerPermissionContext.Provider
          value={{
            membershipIdFromQuery: membershipId,
            loggedInUserId: loggedInUserMembershipId,
            isSelf: loggedInUserIsOnPageUser(membershipId),
            isAdmin: globalState?.loggedInUser?.userAcls.includes(
              AclEnum.BNextPrivateUserDataReader
            ),
          }}
        >
          <BungieHelmet title={Localizer.registrationbenefits.Account}>
            <body
              className={SpecialBodyClasses(
                BodyClasses.SolidMainNav | BodyClasses.NoSpacer
              )}
            />
          </BungieHelmet>
          <TabSystem
            tabDataArray={accountTabDetails}
            defaultRouteComponent={
              !mobile ? (
                <Redirect to={identitySettingsPath.url} />
              ) : (
                <Redirect to={accountIndexPath.url} />
              )
            }
            tabClasses={{
              container: styles.container,
              contentContainer: classNames(styles.contentContainer, {
                [styles.tabsOnly]: mobile && tabsOnly,
              }),
              list: classNames(styles.list, {
                [styles.contentOnly]: mobile && !tabsOnly,
              }),
              current: styles.current,
              clickableLink: styles.clickableLink,
              span: styles.span,
            }}
            mobileDropdownBreakpoint={"none"}
            tabsOnly={mobile && tabsOnly}
          >
            {mobile && (
              <Anchor url={accountIndexPath} className={styles.backButton}>
                <Icon iconType={"material"} iconName={"keyboard_arrow_left"} />
                {Localizer.Registration.Back}
              </Anchor>
            )}
            {showBlockBanner && <ImportMutedUsersBanner />}
          </TabSystem>
        </ViewerPermissionContext.Provider>
      </PermissionsGate>
    </RequiresAuth>
  );
};

export default Account;
