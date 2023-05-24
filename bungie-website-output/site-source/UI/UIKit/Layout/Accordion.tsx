// Created by atseng, 2023
// Copyright Bungie, Inc.

import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "./Accordion.module.scss";

interface IAccordionItem {
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
}

export const Accordion: React.FC<AccordionProps> = (props) => {
  const [openItems, setOpenItems] = useState<number[]>(
    props.defaultOpenFirst ? [0] : []
  );

  const findOpenItems = () => {
    setOpenItems(
      props.items
        .map((i, index) => {
          if (!i.defaultOpen) {
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
      {props.items.map((i, index) => {
        return (
          <div key={index} className={classNames(styles.item, i.className)}>
            <div
              className={classNames(
                styles.trigger,
                props.triggersClassName,
                i.triggerClassName
              )}
              onClick={() => {
                const isOpen = openItems.includes(index);

                setOpenItems(
                  isOpen
                    ? [...openItems.filter((o) => o !== index)]
                    : [...openItems, index]
                );
              }}
            >
              {i.triggerElement}
            </div>
            {openItems.includes(index) && (
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
