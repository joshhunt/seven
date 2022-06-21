// Created by a-bphillips, 2022
// Copyright Bungie, Inc.

type ObserverCallback = (entry: IntersectionObserverEntry) => void;

/**
 * Intersect observer utility class for firing events when an element intersects with
 * the viewport.  Uses a single observer instance to contain every element entry, rather
 * than creating multiple observer instances for different groups of elements, providing a
 * significant performance increase.
 */
class IOInternal {
  private readonly io: IntersectionObserver;
  /* Unique callbacks to be fired for specific elements */
  public readonly callbacks: Map<Element, ObserverCallback> = new Map();

  constructor() {
    // create new IntersectionObserver instance to be shared across site
    this.io = new IntersectionObserver(this.cb, {
      /* Fires observer event when target is 50vh from bottom of viewport */
      rootMargin: `${window.innerHeight / 2}px`,
    });
  }

  private readonly cb: IntersectionObserverCallback = (entries, observer) => {
    // elements currently intersecting with the viewport
    const intersectingEntries = entries.filter((e) => e.isIntersecting);

    intersectingEntries.forEach((e) => {
      const cb = this.getCallback(e.target);

      cb && cb(e);
    });

    return;
  };

  /** Starts observing and element to fire and event when it intersects with the viewport */
  public readonly observeEle = (
    ele: Element,
    cb?: ObserverCallback,
    unobserveOnIntersect?: boolean
  ) => {
    // if browser doesn't support IntersectObserver, just fire callback now
    if (
      !("IntersectionObserver" in window) ||
      !("IntersectionObserverEntry" in window) ||
      !("intersectionRatio" in window.IntersectionObserverEntry.prototype)
    ) {
      return cb && cb(null);
    }

    this.addCallback(ele, cb, unobserveOnIntersect);

    this.io.observe(ele);
  };

  /** Calls setState function on element intersection for lazily loading an img */
  public readonly observeLazyLoadImgEle = (
    ele: Element | undefined,
    setBgState: (loadBg: boolean) => void
  ) => {
    if (!ele) {
      // if target element doesn't exist, just set element bg now
      setBgState(true);
    } else {
      this.observeEle(ele, () => setBgState(true), true);
    }
  };

  public readonly unobserveEle = (ele: Element) => {
    // stop observing element
    this.io.unobserve(ele);
    // remove callback function for element
    this.callbacks.delete(ele);
  };

  /* Stores callback function to be fired when a specific element intersects with the viewport */
  private readonly addCallback = (
    ele: Element,
    cb?: ObserverCallback,
    unobserveOnIntersect?: boolean
  ) => {
    const callback: ObserverCallback = (e) => {
      cb && cb(e);
      // callback needs to fire 'unobserve' method if requested
      unobserveOnIntersect && this.unobserveEle(ele);
    };

    if (cb) {
      this.callbacks.set(ele, callback);
    }
  };

  private readonly getCallback = (ele: Element) => {
    return this.callbacks.get(ele);
  };
}

export const intersectObserver = new IOInternal();
