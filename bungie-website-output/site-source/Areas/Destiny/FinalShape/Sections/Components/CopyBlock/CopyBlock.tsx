// Created by tmorris, 2023
// Copyright Bungie, Inc.

import {
  SafelySetInnerHTML,
  sanitizeHTML,
} from "@UI/Content/SafelySetInnerHTML";
import {
  PmpButton,
  PmpButtonProps,
} from "@UI/Marketing/FragmentComponents/PmpButton";
import classNames from "classnames";
import React from "react";
import styles from "./CopyBlock.module.scss";
interface ButtonProps extends PmpButtonProps {
  label?: string;
}
interface CopyBlockProps extends React.HTMLProps<HTMLDivElement> {
  heading: string;
  bodyCopy?: string;
  eyebrow?: string;
  button?: ButtonProps[];
  classes?: {
    title?: string;
    root?: string;
    divider?: string;
    content?: string;
  };
}

export const CopyBlock: React.FC<CopyBlockProps> = ({
  heading,
  bodyCopy,
  eyebrow,
  button,
  classes,
}) => (
  <div className={classNames(classes?.root)}>
    {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
    {heading && (
      <h2
        className={classNames(styles.title, classes?.title)}
        dangerouslySetInnerHTML={sanitizeHTML(heading)}
      />
    )}
    {bodyCopy ? (
      <div className={classNames(classes?.content)}>
        <p className={styles.bodyCopy}>
          <SafelySetInnerHTML html={bodyCopy} />
        </p>

        {Array.isArray(button) &&
          button?.length > 0 &&
          button.map((b: any) => (
            <div key={b.uid} className={styles.buttonWrapper}>
              <PmpButton className={styles.buyBtn} {...b}>
                {b.label}
              </PmpButton>
            </div>
          ))}
      </div>
    ) : null}
  </div>
);
