// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import React, { ReactNode } from "react";
import classNames from "classnames";
import styles from "./BeyondLightVideoCarousel.module.scss";

// Required props
interface IVideoSliderProps {
  children: React.ReactNode[];
  backgroundCandy?: string;
  startingIndex?: number;
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type VideoSliderProps = IVideoSliderProps & DefaultProps;

interface IVideoSliderState {
  currentIndex: number;
}

/**
 * Component - Replace this description
 *  *
 * @param {IVideoSliderProps} props
 * @returns
 */
export class VideoSlider extends React.Component<
  VideoSliderProps,
  IVideoSliderState
> {
  constructor(props: VideoSliderProps) {
    super(props);

    this.state = {
      currentIndex: this.props.startingIndex,
    };
  }

  private get validChildren() {
    return this.props.children.filter((c) => !!c);
  }

  private readonly getBackgroundPosition = (index) => {
    return `${index * -25 - 25}px, 100%`;
  };

  private readonly selectSlide = (index) => () => {
    this.setState({ currentIndex: index });
  };

  private get renderNextButton() {
    return (
      this.validChildren.length !== 0 &&
      this.state.currentIndex + 1 < this.validChildren.length &&
      this.state.currentIndex !== this.validChildren.length
    );
  }

  private get renderPrevButton() {
    return (
      this.validChildren.length !== 1 &&
      this.state.currentIndex - 1 < this.validChildren.length &&
      this.state.currentIndex !== 0
    );
  }

  private readonly renderPips = (
    currentIndex: number,
    children: Exclude<ReactNode, boolean | null | undefined>[]
  ) => {
    return this.validChildren.map((_, index) => {
      if (_ !== null) {
        const pipColor =
          index === currentIndex ? "rgb(245, 245, 245)" : "#242d57";

        return (
          <span
            key={index}
            role={"button"}
            style={{
              background: pipColor,
              width: `${this.validChildren.length > 4 ? "4rem" : "6.875rem"}`,
            }}
            className={styles.pip}
            onClick={this.selectSlide(index)}
          />
        );
      }
    });
  };

  public render() {
    const { currentIndex } = this.state;

    return (
      <>
        <div
          className={styles.slider}
          style={{
            backgroundImage: `url(${this.props.backgroundCandy})`,
            backgroundPosition: `${this.getBackgroundPosition(
              this.state.currentIndex
            )}`,
          }}
        >
          <div className={styles.content}>
            {this.renderPrevButton && (
              <div
                className={styles.leftOverlay}
                role="button"
                onClick={this.selectSlide(currentIndex - 1)}
              />
            )}

            {this.validChildren.map((child, pipIndex) => {
              const classes = classNames(styles.slide, {
                [styles.current]: this.state.currentIndex === pipIndex,
              });

              return (
                <div
                  key={pipIndex}
                  className={classes}
                  data-diff={pipIndex - this.state.currentIndex}
                >
                  {child}
                </div>
              );
            })}

            {this.renderNextButton && (
              <div
                className={styles.rightOverlay}
                role="button"
                onClick={this.selectSlide(currentIndex + 1)}
              />
            )}
          </div>
        </div>
        {this.validChildren.length > 1 && (
          <div className={styles.pipContainer}>
            {this.renderPips(this.state.currentIndex, this.validChildren)}
          </div>
        )}
      </>
    );
  }
}
