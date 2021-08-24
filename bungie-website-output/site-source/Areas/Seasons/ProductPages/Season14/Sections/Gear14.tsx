// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import Carousel14 from "@Areas/Seasons/ProductPages/Season14/Components/Carousel14";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Localizer } from "@bungie/localization";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React, { LegacyRef } from "react";
import styles from "./Gear14.module.scss";

interface Gear14Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

const Gear14: React.FC<Gear14Props> = (props) => {
  const s14 = Localizer.Season14;

  const slides = [
    {
      image: "/7/ca/destiny/bgs/season14/s14_armaments_carousel_1.jpg",
      title: s14.ExoticSlideTitle1,
      blurb: s14.ExoticSlideBlurb1,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_armaments_carousel_2.jpg",
      title: s14.ExoticSlideTitle2,
      blurb: s14.ExoticSlideBlurb2,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_armaments_carousel_3.jpg",
      title: s14.ExoticSlideTitle3,
      blurb: s14.ExoticSlideBlurb3,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_armaments_carousel_4.jpg",
      title: s14.ExoticSlideTitle4,
      blurb: s14.ExoticSlideBlurb4,
    },
    {
      image: "/7/ca/destiny/bgs/season14/s14_armaments_carousel_5.jpg",
      title: s14.ExoticSlideTitle5,
      blurb: s14.ExoticSlideBlurb5,
    },
  ];

  return (
    <div className={styles.gearSection}>
      <div className={styles.sectionBg} />
      <div className={styles.contentWrapperNormal}>
        <div className={styles.sectionBlurbFlex}>
          <img
            className={styles.blurbImage}
            src={"/7/ca/destiny/bgs/season14/s14_armor_synthesis_icon.png"}
          />
          <div className={styles.blurb}>
            <p
              className={styles.paragraphLarge}
              dangerouslySetInnerHTML={sanitizeHTML(s14.GearSectionBlurb)}
            />
          </div>
        </div>
        <div className={styles.infoBlocks}>
          <InfoBlock14
            blurb={s14.GearInfoBlockBlurb1}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_tech_img_1.jpg"}
            screenshot={"/7/ca/destiny/bgs/season14/s14_tech_img_1_16x9.jpg"}
          />
          <InfoBlock14
            blurb={s14.GearInfoBlockBlurb2}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_tech_img_2.jpg"}
            screenshot={"/7/ca/destiny/bgs/season14/s14_tech_img_2_16x9.jpg"}
          />
          <InfoBlock14
            blurb={s14.GearInfoBlockBlurb3}
            thumbnail={"/7/ca/destiny/bgs/season14/s14_tech_img_3.jpg"}
            screenshot={"/7/ca/destiny/bgs/season14/s14_tech_img_3_16x9.jpg"}
          />
        </div>
        <div
          className={styles.sectionIdAnchor}
          id={"exotics"}
          ref={props.inputRef}
        />
        <SectionHeader
          title={s14.GearHeading}
          seasonText={s14.SectionHeaderSeasonText}
          sectionName={s14.GearSectionName}
          isBold={true}
          className={styles.sectionHeader}
        />
        <div className={styles.gearCarousel}>
          <Carousel14
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

export default Gear14;

interface IInfoBlock14 {
  blurb: string;
  thumbnail: string;
  screenshot: string;
}

/**
 * InfoBlock14 - Block with a full width image and a short text blurb beneath
 * @param props
 * @constructor
 */
const InfoBlock14: React.FC<IInfoBlock14> = (props) => {
  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  return (
    <div className={styles.infoBlock}>
      <div
        className={styles.infoImg}
        style={{ backgroundImage: `url(${props.thumbnail})` }}
        onClick={() => showImage(props.screenshot)}
      />
      <p
        className={styles.paragraph}
        dangerouslySetInnerHTML={sanitizeHTML(props.blurb)}
      />
    </div>
  );
};
