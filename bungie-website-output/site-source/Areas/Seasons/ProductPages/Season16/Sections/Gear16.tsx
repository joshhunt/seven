// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import ClickableImgCarousel, {
  ICarouselSlide,
} from "@UI/Marketing/ClickableImgCarousel";
import React, { LegacyRef } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Gear16.module.scss";

interface Gear16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["event_section"];
  headerSeasonText: string;
}

const Gear16: React.FC<Gear16Props> = ({
  inputRef,
  data,
  headerSeasonText,
}) => {
  const slides: ICarouselSlide[] =
    data?.carousel_slides.map((s) => ({
      title: s.heading,
      thumbnail: s.image?.url,
      screenshot: s.image?.url,
      blurb: s.blurb,
    })) ?? [];

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
          <ClickableImgCarousel
            slides={slides}
            classes={{
              arrow: styles.carouselArrow,
              paginationIndicator: styles.paginationBar,
              selectedPaginationIndicator: styles.selected,
              slideBlurb: styles.slideBlurb,
              slideDivider: styles.slideDivider,
              slideTitle: styles.slideTitle,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gear16;
