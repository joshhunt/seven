// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/ClanProfile.module.scss";
import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { Breadcrumb } from "@Areas/Clan/Shared/Breadcrumb";
import { ClanFeaturesList } from "@Areas/Clan/Shared/ClanFeaturesList";
import { ClanMembersList } from "@Areas/Clan/Shared/ClanMembersList";
import { ClanProgression } from "@Areas/Clan/Shared/ClanProgression";
import { ClanWithSideBannerView } from "@Areas/Clan/Shared/ClanWithSideBannerView";
import { ProfileClanMembershipButtons } from "@Areas/Clan/Shared/ProfileClanMembershipButtons";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { IgnoredItemType, RuntimeGroupMemberType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { GroupsV2, Platform } from "@Platform";
import { IClanParams } from "@Routes/RouteParams";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { ReportItem } from "@UI/Report/ReportItem";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Profile: React.FC = () => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const clanMembersData = useDataStore(ClanMembersDataStore);

  const clanId = params?.clanId ?? "0";
  const [clanResponse, setClanResponse] = useState<GroupsV2.GroupResponse>();

  const getClan = () => {
    if (ConfigUtils.SystemStatus(SystemNames.Clans)) {
      Platform.GroupV2Service.GetGroup(clanId).then((result) => {
        setClanResponse(result);
      });
    }
  };

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();
    getClan();
    ClanMembersDataStore.actions.getAllClanMembers(clanId);
  }, []);

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();
    getClan();
  }, [UserUtils.isAuthenticated(globalState)]);

  const reportClan = () => {
    //report
    const reportModal = Modal.open(
      <ReportItem
        ignoredItemId={clanResponse?.detail?.groupId}
        reportType={IgnoredItemType.GroupProfile}
        title={clansLoc.YouAreAboutToReportThis}
        onReset={() => reportModal.current.close()}
      />
    );
  };

  const clanMemberCountString = `${clansLoc.Members} (${clanResponse?.detail?.memberCount} / 100)`;

  return (
    <SystemDisabledHandler systems={[SystemNames.Clans]}>
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
          <div className={styles.clanContainer}>
            <div className={styles.clanGrid}>
              <ClanWithSideBannerView
                clanBannerProps={{
                  bannerSettings: clanResponse.detail.clanInfo.clanBannerData,
                  className: styles.clanBannerDisplay,
                  showStaff: true,
                  replaceCanvasWithImage: true,
                }}
                clanContentContainerClassName={styles.clanMeta}
                clanBannerContainerClassName={styles.clanBannerContainer}
                clanId={clanId}
              >
                <Breadcrumb clanId={clanId} />
                <h2>
                  {clanResponse.detail.name}{" "}
                  {clanResponse.detail.clanInfo.clanCallsign
                    ? `[${clanResponse.detail.clanInfo.clanCallsign}]`
                    : ""}
                </h2>
                {clanResponse.detail.motto && (
                  <p className={styles.clanMotto}>
                    {clanResponse.detail.motto}
                  </p>
                )}
                <div className={styles.buttons}>
                  <ProfileClanMembershipButtons
                    clanId={clanResponse.detail.groupId}
                    membershipMap={clanResponse.currentUserMemberMap}
                    potentialMembershipMap={
                      clanResponse.currentUserPotentialMemberMap
                    }
                    membershipOption={clanResponse.detail.membershipOption}
                    membershipUpdated={() => getClan()}
                  />
                  <Button
                    size={BasicSize.Medium}
                    buttonType={"red"}
                    onClick={() => reportClan()}
                  >
                    {clansLoc.ClanReport}
                  </Button>
                </div>
                <p className={styles.clanAbout}>{clanResponse.detail.about}</p>
                <ClanFeaturesList
                  membershipOption={clanResponse.detail.membershipOption}
                  creationDate={clanResponse.detail.creationDate}
                  memberCount={clanResponse.detail.memberCount}
                />
                <div className={styles.clanGameStatus}>
                  <ClanProgression
                    clanProgression={
                      clanResponse.detail.clanInfo.d2ClanProgressions
                    }
                  />
                </div>
                <div className={styles.clanMembers}>
                  <h3 className={styles.sectionHeader}>
                    {clanMemberCountString}
                  </h3>
                  <ClanMembersList
                    clanId={clanResponse.detail.groupId}
                    memberType={RuntimeGroupMemberType.Founder}
                    listType={"full"}
                  />
                  <ClanMembersList
                    clanId={clanResponse.detail.groupId}
                    memberType={RuntimeGroupMemberType.ActingFounder}
                    listType={"full"}
                  />
                  <ClanMembersList
                    clanId={clanResponse.detail.groupId}
                    memberType={RuntimeGroupMemberType.Admin}
                    listType={"full"}
                  />
                  <ClanMembersList
                    clanId={clanResponse.detail.groupId}
                    memberType={RuntimeGroupMemberType.Member}
                    listType={"full"}
                  />
                  <ClanMembersList
                    clanId={clanResponse.detail.groupId}
                    memberType={RuntimeGroupMemberType.Beginner}
                    listType={"full"}
                  />
                </div>
              </ClanWithSideBannerView>
            </div>
          </div>
        </>
      ) : null}
    </SystemDisabledHandler>
  );
};
