import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
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
import React, { useState } from "react";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { CrossSaveAccountLink } from "./Activate/CrossSaveAccountLink";
import { CrossSaveAcknowledge } from "./Activate/CrossSaveAcknowledge";
import { CrossSaveCharacters } from "./Activate/CrossSaveCharacters";
import CrossSaveCommit from "./Activate/CrossSaveCommit";
import styles from "./CrossSaveActivate.module.scss";
import { CrossSaveIndexDefinitions } from "./CrossSaveIndexDefinitions";
import { CrossSaveFlowStateDataStore } from "./Shared/CrossSaveFlowStateDataStore";
import { CrossSaveUtils } from "./Shared/CrossSaveUtils";

export type CrossSaveActivateSteps =
  | "Acknowledge"
  | "Link"
  | "Pair"
  | "Characters"
  | "Commit";

export interface ICrossSaveStepDefinition {
  step: CrossSaveActivateSteps;
  label: string;
}

export interface ICrossSaveActivateParams {
  step?: CrossSaveActivateSteps;
}

const eq = (string1: string, string2: string) =>
  StringUtils.equals(string1, string2, StringCompareOptions.IgnoreCase);

/**
 * Cross-Save's activation page
 *  *
 * @returns
 */
const CrossSaveActivate = () => {
  const globalState = useDataStore(GlobalStateDataStore, [
    "loggedInUser",
    "responsive",
    "loggedInUserClans",
  ]);
  const params = useParams<ICrossSaveActivateParams>();
  const flowState = useDataStore(CrossSaveFlowStateDataStore);
  const stepDefs = CrossSaveUtils.getActivateStepDefsFromFlowState(flowState);

  const renderStepsBreadcrumb = () => {
    const activeStepDef = stepDefs.find((stepDef) =>
      eq(stepDef.step, params.step)
    );
    const activeIndex = stepDefs.indexOf(activeStepDef);

    return stepDefs.map((stepDef, i) => {
      const active = i === activeIndex;
      const classes = classNames(styles.step, {
        [styles.activeStep]: active,
        [styles.prevStep]: i < activeIndex,
      });

      return (
        <div className={classes} key={i}>
          <span>{i + 1}</span>
          <span>{stepDef.label}</span>
        </div>
      );
    });
  };

  const redirectForBadFlowState = () => {
    let redirectPath: string = null;
    const currentStep = params.step;
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
      globalState.loggedInUser,
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
      earliestStep?.step !== currentStep;
    const invalidReview =
      flowState.primaryMembershipType === null &&
      currentStep === "Commit" &&
      earliestStep;
    const alreadyActivated = flowState.isActive;
    const requiresAuth =
      stepIndex > linkStepIndex && !flowState.isActive && !authComplete;
    const noStepSpecified = params.step === undefined;

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
  };

  const activateAction = RouteDefs.Areas.CrossSave.getAction("Activate");
  const crossSaveLoc = Localizer.Crosssave;

  const acknowledgeStepPath = activateAction.resolve<ICrossSaveActivateParams>({
    step: "Acknowledge",
  }).url;
  const linkStepPath = activateAction.resolve<ICrossSaveActivateParams>({
    step: "Link",
  }).url;
  const charactersStepPath = activateAction.resolve<ICrossSaveActivateParams>({
    step: "Characters",
  }).url;
  const reviewStepPath = activateAction.resolve<ICrossSaveActivateParams>({
    step: "Commit",
  }).url;

  const stepsRendered = (
    <div className={styles.stepWrapper}>{renderStepsBreadcrumb()}</div>
  );

  if (!flowState.validation && UserUtils.isAuthenticated(globalState)) {
    return (
      <SpinnerContainer
        loading={true}
        mode={SpinnerDisplayMode.fullPage}
        loadingLabel={Localizer.Crosssave.LoadingCrossSaveData}
      />
    );
  }

  const badFlowStateRedirect = redirectForBadFlowState();
  if (badFlowStateRedirect) {
    return badFlowStateRedirect;
  }

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
              {!flowState.isActive && (
                <DestinyHeader
                  separator="//"
                  breadcrumbs={[
                    crossSaveLoc.ActivateCrossSaveHeader,
                    Localizer.Crosssave.ActivateLower,
                  ]}
                  textTransform={"lowercase"}
                  title={params.step !== "Acknowledge" ? stepsRendered : null}
                />
              )}
              <div>
                <RequiresAuth>
                  <Switch location={location}>
                    <Route path={acknowledgeStepPath}>
                      <CrossSaveAcknowledge />
                    </Route>
                    <Route path={linkStepPath}>
                      <CrossSaveAccountLink
                        deactivating={false}
                        onAccountLinked={
                          CrossSaveFlowStateDataStore.onAccountLinked
                        }
                      />
                    </Route>
                    <Route path={charactersStepPath}>
                      <CrossSaveCharacters />
                    </Route>
                    <Route path={reviewStepPath}>
                      <CrossSaveCommit
                        onAccountLinked={
                          CrossSaveFlowStateDataStore.onAccountLinked
                        }
                      />
                    </Route>
                  </Switch>
                </RequiresAuth>
              </div>
            </GridCol>
          </Grid>
        )}
      />
    </React.Fragment>
  );
};

export default CrossSaveActivate;
