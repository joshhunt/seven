// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season16/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season16/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { SystemNames } from "@Global/SystemNames";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { Icon } from "@UIKit/Controls/Icon";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import {
  bgImageFromStackFile,
  responsiveBgImageFromStackFile,
} from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { LegacyRef } from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./Void16.module.scss";

interface Void16Props {
  inputRef: LegacyRef<HTMLDivElement>;
  data: BnetStackSeasonOfTheRisen["activities_section_two"];
  rewardsData: BnetStackSeasonOfTheRisen["callout_block"];
  headerSeasonText: string;
}

const Void16: React.FC<Void16Props> = ({
  data,
  rewardsData,
  inputRef,
  headerSeasonText,
}) => {
  const { mobile } = useDataStore(Responsive);

  const sectionBg = responsiveBgImageFromStackFile(
    data?.bg.desktop,
    data?.bg.mobile,
    mobile
  );
  const bottomBg = responsiveBgImageFromStackFile(
    data?.bottom_bg?.desktop,
    data?.bottom_bg?.mobile,
    mobile
  );
  const calloutBg = responsiveBgImageFromStackFile(
    rewardsData?.bg.desktop,
    rewardsData?.bg.mobile,
    mobile
  );

  const infoBlockScreenshots = data?.info_blocks.map((b) => b.screenshot?.url);

  const handleImgClick = (imgIndex: number) => {
    ImagePaginationModal.show({
      images: infoBlockScreenshots,
      imgIndex: imgIndex,
    });
  };

  return (
    <div className={styles.exoticQuestSection}>
      <div className={styles.sectionIdAnchor} id={"light"} ref={inputRef} />
      <div
        className={styles.sectionBg}
        style={{ backgroundImage: sectionBg }}
      />
      <div
        className={classNames(styles.sectionBg, styles.bottom)}
        style={{ backgroundImage: bottomBg }}
      />
      <div className={classNames(styles.contentWrapperNormal)}>
        <LazyLoadWrapper>
          <p className={styles.smallHeading}>{data?.small_heading}</p>
          <SectionHeader
            title={data?.heading}
            seasonText={headerSeasonText}
            sectionName={data?.section_name}
            className={styles.sectionHeader}
            isBold={true}
          />
          <div className={styles.flexContentWrapper}>
            <div className={styles.textContent}>
              <p
                className={classNames(styles.paragraphLarge)}
                dangerouslySetInnerHTML={sanitizeHTML(data?.blurb)}
              />
            </div>
          </div>
        </LazyLoadWrapper>

        <div className={styles.infoBlocksWrapper}>
          {data?.info_blocks?.map((block, i) => {
            return (
              <InfoBlock16
                key={i}
                blurb={block.blurb}
                title={block.heading}
                thumbnail={block.thumbnail?.url}
                screenshot={infoBlockScreenshots[i]}
                onClick={() => handleImgClick(i)}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.contentWrapperLarge}>
        <div
          className={classNames(styles.rewardsCallout)}
          style={{ backgroundImage: calloutBg }}
        >
          <img src={rewardsData?.image?.url} className={styles.mobileSealImg} />
          <SectionHeader
            className={styles.rewardsHeading}
            title={rewardsData?.heading}
            seasonText={headerSeasonText}
            sectionName={rewardsData?.section_name}
          />
          <div className={styles.contentWrapper}>
            <p className={styles.paragraph}>{rewardsData?.blurb}</p>
            <div
              className={styles.rewardImg}
              style={{
                backgroundImage: bgImageFromStackFile(rewardsData?.image),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface IInfoBlock16 {
  blurb: string;
  title: string;
  thumbnail: string;
  screenshot: string;
  onClick: () => void;
}

const InfoBlock16 = (props: IInfoBlock16) => {
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

export default Void16;
