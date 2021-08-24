// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightAccordion.module.scss";
import { BeyondLightAccordionPanel } from "./BeyondLightAccordionPanel";

interface IBeyondLightAccordionDefinition {
  title: string;
  eyebrow: string;
  summary?: string;
  mainImage?: string;
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

// Required props
interface IBeyondLightAccordionProps {
  accordionData: IBeyondLightAccordionDefinition[];
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type BeyondLightAccordionProps = IBeyondLightAccordionProps &
  DefaultProps;

interface IBeyondLightAccordionState {
  activePanel: number;
  isActive: boolean;
}

/**
 * BeyondLightAccordion - Renders an accordion component,
 * horizontal on desktop - vertically stacked medium and lower
 *  *
 * @param {IBeyondLightAccordionProps} props
 * @returns
 */
export class BeyondLightAccordion extends React.Component<
  BeyondLightAccordionProps,
  IBeyondLightAccordionState
> {
  constructor(props: BeyondLightAccordionProps) {
    super(props);

    this.state = {
      activePanel: null,
      isActive: false,
    };
  }

  public render() {
    const toggleActive = (index: number) => {
      this.setState((prev) => ({
        activePanel: prev.activePanel === index ? -1 : index,
        isActive: !this.state.isActive,
      }));
    };

    return (
      <section className={styles.accordionWrapper}>
        {this.props.accordionData.map((e, i) => (
          <BeyondLightAccordionPanel
            key={e.title}
            title={e.title}
            eyebrow={e.eyebrow}
            summary={e.summary}
            mainImage={e.mainImage}
            index={i}
            activePanel={this.state.activePanel}
            setActive={() => toggleActive(i)}
            itemImage={e.itemImage}
            itemImageTwo={e.itemImageTwo}
            subheadingOne={e.subheadingOne}
            captionOne={e.captionOne}
            subheadingTwo={e.subheadingTwo}
            captionTwo={e.captionTwo}
            logoImageOne={e.logoImageOne}
            logoImageTwo={e.logoImageTwo}
            detailMainImage={e.detailMainImage}
          />
        ))}
      </section>
    );
  }
}
