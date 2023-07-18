// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import { useCSWebpImages } from "@Utilities/CSUtils";
import classNames from "classnames";
import React, { useMemo, memo } from "react";
import {
  BnetStackFile,
  BnetStackPmpCallout,
} from "../../../../../../Generated/contentstack-types";
import styles from "./EventCallout.module.scss";

type PmpCalloutThumbItem = BnetStackPmpCallout["thumbnails"][number];

type PmpCalloutProps = {
  leftAsideImage?: BnetStackFile;
  rightAsideImage?: BnetStackFile;
  data?: BnetStackPmpCallout;
};

const EventCallout: React.FC<PmpCalloutProps> = ({
  data,
  leftAsideImage,
  rightAsideImage,
}) => {
  const { mobile } = useDataStore(Responsive);

  const imgs = useCSWebpImages(
    useMemo(
      () => ({
        desktopBg: data?.desktop_bg?.url,
        mobileBg: data?.mobile_bg?.url,
        mobileAsideImg: data?.aside_img_mobile?.url,
        desktopAsideImg: data?.aside_img_desktop?.url,
      }),
      [data]
    )
  );

  const { blurb, heading, bg_color } = data ?? {};

  const bgImg = mobile ? imgs.mobileBg : imgs.desktopBg;

  const asideImg = mobile ? imgs?.mobileAsideImg : imgs?.desktopAsideImg;

  return (
    <LazyLoadedBgDiv
      img={bgImg}
      className={classNames(styles.callout, {
        [styles.withAsideImg]: !!asideImg,
      })}
      style={{ backgroundColor: bg_color }}
    >
      {rightAsideImage?.url && (
        <img
          src={rightAsideImage.url}
          className={styles.rightAside}
          loading={"lazy"}
        />
      )}
      {leftAsideImage?.url && (
        <img
          src={leftAsideImage.url}
          className={styles.leftAside}
          loading={"lazy"}
        />
      )}
      <div className={styles.upperContent}>
        {asideImg && (
          <img src={asideImg} className={styles.asideImg} loading={"lazy"} />
        )}
        <div className={styles.textWrapper}>
          <h3
            dangerouslySetInnerHTML={sanitizeHTML(heading)}
            className={styles.heading}
          />
          <p
            className={styles.blurb}
            dangerouslySetInnerHTML={sanitizeHTML(blurb)}
          />
        </div>
      </div>
    </LazyLoadedBgDiv>
  );
};

export default memo(EventCallout);
