// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import classNames from "classnames";
import styles from "./BeyondLightPhaseTwoAccordion.module.scss";

// Required props
interface IPhaseTwoAccordionPanelProps {
  title: string;
  labelBackground: string;
  description: string;
  image: string;
  activePanel: number;
  index: number;
  isActive: boolean;
  setActive: (e: React.MouseEvent) => void;
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type PhaseTwoAccordionPanelProps = IPhaseTwoAccordionPanelProps &
  DefaultProps;

interface IPhaseTwoAccordionPanelState {
  foldHeight: number;
}

/**
 * AccordionPanel - This is the panel inside of the Accordion
 *  *
 * @param {AccordionPanelProps} props
 * @returns
 */
export class BeyondLightPhaseTwoAccordionPanel extends React.Component<
  PhaseTwoAccordionPanelProps,
  IPhaseTwoAccordionPanelState
> {
  private readonly foldRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: PhaseTwoAccordionPanelProps) {
    super(props);
    this.state = {
      foldHeight: 0,
    };
  }

  public componentDidMount() {
    const height = this.foldRef.current.scrollHeight;

    this.setState({ foldHeight: height });
  }

  public render() {
    const {
      title,
      labelBackground,
      activePanel,
      index,
      setActive,
      description,
      image,
      isActive,
    } = this.props;
    const isCurrentlyActive = activePanel === index;
    const activePanelStyle = isCurrentlyActive
      ? styles.activePanel
      : styles.inactivePanel;

    return (
      <div
        ref={this.foldRef}
        className={classNames(activePanelStyle, styles.panel)}
        key={title}
      >
        <div
          className={styles.titleWrapper}
          style={{ backgroundImage: `url(${labelBackground})` }}
          role="button"
          onClick={setActive}
        >
          <h3 className={styles.title}>{title}</h3>
          <span
            className={classNames(
              styles.iconWrapper,
              styles.iconWrapperPulse,
              isCurrentlyActive && styles.iconWrapperActive
            )}
          >
            <svg
              aria-hidden="true"
              fill="#fff"
              className="icon icon--type-cog"
              width="16"
              height="16"
              role="img"
              version="1.1"
              viewBox="0 0 64 64"
            >
              <rect className="horizontal" y="28" width="64" height="8" />
              <rect className="vertical" x="28" width="8" height="64" />
            </svg>
          </span>
        </div>

        <div
          className={styles.detailsWrapper}
          style={{
            maxHeight: isCurrentlyActive
              ? `${this.state.foldHeight + 300}px`
              : 0,
            opacity: isCurrentlyActive ? "1" : "0",
          }}
        >
          <p id={title} className={styles.description}>
            {description}
          </p>
          <img
            aria-describedby={title}
            src={image}
            alt=""
            role="presentation"
          />
        </div>
      </div>
    );
  }
}
