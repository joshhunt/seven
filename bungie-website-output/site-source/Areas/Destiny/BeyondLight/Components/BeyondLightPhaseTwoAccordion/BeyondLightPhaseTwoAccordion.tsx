// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import * as React from "react";
import styles from "./BeyondLightPhaseTwoAccordion.module.scss";
import { BeyondLightPhaseTwoAccordionPanel } from "./BeyondLightPhaseTwoAccordionPanel";

interface IAccordionDefinition {
  title: string;
  labelBackground: string;
  description: string;
  image: string;
}

// Required props
interface IPhaseTwoAccordionProps {
  accordionData: IAccordionDefinition[];
}

// Default props - these will have values set in Component.defaultProps
interface DefaultProps {}

export type PhaseTwoAccordionProps = IPhaseTwoAccordionProps & DefaultProps;

interface IPhaseTwoAccordionState {
  activePanel: number;
  isActive: boolean;
}

/**
 * Accordion - Renders an accordion component,
 * horizontal on desktop - vertically stacked medium and lower
 *  *
 * @param {IAccordionProps} props
 * @returns
 */
export class PhaseTwoAccordion extends React.Component<
  PhaseTwoAccordionProps,
  IPhaseTwoAccordionState
> {
  constructor(props: PhaseTwoAccordionProps) {
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
          <BeyondLightPhaseTwoAccordionPanel
            key={e.title}
            title={e.title}
            labelBackground={e.labelBackground}
            description={e.description}
            image={e.image}
            index={i}
            isActive={this.state.isActive}
            activePanel={this.state.activePanel}
            setActive={() => toggleActive(i)}
          />
        ))}
      </section>
    );
  }
}
