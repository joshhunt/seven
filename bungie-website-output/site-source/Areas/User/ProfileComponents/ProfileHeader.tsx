// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/Profile.module.scss";
import { Localizer } from "@bungie/localization";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { DateTime } from "luxon";
import React from "react";

interface ProfileHeaderProps {
  bungieDisplayName: string;
  bungieGlobalCodeWithHash: string;
  status: string;
  profileThemePath: string;
  avatarPath: string;
  joinDate: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  let dateString = "";
  let monthString = "";

  if (props.joinDate.length) {
    const { day, month, year } = DateTime.fromISO(props.joinDate);
    monthString = Localizer.time[`MonthFull${month}`];
    dateString = Localizer.Format(Localizer.Time.MonthDayYear, {
      day: day,
      month: monthString,
      year: year,
    });
  }

  const joinDateString = props.joinDate.length
    ? Localizer.Format(Localizer.Profile.JoinedDate, { date: dateString })
    : "";

  return (
    <div
      className={styles.profileBanner}
      style={{
        backgroundImage:
          props.profileThemePath !== ""
            ? props.profileThemePath
            : `url(/img/UserThemes/d2cover/header.jpg)`,
      }}
    >
      <Grid>
        <GridCol cols={12} className={styles.userSection}>
          <img
            src={
              props.avatarPath !== ""
                ? props.avatarPath
                : "/img/profile/avatars/Destiny26.jpg"
            }
            alt={props.bungieDisplayName}
          />
          <h2>
            {props.bungieDisplayName}
            <span className={styles.uniqueName}>
              {props.bungieGlobalCodeWithHash}
            </span>
          </h2>
          {props.status && <p className={styles.status}>{props.status}</p>}
          {joinDateString && <p>{joinDateString}</p>}
        </GridCol>
      </Grid>
    </div>
  );
};
