// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightInteractiveSection.module.scss";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { InteractiveModalContents } from "./BeyondLightInteractiveModalContents";
import classNames from "classnames";

// Required props
interface IInteractiveSectionProps {
  sectionHeading?: string;

  itemOneTitle: string;
  itemOneSubtitle: string;
  itemOneImagePath: string;
  itemTwoTitle: string;
  itemTwoSubtitle: string;
  itemTwoImagePath: string;

  itemThreeTitle: string;
  itemThreeSubtitle: string;
  itemThreeImagePath: string;

  background: string;
  backgroundCandy?: string;
  ItemOneCandy?: string;

  itemOneModalEyebrow?: string;
  itemOneModalTitle?: string;
  itemOneModalBodyCopy?: string;
  itemOneModalImagePath?: string;
  itemOneModalBackgroundPoster?: string;
  itemOneModalBackgroundVideo?: string;
  itemOneModalLogoOne?: string;
  itemOneModalLogoTwo?: string;
  itemOneModalSubheadingOne?: string;
  itemOneModalCaptionOne?: string;
  itemOneModalSubheadingTwo?: string;
  itemOneModalCaptionTwo?: string;
  itemOneModalImagePathTwo?: string;

  itemTwoModalEyebrow?: string;
  itemTwoModalTitle?: string;
  itemTwoModalBodyCopy?: string;
  itemTwoModalImagePath?: string;
  itemTwoModalBackgroundPoster?: string;
  itemTwoModalBackgroundVideo?: string;
  itemTwoModalLogoOne?: string;
  itemTwoModalLogoTwo?: string;
  itemTwoModalSubheadingOne?: string;
  itemTwoModalCaptionOne?: string;
  itemTwoModalSubheadingTwo?: string;
  itemTwoModalCaptionTwo?: string;
  itemTwoModalImagePathTwo?: string;

