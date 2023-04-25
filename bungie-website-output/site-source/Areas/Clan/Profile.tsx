// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Clan.module.scss";
import { ClanDestinyMembershipDataStore } from "@Areas/Clan/DataStores/ClanDestinyMembershipStore";
import { ClanFeaturesList } from "@Areas/Clan/Shared/ClanFeaturesList";
import { ClanMembersList } from "@Areas/Clan/Shared/ClanMembersList";
import { ClanProgression } from "@Areas/Clan/Shared/ClanProgression";
import { OathKeeperScore } from "@Areas/Clan/Shared/OathKeeperScore";
import { ProfileClanMembershipButtons } from "@Areas/Clan/Shared/ProfileClanMembershipButtons";
import { ClanBannerDisplay } from "@Areas/User/ProfileComponents/ClanBanner";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { IgnoredItemType, RuntimeGroupMemberType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { GroupsV2, Platform } from "@Platform";
import { RiArrowLeftSLine } from "@react-icons/all-files/ri/RiArrowLeftSLine";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/RouteParams";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { Anchor } from "@UI/Navigation/Anchor";
import { ReportItem } from "@UI/Report/ReportItem";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { BasicSize } from "@UIKit/UIKitUtils";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Profile: React.FC = () => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  const clanId = params?.clanId ?? "0";
  const [clanResponse, setClanResponse] = useState<GroupsV2.GroupResponse>();

  if (!ConfigUtils.SystemStatus(SystemNames.ClanReactUI)) {
    window.location.href = RouteHelper.Clan(clanId).url;

    return null;
  }

  const getClan = () => {
    Platform.GroupV2Service.GetGroup(clanId).then((result) => {
      setClanResponse(result);
    });
  };

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();

    getClan();
  }, []);

  useEffect(() => {
    ClanDestinyMembershipDataStore.actions.loadUserData();

    getClan();
  }, [UserUtils.isAuthenticated(globalState)]);

  if (!clanResponse) {
    //empty state
    return null;
  }

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

  const clanMemberCountString = `${clansLoc.Members} (${clanResponse.detail.memberCount} / 100)`;

  return (
    <SystemDisabledHandler systems={["Clans"]}>
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
        <Grid className={styles.clanGrid}>
          <GridCol className={styles.clanContentContainer} cols={12}>
            <div className={styles.clanBannerContainer}>
              <ClanBannerDisplay
                bannerSettings={clanResponse.detail.clanInfo.clanBannerData}
                className={styles.clanBanner}
                showStaff={true}
                replaceCanvasWithImage={true}
              />
            </div>
            <div className={styles.clanMeta}>
              <div className={styles.clanBreadcrumb}>
                <RiArrowLeftSLine />
                <Anchor url={RouteHelper.NewClans()}>
                  {clansLoc.ClanSearch}
                </Anchor>
              </div>
              <h2>
                {clanResponse.detail.name}{" "}
                {clanResponse.detail.clanInfo.clanCallsign
                  ? `[${clanResponse.detail.clanInfo.clanCallsign}]`
                  : ""}
              </h2>
              {clanResponse.detail.motto && (
                <p className={styles.clanMotto}>{clanResponse.detail.motto}</p>
              )}
              <div className={styles.buttons}>
                <ProfileClanMembershipButtons
                  clanId={clanResponse.detail.groupId}
                  membershipMap={clanResponse.currentUserMemberMap}
                  potentialMembershipMap={
                    clanResponse.currentUserPotentialMemberMap
                  }
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
                <OathKeeperScore
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
                />
                <ClanMembersList
                  clanId={clanResponse.detail.groupId}
                  memberType={RuntimeGroupMemberType.ActingFounder}
                />
                <ClanMembersList
                  clanId={clanResponse.detail.groupId}
                  memberType={RuntimeGroupMemberType.Admin}
                />
                <ClanMembersList
                  clanId={clanResponse.detail.groupId}
                  memberType={RuntimeGroupMemberType.Member}
                />
                <ClanMembersList
                  clanId={clanResponse.detail.groupId}
                  memberType={RuntimeGroupMemberType.Beginner}
                />
              </div>
            </div>
          </GridCol>
        </Grid>
      </div>
    </SystemDisabledHandler>
  );
};
