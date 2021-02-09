// Created by larobinson, 2021
// Copyright Bungie, Inc.

import { BrowserUtils } from "@Utilities/BrowserUtils";
import React from "react";

interface ScrollToAnchorTagsProps {
  animate: boolean;
}

export const ScrollToAnchorTags: React.FC<ScrollToAnchorTagsProps> = ({
  animate,
}) => {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    const top = el.getBoundingClientRect().top + window.scrollY;

    BrowserUtils.animatedScrollTo(top, 1000);
  };

  animate &&
    setTimeout(() => {
      if (window.location.hash) {
        scrollToId(window.location.hash.substr(1));
      }
    }, 1000);

  return <div />;
};
