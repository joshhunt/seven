// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightAccordion.module.scss";
import { AccordionPanel } from "./BeyondLightAccordionPanel";

interface IAccordionDefinition {
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
interface IAccordionProps {
  accordionData: IAccordionDefinition[];
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type AccordionProps = IAccordionProps & DefaultProps;

interface IAccordionState {
  activePanel: number;
  isActive: boolean;
}

/**
 * Accordion - Renders an accordion component,
 * horizontle on desktop - vertically stacked medium and lower
 *  *
 * @param {IAccordionProps} props
 * @returns
 */
export class Accordion extends React.Component<
  AccordionProps,
  IAccordionState
> {
  constructor(props: AccordionProps) {
    super(props);

    this.state = {
      activePanel: null,
      isActive: false,
    };
  }

  public render() {
    const toggleActive = (index) => {
      this.setState((prev) => ({
        activePanel: prev.activePanel === index ? -1 : index,
        isActive: !this.state.isActive,
      }));
    };

    return (
      <section className={styles.accordionWrapper}>
        {this.props.accordionData.map((e, i) => (
          <AccordionPanel
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
