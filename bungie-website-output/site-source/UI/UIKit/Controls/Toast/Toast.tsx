import { StringUtils } from "@Utilities/StringUtils";
import * as React from "react";
import classNames from "classnames";
import styles from "./Toast.module.scss";
import { Icon } from "../Icon";
import { GlobalElementDataStore } from "@Global/DataStore/GlobalElementDataStore";
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
}

interface IToastState {
  visible: boolean;
}

export type ToastProps = IToastProps & Partial<DefaultProps>;

/**
 * Create a toast and show it via GlobalElementDataStore
 * @param children The stuff that goes in the toast
 * @param props The properties for the toast
 * @param existingRef If we want to preserve a reference instead of creating a new one, pass it here and it will be used
 */
export const showToastInternal = (
  children: React.ReactNode,
  props?: ToastProps,
  existingRef?: React.RefObject<ToastContent>
): React.RefObject<ToastContent> => {
  const toastRef = existingRef || React.createRef<ToastContent>();

  const globalElementGuid = StringUtils.generateGuid();

  const onClose = () => {
    setTimeout(() => {
      GlobalElementDataStore.actions.removeElementByGuid(globalElementGuid);

      setTimeout(() => {
        props && props.onClose && props.onClose();
      }, 100);
    }, 250);
  };

  const toast = (
    <ToastContent ref={toastRef} visible={true} onClose={onClose} {...props}>
      {children}
    </ToastContent>
  );

  if (props && props.timeout) {
    setTimeout(() => toastRef.current.close(), props.timeout);
  }

  GlobalElementDataStore.actions.addElement(globalElementGuid, toast);

  return toastRef;
};

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
    return showToastInternal(children, props);
  }
}

export class ToastContent extends React.Component<ToastProps, IToastState> {
  private readonly closeButtonRef = React.createRef<HTMLDivElement>();

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

const _HistoryListener: React.SFC<IHistoryListener> = ({
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
