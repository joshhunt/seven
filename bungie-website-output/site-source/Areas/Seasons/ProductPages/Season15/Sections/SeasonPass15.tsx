// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season15/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { SystemNames } from "@Global/SystemNames";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { Info } from "luxon";
import React, { LegacyRef, useState } from "react";
import styles from "./SeasonPass15.module.scss";

const trailerJsonParamToLocalizedValue = (paramName: string): string | null => {
  const trailerString = ConfigUtils.GetParameter(
    SystemNames.Season15Page,
    paramName,
    "{}"
  ).replace(/'/g, '"');
  const trailerData = JSON.parse(trailerString);

  return trailerData[Localizer.CurrentCultureName] ?? trailerData["en"] ?? null;
};

interface SeasonPass15Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

const SeasonPass15: React.FC<SeasonPass15Props> = (props) => {
  const s15 = Localizer.Season15;
  const infoBlockScreenshots = [
    "/7/ca/destiny/bgs/season15/s15_season_pass_img_1_1080.jpg",
    "/7/ca/destiny/bgs/season15/s15_season_pass_img_2_1080.jpg",
    "/7/ca/destiny/bgs/season15/s15_season_pass_img_3_1080.jpg",
  ];

  const handleImgClick = (imgIndex: number) => {
    ImagePaginationModal.show({
      images: infoBlockScreenshots,
      imgIndex: imgIndex,
    });
  };

  return (
    <div className={styles.seasonPassSection}>
      <div
        className={styles.sectionIdAnchor}
        id={"seasonPass"}
        ref={props.inputRef}
      />
      <div className={styles.sectionBg} />
      <div className={styles.contentWrapperNormal}>
        <LazyLoadWrapper>
          <SectionHeader
            title={s15.SeasonPassHeading}
            seasonText={s15.SectionHeaderSeasonText}
            sectionName={s15.GearSectionName}
            isBold={true}
          />
          <div className={styles.blurbAndVideo}>
            <div className={styles.seasonBlurb}>
              <p
                className={styles.paragraphLarge}
                dangerouslySetInnerHTML={sanitizeHTML(s15.SeasonPassBlurb)}
              />
            </div>
          </div>
        </LazyLoadWrapper>
        <div className={styles.infoBlocksWrapper}>
          <InfoBlock15
            blurb={s15.SeasonPassBlockBlurb1}
            title={s15.SeasonPassBlockHeading1}
            thumbnail={"/7/ca/destiny/bgs/season15/s15_season_pass_img_1.jpg"}
            screenshot={infoBlockScreenshots[0]}
            onClick={() => handleImgClick(0)}
          />
          <InfoBlock15
            blurb={s15.SeasonPassBlockBlurb2}
            title={s15.SeasonPassBlockHeading2}
            thumbnail={"/7/ca/destiny/bgs/season15/s15_season_pass_img_2.jpg"}
            screenshot={infoBlockScreenshots[1]}
            onClick={() => handleImgClick(1)}
          />
          <InfoBlock15
            blurb={s15.SeasonPassBlockBlurb3}
            title={s15.SeasonPassBlockHeading3}
            thumbnail={"/7/ca/destiny/bgs/season15/s15_season_pass_img_3.jpg"}
            screenshot={infoBlockScreenshots[2]}
            onClick={() => handleImgClick(2)}
          />
        </div>
      </div>
    </div>
  );
};

interface IInfoBlock15 {
  blurb: string;
  title: string;
  thumbnail: string;
  screenshot: string;
  onClick: () => void;
}

const InfoBlock15 = (props: IInfoBlock15) => {
  return (
    <div className={styles.infoBlock}>
      <div
        className={styles.blockImg}
        style={{ backgroundImage: `url(${props.thumbnail})` }}
        onClick={props.onClick}
      />
      <div className={styles.blockText}>
        <h4>{props.title}</h4>
        <p className={styles.paragraph}>{props.blurb}</p>
      </div>
    </div>
  );
};

export default SeasonPass15;
