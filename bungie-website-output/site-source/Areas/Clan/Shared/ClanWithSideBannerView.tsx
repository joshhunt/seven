// Created by atseng, 2023
// Copyright Bungie, Inc.

import styles from "@Areas/Clan/Shared/ClanWithSideBannerView.module.scss";
import { SystemNames } from "@Global/SystemNames";
import { RouteHelper } from "@Routes/RouteHelper";
import { ClanBannerDisplay, ClanBannerProps } from "@UI/Destiny/ClanBanner";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";

interface ClanWithSideBannerViewProps {
  clanId: string;
  clanBannerProps: ClanBannerProps;
  className?: string;
  clanBannerContainerClassName?: string;
  clanContentContainerClassName?: string;
}

export const ClanWithSideBannerView: React.FC<ClanWithSideBannerViewProps> = (
  props
) => {
  const [fadeBanner, setFadeBanner] = useState(false);

  const observedElemRef = useRef<HTMLDivElement>(null);

  const scrollHandler = () => {
    const viewportHeight = window.innerHeight;
    const scrolledPosition = observedElemRef?.current?.getBoundingClientRect()
      ?.top;

    setFadeBanner(scrolledPosition < viewportHeight / 2);
  };

  if (!ConfigUtils.SystemStatus(SystemNames.ClanReactUI)) {
    window.location.href = RouteHelper.Clan(props.clanId).url;

    return null;
  }

  useEffect(() => {
    window.addEventListener("scroll", () => scrollHandler());

    return () => {
      window.removeEventListener("scroll", () => scrollHandler());
    };
  }, []);

  return (
    <div className={classNames(styles.clanContentContainer, props.className)}>
      <div
        className={classNames(
          styles.clanBannerContainerClassName,
          props.clanBannerContainerClassName,
          { [styles.hideBanner]: fadeBanner }
        )}
      >
        <ClanBannerDisplay
          bannerSettings={props.clanBannerProps.bannerSettings}
          className={classNames(
            styles.clanBannerDisplay,
            props.clanBannerProps.className
          )}
          showStaff={props.clanBannerProps.showStaff}
          replaceCanvasWithImage={props.clanBannerProps.replaceCanvasWithImage}
          updateAble={props.clanBannerProps.updateAble}
          updatedBannerSettings={props.clanBannerProps.updatedBannerSettings}
        />
      </div>
      <div
        className={classNames(
          styles.clanContentContainerClassName,
          props.clanContentContainerClassName
        )}
        ref={(el) => {
          observedElemRef.current = el;
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
