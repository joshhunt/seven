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
  /** Button type */
  buttonType?: ButtonTypes;
  /** If true, shows a loading spinner */
  loading?: boolean;
  /** If true, won't be clickable */
  disabled?: boolean;
  /** Button size */
  size?: BasicSize;
  /* If true, text will be capitalized */
  caps?: boolean;
  /* By default, if this is omitted, clicking on this button should proc the onSubmit function of the form it is in */
  onClick?: (event) => void;
}

interface ISubmitButtonState {}

/**
 * SubmitButton - Use within a form so that clicking enter when the form is focused will submit the form
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
    } = this.props;

    const adjustedOnClick = (e) => {
      e.preventDefault();
      onClick(e);
    };

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
        onClick={adjustedOnClick}
      >
        <button type="submit" className={styles.textOnly}>
          {children}
        </button>
      </Button>
    );
  }
}
