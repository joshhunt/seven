import React from "react";
import styles from "./PCMigrationGlobalAlertBar.module.scss";
import { Localizer } from "@Global/Localizer";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import classNames from "classnames";
import { RouteHelper } from "@Routes/RouteHelper";
import { RouteComponentProps } from "react-router-dom";
import { Contract, Platform, User } from "@Platform";
import {
  DestroyCallback,
  DataStoreObserver,
  DataStore,
} from "@Global/DataStore";
import {
  PCMigrationUserDataStore,
  IPCMigrationUserData,
} from "@UI/User/PCMigrationUserDataStore";
import { PCMigrationUtilities } from "@Areas/PCMigration/Shared/PCMigrationUtilities";
import { GlobalBar } from "./GlobalBar";
import { BungieCredentialType } from "@Enum";
import { ConfigUtils } from "@Utilities/ConfigUtils";
import { UserUtils } from "@Utilities/UserUtils";
import { LocalStorageUtils } from "@Utilities/StorageUtils";

interface IPCMigrationGlobalAlertProps
  extends GlobalStateComponentProps<"loggedInUser" | "credentialTypes">,
    RouteComponentProps {}

interface IPCMigrationGlobalAlertState {
  user: Contract.UserDetail;
  webmasterEnabled: boolean;
  isPostRelease: boolean;
  localStorageAllowShow: boolean;
  userData: IPCMigrationUserData;
  transferComplete: boolean;
  transferInProgress: boolean;
  steamDestinationDisplayName: string;
}

class PCMigrationGlobalAlert extends React.Component<
  IPCMigrationGlobalAlertProps,
  IPCMigrationGlobalAlertState
> {
  private readonly destroys: DestroyCallback[] = [];
  private readonly localStorageKey: string = "show-pc-migration-sunset-alert";

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.globalState.loggedInUser,
      webmasterEnabled:
        ConfigUtils.SystemStatus("PCMigrationSunsetPhase1") &&
        ConfigUtils.SystemStatus("Blizzard"),
      isPostRelease: true,
      localStorageAllowShow: true,
      userData: PCMigrationUserDataStore.state,
      transferComplete: false,
      transferInProgress: false,
      steamDestinationDisplayName: "",
    };

    this.removeBar = this.removeBar.bind(this);
  }

  public componentDidUpdate() {
    const barShown = this.showBarToUser();
    document.documentElement.classList.toggle("global-bar-shown", barShown);
  }

  public componentWillMount() {
    this.getLocalStorageAlertVisibility();
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.destroys);
  }

  public render() {
    return (
      <React.Fragment>
        {this.showBarToUser() && (
          <GlobalBar
            barClassNames={classNames(styles.pcmigration, styles.sunsetting)}
            url={RouteHelper.PCMigration()}
            message={Localizer.Pcmigration.OnDecember12020Battle}
            showCheckIcon={true}
            showWarningIcon={true}
            removeable={true}
            localStorageKey={this.localStorageKey}
          />
        )}
      </React.Fragment>
    );
  }

  private showBarToUser(): boolean {
    if (!this.state.webmasterEnabled) {
      return false;
    }

    return !this.state.userData.forceHidden;
  }

  private removeBar(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.stopPropagation();

    e.preventDefault();

    this.updateLocalStorageAlertVisibility(false);
  }

  private getLocalStorageAlertVisibility() {
    if (
      typeof LocalStorageUtils.getItem("show-pc-migration-sunset-alert") ===
        "undefined" ||
      LocalStorageUtils.getItem("show-pc-migration-sunset-alert") === null
    ) {
      LocalStorageUtils.setItem("show-pc-migration-sunset-alert", "true");
    }

    this.setState({
      localStorageAllowShow:
        LocalStorageUtils.getItem("show-pc-migration-sunset-alert") === "false"
          ? false
          : true,
    });
  }

  private updateLocalStorageAlertVisibility(newValue: boolean) {
    this.setState({
      localStorageAllowShow: newValue,
    });

    LocalStorageUtils.setItem(
      "show-pc-migration-sunset-alert",
      newValue.toString()
    );
  }
}

export default withGlobalState(PCMigrationGlobalAlert, [
  "loggedInUser",
  "credentialTypes",
]);
