import { DestroyCallback } from "@bungie/datastore/Broadcaster";
import { DataStore } from "@bungie/datastore";
import {
  GlobalStateComponentProps,
  withGlobalState,
} from "@Global/DataStore/GlobalStateDataStore";
import { Localizer } from "@bungie/localization";
import { Logger } from "@Global/Logger";
import { RouteDefs } from "@Routes/RouteDefs";
import { DestinyHeader } from "@UI/Destiny/DestinyHeader";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import {
  SpinnerContainer,
  SpinnerDisplayMode,
} from "@UI/UIKit/Controls/Spinner";
import { RequiresAuth } from "@UI/User/RequiresAuth";
import { Grid, GridCol } from "@UIKit/Layout/Grid/Grid";
import { StringCompareOptions, StringUtils } from "@Utilities/StringUtils";
import { UrlUtils } from "@Utilities/UrlUtils";
import { UserUtils } from "@Utilities/UserUtils";
import classNames from "classnames";
import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { CrossSaveAccountLink } from "./Activate/CrossSaveAccountLink";
import { CrossSaveAcknowledge } from "./Activate/CrossSaveAcknowledge";
import { CrossSaveCharacters } from "./Activate/CrossSaveCharacters";
import CrossSaveCommit from "./Activate/CrossSaveCommit";
import styles from "./CrossSaveActivate.module.scss";
import { CrossSaveIndexDefinitions } from "./CrossSaveIndexDefinitions";
import {
  CrossSaveFlowStateDataStore,
  ICrossSaveFlowState,
} from "./Shared/CrossSaveFlowStateDataStore";
import {
  PoseDirection,
  PoseDirectionContext,
} from "./Shared/CrossSaveStaggerPose";
import { CrossSaveUtils } from "./Shared/CrossSaveUtils";

export type CrossSaveActivateSteps =
  | "Acknowledge"
  | "Link"
  | "Pair"
  | "Characters"
  | "Commit";
type CrossSaveActivateExitPoses = "exitLeft" | "exitRight";

export interface ICrossSaveStepDefinition {
  step: CrossSaveActivateSteps;
  label: string;
}

export interface ICrossSaveActivateParams {
  step?: CrossSaveActivateSteps;
}

interface ICrossSaveActivateState {
  exitPose: CrossSaveActivateExitPoses;
  preEnterPose: CrossSaveActivateExitPoses;
  lastStep: CrossSaveActivateSteps;
  flowState: ICrossSaveFlowState;
  poseDirection: PoseDirection;
}

interface ICrossSaveActivateProps
  extends RouteComponentProps<ICrossSaveActivateParams>,
    GlobalStateComponentProps<
      "loggedInUser" | "responsive" | "loggedInUserClans"
    > {}

const RouteContainer = posed.div({
  enter: {
    x: 0,
    opacity: 1,
    delay: 100,
    transition: {
      ease: "easeInOut",
      duration: 0,
    },
  },
  exitLeft: {
    x: -75,
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 400,
    },
  },
  exitRight: {
    x: 75,
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 400,
    },
  },
});

const eq = (string1: string, string2: string) =>
  StringUtils.equals(string1, string2, StringCompareOptions.IgnoreCase);

/**
 * Cross-Save's activation page
 *  *
 * @param {ICrossSaveActivateProps} props
 * @returns
 */
class CrossSaveActivate extends React.Component<
  ICrossSaveActivateProps,
  ICrossSaveActivateState
