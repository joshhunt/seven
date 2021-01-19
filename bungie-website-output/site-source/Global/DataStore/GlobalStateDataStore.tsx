import { IResponsiveState, Responsive } from "@Boot/Responsive";
import { BungieMembershipType, GroupsForMemberFilter, GroupType } from "@Enum";
import {
  BroadcasterObserver,
  DestroyCallback,
} from "@Global/Broadcaster/Broadcaster";
import { DataStore } from "@Global/DataStore";
import { GlobalFatalDataStore } from "@Global/DataStore/GlobalFatalDataStore";
import { EventMux } from "@Global/EventMux/EventMuxBase";
import { NotificationCountManager } from "@Global/EventMux/NotificationCount/NotificationCountManager";
import { Logger } from "@Global/Logger";
import { Contract, CrossSave, GroupsV2, Models, Platform } from "@Platform";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { LocalStorageUtils } from "@Utilities/StorageUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";

interface IGlobalState {
  coreSettings: Models.CoreSettingsConfiguration;
  loggedInUser: Contract.UserDetail;
  loggedInUserClans: GroupsV2.GetGroupsForMemberResponse;
  responsive: IResponsiveState;
  credentialTypes: Contract.GetCredentialTypesForAccountResponse[];
  crossSavePairingStatus: CrossSave.CrossSavePairingStatus;
  loaded: boolean;
}

class GlobalStateDataStoreMonitor extends BroadcasterObserver<
  IGlobalState,
  GlobalStateSubscriptionPartialKeys[]
> {
  constructor(
    callback: (newData: IGlobalState) => void,
    params: GlobalStateSubscriptionPartialKeys[]
  ) {
    super(callback, params);
  }
}

class GlobalStateDataStoreInternal extends DataStore<
  IGlobalState,
  GlobalStateSubscriptionPartialKeys[],
  GlobalStateDataStoreMonitor
> {
  public static Instance = new GlobalStateDataStoreInternal({
    coreSettings: undefined,
    loggedInUser: undefined,
    loggedInUserClans: undefined,
    responsive: Responsive.initialize(),
    credentialTypes: undefined,
    crossSavePairingStatus: undefined,
    loaded: false,
  });

  public Provider: React.Provider<IGlobalState>;
  public Consumer: React.Consumer<IGlobalState>;
  private static readonly CoreSettingsLocalStorageKey =
    "LastFetchedCoreSettings";

  private isInitialized = false;

  constructor(initial: IGlobalState) {
    super(initial, GlobalStateDataStoreMonitor, true);
  }

  /**
   * Initializes GlobalStateDataStore
   */
  public async initialize() {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    this.createContext();

    Responsive.observe(
      (state) => {
        this.update({
          responsive: state,
        });
      },
      undefined,
      true
    );

    const didLoadFromStorage = this.updateSettingsFromStorage();

    if (!didLoadFromStorage) {
      await this.updateSettings();
    }

    await this.updateUserData(false);

    this.update({
      loaded: true,
    });

    this.updateSettings();
  }

  protected getObserversToUpdate(data: Partial<IGlobalState>) {
    const keysUpdated = Object.keys(
      data
    ) as GlobalStateSubscriptionPartialKeys[];

    return this.allObservers.filter((subscription) => {
      return keysUpdated.some((updated) => {
        return (
          subscription.params.includes(updated) ||
          (updated as string) === "loaded" ||
          (updated as string) === "coreSettings"
        );
      });
    });
  }

  /**
   * Refreshes the user data portion of global data
   */
  public async refreshUserData(bustCache = false) {
    EventMux.destroy();
    NotificationCountManager.destroy();

    await this.updateUserData(bustCache);
  }

  /**
   * Refreshes the user credentials portion of global data
   */
  public async updateUserCredentialTypes() {
    let credentialTypes: Contract.GetCredentialTypesForAccountResponse[];

    try {
      credentialTypes = await Platform.UserService.GetCredentialTypesForAccount();
    } catch (e) {
      Logger.error(e);
    }

    this.update({
      credentialTypes,
    });

    return;
  }

  private updateSettingsFromStorage() {
    const stored = this.fetchStoredCoreSettings();
    if (stored) {
      this.update({
        coreSettings: stored,
      });

      return true;
    }

    return false;
  }

  public async updateSettings() {
    try {
      // Grab the common settings and the user overrides, then replace values with the overridden ones
      const data = await Promise.all([
        Platform.CoreService.GetCommonSettings(),
        Platform.CoreService.GetUserSystemOverrides(),
      ]);

      const coreSettings = data[0];
      const userSystemOverrides = data[1];
      const overrideSystemNames = Object.keys(userSystemOverrides);
      overrideSystemNames.forEach((systemName) => {
        coreSettings.systems[systemName] = userSystemOverrides[systemName];
      });
      this.update({
        coreSettings,
      });

      // Store settings in localstorage to make the site start faster the next time
      this.storeCoreSettings(coreSettings);
    } catch (e) {
      Modal.error(e);

      Logger.logToServer(e);
    }
  }

  private async updateUserData(bustCache) {
    if (UserUtils.hasAuthenticationCookie) {
      await this.updateCurrentUser(bustCache);

      EventMux.initialize();
      NotificationCountManager.initialize(this.state.coreSettings);

      await Promise.all([
        this.updateLoggedInUserClans(),
        this.updateUserCredentialTypes(),
        this.updateCrossSavePairingStatus(),
      ]);
    } else {
      this.update({
        loggedInUser: undefined,
        loggedInUserClans: undefined,
      });
    }
  }

  private updateCurrentUser(bustCache) {
    const queryAppend = bustCache ? `&bustCache=${Date.now()}` : undefined;

    return Platform.UserService.GetCurrentUser(queryAppend)
      .then((data) => {
        this.update({
          loggedInUser: data,
        });
      })
      .catch((e: Error) => {
        GlobalFatalDataStore.addErrorToStore(e.message);
        this.update({
          loggedInUser: undefined,
        });
      });
  }

  private async updateLoggedInUserClans(): Promise<
    GroupsV2.GetGroupsForMemberResponse
  > {
    let loggedInUserClans: GroupsV2.GetGroupsForMemberResponse;
    try {
      const results = await Platform.GroupV2Service.GetGroupsForMember(
        BungieMembershipType.BungieNext,
        UserUtils.loggedInUserMembershipIdFromCookie,
        GroupsForMemberFilter.All,
        GroupType.Clan
      );

      if (results) {
        loggedInUserClans = results;
      }
    } catch (e) {
      Logger.error(e);
    }

    this.update({
      loggedInUserClans,
    });

    return;
  }

  private async updateCrossSavePairingStatus(): Promise<void> {
    let crossSavePairingStatus: CrossSave.CrossSavePairingStatus;
    try {
      crossSavePairingStatus = await Platform.CrosssaveService.GetCrossSavePairingStatus();
    } catch (e) {
      Logger.error(e);
    }

    this.update({
      crossSavePairingStatus,
    });

    return;
  }

  private createContext() {
    const { Provider, Consumer } = React.createContext<IGlobalState>(null);

    this.Provider = Provider;
    this.Consumer = Consumer;
  }

  private storeCoreSettings(settings: Models.CoreSettingsConfiguration) {
    const stringified = JSON.stringify(settings);
    LocalStorageUtils.setItem(
      GlobalStateDataStoreInternal.CoreSettingsLocalStorageKey,
      stringified
    );
  }

  private fetchStoredCoreSettings() {
    const stringified = LocalStorageUtils.getItem(
      GlobalStateDataStoreInternal.CoreSettingsLocalStorageKey
    );
    if (stringified) {
      return JSON.parse(stringified) as Models.CoreSettingsConfiguration;
    }

    return null;
  }
}

