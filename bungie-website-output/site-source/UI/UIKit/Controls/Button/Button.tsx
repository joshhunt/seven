import classNames from "classnames";
import React, { DetailedHTMLProps, DOMAttributes } from "react";
import styles from "./Button.module.scss";
import { Anchor } from "@UI/Navigation/Anchor";
import { BasicSize } from "../../UIKitUtils";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Spinner } from "../Spinner";

export type ButtonTypes =
  | "none"
  | "white"
  | "gold"
  | "red"
  | "blue"
  | "clear"
  | "text"
  | "disabled"
  | "darkblue"
  | "green"
  | "teal"
  | "slateblue"
  | "queenGreen"
  | "hotPink";

export type ButtonProps = IButtonProps & Partial<DefaultButtonProps>;

export interface IButtonProps extends DOMAttributes<HTMLElement> {
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
  /** Used for GTM*/
  analyticsId?: string;
  /** If true, button type is type="submit" */
  submit?: boolean;
}

export interface DefaultButtonProps {
  /** Button type */
  buttonType: ButtonTypes | ButtonTypes[];
  /** If true, shows a loading spinner */
  loading: boolean;
  /** If true, won't be clickable */
  disabled: boolean;
  /** Button size */
  size: BasicSize;
  /* If true, text will be capitalized */
  caps: boolean;
}

export class Button extends React.Component<ButtonProps> {
  public static defaultProps = {
    buttonType: "white",
    loading: false,
    disabled: false,
    size: BasicSize.Medium,
  };

  private readonly divButtonRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();

  private readonly onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (this.props.disabled) {
      e.preventDefault();

      return false;
    }
  };

  public render() {
    const {
      icon,
      loading,
      disabled,
      size,
      buttonType,
      children,
      className,
      caps,
      url,
      analyticsId,
      submit,
      ...rest
    } = this.props;

    let iconRendered = null;
    if (icon || loading) {
      iconRendered = loading ? (
        <Spinner inline={true} style={{ margin: "-0.5rem 0 0 -0.5rem" }} />
      ) : (
        icon
      );
    }

    const hasIcon = iconRendered ? "has-icon" : "";

    const sizeClass = styles[BasicSize[size].toLocaleLowerCase()];

    const stylesFromButtonType =
      buttonType instanceof Array
        ? buttonType.map((bt) => styles[bt])
        : styles[buttonType];

    const buttonStyle = disabled ? styles.disabled : stylesFromButtonType;

    const classes = classNames(
      className,
      styles.button,
      {
        [styles.disabled]: loading || disabled,
        [styles.caps]: caps,
      },
      sizeClass,
      buttonStyle,
      "button"
    );

    const inner = (
      <React.Fragment>
        {hasIcon && (
          <div
            className={classNames(styles.iconWrapper, {
              [styles.hasIcon]: iconRendered,
            })}
          >
            {iconRendered}
          </div>
        )}
        {children}
      </React.Fragment>
    );

    const props = {
      ...rest,
      url,
      submit,
      className: classes,
    };

    const inputButtonType = submit ? "submit" : "button";

    return url ? (
      <Anchor
        {...props}
        onKeyDown={this.onKeyDown}
        data-analytics-id={analyticsId}
        {...rest}
      >
        {inner}
      </Anchor>
    ) : (
      <button
        className={classes}
        disabled={disabled}
        data-analytics-id={analyticsId}
        type={inputButtonType}
        {...rest}
      >
        {inner}
      </button>
    );
  }
}
