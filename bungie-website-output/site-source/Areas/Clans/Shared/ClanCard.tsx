// Created by atseng, 2022
// Copyright Bungie, Inc.

import { ClanBannerCardIcon } from "@Areas/Clans/Shared/ClanBannerCardIcon";
import { Localizer } from "@bungie/localization/Localizer";
import { IgnoredItemType, MembershipOption } from "@Enum";
import { GroupsV2 } from "@Platform";
import { RouteHelper } from "@Routes/RouteHelper";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { Anchor } from "@UI/Navigation/Anchor";
import { ReportClan } from "@UI/Report/ReportClan";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfirmationModalInline } from "@UIKit/Controls/Modal/ConfirmationModal";
import { BasicSize } from "@UIKit/UIKitUtils";
import React, { useState } from "react";
import styles from "./ClanCard.module.scss";

interface ClanCardProps {
  clan: GroupsV2.GroupV2Card;
  isLoggedIn: boolean;
}

export const ClanCard: React.FC<ClanCardProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSendReport, setConfirmSendReport] = useState(false);

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
                      setModalOpen(true);
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
      <ConfirmationModalInline
        type={"none"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        confirmButtonProps={{
          labelOverride: clansLoc.ReportClanProfile,
          onClick: () => {
            setConfirmSendReport(true);

            return true;
          },
        }}
      >
        <ReportClan
          sendReport={confirmSendReport}
          sentReport={() => setModalOpen(false)}
          ignoredItemId={props.clan.groupId}
          reportType={IgnoredItemType.GroupProfile}
        />
      </ConfirmationModalInline>
    </li>
  );
};
