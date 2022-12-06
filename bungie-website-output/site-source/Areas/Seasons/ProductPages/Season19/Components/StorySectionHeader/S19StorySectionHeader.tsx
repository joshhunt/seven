// Created by a-ahipp, 2022
// Copyright Bungie, Inc.

import React from "react";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import classNames from "classnames";
import parallax from "../../parallax";
import styles from "./S19StorySectionHeader.module.scss";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Responsive } from "@Boot/Responsive";

type S19StorySectionHeaderProps = {
  classes?: {
    root?: string;
  };
  data?: any; // To Be Connected
};

export const S19StorySectionHeader: React.FC<S19StorySectionHeaderProps> = (
  props
) => {
  const { data, classes } = props;
  const { heading, blurb, desktop_bg, desktop_fg } = data || {};

  const { mobile } = useDataStore(Responsive);
  const block = React.useRef(null);

  React.useEffect(() => {
    if (!mobile) {
      const { init, destroy } = parallax(block.current, { viewable: 0.5 });

      init();

      return destroy;
    }
  }, [mobile]);

  return (
    <div ref={block} className={classNames(styles.wrap, classes?.root)}>
      <div className={styles.top}>
        <img
          className={classNames(styles.layer, styles.bg, "layer")}
          data-speed={0.8}
          data-max={-200}
          data-min={0}
          src={desktop_bg?.url}
          alt=""
        />
        <img
          className={classNames(styles.layer, styles.fg)}
          src={desktop_fg?.url}
          alt=""
        />
        <div className={styles.topContent}>
          <h2
            className={styles.heading}
            dangerouslySetInnerHTML={sanitizeHTML(heading)}
          />
        </div>
      </div>
      <div className={styles.content}>
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(blurb)}
        />
      </div>
    </div>
  );
};