  itemThreeModalEyebrow?: string;
  itemThreeModalTitle?: string;
  itemThreeModalBodyCopy?: string;
  itemThreeModalImagePath?: string;
  itemThreeModalBackgroundPoster?: string;
  itemThreeModalBackgroundVideo?: string;
  itemThreeModalLogoOne?: string;
  itemThreeModalLogoTwo?: string;
  itemThreeModalSubheadingOne?: string;
  itemThreeModalCaptionOne?: string;
  itemThreeModalSubheadingTwo?: string;
  itemThreeModalCaptionTwo?: string;
  itemThreeModalImagePathTwo?: string;
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type InteractiveSectionProps = IInteractiveSectionProps & DefaultProps;

interface IInteractiveSectionState {
  backgroundPositionWrapper: string;
  positionLeftItem: string;
  positionRightItem: string;
  positionCenterItem: string;
  positionLeftItemCandy: string;
  positionBackgroundCandy: string;
}

/**
 * InteractiveSection - Renders mouse following parallax elements
 *  *
 * @param {IInteractiveSectionProps} props
 * @returns
 */
export class InteractiveSection extends React.Component<
  InteractiveSectionProps,
  IInteractiveSectionState
> {
  constructor(props: InteractiveSectionProps) {
    super(props);

    this.state = {
      backgroundPositionWrapper: "",
      positionLeftItem: "",
      positionRightItem: "",
      positionCenterItem: "",
      positionLeftItemCandy: "",
      positionBackgroundCandy: "",
    };
  }

  public componentDidMount() {
    window.addEventListener("mousemove", (e) => this.parallax(e));
  }

  public componentWillUnmount() {
    window.removeEventListener("mousemove", (e) => this.parallax(e));
  }

  private parallax(e) {
    requestAnimationFrame(() => {
      const windowWidth = window?.innerWidth / 2;
      const windowHeight = window?.innerHeight / 2;
      const xAxisCalc = e.clientX - windowWidth;
      const yAxisCalc = e.clientY - windowHeight;

      const planeOne = `${50 - xAxisCalc * 0.035}% ${50 - yAxisCalc * 0.035}%`;
      const planeTwoBg = `${50 - xAxisCalc * 0.04}% ${50 - yAxisCalc * 0.04}%`;

      const leftItem = `${50 - xAxisCalc * 0.0275}px, ${
        50 - yAxisCalc * 0.0275
      }px`;
      const leftItemCandy = `${50 - xAxisCalc * 0.0205}px, ${
        50 - yAxisCalc * 0.0205
      }px`;
      const rightItem = `${50 - xAxisCalc * 0.035}px, ${
        50 - yAxisCalc * 0.035
      }px`;
      const centerItem = `${50 - xAxisCalc * 0.04}px, ${
        50 - yAxisCalc * 0.04
      }px`;
      const backgroundCandy = `${50 - xAxisCalc * 0.054}px, ${
        50 - yAxisCalc * 0.054
      }px`;

      this.setState({
        backgroundPositionWrapper: `${planeOne}, ${planeTwoBg}`,
        positionLeftItem: `${leftItem}, 0`,
        positionRightItem: `${rightItem}, 0`,
        positionCenterItem: `${centerItem}, 0`,
        positionLeftItemCandy: `${leftItemCandy}, 0`,
        positionBackgroundCandy: `${backgroundCandy}, 0`,
      });
    });
  }

  public static defaultProps: DefaultProps = {};

  public render() {
    const buildModal = (
      posterPath: string,
      backgroundVideo: string,
      eyebrow: string,
      heading: string,
      bodyCopy: string,
      detailImage: string,
      detailImageTwo: string,
      logoOne: string,
      logoTwo: string,
      subheadingOne: string,
      captionOne: string,
      subheadingTwo: string,
      captionTwo: string
    ) => {
      if (backgroundVideo && heading) {
        Modal.open(
          <InteractiveModalContents
            posterPath={posterPath}
            backgroundVideo={backgroundVideo}
            eyebrow={eyebrow}
            heading={heading}
            bodyCopy={bodyCopy}
            detailImage={detailImage}
            detailImageTwo={detailImageTwo}
            logoOne={logoOne}
            logoTwo={logoTwo}
            subheadingOne={subheadingOne}
            captionOne={captionOne}
            captionTwo={captionTwo}
            subheadingTwo={subheadingTwo}
          />,
          {
            isFrameless: true,
            className: styles.fullScreenModal,
          }
        );
      }
    };

    return (
      <section
        className={styles.sectionWrapper}
        style={{
          backgroundImage: `url(${this.props.background})`,
          backgroundPosition: `${this.state.backgroundPositionWrapper}`,
        }}
      >
        {this.props.sectionHeading && (
          <p className={styles.sectionHeading}>{this.props.sectionHeading}</p>
        )}
        <div className={styles.parallaxWrapper}>
          <div className={styles.parallaxInner}>
            <div className={styles.backgroundCandyPlace}>
              <div
                className={styles.backgroundCandyWrapper}
                style={{
                  transform: `translate3d(${this.state.positionBackgroundCandy})`,
                }}
              >
                <img
                  src={this.props.backgroundCandy}
                  alt=""
                  role="presentation"
                  className={styles.backgroundCandy}
                />
              </div>
            </div>

            <div className={styles.centerPlace}>
              <div
                className={styles.centerItem}
                style={{
                  transform: `translate3d(${this.state.positionCenterItem})`,
                }}
              >
                <img
                  src={this.props.itemTwoImagePath}
                  alt=""
                  role="presentation"
                />
              </div>
            </div>

            <div className={styles.leftPlace}>
              <div className={styles.leftItemCandyWrapper}>
                <img
                  src={this.props.ItemOneCandy}
                  alt=""
                  role="presentation"
                  className={styles.leftItemCandy}
                  style={{
                    transform: `translate3d(${this.state.positionLeftItemCandy})`,
                  }}
                />
              </div>
              <div
                className={styles.leftItem}
                style={{
                  transform: `translate3d(${this.state.positionLeftItem})`,
                }}
              >
                <img
                  src={this.props.itemOneImagePath}
                  alt=""
                  role="presentation"
                />
              </div>
            </div>

            <div className={styles.rightPlace}>
              <div
                className={styles.rightItem}
                style={{
                  transform: `translate3d(${this.state.positionRightItem})`,
                }}
              >
                <img
                  src={this.props.itemThreeImagePath}
                  alt=""
                  role="presentation"
                />
              </div>
            </div>

            <div className={styles.allAnchors}>
              <AnchorWithPlusIcon
                itemClass={styles.centerLink}
                linkText={this.props.itemTwoTitle}
                subheading={this.props.itemTwoSubtitle}
                isActive={
                  this.props.itemTwoModalBackgroundPoster &&
                  this.props.itemTwoModalTitle
                }
                handleClick={() =>
                  buildModal(
                    this.props.itemTwoModalBackgroundPoster,
                    this.props.itemTwoModalBackgroundVideo,
                    this.props.itemTwoModalEyebrow,
                    this.props.itemTwoModalTitle,
                    this.props.itemTwoModalBodyCopy,
                    this.props.itemTwoModalImagePath,
                    this.props.itemTwoModalImagePathTwo,
                    this.props.itemTwoModalLogoOne,
                    this.props.itemTwoModalLogoTwo,
                    this.props.itemTwoModalSubheadingOne,
                    this.props.itemTwoModalCaptionOne,
                    this.props.itemTwoModalSubheadingTwo,
                    this.props.itemTwoModalCaptionTwo
                  )
                }
              />
              <AnchorWithPlusIcon
                itemClass={styles.leftLink}
                linkText={this.props.itemOneTitle}
                subheading={this.props.itemOneSubtitle}
                isActive={
                  this.props.itemOneModalBackgroundPoster &&
                  this.props.itemOneModalTitle
                }
                handleClick={() =>
                  buildModal(
                    this.props.itemOneModalBackgroundPoster,
                    this.props.itemOneModalBackgroundVideo,
                    this.props.itemOneModalEyebrow,
                    this.props.itemOneModalTitle,
                    this.props.itemOneModalBodyCopy,
                    this.props.itemOneModalImagePath,
                    this.props.itemOneModalImagePathTwo,
                    this.props.itemOneModalLogoOne,
                    this.props.itemOneModalLogoTwo,
                    this.props.itemOneModalSubheadingOne,
                    this.props.itemOneModalCaptionOne,
                    this.props.itemOneModalSubheadingTwo,
                    this.props.itemOneModalCaptionTwo
                  )
                }
              />

              <AnchorWithPlusIcon
                itemClass={styles.rightLink}
                linkText={this.props.itemThreeTitle}
                subheading={this.props.itemThreeSubtitle}
                isActive={
                  this.props.itemThreeModalBackgroundPoster &&
                  this.props.itemThreeModalTitle
                }
                handleClick={() =>
                  buildModal(
                    this.props.itemThreeModalBackgroundPoster,
                    this.props.itemThreeModalBackgroundVideo,
                    this.props.itemThreeModalEyebrow,
                    this.props.itemThreeModalTitle,
                    this.props.itemThreeModalBodyCopy,
                    this.props.itemThreeModalImagePath,
                    this.props.itemThreeModalImagePathTwo,
                    this.props.itemThreeModalLogoOne,
                    this.props.itemThreeModalLogoTwo,
                    this.props.itemThreeModalSubheadingOne,
                    this.props.itemThreeModalCaptionOne,
                    this.props.itemThreeModalSubheadingTwo,
                    this.props.itemThreeModalCaptionTwo
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export const AnchorWithPlusIcon = ({
  linkText,
  itemClass,
  handleClick,
  subheading,
  isActive,
}) => {
  const activeLink = isActive ? styles.svgWrapperActive : "";

  return (
    <span role={"button"} className={styles.anchorSpan}>
      <div
        className={itemClass && itemClass}
        onClick={handleClick && handleClick}
        style={{ cursor: isActive ? "pointer" : "default" }}
      >
        <span>
          <div className={classNames(styles.svgWrapper, activeLink)}>
            <h3 className={styles.title}>
              {isActive ? (
                <span>
                  <svg
                    id="plus"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      id="Rectangle_1098_copy"
                      className="cls-1"
                      d="M804,5106h2v16h-2v-16Zm-7,7h16v2H797v-2Z"
                      transform="translate(-796 -5105)"
                    />
                  </svg>
                </span>
              ) : (
                <span>
                  <svg
                    id="lock"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="17"
                    viewBox="0 0 13 17"
                  >
                    <g stroke="#f5f5f5" strokeWidth="2">
                      <rect
                        fill="#fff"
                        className="cls1"
                        y="7"
                        width="13"
                        height="10"
                      />
                      <circle
                        fill="none"
                        stroke="#f5f5f5"
                        strokeWidth="2"
                        className="cls2"
                        cx="6.5"
                        cy="5.5"
                        r="4.5"
                      />
                    </g>
                  </svg>
                </span>
              )}
              {linkText}
            </h3>
            <p className={styles.subheading}>{subheading}</p>
          </div>
        </span>
      </div>
    </span>
  );
};
