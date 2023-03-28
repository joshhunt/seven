import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import {
  GlobalState,
  GlobalStateDataStore,
} from "@Global/DataStore/GlobalStateDataStore";
import { Contract, Models } from "@Platform";
import { SystemDisabledHandler } from "@UI/Errors/SystemDisabledHandler";
import { SpinnerContainer } from "@UI/UIKit/Controls/Spinner";
import { Auth } from "@UI/User/Auth";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

export type AuthTemporaryGlobalState = GlobalState<
  "loggedInUser" | "credentialTypes"
>;

interface IRequiresAuthProps extends RouteComponentProps {
  customLabel?: string;
  allowModalClose?: boolean;
  autoOpenModal?: boolean;
}

interface IRequiresAuthState {
  loggedInUser: Contract.UserDetail;
  coreSettings: Models.CoreSettingsConfiguration;
}

interface DefaultProps {
  /** If you want to do something with global state on sign in, we'll pass it here. This global state will not keep updating! */
  onSignIn?: (temporaryGlobalState: AuthTemporaryGlobalState) => void;
  children?: React.ReactNode;
}

type Props = IRequiresAuthProps & Partial<DefaultProps>;

/**
 * This component should be used when
 *  *
 * @param {IRequiresAuthProps} props
 * @returns
 */
class RequiresAuthInternal extends React.Component<Props, IRequiresAuthState> {
  private destroyGlobalStateListener: DestroyCallback;
  private signInAttemptedFlag = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      loggedInUser: GlobalStateDataStore.state.loggedInUser,
      coreSettings: GlobalStateDataStore.state.coreSettings,
    };
  }

  public static defaultProps: DefaultProps = {
    onSignIn: () => {
      // nothing
    },
  };

  public componentDidMount() {
    this.destroyGlobalStateListener = GlobalStateDataStore.observe(
      (data) => {
        // If we get a global state update, check to see if we signed in between them
        if (
          this.signInAttemptedFlag &&
          !this.state.loggedInUser &&
          data.loggedInUser
        ) {
          // Give all the other subscribers
          this.props.onSignIn && this.props.onSignIn(data);
        }

        this.setState({
          loggedInUser: data.loggedInUser,
          coreSettings: data.coreSettings,
        });

        this.signInAttemptedFlag = false;
      },
      ["loggedInUser", "credentialTypes"]
    );
  }

  public componentWillUnmount() {
    this.destroyGlobalStateListener && this.destroyGlobalStateListener();
  }

  public render() {
    const authed = this.state.loggedInUser !== undefined;

    if (!authed && !this.state.coreSettings) {
      return <SpinnerContainer loading={true} />;
    } else if (authed) {
      return this.props.children || null;
    }

    return (
      <SystemDisabledHandler systems={["Authentication"]}>
        <Auth
          onSignIn={this.props.onSignIn}
          preventModalClose={!this.props.allowModalClose}
          autoOpenModal={this.props.autoOpenModal}
        />
      </SystemDisabledHandler>
    );
  }
}

export const RequiresAuth = withRouter(RequiresAuthInternal);
