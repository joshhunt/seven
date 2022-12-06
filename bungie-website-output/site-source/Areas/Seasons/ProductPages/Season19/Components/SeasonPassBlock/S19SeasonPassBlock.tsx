import React from "react";
import styles from "./S19SeasonPassBlock.module.scss";
import classNames from "classnames";

type S19SeasonPassBlockProps = {
  classes?: {
    root?: string;
  };
  reverseLayout?: boolean;
  data?: any; // To Be Connected
};

export const S19SeasonPassBlock: React.FC<S19SeasonPassBlockProps> = (
  props
) => {
  const { data, classes, reverseLayout } = props;
  const { heading, blurb, image } = data || {};

  return (
    <div
      className={classNames(
        styles.root,
        reverseLayout && styles.reverseLayout,
        classes?.root
      )}
    >
      <div className={styles.imageWrap}>
        <img className={styles.image} src={image?.url} alt={image?.title} />
      </div>
      <div className={styles.content}>
        <h2
          className={styles.heading}
          dangerouslySetInnerHTML={{ __html: heading }}
        />
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={{ __html: blurb }}
        />
      </div>
    </div>
  );
};
