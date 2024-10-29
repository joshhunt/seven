// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { ClanMembersList } from "@Areas/Clan/Shared/ClanMembersList";
import styles from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { ClanUtils } from "@Areas/Clan/Shared/ClanUtils";
import { PendingMembersList } from "@Areas/Clan/Shared/PendingMembersList";
import { SearchInput } from "@Areas/Clan/Shared/SearchInput";
import { SettingsWrapper } from "@Areas/Clan/Shared/SettingsWrapper";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RuntimeGroupMemberType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { FaHistory } from "@react-icons/all-files/fa/FaHistory";
import { FaPencilAlt } from "@react-icons/all-files/fa/FaPencilAlt";
import { FaPlus } from "@react-icons/all-files/fa/FaPlus";
import { FaWrench } from "@react-icons/all-files/fa/FaWrench";
import { RouteHelper } from "@Routes/RouteHelper";
import { IClanParams } from "@Routes/Definitions/RouteParams";
import { Anchor } from "@UI/Navigation/Anchor";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

export const Settings: React.FC = () => {
  const params = useParams<IClanParams>();
  const clansLoc = Localizer.Clans;
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "loggedInUserClans",
  ]);
  const clanId = params?.clanId ?? "0";
  const [searchString, setSearchString] = useState("");

  const clanMembership = globalState.loggedInUserClans?.results?.find(
    (c) => c.group.groupId === clanId
  );

  const membersCountTitle = `${clansLoc.Totalmembers} (${clanMembership?.group?.memberCount} / 100)`;

  const userIsBnetAdmin = ClanUtils.isBnetAdmin(globalState.loggedInUser);

  return (
    <SettingsWrapper>
      {UserUtils.isAuthenticated(globalState) &&
        (userIsBnetAdmin || clanMembership) && (
          <div>
            <div className={styles.adminSectionsNav}>
              {ClanUtils.canEditClanCulture(
                clanMembership,
                globalState.loggedInUser
              ) && (
                <div
                  className={classNames(styles.section, styles.textFieldIcon)}
                >
                  <Anchor
                    className={styles.sectionContent}
                    url={RouteHelper.NewClanCultureSettings({ clanId: clanId })}
                  >
                    <FaPencilAlt />
                    <div>
                      <p>
                        <strong>{clansLoc.EditClan}</strong>
                      </p>
                      <p>{clansLoc.EditYourClan}</p>
                    </div>
                  </Anchor>
                </div>
              )}
              {clanMembership?.member?.memberType >
                RuntimeGroupMemberType.Admin && (
                <div
                  className={classNames(
                    styles.section,
                    styles.generalSettingIcon
                  )}
                >
                  <Anchor
                    className={styles.sectionContent}
                    url={RouteHelper.NewClanGeneralSettings({ clanId: clanId })}
                  >
                    <FaWrench />
                    <div>
                      <p>
                        <strong>{clansLoc.GeneralSettings}</strong>
                      </p>
                      <p>{clansLoc.GeneralSettingsDescription}</p>
                    </div>
                  </Anchor>
                </div>
              )}
              {ClanUtils.canEditClanBanner(
                clanMembership,
                globalState.loggedInUser
              ) && (
                <div
                  className={classNames(
                    styles.section,
                    styles.updateBannerIcon
                  )}
                >
                  <Anchor
                    className={styles.sectionContent}
                    url={RouteHelper.NewClanEditBanner({ clanId: clanId })}
                  >
                    <div>
                      <p>
                        <strong>{clansLoc.EditBanner}</strong>
                      </p>
                      <p>{clansLoc.UpdateYourClanBanner}</p>
                    </div>
                  </Anchor>
                </div>
              )}
              {ClanUtils.canInvite(
                clanMembership,
                globalState.loggedInUser
              ) && (
                <div
                  className={classNames(
                    styles.section,
                    styles.invitedMembersIcon
                  )}
                >
                  <Anchor
                    className={styles.sectionContent}
                    url={RouteHelper.NewClanInvitations({ clanId: clanId })}
                  >
                    <FaPlus />
                    <div>
                      <p>
                        <strong>{clansLoc.Invitations}</strong>
                      </p>
                      <p>{clansLoc.InviteUsers}</p>
                    </div>
                  </Anchor>
                </div>
              )}
              <div
                className={classNames(styles.section, styles.bannedMembersIcon)}
              >
                <Anchor
                  className={styles.sectionContent}
                  url={RouteHelper.NewClanBanned({ clanId: clanId })}
                >
                  <div>
                    <p>
                      <strong>{clansLoc.Banned}</strong>
                    </p>
                    <p>{clansLoc.BanAndUnbanMembers}</p>
                  </div>
                </Anchor>
              </div>
              <div
                className={classNames(styles.section, styles.adminHistoryIcon)}
              >
                <Anchor
                  className={styles.sectionContent}
                  url={RouteHelper.NewClanAdminHistory({ clanId: clanId })}
                >
                  <FaHistory />
                  <div>
                    <p>
                      <strong>{clansLoc.AdminHistory}</strong>
                    </p>
                    <p>{clansLoc.ViewALogOfImportantActions}</p>
                  </div>
                </Anchor>
              </div>
              <div
                className={classNames(styles.section, styles.adminHistoryIcon)}
              >
                <Anchor
                  className={styles.sectionContent}
                  url={RouteHelper.NewClanEditHistory({ clanId: clanId })}
                >
                  <FaHistory />
                  <div>
                    <p>
                      <strong>{clansLoc.EditHistory}</strong>
                    </p>
                    <p>{clansLoc.ViewALogOfEditsMadeTo}</p>
                  </div>
                </Anchor>
              </div>
            </div>
            <PendingMembersList clanId={clanId} />
            <div className={styles.membersHeader}>
              <h3>{membersCountTitle}</h3>
              <SearchInput
                placeholder={clansLoc.SearchForMember}
                updateSearchString={(value) => {
                  ClanMembersDataStore.actions.getAllClanMembers(
                    clanId,
                    1,
                    value
                  );
                }}
              />
            </div>
            <div className={styles.membersLists}>
              <ClanMembersList
                clanId={clanId}
                memberType={RuntimeGroupMemberType.Founder}
                listType={"admin"}
                searchString={searchString}
                className={styles.settingsMembersList}
              />
              <ClanMembersList
                clanId={clanId}
                memberType={RuntimeGroupMemberType.ActingFounder}
                listType={"admin"}
                searchString={searchString}
                className={styles.settingsMembersList}
              />
              <ClanMembersList
                clanId={clanId}
                memberType={RuntimeGroupMemberType.Admin}
                listType={"admin"}
                searchString={searchString}
                className={styles.settingsMembersList}
              />
              <ClanMembersList
                clanId={clanId}
                memberType={RuntimeGroupMemberType.Member}
                listType={"admin"}
                searchString={searchString}
                className={styles.settingsMembersList}
              />
              <ClanMembersList
                clanId={clanId}
                memberType={RuntimeGroupMemberType.Beginner}
                listType={"admin"}
                searchString={searchString}
                className={styles.settingsMembersList}
              />
            </div>
          </div>
        )}
    </SettingsWrapper>
  );
};
