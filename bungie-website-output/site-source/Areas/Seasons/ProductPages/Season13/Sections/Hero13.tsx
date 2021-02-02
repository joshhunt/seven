// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { SystemNames } from "@Global/SystemNames";
import { Img } from "@Helpers";
import { RouteHelper } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { Icon } from "@UIKit/Controls/Icon";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./Hero13.module.scss";
import { Localizer } from "@Global/Localization/Localizer";

type LayerName = "backgroundTwo" | "backgroundThree" | "backgroundFour";
type HeroLayerPos = {
  [Layer in LayerName]: string;
};

interface Hero13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Hero13: React.FC<Hero13Props> = (props) => {
  const [heroBg, setHeroBg] = useState<HeroLayerPos>({
    backgroundTwo: null,
    backgroundThree: null,
    backgroundFour: null,
  });

  const trailerJsonParamToLocalizedValue = (
    paramName: string
  ): string | null => {
    const trailerString = ConfigUtils.GetParameter(
      SystemNames.Season13Page,
      paramName,
      "{}"
    ).replace(/'/g, '"');
    const trailerData = JSON.parse(trailerString);

    return (
      trailerData[Localizer.CurrentCultureName] ?? trailerData["en"] ?? null
    );
  };

  const responsive = useDataStore(Responsive);
  const trailerAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season13Page,
    "Season13TrailerAnalyticsId",
    ""
  );
  const playNowAnalyticsId = ConfigUtils.GetParameter(
    SystemNames.Season13Page,
    "Season13BuyAnalyticsId",
    ""
  );
  const heroTrailer = trailerJsonParamToLocalizedValue("HeroTrailer");

  useEffect(() => {
    window.addEventListener("mousemove", (e) => parallax(e));

    return () => window.removeEventListener("mousemove", (e) => parallax(e));
  }, []);

  const parallax = (e) => {
    requestAnimationFrame(() => {
      const xMidpointDistance = window?.innerWidth / 2 - e.clientX;
      const yMidpointDistance = window?.innerHeight / 2 - e.clientY;

      const backgroundTwo = `${xMidpointDistance * 0.0008}%, ${
        yMidpointDistance * 0.0016
      }%`;
      const backgroundThree = `${xMidpointDistance * 0.0015}%, ${
        yMidpointDistance * 0.003
      }%`;
      const backgroundFour = `${xMidpointDistance * 0.003}%, ${
        yMidpointDistance * 0.004
      }%`;

      setHeroBg({
        backgroundTwo,
        backgroundThree,
        backgroundFour,
      });
    });
  };

  return (
    <div className={styles.hero} id={"hero"} ref={props.inputRef}>
      {responsive.mobile ? (
        <img
          className={classNames(styles.mobileBg, styles.bg)}
          src={Img("/destiny/bgs/season13/hero_bg_mobile_2.jpg")}
        />
      ) : (
        <>
          <img
            className={classNames(styles.backgroundOne, styles.bg)}
            src={Img("/destiny/bgs/season13/s13_hero_1_bg.jpg")}
          />
          <img
            className={classNames(styles.backgroundTwo, styles.bg)}
            src={Img("/destiny/bgs/season13/s13_hero_2_bg.png")}
            style={{ transform: `translate(${heroBg.backgroundTwo})` }}
          />
          <img
            className={classNames(styles.backgroundThree, styles.bg)}
            src={Img("/destiny/bgs/season13/s13_hero_3_mid.png")}
            style={{ transform: `translate(${heroBg.backgroundThree})` }}
          />
          <img
            className={classNames(styles.backgroundFour, styles.bg)}
            src={Img("/destiny/bgs/season13/s13_hero_4_front.png")}
            style={{ transform: `translate(${heroBg.backgroundFour})` }}
          />
        </>
      )}
      <div className={styles.heroContent}>
        <div
          className={styles.seasonLogo}
          style={{
            backgroundImage: `url(/7/ca/destiny/bgs/season13/logos/logo_${Localizer.CurrentCultureName}.png)`,
          }}
        />
        <div className={styles.heroButtons}>
          {heroTrailer && (
            <div
              data-analytics-id={trailerAnalyticsId}
              className={styles.button}
              onClick={() => YoutubeModal.show({ videoId: heroTrailer })}
              role={"button"}
            >
              <div className={styles.trailer}>
                <Icon
                  className={styles.playIcon}
                  iconType={"material"}
                  iconName={"play_arrow"}
                />
                <div className={styles.trailerTitle}>
                  {Localizer.season13.trailerTitle}
                </div>
              </div>
            </div>
          )}
          <Anchor
            url={RouteHelper.DestinyBuy()}
            data-analytics-id={playNowAnalyticsId}
            className={styles.button}
          >
            <div className={styles.playNow}>
              <div className={styles.trailerTitle}>
                {Localizer.season13.buyTitle}
              </div>
            </div>
          </Anchor>
        </div>
        <div className={styles.dates}>{Localizer.season13.dates}</div>
      </div>
    </div>
  );
};
