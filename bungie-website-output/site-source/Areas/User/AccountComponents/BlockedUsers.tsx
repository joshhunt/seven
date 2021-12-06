// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import styles from "@Areas/User/AccountComponents/BlockedUsers.module.scss";
import accountStyles from "../Account.module.scss";
import * as Globals from "@Enum";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Ignores, Platform } from "@Platform";
import { TwoLineItem } from "@UIKit/Companion/TwoLineItem";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { Grid, GridCol, GridDivider } from "@UIKit/Layout/Grid/Grid";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface BlockedUsersProps {}

export const BlockedUsers: React.FC<BlockedUsersProps> = (props) => {
  const [blockedUsers, setBlockedUsers] = useState<Ignores.IgnoredPlayer[]>([]);
  const [offset, setOffset] = useState(0);
  const blockedUsersPerPage = 30;
  const hasBlockedUsers = blockedUsers?.length > 0;

  const globalStateData = useDataStore(GlobalStateDataStore, ["loggedinuser"]);

  useEffect(() => {
    Platform.IgnoreService.ManageIgnoresForUser(
      globalStateData?.loggedInUser?.user?.membershipId
    )
      .then((data) => {
        setBlockedUsers(data);
        // could save page number in session storage if we think the experience would be better
        handlePageChange({ selected: 0 });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  }, []);

  const handlePageChange = (pageNumber: { selected: number }) => {
    const newOffset = Math.ceil(pageNumber.selected * blockedUsersPerPage);
    setOffset(newOffset);
  };

  const successModal = (
    <div>
      <h1>{Localizer.friends.success}</h1>
      <p>{Localizer.friends.successdesc}</p>
    </div>
  );

  const getLocalizedDateString = (date: string) => {
    const luxonDate = DateTime.fromISO(date);
    const expirationDateString = Localizer.Format(
      Localizer.Time.CompactMonthDayYear,
      { month: luxonDate.month, day: luxonDate.day, year: luxonDate.year }
    );

    return Localizer.Format(Localizer.Friends.BlockedOnDate, {
      DATE: expirationDateString,
    });
  };

  const unignorePlayer = (mId: string) => {
    const unignoreItemContract = {
      ignoredItemId: mId,
      ignoredItemType: Globals.IgnoredItemType.User,
    };
    Platform.IgnoreService.UnignoreItem(unignoreItemContract)
      .then((data) => {
        Modal.open(successModal);
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  return (
    <div>
      <GridCol cols={12}>
        <h3>{Localizer.Account.blockedUsers}</h3>
      </GridCol>
      <GridDivider cols={12} className={accountStyles.mainDivider} />
      <GridCol cols={12}>
        {hasBlockedUsers ? (
          <>
            <p>{Localizer.userPages.theseUsersAreBlocked}</p>
            {blockedUsers
              .slice(offset, offset + blockedUsersPerPage)
              .map((user, i) => {
                return (
                  <TwoLineItem
                    key={user?.membershipId}
                    itemTitle={user.bungieName}
                    itemSubtitle={getLocalizedDateString(user.dateBlocked)}
                    flair={
                      <div className={styles.twoButtons}>
                        <Button
                          onClick={(e) => unignorePlayer(user?.membershipId)}
                        >
                          {Localizer.friends.unblock}
                        </Button>
                      </div>
                    }
                  />
                );
              })}
            {blockedUsers.length > blockedUsersPerPage && (
              <ReactPaginate
                onPageChange={(e) => handlePageChange(e)}
                pageCount={Math.ceil(blockedUsers.length / blockedUsersPerPage)}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
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
        ) : (
          <p>{Localizer.Friends.noblocks}</p>
        )}
      </GridCol>
    </div>
  );
};
