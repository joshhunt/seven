// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import Carousel15 from "@Areas/Seasons/ProductPages/Season15/Components/Carousel15";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season15/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import React, { LegacyRef } from "react";
import styles from "./Gear15.module.scss";

interface Gear15Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

const Gear15: React.FC<Gear15Props> = (props) => {
  const s15 = Localizer.Season15;

  const slides = [
    {
      image: "/7/ca/destiny/bgs/season15/s15_armaments_1_1080.jpg",
      title: s15.ExoticSlideTitle1,
      blurb: s15.ExoticSlideBlurb1,
    },
    {
      image: "/7/ca/destiny/bgs/season15/s15_armaments_2_1080.jpg",
      title: s15.ExoticSlideTitle2,
      blurb: s15.ExoticSlideBlurb2,
    },
    {
      image: "/7/ca/destiny/bgs/season15/s15_armaments_3_1080.jpg",
      title: s15.ExoticSlideTitle3,
      blurb: s15.ExoticSlideBlurb3,
    },
    {
      image: "/7/ca/destiny/bgs/season15/s15_armaments_4_1080.jpg",
      title: s15.ExoticSlideTitle4,
      blurb: s15.ExoticSlideBlurb4,
    },
  ];

  return (
    <div className={styles.gearSection}>
      <div className={styles.contentWrapperNormal}>
        <div
          className={styles.sectionIdAnchor}
          id={"exotics"}
          ref={props.inputRef}
        />
        <SectionHeader
          title={s15.GearHeading}
          seasonText={s15.SectionHeaderSeasonText}
          sectionName={s15.GearSectionName}
          isBold={true}
          className={styles.sectionHeader}
        />
        <div className={styles.gearCarousel}>
          <Carousel15
            slides={slides}
            arrowColor={"rgb(66, 66, 66)"}
            titleColor={"rgb(66, 66, 66)"}
            blurbColor={"rgba(66, 66, 66, .8)"}
            activeIndicatorColor={"rgb(66, 66, 66)"}
            inactiveIndicatorColor={"rgba(66, 66, 66, .3)"}
            dividerColor={"#d8376b"}
          />
        </div>
      </div>
    </div>
  );
};

export default Gear15;
