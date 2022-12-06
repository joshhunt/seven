import React from "react";
import styles from "./S19SeasonPassSectionHeader.module.scss";
import classNames from "classnames";

type S19SeasonPassSectionHeaderProps = {
  classes?: {
    root?: string;
  };
  data?: any; // To Be Connected
};

export const S19SeasonPassSectionHeader: React.FC<S19SeasonPassSectionHeaderProps> = (
  props
) => {
  const { data, classes } = props;
  const { heading, blurb, image } = data || {};

  return (
    <div className={classNames(styles.root, classes?.root)}>
      <img className={styles.image} src={image?.url} alt={image?.title} />
      <h2
        className={styles.heading}
        dangerouslySetInnerHTML={{ __html: heading }}
      />
      <p className={styles.blurb} dangerouslySetInnerHTML={{ __html: blurb }} />
    </div>
  );
};
