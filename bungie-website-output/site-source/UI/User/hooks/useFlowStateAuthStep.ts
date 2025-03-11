import { useAppSelector } from "@Global/Redux/store";
import { GetAuthStepFromCookie } from "@UI/User/scripts/GetAuthStepFromCookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FlowState } from "../types/authTypes";
import {
  setAuthState,
  goToStep,
  authenticationSlice,
} from "@Global/Redux/slices/authenticationSlice";

export const useFlowStateAuthStep = () => {
  const dispatch = useDispatch();

  const { flow } = useAppSelector((state) => state.authentication);

  useEffect(() => {
    const state = GetAuthStepFromCookie();

    // There is a state cookie and we're not already at that view
    if (
      state &&
      state.currentStep !== flow?.currentStep &&
      state.mode !== flow?.mode
    ) {
      dispatch(setAuthState({ flowMode: flow?.currentStep }));
      dispatch(goToStep(flow?.currentStep));
    }
  }, [dispatch]);
};

export default useFlowStateAuthStep;
