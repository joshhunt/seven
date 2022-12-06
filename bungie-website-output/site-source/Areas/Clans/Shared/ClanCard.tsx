// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ClanBannerCardIcon } from "@Areas/Clans/Shared/ClanBannerCardIcon";
import { Localizer } from "@bungie/localization/Localizer";
import { IgnoredItemType, MembershipOption } from "@Enum";
import { GroupsV2 } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { ReportItem } from "@UI/Report/ReportItem";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";
import styles from "./ClanCard.module.scss";

interface ClanCardProps {
  clan: GroupsV2.GroupV2Card;
  isLoggedIn: boolean;
}

export const ClanCard: React.FC<ClanCardProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const membershipOption = () => {
    switch (props.clan.membershipOption) {
      case MembershipOption.Reviewed:
        return clansLoc.AdminApproval;
      case MembershipOption.Closed:
        return clansLoc.InviteOnly;
      case MembershipOption.Open:
        return clansLoc.OpenToNewMembers;
    }
  };

  const reportClan = (itemId: string) => {
    const modal = Modal.open(
      <ReportItem
        ignoredItemId={itemId}
        reportType={IgnoredItemType.GroupProfile}
        title={clansLoc.ReportClanProfile}
        onReset={() => modal.current.close()}
      />
    );
  };

  return (
    <li className={styles.cardListItem}>
      <Anchor
        url={RouteHelper.Clan(props.clan.groupId)}
        className={styles.cardContent}
      >
        <div className={styles.cardHeader}>
          <ClanBannerCardIcon clan={props.clan} />
          <div className={styles.cardHeaderDetails}>
            <div className={styles.cardTitle}>
              <p>{props.clan.name}</p>
              {props.isLoggedIn && (
                <>
                  <Button
                    buttonType={"none"}
                    size={BasicSize.Tiny}
                    className={styles.btnReport}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      reportClan(props.clan.groupId);
                    }}
                  >{`[${clansLoc.ClanReport}]`}</Button>
                </>
              )}
            </div>
            <div className={styles.cardSubtitle}>
              <p>{props.clan.motto}</p>
            </div>
          </div>
        </div>
        <div className={styles.cardAbout}>
          <p>
            <SafelySetInnerHTML
              html={props.clan.about.replace("\r\n", "<br/>")}
            />
          </p>
        </div>
        <div className={styles.cardMeta}>
          <p>
            {props.clan.memberCount}{" "}
            {props.clan.memberCount === 1 ? clansLoc.Member : clansLoc.Members}
          </p>
          <p>{membershipOption()}</p>
        </div>
      </Anchor>
    </li>
  );
};
