// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season14/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { Localizer } from "@Global/Localization/Localizer";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import React, { LegacyRef, useState } from "react";
import styles from "./SeasonPass14.module.scss";

interface SeasonPass14Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

const SeasonPass14: React.FC<SeasonPass14Props> = (props) => {
  const s14 = Localizer.Season14;

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
            title={s14.SeasonPassHeading}
            seasonText={s14.SectionHeaderSeasonText}
            sectionName={s14.GearSectionName}
            isBold={true}
          />
          <div className={styles.blurbAndVideo}>
            <div className={styles.seasonBlurb}>
              <p
                className={styles.paragraphLarge}
                dangerouslySetInnerHTML={{ __html: s14.SeasonPassBlurb }}
              />
            </div>
            {/*<div className={styles.trailerWrapper}>*/}
            {/*	<div className={styles.trailerBtn}>*/}
            {/*		<div className={styles.trailerBg}/>*/}
            {/*		<div className={styles.iconWrapper}>*/}
            {/*			<Icon className={styles.playIcon} iconType={"material"} iconName={"play_arrow"}/>*/}
            {/*		</div>*/}
            {/*	</div>*/}
            {/*	<p>{s14.SeasonPassTrailerText}</p>*/}
            {/*</div>*/}
          </div>
        </LazyLoadWrapper>
        <div className={styles.infoBlocksWrapper}>
          <InfoBlock14
            blurb={s14.SeasonPassBlockBlurb1}
            title={s14.SeasonPassBlockHeading1}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_season_pass_img_1.jpg"}
            screenshot={
              "/7/ca/destiny/bgs/season14/s14_season_pass_img_1_16x9.jpg"
            }
          />
          <InfoBlock14
            blurb={s14.SeasonPassBlockBlurb2}
            title={s14.SeasonPassBlockHeading2}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_season_pass_img_2.jpg"}
            screenshot={
              "/7/ca/destiny/bgs/season14/s14_season_pass_img_2_16x9.jpg"
            }
          />
          <InfoBlock14
            blurb={s14.SeasonPassBlockBlurb3}
            title={s14.SeasonPassBlockHeading3}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_season_pass_img_3.jpg"}
            screenshot={
              "/7/ca/destiny/bgs/season14/s14_season_pass_img_3_16x9.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SeasonPass14;

interface IInfoBlock14 {
  blurb: string;
  title: string;
  thumbnail: string;
  screenshot: string;
}

const InfoBlock14 = (props: IInfoBlock14) => {
  const showImage = (screenshot: string) => {
    Modal.open(<img src={`${screenshot}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  return (
    <div className={styles.infoBlock}>
      <div
        className={styles.blockImg}
        style={{ backgroundImage: `url(${props.thumbnail})` }}
        onClick={() => showImage(props.screenshot)}
      />
      <div className={styles.blockText}>
        <h4>{props.title}</h4>
        <p className={styles.paragraph}>{props.blurb}</p>
      </div>
    </div>
  );
};
