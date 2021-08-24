// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Localizer } from "@bungie/localization";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import React from "react";
import styles from "./HelmBlock.module.scss";

interface HelmBlockProps {}

const HelmBlock: React.FC<HelmBlockProps> = (props) => {
  const s14 = Localizer.Season14;

  return (
    <div className={styles.helmBlock}>
      <div className={styles.helmContent}>
        <div className={styles.textContent}>
          <h3>{s14.HelmHeading}</h3>
          <p className={styles.paragraph}>{s14.HelmBlurb}</p>
        </div>
        <div className={styles.screenshots}>
          <ClickableImg
            thumbnailPath={
              "/7/ca/destiny/bgs/season14/s14_helm_thumbnail_1.jpg"
            }
            screenshotPath={
              "/7/ca/destiny/bgs/season14/s14_helm_screenshot_1.jpg"
            }
          />
          <ClickableImg
            thumbnailPath={
              "/7/ca/destiny/bgs/season14/s14_helm_thumbnail_2.jpg"
            }
            screenshotPath={
              "/7/ca/destiny/bgs/season14/s14_helm_screenshot_2.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

interface IClickableImg {
  thumbnailPath: string;
  screenshotPath: string;
}

const ClickableImg: React.FC<IClickableImg> = (props) => {
  const showImage = (imagePath: string) => {
    Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
      isFrameless: true,
    });
  };

  return (
    <div
      className={styles.screenshot}
      style={{ backgroundImage: `url(${props.thumbnailPath})` }}
      onClick={() => showImage(props.screenshotPath)}
    />
  );
};

export default HelmBlock;
