// Created by atseng, 2021
// Copyright Bungie, Inc.

import { ProfileDestinyMembershipDataStore } from "@Areas/User/AccountComponents/DataStores/ProfileDestinyMembershipDataStore";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { ClanBannerDisplay } from "@UI/Destiny/ClanBanner";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { useAsyncError } from "@Utilities/ReactUtils";
import { UserUtils } from "@Utilities/UserUtils";
import styles from "./Clan.module.scss";
import React, { useEffect, useState } from "react";
import { GroupsV2, Platform } from "@Platform";
import { GroupsForMemberFilter, GroupType } from "@Enum";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { Localizer } from "@bungie/localization";
import { Anchor } from "@UI/Navigation/Anchor";
import classNames from "classnames";

interface ClanProps {
  membershipId: string;
}

export const Clan: React.FC<ClanProps> = (props) => {
  //refactor
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUserClans"]);
  const destinyMembership = useDataStore(ProfileDestinyMembershipDataStore);

  const clansDisabled = !ConfigUtils.SystemStatus(SystemNames.Clans);

  const isViewingSelf = UserUtils.IsViewingSelf(
    props.membershipId,
    globalState,
    destinyMembership
  );

  const [clan, setClan] = useState<GroupsV2.GroupMembership>(null);

  const throwError = useAsyncError();

  const loadClanInfo = () => {
    if (isViewingSelf && globalState.loggedInUserClans?.results?.length === 0) {
      setClan(null);
    } else if (
      isViewingSelf &&
      globalState.loggedInUserClans?.results?.length > 0 &&
      destinyMembership?.selectedMembership
    ) {
      const clanResult = globalState.loggedInUserClans?.results.find(
        (value, index) => {
          const isActiveClan = !globalState.loggedInUserClans
            .areAllMembershipsInactive[value.group.groupId];
          const clanMembershipTypeMatchesSelectedMembershipType =
            value.member.destinyUserInfo.membershipType ===
            destinyMembership?.selectedMembership.membershipType;

          return (
            clanMembershipTypeMatchesSelectedMembershipType && isActiveClan
          );
        }
      );

      if (typeof clanResult !== "undefined") {
        setClan(clanResult);
      }
    } else {
      if (destinyMembership?.selectedMembership && !clansDisabled) {
        Platform.GroupV2Service.GetGroupsForMember(
          destinyMembership?.selectedMembership?.membershipType,
          destinyMembership?.selectedMembership?.membershipId,
          GroupsForMemberFilter.All,
          GroupType.Clan
        )
          .then((clanResponse: GroupsV2.GetGroupsForMemberResponse) => {
            try {
              if (clanResponse?.results.length > 0) {
                const clanResult = clanResponse.results.find((value, index) => {
                  const isActiveClan = !clanResponse.areAllMembershipsInactive[
                    value.group.groupId
                  ];
                  const clanMembershipTypeMatchesSelectedMembershipType =
                    value.member.destinyUserInfo.membershipType ===
                    destinyMembership?.selectedMembership?.membershipType;

                  return (
                    clanMembershipTypeMatchesSelectedMembershipType &&
                    isActiveClan
                  );
                });

                if (clanResult) {
                  setClan(clanResult);
                }
              }
            } catch {
              throwError(new Error());
            }
          })
          .catch(throwError);
      } else {
        //looking at someone else and they have no destiny memberships
        setClan(null);
      }
    }
  };

  useEffect(() => {
    if (!clansDisabled) {
      const noCurrentClanLoaded =
        !clan && destinyMembership?.selectedMembership;
      const clanIsDifferent =
        clan &&
        !destinyMembership?.membershipData?.destinyMemberships?.some(
          (dm) => dm.membershipId === clan.member.destinyUserInfo.membershipId
        );

      if (noCurrentClanLoaded || clanIsDifferent) {
        loadClanInfo();
      }
    }
  }, [destinyMembership?.selectedMembership]);

  const profileLoc = Localizer.Profile;

  const clanMatesText =
    clan?.group?.memberCount === 1
      ? Localizer.Format(profileLoc.Clanmate, {
          count: clan?.group?.memberCount,
        })
      : Localizer.Format(profileLoc.Clanmates, {
          count: clan?.group?.memberCount,
        });

  return (
    <SystemDisabledHandler
      className={styles.clanSectionWrapper}
      systems={[SystemNames.Clans]}
    >
      {clan ? (
        <Anchor
          className={styles.clanSection}
          url={RouteHelper.Clan(clan.group.groupId)}
        >
          <ClanBannerDisplay
            className={styles.clanBanner}
            bannerSettings={clan.group.clanInfo.clanBannerData}
            showStaff={true}
            replaceCanvasWithImage={false}
          />
          <div className={styles.clanInfo}>
            <h3>{clan.group.name}</h3>
            <p className={styles.about}>{clan.group.motto}</p>
            <p className={styles.membercount}>
              <span className={styles.icon}>
                <Icon iconType={"bungle"} iconName={"destinyuiroster"} />
              </span>
              {clanMatesText}
            </p>
          </div>
        </Anchor>
      ) : (
        <Anchor
          className={classNames(styles.clanSection, styles.emptyState)}
          url={isViewingSelf ? RouteHelper.MyClan() : RouteHelper.Clans()}
        >
          <p>{Localizer.Clans.NotAMemberOfAClan}</p>
        </Anchor>
      )}
    </SystemDisabledHandler>
  );
};
