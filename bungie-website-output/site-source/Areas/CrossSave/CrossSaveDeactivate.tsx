import { CrossSaveWarning } from "@Areas/CrossSave/Shared/CrossSaveWarning";
import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { BungieMembershipType } from "@Enum";
import { GoAlert } from "@react-icons/all-files/go/GoAlert";
import { EnumUtils } from "@Utilities/EnumUtils";
import { UserUtils } from "@Utilities/UserUtils";
import * as React from "react";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { Localizer } from "@bungie/localization";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import {
  withGlobalState,
  GlobalStateComponentProps,
} from "@Global/DataStore/GlobalStateDataStore";
import { Platform } from "@Platform";
import { RouteComponentProps } from "react-router";
import { RouteDefs } from "@Routes/RouteDefs";
import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
} from "./Shared/CrossSaveFlowStateDataStore";
import styles from "./CrossSaveDeactivate.module.scss";
import classNames from "classnames";
import { DataStore } from "@bungie/datastore";
import { CrossSaveUtils } from "./Shared/CrossSaveUtils";
import { ConvertToPlatformError } from "@ApiIntermediary";
import { Modal } from "@UI/UIKit/Controls/Modal/Modal";
import { DestinyHeader } from "@UI/Destiny/DestinyHeader";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { CrossSaveVerifyAllAccounts } from "./Shared/CrossSaveVerifyAllAccounts";
import { CrossSaveActivateStepInfo } from "./Activate/Components/CrossSaveActivateStepInfo";
import { Logger } from "@Global/Logger";
import { UrlUtils } from "@Utilities/UrlUtils";

interface ICrossSaveDeactivateProps
  extends RouteComponentProps,
    GlobalStateComponentProps<"loggedInUser"> {}

interface ICrossSaveDeactivateState {
  flowState: ICrossSaveFlowState;
  clearPairingLoading: boolean;
  confirmationInputValue: string;
  confirmationInputFocused: boolean;
  showStadiaConfirmation: boolean;
  /** Since users will have just entered their username once already going through the stadia flow, we need to acknowledge this in the last view */
  showStadiaDeactivateMessage: boolean;
}

/**
 * Cross-Save's Deactivate page
 *  *
 * @param {ICrossSaveDeactivateProps} props
 * @returns
 */
class CrossSaveDeactivate extends React.Component<
  ICrossSaveDeactivateProps,
  ICrossSaveDeactivateState
