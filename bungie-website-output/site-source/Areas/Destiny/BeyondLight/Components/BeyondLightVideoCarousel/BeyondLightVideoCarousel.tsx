// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { Modal } from "@UIKit/Controls/Modal/Modal";
import classNames from "classnames";
import React from "react";
import styles from "./BeyondLightVideoCarousel.module.scss";
import YoutubeModal from "@UI/UIKit/Controls/Modal/YoutubeModal";
import { VideoSlider } from "./BeyondLightVideoSlider";

interface ICarouselClassNames {
  wrapper?: string;
  eyebrow?: string;
}

interface carouselDataDefinition {
  description: string;
  title: string;
  poster?: string;
  eyebrow: string;
  videoId?: string;
  thumbnailImage?: string;
  modalImage?: string;
  disclaimer?: string;
}

interface IVideoCarouselProps {
  isMedium: boolean;
  backgroundCandy?: string;
  backgroundImage?: string;
  border?: boolean;
  carouselData?: carouselDataDefinition[];
  classes?: ICarouselClassNames;
  startingIndex?: number;
}

const VideoCarousel: React.FC<IVideoCarouselProps> = ({
  backgroundCandy,
  backgroundImage,
  isMedium,
  carouselData,
  border,
  startingIndex,
  classes,
}: IVideoCarouselProps) => {
  const showVideo = (videoId: string) => {
    if (isMedium) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.location.href = videoUrl;
    } else {
      YoutubeModal.show({ videoId });
    }
  };

  const showImage = (imageName: string) => {
    Modal.open(
      <img
        src={`${imageName}`}
        alt=""
        role="presentation"
        className={styles.largeImage}
      />,
      {
        isFrameless: true,
      }
    );
  };

  const wrapperClasses = classNames(
    styles.videoCarouselWrapper,
    classes?.wrapper
  );
  const eyebrowClasses = classNames(styles.eyebrow, classes?.eyebrow);

  return (
    <>
      <section
        className={wrapperClasses}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          borderTop: `${border && `1px solid white`}`,
        }}
      >
        {border && <span className={styles.topBorder} />}
        <VideoSlider
          backgroundCandy={backgroundCandy}
          startingIndex={startingIndex}
        >
          {carouselData
            ? carouselData.map((slide) => {
                return (
                  slide.title && (
                    <div key={slide.title} className={styles.panelContainer}>
                      <div className={styles.textWrapper}>
                        <p className={eyebrowClasses}>{slide.eyebrow}</p>
                        <h2>{slide.title}</h2>
                        <span className={styles.shortBorder} />
                        <p className={styles.description}>
                          {slide.description}
                        </p>
                      </div>
                      {slide.videoId?.length > 1 ? (
                        <div
                          className={styles.videoContainer}
                          style={{
                            backgroundImage: `url(${
                              slide.poster || slide.thumbnailImage
                            })`,
                          }}
                        >
                          <div
                            role="button"
                            className={styles.firstPanel}
                            onClick={() => showVideo(slide.videoId)}
                          >
                            <div className={styles.videoPlayButton} />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={styles.videoContainer}
                          style={{
                            backgroundImage: `url(${slide.thumbnailImage})`,
                          }}
                        >
                          {slide.disclaimer && (
                            <span className={styles.disclaimer}>
                              {slide.disclaimer}
                            </span>
                          )}
                          <div
                            role="button"
                            className={styles.firstPanel}
                            onClick={() => showImage(slide.modalImage)}
                          />
                        </div>
                      )}
                    </div>
                  )
                );
              })
            : null}
        </VideoSlider>
      </section>
    </>
  );
};

export default VideoCarousel;
