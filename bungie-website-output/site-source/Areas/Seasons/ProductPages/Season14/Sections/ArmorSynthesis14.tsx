// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Localizer } from "@Global/Localization/Localizer";
import React, { LegacyRef } from "react";
import styles from "./ArmorSynthesis14.module.scss";

interface Season14ArmorSynthesisProps {
  inputRef: LegacyRef<HTMLDivElement>;
}

const Season14ArmorSynthesis: React.FC<Season14ArmorSynthesisProps> = (
  props
) => {
  const s14 = Localizer.Season14;

  return (
    <div className={styles.armorSection}>
      <div
        className={styles.sectionIdAnchor}
        id={"tech"}
        ref={props.inputRef}
      />
      <div className={styles.armorSectionHeader}>
        <div className={styles.contentWrapperNormal}>
          <SectionHeader
            title={s14.ArmorHeading}
            seasonText={s14.SectionHeaderSeasonText}
            sectionName={s14.TechSectionName}
            className={styles.headingBlock}
            hideSmallTitlesAtMobile={true}
            isBold={true}
          />
        </div>
      </div>
      <div className={styles.bgContainer}>
        <video
          playsInline={true}
          autoPlay={true}
          loop={true}
          muted={true}
          className={styles.armorVideo}
        >
          <source
            src={"/7/ca/destiny/bgs/season14/armor_synthesis_video_web.mp4"}
            type={"video/mp4"}
          />
        </video>
      </div>
    </div>
  );
};

export default Season14ArmorSynthesis;
