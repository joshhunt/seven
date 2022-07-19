// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Icon } from "@UIKit/Controls/Icon";
import ImagePaginationModal from "@UIKit/Controls/Modal/ImagePaginationModal";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import YoutubeModal from "@UIKit/Controls/Modal/YoutubeModal";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import styles from "./ClickableImgCarousel.module.scss";

export type ICarouselSlide = { [key: string]: any } & {
  thumbnail: string;
  screenshot?: string;
  /* video to open in a lightbox */
  videoId?: string;
  /* video to play inline in the slide */
  inlineVideo?: string;
  title?: string;
  blurb?: string;
  onClick?: () => void;
};

export interface ClickableImgCarouselProps {
  slides: ICarouselSlide[];
  /* renders content within slide thumbnail.  typed as 'any' so unique type can be annotated with each use case */
  renderSlideChildren?: (
    slideData: any,
    isActiveSlide: boolean,
    index: number
  ) => JSX.Element;
  classes?: {
    arrow?: string;
    slideTitle?: string;
    slideBlurb?: string;
    slideDivider?: string;
    paginationIndicator?: string;
    selectedPaginationIndicator?: string;
    root?: string;
    img?: string;
  };
  styles?: {
    titleDivider?: React.CSSProperties;
    arrow?: React.CSSProperties;
    paginationBar?: React.CSSProperties;
    selectedPaginationBar?: React.CSSProperties;
  };
}

const ClickableImgCarousel: React.FC<ClickableImgCarouselProps> = (props) => {
  const [position, setPositionState] = useState(0);
  const positionRef = useRef(0);
  const setPosition = (data: number) => {
    setPositionState(data);
    positionRef.current = data;
  };
  const responsive = useDataStore(Responsive);

  const slideScreenshots = props.slides
    ?.filter((s) => s.screenshot)
    .map((s) => s.screenshot);

  const changeSlide = (slideIndex: number) => {
    // if clicked slide is not current slide and is a valid slide, update state
    if (
      slideIndex !== position &&
      slideIndex >= 0 &&
      slideIndex <= props.slides.length - 1
    ) {
      setPosition(slideIndex);
    }
  };

  const handleThumbnailClick = ({
    slideIndex,
    img,
    videoId,
  }: {
    slideIndex: number;
    img: string;
    videoId?: string;
  }) => {
    // change slides if user clicks on any slide that isn't the current slide
    if (slideIndex !== position) {
      return changeSlide(slideIndex);
    }

    /* Optional click handler passed in as prop to carousel slide */
    const handlerProp = props.slides?.[slideIndex]?.onClick;

    if (handlerProp) {
      handlerProp();
    } else if (videoId) {
      YoutubeModal.show({ videoId });
    } else {
      showImage(img);
    }
  };

  const showImage = (imagePath: string) => {
    // if screen is not "tiny", open image in modal
    if (!responsive.tiny) {
      const imgIndex = slideScreenshots?.findIndex((s) => s === imagePath);

      ImagePaginationModal.show({ imgIndex, images: slideScreenshots });
    }
  };

  return (
    <div className={classNames(styles.carouselWrapper, props.classes?.root)}>
      <div className={styles.carousel}>
        <div className={classNames(styles.textBox)}>
          <div
            className={styles.textSlider}
            style={{
              transform: `translateX(-${
                (100 / props.slides.length) * position
              }%)`,
            }}
          >
            {props.slides.map((slide, i) => {
              return (
                <div
                  className={classNames(styles.slideTextBox, {
                    [styles.currentTextShown]: position === i,
                  })}
                  key={i}
                >
                  <div
                    className={classNames(
                      styles.divider,
                      props.classes?.slideDivider
                    )}
                    style={props.styles?.titleDivider}
                  />
                  {slide.title && (
                    <h3 className={props.classes?.slideTitle}>{slide.title}</h3>
                  )}
                  {slide.blurb && (
                    <p
                      className={classNames(
                        styles.blurb,
                        props.classes?.slideBlurb
                      )}
                    >
                      {slide.blurb}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.showingSlideWrapper}>
          <div
            className={styles.slider}
            style={{
              transform: `translateX(-${
                (100 / props.slides.length) * position
              }%)`,
            }}
          >
            {props.slides.map((slide, i) => {
              const inlineVideo = props.slides[i].inlineVideo;
              const videoId = props.slides[i].videoId;
              const screenshot = props.slides[i].screenshot;

              const bgImage = !inlineVideo && `url(${slide.thumbnail})`;

              return (
                <div
                  className={styles.slideWrapper}
                  key={i}
                  onClick={() =>
                    handleThumbnailClick({
                      img: slide.thumbnail,
                      slideIndex: i,
                      videoId,
                    })
                  }
                >
                  <div
                    className={classNames(
                      styles.slideImg,
                      { [styles.showing]: position === i },
                      props.classes?.img
                    )}
                    style={{ backgroundImage: bgImage }}
                  >
                    {inlineVideo && (
                      <video autoPlay muted loop playsInline>
                        <source src={inlineVideo} />
                      </video>
                    )}
                    <div className={styles.slideChildren}>
                      {props.renderSlideChildren &&
                        props.renderSlideChildren(slide, position === i, i)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Icon
            className={classNames(styles.rightArrowIcon, props.classes?.arrow, {
              [styles.showArrow]: position < props.slides.length - 1,
            })}
            iconName={"arrow_right"}
            iconType={"material"}
            onClick={() => changeSlide(position + 1)}
            style={props.styles?.arrow}
          />
          <Icon
            className={classNames(styles.leftArrowIcon, props.classes?.arrow, {
              [styles.showArrow]: position > 0,
            })}
            iconName={"arrow_left"}
            iconType={"material"}
            onClick={() => changeSlide(position - 1)}
            style={props.styles?.arrow}
          />
        </div>
      </div>
      <div className={styles.slidePaginationWrapper}>
        {props.slides.map((_, i) => {
          return (
            <div
              key={i}
              className={classNames(
                styles.slidePaginationIndicator,
                props.classes?.paginationIndicator,
                { [props.classes?.selectedPaginationIndicator]: position === i }
              )}
              onClick={() => changeSlide(i)}
              style={
                position === i && props.styles.selectedPaginationBar
                  ? props.styles?.selectedPaginationBar
                  : props.styles?.paginationBar
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default ClickableImgCarousel;
