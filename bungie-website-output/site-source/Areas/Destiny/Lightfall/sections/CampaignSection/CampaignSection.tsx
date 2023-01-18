// Created by v-ahipp, 2022
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { responsiveBgImage } from "@Utilities/ContentStackUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import classNames from "classnames";
import React from "react";
import styles from "./CampaignSection.module.scss";
import { SafelySetInnerHTML } from "@UI/Content/SafelySetInnerHTML";
import { PmpInfoThumbnailGroup } from "@UI/Marketing/Fragments/PmpInfoThumbnailGroup";
import { LightfallSectionHeader } from "@Areas/Destiny/Lightfall/components/LightfallSectionHeader/LightfallSectionHeader";

interface CampaingSectionProps {
  data?: any;
}

export const CampaignSection: React.FC<CampaingSectionProps> = (props) => {
  const { title, blurb, desktop_bg, mobile_bg, content = [] } =
    props.data ?? {};

  const { mobile } = useDataStore(Responsive);

  return (
    <div
      className={styles.section}
      style={{
        backgroundImage: responsiveBgImage(
          desktop_bg?.url,
          mobile_bg?.url,
          mobile
        ),
      }}
    >
      <div className={styles.container}>
        <LightfallSectionHeader
          heading={title}
          blurb={blurb}
          dividerColor="#B414FF"
          classes={{ root: styles.header, content: styles.content }}
        />
      </div>

      {content.map((data: any) => {
        return (
          <PmpInfoThumbnailGroup
            key={data.uid}
            data={data}
            classes={{
              root: styles.root,
              caption: styles.caption,
              thumbBlockWrapper: styles.thumbBlockWrapper,
              thumbBg: styles.thumbBg,
            }}
          />
        );
      })}
    </div>
  );
};
