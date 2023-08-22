import React, { Fragment, memo } from "react";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { ImageThumb } from "@UI/Marketing/ImageThumb";
import { Button } from "@UIKit/Controls/Button/Button";
import { Icon } from "@UIKit/Controls/Icon";
import classNames from "classnames";
import { BnetStackFile } from "../../../../../../Generated/contentstack-types";
import DestinySkuSelectorModal from "@UI/Destiny/SkuSelector/DestinySkuSelectorModal";
import { DestinySkuTags } from "@UI/Destiny/SkuSelector/DestinySkuConstants";
import styles from "./EditionsBlock.module.scss";

type EditionBlockProps = {
  data?: {
    /** Standard Heading */
    standard_heading?: string;
    /** Annual Pass Heading */
    annual_pass_heading?: string;
    /** Standard Image */
    standard_image?: BnetStackFile;
    /** Pass Image */
    pass_image?: BnetStackFile;
    /** Buy Btn Text */
    buy_btn_text?: string;
    /** Unlocks Heading */
    unlocks_heading?: string;
    /** Standard Unlocks */
    description?: string;
    standard_unlocks?: {
      /** Caption */
      caption?: string;
      /** Image */
      image?: BnetStackFile;
    }[];
    /** Pass Unlocks */
    pass_unlocks?: {
      /** Caption */
      caption?: string;
      /** Image */
      image?: BnetStackFile;
    }[];
    /** Unlocks List */
    unlocks_list?: {
      /** Title */
      title?: string;
      /** Standard Title Override (optional) */
      standard_title_override?: string;
      /** Is Standard */
      is_standard?: boolean;
      nested_unlocks?: {
        title?: string;
        is_standard?: boolean;
      }[];
    }[];
  };
  isStandard?: boolean;
};

const EditionBlock: React.FC<EditionBlockProps> = ({ data, isStandard }) => {
  const {
    buy_btn_text,
    pass_image,
    standard_image,
    standard_heading,
    unlocks_heading,
    standard_unlocks = [],
    pass_unlocks = [],
    unlocks_list,
    annual_pass_heading,
  } = data ?? {};

  const { mobile } = useDataStore(Responsive);

  const handlePreOrderClick = (skuTag: string) => {
    DestinySkuSelectorModal.show({ skuTag });
  };

  const hasStandardUnlocks =
    Array.isArray(standard_unlocks) && standard_unlocks?.length > 0;
  const hasPassUnlocks =
    Array.isArray(pass_unlocks) && pass_unlocks?.length > 0;
  const hasStandardAndPassUnlocks = hasStandardUnlocks && hasPassUnlocks;

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
                ? DestinySkuTags.FinalShapeStandard
                : DestinySkuTags.FinalShapeAnnualPass
            )
          }
        >
          {buy_btn_text}
        </Button>
      </div>
      {hasStandardAndPassUnlocks ? (
        <div
          className={classNames(
            styles.unlockImages,
            isStandard ? styles.unlockStandard : styles.unlockPass
          )}
        >
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
      ) : null}
      {Array.isArray(unlocks_list) && unlocks_list?.length > 0 && (
        <div className={styles.unlockList}>
          {unlocks_list.map((item, i) => {
            const isAvailableForEdition =
              (isStandard && item.is_standard) || !isStandard;
            const hasNestedUnlocks =
              Array.isArray(item?.nested_unlocks) &&
              item?.nested_unlocks?.length > 0;
            if (!isAvailableForEdition && mobile && isStandard) {
              return null;
            }

            return isAvailableForEdition ? (
              <Fragment key={`${item?.title}-${i}`}>
                <div
                  className={classNames(styles.unlockItem, {
                    [styles.hasNested]: hasNestedUnlocks,
                  })}
                  style={{
                    opacity: isAvailableForEdition ? "1" : "0.4",
                  }}
                >
                  <p>
                    {isStandard && item?.standard_title_override
                      ? item.standard_title_override
                      : item?.title}
                  </p>
                  {!hasNestedUnlocks && isAvailableForEdition && (
                    <Icon
                      iconName={"done"}
                      iconType={"material"}
                      className={styles.check}
                    />
                  )}
                </div>
                {hasNestedUnlocks &&
                  item.nested_unlocks?.map((nestedItem, index) => {
                    const isAvailableForNestedItem =
                      (nestedItem?.is_standard && item.is_standard) ||
                      !isStandard;

                    return isAvailableForNestedItem ? (
                      <div
                        className={styles.unlockItemNested}
                        key={`${nestedItem.title}-${index}`}
                        style={{
                          opacity: isAvailableForNestedItem ? "1" : "0.4",
                        }}
                      >
                        {nestedItem?.title && <p>{nestedItem.title}</p>}
                        {isAvailableForNestedItem && (
                          <Icon
                            iconName={"done"}
                            iconType={"material"}
                            className={styles.check}
                          />
                        )}
                      </div>
                    ) : null;
                  })}
              </Fragment>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default memo(EditionBlock);
