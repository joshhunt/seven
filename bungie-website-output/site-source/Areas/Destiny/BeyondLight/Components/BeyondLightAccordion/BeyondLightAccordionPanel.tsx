// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import classNames from "classnames";
import styles from "./BeyondLightAccordion.module.scss";

// Required props
interface IBeyondLightAccordionPanelProps {
  title: string;
  eyebrow: string;
  summary?: string;
  mainImage?: string;
  activePanel: number;
  index: number;
  setActive: (e: React.MouseEvent) => void;
  itemImage?: string;
  itemImageTwo?: string;
  subheadingOne?: string;
  captionOne?: string;
  subheadingTwo?: string;
  captionTwo?: string;
  logoImageOne?: string;
  logoImageTwo?: string;
  detailMainImage?: string;
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type BeyondLightAccordionPanelProps = IBeyondLightAccordionPanelProps &
  DefaultProps;

interface IBeyondLightAccordionPanelState {
  foldHeight: number;
  isActive: boolean;
}

/**
 * BeyondLightAccordionPanel - This is the panel inside of the BeyondLightAccordion
 *  *
 * @param {BeyondLightAccordionPanelProps} props
 * @returns
 */
export class BeyondLightAccordionPanel extends React.Component<
  BeyondLightAccordionPanelProps,
  IBeyondLightAccordionPanelState
> {
  private readonly foldRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: BeyondLightAccordionPanelProps) {
    super(props);
    this.state = {
      foldHeight: 0,
      isActive: false,
    };
  }

  public componentDidMount() {
    const height = this.foldRef.current.scrollHeight;

    this.setState({ foldHeight: height });
  }

  public handleClick = () => {
    this.setState({ isActive: !this.state.isActive });
  };

  public render() {
    const {
      detailMainImage,
      eyebrow,
      logoImageOne,
      itemImageTwo,
      logoImageTwo,
      summary,
      title,
      mainImage,
      index,
      activePanel,
      setActive,
      itemImage,
      subheadingOne,
      captionOne,
      subheadingTwo,
      captionTwo,
    } = this.props;
    const isCurrentlyActive = activePanel === index;
    const activePanelStyle = isCurrentlyActive
      ? styles.activePanel
      : styles.inactivePanel;
    const activeLink = isCurrentlyActive ? styles.svgWrapperActive : null;

    return (
      <div
        ref={this.foldRef}
        className={classNames(activePanelStyle, styles.panel)}
        key={title}
      >
        <div
          role="button"
          onClick={isCurrentlyActive || !captionOne ? null : setActive}
        >
          <div
            className={styles.titleWrapper}
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className={classNames(styles.svgWrapper, activeLink)}>
              <h3 className={styles.title}>
                {summary ? (
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
                {title}
              </h3>
              <p
                className={styles.eyebrow}
                style={{ letterSpacing: captionOne ? "7px" : "1px" }}
              >
                {eyebrow}
              </p>
            </div>
          </div>
        </div>

        {summary && (
          <div
            className={styles.detailsWrapper}
            style={{
              maxHeight: isCurrentlyActive
                ? `${this.state.foldHeight + 300}px`
                : 0,
              opacity: isCurrentlyActive ? "1" : "0",
            }}
          >
            <img
              src={detailMainImage}
              className={styles.detailMainImage}
              alt=""
              role="presentation"
            />
            <p className={styles.innerEyebrow}>{title}</p>
            <h3 className={styles.innerTitle}>{eyebrow}</h3>
            <p className={styles.summary}>{summary}</p>

            <div className={styles.imgWrapper}>
              <img
                src={itemImage}
                className={styles.itemImage}
                alt={""}
                role="presentation"
                style={{ opacity: this.state.isActive ? "1" : "0" }}
              />
              <img
                src={itemImageTwo}
                className={styles.itemImage}
                alt={""}
                role="presentation"
                style={{ opacity: !this.state.isActive ? "1" : "0" }}
              />
            </div>

            <div className={styles.logoWrapper}>
              <div
                role="button"
                onClick={this.state.isActive ? null : () => this.handleClick()}
                className={classNames(
                  styles.logo,
                  this.state.isActive ? styles.active : null
                )}
                style={{ backgroundImage: `url(${logoImageOne})` }}
              />
              <div
                role="button"
                onClick={!this.state.isActive ? null : () => this.handleClick()}
                className={classNames(
                  styles.logo,
                  !this.state.isActive ? styles.active : null
                )}
                style={{ backgroundImage: `url(${logoImageTwo})` }}
              />
            </div>

            <div className={styles.move}>
              <div
                className={styles.moveSection}
                style={{ opacity: this.state.isActive ? "1" : "0" }}
              >
                <h4 className={styles.subheading}>{subheadingOne}</h4>
                <p className={styles.caption}>{captionOne}</p>
              </div>
              <div
                className={styles.moveSection}
                style={{ opacity: !this.state.isActive ? "1" : "0" }}
              >
                <h4 className={styles.subheading}>{subheadingTwo}</h4>
                <p className={styles.caption}>{captionTwo}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
