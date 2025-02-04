import * as React from "react";

export enum BodyClasses {
  /** No effect */
  None = 0,

  /** Removes the space above content that accounts for the header */
  NoSpacer = 1 << 0,

  /** Hides Service Alerts (mostly used for product pages) */
  HideServiceAlert = 1 << 1,

  /** Hides Main Top Nav */
  HideMainNav = 1 << 2,

  /** Gives Manin Nav a solid Background before scroll **/
  SolidMainNav = 1 << 3,

  /** Hides Main Footer */
  HideMainFooter = 1 << 4,

  // Follow this format for future entries: https://basarat.gitbook.io/typescript/type-system/enums#number-enums-as-flags
}

/**
 * Get special body classes given a flag value
 * @param classes BodyClasses flag (bitwise)
 */
export const SpecialBodyClasses = (classes: BodyClasses) => {
  const classList = [];

  if (classes & BodyClasses.NoSpacer) {
    classList.push("no-spacer");
  }

  if (classes & BodyClasses.HideServiceAlert) {
    classList.push("hide-service-alert");
  }

  if (classes & BodyClasses.HideMainNav) {
    classList.push("hide-main-nav");
  }

  if (classes & BodyClasses.SolidMainNav) {
    classList.push("solid-main-nav");
  }

  if (classes & BodyClasses.HideMainFooter) {
    classList.push("hide-main-footer");
  }

  return classList.join(" ");
};