> {
  private readonly subs: DestroyCallback[] = [];

  constructor(props: ICrossSaveActivateProps) {
    super(props);

    this.state = {
      lastStep: props.match.params.step,
      exitPose: "exitRight",
      preEnterPose: "exitLeft",
      poseDirection: "left",
      flowState: CrossSaveFlowStateDataStore.state,
    };
  }

  public componentDidMount() {
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
    window.onbeforeunload = null;
  }

  // Since we conditionally show some of the steps based on the flow state,
  public static getDerivedStateFromProps(
    props: ICrossSaveActivateProps,
    state: ICrossSaveActivateState
  ): ICrossSaveActivateState {
    const currentStep = state.lastStep;
    const nextStep = props.match.params.step;

    const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(
      state.flowState
    );

    const currentStepDef = stepDefs.find((stepDef) =>
      eq(stepDef.step, currentStep)
    );
    const nextStepDef = stepDefs.find((stepDef) => eq(stepDef.step, nextStep));
    const currentStepIndex = stepDefs.indexOf(currentStepDef);
    const nextStepIndex = stepDefs.indexOf(nextStepDef);

    // Compare the next step and previous step to determine the direction to animate
    let poseDirection: PoseDirection = "left";
    let exitPose: CrossSaveActivateExitPoses = "exitLeft";
    let preEnterPose: CrossSaveActivateExitPoses = "exitRight";
    if (nextStepIndex < currentStepIndex) {
      exitPose = "exitRight";
      preEnterPose = "exitLeft";
      poseDirection = "right";
    }

    // We don't animate between these two particular steps
    if (
      (currentStep === "Pair" && nextStep === "Characters") ||
      (currentStep === "Characters" && nextStep === "Pair")
    ) {
      exitPose = undefined;
      preEnterPose = undefined;
    }

    return {
      ...state,
      exitPose,
      preEnterPose,
      poseDirection,
      lastStep: props.match.params.step,
    };
  }

  private renderSteps() {
    const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(
      this.state.flowState
    );

    const activeStepDef = stepDefs.find((stepDef) =>
      eq(stepDef.step, this.props?.match?.params?.step)
    );
    const activeIndex = stepDefs.indexOf(activeStepDef);

    return stepDefs.map((stepDef, i) => {
      const active = i === activeIndex;
      const classes = classNames(styles.step, {
        [styles.activeStep]: active,
        [styles.prevStep]: i < activeIndex,
        [styles.nextStep]: i > activeIndex,
      });

      return (
        <div className={classes} key={i}>
          <span>{i + 1}</span>
          <span>{stepDef.label}</span>
        </div>
      );
    });
  }

  private redirectForBadFlowState(flowState: ICrossSaveFlowState) {
    let redirectPath: string = null;

    const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(
      this.state.flowState
    );
    const currentStep = this.props.match.params.step;
    const stepIndex = stepDefs.findIndex((a) => a.step === currentStep);
    const pairStepIndex = stepDefs.findIndex((a) => a.step === "Pair");
    const linkStepIndex = stepDefs.findIndex((a) => a.step === "Link");
    const earliestStepIndex =
      pairStepIndex !== -1 ? pairStepIndex : linkStepIndex;
    const earliestStep = stepDefs[earliestStepIndex];
    const activate = RouteDefs.Areas.CrossSave.getAction("Activate");
    const recap = RouteDefs.Areas.CrossSave.getAction("Recap");
    const nextPrevSteps = CrossSaveUtils.getNextPrevStepPaths(
      flowState,
      currentStep
    );
    const authComplete = CrossSaveUtils.allAccountsAuthVerified(
      this.props.globalState.loggedInUser,
      flowState
    );

    const mustAcknowledge =
      !flowState.acknowledged && currentStep !== "Acknowledge";
    const invalidStep =
      !nextPrevSteps &&
      currentStep !== "Acknowledge" &&
      currentStep !== "Commit";
    const skippedChoices =
      flowState.includedMembershipTypes.length === 0 &&
      stepIndex > earliestStepIndex &&
      earliestStep &&
      earliestStep.step !== currentStep;
    const invalidReview =
      flowState.primaryMembershipType === null &&
      currentStep === "Commit" &&
      earliestStep;
    const alreadyActivated = flowState.isActive;
    const requiresAuth =
      stepIndex > linkStepIndex && !flowState.isActive && !authComplete;
    const noStepSpecified =
      this.props.match.params.step === undefined && !redirectPath;

    // If you didn't acknowledge, you can't go further
    if (mustAcknowledge) {
      Logger.log(
        "Acknowledge requirements not met; redirecting to acknowledgement step."
      );
      redirectPath = UrlUtils.resolveUrlFromMultiLink(
        activate.resolve({ step: "Acknowledge" })
      );
    }

    // If you're on an invalid step, start over
    if (invalidStep) {
      Logger.log("Invalid step, redirecting to index.");
      redirectPath = UrlUtils.resolveUrlFromMultiLink(
        RouteDefs.Areas.CrossSave.resolve("Index")
      );
    }

    // If you start at a step that assumes you have made choices, but we have no data for those choices,
    // force you to start over
    if (skippedChoices || invalidReview || requiresAuth) {
      // Redirect to the first valid step, if you aren't already there.
      Logger.log(
        "The step you're on requires data that we're not finding; redirecting to the first valid step."
      );
      redirectPath = UrlUtils.resolveUrlFromMultiLink(
        activate.resolve({ step: earliestStep.step })
      );
    }

    // Can't activate if you already activated, but you can review
    if (alreadyActivated) {
      Logger.log(
        "You can't activate if you already did; redirecting to Review."
      );

      redirectPath = UrlUtils.resolveUrlFromMultiLink(recap.resolve());
    }

    if (noStepSpecified) {
      redirectPath = UrlUtils.resolveUrlFromMultiLink(
        activate.resolve<ICrossSaveActivateParams>({ step: "Acknowledge" })
      );
    }

    return redirectPath ? <Redirect to={redirectPath} /> : undefined;
  }

  public render() {
    const flowState = this.state.flowState;

    const activateAction = RouteDefs.Areas.CrossSave.getAction("Activate");
    const crossSaveLoc = Localizer.Crosssave;
    const currentStep = this.props.match.params.step;

    const acknowledgeStep = activateAction.resolve<ICrossSaveActivateParams>({
      step: "Acknowledge",
    }).url;
    const linkStep = activateAction.resolve<ICrossSaveActivateParams>({
      step: "Link",
    }).url;
    const charactersStep = activateAction.resolve<ICrossSaveActivateParams>({
      step: "Characters",
    }).url;
    const reviewStep = activateAction.resolve<ICrossSaveActivateParams>({
      step: "Commit",
    }).url;

    const stepsRendered = (
      <div className={styles.stepWrapper}>{this.renderSteps()}</div>
    );

    if (
      !this.state.flowState.validation &&
      UserUtils.isAuthenticated(this.props.globalState)
    ) {
      return (
        <SpinnerContainer
          loading={true}
          mode={SpinnerDisplayMode.fullPage}
          loadingLabel={Localizer.Crosssave.LoadingCrossSaveData}
        />
      );
    }

    const badFlowStateRedirect = this.redirectForBadFlowState(
      this.state.flowState
    );
    if (badFlowStateRedirect) {
      return badFlowStateRedirect;
    }

    window.onbeforeunload = () => Localizer.Crosssave.BeforeLeaveMessage;

    // Not 100% sure why this location thing is required, but if it isn't there, Posed won't work
    return (
      <React.Fragment>
        <BungieHelmet
          title={Localizer.Crosssave.ActivateCrossSaveTitle}
          image={CrossSaveIndexDefinitions.MetaImage}
        />
        <Route
          render={({ location }) => (
            <Grid className={styles.wrapperGrid}>
              <GridCol cols={12}>
                {!this.state.flowState.isActive && (
                  <DestinyHeader
                    separator="//"
                    breadcrumbs={[
                      crossSaveLoc.ActivateCrossSaveHeader,
                      Localizer.Crosssave.ActivateLower,
                    ]}
                    textTransform={"lowercase"}
                    title={currentStep !== "Acknowledge" ? stepsRendered : null}
                  />
                )}
                <div>
                  <RequiresAuth>
                    <PoseDirectionContext.Provider
                      value={this.state.poseDirection}
                    >
                      <PoseGroup
                        exitPose={this.state.exitPose}
                        preEnterPose={this.state.preEnterPose}
                        animateOnMount={false}
                      >
                        <RouteContainer key={this.props.match.params.step}>
                          <Switch location={location}>
                            <Route path={acknowledgeStep}>
                              <CrossSaveAcknowledge
                                flowState={this.state.flowState}
                              />
                            </Route>
                            <Route path={linkStep}>
                              <CrossSaveAccountLink
                                deactivating={false}
                                globalState={this.props.globalState}
                                flowState={this.state.flowState}
                                onAccountLinked={
                                  CrossSaveFlowStateDataStore.onAccountLinked
                                }
                              />
                            </Route>
                            <Route path={charactersStep}>
                              <CrossSaveCharacters
                                flowState={this.state.flowState}
                              />
                            </Route>
                            <Route path={reviewStep}>
                              <CrossSaveCommit
                                onAccountLinked={
                                  CrossSaveFlowStateDataStore.onAccountLinked
                                }
                                globalState={this.props.globalState}
                                flowState={this.state.flowState}
                              />
                            </Route>
                          </Switch>
                        </RouteContainer>
                      </PoseGroup>
                    </PoseDirectionContext.Provider>
                  </RequiresAuth>
                </div>
              </GridCol>
            </Grid>
          )}
        />
      </React.Fragment>
    );
  }
}

export default withGlobalState(CrossSaveActivate, [
  "loggedInUser",
  "responsive",
  "loggedInUserClans",
]);
