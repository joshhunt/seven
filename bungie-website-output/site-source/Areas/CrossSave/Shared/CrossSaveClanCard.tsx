// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./CrossSaveClanCard.module.scss";
import { GroupsV2 } from "@Platform";
import { Localizer } from "@Global/Localization/Localizer";

interface ICrossSaveClanCardProps {
  clan: GroupsV2.GroupMembership;
}

interface ICrossSaveClanCardState {}

/**
 * CrossSaveClanCard - Small card showing clan avatar, clan name, and clan game
 *  *
 * @param {ICrossSaveClanCardProps} props
 * @returns
 */
export class CrossSaveClanCard extends React.Component<
  ICrossSaveClanCardProps,
  ICrossSaveClanCardState
> {
  constructor(props: ICrossSaveClanCardProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { clan } = this.props;

    return (
      <div className={styles.flexContainer}>
        <img src={clan.group.avatarPath} className={styles.clanAvatar} />
        <div className={styles.wordContainer}>
          <div className={styles.title}> {clan.group.name} </div>
          <div className={styles.subtitle}>
            {" "}
            {Localizer.Crosssave.ClanSubtitle}{" "}
          </div>
        </div>
      </div>
    );
  }
}
