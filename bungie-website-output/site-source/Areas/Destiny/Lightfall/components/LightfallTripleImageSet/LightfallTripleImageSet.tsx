// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import {
  PmpCaptionThumbnails,
  PmpCaptionThumbnailsProps,
} from "@UI/Marketing/Fragments/PmpCaptionThumbnails";
import classNames from "classnames";
import React from "react";
import { BnetStackNebulaProductPage } from "../../../../../Generated/contentstack-types";
import styles from "./LightfallTripleImageSet.module.scss";

interface LightfallTripleImageSetProps {
  data?: BnetStackNebulaProductPage["our_end_section"]["top_header"]["thumbnails"][number];
  classes?: PmpCaptionThumbnailsProps["classes"];
}

export const LightfallTripleImageSet: React.FC<LightfallTripleImageSetProps> = (
  props
) => {
  const { classes, data } = props;

  return (
    <PmpCaptionThumbnails
      data={data}
      classes={{
        thumbWrapper: classNames(styles.thumbWrapper, classes?.thumbWrapper),
        caption: classNames(styles.caption, classes?.caption),
        thumbnail: classNames(styles.thumbnail, classes?.thumbnail),
        root: classNames(styles.imgSet, classes?.root),
      }}
    />
  );
};
