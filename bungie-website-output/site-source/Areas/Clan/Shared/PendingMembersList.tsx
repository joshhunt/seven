// Created by atseng, 2023
// Copyright Bungie, Inc.

import { UserCard } from "@Areas/Clan/Shared/UserCard";
import ReactPaginate from "react-paginate";
import styles from "./ClanMembers.module.scss";
import stylesSettings from "@Areas/Clan/Shared/ClanSettings.module.scss";
import { Platform, Queries } from "@Platform";
import classNames from "classnames";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { Localizer } from "@bungie/localization/Localizer";

interface PendingMembersListProps {
  clanId: string;
}

export const PendingMembersList: React.FC<PendingMembersListProps> = (
  props
) => {
  const clansLoc = Localizer.Clans;
  const [pendingMembersResponse, setPendingMembersResponse] = useState<
    Queries.SearchResultGroupMemberApplication
  >();
  const getPendingMembers = (page = 1) => {
    Platform.GroupV2Service.GetPendingMemberships(props.clanId, page).then(
      (result) => {
        setPendingMembersResponse(result);
      }
    );
  };

  useEffect(() => {
    getPendingMembers();
  }, []);

  if (!pendingMembersResponse || pendingMembersResponse.results?.length === 0) {
    return null;
  }

  const pagerPage = (pendingMembersResponse.query?.currentPage ?? 0) - 1;

  return (
    <>
      <div className={stylesSettings.membersHeader}>
        <h3>{clansLoc.PendingMembers}</h3>
      </div>
      <div className={classNames(styles.membersListWrapper, styles.admin)}>
        <ul className={styles.listCards}>
          {pendingMembersResponse?.results
            ?.sort((a, b) =>
              DateTime.fromISO(a.creationDate) >
              DateTime.fromISO(b.creationDate)
                ? 1
                : -1
            )
            .map((m) => {
              return (
                <UserCard
                  key={m.destinyUserInfo?.membershipId}
                  listType={"admin"}
                  clanId={props.clanId}
                  m={m}
                  updatePending={() => getPendingMembers()}
                />
              );
            })}
        </ul>
      </div>
      {!(pagerPage === 0 && !pendingMembersResponse?.hasMore) && (
        <ReactPaginate
          pageCount={
            pagerPage > 3 && pendingMembersResponse.hasMore ? pagerPage + 5 : 5
          }
          forcePage={pagerPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          previousLabel={Localizer.usertools.previousPage}
          nextLabel={Localizer.usertools.nextPage}
          containerClassName={styles.paginateInterface}
          activeClassName={styles.active}
          previousClassName={styles.prev}
          nextClassName={styles.next}
          disabledClassName={styles.disabled}
        />
      )}
    </>
  );
};
