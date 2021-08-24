// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { Localizer } from "@bungie/localization";
import * as Globals from "@Enum";
import styles from "./MenuItem.module.scss";
import classNames from "classnames";

interface IClanMenuItemProps {
  clan: any;
  isCrossSaved: boolean;
  isInactiveCrossSaved: boolean;
}

/**
 * ClanMenuItem - Clan item in React version of Nav
 *  *
 * @param {IClanMenuItemProps} props
 * @returns
 */
export class ClanMenuItem extends React.Component<IClanMenuItemProps> {
  constructor(props: IClanMenuItemProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { clan, isCrossSaved, isInactiveCrossSaved } = this.props;

    const clanLink = `/${Localizer.CurrentCultureName}/ClanV2/Chat?groupid=${clan.group.groupId}`;
    let iconPath = "";
    let iconClass;

    if (isCrossSaved) {
      iconPath = isInactiveCrossSaved
        ? "/img/theme/bungienet/icons/icon_inactive_clan.png"
        : "/img/theme/bungienet/icons/icon_cross_save_dark.png";
      iconClass = isInactiveCrossSaved
        ? styles.inactiveClanIcon
        : styles.crossSaveIcon;
    }

    return (
      <div>
        <a
          href={clanLink}
          className={classNames(styles.menuItem, styles.multiClan)}
        >
          {isCrossSaved ? (
            <React.Fragment>
              <img
                src={iconPath}
                className={classNames(iconClass, styles.icon)}
              />
              <span className={isInactiveCrossSaved ? styles.inactiveName : ""}>
                {clan.group.name}
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p
                className={styles.platformType}
                data-platform={
                  Globals.BungieMembershipType[
                    clan.member.destinyUserInfo.membershipType
                  ]
                }
              >
                {
                  Localizer.Shortplatforms[
                    Globals.BungieMembershipType[
                      clan.member.destinyUserInfo.membershipType
                    ].toLowerCase()
                  ]
                }
              </p>
              <span className={isInactiveCrossSaved ? styles.inactiveName : ""}>
                {clan.group.name}
              </span>
            </React.Fragment>
          )}
        </a>
      </div>
    );
  }
}
