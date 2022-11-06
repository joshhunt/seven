// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { FreeToPlayBuyBtn } from "@Areas/Destiny/FreeToPlay/FreeToPlay";
import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import ClickableImgCarousel, {
  ClickableImgCarouselProps,
} from "@UI/Marketing/ClickableImgCarousel";
import { PmpMediaCarousel } from "@UI/Marketing/Fragments/PmpMediaCarousel";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import { useCSWebpImages } from "@Utilities/CSUtils";
import { bgImage, responsiveBgImage } from "@Utilities/GraphQLUtils";
import classNames from "classnames";
import React, { useMemo } from "react";
import { BnetStackFreeToPlayProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./CommunitySection.module.scss";

interface CommunitySectionProps {
  data?: BnetStackFreeToPlayProductPage["community_section"];
  communityCarouselSlides?: BnetStackFreeToPlayProductPage["community_carousel_slides"];
  videoCarousel?: BnetStackFreeToPlayProductPage["video_carousel"];
}

type CommunityCarouselSlide = BnetStackFreeToPlayProductPage["community_carousel_slides"][number];

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  data,
  communityCarouselSlides,
  videoCarousel,
}) => {
  const { mobile } = useDataStore(Responsive);

  const images = useCSWebpImages(
    useMemo(
      () => ({
        ctaBg: data?.join_cta?.bg?.url,
        sectionBgDesktop: data?.bg?.desktop_bg?.url,
        sectionBgMobile: data?.bg?.mobile_bg?.url,
      }),
      [data]
    )
  );

  const memberCarouselSlides: ClickableImgCarouselProps["slides"] = communityCarouselSlides?.map(
    (slide) => ({
      ...slide,
      onClick: () =>
        Modal.open(
          <HeroSpotlightModalContent
            slideData={slide}
            twitterIcon={data?.twitter_icon?.url}
            instaIcon={data?.insta_icon?.url}
            shieldIcon={data?.shield_icon?.url}
          />,
          { isFrameless: true, className: styles.fullScreenModal }
        ),
      thumbnail: slide?.slide?.thumbnail?.url,
      screenshot: slide?.slide?.thumbnail?.url,
    })
  );

  return (
    <div
      className={styles.communitySection}
      style={{
        backgroundImage: responsiveBgImage(
          images.sectionBgDesktop,
          images.sectionBgMobile,
          mobile
        ),
      }}
    >
      <div className={styles.communityContent}>
        <p className={styles.sectionTitle}>{data?.sub_heading}</p>
        <h2
          className={styles.sectionHeading}
          dangerouslySetInnerHTML={sanitizeHTML(data?.heading)}
        />
        <div className={styles.sectionDivider} />
        <p
          className={styles.sectionBlurb}
          dangerouslySetInnerHTML={sanitizeHTML(data?.blurb)}
        />
      </div>

      <ClickableImgCarousel
        slides={memberCarouselSlides ?? []}
        classes={{
          root: styles.communityCarousel,
        }}
        styles={{
          paginationBar: { backgroundColor: "rgba(255, 255, 255, 0.5)" },
          selectedPaginationBar: { backgroundColor: "rgba(255, 255, 255, 1)" },
        }}
        renderSlideChildren={(
          { slide }: CommunityCarouselSlide,
          isActiveSlide,
          i
        ) => {
          return (
            <div
              className={classNames(styles.slideContent, {
                [styles.active]: isActiveSlide,
              })}
            >
              <div className={styles.slideTextWrapper}>
                <Icon
                  iconType={"material"}
                  iconName={"add"}
                  className={classNames(styles.slideIcon)}
                />
                <p
                  className={styles.slideTitle}
                  dangerouslySetInnerHTML={sanitizeHTML(slide?.title)}
                />
              </div>
            </div>
          );
        }}
      />

      <div className={styles.communityContent}>
        <h2
          className={styles.storyHeading}
          dangerouslySetInnerHTML={sanitizeHTML(data?.story_heading)}
        />
      </div>

      <PmpMediaCarousel
        data={videoCarousel?.[0]}
        classes={{ root: styles.videoCarousel, img: styles.slideImg }}
      />

      <div
        className={styles.joinCta}
        style={{ backgroundImage: bgImage(images.ctaBg) }}
      >
        <div className={classNames(styles.communityContent, styles.ctaContent)}>
          <div className={styles.textWrapper}>
            <p
              className={styles.joinHeading}
              dangerouslySetInnerHTML={sanitizeHTML(data?.join_cta?.heading)}
            />
            <FreeToPlayBuyBtn
              btn_text={data?.join_cta?.btn_text}
              className={styles.joinBtn}
              url={"/Rewards"}
            />
          </div>
          <img src={data?.join_cta?.emblem?.url} className={styles.emblem} />
        </div>
      </div>
    </div>
  );
};

type HeroSpotlightModalContentProps = {
  slideData?: CommunityCarouselSlide;
  twitterIcon?: string;
  instaIcon?: string;
  shieldIcon?: string;
};

/**
 * This component ended up getting cut from the release but will still be needed for a future page update
 */
const HeroSpotlightModalContent = (props: HeroSpotlightModalContentProps) => {
  const { bg, blurb, heading, insta_url, title, twitter_url, heading_icon } =
    props.slideData?.slide?.modal ?? {};

  const { mobile, large } = useDataStore(Responsive);

  const images = useCSWebpImages(
    useMemo(
      () => ({
        desktopBg: bg?.desktop?.url,
        mobileBg: bg?.mobile?.url,
      }),
      [bg]
    )
  );

  return (
    <div
      className={styles.modal}
      style={{
        backgroundImage: responsiveBgImage(
          images.desktopBg,
          images.mobileBg,
          large
        ),
      }}
    >
      <div className={styles.modalOverlay} />
      <div
        className={styles.shieldIcon}
        style={{ backgroundImage: bgImage(props.shieldIcon) }}
      />
      <div className={styles.modalContent}>
        <div className={styles.textWrapper}>
          <div className={styles.modalHeadingWrapper}>
            <div className={styles.modalHeadingText}>
              <p className={styles.modalTitle}>
                <SafelySetInnerHTML html={title} />
              </p>
              <h2
                className={styles.modalHeading}
                dangerouslySetInnerHTML={sanitizeHTML(heading)}
              />
            </div>
            <img src={heading_icon?.url} className={styles.modalIcon} />
          </div>
          <div className={styles.modalDivider} />
          <p
            className={styles.modalBlurb}
            dangerouslySetInnerHTML={sanitizeHTML(blurb)}
          />
          <div className={classNames(styles.modalDivider, styles.left)} />
          <div className={styles.socials}>
            {insta_url && (
              <a href={insta_url} target="_blank" className={styles.socialImg}>
                <img src={props.instaIcon} />
              </a>
            )}

            {twitter_url && (
              <a
                href={twitter_url}
                target="_blank"
                className={styles.socialImg}
              >
                <img src={props.twitterIcon} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
