// Created by atseng, 2020
// Copyright Bungie, Inc.

import styles from "@Areas/Admin/Shared/ReportsSidebar.module.scss";
import { Button } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import React from "react";

interface ReportsSidebarProps {
  itemsCount: number;
  refreshPageFn?: () => void;
}

export const ReportsSidebar: React.FC<ReportsSidebarProps> = (props) => {
  const someReportsAutoGenerated = `Some reports are auto generated based on Bungie-configured triggers rather than user reports. These allow us to be on the look out for conversations that tend to go bad, but merely tripping the trigger does not automatically mean a ban is required. Evaluate these like any other report.`;
  const resolveNoAction = `You may also mark an item as "Resolve No Action". This does not mark a user guilty, but it also does not punish those who reported the item. You should use this ton especially on items that have already been manually moderated.`;
  const blastRadiusBan = `You may sometimes select a "blast radius" ban, where all posts made by the user in a 1 hour radius around the reported post are permanently removed as well.  This tool should be used only for combating overwhelming spam attacks where it is more important to clear the content fast, as the extra posts removed.`;
  const guiltyVerdictsRemove = `Guilty verdicts remove the offending content, and will ban the user responsible, unless you select the warn option. Note that bans will notifiy users about why they were banned and for how long, with the exception of permanent bans, which do not notify the user.`;
  const multipleReportTypes = `There are multiple types of reports that can appear. They include posts, tags, group profiles, user profiles, and private messages.
Each has specific considerations, read the instructions carefully. For example, don't alias a tag unless the tag violates the code of conduct - which it almost
never will.`;
  const refreshItemList = `Refresh your item list.`;
  const youHaveNum = `You have ${props.itemsCount} items waiting for your review.`;

  return (
    <div>
      <ul className={styles.SidebarList}>
        {props.itemsCount !== 0 && props.refreshPageFn && (
          <li className={styles.SidebarItem}>
            {youHaveNum}
            <Button
              buttonType={"gold"}
              size={BasicSize.Small}
              onClick={() => props.refreshPageFn()}
            >
              {refreshItemList}
            </Button>
          </li>
        )}
        <li className={styles.SidebarItem}>{multipleReportTypes}</li>
        <li className={styles.SidebarItem}>{guiltyVerdictsRemove}</li>
        <li className={styles.SidebarItem}>{blastRadiusBan}</li>
        <li className={styles.SidebarItem}>{resolveNoAction}</li>
        <li className={styles.SidebarItem}>{someReportsAutoGenerated}</li>
      </ul>
    </div>
  );
};
