// Created by larobinson, 2022
// Copyright Bungie, Inc.

import React, { useEffect, useRef } from "react";

interface NavVisibilityListenerProps {}

export const NavVisibilityListener: React.FC<NavVisibilityListenerProps> = (
  props
) => {
  const callback = (entries: any[]) => {
    document.querySelector("html").classList.toggle("solid-header");
  };
  const listenerRef = useRef(null);

  const options = {
    root: null as HTMLElement,
    rootMargin: "0px",
    threshold: 1,
  };

  const observer = new IntersectionObserver(callback, options);

  useEffect(() => {
    listenerRef.current && observer.observe(listenerRef.current);
  }, [listenerRef]);

  return (
    <div
      className={"nav-visibility-listener"}
      style={{ position: "absolute", width: "1px", height: "1px", top: "60px" }}
      ref={listenerRef}
    />
  );
};
