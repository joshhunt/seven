// Created by atseng, 2022
// Copyright Bungie, Inc.

import styles from "@Areas/Clans/Shared/ClanBannerIcon.module.scss";
import { ClanBannerUtils } from "@Areas/Clans/Shared/ClanBannerUtils";
import { ClanBanner, GroupsV2, Platform } from "@Platform";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface ClanBannerCardIconProps {
  clan: GroupsV2.GroupV2Card;
}

export const ClanBannerCardIcon: React.FC<ClanBannerCardIconProps> = (
  props
) => {
  const bannerIconData = props.clan.clanInfo.clanBannerData;
  const maskBgId = `mask-bg-${props.clan.groupId}`;
  const maskFgId = `mask-fg-${props.clan.groupId}`;

  const [clanBannerSource, setClanBannerSource] = useState<
    ClanBanner.ClanBannerSource
  >(null);

  //load clan banner data
  useEffect(() => {
    if (clanBannerSource === null) {
      Platform.Destiny2Service.GetClanBannerSource().then((clanData) => {
        setClanBannerSource(clanData);
      });
    }
  }, []);

  if (!clanBannerSource) {
    return null;
  }

  const bgColor = ClanBannerUtils.getColorStringFromBannerSource(
    clanBannerSource.clanBannerGonfalonColors,
    props.clan.clanInfo.clanBannerData.gonfalonColorId
  );
  const decalBgColor = ClanBannerUtils.getColorStringFromBannerSource(
    clanBannerSource.clanBannerDecalSecondaryColors,
    props.clan.clanInfo.clanBannerData.decalBackgroundColorId
  );
  const decalColor = ClanBannerUtils.getColorStringFromBannerSource(
    clanBannerSource.clanBannerDecalPrimaryColors,
    bannerIconData.decalColorId
  );
  const squareIconPathBg = ClanBannerUtils.getDecalFromBannerSource(
    clanBannerSource.clanBannerDecalsSquare,
    props.clan.clanInfo.clanBannerData.decalId
  );
  const squareIconPath = ClanBannerUtils.getDecalFromBannerSource(
    clanBannerSource.clanBannerDecalsSquare,
    bannerIconData.decalId
  );

  return (
    <div className={styles.clanBannerIconWrapper}>
      <div
        className={styles.clanBannerIcon}
        style={{
          backgroundColor: `rgba(${bgColor}`,
        }}
      >
        <div
          className={styles.iconBgIcon}
          style={{
            mask: `url(#mask-bg-${props.clan.groupId})`,
            backgroundColor: `rgba(${decalBgColor})`,
            WebkitMaskBoxImage: `url(${squareIconPathBg})`,
          }}
        />
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="52"
          height="52"
        >
          <mask id={maskBgId}>
            <image
              id="img"
              xlinkHref={squareIconPathBg.backgroundPath}
              x="0"
              y="0"
              height="52px"
              width="52px"
            />
          </mask>
        </svg>
        <div
          className={classNames(styles.iconFg, styles.icon)}
          style={{
            mask: `url(#mask-fg-${props.clan.groupId})`,
            backgroundColor: `rgba(${decalColor})`,
            WebkitMaskBoxImage: `url(${squareIconPath.foregroundPath})`,
          }}
        />
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="52"
          height="52"
        >
          <mask id={maskFgId}>
            <image
              id="img"
              xlinkHref={squareIconPath.foregroundPath}
              x="0"
              y="0"
              height="52px"
              width="52px"
            />
          </mask>
        </svg>
      </div>
    </div>
  );
};
