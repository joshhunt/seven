// Created by a-bphillips, 2021
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStore";
import { Icon } from "@UIKit/Controls/Icon";
import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import styles from "./Carousel15.module.scss";

interface ICarouselSlide {
  image: string;
  title?: string;
  blurb?: string;
}

interface Carousel15Props {
  slides: ICarouselSlide[];
  activeIndicatorColor?: string;
  inactiveIndicatorColor?: string;
  arrowColor?: string;
  titleColor?: string;
  blurbColor?: string;
  dividerColor?: string;
}

const Carousel15: React.FC<Carousel15Props> = (props) => {
  const [position, setPositionState] = useState(0);
  const positionRef = useRef(0);
  const setPosition = (data: number) => {
    setPositionState(data);
    positionRef.current = data;
  };
  const responsive = useDataStore(Responsive);

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

  const handleImageClick = (slideIndex: number, img: string) => {
    // if user clicked current image, open image in thumbnail
    if (slideIndex === position) {
      showImage(img);
    } else {
      // else attempt to change slides to clicked image
      changeSlide(slideIndex);
    }
  };

  const showImage = (imagePath: string) => {
    // if screen is not "tiny", open image in modal
    if (!responsive.tiny) {
      Modal.open(<img src={`${imagePath}`} alt="" role="presentation" />, {
        isFrameless: true,
      });
    }
  };

  return (
    <>
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
                  {props.dividerColor && (
                    <div
                      className={styles.divider}
                      style={{ backgroundColor: props.dividerColor }}
                    />
                  )}
                  <h3 style={{ color: props.titleColor || "white" }}>
                    {slide.title}
                  </h3>
                  {slide.blurb && (
                    <p
                      className={styles.paragraph}
                      style={{ color: props.blurbColor || "white" }}
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
              return (
                <div
                  className={styles.slideWrapper}
                  key={i}
                  onClick={() => handleImageClick(i, slide.image)}
                >
                  <div
                    className={classNames(styles.slideImg, {
                      [styles.showing]: position === i,
                    })}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                </div>
              );
            })}
          </div>

          <Icon
            className={classNames(styles.rightArrowIcon, {
              [styles.showArrow]: position < props.slides.length - 1,
            })}
            iconName={"arrow_right"}
            iconType={"material"}
            onClick={() => changeSlide(position + 1)}
            style={{ color: props.arrowColor || "black" }}
          />
          <Icon
            className={classNames(styles.leftArrowIcon, {
              [styles.showArrow]: position > 0,
            })}
            iconName={"arrow_left"}
            iconType={"material"}
            onClick={() => changeSlide(position - 1)}
            style={{ color: props.arrowColor || "black" }}
          />
        </div>
      </div>
      <div className={styles.slideIndicatorsWrapper}>
        {props.slides.map((_, i) => {
          return (
            <div
              key={i}
              className={classNames(styles.slideIndicator, {
                [styles.active]: position === i,
              })}
              style={{
                backgroundColor:
                  position === i
                    ? props.activeIndicatorColor || "white"
                    : props.inactiveIndicatorColor || "black",
              }}
              onClick={() => changeSlide(i)}
            />
          );
        })}
      </div>
    </>
  );
};

export default Carousel15;
