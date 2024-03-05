// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { NonMemberClanSettingsDataStore } from "@Areas/Clan/DataStores/NonMemberClanSettingsDataStore";
import { Breadcrumb } from "@Areas/Clan/Shared/Breadcrumb";
import { ClanMembersList } from "@Areas/Clan/Shared/ClanMembersList";
import { ClanProgressionBar } from "@Areas/Clan/Shared/ClanProgressionBar";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { ClanWeeklyRewards } from "@Areas/Clan/Shared/ClanWeeklyRewards";
import styles from "@Areas/Clan/Shared/SettingsWrapper.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { AclEnum, RuntimeGroupMemberType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { GroupsV2, Platform } from "@Platform";
import { BsChatFill } from "@react-icons/all-files/bs/BsChatFill";
import { FaAngleLeft } from "@react-icons/all-files/fa/FaAngleLeft";
import { FaAngleRight } from "@react-icons/all-files/fa/FaAngleRight";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/RouteParams";
import { ClanBannerDisplay } from "@UI/Destiny/ClanBanner";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { PermissionsGate } from "@UI/User/PermissionGate";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

interface SettingsWrapperProps {}

export const SettingsWrapper: React.FC<SettingsWrapperProps> = (props) => {
  const params = useParams<IClanParams>();
  const history = useHistory();

  const clansLoc = Localizer.Clans;
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);

  const clanId = params?.clanId ?? "0";
  const clanMembership = globalState.loggedInUserClans?.results?.find(
    (c) => c.group?.groupId === clanId
  );
  const [clanResponse, setClanResponse] = useState<GroupsV2.GroupResponse>();

  const [pendingMembersCount, setPendingMembersCount] = useState(0);
  const [showTheSideNav, setShowTheSideNav] = useState(false);

  if (
    ConfigUtils.SystemStatus(SystemNames.Clans) &&
    !ConfigUtils.SystemStatus(SystemNames.ClanReactUI)
  ) {
    window.location.href = RouteHelper.Clan(clanId).url;

    return null;
  }

  const isLoggedIn = UserUtils.isAuthenticated(globalState);

  const getClanInfo = () => {
    if (ConfigUtils.SystemStatus(SystemNames.Clans)) {
      Platform.GroupV2Service.GetGroup(clanId).then((result) => {
        NonMemberClanSettingsDataStore.actions.setClanResponse(result);
        setClanResponse(result);
      });

      if (ClanUtils.canViewAdmin(clanMembership, globalState)) {
        Platform.GroupV2Service.GetPendingMemberships(clanId, 1).then(
          (result) => {
            setPendingMembersCount(result?.results?.length ?? 0);
          }
        );
      }

      ClanMembersDataStore.actions.getAllClanMembers(clanId);
    }
  };

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();

    getClanInfo();
  }, []);

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();

    getClanInfo();

    if (!isLoggedIn) {
      history.push(RouteHelper.NewClanProfile({ clanId: clanId }).url);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setShowTheSideNav(false);
  }, [history]);

  useEffect(() => {
    //somewhere the clan meta changed, so update
    getClanInfo();
  }, [globalState.loggedInUserClans]);

  if (!ClanUtils.canViewAdmin(clanMembership, globalState)) {
    history.push(RouteHelper.NewClanProfile({ clanId: clanId }).url);
  }

  const clanIdLabel = `Clan ID: ${clanResponse?.detail?.remoteGroupId ?? ""}`;

  return (
    <SystemDisabledHandler systems={["Clans"]}>
      {clanResponse ? (
        <>
          <BungieHelmet
            title={Localizer.Format(Localizer.PageTitles.ClanDetail, {
              0: clanResponse.detail.name,
            })}
            description={Localizer.Format(Localizer.PageTitles.ClanDetail, {
              0: clanResponse.detail.name,
            })}
          >
            <body className={SpecialBodyClasses(BodyClasses.NoSpacer)} />
          </BungieHelmet>
          <PermissionsGate
            permissions={[AclEnum.BNextFounderInAllGroups]}
            unlockOverride={
              !!globalState.loggedInUserClans?.results?.find(
                (c) =>
                  c.group.groupId === clanId &&
                  c.member?.memberType > RuntimeGroupMemberType.Member
              )
            }
          >
            <div
              className={styles.clanMobileMenu}
              onClick={() => {
                globalState.responsive.mobile &&
                  setShowTheSideNav(!showTheSideNav);
              }}
            >
              {!showTheSideNav && <FaAngleLeft />}
              <span>{clanResponse.detail.name}</span>
              {showTheSideNav && <FaAngleRight />}
            </div>
            <div className={styles.clanContainer}>
              {(!globalState.responsive.mobile ||
                (globalState.responsive.mobile && showTheSideNav)) && (
                <div className={styles.navSidebar}>
                  <div className={styles.identity}>
                    <ClanBannerDisplay
                      bannerSettings={
                        clanResponse.detail.clanInfo.clanBannerData
                      }
                      className={styles.clanBanner}
                      showStaff={true}
                      replaceCanvasWithImage={true}
                    />
                    <div className={styles.meta}>
                      <div className={styles.name}>
                        <h2>{clanResponse.detail.name}</h2>
                        <p>{clanIdLabel}</p>
                      </div>
                      <div className={styles.progression}>
                        <ClanProgressionBar
                          clanProgression={
                            clanResponse.detail.clanInfo.d2ClanProgressions
                          }
                          className={styles.sidebarProgression}
                          showProgressFraction={true}
                        />
                        <ClanWeeklyRewards
                          clanId={clanResponse.detail.groupId}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.nav}>
                    <p className={styles.heading}>
                      {clansLoc.Membernavigation}
                    </p>
                    <ul className={styles.navList}>
                      <li className={styles.chatLink}>
                        <Anchor url={RouteHelper.ClanChat(clanId)}>
                          <BsChatFill />
                          {clansLoc.ClanChat}
                        </Anchor>
                      </li>
                      {ConfigUtils.SystemStatus("ClanFireteams") && (
                        <li className={styles.fireteamsLink}>
                          <Anchor
                            url={RouteHelper.DeprecatedReactFireteams({
                              groupId: clanId,
                            })}
                          >
                            {clansLoc.Fireteams}
                          </Anchor>
                        </li>
                      )}
                      <li className={styles.settingsLink}>
                        <Anchor
                          url={RouteHelper.NewClanSettings({ clanId: clanId })}
                        >
                          {clansLoc.Settings}
                          {pendingMembersCount > 0 && (
                            <span className={styles.pip}>
                              {pendingMembersCount}
                            </span>
                          )}
                        </Anchor>
                      </li>
                      <li className={styles.profileLink}>
                        <Anchor
                          url={RouteHelper.NewClanProfile({ clanId: clanId })}
                        >
                          {clansLoc.Index}
                          <span>
                            {clansLoc.MemberOptions}
                            <FaChevronRight />
                          </span>
                        </Anchor>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {(!globalState.responsive.mobile ||
                (globalState.responsive.mobile && !showTheSideNav)) && (
                <div className={styles.mainContent}>
                  <Breadcrumb clanId={clanId} />
                  {props.children}
                </div>
              )}
              <div className={styles.membersSidebar}>
                <ClanMembersList
                  clanId={clanId}
                  memberType={RuntimeGroupMemberType.Founder}
                  listType={"compact"}
                  useDefaultResult={true}
                />
                <ClanMembersList
                  clanId={clanId}
                  memberType={RuntimeGroupMemberType.ActingFounder}
                  listType={"compact"}
                  useDefaultResult={true}
                />
                <ClanMembersList
                  clanId={clanId}
                  memberType={RuntimeGroupMemberType.Admin}
                  listType={"compact"}
                  useDefaultResult={true}
                />
                <ClanMembersList
                  clanId={clanId}
                  memberType={RuntimeGroupMemberType.Member}
                  listType={"compact"}
                  useDefaultResult={true}
                />
                {ClanUtils.canInvite(
                  clanMembership,
                  globalState.loggedInUser
                ) && (
                  <Button
                    className={styles.inviteButton}
                    buttonType={"gold"}
                    size={BasicSize.FullSize}
                    url={RouteHelper.NewClanInvitations({ clanId: clanId })}
                  >
                    {clansLoc.InviteMembers}
                  </Button>
                )}
              </div>
            </div>
          </PermissionsGate>
        </>
      ) : null}
    </SystemDisabledHandler>
  );
};
