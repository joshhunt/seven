// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ConvertToPlatformError } from "@ApiIntermediary";
import { Clans } from "@Areas/Clans/Clans";
import { ClanCard } from "@Areas/Clans/Shared/ClanCard";
import { ClanUtils } from "@Areas/Clans/Shared/ClanUtils";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { PlatformError } from "@CustomErrors";
import { BungieMembershipType, GroupType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Button } from "@UIKit/Controls/Button/Button";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { UserUtils } from "@Utilities/UserUtils";
import React from "react";
import { IoIosArrowForward } from "@react-icons/all-files/io/IoIosArrowForward";
import styles from "./Clans.module.scss";

interface MyClansProps {}

const MyClans: React.FC<MyClansProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUserClans"]);
  const clansLoc = Localizer.Clans;

  const recoverClan = () => {
    Platform.GroupV2Service.RecoverGroupForFounder(
      BungieMembershipType.BungieNext,
      globalState.loggedInUser?.user.membershipId,
      GroupType.Clan
    )
      .then((result) => {
        const confirmModal = Modal.open(clansLoc.anymissingclansshould, {
          onClose: () => {
            GlobalStateDataStore.actions.refreshLoggedInUserClans();
          },
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e: PlatformError) => {
        Modal.error(e);
      });
  };

  return (
    <Clans pageType={"myClans"}>
      {globalState.loggedInUserClans?.results?.length > 0 && (
        <ul className={styles.clanCardList}>
          {globalState.loggedInUserClans.results.map((clan) => {
            return (
              <ClanCard
                key={clan.group.groupId}
                clan={ClanUtils.CovertGroupToGroupCard(clan.group)}
                isLoggedIn={UserUtils.isAuthenticated(globalState)}
              />
            );
          })}
        </ul>
      )}
      {!globalState.loggedInUserClans?.results ||
        (globalState.loggedInUserClans?.results &&
          globalState.loggedInUserClans?.results?.length === 0 && (
            <div>
              <p>{clansLoc.UnfortunatelyYouAreNot}</p>
              {UserUtils.isAuthenticated(globalState) && (
                <p className={styles.recovery}>
                  {clansLoc.DonTSeeAClanYou}{" "}
                  <Button
                    className={styles.recoverButton}
                    buttonType={"none"}
                    onClick={() => recoverClan()}
                  >
                    {clansLoc.ReLinkYourClan}
                  </Button>
                </p>
              )}
              <p className={styles.clanrecruitment}>
                <Anchor url={RouteHelper.ForumsTag("clans")}>
                  {clansLoc.ClanRecruitmentForum}
                  <IoIosArrowForward />
                </Anchor>
              </p>
            </div>
          ))}
    </Clans>
  );
};

export default MyClans;
