// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import ClickableImgCarousel, {
  ICarouselSlide,
} from "@UI/Marketing/ClickableImgCarousel";
import { PmpMediaCarousel } from "@UI/Marketing/Fragments/PmpMediaCarousel";
import React, { LegacyRef } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Gear16.module.scss";

interface Gear16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["event_section"];
  carouselData: BnetStackSeasonOfTheRisen["exotics_carousel"];
  headerSeasonText: string;
}

const Gear16: React.FC<Gear16Props> = ({
  inputRef,
  data,
  carouselData,
  headerSeasonText,
}) => {
  return (
    <div className={styles.gearSection}>
      <div className={styles.contentWrapperNormal}>
        <div className={styles.sectionIdAnchor} id={"gear"} ref={inputRef} />
        <SectionHeader
          title={data?.heading}
          seasonText={headerSeasonText}
          sectionName={data?.section_name}
          className={styles.sectionHeader}
        />
        <div className={styles.gearCarousel}>
          <PmpMediaCarousel
            data={carouselData?.[0]}
            classes={{
              slideTitle: styles.slideTitle,
              slideDivider: styles.slideDivider,
              slideBlurb: styles.slideBlurb,
              paginationIndicator: styles.paginationBar,
              selectedPaginationIndicator: styles.selected,
              arrow: styles.carouselArrow,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gear16;
