import React from "react";
import { PropsWithChildren } from "react";
import styles from "./ContentStackStyler.module.scss";

/**
 * Sets the style of the elements to the ContentStack style.
 */
export function ContentStackStyler({ children }: PropsWithChildren<unknown>) {
  return <div className={styles.wrapper}>{children}</div>;
}
