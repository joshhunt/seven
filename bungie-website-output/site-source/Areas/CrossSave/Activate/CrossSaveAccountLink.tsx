import * as React from "react";
import { Button } from "@UI/UIKit/Controls/Button/Button";
import { Localizer } from "@bungie/localization";
import styles from "../CrossSaveActivate.module.scss";
import { CrossSaveUtils } from "../Shared/CrossSaveUtils";
import { Icon } from "@UI/UIKit/Controls/Icon";
import { CrossSaveStaggerPose } from "../Shared/CrossSaveStaggerPose";
import { CrossSaveActivateStepInfo } from "./Components/CrossSaveActivateStepInfo";
import { ICrossSaveFlowState } from "../Shared/CrossSaveFlowStateDataStore";
import { PlatformError } from "@CustomErrors";
import { CrossSaveVerifyAllAccounts } from "../Shared/CrossSaveVerifyAllAccounts";
import { GlobalStateComponentProps } from "@Global/DataStore/GlobalStateDataStore";

interface ICrossSaveAccountLinkProps
  extends GlobalStateComponentProps<"loggedInUser" | "responsive"> {
  deactivating: boolean;
  flowState: ICrossSaveFlowState;
  onAccountLinked: (isVerify: boolean) => Promise<any | PlatformError>;
  excludeUnlinked?: boolean;
}

interface ICrossSaveAccountLinkState {}

/**
 * The steps to pair your accounts in Cross-Save
 *  *
 * @param {ICrossSaveAccountLinkProps} props
 * @returns
 */
export class CrossSaveAccountLink extends React.Component<
  ICrossSaveAccountLinkProps,
  ICrossSaveAccountLinkState
> {
  constructor(props: ICrossSaveAccountLinkProps) {
    super(props);

    this.state = {
      hoveredAccounts: [],
      selectedAccounts: [],
    };
  }

  public render() {
    const flowState = this.props.flowState;
    const loggedInUser = this.props.globalState.loggedInUser;

    const nextPrevSteps = CrossSaveUtils.getNextPrevStepPaths(
      flowState,
      "Link"
    );

    const pairableMembershipTypes = CrossSaveUtils.getPairableMembershipTypes(
      flowState
    );
    const canProceed =
      CrossSaveUtils.allAccountsAuthVerified(loggedInUser, flowState) &&
      pairableMembershipTypes.length > 1 &&
      loggedInUser.crossSaveCredentialTypes.length > 1;

    return (
      <div className={styles.accountPair}>
        <CrossSaveStaggerPose index={0}>
          <CrossSaveActivateStepInfo
            title={Localizer.Crosssave.LinkStepTitle}
            desc={Localizer.Crosssave.LinkStepDescription}
          />
        </CrossSaveStaggerPose>

        <CrossSaveStaggerPose index={1}>
          <CrossSaveVerifyAllAccounts
            flowState={flowState}
            loggedInUser={this.props.globalState.loggedInUser}
            onAccountLinked={this.props.onAccountLinked}
          />
        </CrossSaveStaggerPose>

        {!this.props.deactivating && (
          <CrossSaveStaggerPose index={2}>
            {!canProceed && (
              <div className={styles.buttonDisabledDesc}>
                {Localizer.Crosssave.ButtonDisabledDescAuthenticate}
              </div>
            )}
            <div className={styles.buttonContainer}>
              <Button
                className={styles.buttonNext}
                url={nextPrevSteps.nextPath}
                buttonType={"gold"}
                disabled={!canProceed}
                caps={true}
              >
                {Localizer.Crosssave.CharactersButtonLabel}{" "}
                <Icon iconType={"material"} iconName={`arrow_forward`} />
              </Button>
            </div>
          </CrossSaveStaggerPose>
        )}
      </div>
    );
  }
}
