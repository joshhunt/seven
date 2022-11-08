// Created by a-tmorris, 2020
// Copyright Bungie, Inc.

import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";
import { ButtonTypes } from "@UIKit/Controls/Button/Button";
import { BasicSize } from "@UIKit/UIKitUtils";
import classNames from "classnames";
import React, { DOMAttributes } from "react";
import styles from "./StoreSkuButton.module.scss";

export interface IStoreSkuButtonProps extends DOMAttributes<HTMLElement> {
  /** Children */
  children: React.ReactNode;
  /** Render in icon slot */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
  /** If not null, Button will be treated as an internal link (note: cannot specify an external link here) */
  url?: string | IMultiSiteLink;
  /** If true, the 'to' prop will be treated as a legacy link */
  legacy?: boolean;
  /** Only relevant if url is populated. If false, opens in a new tab. */
  sameTab?: boolean;
  /** Used for GTM*/
  analyticsId?: string;
  /** Button type */
  disabled?: boolean;
  /* If true, text will be capitalized */
  caps?: boolean;
  /* If true, text will be capitalized */
  buttonStyles?: string;
}

export const StoreSkuButton = ({
  disabled,
  children,
  className,
  caps,
  url,
  analyticsId,
  buttonStyles,
  ...rest
}: IStoreSkuButtonProps) => {
  const classes = classNames(buttonStyles, styles.platformTriggerButton, {
    [styles.disabled]: disabled,
    [styles.caps]: caps,
  });

  const props = {
    ...rest,
    url,
    className: classes,
  };

  return url ? (
    <Anchor
      {...props}
      onKeyDown={props.onKeyDown}
      data-analytics-id={analyticsId}
    >
      {children}
    </Anchor>
  ) : (
    <button
      className={classes}
      disabled={disabled}
      data-analytics-id={analyticsId}
    >
      {children}
    </button>
  );
};
