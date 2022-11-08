// Created by atseng, 2022
// Copyright Bungie, Inc.

import { Clans } from "@Areas/Clans/Clans";
import styles from "@Areas/Clans/Clans.module.scss";
import { ClanCard } from "@Areas/Clans/Shared/ClanCard";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { GroupDateRange, GroupType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { GroupsV2, Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { UserUtils } from "@Utilities/UserUtils";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "@react-icons/all-files/io/IoIosArrowForward";

interface SuggestedProps {}

const Suggested: React.FC<SuggestedProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const clansLoc = Localizer.Clans;

  const [suggestedClans, setSuggestedClans] = useState<GroupsV2.GroupV2Card[]>(
    []
  );

  const getSuggestedClans = () => {
    Platform.GroupV2Service.GetRecommendedGroups(
      GroupType.Clan,
      GroupDateRange.All
    ).then((result) => {
      if (result) {
        setSuggestedClans(result);
      }
    });
  };

  useEffect(() => {
    if (UserUtils.isAuthenticated(globalState)) {
      getSuggestedClans();
    }
  }, [globalState.loggedInUser]);

  return (
    <Clans pageType={"suggested"}>
      {UserUtils.isAuthenticated(globalState) && suggestedClans?.length > 0 ? (
        suggestedClans.map((c) => {
          return <ClanCard key={c.groupId} clan={c} isLoggedIn={true} />;
        })
      ) : (
        <>
          <p>{clansLoc.ThereAreNoSuggestedClans}</p>
          <p className={styles.clanrecruitment}>
            <Anchor url={RouteHelper.ForumsTag("clans")}>
              {clansLoc.ClanRecruitmentForum}
              <IoIosArrowForward />
            </Anchor>
          </p>
        </>
      )}
    </Clans>
  );
};

export default Suggested;
