// Created by tmorris, 2023
// Copyright Bungie, Inc.

import { Responsive } from "@Boot/Responsive";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { sanitizeHTML } from "@UI/Content/SafelySetInnerHTML";
import React, { memo } from "react";
import { BnetStackFile } from "../../../../../../Generated/contentstack-types";
import styles from "./EventHighlight.module.scss";

type EventHighlightProps = {
  heading?: string;
  top_subheading?: string;
  bottom_subheading?: string;
  image?: BnetStackFile;
};

const EventHighlight: React.FC<EventHighlightProps> = ({
  heading,
  top_subheading,
  bottom_subheading,
  image,
}) => {
  const { mobile } = useDataStore(Responsive);

  return heading || image ? (
    <div className={styles.container}>
      {(heading || top_subheading) && (
        <div className={styles.topCopy}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {top_subheading && <p className={styles.blurb}>{top_subheading}</p>}
        </div>
      )}
      {image?.url && <img className={styles.image} src={image.url} />}
      {bottom_subheading && (
        <p
          className={styles.blurb}
          dangerouslySetInnerHTML={sanitizeHTML(bottom_subheading)}
        />
      )}
    </div>
  ) : null;
};

export default memo(EventHighlight);