export const GlobalStateContext = React.createContext<IGlobalState>(null);

/** Valid keys for global state (minus CoreSettings, which will always be included) */
type GlobalStateSubscriptionPartialKeys = Exclude<
  keyof IGlobalState,
  "coreSettings" | "loaded"
>;

/** From IGlobalState, take only the properties to which we subscribed */
type GlobalStateSubscribedProps<
  TSubscribed extends GlobalStateSubscriptionPartialKeys
> = Pick<IGlobalState, Extract<keyof IGlobalState, TSubscribed>>;

/** We always want coreSettings, so we are gonna require it */
type RequireCoreSettings = {
  loaded: boolean;
  coreSettings: Models.CoreSettingsConfiguration;
};

/** The final value of GlobalState with our transforms. Always includes CoreSettings without having to specify it */
export type GlobalState<
  TSubscribed extends GlobalStateSubscriptionPartialKeys
> = GlobalStateSubscribedProps<TSubscribed> & RequireCoreSettings;

/** Our component will have globalState, but it will only be the part that they subscribed to */
interface GlobalStateComponentState<
  TSubscribed extends GlobalStateSubscriptionPartialKeys
> {
  globalState?: GlobalState<TSubscribed>;
  delayRenderUntilLoaded: boolean;
}

export interface GlobalStateComponentProps<
  TSubscribed extends GlobalStateSubscriptionPartialKeys = never
> {
  globalState?: GlobalState<TSubscribed>;
}

/**
 * Allows you to wrap a component in a Global State subscriber, such that the components props always contain an updated version of global state.
 * You can also specify a public method onGlobalStateUpdated, which will be called upon update. This can be easier than using componentDidUpdate().
 * @param BoundComponent The component to provide with global state.
 * @param subscribeTo The changes in GlobalState you care about
 * @param delayRenderUntilLoaded If true, will not render while global state is still loading some things
 */
export const withGlobalState = <
  S extends GlobalStateSubscriptionPartialKeys,
  P extends GlobalStateComponentProps<S>
>(
  BoundComponent: React.ComponentClass<P>,
  subscribeTo: S[] = [],
  delayRenderUntilLoaded = true
) =>
  class extends React.Component<P, GlobalStateComponentState<S>> {
    private globalStateUnsubscriber: DestroyCallback;
    private ref: any;
    private updateTimer = 0;

    constructor(props: P) {
      super(props);

      this.state = {
        delayRenderUntilLoaded,
        globalState: GlobalStateDataStore.state,
      };
    }

    public componentDidMount() {
      this.globalStateUnsubscriber = GlobalStateDataStore.observe((data) => {
        this.setState(
          {
            globalState: data,
          },
          () => this.onUpdated()
        );
      }, subscribeTo);
    }

    public componentWillUnmount() {
      if (this.globalStateUnsubscriber) {
        this.globalStateUnsubscriber();
      }
    }

    private onUpdated() {
      // Stagger updates so we don't trigger tons of them
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        if (this.ref && this.ref.onGlobalStateUpdated) {
          this.ref.onGlobalStateUpdated();
        }
      }, 500);
    }

    public render() {
      const loaded = this.state.globalState && this.state.globalState.loaded;

      if (this.state.delayRenderUntilLoaded && !loaded) {
        return <SpinnerContainer loading={true} />;
      }

      return (
        <BoundComponent
          ref={(ref) => (this.ref = ref)}
          {...this.props}
          globalState={this.state.globalState}
        />
      );
    }
  };

export const GlobalStateDataStore = GlobalStateDataStoreInternal.Instance;
