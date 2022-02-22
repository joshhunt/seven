// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import { ClickableMediaThumbnail } from "@UI/Marketing/ClickableMediaThumbnail";
import { responsiveBgImageFromStackFile } from "@Utilities/GraphQLUtils";
import React from "react";
import { BnetStackSeasonOfTheRisen } from "../../../../../Generated/contentstack-types";
import styles from "./HelmBlock.module.scss";

interface HelmBlockProps {
  data: BnetStackSeasonOfTheRisen["helm_block"];
}

const HelmBlock: React.FC<HelmBlockProps> = ({ data }) => {
  const { mobile } = useDataStore(Responsive);

  const screenshots = [data?.image_one?.url, data?.image_two?.url];

  const blockBg = responsiveBgImageFromStackFile(
    data?.bg.desktop,
    data?.bg.mobile,
    mobile
  );

  return (
    <div className={styles.helmBlock} style={{ backgroundImage: blockBg }}>
      <div className={styles.helmContent}>
        <div className={styles.textContent}>
          <h3>{data?.heading}</h3>
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={sanitizeHTML(data?.blurb)}
          />
        </div>
        <div className={styles.screenshots}>
          <ClickableMediaThumbnail
            thumbnail={`${screenshots[0]}?width=500`}
            singleOrAllScreenshots={screenshots}
            screenshotIndex={0}
            classes={{ btnWrapper: styles.screenshot }}
          />
          <ClickableMediaThumbnail
            thumbnail={`${screenshots[1]}?width=500`}
            singleOrAllScreenshots={screenshots}
            screenshotIndex={1}
            classes={{ btnWrapper: styles.screenshot }}
          />
        </div>
      </div>
    </div>
  );
};

export default HelmBlock;
