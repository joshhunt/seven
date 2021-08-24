// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import React from "react";
import styles from "./WQSkinnyBurbSection.module.scss";

interface IBodyBlurb {
  /* whether or not to apply special font treatment to this blurb */
  hasSpecialFont?: boolean;
  blurb: string;
}

interface WQSkinnyBlurbSectionProps {
  classes?: {
    root?: string;
    heading?: string;
    blurbWrapper?: string;
    sectionBg?: string;
    sectionTopBorder?: string;
    imgAboveHeading?: string;
  };
  heading: string;
  desktopBgImage: string;
  mobileBgImage: string;
  bodyBlurbs: IBodyBlurb | IBodyBlurb[];
  // indicates if gradient font will work for the current locale
  useGradientFont: boolean;
  headingSmallWQText: string;
  headingSectionName: string;
  imgAboveHeading?: string;
}

/**
 * Reusable section with the the flexibility to still have custom styling for each
 * section and additional components at the bottom of it
 * @param props
 * @constructor
 */
const WQSkinnyBlurbSection: React.FC<WQSkinnyBlurbSectionProps> = (props) => {
  const responsive = useDataStore(Responsive);
  const sectionBg =
    (props.desktopBgImage || props.mobileBgImage) &&
    (responsive.mobile ? props.mobileBgImage : props.desktopBgImage);

  return (
    <section
      className={classNames(styles.skinnyBlurbSection, props.classes?.root)}
    >
      <div
        className={classNames(styles.sectionBg, props.classes?.sectionBg)}
        style={{ backgroundImage: `url(${sectionBg})` }}
      />
      <div
        className={classNames(
          styles.sectionTopBorder,
          props.classes?.sectionTopBorder
        )}
      />
      <div className={styles.contentWrapper}>
        {props.imgAboveHeading && (
          <img
            src={props.imgAboveHeading}
            className={classNames(
              styles.imgAboveHeading,
              props.classes?.imgAboveHeading
            )}
          />
        )}
        <div className={styles.headingFlexWrapper}>
          <div className={styles.headingWrapper}>
            <div className={styles.headingPreContent}>
              <div className={styles.divider} />
              <p className={styles.headingSmallText}>
                {props.headingSmallWQText}
              </p>
              <p className={styles.headingSmallText}>{" | "}</p>
              <p className={styles.headingSmallText}>
                {props.headingSectionName}
              </p>
              <div className={styles.divider} />
            </div>
            <h2
              className={classNames(
                styles.heading,
                { [styles.gradientFont]: props.useGradientFont },
                props.classes?.heading
              )}
              dangerouslySetInnerHTML={sanitizeHTML(props.heading)}
            />
          </div>
        </div>
        <div
          className={classNames(
            styles.blurbWrapper,
            props.classes?.blurbWrapper
          )}
        >
          {(Array.isArray(props.bodyBlurbs)
            ? props.bodyBlurbs
            : [props.bodyBlurbs]
          ).map(({ blurb, hasSpecialFont }, i) => {
            return (
              <p
                key={i}
                className={classNames(styles.blurb, {
                  [styles.queenFont]: hasSpecialFont,
                })}
              >
                {blurb}
              </p>
            );
          })}
        </div>

        {props.children}
      </div>
    </section>
  );
};

export default WQSkinnyBlurbSection;
