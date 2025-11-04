import { StringCompareOptions, StringUtils } from "./StringUtils";
import * as bodyScrollLock from "body-scroll-lock";
import { easeInOut } from "@popmotion/easing";

export interface IScrollViewportData {
  isVisible: boolean;
  percent: number;
}

export class BrowserUtils {
  /** Returns true if it's a mobile browser */
  public static get mobile(): boolean {
    // @ts-ignore
    if (
      typeof window.matchMedia !== "undefined" ||
      typeof window["msMatchMedia"] !== "undefined"
    ) {
      const mq = window.matchMedia("(pointer:coarse)");

      return mq.matches;
    }

    return false;
  }

  /**
   * Opens a browser window
   * @param href The URL to open
   * @param windowName The window name
   * @param onClosed Triggered on window close
   * @param width Width of the window (optional)
   * @param height Height of the window (optional)
   * @returns The window reference
   */
  public static openWindow(
    href: string,
    windowName: string,
    onClosed: () => void = () => null,
    width = 790,
    height = 760
  ) {
    const features = `height=${height}, width=${width}, left=550, top=150, menubar=no, location=no, resizable=no, scrollbars=yes, status=no, toolbar=no`;
    const child = window.open(href, windowName, features);
    child.focus();

    const interval = setInterval(() => {
      try {
        if (!child || child.closed) {
          setTimeout(() => onClosed(), 500);

          clearInterval(interval);
        }
      } catch (e) {
        // If this doesn't work, we will just clear the interval because otherwise it'll spam the logs
        clearInterval(interval);
      }
    }, 500);

    return child;
  }

  /**
   * Unlock scrolling
   * @param allowScrollElement
   */
  public static unlockScroll(allowScrollElement?: HTMLElement) {
    if (!allowScrollElement) {
      bodyScrollLock.clearAllBodyScrollLocks();
    } else {
      bodyScrollLock.enableBodyScroll(allowScrollElement);
    }
  }

  /**
   * Prevent scrolling except for the target element
   * @param allowScrollElement
   */
  public static lockScroll(allowScrollElement: HTMLElement) {
    bodyScrollLock.disableBodyScroll(allowScrollElement, {
      reserveScrollBarGap: true,
    });
  }

  /** Gets a platform and converts to a class name */
  public static getPlatformClass() {
    let platform = "";

    if (
      StringUtils.contains(
        navigator.platform,
        "win",
        StringCompareOptions.IgnoreCase
      )
    ) {
      platform = "windows";
    }

    if (
      StringUtils.contains(
        navigator.platform,
        "mac",
        StringCompareOptions.IgnoreCase
      )
    ) {
      platform = "mac";
    }

    return `plat-${platform}`;
  }

  public static animatedScrollTo(top: number, durationMs = 250) {
    const start = Date.now();
    const startY = window.scrollY;

    const animate = () => {
      const current = Date.now();
      const diff = current - start;

      const pct = easeInOut(diff / durationMs);
      const thisFrameY = startY + (top - startY) * pct;
      BrowserUtils.scrollTo(thisFrameY);

      if (diff < durationMs) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /** Returns true if the browser supports webp */
  public static async supportsWebp() {
    if (!window["createImageBitmap"]) {
      return false;
    }

    const webpData =
      "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    const blob = await fetch(webpData).then((r) => r.blob());

    return createImageBitmap(blob).then(
      () => true,
      () => false
    );
  }

  public static viewportElementScrollData(
    rect: ClientRect
  ): IScrollViewportData {
    const windowHeight = window.innerHeight;

    const percent = Math.max(
      0,
      Math.min(1, (rect.top + rect.height) / (windowHeight + rect.height))
    );
    const isVisible = percent > 0 && percent < 1;

    return {
      percent,
      isVisible,
    };
  }

  /**
   * Scrolls to the desired position
   * @param y The pixel position to scroll to
   * @param target
   */
  public static scrollTo(y: number, target: HTMLElement | Window = window) {
    const supportsScrollTop = "scrollTop" in target;

    if (supportsScrollTop) {
      target.scrollTop = y;
    } else {
      target.scrollTo(0, y);
    }
  }

  private static calculateScrollbarWidth(): number {
    let width = 0;

    // Create the measurement node
    const scrollDiv = document.createElement("div");
    // styled in utils.scss
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    width = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV
    document.body.removeChild(scrollDiv);

    return width;
  }
}
