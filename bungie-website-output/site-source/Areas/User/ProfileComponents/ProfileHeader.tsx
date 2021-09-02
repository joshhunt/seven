// Created by atseng, 2021
// Copyright Bungie, Inc.

import styles from "@Areas/User/Profile.module.scss";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { StringUtils } from "@Utilities/StringUtils";
import React from "react";

interface ProfileHeaderProps {
  bungieDisplayName: string;
  bungieGlobalCodeWithHash: string;
  status: string;
  profileThemePath: string;
  avatarPath: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
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
          <p>{status}</p>
        </GridCol>
      </Grid>
    </div>
  );
};
