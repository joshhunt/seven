// Created by a-larobinson, 2019
// Copyright Bungie, Inc.

import * as React from "react";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { BasicSize } from "../UIKitUtils";
import styles from "./SubmitButton.module.scss";
import { Button, ButtonProps, ButtonTypes } from "../Controls/Button/Button";

interface ISubmitButtonProps extends ButtonProps {
  /** Children */
  children: React.ReactNode;
  /** Render in icon slot */
  icon?: React.ReactNode;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Additional className */
  className?: string;
  /** If not null, Button will be treated as an internal link (note: cannot specify an external link here) */
  url?: string | IMultiSiteLink;
  /** If true, the 'to' prop will be treated as a legacy link */
  legacy?: boolean;
  /** Only relevant if url is populated. If false, opens in a new tab. */
  sameTab?: boolean;
  /** Button type */
  buttonType: ButtonTypes;
  /** If true, shows a loading spinner */
  loading?: boolean;
  /** If true, won't be clickable */
  disabled?: boolean;
  /** Button size */
  size?: BasicSize;
  /* If true, text will be capitalized */
  caps?: boolean;
  /* Pass onClick function to Button component */
  onClick: any;
}

interface ISubmitButtonState {}

/**
 * SubmitButton - Replace this description
 *  *
 * @param {ISubmitButtonProps} props
 * @returns
 */
export class SubmitButton extends React.Component<
  ISubmitButtonProps,
  ISubmitButtonState
> {
  public render() {
    const {
      icon,
      style,
      className,
      url,
      legacy,
      buttonType,
      loading,
      size,
      caps,
      children,
      disabled,
      onClick,
      ...rest
    } = this.props;

    return (
      <Button
        icon={icon}
        style={style}
        className={className}
        url={url}
        legacy={legacy}
        buttonType={buttonType}
        loading={loading}
        size={size}
        caps={caps}
        disabled={disabled}
        onClick={onClick}
      >
        <button type="submit" className={styles.textOnly}>
          {children}
        </button>
      </Button>
    );
  }
}
