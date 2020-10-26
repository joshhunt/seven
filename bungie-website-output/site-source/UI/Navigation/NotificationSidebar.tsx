import * as React from "react";
import classNames from "classnames";
import styles from "./Sidebar.module.scss";
import { RouteHelper } from "@Global/Routes/RouteHelper";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";

interface INotificationSidebarProps
  extends GlobalStateComponentProps<"loggedInUser"> {
  /** If true, sidebar will be open */
  open: boolean;
  /** Triggered when the user clicks outside the sidebar */
  onClickOutside?: () => void;
}

interface INotificationSidebarState {
  loaded: boolean;
}

/**
 * Sidebar containing iframe of notifications stuff
 *  *
 * @param {INotificationSidebarProps} props
 * @returns
 */
class NotificationSidebarInternal extends React.Component<
  INotificationSidebarProps,
  INotificationSidebarState
> {
  private wrapperRef: HTMLDivElement = null;

  constructor(props: INotificationSidebarProps) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  public componentWillUnmount(): void {
    document.removeEventListener("click", this.onBodyClick);
  }

  public shouldComponentUpdate(
    nextProps: Readonly<INotificationSidebarProps>
  ): boolean {
    const className = "notifications-sidebar-open";
    if (nextProps.open) {
      document.addEventListener("click", this.onBodyClick);

      if (!document.documentElement.classList.contains(className)) {
        document.documentElement.classList.add(className);
      }
    } else {
      document.removeEventListener("click", this.onBodyClick);

      if (document.documentElement.classList.contains(className)) {
        document.documentElement.classList.remove(className);
      }
    }

    return true;
  }

  public render() {
    const classes = classNames(styles.accountSidebar, {
      [styles.open]: this.props.open,
    });

    return (
      <div ref={(ref) => (this.wrapperRef = ref)} className={classes}>
        {this.props.open && (
          <SpinnerContainer
            loading={!this.state.loaded}
            delayRenderUntilLoaded={false}
            className={styles.notificationsFrame}
          >
            <iframe
              className={styles.notificationsFrame}
              src={RouteHelper.Messages(true)}
              onLoad={() => this.setState({ loaded: true })}
            />
          </SpinnerContainer>
        )}
      </div>
    );
  }

  private readonly onBodyClick = (e: MouseEvent) => {
    if (this.wrapperRef.contains(e.target as Node)) {
      return;
    }

    this.props.onClickOutside && this.props.open && this.props.onClickOutside();
  };
}

export const NotificationSidebar = withGlobalState(
  NotificationSidebarInternal,
  ["loggedInUser"]
);