> {
  private inputRef: HTMLInputElement;
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICrossSaveDeactivateProps) {
    super(props);

    this.state = {
      flowState: CrossSaveFlowStateDataStore.state,
      clearPairingLoading: false,
      confirmationInputValue: "",
      confirmationInputFocused: false,
      showStadiaConfirmation: false,
      showStadiaDeactivateMessage: false,
    };
  }

  private readonly onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const gs = this.props.globalState;
    const displayName = UserUtils.getBungieNameFromBnetGeneralUser(
      gs?.loggedInUser?.user
    )?.bungieGlobalName;

    this.setState({
      confirmationInputValue: e.currentTarget.value.slice(
        0,
        displayName.length
      ),
    });
  };

  public componentDidMount() {
    if (
      EnumUtils.looseEquals(
        this.state.flowState.primaryMembershipType,
        BungieMembershipType.TigerStadia,
        BungieMembershipType
      )
    ) {
      this.setState({
        showStadiaConfirmation: true,
        showStadiaDeactivateMessage: true,
      });
    }

    this.subs.push(
      CrossSaveFlowStateDataStore.observe((flowState) => {
        this.setState({
          flowState,
        });
      })
    );
  }

  public componentWillUnmount() {
    DataStore.destroyAll(...this.subs);
  }

  private readonly acknowledgeStadiaWarning = () => {
    this.setState({
      confirmationInputValue: "",
      showStadiaConfirmation: false,
    });
  };

  private readonly disableCrossSave = () => {
    this.setLoading(true);

    const indexPath = RouteDefs.Areas.CrossSave.resolve("Index").url;

    Platform.CrosssaveService.ClearCrossSavePairing(
      CrossSaveFlowStateDataStore.state.stateIdentifier
    )
      .then((result) => {
        Logger.log(result);

        CrossSaveFlowStateDataStore.loadUserData().then(() => {
          this.setLoading(false);
          this.props.history.push(indexPath);
        });
      })
      .catch(ConvertToPlatformError)
      .catch((e) => Modal.error(e));
  };

  private setLoading(loading: boolean) {
    this.setState({
      clearPairingLoading: loading,
    });
  }

  private renderPrettyConfirmationInput() {
    const gs = this.props.globalState;
    const displayName = UserUtils.getBungieNameFromBnetGeneralUser(
      gs?.loggedInUser?.user
    )?.bungieGlobalName;
    const input = this.state.confirmationInputValue;

    const letters = displayName.split("");
    const inputLetters = input.split("");

    return letters.map((letter, i) => {
      const inputLengthMatch = inputLetters.length > i;
      const inputSameLetter = inputLengthMatch && inputLetters[i] === letter;
      const mismatch = inputLengthMatch && !inputSameLetter;

      const inputLetterClasses = classNames({
        [styles.predicted]: !inputLengthMatch,
        [styles.actual]: inputLengthMatch,
        [styles.mismatch]: mismatch,
      });

      const wrapperClasses = classNames(styles.confirmLetter, {
        [styles.next]:
          this.state.confirmationInputFocused && inputLetters.length === i,
      });

      const letterRendered = inputLengthMatch ? inputLetters[i] : letter;

      return (
        <div key={i} className={wrapperClasses}>
          <div className={inputLetterClasses}>{letterRendered}</div>
        </div>
      );
    });
  }

  private readonly focusInput = () => {
    this.inputRef.focus();
  };

  private readonly onInputFocused = () => {
    this.setState({
      confirmationInputFocused: true,
    });
  };

  private readonly onInputBlur = () => {
    this.setState(
      {
        confirmationInputFocused: false,
      },
      () => this.focusInput()
    );
  };

  public render() {
    const gs = this.props.globalState;

    if (!gs.loggedInUser) {
      const indexPath = RouteDefs.Areas.CrossSave.resolve("Index");

      UrlUtils.PushRedirect(indexPath, this.props);

      return null;
    }

    if (!this.state.flowState.validation) {
      return (
        <SpinnerContainer mode={SpinnerDisplayMode.fullPage} loading={true} />
      );
    }

    const displayName = UserUtils.getBungieNameFromBnetGeneralUser(
      gs?.loggedInUser?.user
    )?.bungieGlobalName;
    const CrossSaveLoc = Localizer.crosssave;

    const confirmationPhraseLabel = Localizer.Format(
      this.state.showStadiaDeactivateMessage
        ? CrossSaveLoc.DeactivateTypeConfirmationWithStadia
        : CrossSaveLoc.DeactivateTypeConfirmation,
      {
        confirmationPhrase: displayName,
      }
    );

    const buttonDisabled = this.state.confirmationInputValue !== displayName;

    const prettyConfirmationClasses = classNames(
      styles.prettyConfirmationInput,
      {
        [styles.focused]: this.state.confirmationInputFocused,
      }
    );

    const frictionWindowLabel = Localizer.Format(
      CrossSaveLoc.CommitLockWarning2,
      {
        crossSaveFrictionWindow: this.state.flowState.validation.settings
          .repairThrottleDurationFragment,
      }
    );

    const canProceed = CrossSaveUtils.allAccountsAuthVerified(
      this.props.globalState.loggedInUser,
      this.state.flowState
    );
    const buttonLabel = this.state.showStadiaConfirmation
      ? CrossSaveLoc.StadiaButtonDescription
      : CrossSaveLoc.DeactivateConfirmationLabel;

    return (
      <Grid>
        <GridCol cols={12}>
          <DestinyHeader
            title={null}
            breadcrumbs={[
              CrossSaveLoc.ActivateCrossSaveHeader,
              CrossSaveLoc.DeactivateCrossSaveHeader,
            ]}
            separator={CrossSaveLoc.Separator}
          />
          <p className={styles.description}>{frictionWindowLabel}</p>
        </GridCol>
        {!canProceed && (
          <GridCol cols={12}>
            <CrossSaveActivateStepInfo
              title={CrossSaveLoc.AuthenticateToDeactivate}
              desc={CrossSaveLoc.DeactivateMajorSubtitle}
            />
            <CrossSaveVerifyAllAccounts
              flowState={this.state.flowState}
              loggedInUser={gs.loggedInUser}
              onAccountLinked={CrossSaveFlowStateDataStore.onAccountLinked}
              isDeactivateFlow={true}
            />
          </GridCol>
        )}
        {canProceed && (
          <GridCol cols={12}>
            {this.state.showStadiaConfirmation ? (
              <StadiaWarning />
            ) : (
              <p>{confirmationPhraseLabel}</p>
            )}
            <input
              ref={(r) => (this.inputRef = r)}
              autoFocus={true}
              className={styles.confirmationInput}
              value={this.state.confirmationInputValue}
              onChange={this.onInputChange}
              onFocus={this.onInputFocused}
              onBlur={this.onInputBlur}
            />

            <div
              className={prettyConfirmationClasses}
              onClick={this.focusInput}
            >
              {this.renderPrettyConfirmationInput()}
            </div>

            <Button
              buttonType={"red"}
              disabled={buttonDisabled}
              onClick={
                this.state.showStadiaConfirmation
                  ? this.acknowledgeStadiaWarning
                  : this.disableCrossSave
              }
              loading={this.state.clearPairingLoading}
              caps={true}
            >
              {buttonLabel}
            </Button>
          </GridCol>
        )}
      </Grid>
    );
  }
}

const StadiaWarning = () => {
  const CrossSaveLoc = Localizer.crosssave;

  return (
    <>
      <div className={styles.narrow}>
        <CrossSaveWarning>
          <div className={styles.warningTitleSection}>
            <GoAlert />
            <h2 className={styles.warning}>{CrossSaveLoc.DeactivateTitle}</h2>
          </div>
          <p>{CrossSaveLoc.StadiaDeactivateDetails}</p>
        </CrossSaveWarning>
      </div>
      <p>{CrossSaveLoc.StadiaTypeUsername}</p>
    </>
  );
};

export default withGlobalState(CrossSaveDeactivate, ["loggedInUser"]);
