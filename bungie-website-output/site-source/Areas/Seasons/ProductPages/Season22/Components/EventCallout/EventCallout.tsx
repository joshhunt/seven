// Created by tmorris, 2023
// Copyright Bungie, Inc.

import React, { useMemo, memo } from "react";
import classNames from "classnames";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import LazyLoadedBgDiv from "@UI/Utility/LazyLoadedBgDiv";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { BnetStackPmpCallout } from "../../../../../../Generated/contentstack-types";

import styles from "./EventCallout.module.scss";

type PmpCalloutProps = {
  data?: BnetStackPmpCallout;
};

const EventCallout: React.FC<PmpCalloutProps> = ({ data }) => {
  const { medium } = useDataStore(Responsive);

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

  const bgImg = medium ? imgs.mobileBg : imgs.desktopBg;

  const asideImg = medium ? imgs?.mobileAsideImg : imgs?.desktopAsideImg;

  const rightAside = data?.thumbnails?.[0]?.Image_Thumb?.image?.url;

  return heading && blurb ? (
    <LazyLoadedBgDiv
      img={bgImg}
      className={classNames(styles.callout, {
        [styles.withAsideImg]: !!asideImg,
      })}
      style={{ backgroundColor: bg_color }}
    >
      <div className={styles.upperContent}>
        {asideImg && !medium && (
          <img src={asideImg} className={styles.asideImg} loading={"lazy"} />
        )}
        <div className={styles.textWrapper}>
          <div className={styles.copy}>
            <h3
              dangerouslySetInnerHTML={sanitizeHTML(heading)}
              className={styles.heading}
            />
            <p
              className={styles.blurb}
              dangerouslySetInnerHTML={sanitizeHTML(blurb)}
            />
          </div>
          {rightAside && !medium && (
            <img
              src={rightAside}
              className={styles.rightAside}
              loading={"lazy"}
            />
          )}
        </div>
      </div>
    </LazyLoadedBgDiv>
  ) : null;
};

export default memo(EventCallout);
