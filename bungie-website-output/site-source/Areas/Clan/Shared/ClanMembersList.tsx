// Created by atseng, 2023
// Copyright Bungie, Inc.

import { ClanMembersDataStore } from "@Areas/Clan/DataStores/ClanMembersDataStore";
import { UserCard } from "@Areas/Clan/Shared/UserCard";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { RuntimeGroupMemberType } from "@Enum";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";
import styles from "./ClanMembers.module.scss";

interface ClanMembersListProps {
  clanId: string;
  memberType: RuntimeGroupMemberType;
  listType: ClanMemberListType;
  searchString?: string;
  page?: number;
  /*Default result is searchTerm = empty string and page = 1 (first page)*/
  useDefaultResult?: boolean;
  className?: string;
}

export type ClanMemberListType = "compact" | "full" | "admin";

export const ClanMembersList: React.FC<ClanMembersListProps> = (props) => {
  const clanMembersData = useDataStore(ClanMembersDataStore);
  const clansLoc = Localizer.Clans;

  const getLocalizedHeader = (memberType: RuntimeGroupMemberType) => {
    switch (memberType) {
      case RuntimeGroupMemberType.Founder:
      case RuntimeGroupMemberType.ActingFounder:
        return clansLoc.Founder;
      case RuntimeGroupMemberType.Admin:
        return clansLoc.Admin;
      case RuntimeGroupMemberType.Member:
        return clansLoc.Member;
      case RuntimeGroupMemberType.Beginner:
        return clansLoc.Beginner;
    }

    return null;
  };

  if (
    !clanMembersData ||
    (props.useDefaultResult &&
      clanMembersData?.defaultMemberTypeResponses?.find(
        (m) => m.memberType === props.memberType
      )?.response?.results?.length === 0) ||
    (!props.useDefaultResult &&
      clanMembersData?.memberTypeResponses?.find(
        (m) => m.memberType === props.memberType
      )?.response?.results?.length === 0)
  ) {
    return null;
  }

  //.flatMap<GroupsV2.GroupMember>(i => Array(5).fill(i))

  //is this list interested in updating when search term is updated?
  const membersData = props.useDefaultResult
    ? clanMembersData.defaultMemberTypeResponses
    : clanMembersData.memberTypeResponses;

  return (
    <div
      className={classNames(
        styles.membersListWrapper,
        styles[props.listType],
        props.className
      )}
    >
      <h4>{getLocalizedHeader(props.memberType)}</h4>
      <ul className={styles.listCards}>
        {membersData
          ?.sort((a, b) => a.memberType - b.memberType)
          .find((m) => m.memberType === props.memberType)
          ?.response?.results.sort((a, b) =>
            DateTime.fromISO(a.joinDate) > DateTime.fromISO(b.joinDate) ? 1 : -1
          )
          .map((m) => {
            return (
              <UserCard
                key={m.destinyUserInfo?.membershipId}
                listType={props.listType}
                m={m}
                clanId={props.clanId}
              />
            );
          })}
      </ul>
    </div>
  );
};
