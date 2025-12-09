import React from "react";
import classNames from "classnames";
import styles from "./Toast.module.scss";
import { Icon } from "../Icon";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { IMultiSiteLink } from "@Routes/RouteHelper";
import { Anchor } from "@UI/Navigation/Anchor";

export type ToastPosition = "l" | "tl" | "t" | "tr" | "r" | "br" | "b" | "bl";
export type ToastType = "success" | "warning" | "error" | "default" | "none";

interface IToastClassNames {
  /** The toast itself */
  toast?: string;
  /** The icon container */
  icon?: string;
  /** The content portion of the toast */
  content?: string;
  /** The close button container */
  closeButton?: string;
}

interface DefaultProps {
  /** Where you want it to show up (default is t = top) */
  position: ToastPosition;
  /** Preset type */
  type: ToastType;
  /** Called when the toast is closed */
  onClose: () => void;
  /** If true, toast cannot be closed by a user (default false) */
  preventUserClose: boolean;
  /** If true, notification will close when changing pages (default true)*/
  closeOnHistoryChange: boolean;
  /** Called when toast is clicked */
  onClick: () => void;
  /** Optional classnames for the toast components */
  classes: IToastClassNames;
  children?: React.ReactNode;
}

interface IToastProps {
  /** If true, the toast is visible*/
  visible?: boolean;
  /** Optional icon slot */
  icon?: React.ReactNode;
  /** Optional URL, which will make the notification function as a link */
  url?: IMultiSiteLink;
  /** If provided, toast will disappear after the timeout expires (in milliseconds) */
  timeout?: number;
  children?: React.ReactNode;
}

interface IToastState {
  visible: boolean;
}

export type ToastProps = IToastProps & Partial<DefaultProps>;

/**
 * Displays a toast over the rest of the page content
 *  *
 * @param {IToastProps} props
 * @returns
 */

export class Toast {
  /**
   * Creates a new toast and opens it, returning a reference to the Toast
   * @param children The content to show in the toast
   * @param props Optional props passed to the toast
   */
  public static show(children: React.ReactNode, props?: ToastProps) {
    // no op. Function gets defined by ToastProvider
  }
}

export class ToastContent extends React.Component<ToastProps, IToastState> {
  private readonly closeButtonRef = React.createRef<HTMLDivElement>();
  private timeoutId?: number;

  public static defaultProps: DefaultProps = {
    onClose: () => {
      void 0;
    },
    onClick: () => {
      void 0;
    },
    preventUserClose: false,
    position: "t",
    type: "default",
    closeOnHistoryChange: true,
    classes: {},
  };

  constructor(props: ToastProps) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  // Allows a toast to show with transitions even if it is set to visible at the start
  private readonly delayedVisible = () =>
    setTimeout(
      () =>
        this.setState({
          visible: true,
        }),
      500
    );

  public componentDidMount() {
    if (this.props.visible) {
      this.delayedVisible();
    }

    if (this.props.timeout) {
      this.timeoutId = setTimeout(() => {
        this.close();
      }, this.props.timeout);
    }
  }

  public componentDidUpdate(prevProps: Readonly<ToastProps>) {
    if (prevProps.timeout !== this.props.timeout) {
      clearTimeout(this.timeoutId);
      if (this.props.timeout) {
        this.timeoutId = setTimeout(() => {
          this.close();
        }, this.props.timeout);
      }
    }
  }

  public shouldComponentUpdate(nextProps: ToastProps, nextState: IToastState) {
    if (nextProps.visible && !this.props.visible && !this.state.visible) {
      this.delayedVisible();
    }

    if (this.state.visible && !nextProps.visible) {
      this.close();
    }

    return true;
  }

  public close = () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.props.onClose();
      }
    );
  };

  // On click, ensure we're not clicking on the close button. If we are, ignore the click function and preventDefault (in case it's a link)
  private readonly onClick = (e: React.MouseEvent) => {
    const close = this.closeButtonRef.current;
    if (close === e.target || close.contains(e.target as Node)) {
      e.preventDefault();

      return false;
    } else {
      this.props.onClick();
    }
  };

  public render() {
    const {
      classes,
      children,
      position,
      type,
      closeOnHistoryChange,
      url,
      icon,
    } = this.props;

    const { visible } = this.state;

    const toastClasses = classNames(
      classes.toast,
      styles.toast,
      styles[`type_${type}`],
      {
        [styles.visible]: visible,
        [styles.textOnly]: typeof children === "string",
      }
    );

    const iconClasses = classNames(styles.icon, classes.icon);
    const contentClasses = classNames(styles.content, classes.content);
    const closeButtonClasses = classNames(
      styles.buttonClose,
      classes.closeButton
    );

    const closeButton = !this.props.preventUserClose && (
      <div
        className={closeButtonClasses}
        onClick={this.close}
        ref={this.closeButtonRef}
      >
        <Icon iconType={"material"} iconName={"close"} />
      </div>
    );

    const content = (
      <div
        className={toastClasses}
        data-position={position}
        onClick={this.onClick}
      >
        {icon && <div className={iconClasses}>{icon}</div>}
        <div className={contentClasses}>{children}</div>
        {closeButton}
        {closeOnHistoryChange && (
          <HistoryListener onHistoryChange={this.close} />
        )}
      </div>
    );

    if (url) {
      return <Anchor url={url}>{content}</Anchor>;
    } else {
      return content;
    }
  }
}

// This is here so we can tell when the page changes, and close the toast at that time
interface IHistoryListener extends RouteComponentProps {
  onHistoryChange: () => void;
}

const _HistoryListener: React.FC<IHistoryListener> = ({
  history,
  onHistoryChange,
}) => {
  React.useEffect(
    () =>
      history.listen(() => {
        onHistoryChange();
      }),
    []
  );

  return null;
};

const HistoryListener = withRouter(_HistoryListener);
