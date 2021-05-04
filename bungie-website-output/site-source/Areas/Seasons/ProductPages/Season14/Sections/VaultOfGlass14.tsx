// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import LazyLoadWrapper from "@Areas/Seasons/ProductPages/Season14/Components/LazyLoadWrapper";
import { SectionHeader } from "@Areas/Seasons/ProductPages/Season14/Components/SectionHeader";
import { Responsive } from "@Boot/Responsive";
import { Localizer } from "@Global/Localization/Localizer";
import { Platform } from "@Platform";
import { Button } from "@UIKit/Controls/Button/Button";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { LocalizerUtils } from "@Utilities/LocalizerUtils";
import classNames from "classnames";
import moment from "moment";
import React, { LegacyRef, useEffect, useState } from "react";
import styles from "./VaultOfGlass14.module.scss";

interface VaultOfGlass14Props {
  inputRef: LegacyRef<HTMLDivElement>;
}

interface ICalloutText {
  CalloutHeading?: string;
  CalloutBlurb?: string;
  CalloutDisclaimer?: string;
  CalloutButtonTextAvailable?: string;
  CalloutButtonTextUnavailable?: string;
}

const fetchCalloutText = async () => {
  try {
    const sc = await Platform.ContentService.GetContentByTagAndType(
      "season-14-silver-bundles",
      "StringCollection",
      Localizer.CurrentCultureName,
      false
    );

    const data: ICalloutText = LocalizerUtils.stringCollectionToObject(sc);

    return data;
  } catch (err) {
    return null;
  }
};

const fetchBgImages = async () => {
  try {
    const images = await Platform.ContentService.GetContentByTagAndType(
      "season-14-emote-bundle",
      "MarketingMediaAsset",
      Localizer.CurrentCultureName,
      false
    );

    return images.properties;
  } catch (err) {
    return null;
  }
};

const VaultOfGlass14: React.FC<VaultOfGlass14Props> = (props) => {
  const s14 = Localizer.Season14;

  const [emoteBlockText, setEmoteBlockText] = useState<null | ICalloutText>(
    null
  );
  const [bgImages, setBgImages] = useState(null);

  useEffect(() => {
    // fetch emote block text from firehose
    fetchCalloutText().then((response) => {
      setEmoteBlockText(response);
    });
    // get desktop and mobile bg images
    fetchBgImages().then((response) => {
      setBgImages({
        desktopBg: response?.LargeImage,
        mobileBg: response?.ImageThumbnail,
      });
    });
  }, []);

  // date silver bundles should be shown on the page
  const silverBundleDate = ConfigUtils.GetParameter(
    "Season14PageUpdate",
    "ShowSilverBundles",
    ""
  );
  // date silver bundle button should be active
  const bundleBtnActiveDate = ConfigUtils.GetParameter(
    "Season14PageUpdate",
    "UpdateSilverBundleBtn",
    ""
  );
  // parsed dates using moment
  const parsedBundleDate = moment(silverBundleDate);
  const parsedBundleBtnDate = moment(bundleBtnActiveDate);
  const now = moment();
  // booleans to control whether or not to show silver bundle
  const isSilverBundleLive = now.isAfter(parsedBundleDate);
  const isBundleBtnActive = now.isAfter(parsedBundleBtnDate);

  const bundleBtnText = isBundleBtnActive
    ? emoteBlockText?.CalloutButtonTextAvailable
    : emoteBlockText?.CalloutButtonTextUnavailable;

  // get bg image for section based on screen size
  const bgImage = !isSilverBundleLive
    ? ""
    : Responsive.state.mobile
    ? bgImages?.mobileBg
    : bgImages?.desktopBg;

  return (
    <div className={styles.raidSection}>
      <div
        className={styles.sectionIdAnchor}
        id={"raid"}
        ref={props.inputRef}
      />
      <div className={styles.sectionBg}>
        <div className={styles.sectionBorder} />
      </div>
      <div className={classNames(styles.contentWrapperNormal)}>
        <LazyLoadWrapper>
          <p className={styles.smallHeading}>{s14.VOGSmallHeading}</p>
          <SectionHeader
            title={s14.VOGHeading}
            seasonText={s14.SectionHeaderSeasonText}
            sectionName={s14.RaidSectionName}
            className={styles.sectionHeader}
            isBold={true}
          />
          <div className={styles.textContent}>
            <p
              className={classNames(styles.paragraphLarge, styles.blurbHeading)}
            >
              {s14.VOGBlurbHeading}
            </p>
            <p className={classNames(styles.paragraphLarge)}>{s14.VOGBlurb}</p>
          </div>
        </LazyLoadWrapper>
      </div>
      <div className={styles.contentWrapperLarge}>
        <div
          className={classNames(styles.emoteBundleBlock, {
            [styles.showVideo]: !isSilverBundleLive || !emoteBlockText,
          })}
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {(!isSilverBundleLive || !emoteBlockText) && (
            <video muted={true} autoPlay={true} playsInline={true} loop={true}>
              <source
                src={"/7/ca/destiny/bgs/season14/s14_vog_coming_soon_web.mp4"}
                type={"video/mp4"}
              />
            </video>
          )}

          {isSilverBundleLive && emoteBlockText && (
            <div className={styles.contentWrapper}>
              <h4
                dangerouslySetInnerHTML={{
                  __html: emoteBlockText?.CalloutHeading,
                }}
              />
              <p className={classNames(styles.paragraph, styles.emoteBlurb)}>
                {emoteBlockText?.CalloutBlurb}
              </p>
              <p className={styles.emoteDisclaimer}>
                {emoteBlockText?.CalloutDisclaimer}
              </p>
              <Button
                buttonType={"blue"}
                className={styles.emoteBtn}
                size={2}
                disabled={!isBundleBtnActive}
              >
                {bundleBtnText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultOfGlass14;
