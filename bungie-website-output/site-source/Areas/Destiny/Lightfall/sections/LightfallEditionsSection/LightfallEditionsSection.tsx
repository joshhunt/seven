// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ImageThumb } from "@UI/Marketing/ImageThumb";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import { responsiveBgImageFromStackFile } from "@Utilities/ContentStackUtils";
import classNames from "classnames";
import React from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import { DestinySkuTags } from "../../../../../UI/Destiny/SkuSelector/DestinySkuConstants";
import DestinySkuSelectorModal from "../../../../../UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import styles from "./LightfallEditionsSection.module.scss";

interface LightfallEditionsSectionProps {
  data?: BnetStackNebulaProductPage["editions_section"];
}

export const LightfallEditionsSection: React.FC<LightfallEditionsSectionProps> = (
  props
) => {
  const { edition_block, heading, blurb, bg } = props.data ?? {};

  const { mobile } = useDataStore(Responsive);

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: responsiveBgImageFromStackFile(
          bg?.desktop_bg,
          bg?.mobile_bg,
          mobile
        ),
      }}
    >
      <div className={styles.sectionContent}>
        <LightfallSectionHeader
          heading={heading}
          blurb={blurb}
          alignment={"center"}
        />
        <div className={styles.editions}>
          <EditionBlock data={edition_block} isStandard />
          <EditionBlock data={edition_block} />
        </div>
      </div>
    </div>
  );
};

type EditionBlockProps = {
  data?: BnetStackNebulaProductPage["editions_section"]["edition_block"];
  isStandard?: boolean;
};

const EditionBlock: React.FC<EditionBlockProps> = ({ data, isStandard }) => {
  const {
    buy_btn_text,
    pass_image,
    standard_image,
    standard_heading,
    unlocks_heading,
    standard_unlocks,
    pass_unlocks,
    unlocks_list,
    annual_pass_heading,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const handlePreOrderClick = (skuTag: string) => {
    DestinySkuSelectorModal.show({ skuTag });
  };

  return (
    <div
      className={classNames(
        styles.editionBlock,
        isStandard ? styles.standard : styles.pass
      )}
    >
      <div className={styles.blockTopContent}>
        <p className={styles.heading}>
          {isStandard ? standard_heading : annual_pass_heading}
        </p>
        <ImageThumb
          image={isStandard ? standard_image?.url : pass_image?.url}
          classes={{
            imageContainer: styles.coverImg,
            image: styles.coverImgBg,
          }}
        />
        <Button
          className={styles.buyBtn}
          onClick={() =>
            handlePreOrderClick(
              isStandard
                ? DestinySkuTags.LightfallStandard
                : DestinySkuTags.LightfallAnnualPass
            )
          }
        >
          {buy_btn_text}
        </Button>
      </div>
      <div className={styles.unlockImages}>
        <p className={styles.unlocksHeading}>{unlocks_heading}</p>
        {(isStandard ? standard_unlocks : pass_unlocks)?.map((unlock, i) => {
          return (
            <div className={styles.unlockImgWrapper} key={i}>
              <div className={styles.unlockImgBox}>
                <ImageThumb
                  image={unlock?.image?.url}
                  classes={{
                    imageContainer: styles.unlockImg,
                    image: styles.unlockImgBg,
                  }}
                />
              </div>
              <p className={styles.caption}>{unlock?.caption}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.unlockList}>
        {unlocks_list?.map((item, i) => {
          const isAvailableForEdition =
            (isStandard && item.is_standard) || !isStandard;

          if (!isAvailableForEdition && mobile && isStandard) {
            return null;
          }

          return (
            <div
              className={styles.unlockItem}
              key={i}
              style={{ opacity: isAvailableForEdition ? "1" : "0.4" }}
            >
              <p>
                {isStandard && item?.standard_title_override
                  ? item.standard_title_override
                  : item?.title}
              </p>
              {isAvailableForEdition && (
                <Icon
                  iconName={"done"}
                  iconType={"material"}
                  className={styles.check}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
