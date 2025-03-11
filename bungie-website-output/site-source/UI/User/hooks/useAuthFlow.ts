import {
  goBack,
  goToStep,
  resetFlow,
} from "@Global/Redux/slices/authenticationSlice";
import { RootState } from "@Global/Redux/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthStep, stateConfig } from "../scripts/AuthStateMachine";

export const useAuthFlow = () => {
  const dispatch = useDispatch();
  const flow = useSelector((state: RootState) => state.authentication.flow);
  const navigation = useSelector(
    (state: RootState) => state.authentication.ui.navigation
  );

  const currentConfig = stateConfig[flow.currentStep];

  const navigateToStep = useCallback(
    (step: AuthStep) => {
      if (flow.nextSteps.includes(step)) {
        dispatch(goToStep(step));
      } else {
        console.error(`Invalid navigation: ${step} is not in nextSteps`);
      }
    },
    [flow.nextSteps, dispatch]
  );

  const navigateBack = useCallback(() => {
    if (navigation.canGoBack) {
      dispatch(goBack());
    }
  }, [navigation.canGoBack, dispatch]);

  const reset = useCallback(() => {
    dispatch(resetFlow());
  }, [dispatch]);

  return {
    currentStep: flow.currentStep,
    nextSteps: flow.nextSteps,
    flowMode: flow.mode,
    component: currentConfig.component,
    canGoBack: navigation.canGoBack,
    nextEnabled: navigation.nextEnabled,
    navigateToStep,
    navigateBack,
    reset,
  };
};
