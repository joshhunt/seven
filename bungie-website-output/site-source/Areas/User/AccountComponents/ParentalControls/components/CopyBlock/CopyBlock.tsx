import React, { FC } from "react";
import styles from "./CopyBlock.module.scss";

interface CopyBlockProps {
  heading: string;
  subheading?: string;
}

const CopyBlock: FC<CopyBlockProps> = ({ heading, subheading }) => {
  return (
    <div>
      <h2 className={styles.heading}>{heading}</h2>
      {subheading && <p className={styles.subheading}>{subheading}</p>}
    </div>
  );
};

export default CopyBlock;
