// Created by atseng, 2023
// Copyright Bungie, Inc.

import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Accordion.module.scss";

export interface IAccordionItem {
  triggerElement: ReactNode;
  collapsibleElement: ReactNode;
  className?: string;
  triggerClassName?: string;
  collapsibleClassName?: string;
  /**
   * If provided, this collapsible item is open on load
   */
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: IAccordionItem[];
  /**
   * If provided, will use limit the collapsible list to only open one at a time
   */
  limitOneOpen?: boolean;
  className?: string;
  /**
   * a className given to all the trigger elements
   */
  triggersClassName?: string;
  /**
   * a className given to all the collapsible elements
   */
  collapsiblesClassName?: string;
  /**
   * If provided, the first collapsible will be open on load
   */
  defaultOpenFirst?: boolean;
  /**
   * a className given to all the open collapsible elements
   */
  openClassName?: string;
  /**
   * Disable autoscroll into view when item clicked
   */
  disableAutoscroll?: boolean;
}

export const Accordion: React.FC<AccordionProps> = (props) => {
  const [openItems, setOpenItems] = useState<number[]>(
    props.defaultOpenFirst ? [0] : []
  );

  const findOpenItems = () => {
    setOpenItems(
      props.items
        ?.map((section, index) => {
          if (!section.defaultOpen) {
            return undefined;
          }

          return index;
        })
        .filter((i) => !isNaN(i))
    );
  };

  useEffect(() => {
    findOpenItems();
  }, []);

  return (
    <div className={classNames(styles.accordion, props.className)}>
      {props.items?.map((i, index) => {
        return (
          <div
            key={index}
            id={`accordion-section-${index}`}
            className={classNames(styles.item, i.className, {
              [props.openClassName]: openItems.includes(index),
            })}
          >
            <div
              className={classNames(
                styles.trigger,
                props.triggersClassName,
                i.triggerClassName
              )}
              onClick={() => {
                const isOpen = openItems.includes(index);

                if (!isOpen && !props.disableAutoscroll) {
                  const section = document.getElementById(
                    `accordion-section-${index}`
                  );
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }

                setOpenItems(
                  isOpen
                    ? [
                        ...openItems.filter(
                          (sectionIndex) => sectionIndex !== index
                        ),
                      ]
                    : [...openItems, index]
                );
              }}
            >
              {i.triggerElement}
            </div>
            {openItems?.includes(index) && (
              <div
                className={classNames(
                  styles.collapsible,
                  props.collapsiblesClassName,
                  i.collapsibleClassName
                )}
              >
                {i.collapsibleElement}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
