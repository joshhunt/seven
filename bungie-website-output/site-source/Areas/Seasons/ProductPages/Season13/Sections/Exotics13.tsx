// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@Global/DataStore";
import { Localizer } from "@Global/Localization/Localizer";
import { Platform } from "@Platform";
import { MarketingTitles } from "@UI/Marketing/MarketingTitles";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { ContentUtils, IMarketingMediaAsset } from "@Utilities/ContentUtils";
import { StringUtils } from "@Utilities/StringUtils";
import classNames from "classnames";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./Exotics13.module.scss";

interface Exotics13Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

export const Exotics13: React.FC<Exotics13Props> = (props) => {
  const [exoticQuestItem, setExoticQuestItem] = useState<
    IMarketingMediaAsset
  >();
  const s13 = Localizer.Season13;
  const imgDir = "/7/ca/destiny/bgs/season13/";
  const responsive = useDataStore(Responsive);
  const isRedacted = StringUtils.isNullOrWhiteSpace(exoticQuestItem?.videoId);

  useEffect(() => {
    Platform.ContentService.GetContentByTagAndType(
      "exotic-quest-chosen",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    ).then((item) => {
      const exoticQuest = ContentUtils.marketingMediaAssetFromContent(item);
      setExoticQuestItem(exoticQuest);
    });
  }, []);

  const showVideo = (videoId: string) => {
    if (!isRedacted) {
      if (responsive.medium) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.location.href = videoUrl;
      } else {
        YoutubeModal.show({ videoId });
      }
    }
  };

  return (
    <div id={"exoticsGear"} ref={props.inputRef} className={styles.container}>
      <MarketingTitles
        alignment={"center"}
        sectionTitle={s13.gearTitle}
        smallTitle={Localizer.destiny.submenu_exoticsGear}
      />
      <Grid isTextContainer={true}>
        <GridCol
          cols={6}
          mobile={12}
          className={styles.exoticBlock}
          style={{
            backgroundImage: responsive.tiny
              ? `url(${exoticQuestItem?.imageThumbnail})`
              : `url(${exoticQuestItem?.largeImage})`,
          }}
        >
          <div
            className={!isRedacted ? styles.clickable : null}
            onClick={() => showVideo(exoticQuestItem?.videoId)}
            role={"link"}
          >
            <div className={styles.clickableVideoButton} />
            <div className={styles.smallTitle}>{exoticQuestItem?.subtitle}</div>
            <div className={styles.exoticTitle}>{exoticQuestItem?.title}</div>
            <p
              className={styles.blurb}
              dangerouslySetInnerHTML={{ __html: exoticQuestItem?.textBlock }}
            />
          </div>
        </GridCol>
        <GridCol
          cols={6}
          mobile={12}
          className={styles.exoticBlock}
          style={{
            backgroundImage: responsive.tiny
              ? `url(${imgDir}gear_exotic_bow_mobile2.jpg)`
              : `url(${imgDir}gear_exotic_bow.jpg)`,
          }}
        >
          <div className={styles.smallTitle}>{s13.ExoticBow}</div>
          <div className={styles.exoticTitle}>{s13.ExoticBowTitle}</div>
          <p className={styles.blurb}>{s13.ExoticBowBlurb}</p>
        </GridCol>
        <GridCol
          cols={6}
          mobile={12}
          className={styles.exoticBlock}
          style={{
            backgroundImage: responsive.tiny
              ? `url(${imgDir}gear_weapons_mobile2.jpg)`
              : `url(${imgDir}gear_weapons_bg_desktop2.jpg)`,
          }}
        >
          <div className={styles.smallTitle}>{s13.PowerGathered}</div>
          <div className={styles.exoticTitle}>{s13.WeaponsOrnaments}</div>
          <p className={styles.blurb}>{s13.WeaponsOrnamentsBlurb}</p>
        </GridCol>
        <GridCol
          cols={6}
          mobile={12}
          className={styles.exoticBlock}
          style={{
            backgroundImage: responsive.tiny
              ? `url(${imgDir}gear_umbral_engrams_mobile2.jpg)`
              : `url(${imgDir}gear_umbral_engrams.jpg)`,
          }}
        >
          <div className={styles.smallTitle}>{s13.PowerUnlocked}</div>
          <div className={styles.exoticTitle}>{s13.UmbralEngrams}</div>
          <p className={styles.blurb}>{s13.UmbralEngramsBlurb}</p>
        </GridCol>
        <GridCol
          cols={12}
          mobile={12}
          className={classNames(styles.exoticBlock, styles.left)}
          style={{
            backgroundImage: responsive.tiny
              ? `url(${imgDir}gear_artifact_mobile2.jpg)`
              : `url(${imgDir}gear_artifact.jpg)`,
          }}
        >
          <div className={styles.shade} />
          <div className={styles.smallTitle}>{s13.SeasonalArtifact}</div>
          <div className={styles.exoticTitle}>{s13.BellOfConquests}</div>
          <p className={styles.blurb}>{s13.BellBlurb}</p>
        </GridCol>
      </Grid>
    </div>
  );
};
