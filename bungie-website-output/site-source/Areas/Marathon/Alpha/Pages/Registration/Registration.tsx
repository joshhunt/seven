import { AccountConfirmation } from "@Areas/Marathon/Alpha/Pages/AccountConfirmation/AccountConfirmation";
import { EmailVerification } from "@Areas/Marathon/Alpha/Pages/EmailVerification/EmailVerification";
import { ExistingAccess } from "@Areas/Marathon/Alpha/Pages/ExistingAccess/ExistingAccess";
import { PlatformSelector } from "@Areas/Marathon/Alpha/Pages/PlatformSelector/PlatformSelector";
import { Privacy } from "@Areas/Marathon/Alpha/Pages/Privacy/Privacy";
import { Survey } from "@Areas/Marathon/Alpha/Pages/Survey/Survey";
import { AlphaFlowRouter } from "@Areas/Marathon/Alpha/Router/AlphaFlowRouter";
import { useDataStore } from "@bungie/datastore/DataStoreHooks";
import { Localizer } from "@bungie/localization";
import { GlobalStateDataStore } from "@Global/DataStore/GlobalStateDataStore";
import {
  resetFlow,
  setShowConfirmation,
  setStep,
  setSurveyCompleted,
} from "@Global/Redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector } from "@Global/Redux/store";
import { Img } from "@Helpers";
import { BodyClasses, SpecialBodyClasses } from "@UI/HelmetUtils";
import { BungieHelmet } from "@UI/Routing/BungieHelmet";
import { UserUtils } from "@Utilities/UserUtils";
import { AclHelper } from "@Areas/Marathon/Alpha/Helpers/AclHelper";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import styles from "./Registration.module.scss";

interface RegistrationProps {}

export const Registration: FC<RegistrationProps> = () => {
  const dispatch = useAppDispatch();
  const [hasMarathonAccess, setHasMarathonAccess] = useState(false);
  const [marathonCohort, setMarathonCohort] = useState("");

  const {
    currentStep,
    validAlphaCredential = {},
    showConfirmation,
  } = useAppSelector((state) => state.registration);

  const globalState = useDataStore(GlobalStateDataStore, ["loggedInUser"]);

  // Check if user has Marathon access
  useEffect(() => {
    if (
      UserUtils.isAuthenticated(globalState) &&
      globalState?.loggedInUser?.userAcls?.length > 0
    ) {
      const userHasAccess = AclHelper.hasMarathonAccess(
        globalState.loggedInUser.userAcls
      );
      setHasMarathonAccess(userHasAccess);

      if (userHasAccess) {
        const aclString = AclHelper.getMarathonAclAsCohortMapKey(
          globalState.loggedInUser.userAcls
        );
        setMarathonCohort(aclString);
      }
    }
  }, [globalState?.loggedInUser]);

  const handleStepComplete = (selection: string) => {
    dispatch(setStep(currentStep + 1));
  };

  const showConfirmationStep = () => {
    if (!validAlphaCredential) {
      dispatch(setStep(0));
      dispatch(setShowConfirmation(false));
      return null;
    }

    return <AccountConfirmation />;
  };

  useEffect(() => {
    //if they log out, reset the flow
    if (!UserUtils.isAuthenticated(globalState)) {
      dispatch(resetFlow());
    }
  }, [globalState]);

  const renderCurrentStep = () => {
    // Show existing access screen if user already has Marathon access
    if (hasMarathonAccess) {
      return <ExistingAccess cohort={marathonCohort} />;
    }

    switch (currentStep) {
      case 0:
        return <PlatformSelector />;

      case 1:
        return (
          <EmailVerification
            email={globalState.loggedInUser?.email}
            onContinue={() => {
              handleStepComplete("EMAIL_VERIFIED");
            }}
          />
        );

      case 2:
        return (
          <Privacy
            onComplete={() => {
              handleStepComplete("PRIVACY_ACCEPTED");
            }}
          />
        );

      case 3:
        return (
          <Survey
            onComplete={() => {
              handleStepComplete("SURVEY_COMPLETE");
              dispatch(setSurveyCompleted(true));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AlphaFlowRouter>
      <BungieHelmet
        title={Localizer.Nav.TopNavMarathon}
        image={Img("/marathon/bgs/Press_Kit_White.jpg")}
      >
        <body
          className={classNames(SpecialBodyClasses(BodyClasses.NoSpacer))}
        />
      </BungieHelmet>
      <div className={styles.marathonTerminal}>
        <div className={styles.contentWrapper}>
          <div className={styles.marathonLogo} />
          <div className={styles.terminal}>
            <div className={styles.terminalHeader} />
            <div className={styles.terminalContent}>
              {!showConfirmation ? (
                <>
                  <div className={styles.commandPrompt}>
                    {"registration_protocol ++ alpha_access"}
                  </div>

                  <div className={styles.stepContent}>
                    {renderCurrentStep()}
                  </div>
                </>
              ) : (
                showConfirmationStep()
              )}
            </div>
          </div>
        </div>
      </div>
    </AlphaFlowRouter>
  );
};
