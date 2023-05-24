// Created by atseng, 2022
// Copyright Bungie, Inc.

import { FireteamsDestinyMembershipDataStore } from "@Areas/Fireteams/DataStores/FireteamsDestinyMembershipDataStore";
import { FireteamPage } from "@Areas/Fireteams/FireteamPage";
import { FireteamClanTags } from "@Areas/Fireteams/Shared/FireteamClanTags";
import { FireteamCreationTime } from "@Areas/Fireteams/Shared/FireteamCreationTime";
import styles from "@Areas/Fireteams/Shared/FireteamListItem.module.scss";
import { FireteamOwnerStatTags } from "@Areas/Fireteams/Shared/FireteamOwnerStatTags";
import { FireteamTimeTag } from "@Areas/Fireteams/Shared/FireteamTimeTag";
import { FireteamPlatformTag } from "@Areas/Fireteams/Shared/FireteamPlatformTag";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization/Localizer";
import { BungieMembershipType, IgnoredItemType } from "@Enum";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import { Fireteam } from "@Platform";
import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar";
import { GoAlert } from "@react-icons/all-files/go/GoAlert";
import { IoMdLink } from "@react-icons/all-files/io/IoMdLink";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { ReportItem } from "@UI/Report/ReportItem";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { StringUtils } from "@Utilities/StringUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import React, { useState } from "react";

interface FireteamListItemProps {
  fireteamHostMembershipType?: BungieMembershipType;
  fireteamSummary: Fireteam.FireteamSummary;
  fireteamModalClosedFn: () => void;
}

export const FireteamListItem: React.FC<FireteamListItemProps> = (props) => {
  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);
  const destinyMembership = useDataStore(FireteamsDestinyMembershipDataStore);
  const fireteamsLoc = Localizer.Fireteams;
  const fireteamActivityDefs = globalState.coreSettings.fireteamActivities;
  const [updating, setUpdating] = useState(false);

  const playerSlot = (
    fireteamSummary: Fireteam.FireteamSummary,
    isUsed: boolean,
    index: number
  ) => {
    return (
      <div
        key={`${fireteamSummary.fireteamId}-${index}`}
        className={classNames(styles.playerSlot, { [styles.used]: isUsed })}
      />
    );
  };

  const playerSlots = (fireteamSummary: Fireteam.FireteamSummary) => {
    const playerSlotsArray = [];
    const slotsTaken =
      fireteamSummary.playerSlotCount -
      fireteamSummary.availablePlayerSlotCount;

    for (let i = 0; i < fireteamSummary.playerSlotCount; i++) {
      playerSlotsArray.push(playerSlot(fireteamSummary, i < slotsTaken, i));
    }

    return playerSlotsArray;
  };

  const openReportModal = () => {
    const reportModal = Modal.open(
      <ReportItem
        ignoredItemId={props.fireteamSummary.fireteamId}
        reportType={IgnoredItemType.Fireteam}
        title={Localizer.Fireteams.WhyAreYouReportingThis}
        onReset={() => reportModal.current.close()}
      />
    );
  };

  const openFireteamModal = (groupId: string, fireteamId: string) => {
    const fireteamModal = Modal.open(
      <FireteamPage
        fireteamId={fireteamId}
        groupId={groupId}
        fireteamUpdatedFc={() => {
          setUpdating(true);
        }}
        closeFn={() => {
          fireteamModal?.current.close();
        }}
      />,
      { contentClassName: styles.fireteamModalContent }
    );
  };

  const isOwnedFireteam =
    UserUtils.isAuthenticated(globalState) &&
    destinyMembership?.memberships?.some(
      (m) => m.membershipId === props.fireteamSummary.ownerMembershipId
    );

  //fireteamActivityType is not kept current compared to the config; so DO NOT compare based on FireteamActivityType enum key
  const fireteamActivityDef = fireteamActivityDefs.find(
    (f) => f.identifier === props.fireteamSummary.activityType.toString()
  );

  return (
    <li
      className={classNames(
        styles.itemFireteam,
        { [styles.isPublic]: props.fireteamSummary.isPublic },
        { [styles.isNotValid]: !props.fireteamSummary.isValid }
      )}
      key={props.fireteamSummary.fireteamId}
    >
      {updating && (
        <div className={styles.updateString}>
          {fireteamsLoc.UpdatesMayTakeAFewMinutes}
        </div>
      )}
      <div
        className={styles.itemFireteamCard}
        onClick={() =>
          openFireteamModal(
            props.fireteamSummary.groupId,
            props.fireteamSummary.fireteamId
          )
        }
      >
        <span
          className={styles.activityIcon}
          style={{
            backgroundImage: `url(${
              fireteamActivityDef?.imagePath ??
              "/img/theme/destiny/icons/fireteams/fireteamAnything.png"
            })`,
          }}
        />
        <div className={styles.fireteamContent}>
          <div className={styles.fireteamDetails}>
            <p className={styles.title}>
              {StringUtils.decodeHtmlEntities(props.fireteamSummary.title)}
            </p>
            <div className={styles.fireteamMeta}>
              {!isOwnedFireteam && !globalState.responsive.mobile && (
                <span
                  className={styles.reportButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    openReportModal();
                  }}
                >
                  <GoAlert />
                  {fireteamsLoc.ReportFireteam}
                </span>
              )}
              <Anchor
                className={styles.permaLink}
                onClick={(e) => e.stopPropagation()}
                url={RouteHelper.NewFireteam({
                  fireteamId: props.fireteamSummary?.fireteamId,
                })}
                target={"_blank"}
              >
                <IoMdLink />
              </Anchor>
              {isOwnedFireteam && (
                <span className={styles.creatorLabel}>
                  <AiFillStar />
                  {fireteamsLoc.FireteamCreator}
                </span>
              )}
              <FireteamCreationTime fireteamSummary={props.fireteamSummary} />
            </div>
          </div>
          <div className={styles.playerSlots}>
            {playerSlots(props.fireteamSummary)}
          </div>
          <div className={styles.badgeContainer}>
            <FireteamPlatformTag fireteamSummary={props.fireteamSummary} />
            <FireteamTimeTag
              fireteamSummary={props.fireteamSummary}
              addToCalendarAvailable={false}
            />
            <FireteamClanTags fireteamSummary={props.fireteamSummary} />
            <FireteamOwnerStatTags
              highestLifetimeGuardianRank={
                props.fireteamSummary.ownerHighestLifetimeGuardianRankSnapshot
              }
              currentGuardianRank={
                props.fireteamSummary.ownerCurrentGuardianRankSnapshot
              }
              totalCommendationScore={
                props.fireteamSummary.ownerTotalCommendationScoreSnapshot
              }
            />
          </div>
        </div>
      </div>
    </li>
  );
};
