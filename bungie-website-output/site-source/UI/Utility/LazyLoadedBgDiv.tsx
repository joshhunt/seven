// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

import { intersectObserver } from "@Boot/IntersectObserver";
import { bgImage } from "@Utilities/ContentStackUtils";
import React, { useEffect, useRef, useState } from "react";

type LazyLoadedBgDivProps = React.HTMLProps<HTMLDivElement> & {
  img?: string;
  children?: React.ReactNode | React.ReactNode[];
};

/** Renders <div> with a lazily loaded bg image */
const LazyLoadedBgDiv = (props: LazyLoadedBgDivProps) => {
  const { children, img, style, ...rest } = props;

  const [loadBg, setLoadBg] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* Loads bg image when <div> is about to show up in the viewport */
    intersectObserver.observeLazyLoadImgEle(divRef.current, setLoadBg);
  }, []);

  return (
    <div
      {...rest}
      ref={divRef}
      style={{
        backgroundImage: loadBg ? bgImage(img) : undefined,
        ...(style ?? {}),
      }}
    >
      {children}
    </div>
  );
};

export default LazyLoadedBgDiv;
