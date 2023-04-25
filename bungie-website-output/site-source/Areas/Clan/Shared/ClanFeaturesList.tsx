// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanFeaturesList.module.scss";
import { Localizer } from "@bungie/localization/Localizer";
import { MembershipOption } from "@Enum";
import { EnumUtils } from "@Utilities/EnumUtils";
import classNames from "classnames";
import { DateTime } from "luxon";
import React from "react";

interface ClanFeaturesListProps {
  membershipOption: MembershipOption;
  memberCount: number;
  creationDate: string;
}

export const ClanFeaturesList: React.FC<ClanFeaturesListProps> = (props) => {
  const clansLoc = Localizer.Clans;

  const clanMembershipOptionLabel = (membershipOption: MembershipOption) => {
    switch (membershipOption) {
      case MembershipOption.Closed:
        return (
          <>
            <h3>{clansLoc.InviteOnly}</h3>
            <span>{clansLoc.InviteDescription}</span>
          </>
        );

      case MembershipOption.Open:
        return (
          <>
            <h3>{clansLoc.OpenToNewMembers}</h3>
          </>
        );

      case MembershipOption.Reviewed:
        return (
          <>
            <h3>{clansLoc.AdminApproval}</h3>
            <span>{clansLoc.ApprovalDescription}</span>
          </>
        );
    }
  };

  const clanMembershipOption = (membershipOption: MembershipOption) => {
    return (
      <li
        className={classNames(
          styles.membershipOption,
          styles[EnumUtils.getStringValue(membershipOption, MembershipOption)]
        )}
      >
        {clanMembershipOptionLabel(membershipOption)}
      </li>
    );
  };

  return (
    <ul className={styles.clanDetailsList}>
      {clanMembershipOption(props.membershipOption)}
      {props.memberCount && (
        <li className={styles.membercount}>
          <h3>
            {Localizer.Format(
              props.memberCount === 1
                ? clansLoc.MembercountMember
                : clansLoc.MembercountMembers,
              { memberCount: props.memberCount }
            )}
          </h3>
        </li>
      )}
      {props.creationDate && (
        <li className={styles.creation}>
          <h3>
            {Localizer.Format(clansLoc.CreatedCreationdate, {
              creationDate: DateTime.fromISO(props.creationDate).toFormat(
                "MMMM dd, yyyy"
              ),
            })}
          </h3>
        </li>
      )}
    </ul>
  );
};
