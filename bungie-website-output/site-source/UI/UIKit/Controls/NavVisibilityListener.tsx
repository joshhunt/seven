// Created by larobinson, 2022
// Copyright Bungie, Inc.

import React, { useEffect, useRef } from "react";

interface NavVisibilityListenerProps {}

export const NavVisibilityListener: React.FC<NavVisibilityListenerProps> = () => {
  const listenerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;
      document
        .querySelector("html")
        ?.classList.toggle("solid-header", !isIntersecting);
    };

    const options = {
      root: null as any, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(callback, options);

    if (listenerRef.current) {
      observer.observe(listenerRef.current);
    }

    return () => {
      if (listenerRef.current) {
        observer.unobserve(listenerRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="nav-visibility-listener"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        top: "60px",
      }}
      ref={listenerRef}
    />
  );
};
